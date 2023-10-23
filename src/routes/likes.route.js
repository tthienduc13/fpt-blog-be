import express from "express";
import likeController from "../controllers/likes.controller.js";

const router = express.Router();

router.post("/like-post", likeController.likePost);
router.delete("/unlike-post", likeController.unlikePost);
router.get("/blog-like-count/:blog_id", likeController.getLikeCountForBlog);
router.get(
  "/comment-like-count/:comment_id",
  likeController.getLikeCountForComment
);
router.get(
  "/check-liked-post/:user_id/:blog_id",
  likeController.checkUserLikedBlog
);

router.get(
  "/check-liked-comment/:user_id/:comment_id",
  likeController.checkUserLikedComment
);

export default router;
