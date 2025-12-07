import mongoose from "mongoose";
import { USER_LEVELS, USER_ROLES, USER_STATUS } from "../utils/enums/index.js";
import { COMMITTEES } from "../utils/enums/committe.enum.js";
export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
        
    },
    role: {
        type: String,
        enum: Object.values(USER_ROLES),
        default: USER_ROLES.PARTICIPANT,
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
    },
    committee: {
        type: String,
        enum: Object.values(COMMITTEES),
        default: COMMITTEES.OTHER,
    },
    status: {
        type: String,
        enum: Object.values(USER_STATUS),
        default: USER_STATUS.PENDING,
    },
    points: {
        type: Number,
        default: 0,
    },
    level: {
        type: String,
        enum: Object.values(USER_LEVELS),
        default: USER_LEVELS.BRONZE,
    },
    badges: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Badge",
        default: [],
    },
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    HashOtp: {
        type: String
    },
    otpExpireAt: {
        type: Date
    },
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;
