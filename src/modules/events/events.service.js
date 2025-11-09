import * as DBservice from "../DB/DB.service.js";
import User from "../models/userModel.js";
import * as bcrypt from "../utils/security/bycrept.js";
import { asyncHandler, successResponse , globalErrorHandler } from "../utils/response.js";
import * as jwt from "../utils/security/jwt.security.js";

export const createEvent = asyncHandler(async (req, res) => {
    const {title , description , coverImage , location , startDate , endDate , registrationRequired , registrationLink , visibility} = req.body;
    const event = await DBservice.create({ model: "Event", data: {title , description , coverImage , location , startDate , endDate , registrationRequired , registrationLink , visibility} });
    return successResponse(res, event , "event created successfully");
})

export const getAllEvents = asyncHandler(async (req, res) => {
    const events = await DBservice.find({ model: "Event" });
    return successResponse(res, events , "events found successfully");
})

export const getEventById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await DBservice.findOne({ model: "Event", filter: { _id: id } });
    return successResponse(res, event , "event found successfully");
})

export const updateEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await DBservice.findOne({ model: "Event", filter: { _id: id } });
    const updatedEvent = await DBservice.update({ model: "Event", filter: { _id: id }, data: req.body });
    return successResponse(res, updatedEvent , "event updated successfully");
})

export const deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await DBservice.findOne({ model: "Event", filter: { _id: id } });
    const deletedEvent = await DBservice.delete({ model: "Event", filter: { _id: id } });
    return successResponse(res, deletedEvent , "event deleted successfully");
})

