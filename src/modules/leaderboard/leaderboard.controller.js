import { Router } from "express";
const router = Router();
import * as leaderboardService from "./leaderboard.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorization } from "../../middleware/authorization.js";
import { USER_ROLES , PERMISSIONS, ROLE_PERMISSIONS } from "../../config/roles.js";

router.use(authMiddleware);

router.get("/", authorization(PERMISSIONS.VIEW_LEADERBOARD), leaderboardService.getLeaderboard);
router.get("/user", authorization(PERMISSIONS.VIEW_LEADERBOARD), leaderboardService.getUserActivity);
export default router;