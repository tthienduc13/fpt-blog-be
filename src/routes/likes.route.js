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
  "/comment-reply-like-count/:commentReply_id",
  likeController.getLikeCountForCommentReply
);

router.get(
  "/check-liked-post/:user_id/:blog_id",
  likeController.checkUserLikedBlog
);

router.get(
  "/check-liked-comment/:user_id/:comment_id",
  likeController.checkUserLikedComment
);

router.get(
  "/check-liked-comment-reply/:user_id/:commentReply_id",
  likeController.checkUserLikedCommentReply
);

router.get(
  "/check-saved-post/:user_id/:blog_id",
  likeController.checkUserSavedPost
);

export default router;
