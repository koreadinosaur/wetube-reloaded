import video from "../models/video"; //video는 model, 후술할 Video는 objcet
import User from "../models/User";
import Comment from "../models/Comment";
//globalRouter
export const home = async (req, res) => {
  const videos = await video.find({}).sort({ createdAt: "asc" }); //모든 video를 찾아냄 videos는 video들로 구성된 array다.
  return res.render("home", { pageTitle: "Home", videos }); //videos를 Home 템플릿으로 전송
};
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};

//videoRouter
export const watch = async (req, res) => {
  const { id } = req.params; //router가 주는 express기능인 것만 알면 됨.
  const Video = await video.findById(id).populate("owner").populate("comments"); //findById에서 필요한 id는 req.params에서 찾아온다.
  //video.findById(id).exec()입력하면 mongoose 내부적으로 promise가 return된다. 하지만 async랑 await을 쓰고 있기 떄문에
  // exec()를 입력할 필요는 없다. 입력해도 똑같이 작동함.
  if (Video === null) {
    //Video === null은 !Video와 같다.
    return res.status(404).render("404", { pageTitle: "Video not found" });
  } else {
    console.error();
    return res.render("watch", { pageTitle: Video.title, video: Video }); //video: video가 같은 이름이면 video만 입력해도 됨.
  }
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const Video = await video.findById(id);
  if (Video === null) {
    //Video === null은 !Video와 같다.
    return res.render("404", { pageTitle: "Video not found" });
  }
  if (String(Video.owner) !== _id) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit ${Video.title}`, video: Video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const {
    user: { _id },
  } = req.session;
  const Video = await video.exists({ _id: id });
  if (String(Video.owner) !== _id) {
    req.flash("error", "You are not the owner of the video");
    return res.status(403).redirect("/");
  }
  if (Video === null) {
    //Video === null은 !Video와 같다.
    return res.render("404", { pageTitle: "Video not found" });
  }
  await video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: video.formatHashtags(hashtags),
  });
  req.flash("info", "Changes saved");
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  return res.render("upload", { pageTitle: `upload Video` });
};
export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { thumb } = req.files;
  const Video = req.files.video;
  const { title, description, hashtags } = req.body;
  const isheroku = process.env.NODE_ENV === "production";
  try {
    const newVideo = await video.create({
      title,
      description,
      fileUrl: isheroku ? Video[0].location : Video[0].path,
      thumbUrl: isheroku ? thumb[0].location : thumbUrl[0].path,
      owner: _id,
      hashtags: video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: `upload Video`,
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await video.findByIdAndDelete(id);
  const {
    user: { _id },
  } = req.session;
  const Video = await video.findById(id);
  if (!Video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(Video.owner) !== _id) {
    return res.status(403).redirect("/");
  }
  return res.redirect("/");
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const Video = await video.findById(id);
  if (!Video) {
    return res.sendStatus(404);
  }
  Video.meta.views = Video.meta.views + 1;
  await Video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const Video = await video.findById(id);
  if (!Video) {
    return res.sendStatus(404); //status code를 보내고, request를 끝냄. res.status는 request 안끝냄
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  Video.comments.push(comment._id);
  Video.save();
  return res.status(201).json({ newCommentId: comment._id }); //상태코드 201은 created 라는 뜻
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const comment = await Comment.findById(id);
  if (String(comment.owner) !== _id) {
    return res.status(403).redirect("/");
  }
  await Comment.findByIdAndDelete(id);
  const Video = await video.findById(comment.video);

  return res.sendStatus(200);
};
