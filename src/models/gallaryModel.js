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
    imageUrl:[
        {
            secure_url: {
                type: String,
            },
            public_id: {
                type: String,
            }
        }
    ],
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