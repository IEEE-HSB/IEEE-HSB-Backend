import { Router } from "express";
import * as eventService from "./events.service.js";
import { fileUpload } from "../../utils/multier/cloudinary.middelware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorization } from "../../middleware/authorization.js";
import { USER_ROLES , PERMISSIONS, ROLE_PERMISSIONS } from "../../config/roles.js";

const router = Router();

router.get("/", eventService.getAllEvents);
router.get("/:id", eventService.getEventById);

// الـ Create محتاج Auth و Image
router.post("/", authMiddleware, authorization(PERMISSIONS.MANAGE_EVENTS), fileUpload().single("image"), eventService.createEvent);

router.put("/:id", authMiddleware, authorization(PERMISSIONS.MANAGE_EVENTS), fileUpload().single("image"), eventService.updateEvent);
router.delete("/:id", authMiddleware, authorization(PERMISSIONS.MANAGE_EVENTS), eventService.deleteEvent);

export default router;