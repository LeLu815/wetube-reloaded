import express from "express"
import {watch, getEdit, postEdit, getUpload, postUpload, deleteVideo} from "../controllers/videoController"
import {protectorMiddleware, videoUpload} from "../middlewares"

const videosRouter = express.Router({ mergeParams: true });

videosRouter.get("/:id([0-9a-f]{24})", watch);
videosRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit)
videosRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);
videosRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(videoUpload.fields([
    {name : "video", maxCount : 1},
    {name : "thumb", maxCount : 1},
 ]), postUpload)

export default videosRouter