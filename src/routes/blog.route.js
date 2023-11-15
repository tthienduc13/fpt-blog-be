import express from "express";
import blogController from "../controllers/blog.controller.js";
const router = express.Router();
router.get("/featured", blogController.getFeaturedBlogs);
router.get("/major/:category_id", blogController.getMajorBlog);
router.get("/pending", blogController.getPendingBlog);
router.get("/category-blog/:category_id", blogController.getCategoryPostById);
router.get("/saved/:user_id", blogController.getSavedBlog);

router.get("/categories", blogController.getAllCategory);
router.get("/categories/:category_id", blogController.getCategoryById);
router.get("/tags", blogController.getAllTag);
router.get("/tags/:tag_id", blogController.getTagById);
router.get("/tags/category/:category_id", blogController.getTagByCategory);

router.get("/:blog_id", blogController.getBlogWithTags);

router.post("/create", blogController.createBlog);
router.post("/create/blog-tags", blogController.createBlogTags);

router.post("/save", blogController.saveBlog);
router.delete("/un-save/:blog_id/:user_id", blogController.unsaveBlog);

router.get("/posted/:user_id", blogController.getPostedBlog);

router.patch("/approve/:blog_id", blogController.approveBlog);
router.patch("/reject/:blog_id", blogController.rejectBlog);
router.patch("/hide/:blog_id", blogController.deleteBlog);

router.post("/search", blogController.searchBlogsByCategoryAndTitle);

export default router;
