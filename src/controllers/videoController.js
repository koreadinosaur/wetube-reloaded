import video from "../models/video"; //video는 model, 후술할 Video는 objcet

//globalRouter
export const home = async (req, res) => {
  const videos = await video.find({}); //모든 video를 찾아냄 videos는 video들로 구성된 array다.
  return res.render("home", { pageTitle: "Home", videos }); //videos를 Home 템플릿으로 전송
};
export const search = (req, res) => res.send("search");

//videoRouter
export const watch = async (req, res) => {
  const { id } = req.params; //router가 주는 express기능인 것만 알면 됨.
  const Video = await video.findById(id); //findById에서 필요한 id는 req.params에서 찾아온다.
  //video.findById(id).exec()입력하면 mongoose 내부적으로 promise가 return된다. 하지만 async랑 await을 쓰고 있기 떄문에
  // exec()를 입력할 필요는 없다. 입력해도 똑같이 작동함.
  if (Video === null) {
    //Video === null은 !Video와 같다.
    return res.render("404", { pageTitle: "Video not found" });
  } else {
    return res.render("watch", { pageTitle: Video.title, video: Video }); //video: video가 같은 이름이면 video만 입력해도 됨.
  }
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const Video = await video.findById(id);
  if (Video === null) {
    //Video === null은 !Video와 같다.
    return res.render("404", { pageTitle: "Video not found" });
  }
  return res.render("edit", { pageTitle: `Edit ${Video.title}`, video: Video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const Video = await video.exists({ _id: id });
  if (Video === null) {
    //Video === null은 !Video와 같다.
    return res.render("404", { pageTitle: "Video not found" });
  }
  await video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: hashtags
      .split(",")
      .map((word) => (word.startsWith("#") ? word : `#${word}`)),
  });
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `upload Video` });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: `upload Video`,
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = (req, res) => {
  console.log(req.params);
  res.send("delete video");
};
