let videos = [
    {
        title:"First Video",
        rating:4.5,
        comments : 287,
        createdAt : "2 minutes ago",
        views : 56,
        id : 1
    },
    {
        title:"Second Video",
        rating:5,
        comments : 0,
        createdAt : "2 minutes ago",
        views : 1,
        id : 2
    },
    {
        title:"Third Video",
        rating:5,
        comments : 2,
        createdAt : "2 minutes ago",
        views : 27,
        id : 3
    }
]

export const trending = (req, res) => {
    // return res.send(`Watch Video #${req.params.id}`);
    console.log(req.params)
    return res.render("home", {pageTitle : "Home", videos})
}
export const watch = (req, res) => {
    const {id} = req.params
    const video = videos[id-1]
    return res.render("watch", {pageTitle : `Watching ${video.title}`, video});
}
export const edit = (req, res) => {
    // console.log(req.params);
    const {id} = req.params
    const video = videos[id-1]

    console.log(req.query)

    return res.render("edit")
    // return res.render("edit", {pageTitle : `Editing ${video.title}`})
}
export const search = (req, res) => {
    return res.send("Search")
}
export const deleteVideo = (req, res) => {
    console.log(req.params);
    return res.send("Delete")
}
export const upload = (req, res) => {
    return res.send("Upload")
}
