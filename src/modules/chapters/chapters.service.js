import * as DBservice from '../../DB/DB.service.js'
import chapterModel from "../../models/chapterModel.js";
import { asyncHandler, successResponse , globalErrorHandler } from '../../utils/response.js';


export const getAllChapters = asyncHandler(async (req, res) => {
    const chapters = await DBservice.find({ model: chapterModel });
    return successResponse({ res, data: chapters, message: "Chapters found successfully" });
})

export const getChapterByIdCommittee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const chapter = await DBservice.findById({ model: chapterModel, id : id });
    return successResponse(res, chapter , "chapter found successfully");
})

export const createChapter = asyncHandler(async (req, res) => {
    const {code , name , brief , description} = req.body;
    const chapter = await DBservice.create({ model: chapterModel, data: {code , name , brief , description} });
    return successResponse(res, chapter , "chapter created successfully");
})

export const createChapterCommittee = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {chapterId , name , description} = req.body;
    const chapter = await DBservice.findById({ model: chapterModel, id : id });
    if(!chapter){
        return next(new Error("chapter not found"));
    }
    const committee = await DBservice.create({ model: chapterModel, data: {chapterId , name , description} });
    return successResponse(res, committee , "committee created successfully");
})

