const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // If SMTP credentials are provided, use them (for both dev and production)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Debug logging (only in development)
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email Config:', {
        host: process.env.SMTP_HOST,
        user: process.env.SMTP_USER,
        port: process.env.SMTP_PORT || 587
      });
    }

    const config = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // false for STARTTLS (port 587), true for SSL (port 465)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };

    // Gmail-specific configuration
    if (process.env.SMTP_HOST.includes('gmail.com')) {
      config.service = 'gmail';
      // Remove host/port when using service
      delete config.host;
      delete config.port;
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Using Gmail service configuration');
      }
    }

    // Office 365 configuration (if SMTP AUTH is enabled)
    if (process.env.SMTP_HOST.includes('office365.com') || process.env.SMTP_HOST.includes('outlook.com')) {
      config.tls = {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      };
      if (process.env.NODE_ENV !== 'production') {
        console.log('⚠️  Using Office 365 configuration (SMTP AUTH may be disabled)');
      }
    }

    return nodemailer.createTransport(config);
  }
  
  // Development fallback - use Ethereal (only if no SMTP config)
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER || 'test@ethereal.email',
      pass: process.env.ETHEREAL_PASS || 'testpass'
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

// Send admin notification email
const sendAdminNotification = async (subject, message, data = {}) => {
  // Skip email in test environment
  if (process.env.NODE_ENV === 'test') {
    return true;
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  
  if (!adminEmail) {
    console.warn('Admin email not configured. Skipping notification.');
    return false;
  }

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"HackHarbor System" <${process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@hackharbor.com'}>`,
      to: adminEmail,
      subject: `[HackHarbor] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">HackHarbor Notification</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">${subject}</h2>
            <p style="color: #666; line-height: 1.6;">
              ${message}
            </p>
            ${Object.keys(data).length > 0 ? `
              <div style="background: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
                <h3 style="color: #333; margin-top: 0;">Details:</h3>
                <pre style="color: #666; font-size: 14px; white-space: pre-wrap;">${JSON.stringify(data, null, 2)}</pre>
              </div>
            ` : ''}
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              This is an automated notification from HackHarbor.
            </p>
          </div>
          <div style="padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} HackHarbor. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error.message);
    return false;
  }
};

// Send post creation notification to admin
const sendPostCreatedNotification = async (post, author) => {
  return sendAdminNotification(
    'New Post Created',
    `A new post "${post.title}" has been created by ${author.name} (${author.email}).`,
    {
      postId: post._id,
      title: post.title,
      author: author.name,
      authorEmail: author.email,
      createdAt: post.createdAt
    }
  );
};

// Send new user registration notification to admin
const sendNewUserNotification = async (user) => {
  return sendAdminNotification(
    'New User Registration',
    `A new user has registered: ${user.name} (${user.email}).`,
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      registeredAt: user.createdAt
    }
  );
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAdminNotification,
  sendPostCreatedNotification,
  sendNewUserNotification
};