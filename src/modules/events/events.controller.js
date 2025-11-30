// GET	/api/events	Public
// GET	/api/events?chapterId=...	Public
// POST	/api/events	Chairperson
// DELETE	/api/events/:id	Chairperson
// GET	/api/events/:id	Public

import { Router } from "express";
const router = Router();
import * as eventService from "./events.service.js";
import { fileUpload } from "../../utils/multier/cloudinary.middelware.js";
import { imageValidation } from "../../utils/multier/cloudinary.js";

router.get("/", eventService.getAllEvents);
router.get("/:id", eventService.getEventById);
router.post("/",fileUpload().single("image") ,eventService.createEvent);
router.put("/:id", eventService.updateEvent);
router.delete("/:id", eventService.deleteEvent);

export default router;