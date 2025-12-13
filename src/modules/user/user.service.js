import User from "../../models/userModel.js";
import { USER_STATUS } from "../../utils/enums/status.enum.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBservice from "../../DB/DB.service.js";

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await DBservice.find({ model: User });
    return successResponse({ res, data: users, message: "Users found successfully" });
})
export const updateUserStates = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { states } = req.body;
    console.log(states);
    
    if(!states || !Object.values(USER_STATUS).includes(states)){
        return next(new Error("Invalid states"));
    }
    const user = await DBservice.findById({ model: User, id: id});
    if(!user){
        return next(new Error("User not found"));
    }
    const updatedUser = await DBservice.findOneAndUpdate({ model: User, filter: { _id: id }, data: { status: states } });
    console.log(updatedUser);
    return successResponse({ res, data: updatedUser, message: "States updated successfully" });
});

export const getMe = asyncHandler(async(req,res,next)=>{
    const {_id}=req.user;
    console.log(req.user);
    const user = await DBservice.findOne({ model: User, filter: { _id }, populate: { path: "chapterId", select: "code name" }});
    if(!user){
        return next(new Error("User not found"));
    }
    const response={
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        chapter: user.chapterId
        ? {
            id: user.chapterId._id,
            code: user.chapterId.code,
            name: user.chapterId.name,
          }
        : null,
        status: user.status,
        committee:user.committee,
        level:user.level,
        points:user.points,
        badges:user.badges
    }

    return successResponse({ res, data: response, message: "User found successfully" });
    
})

