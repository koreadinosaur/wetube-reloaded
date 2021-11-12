import express from "express";
import { handleEditUser, handleDelete } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", handleEditUser);
userRouter.get("/delete", handleDelete);

export default userRouter;
