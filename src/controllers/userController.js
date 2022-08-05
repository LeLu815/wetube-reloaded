import User from "../models/Users";
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
export const edit = (req, res) => {
    return res.send("Edit User");
}
export const remove = (req, res) => {
    return res.send("Remove User");
}
export const getLogin = (req, res) => {
    return res.render("login", {pageTitle:"Login"});
}
export const postLogin = async (req, res) => {
    const {username, password} = req.body;
    const pageTitle = "Login"
    // 데이터 안의 객체
    const user = await User.findOne({username, socialOnly:false});
    if (!user) {
        return res
        .status(400)
        .render("login",{
            pageTitle, 
            errorMessage:"An account with this username doesn't exists."
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res
        .status(400)
        .render("login",{
            pageTitle, 
            errorMessage:"Wrong password."
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    res.redirect("/");
}

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
}
export const see = (req, res) => {
    return res.send("See User");
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
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({email : emailObj.email});
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