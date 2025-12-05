import { Router } from "express";
import * as galleryController from "./gallary.service.js";
import { fileUpload } from "../../utils/multier/cloudinary.middelware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

// Get All (Public)
router.get("/", galleryController.getAllGallery);

// Get One (Public)
router.get("/:id", galleryController.getGalleryById);

router.post(
    "/", 
    authMiddleware,
    fileUpload().single("image"),
    galleryController.createGallery
);

router.delete(
    "/:id",
    authMiddleware,
    galleryController.deleteGalleryById
);

export default router;