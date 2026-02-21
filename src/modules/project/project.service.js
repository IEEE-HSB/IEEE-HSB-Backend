import Project from "../../models/projectModel.js";
import Chapter from "../../models/chapterModel.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import { uploadFileCloud, deleteFileCloud } from "../../utils/multier/cloudinary.js";
// 1. استيراد ملف الـ DB Service
import * as dbService from "../../DB/DB.service.js"; 

// ================= Create Project =================
export const createProject = asyncHandler(async (req, res, next) => {
    const { title, description, chapterId, link } = req.body;

    const chapterCode = chapterId.toString().toUpperCase();
    
    // استخدام dbService.findOne بدلاً من Chapter.findOne
    const chapter = await dbService.findOne({ 
        model: Chapter, 
        filter: { code: chapterCode } 
    });
    
    if (!chapter) return next(new Error("Invalid Chapter Code"));

    // 2. تجهيز الصور
    let mainImage = {};
    let subImagesList = [];

    if (req.files?.image) {
        const { secure_url, public_id } = await uploadFileCloud({
            file: req.files.image[0],
            path: "projects/main"
        });
        mainImage = { secure_url, public_id };
    }

    if (req.files?.subImages) {
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await uploadFileCloud({
                file: file,
                path: "projects/subs"
            });
            subImagesList.push({ secure_url, public_id });
        }
    }

    // 3. الحفظ في الداتابيز باستخدام dbService.create
    const project = await dbService.create({
        model: Project,
        data: {
            title,
            description,
            chapterId: chapter._id,
            image: mainImage,
            subImages: subImagesList,
            createdBy: req.user.name,
            link
        }
    });

    return successResponse({ res, data: project, message: "Project created successfully", statusCode: 201 });
});

// ================= Get All Projects =================
export const getAllProjects = asyncHandler(async (req, res, next) => {
    const { chapterId } = req.query;
    let filter = {};

    // 1. الفلترة بكود الشابتر
    if (chapterId) {
        const chapter = await dbService.findOne({ 
            model: Chapter, 
            filter: { code: chapterId.toUpperCase() } 
        });
        
        if (chapter) {
            filter.chapterId = chapter._id;
        } else {
            return successResponse({ res, data: [], message: "No projects found" });
        }
    }

    // 2. البحث والـ Populate باستخدام dbService.find
    const projects = await dbService.find({
        model: Project,
        filter: filter,
        populate: { path: "chapterId", select: "code" }, // تمرير الـ populate كـ object
        sort: { createdAt: -1 }
    });

    // 3. تنسيق الرد
    const formattedProjects = projects.map(p => ({
        id: p._id,
        title: p.title,
        description: p.description,
        chapterId: p.chapterId?.code || "General",
        image: p.image?.secure_url || "",
        subImages: p.subImages?.map(img => img.secure_url) || [],
        createdBy: p.createdBy,
        link: p.link || "",
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
    }));

    return successResponse({ res, data: formattedProjects, message: "Projects retrieved successfully" });
});

// ================= Get Single Project =================
export const getProjectById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    
    // استخدام dbService.findById
    const project = await dbService.findById({
        model: Project,
        id: id,
        populate: { path: "chapterId", select: "code" }
    });
    
    if (!project) return next(new Error("Project not found"));

    return successResponse({ res, data: project, message: "Project found" });
});

// ================= Update Project (PATCH) =================
export const updateProject = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    
    // استخدام dbService.findById للتأكد من وجود المشروع
    const project = await dbService.findById({ model: Project, id });
    if (!project) return next(new Error("Project not found"));

    let updateData = { ...req.body };

    // 1. تحديث الصورة الرئيسية
    if (req.files?.image) {
        if (project.image?.public_id) {
            await deleteFileCloud({ public_id: project.image.public_id });
        }
        const { secure_url, public_id } = await uploadFileCloud({
            file: req.files.image[0],
            path: "projects/main"
        });
        updateData.image = { secure_url, public_id };
    }

    // 2. تحديث الصور الفرعية
    if (req.files?.subImages) {
        if (project.subImages?.length > 0) {
            for (const img of project.subImages) {
                await deleteFileCloud({ public_id: img.public_id });
            }
        }
        let newSubs = [];
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await uploadFileCloud({
                file: file,
                path: "projects/subs"
            });
            newSubs.push({ secure_url, public_id });
        }
        updateData.subImages = newSubs;
    }

    // 3. التحديث في الداتابيز باستخدام dbService.findOneAndUpdate
    const updatedProject = await dbService.findOneAndUpdate({
        model: Project,
        filter: { _id: id },
        data: updateData
    });
    
    return successResponse({ res, data: updatedProject, message: "Project updated successfully" });
});

// ================= Delete Project =================
export const deleteProject = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    
    // استخدام dbService.findById
    const project = await dbService.findById({ model: Project, id });
    if (!project) return next(new Error("Project not found"));

    if (project.image?.public_id) {
        await deleteFileCloud({ public_id: project.image.public_id });
    }

    if (project.subImages?.length > 0) {
        for (const img of project.subImages) {
            await deleteFileCloud({ public_id: img.public_id });
        }
    }

    // 3. المسح من الداتابيز باستخدام dbService.deleteOne
    await dbService.deleteOne({
        model: Project,
        filter: { _id: id }
    });
    
    return successResponse({ res, message: "Project deleted successfully" });
});