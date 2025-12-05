import * as DBservice from "../../DB/DB.service.js";
import User from "../../models/userModel.js";
import * as bcrypt from "../../utils/security/bycrept.js";
import { asyncHandler, successResponse , globalErrorHandler } from "../../utils/response.js";
import * as jwt from "../../utils/security/jwt.security.js";
import { USER_STATUS } from "../../utils/enums/status.enum.js";
import Chapter from "../../models/chapterModel.js";

export const register = asyncHandler(async (req, res , next) => {
    const { name , email , password , role , chapterId , committeeId } = req.body;
    console.log(req.body)
    if (!name || !email || !password || !role) {
        return next(new Error("All fields are required"));
    }
    if(await DBservice.findOne({ model: User, filter: { email } })){
        return next(new Error("User already exists"));
    }
    const hashedPassword = await bcrypt.hashPassword(password);
    const user = await DBservice.create({ model: User, data: { name, email, passwordHash: hashedPassword ,role , chapterId , committeeId } });
    let chapterObjectId = null;

    if (chapterId) {
      const chapter = await DBservice.findOne({ model: Chapter, filter: { code: chapterId } });
      if (!chapter) {
        return next(new Error("Invalid chapter code"));
      }
      chapterObjectId = chapter._id;
    }
    const accessToken = jwt.generateToken({ payload: { userId: user._id } });

    const refreshToken = jwt.generateToken({ payload: { userId: user._id }, secret: process.env.JWT_SECRET_REFRESH });
    
    return successResponse(res, user , "user created successfully" , 201);
})


export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    // البحث عن المستخدم
    const user = await DBservice.findOne({ model: User, filter: { email } }); // Exclude password from the response
    console.log(user);
    if (!user) {
      return next(new Error("Invalid email or password", { cause: 401 }));
    }
  
    const isPasswordValid = await bcrypt.comparePassword(
      password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      return next(new Error("Invalid email or password", { cause: 401 }));
    }
    // if(user.status === USER_STATUS.PENDING){
    //     return next(new Error("User is pending", { cause: 401 }));
    // }

    const response = 
    {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        chapterId: user.chapterId,
        committeeId: user.committeeId,
        status: user.status,
        points: user.points,
        level: user.level,
        badges: user.badges,
        invitedBy: user.invitedBy,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }

    const { accessToken: token, refreshToken: refresh_Token} =
      jwt.createTokens({
        payload: { userId: user._id },
        accessExpiresIn: process.env.JWT_EXPIRE,
        refreshExpiresIn: process.env.JWT_EXPIRE_REFRESH,
        accessSecret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_SECRET_REFRESH,
      });
  
    // const token = jsonwebtoken.generateToken({
    //   payload: { userId: user._id },
    //   secret: signtures.secretKey.accessKey
    // });
  
    // const refresh_Token = jsonwebtoken.refreshToken({
    //   userId: user._id,
    //   secret: signtures.refreshKey
    // });
    // console.log("refresh_Token", refresh_Token);
    // console.log("expired time to refresh",process.env.JWT_EXPIRE_REFRESH);
    
    // console.log("secretkaysysysy", signtures.secretKey.accessKey);
  
    return successResponse({
      res,
      data: {
        ...response,
        accessToken: token,
        refreshToken: refresh_Token,
      },
      message: "User logged in successfully",
      status: 200,
    });
  });
