import * as DBservice from "../../DB/DB.service.js";
import User from "../../models/userModel.js";
import * as bcrypt from "../../utils/security/bycrept.js";
import { asyncHandler, successResponse , globalErrorHandler } from "../../utils/response.js";
import * as jwt from "../../utils/security/jwt.security.js";

export const register = asyncHandler(async (req, res) => {
    const { name , email , password } = req.body;
    if (!name || !email || !password) {
        return next(new Error("All fields are required"));
    }
    if(await DBservice.findOne({ model: User, filter: { email } })){
        return next(new Error("User already exists"));
    }
    const hashedPassword = await bcrypt.hashPassword(password);
    const user = await DBservice.create({ model: User, data: { name, email, passwordHash: hashedPassword} });

    const accessToken = jwt.generateToken({ payload: { userId: user._id } });

    const refreshToken = jwt.generateToken({ payload: { userId: user._id }, secret: process.env.JWT_SECRET_REFRESH });
    
    return successResponse(res, user , "user created successfully" , 201);
})


export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    // البحث عن المستخدم
    const user = await DBservice.findOne({ model: User, filter: { email } }); // Exclude password from the response
  
    if (!user) {
      return next(new Error("Invalid email or password", { cause: 401 }));
    }
  
    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.comparePassword(
      password,
      user.password
    );
    // داله الكومبير بتاخد اتنين باراميتر اول واحد الباسورد اللى اليوزر مدخله
    //و التاني بتكتب الباسورد اللى متدخل ف الداتا بيز و تبدا تقارن بقى
    if (!isPasswordValid) {
      return next(new Error("Invalid email or password", { cause: 401 }));
    }

    // إنشاء token
    const { accessToken: token, refreshToken: refresh_Token} =
      jsonwebtoken.createTokens({
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
        token,
        refresh_Token,
        user: { isVerified: user.isVerified },
        role: user.role,
      },
      message: "Login successful",
      statusCode: 200,
    });
  });
