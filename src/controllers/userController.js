import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import req from "express/lib/request";
import video from "../models/video";

//globalRouter
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { email, username, password, password2, name, location } = req.body;
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "password confirmation does not match.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This username or email is aleady taken.",
    });
  }
  try {
    await User.create({
      email,
      username,
      password,
      name,
      location,
    });
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }

  return res.redirect("/login");
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with this username does not exists.",
    });
  }
  // check if account exists
  // check if password correct
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "password is not right",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      const user = await User.create({
        avatarUrl: userData.avatar_url,
        email: emailObj.email,
        username: userData.login,
        password: "",
        name: userData.name,
        socialOnly: true, //social login??? ??????????????? ??????
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

//userRouter
export const getEdit = (req, res) => {
  return res.render("edit-profile", {
    pageTitle: "Edit Profile",
  });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    }, // const i = req.session.user.id ??? ??????.
    body: { email, username, name, location }, // const { email, username, name, location } = req.body;??? ??????
    file,
  } = req;
  const exists = await User.exists({
    _id: { $ne: { _id } },
    $or: [{ username }, { email }],
  });
  if (exists) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "This username or email is aleady taken.",
    });
  }
  const isheroku = process.env.NODE_ENV === "production";
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      //?????? ???????????? user??? id??? request object?????? ?????? ??? ??????.
      //email ?????? ????????? form?????? ???????????? ?????????.
      avatarUrl: file ? (isheroku ? file.location : file.path) : avatarUrl,
      email,
      username,
      name,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  // req.session.user = {
  //   ...req.session.user, // req.session.user ?????? ????????? ????????? ????????? ?????? ????????? ?????? ??????????????? ????????? ??? ????????? ??????.
  //   email,
  //   username,
  //   name,
  //   location,
  // };
  return res.redirect("/users/edit");
};
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "can't change password");
    return res.redirect("/");
  }
  return res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { currentPassword, newPassword, passwordConfirmation },
  } = req;
  const user = await User.findById(_id); // save ????????? user??? ??????????????????.
  console.log(User);
  console.log(user);
  const match = await bcrypt.compare(currentPassword, password); //???????????? form??? ????????????, ????????? ???????????? ???????????? password
  if (!match) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "the current password is not right",
    });
  }

  if (newPassword !== passwordConfirmation) {
    return res.status(400).render("change-password", {
      pageTitle: "change password",
      errorMessage: "New password do not match the confirmation",
    });
  }
  user.password = newPassword;
  req.session.user.password = user.password; //?????? ????????????. ?????? ????????? ??????????????????????
  await user.save(); //promise????????? ????????? await ??????. pre save middleware??? ???????????????. ????????? ??????????????? hash?????? ??????.
  req.flash("info", "Password Updated");
  return res.redirect("/users/logout");
};

export const logout = (req, res) => {
  req.flash("info", "Bye Bye");
  req.session.destroy();
  return res.redirect("/");
};
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User is not found" });
  }
  return res.render("users/profile", {
    pageTitle: `${user.name}'s profile`,
    user,
  });
};
