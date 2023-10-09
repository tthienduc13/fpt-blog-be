import express from "express";
import moderateController from "../controllers/moderator.controller.js";

const router = express.Router();

router.patch("/approve/:user_id", moderateController.assignModerator);
router.patch("/reject/:user_id", moderateController.removeModerator);

export default router;
