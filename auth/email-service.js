/**
 * Email Service for Authentication
 * Handles sending verification emails and password reset emails
 */

const nodemailer = require('nodemailer');
const config = require('../config');

// Create a transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'caseyng100@gmail.com',
        pass: 'aygi egvp bitj rjlc' // App Password for Gmail
    },
    tls: {
        rejectUnauthorized: false // For development only - remove in production
    }
});

// Initialize the service and verify connection
function initEmailService() {
    return new Promise((resolve, reject) => {
        transporter.verify((error, success) => {
            if (error) {
                console.error('SMTP connection error:', error);
                reject(error);
            } else {
                console.log('SMTP server is ready to take our messages');
                resolve(success);
            }
        });
    });
}

// Send email verification
async function sendVerificationEmail(email, token) {
    const verificationUrl = `${config.urls.frontendUrl}/verification.html?token=${token}`;
    
    const mailOptions = {
        from: `"Mirage Education System" <caseyng100@gmail.com>`,
        to: email,
        subject: 'Verify Your Email - Mirage Education System',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #2563eb;">Mirage Education System</h1>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #333;">Verify Your Email Address</h2>
                    <p style="color: #555; line-height: 1.6;">
                        Thank you for registering with the Mirage Education System. Please click the button below to verify your email address:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                            Verify My Email
                        </a>
                    </div>
                    
                    <p style="color: #555; line-height: 1.6;">
                        If the button above doesn't work, please copy and paste the following link into your browser:
                    </p>
                    
                    <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
                        <a href="${verificationUrl}" style="color: #2563eb;">${verificationUrl}</a>
                    </p>
                    
                    <p style="color: #555; line-height: 1.6;">
                        This verification link will expire in 24 hours.
                    </p>
                </div>
                
                <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; color: #777; font-size: 0.9em;">
                    <p>
                        If you did not register for an account with Mirage Education System, please ignore this email.
                    </p>
                </div>
            </div>
        `
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Failed to send verification email:', error);
        throw error;
    }
}

// Send password reset email
async function sendPasswordResetEmail(email, token) {
    const resetUrl = `${config.urls.frontendUrl}/reset-password.html?token=${token}`;
    
    const mailOptions = {
        from: `"Mirage Education System" <caseyng100@gmail.com>`,
        to: email,
        subject: 'Reset Your Password - Mirage Education System',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #2563eb;">Mirage Education System</h1>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #333;">Reset Your Password</h2>
                    <p style="color: #555; line-height: 1.6;">
                        You requested a password reset for your Mirage Education System account. Please click the button below to set a new password:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                            Reset My Password
                        </a>
                    </div>
                    
                    <p style="color: #555; line-height: 1.6;">
                        If the button above doesn't work, please copy and paste the following link into your browser:
                    </p>
                    
                    <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
                        <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a>
                    </p>
                    
                    <p style="color: #555; line-height: 1.6;">
                        This password reset link will expire in 1 hour.
                    </p>
                </div>
                
                <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; color: #777; font-size: 0.9em;">
                    <p>
                        If you did not request a password reset, please ignore this email or contact support if you believe this is an error.
                    </p>
                </div>
            </div>
        `
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw error;
    }
}

module.exports = {
    initEmailService,
    sendVerificationEmail,
    sendPasswordResetEmail
};
