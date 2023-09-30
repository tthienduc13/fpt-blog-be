import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/userInfo/:user_id", userController.getUserInfo);

export default router;
