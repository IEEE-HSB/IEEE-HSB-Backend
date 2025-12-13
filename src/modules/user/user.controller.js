import { Router} from "express";
import * as userService from "./user.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", userService.getAllUsers);

router.patch("/:id/states",authMiddleware, userService.updateUserStates);

export default router;