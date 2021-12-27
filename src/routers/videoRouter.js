import express from "express";
import {
  getEdit,
  watch,
  getUpload,
  deleteVideo,
  postEdit,
  postUpload,
} from "../controllers/videoController.js";
import { protectorMiddleware, uploadVideo } from "../middlewares";
const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch); //videos/watch라고 할 필요가 없음. 이미 /videos 안이니까
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(uploadVideo.single("video"), postUpload); //videoRouter.get("/:id(\\d+)", watch); 이녀석보다 위에 있어야함. 아니면 id로 인식된다.
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit); //위의 코드 두줄을 이렇게 만들 수 있음
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);

export default videoRouter;
