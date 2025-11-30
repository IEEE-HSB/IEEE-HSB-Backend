// - `GET /api/chapters`
// - `POST /api/chapters` (admin)
// - `GET /api/chapters/:id/committees`
// - `POST /api/chapters/:id/committees` (chair/admin)

import { Router } from "express";
const router = Router();
import * as chapterService from "./chapters.service.js";

router.get("/", chapterService.getAllChapters);
router.post("/", chapterService.createChapter);
router.get("/:id/committees", chapterService.getChapterByIdCommittee);
router.post("/:id/committees", chapterService.createChapterCommittee);

export default router;


