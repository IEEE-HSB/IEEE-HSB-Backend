import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
    }
}, { timestamps: true });

export default mongoose.model("Announcement", announcementSchema);