# Email Notification Setup Guide

## Quick Setup for Your Email (noorulazeem60@gmail.com)

### Step 1: Create `.env` file

Create a file named `.env` in the `backened` directory with the following content:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/hackharbor

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration - Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noorulazeem60@gmail.com
SMTP_PASS=your-gmail-app-password-here

# Email From Address
FROM_EMAIL=noorulazeem60@gmail.com

# Admin Notification Email (where you want to receive notifications)
ADMIN_EMAIL=noorulazeem60@gmail.com

# Upload Directory
UPLOAD_DIR=uploads
```

### Step 2: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Enter "HackHarbor" as the name
4. Click "Generate"
5. Copy the 16-character password (remove spaces)
6. Replace `your-gmail-app-password-here` in your `.env` file with this App Password

**Important Notes:**
- You MUST use an App Password, not your regular Gmail password
- Enable 2-Step Verification first if you haven't already
- The App Password is 16 characters (may have spaces - remove them)

### Step 3: Test Email Configuration

After setting up the `.env` file, restart your server and try registering a new user. You should receive:
1. **Welcome email** sent to the new user
2. **Admin notification** sent to `noorulazeem60@gmail.com` about the new registration

## Email Notifications Currently Implemented

### 1. Welcome Email
- **Trigger**: When a new user registers
- **Recipient**: The new user
- **Content**: Welcome message with dashboard link

### 2. Password Reset Email
- **Trigger**: When a user requests password reset (if implemented)
- **Recipient**: The user requesting reset
- **Content**: Password reset link

### 3. Admin Notifications
- **New User Registration**: Sent to `ADMIN_EMAIL` when a new user signs up
- **New Post Created**: Sent to `ADMIN_EMAIL` when a new post is created

## Alternative Email Providers

### Gmail Setup
If you prefer using Gmail instead:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
```

**Note**: For Gmail, you'll need to:
1. Enable 2-Factor Authentication
2. Generate an App Password (not your regular password)
3. Use the App Password in `SMTP_PASS`

### Other SMTP Providers
You can use any SMTP provider by updating:
- `SMTP_HOST`: Your SMTP server hostname
- `SMTP_PORT`: Usually 587 (STARTTLS) or 465 (SSL)
- `SMTP_SECURE`: `false` for port 587, `true` for port 465
- `SMTP_USER`: Your email address
- `SMTP_PASS`: Your email password or app password

## Troubleshooting

### Email not sending?
1. Check that `.env` file exists and has correct values
2. Verify your email password is correct
3. Check server logs for error messages
4. For Office 365, ensure SMTP access is enabled
5. Try using an App Password instead of regular password

### Authentication errors?
- Office 365 may require OAuth2 instead of basic auth
- Some organizations block SMTP access
- Check if your email provider requires "Less secure app access"

### Testing in Development
- In development mode, emails will be sent using your configured SMTP
- Check console logs for email sending status
- Preview URLs are logged for Ethereal (if no SMTP configured)

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit your `.env` file to version control
- Use strong, unique passwords
- Consider using environment variables in production (Vercel, Heroku, etc.)
- For production, use a dedicated email service (SendGrid, AWS SES, etc.)
