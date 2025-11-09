// events
// - _id
// - title (string)
// - description (string)
// - coverImage (url)
// - chapterId (ObjectId)
// - createdBy (chairId)
// - startDate (Date)
// - endDate (Date)
// - location (string)
// - registrationRequired (boolean)
// - registrationLink (string)
// - visibility (public/private)
// - status (upcoming/past)
// - createdAt, updatedAt

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
    coverImage: {
        type: String,
        required: true,
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Committee",
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        // required: true,
    },
    location: {
        type: String,
        required: true,
    },
    registrationRequired: {
        type: Boolean,
        // required: true,
    },
    registrationLink: {
        type: String,
        // required: true,
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        // required: true,
    },
    status: {
        type: String,
        enum: ["upcoming", "past"],
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Event", eventSchema);
    