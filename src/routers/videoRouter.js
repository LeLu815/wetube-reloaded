import express from "express"
import {watch, edit, deleteVideo, upload} from "../controllers/videoController"

const videosRouter = express.Router({ mergeParams: true });

videosRouter.get("/upload", upload);
videosRouter.get("/:id(\\d+)", watch);
videosRouter.get("/(\\d+)/edit", edit);
videosRouter.get("/(\\d+)/delete", deleteVideo);

export default videosRouter