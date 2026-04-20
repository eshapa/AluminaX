const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  let transporter;
  
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Use Gmail SMTP if configured in .env
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else if (process.env.SMTP_HOST && process.env.SMTP_HOST !== "smtp.ethereal.email") {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate test SMTP service account from ethereal.email
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }

  const message = {
    from: `${process.env.FROM_NAME || "AlumNetX"} <${process.env.EMAIL_USER || process.env.FROM_EMAIL || "noreply@alumnetx.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Using HTML structure if passed
  };

  try {
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
    
    // Only log preview URL for ethereal accounts
    if (!process.env.EMAIL_USER && !process.env.SMTP_HOST) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    return info;
  } catch (error) {
    console.log("Failed to send email:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
