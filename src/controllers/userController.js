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
        socialOnly: true, //social login만 가능하다는 의미
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
    }, // const i = req.session.user.id 와 같음.
    body: { email, username, name, location }, // const { email, username, name, location } = req.body;와 같음
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
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      //현재 로그인된 user의 id는 request object에서 얻을 수 있다.
      //email 등의 변수는 form에서 가져오는 것이다.
      avatarUrl: file ? file.path : avatarUrl,
      email,
      username,
      name,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  // req.session.user = {
  //   ...req.session.user, // req.session.user 내의 내용을 밖으로 꺼내줌 밑에 나열된 변수 제외하고는 변경할 게 없다는 의미.
  //   email,
  //   username,
  //   name,
  //   location,
  // };
  return res.redirect("/users/edit");
};
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
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
  const match = await bcrypt.compare(currentPassword, password); //앞에거는 form의 비밀번호, 뒤에는 로그인된 사용자의 password
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
  const user = await User.findById(_id); // save 쓰려면 user를 정의해줘야함.
  user.password = newPassword;
  await user.save(); //promise일지도 모르니 await 선언. pre save middleware를 작동시킨다. 새로운 비밀번호를 hash하기 위함.
  req.session.user.password = user.password; //세션 업데이트. 이거 안해도 되긴되던데?뭐지
  return res.redirect("/users/logout");
};

export const logout = (req, res) => {
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
