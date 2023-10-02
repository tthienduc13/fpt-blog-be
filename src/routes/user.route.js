import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", userController.getAllUsers);
router.get("/profile/:user_id", userController.getUserInfo);

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: The Profile API
 * /api/users/profile:
 *   get:
 *     summary: Lists all the profiles
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: The list of profiles
 *         content:
 *           application/json:
 *             schema:
 *
 * /api/users/profile/{user_id}:
 *   get:
 *     summary: Get a profile by ID
 *     tags: [Profile]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: ID of the profiles to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested profiles
 *         content:
 *           application/json:
 *             schema:
 *
 *       404:
 *         description: Profile not found
 *
 */

export default router;
