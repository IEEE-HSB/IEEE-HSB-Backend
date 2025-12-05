import { Router } from "express";
import * as eventService from "./events.service.js";
import { fileUpload } from "../../utils/multier/cloudinary.middelware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", eventService.getAllEvents);
router.get("/:id", eventService.getEventById);

// الـ Create محتاج Auth و Image
router.post("/", authMiddleware, fileUpload().single("image"), eventService.createEvent);

router.put("/:id", authMiddleware, fileUpload().single("image"), eventService.updateEvent);
router.delete("/:id", authMiddleware, eventService.deleteEvent);

export default router;