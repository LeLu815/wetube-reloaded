// const express = require("express")
// const app = express();

import express from "express"

const PORT = 4000;
const app = express();

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}
const privateMiddleware = (req, res, next) => {
    const url  = req.url;
    if(url === "/protected") {
        return res.send("<h1>Not Allowed</h1>")
    }
    console.log( "Allowed, you may continue")
    next();
}

// route 에는 request와 response가 있다
const handleHome = (req, res) => {
    // return res.send("<h1>I still love you</h1>");
    return res.send("I love middleware");
};
const handleLogin = (req, res) => {
    return res.send("login here")
}
const handleProtected = (req, res) => {
    return res.send("<h1>Welcome to the private lounge</h1>");
}

app.use(logger);
app.use(privateMiddleware)

app.get("/", handleHome);
app.get("/login", handleLogin)
app.get("/protected", handleProtected)

const handleListening = ()=>console.log(`Server is listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
