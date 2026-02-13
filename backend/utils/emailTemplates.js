// Password Reset Email Template
const getPasswordResetEmailTemplate = (resetUrl, resetToken, userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - EventSphere Management</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">EventSphere Management</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
        
        <p>Hello ${userName || 'User'},</p>
        
        <p>We received a request to reset your password for your EventSphere Management account.</p>
        
        <p><strong>Click the button below to reset your password:</strong></p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    display: inline-block;
                    font-weight: bold;">
            Reset Password
          </a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="background: #fff; padding: 15px; border-radius: 5px; word-break: break-all; border: 1px solid #ddd;">
          ${resetUrl}
        </p>
        
        <p><strong>Reset Token:</strong></p>
        <p style="background: #fff; padding: 15px; border-radius: 5px; font-family: monospace; border: 1px solid #ddd;">
          ${resetToken}
        </p>
        
        <p style="color: #666; font-size: 14px;">
          <strong>Note:</strong> This link will expire in 10 minutes. If you didn't request a password reset, please ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px; margin: 0;">
          If you're having trouble clicking the button, copy and paste the URL above into your web browser.
        </p>
        
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Best regards,<br>
          EventSphere Management Team
        </p>
      </div>
    </body>
    </html>
  `;
};

// Plain text version
const getPasswordResetTextTemplate = (resetUrl, resetToken, userName) => {
  return `
Password Reset Request - EventSphere Management

Hello ${userName || 'User'},

We received a request to reset your password for your EventSphere Management account.

Click the link below to reset your password:
${resetUrl}

Reset Token: ${resetToken}

Note: This link will expire in 10 minutes. If you didn't request a password reset, please ignore this email.

Best regards,
EventSphere Management Team
  `;
};

module.exports = {
  getPasswordResetEmailTemplate,
  getPasswordResetTextTemplate,
};
