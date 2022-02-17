export const express = require("express");
export const multer = require("multer");
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const isheroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "wetube-cloneapp/images",
  acl: "public-read",
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "wetube-cloneapp/videos",
  acl: "public-read",
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isheroku = isheroku;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  //로그인 되어있으면 다음으로 넘어가고, 안되어있으면 로그인페이지로.
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  //로그인 되어있지 않은 사람들만을 위한 미들웨어
  if (!req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const uploadFiles = multer({
  dest: "uploads/profileupload/", //multer upload에서는 작동하지 않음.
  limits: {
    fileSize: 3000000,
  },
  storage: isheroku ? s3ImageUploader : undefined,
});
export const uploadVideo = multer({
  dest: "uploads/videoupload/",
  limits: {
    fileSize: 10000000,
  },
  storage: isheroku ? s3VideoUploader : undefined,
});
