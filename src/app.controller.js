import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/DB.connection.js";
import authController from "./modules/auth/auth.controller.js";
import chapterController from './modules/chapters/chapters.controller.js';
import eventController from './modules/events/events.controller.js';
import gallaryController from './modules/gallary/gallary.controller.js';
import projectController from './modules/project/project.controller.js';
import announcementController from './modules/announcement/announcement.controller.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 1. تشغيل الـ Middlewares
app.use(express.json());

// 2. الاتصال بالداتابيز
connectDB(); 

// 3. رسالة ترحيب (عشان تتأكد إن السيرفر شغال)
app.get("/", (req, res) => {
    res.json("Hello to IEEE Backend on Vercel! 🚀");
});

// 4. تعريف الروتس
app.use('/api/auth', authController);
app.use('/api/chapters', chapterController);
app.use('/api/events', eventController);
app.use('/api/gallary', gallaryController);
app.use('/api/projects', projectController);
app.use('/api/announcements', announcementController);

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}

export default app;