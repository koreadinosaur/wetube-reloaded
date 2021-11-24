import video from "../models/video";

//globalRouter
export const home = async (req, res) => {
  const videos = await video.find({});
  return res.render("home", { pageTitle: "Home", videos: [] });
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
export const upload = (req, res) => res.send("upload video");
export const deleteVideo = (req, res) => {
  console.log(req.params);
  res.send("delete video");
};
