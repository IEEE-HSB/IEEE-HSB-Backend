import User from "../../models/userModel.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as dbService from "../../DB/DB.Service.js";
import QuizResult from "../../models/quizResult.model.js";
// ================= Get Global Leaderboard =================
export const getLeaderboard = asyncHandler(async (req, res, next) => {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const leaderboard = await dbService.find({
        model: User,
        filter: { points: { $gt: 0 } },
        sort: { points: -1 },
        select: "name points level badges chapterId",
        populate: [{ path: "chapterId", select: "code name" }],
        limit: parseInt(limit),
        skip: skip
    });

    return successResponse({
        res,
        data: leaderboard,
        message: "Global leaderboard retrieved"
    });
});

// ================= Get User Activity Log =================


export const getUserActivity = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const activities = await dbService.find({
        model: QuizResult,
        filter: { userId },
        sort: { createdAt: -1 },
        populate: [{ path: "quizId", select: "title committee" }]
    });

    // بنعمل Formatting عشان نرجع شكل لطيف للفرونت
    const formattedActivity = activities.map(act => ({
        action: "Quiz Attempt",
        quizTitle: act.quizId?.title || "Deleted Quiz",
        score: act.score,
        pointsEarned: act.pointsAwarded ? act.score : 0,
        date: act.createdAt
    }));

    return successResponse({
        res,
        data: formattedActivity,
        message: "User activity retrieved"
    });
});