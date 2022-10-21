import "./db";
import "./models/Video";
import express from "express"
import morgan from "morgan"
import session from "express-session";
import flash from 'express-flash'
import MongoStore from "connect-mongo";

import { localMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";
import videosRouter from "./routers/videoRouter"
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);

// express application이 form의 value들을 이해 및 자바스크립트 형식으로 변환 가능
app.use(express.urlencoded({extended:true}));
// form 으로부터 받아온 string 들을 parse 하여 자바스크립트 형식으로 변환시켜주어 백엔드에서 이해할 수 있게 하는 미들웨어
app.use(express.json());

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({ mongoUrl : process.env.DB_URL})
    })
)
// 세션에 연결해서 유저에게 메세지를 남기는 미들웨어
// flash 미들웨어를 설치한 순간부터 req.flash 라는 함수를 사용할 수 있게 된다.
app.use(flash());

app.use(localMiddleware);

app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
});

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videosRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
    });


export default app