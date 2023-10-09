import express from "express";
import blogController from "../controllers/blog.controller.js";
const router = express.Router();

router.get("/categories", blogController.getAllCategory);
router.get("/categories/:category_id", blogController.getCategoryById);
router.get("/tags", blogController.getAllTag);
router.get("/tags/:tag_id", blogController.getTagById);
router.get("/tags/category/:category_id", blogController.getTagByCategory);

router.post("/create", blogController.createBlog);
router.get("/posted/:user_id", blogController.getPostedBlog);

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
 *
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
 *           type: string
 *     responses:
 *       200:
 *         description: The requested category
 *         content:
 *           application/json:
 *             schema:
 *
 *       404:
 *         description: Category not found
 *
 */

/**
 * @swagger
 * tags:
 *   name:  Tag
 *   description: The Tag API
 * /api/blogs/tags:
 *   get:
 *     summary: Lists all the tags
 *     tags: [ Tag]
 *     responses:
 *       200:
 *         description: The list of tags
 *         content:
 *           application/json:
 *             schema:
 *
 * /api/blogs/tags/{tag_id}:
 *   get:
 *     summary: Get a tag by ID
 *     tags: [ Tag]
 *     parameters:
 *       - name: tag_id
 *         in: path
 *         description: ID of the tag to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested tag
 *         content:
 *           application/json:
 *             schema:
 *
 *       404:
 *         description: Tag not found
 *
 * /api/blogs/tags/category/{category_id}:
 *   get:
 *     summary: Get tags by category
 *     tags: [ Tag]
 *     parameters:
 *       - name: category_id
 *         in: path
 *         description: ID of the tag to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested tag
 *         content:
 *           application/json:
 *             schema:
 *
 *       404:
 *         description: Tag not found
 *
 */

export default router;
