import express from "express";
import {
  handleEdit,
  see,
  upload,
  deleteVideo,
} from "../controllers/videoController";
const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", see); //videos/watch라고 할 필요가 없음. 이미 /videos 안이니까
videoRouter.get("/:id(\\d+)/edit", handleEdit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
