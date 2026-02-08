import Quiz from "../../models/quiz.model.js";
import QuizResult from "../../models/quizResult.model.js";
import User from "../../models/userModel.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as dbService from "../../DB/DB.service.js"; // استدعاء الهيلبرز بتاعتك
import Chapter from "../../models/chapterModel.js"; // لازم نستدعي موديل الشابتر

// ================= Create Quiz (Director) =================
export const createQuiz = asyncHandler(async (req, res, next) => {
    // 1. Prepare Data
    // بنزود الـ createdBy من التوكن

    const quizData = {
        ...req.body,
        createdBy: req.user._id,
        totalPoints: 0 // هيتحسب تلقائي من الـ Pre Save Hook اللي انت عامله
    };
    console.log(req.body);

    console.log(quizData);

    // 2. Create using generic helper
    const quiz = await dbService.create({
        model: Quiz,
        data: quizData
    });

    return successResponse({
        res,
        data: quiz,
        message: "Quiz created successfully",
        statusCode: 201
    });
});

// ================= Start Quiz (Get Details) =================
export const startQuiz = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // بنجيب الكويز بس **بنشيل** الإجابة الصح عشان الغش
    // select: "-questions.correctAnswerIndex"
    const quiz = await dbService.findById({ model: Quiz, id : id  , select: "-questions.correctAnswerIndex"});

    if (!quiz) return next(new Error("Quiz not found or not active", { cause: 404 }));
    if (!quiz.isActive) return next(new Error("This quiz is currently closed", { cause: 403 }));

    
    return successResponse({ 
        res, 
        data: quiz,
        message: "Quiz started"
    });
});

// ================= Submit Quiz (The Core Logic) =================
export const submitQuiz = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { answers } = req.body; // Array of { questionId, selectedOptionIndex }
    console.log(answers);

    const userId = req.user._id;

    // 1. Fetch the FULL Quiz (including correct answers to grade)
    const quiz = await dbService.findById({ model: Quiz, id });
    if (!quiz) return next(new Error("Quiz not found", { cause: 404 }));

    let score = 0;
    let correctAnswersCount = 0;
    const answersReview = [];

    const questionsMap = new Map(quiz.questions.map(q => [q._id.toString(), q]));

    for (const ans of answers) {
        const question = questionsMap.get(ans.questionId);
        if (question) {
            const isCorrect = question.correctAnswerIndex === ans.selectedOptionIndex;

            if (isCorrect) {
                score += question.points;
                correctAnswersCount++;
            }

            answersReview.push({
                questionId: question._id,
                questionText: question.questionText,
                userAnswerIndex: ans.selectedOptionIndex,
                correctAnswerIndex: question.correctAnswerIndex,
                isCorrect
            });
        }
    }

    // 3. Check for First Attempt Points
    // بنشوف هل اليوزر ده نجح وأخد نقط في الكويز ده قبل كدا؟
    const previousSuccess = await dbService.findOne({
        model: QuizResult,
        filter: { userId, quizId: id, pointsAwarded: true }
    });

    // الشرط: مخدش نقط قبل كدا + جاب سكور أكبر من الصفر (أو درجة النجاح لو محددها)
    const shouldAwardPoints = !previousSuccess && score > 0;

    // 4. Save Result
    const resultData = {
        userId,
        quizId: id,
        score,
        totalScore: quiz.totalPoints,
        isPassed: score >= (quiz.totalPoints * 0.5), // مثلاً النجاح من 50%
        pointsAwarded: shouldAwardPoints,
        answers: answersReview.map(a => ({ 
            questionId: a.questionId, 
            selectedOptionIndex: a.userAnswerIndex, 
            isCorrect: a.isCorrect 
        }))
    };

    await dbService.create({ model: QuizResult, data: resultData });

    // 5. Update User Points (Atomic Increment) if eligible
    if (shouldAwardPoints) {
        await dbService.findOneAndUpdate({
            model: User,
            filter: { _id: userId },
            data: { $inc: { points: score } }, // زود النقط على القديم
            options: { new: true }
        });
    }

    // 6. Response
    return successResponse({
        res,
        message: "Quiz submitted successfully",
        data: {
            score,
            totalScore: quiz.totalPoints,
            correctAnswers: correctAnswersCount,
            pointsAwarded: shouldAwardPoints ? score : 0,
            review: answersReview // Detailed feedback
        }
    });
});


export const getQuizzes = asyncHandler(async (req, res, next) => {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const quizzes = await dbService.find({
        model: Quiz,
        filter: { isActive: true , chapterId: req.user.chapterId},
        sort: { createdAt: -1 },
        select: "title isActive createdAt",
        limit: parseInt(limit),
        skip: skip
    });

    return successResponse({
        res,
        data: quizzes,
        message: "Quizzes retrieved"
    });
});



export const getAllQuizzes = asyncHandler(async (req, res, next) => {
    // 1. استقبل كود الشابتر من الـ Query
    // الشكل في الفرونت: /api/quizzes?code=cs
    const { code } = req.query; 
    console.log(code);

    let filter = { visibility: "public" }; // الديفولت: هات البابليك بس

    // 2. لو مبعوت كود، لازم نجيب الـ ID بتاعه الأول
    if (code) {
        const chapter = await Chapter.findOne({ code: code.toUpperCase() });
        
        if (!chapter) {
            return successResponse({
                res,
                data: [],
                message: "No quizzes found for this chapter"
            });
        }

        filter.chapterId = chapter._id;
    }

    // 3. هات الكويزات بناءً على الفلتر
    const quizzes = await dbService.find({ model: Quiz, filter, sort: { createdAt: -1 } ,
        populate:[{ path: "chapterId", select: "name code" }],
        select: "-questions.correctAnswerIndex -questions.options"
    });

    return successResponse({ 
        res, 
        data: quizzes, 
        message: "Quizzes retrieved successfully" 
    });
});


// ================= Get Quiz By ID (Start Quiz) =================
export const getQuizById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const quiz = await dbService.findById({ 
        model: Quiz, 
        id,
        populate: [{ path: "chapterId", select: "name code" }],
        select: "-questions.correctAnswerIndex" 
    });

    if (!quiz) return next(new Error("Quiz not found", { cause: 404 }));

    return successResponse({ res, data: quiz, message: "Quiz found successfully" });
});


export const updateQuiz = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const quiz = await dbService.findOneAndUpdate({ model: Quiz, filter: { _id: id }, data: req.body, options: { new: true } });
    return successResponse({ res, data: quiz, message: "Quiz updated successfully" });
});

export const deleteQuiz = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await dbService.deleteOne({ model: Quiz, filter: { _id: id } });
    return successResponse({ res, message: "Quiz deleted successfully" });
});