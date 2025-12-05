import mongoose from "mongoose";
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    moreDetails: { // ضفنا ده عشان التاسك
        type: String, 
    },
    coverImage: { // خليناها Object واحد
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
        required: true
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    location: {
        type: String,
    },
    registrationRequired: {
        type: Boolean,
        default: false,
    },
    registrationLink: {
        type: String,
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public",
    },
    status: {
        type: String,
        enum: ["upcoming", "past"],
        default: "upcoming",
    },
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;