import mongoose from "mongoose";

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
        enum: ["guest", "participant", "volunteer", "director", "chair", "admin"],
        default: "guest",
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
    },
    committeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Committee",
    },
    status: {
        type: String,
        enum: ["pending", "active", "rejected"],
        default: "pending",
    },
    points: {
        type: Number,
        default: 0,
    },
    level: {
        type: String,
        enum: ["bronze", "silver", "gold"],
        default: "bronze",
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
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;

//users
// - _id (ObjectId)
// - name (string)
// - email (string)
// - passwordHash (string)
// - role (string: guest/participant/volunteer/director/chair/admin)
// - chapterId (ObjectId)
// - committeeId (ObjectId) // optional
// - status (string: pending/active/rejected)
// - points (number)
// - level (string)
// - badges (array of ObjectId badgeIds)
// - invitedBy (ObjectId)
// - createdAt, updatedAt
