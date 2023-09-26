import express from "express";
import { getUserInfo } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/userInfo/:user_id", getUserInfo);

export default router;
