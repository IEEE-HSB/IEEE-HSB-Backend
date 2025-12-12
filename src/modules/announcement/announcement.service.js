import Announcement from "../../models/announcementModel.js";
import { asyncHandler, successResponse } from "../../utils/response.js";

export const createAnnouncement = asyncHandler(async (req, res, next) => {
    const { title, description , link } = req.body;
    const announcement = await Announcement.create({ title, description , link });
    return successResponse({ res, data: announcement, message: "Announcement created successfully" });
});

export const getAllAnnouncements = asyncHandler(async (req, res, next) => {
    const announcements = await Announcement.find().sort({ createdAt: -1 })
    const formatResponse = announcements.map(announcement => ({
        id: announcement._id,
        title: announcement.title,
        description: announcement.description,
        link: announcement.link,
        createdAt: announcement.createdAt,
        updatedAt: announcement.updatedAt
    }))
    return successResponse({ res, data: formatResponse, message: "Announcements found successfully" });
});

export const getAnnouncementById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);
    return successResponse({ res, data: announcement, message: "Announcement found successfully" });
});

export const updateAnnouncement = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndUpdate(id, req.body, { new: true });
    return successResponse({ res, data: announcement, message: "Announcement updated successfully" });
});

export const deleteAnnouncement = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await Announcement.findByIdAndDelete(id);
    return successResponse({ res, message: "Announcement deleted successfully" });
});