import { Router } from "express";
import * as galleryController from "./gallary.service.js";
import { fileUpload } from "../../utils/multier/cloudinary.middelware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorization } from "../../middleware/authorization.js";
import { USER_ROLES , PERMISSIONS, ROLE_PERMISSIONS } from "../../config/roles.js";

const router = Router();

// Get All (Public)
router.get("/", galleryController.getAllGallery);

// Get One (Public)
router.get("/:id", galleryController.getGalleryById);

router.post(
    "/", 
    authMiddleware,
    authorization(PERMISSIONS.MANAGE_GALLERY),
    fileUpload().single("image"),
    galleryController.createGallery
);

router.delete(
    "/:id",
    authMiddleware,
    authorization(PERMISSIONS.MANAGE_GALLERY),
    galleryController.deleteGalleryById
);

export default router;