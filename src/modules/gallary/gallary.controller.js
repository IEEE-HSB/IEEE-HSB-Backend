import { Router } from "express";
import * as galleryController from "./gallary.service.js";
const router = Router();

// Method	Endpoint	Description
// GET	/api/gallery	Get all gallery items
// GET	/api/gallery?chapterId=...	Get gallery items filtered by chapter
// GET	/api/gallery/:id	Get a single gallery item
// POST	/api/gallery	Add a new gallery item
// DELETE	/api/gallery/:id	Delete a gallery item by ID

router.get("/",galleryController.getAllGallery);
router.get("/:id", galleryController.getGalleryById);
router.post("/", galleryController.createGallery);
router.delete("/:id", galleryController.deleteGalleryById);

export default router;