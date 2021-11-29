import video from "../models/video";

//globalRouter
export const home = async (req, res) => {
  const videos = await video.find({}); //모든 video를 찾아냄 videos는 video들로 구성된 array다.
  return res.render("home", { pageTitle: "Home", videos }); //videos를 Home 템플릿으로 전송
};
export const search = (req, res) => res.send("search");

//videoRouter
export const watch = (req, res) => {
  const { id } = req.params;

  return res.render("watch", { pageTitle: `Watching` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;

  return res.render("edit", { pageTitle: `Editing` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  console.log(req.body);
  return res.redirect();
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
