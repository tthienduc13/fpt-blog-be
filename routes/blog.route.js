import express from "express";
import {
  createBlog,
  getAllCategory,
  getAllTag,
  getCategoryById,
  getTagById,
} from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/categories", getAllCategory);
router.get("/categories/:category_id", getCategoryById);
router.get("/getAllTag", getAllTag);
router.get("/getTag/:tag_id", getTagById);
router.post("/create", createBlog);

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: The Category API
 * /api/blogs/categories:
 *   get:
 *     summary: Lists all the categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: The list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref:
 * /api/blogs/categories/{category_id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Category]
 *     parameters:
 *       - name: category_id
 *         in: path
 *         description: ID of the category to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested category
 *         content:
 *           application/json:
 *             schema:
 *
 *       404:
 *         description: Category not found
 */

export default router;
