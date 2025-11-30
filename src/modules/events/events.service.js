import * as DBservice from "../../DB/DB.service.js";
import { asyncHandler, successResponse , globalErrorHandler } from "../../utils/response.js";
import * as jwt from "../../utils/security/jwt.security.js";
import { uploadFilesCloud ,uploadFileCloud, deleteFileCloud  } from "../../utils/multier/cloudinary.js";
import Event from "../../models/eventModel.js";

export const createEvent = asyncHandler(async (req, res) => {
    const {
        name,
        location,
        details,
        link,
        chapterId,
        endTime
    } = req.body;
    console.log(req.user)
    console.log(req.file);
    
    if (!req.file) { 
        return new Error("Image is required");
    }

    // رفع الصورة على Cloudinary
    const { secure_url, public_id } = await uploadFileCloud({
        file: req.file,
        path: "events"
    });

    const start = new Date();
    const status = start > new Date() ? "upcoming" : "past";
    const end = new Date(start.getTime() + (endTime || 2 )*60 * 60 * 1000);
    const event = await DBservice.create({
        model: Event,
        data: {
            title: name,
            description: details,
            location: location,
            startDate: start,
            endDate: end,
            registrationRequired: !!link,
            registrationLink: link || "",
            visibility: "public",
            coverImage: [{ secure_url, public_id }],
            chapterId : chapterId,
            // createdBy: req.user._id,
            status: status
        }
    });

    return successResponse(res, event, "Event created successfully");
});



export const getAllEvents = asyncHandler(async (req, res) => {
    const events = await DBservice.find({ model: "Event" });
    return successResponse(res, events , "events found successfully");
})

export const getEventById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await DBservice.findOne({ model: "Event", filter: { _id: id } });
    return successResponse(res, event , "event found successfully");
})

export const updateEvent = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let updateData = req.body;

    const event = await DBservice.findOne({ model: "Event", filter: { _id: id } });
    if (!event) {
        return next(new Error("Event not found"));
    }

    // لو في صورة جديدة
    if (req.file) {
        if (event.coverImage?.length > 0) {
            const oldImage = event.coverImage[0].public_id;
            if (oldImage) await deleteFileCloud({ public_id: oldImage });
        }

        const { secure_url, public_id } = await uploadFileCloud({
            file: req.file,
            path: "events"
        });

        updateData.coverImage = [{ secure_url, public_id }];
    }

    const updatedEvent = await DBservice.findOneAndUpdate({
        model: "Event",
        filter: { _id: id },
        data: updateData
    });

    return successResponse(res, updatedEvent, "Event updated successfully");
});



export const deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await DBservice.findOne({ model: "Event", filter: { _id: id } });
    const deletedEvent = await DBservice.delete({ model: "Event", filter: { _id: id } });
    return successResponse(res, deletedEvent , "event deleted successfully");
})

