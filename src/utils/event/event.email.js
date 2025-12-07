import { EventEmitter } from 'node:events';
import { sendEmail } from '../email.js'; // Check this path carefully!
import { templateEmail } from '../templates/email.templates.js'; // Check this path!
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs'; // Import fs to check file existence

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eventEmitter = new EventEmitter();

eventEmitter.on('sendVerification', async (emailDetails) => {
    console.log("🔔 Event Listener Triggered for:", emailDetails.to); // DEBUG LOG

    // 1. Define Image Path
    const imagePath = path.join(__dirname, '../../../assets/ieee-logo.png');
    
    // 2. Check if image exists (To avoid silent crash)
    let attachments = [];
    if (fs.existsSync(imagePath)) {
        console.log("✅ Image found at:", imagePath);
        attachments = [{
            filename: 'ieee-logo.png',
            path: imagePath,
            cid: 'ieeeLogo'
        }];
    } else {
        console.error("⚠️ Image NOT found at:", imagePath); 
        // We will send email without image so it doesn't fail
    }

    try {
        const info = await sendEmail({
            to: emailDetails.to,
            subject: emailDetails.subject || "IEEE Helwan - Verify Your Email",
            html: templateEmail({
                otp: emailDetails.otp,
                title: "Email Verification"
            }),
            attachments: attachments
        });
        
        console.log(`✅ Email sent successfully to ${emailDetails.to}`);
        console.log("📧 Message ID:", info.messageId); // Log Message ID
    } catch (error) {
        console.error(`❌ FATAL ERROR sending email to ${emailDetails.to}:`);
        console.error(error);
    }
});

export default eventEmitter;