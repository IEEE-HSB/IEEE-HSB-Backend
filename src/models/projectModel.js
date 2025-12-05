import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
        required: true
    },
    image: {
        secure_url: { type: String },
        public_id: { type: String }
    },
    subImages: [{
        secure_url: { type: String },
        public_id: { type: String }
    }],
    createdBy: {
        type: String,
        required: true
    },
    link: {
        type: String,
    }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);