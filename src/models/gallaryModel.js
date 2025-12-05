import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    image: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String, 
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export default mongoose.model("Gallery", gallerySchema);