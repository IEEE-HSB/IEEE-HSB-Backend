import mongoose from "mongoose";

// ==========================================
// 1. Create (FIXED)
// ==========================================
export const create = async ({ model, data = {}, options = {} } = {}) => {
    // لو بنعمل create لarray، نستخدم insertMany (بتقبل options)
    if (Array.isArray(data)) {
        return await model.insertMany(data, options);
    }
    
    // لو بنعمل create لـ single object، نبعت الداتا بس
    // Mongoose create(doc) مش محتاجة options في أغلب الحالات العادية
    return await model.create(data);
}

// ==========================================
// 2. Find One
// ==========================================
export const findOne = async ({ model, filter = {}, select = "", populate = [] } = {}) => {
    let query = model.findOne(filter).select(select);
    
    // Support single populate object or array of populate objects
    if (populate && (populate.length > 0 || typeof populate === 'object')) {
        query = query.populate(populate);
    }
    
    return await query;
}

// ==========================================
// 3. Find All (Get Many)
// ==========================================
export const find = async ({ model, filter = {}, select = "", populate = [], skip = 0, limit = 100, sort = {} } = {}) => {
    let query = model.find(filter).select(select).sort(sort).skip(skip).limit(limit);
    
    if (populate && populate.length > 0) {
        query = query.populate(populate);
    }
    
    return await query;
}

// ==========================================
// 4. Find By ID
// ==========================================
export const findById = async ({ model, id, select = "", populate = [] } = {}) => {
    let query = model.findById(id).select(select);
    
    if (populate && populate.length > 0) {
        query = query.populate(populate);
    }
    
    return await query;
}

// ==========================================
// 5. Update One
// ==========================================
export const findOneAndUpdate = async ({ model, filter = {}, data = {}, options = { new: true, runValidators: true } } = {}) => {
    // Default options: new: true (رجع الداتا بعد التعديل)، runValidators (تأكد ان الداتا صح)
    return await model.findOneAndUpdate(filter, data, options);
}

// ==========================================
// 6. Delete One
// ==========================================
export const deleteOne = async ({ model, filter = {} } = {}) => {
    return await model.deleteOne(filter);
}