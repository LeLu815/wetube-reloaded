import express from "express"
import morgan from "morgan"

import global from "./routers/globalRouter";
import videosRouter from "./routers/videoRouter"
import userRouter from "./routers/userRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views")
app.use(logger);
// 해당 url로 접근하면 뒤에 있는 라우터 안의 url로 접근할 수 있도록 한다
app.use("/", global)
app.use("/videos", videosRouter)
app.use("/users", userRouter)

const handleListening = () => 
    console.log(`Server is listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);