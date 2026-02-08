import { Router } from "express";
import * as quizService from "../Quiz/quiz.service.js";
import {authMiddleware} from "../../middleware/auth.middleware.js";

const router = Router();


router.get("/", quizService.getAllQuizzes);


router.use(authMiddleware);

router.get("/:id", quizService.getQuizById);       // لازم يوزر مسجل عشان يشوف الأسئلة
router.get("/", quizService.getQuizzes);
router.get("/:id", quizService.startQuiz); // لازم يوزر مسجل عشان يبدأ الكويز
router.post("/:id/submit", quizService.submitQuiz); // لازم يوزر مسجل عشان يسلم ويتحسبله نقط
// router.get("/:id/result", quizService.getQuizResult); // نتايج اليوزر


router.post("/", quizService.createQuiz);
router.put("/:id", quizService.updateQuiz);
router.delete("/:id", quizService.deleteQuiz);
 
export default router;