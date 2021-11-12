//globalRouter
export const join = (req, res) => res.send("Join");
export const login = (req, res) => res.send("login");

//userRouter
export const handleEditUser = (req, res) => res.send("Edit user");
export const handleDelete = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see");
