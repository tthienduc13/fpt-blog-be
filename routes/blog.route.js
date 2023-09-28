import express from "express";
import {
  createBlog,
  getAllCategory,
  getAllTag,
  getCategoryById,
  getTagById,
} from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/getAllCategory", getAllCategory);
router.get("/getCategory/:category_id", getCategoryById);
router.get("/getAllTag", getAllTag);
router.get("/getTag/:tag_id", getTagById);
router.post("/create", createBlog);

export default router;
