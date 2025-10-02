const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Wrap in an async IIFE so we can use await.
const sendMail = async (name, email, message) => {
  const info = await transporter.sendMail({
    from: `${email}`,
    to: process.env.EMAIL_USER,
    subject: "Complaint Received from Mera Gaav Portal",
    text: message, // plain‑text body
    html: `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background:#f9f9f9; padding:15px;">
    <div style="max-width:500px;margin:auto;background:#fff;border:1px solid #ddd;border-radius:8px;padding:15px;">
      <h3 style="text-align:center;color:#333;">📢 New Complaint</h3>
      <p><strong>Name:</strong> {${name}}</p>
    
      <p><strong>Email:</strong> {${email}}</p>
    
      <p><strong>Complaint:</strong> {${message}}</p>
      <hr style="margin:15px 0;">
      <p style="font-size:12px;color:#777;text-align:center;">
        Sent via <b>Mera Gaav</b> portal
      </p>
    </div>
  </body>
</html>
`, // HTML body
  });

  console.log("Message sent:", info.messageId);
};

module.exports = {sendMail};