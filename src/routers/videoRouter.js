import express from "express";
import { handleEdit, handleWatch } from "../controllers/videoController";
const videoRouter = express.Router();

videoRouter.get("/watch", handleWatch); //videos/watch라고 할 필요가 없음. 이미 /videos 안이니까
videoRouter.get("/edit", handleEdit);

export default videoRouter;
