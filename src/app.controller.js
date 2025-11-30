import express from "express";
import dotenv from "dotenv"
import connectDB from "./DB/DB.connection.js";
import authController from "./modules/auth/auth.controller.js";
import chapterController from './modules/chapters/chapters.controller.js'
import eventController from './modules/events/events.controller.js'
dotenv.config();
const bootstrap= async ()=>{
    const app=express();
    const port=process.env.PORT || 3000;
    app.use(express.json());
    await connectDB();
    console.log("server started");
    
    app.listen(port,()=>console.log(`server to cerated at port http://localhost:${port}`));

    app.get("/",(req,res)=>{
        res.json("hello to IEEE");
    });

    app.use('/api/auth',authController)
    app.use('/api/chapters',chapterController)
    app.use('/api/events',eventController)
    
 
}
export default bootstrap;