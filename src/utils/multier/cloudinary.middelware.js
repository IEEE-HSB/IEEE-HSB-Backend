import multer from "multer";

export const cloudinaryValidation = {
    image : ["image/jpeg", "image/png", "image/gif", "image/webp"],
}
export const fileUpload = (validation = [])=>{
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) =>{
    if (validation.length > 0) {
        if (validation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"), false);
        }
    } else {
        cb(null, true);
    }
}

return multer({ storage, fileFilter , limits: { fileSize: 5 * 1024 * 1024 } });
}