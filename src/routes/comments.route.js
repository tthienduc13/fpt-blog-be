import express from "express";
import commentController from "../controllers/comments.controller.js";

const router = express.Router();

router.post("/add", commentController.addComment);
router.get("/all/:blog_id", commentController.getCommentByBlog);

router.post("/add-reply", commentController.addReplyComment);
router.get("/reply/:comment_id", commentController.getReplyComment);

export default router;
