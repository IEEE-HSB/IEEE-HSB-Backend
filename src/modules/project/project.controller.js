import { Router } from "express";
import * as projectController from "./project.service.js";
import { fileUpload } from "../../utils/multier/cloudinary.middelware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

// 1. Get All Projects (Public) + Filter ?chapterId=CS
router.get("/", projectController.getAllProjects);

// 2. Get Single Project (Public)
router.get("/:id", projectController.getProjectById);

// 3. Create Project (Admin/Chair only)
router.post(
    "/",
    authMiddleware,
    fileUpload().fields([
        { name: "image", maxCount: 1 },
        { name: "subImages", maxCount: 5 }
    ]),
    projectController.createProject
);

// 4. Update Project
router.patch(
    "/:id",
    authMiddleware,
    fileUpload().fields([
        { name: "image", maxCount: 1 },
        { name: "subImages", maxCount: 5 }
    ]),
    projectController.updateProject
);

// 5. Delete Project
router.delete("/:id", authMiddleware, projectController.deleteProject);

export default router;