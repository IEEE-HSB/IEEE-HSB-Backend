import { EventEmitter } from 'node:events';
import { sendEmail } from '../../utils/email.js';
import { templateEmail } from '../../utils/templates/email.templates.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eventEmitter = new EventEmitter();

eventEmitter.on('sendVerification', async (emailDetails) => {
    try {
        await sendEmail({
            to: emailDetails.to,
            subject: emailDetails.subject || "IEEE Helwan - Verify Your Email",
            html: templateEmail({
                otp: emailDetails.otp,
                title: "Email Verification"
            }),
            attachments: [
                {
                    filename: 'ieee-logo.png', // اسم الملف اللي هيظهر في الميل
                    // 👇 مسار الصورة: يفضل تحط اللوجو في فولدر assets
                    // تأكد إنك غيرت المسار ده لمكان الصورة الحقيقي عندك
                    path: path.join(__dirname, '../../assets/ieee-logo.png'), 
                    cid: 'ieeeLogo' // ⚠️ مهم جداً: لازم يكون نفس الاسم اللي في التيمبليت HTML
                }
            ]
        });
        console.log(`✅ Email sent successfully to ${emailDetails.to}`);
    } catch (error) {
        console.error(`❌ Failed to send email to ${emailDetails.to}:`, error);
    }
});

export default eventEmitter;