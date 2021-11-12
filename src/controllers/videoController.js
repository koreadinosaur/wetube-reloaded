//globalRouter
export const trending = (req, res) => res.send("Home Page videos");
export const search = (req, res) => res.send("search");

//videoRouter
export const see = (req, res) => {
  console.log(req.params);
  res.send("Watch video");
};
export const handleEdit = (req, res) => {
  console.log(req.params);
  res.send("edit video");
};
export const upload = (req, res) => res.send("upload video");
export const deleteVideo = (req, res) => {
  console.log(req.params);
  res.send("delete video");
};
