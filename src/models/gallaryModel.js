// gallery
// - _id
// - chapterId (ObjectId)
// - uploadedBy (chairId)
// - imageUrl (string)
// - title (string)
// - description (string)
// - eventId (ObjectId, optional)
// - uploadedAt (Date)

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Committee",
    },
    imageUrl: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Gallery", gallerySchema);