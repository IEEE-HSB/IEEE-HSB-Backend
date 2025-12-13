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

