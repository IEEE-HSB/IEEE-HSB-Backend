export const templateEmail = ({ otp, title = "IEEE Verification" } = {}) => {
    return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
      body {
        background-color: #001f3f; /* Dark Blue from IEEE website background */
        margin: 0;
        font-family: 'Arial', sans-serif;
      }
      .container {
        max-width: 450px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        text-align: center;
        border-top: 5px solid #ffc107; /* The Yellow accent color */
      }
      .header {
        background-color: #002550; /* IEEE Primary Blue */
        padding: 30px 20px;
        color: #ffffff;
      }
      .logo-box img {
        max-width: 150px;
        height: auto;
        display: block;
        margin: 0 auto;
      }
      .content {
        padding: 30px 20px;
      }
      .otp-box {
        background-color: #ffc107; /* Yellow button color from website */
        color: #001f3f; /* Dark text for contrast */
        padding: 15px 30px;
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 10px;
        border-radius: 50px; /* Rounded pill shape like the buttons */
        display: inline-block;
        margin: 25px 0;
        border: 2px solid #e0a800;
      }
      .footer {
        background-color: #f4f4f4;
        padding: 20px;
        font-size: 12px;
        color: #666;
        border-top: 1px solid #ddd;
      }
      .footer a {
        color: #00629B;
        text-decoration: none;
      }
      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
      }
      p {
        color: #555;
        font-size: 16px;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
    <div class="container">
      
      <div class="header">
        <div class="logo-box">
          <img src="cid:ieeeLogo" alt="IEEE Helwan Logo" />
        </div>
        <h1 style="margin-top: 15px;">IEEE Helwan SB</h1>
      </div>
  
      <div class="content">
        <h2 style="color:#002550;">Verify Your Email</h2>
        <p>
          Welcome to IEEE Helwan Platform. To complete your login or registration, please use the OTP code below.
        </p>
        
        <div class="otp-box">${otp}</div>
        
        <p style="font-size: 14px; color: #888;">
          This code is valid for <strong>10 minutes</strong>.<br>
          If you didn't request this, please ignore this email.
        </p>
      </div>
  
      <div class="footer">
        <p>Empowering Innovation, Inspiring Growth</p>
        © ${new Date().getFullYear()} IEEE Helwan Student Branch. All rights reserved.
      </div>
    </div>
  </body>
  </html>`;
  };