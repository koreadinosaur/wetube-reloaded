import express from "express";
import {
  handleEditUser,
  handleDelete,
  logout,
  see,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", handleEditUser);
userRouter.get("/delete", handleDelete);
userRouter.get(":id", see);

export default userRouter;
