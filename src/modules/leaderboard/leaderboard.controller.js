import { Router } from "express";
const router = Router();
import * as leaderboardService from "./leaderboard.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

router.use(authMiddleware);

router.get("/", leaderboardService.getLeaderboard);
router.get("/user", leaderboardService.getUserActivity);
export default router;