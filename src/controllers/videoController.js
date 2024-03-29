import Video from "../models/Video"
import Comment from "../models/Comment"
import Users from "../models/Users"
import { async } from "regenerator-runtime";

// const handleSearch = (error, videos) => {}
// Video.find({}, (error, videos) => {});
/* 
async, await 가 좋은 이유는 콜백함수가 코드 중간에 삽입되어 있으면
해당 코드를 실행하고 결과를 무시한 채 다음 코드로 넘어가지만
await 가 있는 경우에는 기다렸다가 다음 코드로 넘어간다.
*/

export const home = async(req, res) => { 
        const videos = await Video.find({}).sort({createdAt:"desc"})
        .populate("owner");
        return res.render("home", {pageTitle : "Home", videos});
}
export const watch = async (req, res) => {
    const {id} = req.params;
    // video 안의 owner가 원래 문자열 id 였다면 rel 값이 설정되어 있는 곳에서 찾아서 실제 해당 객체로 바꿔준다.
    const video = await Video.findById(id).populate("owner").populate('comments');
    // console.log(video);
    if (!video){
        return res.render("404", {pageTitle : "Video not found."});
    }
    return res.render("watch", {pageTitle : video.title, video}); 
};

export const getEdit = async (req, res) => {
    // console.log(req.params);
    const {id} = req.params;
    const video = await Video.findById(id);
    const {user : {_id}} = req.session
    if (!video){
        return res.render("404", {pageTitle : "Video not found."});
    }
    if (String(video.owner) !== String(_id)) {
        req.flash("error", "Not authorized");
        return res.status(403).redirect("/");
    }
    return res.render("edit", {pageTitle : `Edit: ${video.title}`, video});
}
// body : form 안에 있는 value의 js representation(표현)
export const postEdit = async (req, res) => {
    const {id} = req.params;
    const {title, description, hashtags} = req.body;
    const video = await Video.exists({ _id:id });
    const {user : {_id}} = req.session
    if (!video){
        return res.status(404).render("404", {pageTitle : "Video not found."});
    }
    if (String(video.owner) !== String(_id)) {
        req.flash("error", "You are not the owner of the video.");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags : Video.formatHashtags(hashtags),
    });
    req.flash('success', 'Changes saved');
    return res.redirect(`/videos/${id}`);; 
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle : "Upload Video"})
}
export const postUpload = async (req, res) => {
    const {user : {_id}} = req.session;
    const {title, description, hashtags} = req.body;

    const { video, thumb } = req.files;
    try {
        const newVideo = await Video.create({
            title,
            description,
            hashtags : Video.formatHashtags(hashtags),
            fileUrl : video[0].location,
            thumbUrl : thumb[0].location,
            // thumbUrl : thumb[0].destination + thumb[0].filename,
            // thumbUrl : thumb[0].path,
            // thumb[0].path.replace(/[\\]/g, "/"); 
            owner:_id,
        });
        const user = await Users.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");} catch(error) {
            return res.status(400).render("upload", {pageTitle : "Upload Video", errorMessage : error._message})
    }
}

export const deleteVideo = async (req, res) => {
    const {id} = req.params; 
    const {user : {_id}} = req.session
    const video = await Video.findById(id);
    if (!video){
        return res.status(404).render("404", {pageTitle : "Video not found."});
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}

export const search = async (req, res) => {
    const {keyword} = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}`, "i"),
            },
        }).populate("owner");
    }
    return res.render("search", {pageTitle:"Search", videos});
}

export const registerView = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
}

export const createComment = async (req, res) => {
    const {
        session : { user },
        body : { text },
        params : { id }
    } = req;

    const video = await Video.findById(id);
    if (!video) {
        // res.status 와 다른 점은 sendStatus 는 상태 메세지를 보내고 request 를 끝낸다
        return res.sendStatus(404);
    }
    
    const comment = await Comment.create({
        text,
        owner : user._id,
        video : id,
    });
    // comment._id 는 몽고디비에서 자동으로 생성해주는 아이디 이다.
    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({newCommentId:comment._id});
}