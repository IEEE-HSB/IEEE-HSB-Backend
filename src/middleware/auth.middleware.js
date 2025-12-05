import User from "../models/userModel.js"
import * as jwt from "../utils/security/jwt.security.js"
import * as DBservice from "../DB/DB.service.js"
import { asyncHandler, successResponse , globalErrorHandler } from "../utils/response.js"



export const authMiddleware = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(new Error("Unauthorized"));
    }
    const token = authorization.split(" ")[1];
    const payload = jwt.verifyToken(token , process.env.JWT_SECRET);
    if (!payload) {
        return next(new Error("Unauthorized"));
    }
    const user = await DBservice.findOne({ model: User, filter: { _id: payload.userId } });
    if (!user) {
        return next(new Error("Unauthorized"));
    }
    req.user = user;
    next();
})
