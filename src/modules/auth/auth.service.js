import * as DBservice from "../../DB/DB.service.js";
import User from "../../models/userModel.js";
import * as bcrypt from "../../utils/security/bycrept.js";
import { asyncHandler, successResponse , globalErrorHandler } from "../../utils/response.js";
import * as jwt from "../../utils/security/jwt.security.js";
import { USER_STATUS } from "../../utils/enums/status.enum.js";
import Chapter from "../../models/chapterModel.js";
import { compareOtp, generateOTP, hashOtp, otpExpireAt } from "../../utils/security/otp.js";
import eventEmitter from "../../utils/event/event.email.js";

export const register = asyncHandler(async (req, res , next) => {
    const { name , email , password , role , chapterId , committeeId } = req.body;
    console.log(req.body)
    if (!name || !email || !password || !role) {
        return next(new Error("All fields are required"));
    }
    let chapterIdObjectId = null;
    const chapter = await DBservice.findOne({
      model: Chapter,
      filter: { code: chapterId.toString().toUpperCase() },
    })
    console.log(chapter);
    
    if (!chapter) {
      return next(new Error("Invalid chapter code"));
    }
    chapterIdObjectId = chapter._id;
    if(await DBservice.findOne({ model: User, filter: { email } })){
        return next(new Error("User already exists"));
    }
    const hashedPassword = await bcrypt.hashPassword(password);
    const user = await DBservice.create({ model: User, data: { name, email, passwordHash: hashedPassword ,role , chapterId: chapterIdObjectId , committee: committeeId } });
    let chapterObjectId = null;

    const accessToken = jwt.generateToken({ payload: { userId: user._id } });

    const refreshToken = jwt.generateToken({ payload: { userId: user._id }, secret: process.env.JWT_SECRET_REFRESH });
    
    return successResponse({ res, data: { accessToken, refreshToken }, message: "User registered successfully" });
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



  export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    
    // 1. Validation
    if (!email) {
        return next(new Error("Email is required", { cause: 400 }));
    }

    // 2. Find User
    const user = await DBservice.findOne({ model: User, filter: { email } });
    if (!user) {
        // Security Best Practice: Don't reveal if user exists or not, but for now:
        return next(new Error("User not found", { cause: 404 }));
    }

    // 3. Generate & Hash OTP
    const otp = generateOTP();
    const hashedOtp = await hashOtp(otp);
    
    // 4. Update User with OTP
    await DBservice.findOneAndUpdate({
        model: User,
        filter: { email },
        data: { 
            HashOtp: hashedOtp, 
            otpExpireAt: otpExpireAt(10) // صلاحية 10 دقايق حسب التيمبليت
        },
    });


    eventEmitter.emit("sendVerification", {
        to: user.email,
        subject: "IEEE Helwan - Reset Your Password",
        otp: otp,
    });

    return successResponse({
        res,
        message: "Reset password email sent successfully",
        statusCode: 200,
    });
});

// ================= Reset Password =================
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, otp, password, confirmPassword } = req.body;

    // 1. Validation
    if (!email || !otp || !password || !confirmPassword) {
        return next(new Error("All fields are required", { cause: 400 }));
    }
    if (password !== confirmPassword) {
        return next(new Error("Passwords do not match", { cause: 400 }));
    }

    // 2. Find User
    const user = await DBservice.findOne({ model: User, filter: { email } });
    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    // 3. Check OTP Expiration
    if (!user.otpExpireAt || user.otpExpireAt < Date.now()) {
        return next(new Error("OTP has expired", { cause: 400 }));
    }

    // 4. Verify OTP
    const isValidOtp = await compareOtp(otp, user.HashOtp);
    if (!isValidOtp) {
        return next(new Error("Invalid OTP", { cause: 400 }));
    }

    // 5. Hash New Password
    const hashedPassword = await bcrypt.hashPassword(password);

    // 6. Update User (New Password + Clear OTP)
    await DBservice.findOneAndUpdate({
        model: User,
        filter: { email },
        data: { 
            passwordHash: hashedPassword, // تأكد إن الحقل في الموديل اسمه passwordHash
            HashOtp: null,      // امسح الـ OTP عشان ميستخدموش تاني
            otpExpireAt: null 
        },
    });

    return successResponse({
        res,
        message: "Password reset successfully",
        statusCode: 200,
    });
});



