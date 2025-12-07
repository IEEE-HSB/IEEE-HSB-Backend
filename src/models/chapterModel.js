import mongoose from "mongoose";
import { CHAPTER } from "../utils/enums/index.js";

const Schema = mongoose.Schema;
// code: "cs",
//     name: "Computer Society",
//     brief: "Dedicated to software development, programming, and emerging technologies.",
//     description:
//       "Dedicated to software development, programming, and emerging technologies.\nCS currently includes 3 specialized tracks, Web Development, Mobile Application, and Cyber Security ,providing members with hands-on experience through coding bootcamps, hackathons, and technical challenges."
const chapterSchema = new Schema({
    code: {
        type: String,
        enum: Object.keys(CHAPTER),
        uppercase: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    brief: {
        type: String,
        required: true,
    },
});

export default mongoose.model("Chapter", chapterSchema);