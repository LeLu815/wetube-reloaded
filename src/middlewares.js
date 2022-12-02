import multer from "multer";
import multerS3 from "multer-s3";
// const { S3Client } = require('@aws-sdk/client-s3');
import { S3Client, AbortMultipartUploadCommand } from "@aws-sdk/client-s3";

// const s3 = new S3Client({
//     region: "ap-northeast-2",
//     apiVersion: "2022-10-24",
//     credentials :  {
//         accessKeyId: process.env.AWS_ID,
//         secretAccessKey: process.env.AWS_SECRET,
//     },
// });
const s3 = new S3Client({
    region: "ap-northeast-2",
    credentials: {
        apiVersion: "2022-10-24",
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    },
});

const multerUploader = multerS3({
    s3: s3,
    bucket: 'wetube-leein',
    acl: 'public-read',
})

export const localMiddleware = (req, res, next) => {
    res.locals.siteName = "Wetube";
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    // console.log(res.locals);
    // console.log(req.session.user)
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn) {
        return next();
    } else {
        req.flash("error", "Log in first.");
        return res.redirect("/login");
    }
}

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        return next();
    } else {
        req.flash("error", "Not authorized");
        return res.redirect('/');
    }
}

// export const uploadFiles = multer({ dest: "uploads/" });
export const avatarUpload = multer({ 
    dest: "uploads/avatars/", 
    limits :{
        fileSize : 3000000,
    },
    storage : multerUploader
});
export const videoUpload = multer({ 
    dest: "uploads/videos/", 
    limits :{
        fileSize : 10000000,
    },
    storage : multerUploader
});