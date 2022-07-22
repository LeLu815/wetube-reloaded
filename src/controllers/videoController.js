import Video from "../models/Video"

// const handleSearch = (error, videos) => {}
// Video.find({}, (error, videos) => {});
/* 
async, await 가 좋은 이유는 콜백함수가 코드 중간에 삽입되어 있으면
해당 코드를 실행하고 결과를 무시한 채 다음 코드로 넘어가지만
await 가 있는 경우에는 기다렸다가 다음 코드로 넘어간다.
*/

export const home = async(req, res) => { 
        const videos = await Video.find({}).sort({createdAt:"desc"});
        return res.render("home", {pageTitle : "Home", videos});
}
export const watch = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if (!video){
        return res.render("404", {pageTitle : "Video not found."});
    }
    return res.render("watch", {pageTitle : video.title, video}); 
};

export const getEdit = async (req, res) => {
    // console.log(req.params);
    const {id} = req.params;
    const video = await Video.findById(id);
    if (!video){
        return res.render("404", {pageTitle : "Video not found."});
    }
    return res.render("edit", {pageTitle : `Edit: ${video.title}`, video});
}
// body : form 안에 있는 value의 js representation(표현)
export const postEdit = async (req, res) => {
    const {id} = req.params;
    const {title, description, hashtags} = req.body;
    const video = await Video.exists({ _id:id });
    if (!video){
        return res.render("404", {pageTitle : "Video not found."});
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags : Video.formatHashtags(hashtags),
    });

    return res.redirect(`/videos/${id}`);; 
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle : "Upload Video"})
}
export const postUpload = async (req, res) => {
    const {title, description, hashtags} = req.body
    try {
        await Video.create({
            title,
            description,
            hashtags : Video.formatHashtags(hashtags),
        });    
    return res.redirect("/");} catch(error) {
        return res.render("upload", {pageTitle : "Upload Video", errorMessage : error._message})
    }
}

export const deleteVideo = async (req, res) => {
    const {id} = req.params; 
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
        });
    }
    return res.render("search", {pageTitle:"Search", videos});
}
