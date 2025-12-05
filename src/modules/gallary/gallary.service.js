import Gallery from "../../models/gallaryModel.js"; // تأكد من اسم الملف
import Chapter from "../../models/chapterModel.js";
import * as DBservice from "../../DB/DB.service.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import { uploadFileCloud, deleteFileCloud } from "../../utils/multier/cloudinary.js";

// ================= Create Gallery Item =================
export const createGallery = asyncHandler(async (req, res, next) => {
    const { title, description, chapterId, eventId } = req.body;

    // console.log("req.file", req.file);
    // console.log("req.body", req.body);
    // console.log("req.user", req.user);

    if (!req.file) return next(new Error("Image is required"));

    const chapterCode = chapterId.toString().toUpperCase();
    const chapter = await DBservice.findOne({ 
        model: Chapter, 
        filter: { code: chapterCode } 
    });

    if (!chapter) return next(new Error("Invalid Chapter Code"));

    // 3. Upload to Cloudinary
    const { secure_url, public_id } = await uploadFileCloud({
        file: req.file,
        path: "gallery"
    });

    const galleryItem = await Gallery.create({
        title,
        description,
        chapterId: chapter._id,
        image: { secure_url, public_id },
        eventId: eventId || undefined,
        // uploadedBy: req.user._id // (لما تشغل ال auth)
    });

    return successResponse({
        res, 
        data: galleryItem, 
        message: "Gallery item created successfully", 
        statusCode: 201
    });
});

// ================= Get All Gallery (With Filter) =================
export const getAllGallery = asyncHandler(async (req, res, next) => {
    const { chapterId } = req.query; // ?chapterId=CS
    let filter = {};

    // 1. لو فيه فلتر، نجيب الـ ID بتاع الشابتر
    if (chapterId) {
        const chapter = await DBservice.findOne({ 
            model: Chapter, 
            filter: { code: chapterId.toUpperCase() } 
        });
        
        if (chapter) {
            filter.chapterId = chapter._id;
        } else {
            // لو الكود غلط، نرجع array فاضي
            return successResponse({ res, data: [], message: "No items found (Invalid Chapter)" });
        }
    }

    // 2. هات الصور واعمل populate عشان نرجع كود الشابتر للفرونت
    const galleryItems = await Gallery.find(filter)
        .populate("chapterId", "code name")
        .sort({ createdAt: -1 });

    // 3. تنسيق الداتا (اختياري، عشان ترجع بالشكل اللي الفرونت عايزه)
    const formattedData = galleryItems.map(item => ({
        id: item._id,
        title: item.title,
        description: item.description,
        image: item.image.secure_url,
        chapterId: item.chapterId?.code || "General", // Return "CS"
        createdAt: item.createdAt
    }));

    return successResponse({ res, data: formattedData, message: "Gallery items found successfully" });
});

// ================= Get Single Item =================
export const getGalleryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    
    const item = await DBservice.findOne({ model: Gallery, filter: { _id: id } });
    
    if (!item) return next(new Error("Gallery item not found"));
    
    return successResponse({ res, data: item, message: "Item found" });
});

// ================= Delete Gallery Item =================
export const deleteGalleryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // 1. هات العنصر عشان نعرف الـ public_id
    const item = await DBservice.findOne({ model: Gallery, filter: { _id: id } });
    if (!item) return next(new Error("Gallery item not found"));

    // 2. امسح الصورة من Cloudinary
    if (item.image?.public_id) {
        await deleteFileCloud({ public_id: item.image.public_id });
    }

    // 3. امسح من الداتابيز
    await DBservice.deleteOne({ model: Gallery, filter: { _id: id } });

    return successResponse({ res, message: "Gallery item deleted successfully" });
});