import { Router } from "express";
import * as announcementController from "./announcement.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorization } from "../../middleware/authorization.js";
import { USER_ROLES , PERMISSIONS, ROLE_PERMISSIONS } from "../../config/roles.js";

const router = Router();

router.get("/", announcementController.getAllAnnouncements);

router.get("/:id", announcementController.getAnnouncementById);

router.post("/", authMiddleware, authorization(PERMISSIONS.MANAGE_ANNOUNCEMENTS), announcementController.createAnnouncement);

router.patch("/:id", authMiddleware, authorization(PERMISSIONS.MANAGE_ANNOUNCEMENTS), announcementController.updateAnnouncement);

router.delete("/:id", authMiddleware, authorization(PERMISSIONS.MANAGE_ANNOUNCEMENTS), announcementController.deleteAnnouncement);

export default router;