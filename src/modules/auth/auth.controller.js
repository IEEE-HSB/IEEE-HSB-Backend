import { Router } from "express";
const router = Router();

import * as authService from "./auth.service.js";


router.post("/register", authService.register);
router.post("/login", authService.login);

router.post("/forgot-password", authService.forgotPassword);
router.post("/reset-password", authService.resetPassword);
export default router;