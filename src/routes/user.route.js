import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:user_id", userController.getUserInfo);
router.delete("/profile/:user_id", userController.deleteUser);
router.post("/profile/update-avatar/:user_id", userController.updateAvatar);
router.post("/profile/update-info/:user_id", userController.updateInfo);

router.get("/members", userController.getAllUsers);
router.get("/students", userController.getAllStudents);
router.get("/mentors", userController.getAllMentors);

router.get("/profile-info/:user_id", userController.getUserProfile);
router.patch("/profile/update-bio/:user_id", userController.updateBio);

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

 *   delete:
 *     summary: Delete a profile by ID
 *     tags: [Profile]
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: ID of the profile to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found
 *
 */

export default router;
