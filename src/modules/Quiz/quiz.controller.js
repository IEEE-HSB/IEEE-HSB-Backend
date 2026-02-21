import { Router } from "express";
import * as quizService from "../Quiz/quiz.service.js";
import {authMiddleware} from "../../middleware/auth.middleware.js";
import { authorization } from "../../middleware/authorization.js";
import { USER_ROLES , PERMISSIONS, ROLE_PERMISSIONS } from "../../config/roles.js";
const router = Router();


router.get("/", quizService.getAllQuizzes);


router.use(authMiddleware);

router.get("/:id", authorization(PERMISSIONS.TAKE_QUIZ),quizService.getQuizById);       // لازم يوزر مسجل عشان يشوف الأسئلة
router.get("/", authorization(PERMISSIONS.TAKE_QUIZ),quizService.getQuizzes);
router.get("/:id", authorization(PERMISSIONS.TAKE_QUIZ), quizService.startQuiz); // لازم يوزر مسجل عشان يبدأ الكويز
router.post("/:id/submit", authorization(PERMISSIONS.TAKE_QUIZ), quizService.submitQuiz); // لازم يوزر مسجل عشان يسلم ويتحسبله نقط
// router.get("/:id/result", quizService.getQuizResult); // نتايج اليوزر


router.post("/", authorization(PERMISSIONS.MANAGE_QUIZ), quizService.createQuiz);
router.put("/:id", authorization(PERMISSIONS.MANAGE_QUIZ), quizService.updateQuiz);
router.delete("/:id", authorization(PERMISSIONS.MANAGE_QUIZ), quizService.deleteQuiz);
 
export default router;