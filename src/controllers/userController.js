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
    return res.render("edit-profile", {pageTitle : "Edit Profile", isOverlapEmail : false, isOverlapUsername : false});
}
export const postEdit = async (req, res) => {
    const {
        session : {user: {_id }},
        body: { name, email, username, location,}
    } = req;
    // console.log(req.session.user)
    /* 
    세션과 백엔드는 우선 같다고 가정한다
    세션으로 찾기가 어려우니까 세션에서 받은 아이디를 통해서 백엔드에서 값을 가져와야 한다. 
    1. 세션의 값과 바디의 값을 비교해서 저장할지 안할지 결정한다
    2. 저장결정이 나면 유니크한 값들만 중복되는지 확인한다
    3. 중복이 되지 않으면 저장을 완료한다.
    */
 
    // body 에서 받아온 값들을 리스트로 가공
    const beforeEditBody =  Object.entries(req.body);
    // 변경인지 아닌지. 변경이면 1, 아니면 0
    console.log('beforeEditBody :', beforeEditBody)
    console.log(req.session.user)
    const whichOne = [];
    const checkFunc = function (wantToCheck) {
        for (let i of wantToCheck){
            const propertyWantToGet = i[0]
            console.log(i,propertyWantToGet,req.session.user[propertyWantToGet])
            if (i[1] !== req.session.user[propertyWantToGet]){
                whichOne.push([1, i[1]]);
            }
            else {
                whichOne.push([0, i[1]]);
            }
        }
    }
    checkFunc(beforeEditBody);
    console.log('whichOne', whichOne);
    const checkList = whichOne.map((i)=>i.indexOf(1));
    console.log('checkList', checkList)
    if (!checkList.includes(0)) {
        // 수정할게 없음
        console.log("수정할게 없어요");
        return res.redirect("/users/edit");
    }
    // unique 인 것들만 중복을 확인하면 됨 email, username
    const overlapEmail = await User.exists({email:req.body.email});
    const overlapUsername = await User.exists({username:req.body.username});

    // if (checkList[1] === 0 checkList[2] === 0)    
    switch (-checkList[1] + -checkList[2]) {
        case 0:
            console.log("유니크가 없어요");
            const updatedUser =  await User.findByIdAndUpdate(_id, {
                name, email, username, location,
            }, {new:true});
            req.session.user = updatedUser;
            break;
        case 1:
            if (checkList[1] === 0) {
                if (!overlapEmail) {
                    const updatedUser =  await User.findByIdAndUpdate(_id, {
                        name, email, username, location,
                    }, {new:true});
                    req.session.user = updatedUser;
                    console.log("이메일은 유니크가 아니네요?");
                    return res.render("edit-profile", {pageTitle : "Edit Profile", isOverlapEmail : true, isOverlapUsername : false});
                }
                console.log("이메일은 유니크가 맞아요?");
                return res.redirect("/users/edit", {isOverlapEmail : true});
            } else {
                if (!overlapUsername) {
                    const updatedUser =  await User.findByIdAndUpdate(_id, {
                        name, email, username, location,
                    }, {new:true});
                    req.session.user = updatedUser;
                    console.log("유네네임 유니크가 아니네요?");
                    return res.redirect("/users/edit");
                }
                console.log("유네네임 유니크가 맞아요?");
                return res.render("edit-profile", {pageTitle : "Edit Profile", isOverlapEmail : false, isOverlapUsername : true});
            }
        case 2:
            if (!overlapEmail && !overlapUsername) {
                const updatedUser =  await User.findByIdAndUpdate(_id, {
                    name, email, username, location,
                }, {new:true});
                req.session.user = updatedUser;
                console.log("둘다 유니크 아니에요");
                return res.redirect("/users/edit");
            }
            console.log("둘다 유니크 맞아요!!");
            return res.render("edit-profile", {pageTitle : "Edit Profile", isOverlapEmail : true, isOverlapUsername : true});
        default:
            break;
      }
      console.log("낫띵");
      return res.redirect("/users/edit");
    // return res.redirect("/users/edit");
    // const updatedUser =  await User.findByIdAndUpdate(_id, {
    //     name, email, username, location,
    // }, {new:true});
    // req.session.user = updatedUser;
    // // req.session.user = {
    // //     ...req.session.user,
    // //     name, email, username, location,
    // // }; // 이거는 직접 업데이트 해주는 방식임

    // return res.redirect("/users/edit");
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