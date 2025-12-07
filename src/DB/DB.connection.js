import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        console.log("Connecting to database...");
        console.log(process.env.MONGOOSE_URL);
        
       const result = await mongoose.connect(process.env.MONGOOSE_URL , {
        serverSelectionTimeoutMS: 5000, //ديه عشان بتعمل تايماوت للاتصال بالداتا بيز
       });
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;