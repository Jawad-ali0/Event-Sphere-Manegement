const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const sendEmail = async (options) => {
  // options can now include userSmtpEmail and userSmtpPassword for personal Gmail
  const userSmtpEmail = options.userSmtpEmail;
  const userSmtpPassword = options.userSmtpPassword;
  
  // Check if SMTP credentials are configured (not empty or placeholder values)
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Check if user has configured their own Gmail
  const userEmailConfigured = userSmtpEmail && userSmtpPassword;
  
  // Check if admin has configured SMTP
  const adminEmailConfigured = smtpEmail && smtpPassword && 
                          smtpEmail !== 'your-email@gmail.com' && 
                          smtpPassword !== 'your-app-password-here';
  
  let transporter;
  let emailInfo = {};
  let emailSource = 'none'; // For logging

  // Priority 1: Use user's personal Gmail if configured
  if (userEmailConfigured) {
    console.log('📧 Using user\'s personal Gmail account...');
    emailSource = 'user';
    
    try {
      transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: userSmtpEmail,
          pass: userSmtpPassword,
        },
      });
      
      emailInfo.from = `${options.senderName || 'EventSphere Management'} <${userSmtpEmail}>`;
      emailInfo.isDevelopment = false;
    } catch (error) {
      console.error('❌ Failed to configure user\'s Gmail:', error.message);
      console.log('⚠️ Falling back to admin Gmail or Ethereal...');
      userEmailConfigured = false; // Force fallback
    }
  }

  // Priority 2: Use admin configured SMTP
  if (!userEmailConfigured && adminEmailConfigured) {
    console.log('📧 Using admin Gmail account...');
    emailSource = 'admin';
    
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });
    
    emailInfo.from = `${process.env.FROM_NAME || 'EventSphere Management'} <${smtpEmail}>`;
    emailInfo.isDevelopment = false;
  }

  // Priority 3: Use Ethereal Email (development mode)
  if (!userEmailConfigured && !adminEmailConfigured) {
    console.log('🔧 No Gmail configured. Using Ethereal Email service...');
    emailSource = 'ethereal';
    
    try {
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      emailInfo.from = `${process.env.FROM_NAME || 'EventSphere Management'} <${testAccount.user}>`;
      emailInfo.isDevelopment = true;
      emailInfo.testAccount = testAccount;
      
      console.log('✅ Ethereal Email account created:');
      console.log('   User:', testAccount.user);
      console.log('   Web URL: https://ethereal.email');
    } catch (etherealError) {
      console.error('❌ Failed to create Ethereal Email account:', etherealError.message);
      throw new Error(`Email service unavailable. Please configure user Gmail or admin SMTP.`);
    }
  }

  // Email message options
  const message = {
    from: emailInfo.from,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send email
  try {
    const info = await transporter.sendMail(message);
    
    if (emailInfo.isDevelopment) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      
      console.log('✅ Email sent successfully via Ethereal!');
      console.log('   To: %s', options.email);
      console.log('   Subject: %s', options.subject);
      console.log('   📧 Preview URL: %s', previewUrl);
      
      return {
        ...info,
        previewUrl: previewUrl,
        isDevelopment: true,
        testAccount: emailInfo.testAccount,
        emailSource: emailSource,
      };
    } else {
      console.log(`✅ Email sent successfully via ${emailSource === 'user' ? 'user\'s' : 'admin'} Gmail!`);
      console.log('   To: %s', options.email);
      console.log('   Subject: %s', options.subject);
      console.log('   Message ID: %s', info.messageId);
      console.log('   Source: %s', emailSource);
      
      return {
        ...info,
        isDevelopment: false,
        emailSource: emailSource,
      };
    }
  } catch (error) {
    console.error(`❌ Error sending email via ${emailSource}:`, error.message);
    console.error('   To: %s', options.email);
    throw error;
  }
};

module.exports = sendEmail;
