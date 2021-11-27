import express from "express";
import {
  getEdit,
  watch,
  getUpload,
  deleteVideo,
  postEdit,
  postUpload,
} from "../controllers/videoController";
const videoRouter = express.Router();

videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/:id(\\d+)", watch); //videos/watch라고 할 필요가 없음. 이미 /videos 안이니까
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit); //위의 코드 두줄을 이렇게 만들 수 있음
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
