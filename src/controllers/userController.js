//globalRouter
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = (req, res) => {
  console.log(req.body);
  res.end();
};
export const login = (req, res) => res.send("login");

//userRouter
export const handleEditUser = (req, res) => res.send("Edit user");
export const handleDelete = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see");
