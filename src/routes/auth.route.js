import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post("/login", authController.login);
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: User registration successful
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post("/register", authController.register);
/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verify user account
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email of the user to verify
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The verification token received via email
 *     responses:
 *       200:
 *         description: Account verification successful
 *       400:
 *         description: Invalid verification token
 *       500:
 *         description: Internal server error
 */
router.get("/verify", authController.verify);
/**
 * @swagger
 * /api/auth/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               oldPassword: oldPassword123
 *               newPassword: newPassword123
 *     responses:
 *       200:
 *         description: Password change successful
 *       400:
 *         description: Invalid email, old password, or new password
 *       500:
 *         description: Internal server error
 */

router.patch("/reset-password", authController.resetPassword);

router.post("/forgot-password", authController.forgotPassword);

router.patch("/change-password", authController.changePassword);

export default router;
