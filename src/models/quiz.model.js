import mongoose from "mongoose";
import { CHAPTER, COMMITTEES } from "../utils/enums/index.js";

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number, required: true },
    points: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    
    // --- (1) Added Level ---
    level: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium"
    },

    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
        required: true
    },
    committee: {
        type: String,
        enum: Object.values(COMMITTEES),
        default: COMMITTEES.OTHER
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },
    
    startDate: { type: Date },
    endDate: { type: Date },
    allowMultipleAttempts: { type: Boolean, default: true },

    timeLimit: { type: Number, default: 10 }, 
    questions: [questionSchema], 
    totalPoints: { type: Number, default: 0 },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

quizSchema.pre('save', function(next) {
    if (this.questions) {
        this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 0), 0);
    }
    next();
});

export default mongoose.model("Quiz", quizSchema);