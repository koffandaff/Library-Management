const nodemailer = require('nodemailer');

// Create transporter - FIXED FUNCTION NAME
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dhruvillearning@gmail.com',
      pass: 'iufc hfmz mhga nvlm'
    }
  });
};

// OTP Email Template
const emailTemplates = {
  passwordResetOtp: (name, otp) => ({
    subject: 'Password Reset OTP - Library Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">📚 Library Management</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333; text-align: center;">Password Reset OTP</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>We received a request to reset your password. Use the OTP below to verify your identity:</p>
          
          <div style="text-align: center; margin: 40px 0;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border: 2px dashed #667eea;">
              <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px;">
                ${otp}
              </div>
            </div>
          </div>
          
          <p style="text-align: center; color: #666;">
            This OTP will expire in <strong>10 minutes</strong> for security reasons.
          </p>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #856404; margin: 0;">
              ⚠️ <strong>Security Tip:</strong> Never share this OTP with anyone. Our team will never ask for your OTP.
            </p>
          </div>
          
          <p>If you didn't request this reset, please ignore this email and ensure your account is secure.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 14px; text-align: center;">
              Best regards,<br>
              <strong>Library Management Team</strong>
            </p>
          </div>
        </div>
      </div>
    `
  }),
  passwordResetSuccess: (name) => ({
    subject: 'Password Reset Successful - Library Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; background: linear-gradient(135deg, #28a745, #20c997); padding: 20px; border-radius: 10px;">
          <h1 style="color: white; margin: 0;">✅ Password Reset Successful</h1>
        </div>
        
        <div style="padding: 30px;">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your password has been successfully reset.</p>
          
          <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;">Your account security has been updated successfully.</p>
          </div>
          
          <p>If you did not make this change, please contact our support team immediately.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; text-align: center;">
              Best regards,<br>
              <strong>Library Management Team</strong>
            </p>
          </div>
        </div>
      </div>
    `
  })
};

// Generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Library Management" <dhruvillearning@gmail.com>`,
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send OTP email
const sendOtpEmail = async (email, name, otp) => {
  const template = emailTemplates.passwordResetOtp(name, otp);
  return await sendEmail(email, template.subject, template.html);
};

// Send success email
const sendPasswordResetSuccessEmail = async (email, name) => {
  const template = emailTemplates.passwordResetSuccess(name);
  return await sendEmail(email, template.subject, template.html);
};

module.exports = {
  generateOtp,
  sendOtpEmail,
  sendPasswordResetSuccessEmail
};