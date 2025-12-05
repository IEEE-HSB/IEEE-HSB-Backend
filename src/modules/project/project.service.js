import Project from "../../models/projectModel.js";
import Chapter from "../../models/chapterModel.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import { uploadFileCloud, deleteFileCloud } from "../../utils/multier/cloudinary.js";

// ================= Create Project =================
export const createProject = asyncHandler(async (req, res, next) => {
    const { title, description, chapterId, link } = req.body;

    const chapterCode = chapterId.toString().toUpperCase();
    const chapter = await Chapter.findOne({ code: chapterCode });
    
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

    // 3. الحفظ في الداتابيز
    const project = await Project.create({
        title,
        description,
        chapterId: chapter._id,
        image: mainImage,
        subImages: subImagesList,
        createdBy:req.user.name,
        link
    });

    return successResponse({ res, data: project, message: "Project created successfully", statusCode: 201 });
});

// ================= Get All Projects =================
export const getAllProjects = asyncHandler(async (req, res, next) => {
    const { chapterId } = req.query;
    let filter = {};

    // 1. الفلترة بكود الشابتر
    if (chapterId) {
        const chapter = await Chapter.findOne({ code: chapterId.toUpperCase() });
        if (chapter) {
            filter.chapterId = chapter._id;
        } else {
            return successResponse({ res, data: [], message: "No projects found" });
        }
    }

    // 2. البحث والـ Populate
    const projects = await Project.find(filter)
        .populate("chapterId", "code") // عشان نرجع الكود "RAS" مش الـ ID بس
        .sort({ createdAt: -1 });

    // 3. تنسيق الرد (عشان يطابق الـ Example Response)
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
    const project = await Project.findById(id).populate("chapterId", "code");
    
    if (!project) return next(new Error("Project not found"));

    return successResponse({ res, data: project, message: "Project found" });
});

// ================= Update Project (PATCH) =================
export const updateProject = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return next(new Error("Project not found"));

    // ناخد نسخة من البيانات الجديدة
    let updateData = { ...req.body };

    // 1. تحديث الصورة الرئيسية
    if (req.files?.image) {
        // مسح القديمة لو موجودة
        if (project.image?.public_id) {
            await deleteFileCloud({ public_id: project.image.public_id });
        }
        // رفع الجديدة
        const { secure_url, public_id } = await uploadFileCloud({
            file: req.files.image[0],
            path: "projects/main"
        });
        updateData.image = { secure_url, public_id };
    }

    // 2. تحديث الصور الفرعية (استبدال كامل)
    if (req.files?.subImages) {
        // مسح القديم
        if (project.subImages?.length > 0) {
            for (const img of project.subImages) {
                await deleteFileCloud({ public_id: img.public_id });
            }
        }
        // رفع الجديد
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

    // 3. التحديث في الداتابيز
    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });
    
    return successResponse({ res, data: updatedProject, message: "Project updated successfully" });
});

// ================= Delete Project =================
export const deleteProject = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return next(new Error("Project not found"));

    if (project.image?.public_id) {
        await deleteFileCloud({ public_id: project.image.public_id });
    }

    if (project.subImages?.length > 0) {
        for (const img of project.subImages) {
            await deleteFileCloud({ public_id: img.public_id });
        }
    }

    // 3. المسح من الداتابيز
    await Project.deleteOne({ _id: id });
    
    return successResponse({ res, message: "Project deleted successfully" });
});