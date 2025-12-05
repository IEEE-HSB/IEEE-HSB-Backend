import nodemailer from "nodemailer";

const sendEmail = async ({
  from = process.env.EMAIL_USER,
  to,
  html = "",
  subject = "IEEE Notification",
  attachments = []
} = {}) => {
  
  // إعدادات الناقل (Transporter)
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // إعدادات الرسالة
  const mailOptions = {
    from: `"IEEE Helwan SB" <${process.env.EMAIL_USER}>`, 
    to,
    subject,
    html,
    attachments
  };

  // إرسال الرسالة
  const info = await transporter.sendMail(mailOptions);
  return info;
};

export { sendEmail };