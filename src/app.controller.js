import express from "express";
import dotenv from "dotenv"
import connectDB from "./DB/DB.connection.js";
import authController from "./modules/auth/auth.controller.js";
dotenv.config();
const bootstrap= async ()=>{
    const app=express();
    const port=5000;
    await connectDB();
    app.use(express.json());
    console.log("server started");
    
    app.listen(port,()=>console.log(`server to cerated at port http://localhost:${port}`));

    app.get("/",(req,res)=>{
        res.json("hello to IEEE");
    });

    app.use('/api/auth',authController)
 
}
export default bootstrap;