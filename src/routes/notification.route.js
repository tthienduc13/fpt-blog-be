import express from "express";
import notificationController from "../controllers/notification.controller.js";
const router = express.Router();

router.get("/all", notificationController.getAllNotification);
router.get("/detail/:notification_id", notificationController.getNotification);
export default router;
