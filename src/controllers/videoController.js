//globalRouter
export const trending = (req, res) => res.render("home", { pageTitle: "Home" });
export const search = (req, res) => res.send("search");

//videoRouter
export const see = (req, res) => res.render("watch");
export const handleEdit = (req, res) => res.render("edit");
export const upload = (req, res) => res.send("upload video");
export const deleteVideo = (req, res) => {
  console.log(req.params);
  res.send("delete video");
};
