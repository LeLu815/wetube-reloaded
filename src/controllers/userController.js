import User from "../models/Users";
import Video from "../models/Video";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) => {
    return res.render("join", {pageTitle:"Join"});
}
export const postJoin = async (req, res) => {

    const {name, username, email, password, password2,location} = req.body;
    const pageTitle = "Join"
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage:"Password Confirmation does not match",
        });
    }
    // 여기를 참고할 것!
    const usernameExists = await User.exists({$or:[{username:req.body.username}, {email:req.body.email}]});
    if (usernameExists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage:"This username/password is already taken",
        });
    }

    try {
        await User.create({
            name, 
            username, 
            email, 
            password, 
            location,
        })
        return res.redirect("/login");
    } catch(error) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: error._message,
        });
    }
}
export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle : "Edit Profile"});
}

// avatarUrl 이 없는 경우 비구조할당의 범위 밖이므로 오류없이 undefined가 할당된다.
export const postEdit = async (req, res) => {
    const {
      session: {
        user: { _id, avatarUrl },
      },
      body: { name, email, username, location },
      file,
    } = req;
    

    if(username !== req.session.user.username){
        const existingUsername = await User.exists({ username });
        if(existingUsername){
            return res.status(400).render("edit-profile", { 
                errorMessage: "This username is already taken."});
        };
    };
    if(email !== req.session.user.email){
        const existingEmail = await User.exists({ email });
        if(existingEmail){
        return res.status(400).render("edit-profile", { 
            errorMessage: "This username is already taken."});
        };
    };
    console.log(file);
    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.location : avatarUrl,
        name,
        email,
        username,
        location,
    },
    {new: true});

    req.session.user = updatedUser;
    return res.redirect("/users/edit");
}
export const getLogin = (req, res) => {
    res.render("login", {pageTitle: "Login"});
 
};
export const postLogin = async(req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({ username, socialOnly: false });
    const pageTitle = "Login";
    // check if account exists
    if(!user){
        return res.status(400).render("login", {
            pageTitle, 
            errorMessage: "An account with this username doesn't exists"});
    }
    // check if password correct
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "The password is not correct!"});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    //this two req.session initialize the session
    res.redirect("/");
};
export const logout = (req, res) => {
    req.session.destroy();
    req.flash("info", "Bye Bye");
    return res.redirect('/');
}
export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
          path: "owner",
          model: "User",
        },
      });
    console.log(user);
    if (!user) {
        return res.status(404).render("404", {pageTitle : "User not found."});
    }
    return res.render("users/profile", {pageTitle:`${user.name}`, user});
}
export const startGithubLogin = (req, res) => {
    const baseUrl ="https://github.com/login/oauth/authorize";
    const config = {
        client_id : process.env.GH_CLIENT,
        allow_signup : false,
        scope : "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl =`${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}
export const finishGithubLogin = async (req, res) => {

    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id : process.env.GH_CLIENT,
        client_secret : process.env.GH_SECRET,
        code : req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (await fetch(finalUrl, {
        method:"POST",
        headers:{
            Accept: "application/json",
        }
    })).json();
    if ("access_token" in tokenRequest) {
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (await fetch(`${apiUrl}/user`, {
            headers:{
                Authorization: `token ${access_token}`
            }
        })).json();
        const emailData = await (await fetch(`${apiUrl}/user/emails` ,{
            headers:{
                Authorization: `token ${access_token}`
            }
        })).json();
        console.log('1 :',emailData);
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if (!emailObj) {
            return res.redirect("/login");
        }
        // 여기 에러가 있데
        console.log('2 :', emailObj.email);
        let user = await User.findOne({email : emailObj.email});
        // 여기서 이메일을 바꾸면 에러가 나는구나!
        if (!user) {
            user = await User.create({
                name:userData.name, 
                username:userData.login, 
                email:emailObj.email, 
                password:"", 
                location:userData.location,
                socialOnly:true,
                avatarUrl:userData.avatar_url,
            });   
        } 
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect('/');
    } else {
        return res.redirect("/login");
    }
}
export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        req.flash("error", "Can't change password.");
        return res.redirect("/");
    }
    return res.render("users/change-password", { pageTitle: "Change Password" });
}
export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: {_id},
        },
        body: {oldPassword, newPassword, newPasswordConfirmation},
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
        return res.status(400).render("users/change-password", { 
            pageTitle: "Change Password", 
            errorMessage: "The current password is incorrect" });
    }
    if(newPassword !== newPasswordConfirmation) {
        return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: "The password does not match the confirmation" });
    }
    user.password = newPassword;
    // console.log('Old password' ,user.password);
    await user.save();
    req.flash("info", "Password updated");
    // console.log('New password', user.password);

    return res.redirect("/users/logout");
}

