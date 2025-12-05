import { Router } from "express";
import * as announcementController from "./announcement.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", announcementController.getAllAnnouncements);

router.get("/:id", announcementController.getAnnouncementById);

router.post("/", authMiddleware, announcementController.createAnnouncement);

router.patch("/:id", authMiddleware, announcementController.updateAnnouncement);

router.delete("/:id", authMiddleware, announcementController.deleteAnnouncement);

export default router;