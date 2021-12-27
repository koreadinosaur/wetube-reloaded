export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  //로그인 되어있으면 다음으로 넘어가고, 안되어있으면 로그인페이지로.
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  //로그인 되어있지 않은 사람들만을 위한 미들웨어
  if (!req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/");
  }
};

export const express = require("express");
export const multer = require("multer");
export const uploadFiles = multer({
  dest: "uploads/profileUpload/",
  limits: {
    fileSize: 3000000,
  },
});
export const uploadVideo = multer({
  dest: "uploads/videoUpload/",
  limits: {
    fileSize: 10000000,
  },
});
