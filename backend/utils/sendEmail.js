const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const sendEmail = async (options) => {
  // Check if SMTP credentials are configured (not empty or placeholder values)
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;
  
  if (!smtpEmail || !smtpPassword || 
      smtpEmail === 'your-email@gmail.com' || 
      smtpPassword === 'your-app-password-here') {
    console.warn('⚠️ SMTP credentials not configured. Email sending skipped.');
    console.warn('To enable email, add SMTP_EMAIL and SMTP_PASSWORD to .env file');
    throw new Error('Email service not configured. Please set SMTP_EMAIL and SMTP_PASSWORD in .env file');
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Email message options
  const message = {
    from: `${process.env.FROM_NAME || 'EventSphere Management'} <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send email
  const info = await transporter.sendMail(message);

  console.log('✅ Message sent: %s', info.messageId);
  return info;
};

module.exports = sendEmail;
