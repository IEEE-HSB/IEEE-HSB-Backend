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
    coverImage: [{
        secure_url: {
            type: String,
        },
        public_id: {
            type: String,
        }
    }],
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
    },
    // createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Committee",
    //     default: null,
    // },
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
});
const Event = mongoose.model("Event", eventSchema);

export default Event;
    