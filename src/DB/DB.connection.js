import mongoose from "mongoose";

const connectDB = async () => {
    try {
       const result = await mongoose.connect(process.env.MONGOOSE_URL||'mongodb://localhost:27017/IEEE' , {
        serverSelectionTimeoutMS: 5000, //ديه عشان بتعمل تايماوت للاتصال بالداتا بيز
       });
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;