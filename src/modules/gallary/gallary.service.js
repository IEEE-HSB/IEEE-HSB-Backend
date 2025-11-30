import * as DBservice from '../../DB/DB.service.js'
import { asyncHandler, successResponse , globalErrorHandler } from '../../utils/response.js';
import galleryModel from "../../";

export const getAllGallery = asyncHandler(async (req, res) => {
    const gallery = await DBservice.find({ model: "Gallery" });
    return successResponse(res, gallery , "gallery found successfully");
})

export const getGalleryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const gallery = await DBservice.findById({ model: "Gallery", id : id });
    return successResponse(res, gallery , "gallery found successfully");
})