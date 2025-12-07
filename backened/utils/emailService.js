const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  if (process.env. NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env. SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // Development - use Ethereal
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER || 'test@ethereal.email',
      pass: process. env.ETHEREAL_PASS || 'testpass'
    }
  });
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  // Skip email in test environment
  if (process.env. NODE_ENV === 'test') {
    return true;
  }

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"HackHarbor" <${process.env.FROM_EMAIL || 'noreply@hackharbor.com'}>`,
      to: user.email,
      subject: 'Welcome to HackHarbor!  🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to HackHarbor!</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Hi ${user.name}!  👋</h2>
            <p style="color: #666; line-height: 1.6;">
              Thank you for joining HackHarbor - your gateway to cybersecurity excellence! 
            </p>
            <ul style="color: #666; line-height: 1.8;">
              <li>📝 Create and share posts</li>
              <li>🎓 Access training resources</li>
              <li>🏆 Participate in CTF challenges</li>
              <li>🤝 Connect with the community</li>
            </ul>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process. env. FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
          </div>
          <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} HackHarbor. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    
    if (process.env. NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer. getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error. message);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  // Skip email in test environment
  if (process.env. NODE_ENV === 'test') {
    return true;
  }

  try {
    const transporter = createTransporter();
    const resetUrl = `${process. env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: `"HackHarbor" <${process.env.FROM_EMAIL || 'noreply@hackharbor.com'}>`,
      to: user.email,
      subject: 'Password Reset Request - HackHarbor',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Hi ${user.name},</h2>
            <p style="color: #666; line-height: 1.6;">
              We received a request to reset your password.  Click the button below to create a new password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="color: #999; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </p>
          </div>
          <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} HackHarbor.  All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail
};