import video from "../models/video";

//globalRouter
export const home = async (req, res) => {
  const videos = await video.find({});
  return res.render("home", { pageTitle: "Home", videos });
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
  const Video = new video({
    title,
    description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  await Video.save();
  return res.redirect("/");
};

export const deleteVideo = (req, res) => {
  console.log(req.params);
  res.send("delete video");
};
