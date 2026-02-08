import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    quizId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz", 
        required: true 
    },
    score: { type: Number, required: true }, // الدرجة اللي جابها
    totalScore: { type: Number, required: true }, // الدرجة النهائية للكويز وقتها
    isPassed: { type: Boolean, default: false },
    attemptNumber: { type: Number, default: 1 }, // المحاولة رقم كام
    pointsAwarded: { type: Boolean, default: false },
    answers: [{ // عشان لو حبيت تراجع إجاباته
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOptionIndex: Number,
        isCorrect: Boolean
    }]
}, { timestamps: true });

// عشان نسرع البحث عن نتايج يوزر معين في كويز معين
quizResultSchema.index({ userId: 1, quizId: 1 });

export default mongoose.model("QuizResult", quizResultSchema);