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

videoRouter.route("/upload").get(getUpload).post(postUpload); //videoRouter.get("/:id(\\d+)", watch); 이녀석보다 위에 있어야함. 아니면 id로 인식된다.
videoRouter.get("/:id([0-9a-f]{24})", watch); //videos/watch라고 할 필요가 없음. 이미 /videos 안이니까
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit); //위의 코드 두줄을 이렇게 만들 수 있음
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);

export default videoRouter;
