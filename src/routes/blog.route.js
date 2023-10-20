import express from "express";
import blogController from "../controllers/blog.controller.js";
const router = express.Router();
router.get("/pending", blogController.getPendingBlog);
router.get("/categories", blogController.getAllCategory);
router.get("/categories/:category_id", blogController.getCategoryById);
router.get("/tags", blogController.getAllTag);
router.get("/tags/:tag_id", blogController.getTagById);
router.get("/tags/category/:category_id", blogController.getTagByCategory);

router.get("/:blog_id", blogController.getBlogWithTags);

router.post("/create", blogController.createBlog);
router.post("/create/blog-tags", blogController.createBlogTags);

router.get("/posted/:user_id", blogController.getPostedBlog);

router.patch("/approve/:blog_id", blogController.approveBlog);
router.patch("/reject/:blog_id", blogController.rejectBlog);

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: The Blog API
 * /api/blogs/create/blog-tags:
 *   post:
 *     summary: Create blog tags
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blog_id:
 *                 type: string
 *                 description: The ID of the blog
 *               tags:
 *                 type: array
 *                 description: An array of tags
 *                 items:
 *                   type: object
 *                   properties:
 *                     tag_id:
 *                       type: string
 *                       description: The ID of the tag
 *             example:
 *               blog_id: 12345678-1234-1234-1234-123456789abc
 *               tags:
 *                 - tag_id: 11111111-1111-1111-1111-111111111111
 *                 - tag_id: 22222222-2222-2222-2222-222222222222
 *                 - tag_id: 33333333-3333-3333-3333-333333333333
 *     responses:
 *       200:
 *         description: Blog tags created successfully
 *       500:
 *         description: Internal server error
 */

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
