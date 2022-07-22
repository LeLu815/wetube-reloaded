import "./db";
import "./models/Video";
import express from "express"
import morgan from "morgan"

import global from "./routers/globalRouter";
import videosRouter from "./routers/videoRouter"
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views")
app.use(logger);

// express application이 form의 value들을 이해 및 자바스크립트 형식으로 변환 가능
app.use(express.urlencoded({extended:true}))

app.use("/", global)
app.use("/videos", videosRouter)
app.use("/users", userRouter)

export default app