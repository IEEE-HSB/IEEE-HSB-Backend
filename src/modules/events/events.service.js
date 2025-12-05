import Event from "../../models/eventModel.js";
import Chapter from "../../models/chapterModel.js";
import * as DBservice from "../../DB/DB.service.js";
import { asyncHandler, successResponse , globalErrorHandler } from "../../utils/response.js";
import { uploadFileCloud, deleteFileCloud } from "../../utils/multier/cloudinary.js";

export const createEvent = asyncHandler(async (req, res, next) => {
    const {
        name,
        title,
        location,
        details,
        moreDetails,
        link,
        chapterId,
        date,
        endTime
    } = req.body;


    console.log("req.body", req.body);
    

    if (!req.file) { 
        return next(new Error("Image is required"));
    }


    console.log("chapterId", chapterId);
    

    const chapter = await DBservice.findOne({
        model: Chapter,
        filter: { code: chapterId }
    });
    console.log(chapter);
    
    
    if (!chapter) return next(new Error("Invalid Chapter Code"));

    const { secure_url, public_id } = await uploadFileCloud({
        file: req.file,
        path: "events"
    });


    const start = new Date(date);
    const end = new Date(start.getTime() + (endTime || 2) * 60 * 60 * 1000);
    const status = start > new Date() ? "upcoming" : "past";

    // 4. الحفظ
    const event = await DBservice.create({
        model: Event,
        data: {
            title: title,
            description: details,
            moreDetails,
            location,
            startDate: start,
            endDate: end,
            registrationRequired: !!link,
            registrationLink: link || "",
            visibility: "public",
            coverImage: { secure_url, public_id },
            chapterId: chapter._id,
            status
        }
    });

    return successResponse({res, data: event, message: "Event created successfully" , status: 201});
});

export const getAllEvents = asyncHandler(async (req, res, next) => {
    const { chapterId } = req.query;

    let filter = {};

    if (chapterId) {
        const chapter = await DBservice.findOne({ model: Chapter, filter: { code: chapterId } });
        if (chapter) {
            filter.chapterId = chapter._id;
        } else {
            return successResponse(res, { events: {} }, "No events found (Invalid Chapter)");
        }
    }

    // 2. هات كل الإيفنتات (واعمل Populate عشان نعرف اسم الشابتر)
    const events = await Event.find(filter).populate("chapterId", "code").sort({ startDate: -1 });

    // 3. تجميع بالسنين (Grouping Logic)
    const groupedEvents = events.reduce((acc, event) => {
        const year = new Date(event.startDate).getFullYear().toString();
        
        if (!acc[year]) acc[year] = [];

        acc[year].push({
            id: event._id,
            name: event.title,
            date: event.startDate.toISOString().split('T')[0],
            location: event.location,
            details: event.description,
            moreDetails: event.moreDetails,
            image: event.coverImage.secure_url,
            chapterId: event.chapterId?.code || "General" // نرجع "CS" للفرونت
        });

        return acc;
    }, {});

    return successResponse({res, data: groupedEvents, message: "Events found successfully" , status: 200});
});

export const getEventById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const event = await DBservice.findOne({ model: Event, filter: { _id: id } });
    
    if(!event) return next(new Error("Event not found"));

    return successResponse({res, data: event, message: "Event found successfully" , status: 200});
});

export const updateEvent = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let updateData = req.body;

    const event = await DBservice.findOne({ model: Event, filter: { _id: id } });
    if (!event) return next(new Error("Event not found"));

    if (req.file) {
        if (event.coverImage?.public_id) {
            await deleteFileCloud({ public_id: event.coverImage.public_id });
        }
        const { secure_url, public_id } = await uploadFileCloud({
            file: req.file,
            path: "events"
        });
        updateData.coverImage = { secure_url, public_id };
    }

    const updatedEvent = await DBservice.findOneAndUpdate({
        model: Event,
        filter: { _id: id },
        data: updateData
    });

    return successResponse({res, data: updatedEvent, message: "Event updated successfully" , status: 200});
});

export const deleteEvent = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    
    const event = await DBservice.findOne({ model: Event, filter: { _id: id } });
    console.log(event);
    
    if (!event) return next(new Error("Event not found"));

    if (event.coverImage?.public_id) {
        await deleteFileCloud({ public_id: event.coverImage.public_id });
    }

    const deletedEvent = await DBservice.deleteOne({ model: Event, filter: { _id: id } });
    return successResponse({res, data: deletedEvent, message: "Event deleted successfully" , status: 200});
});