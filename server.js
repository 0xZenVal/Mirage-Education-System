/**
 * Mirage Education Management System - Server
 * Handles registration, email verification, and authentication
 */

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const config = require('./config');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// In-memory storage for users and verification tokens (would use a database in production)
const users = [];
const verificationTokens = new Map();

// Email transporter setup with Google SMTP
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

// Verify SMTP connection works
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});

// Helper function to generate verification tokens
function generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Helper function to send verification emails
async function sendVerificationEmail(email, token) {
    const verificationUrl = `${config.urls.frontendUrl}/verification.html?token=${token}`;
    
    const mailOptions = {
        from: config.email.from,
        to: email,
        subject: config.email.verificationSubject,
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
    
    return transporter.sendMail(mailOptions);
}

// API Routes

// Register a new user
app.post('/api/register', async (req, res) => {
    try {
        const { firstName, lastName, email, studentId, password } = req.body;
        
        // Validation
        if (!firstName || !lastName || !email || !studentId || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Check if email is already registered
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        
        // Hash the password before storing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user with hashed password
        const newUser = {
            id: users.length + 1,
            firstName,
            lastName,
            email,
            studentId,
            password: hashedPassword,
            isVerified: false,
            createdAt: new Date()
        };
        
        // Generate verification token
        const verificationToken = generateVerificationToken();
        
        // Store token with expiry
        verificationTokens.set(verificationToken, {
            email,
            expiresAt: Date.now() + config.email.verificationExpiry
        });
        
        // Send verification email
        await sendVerificationEmail(email, verificationToken);
        
        // Add user to database
        users.push(newUser);
        
        // Return success
        res.status(201).json({
            message: 'Registration successful! Please check your email to verify your account.'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'An error occurred during registration.' });
    }
});

// Verify email with token
app.get('/api/verify-email', (req, res) => {
    try {
        const { token } = req.query;
        
        if (!token) {
            return res.redirect(config.urls.verificationErrorUrl);
        }
        
        // Check if token exists and is valid
        const verification = verificationTokens.get(token);
        
        if (!verification) {
            return res.redirect(config.urls.verificationErrorUrl);
        }
        
        // Check if token is expired
        if (verification.expiresAt < Date.now()) {
            verificationTokens.delete(token);
            return res.redirect(config.urls.verificationErrorUrl);
        }
        
        // Find and update user
        const userIndex = users.findIndex(user => user.email === verification.email);
        
        if (userIndex === -1) {
            return res.redirect(config.urls.verificationErrorUrl);
        }
        
        // Update user verification status
        users[userIndex].isVerified = true;
        
        // Remove used token
        verificationTokens.delete(token);
        
        // Redirect to success page
        res.redirect(config.urls.verificationSuccessUrl);
    } catch (error) {
        console.error('Verification error:', error);
        res.redirect(config.urls.verificationErrorUrl);
    }
});

// Resend verification email
app.post('/api/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        // Check if user exists
        const user = users.find(user => user.email === email);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }
        
        // Remove any existing tokens for this email
        for (const [token, verification] of verificationTokens.entries()) {
            if (verification.email === email) {
                verificationTokens.delete(token);
            }
        }
        
        // Generate new verification token
        const verificationToken = generateVerificationToken();
        
        // Store token with expiry
        verificationTokens.set(verificationToken, {
            email,
            expiresAt: Date.now() + config.email.verificationExpiry
        });
        
        // Send verification email
        await sendVerificationEmail(email, verificationToken);
        
        // Return success
        res.status(200).json({
            message: 'Verification email sent successfully!'
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: 'An error occurred while resending the verification email.' });
    }
});

// Add a login route for the future
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = users.find(user => user.email === email);
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // Compare the password with hashed password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            config.server.jwtSecret,
            { expiresIn: config.server.tokenExpiration }
        );
        
        // Return token
        res.status(200).json({
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                studentId: user.studentId
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});

// For demonstration purposes, print some helpful information
console.log('\n===== MIRAGE EDUCATION SYSTEM =====');
console.log('Frontend URL:', config.urls.frontendUrl);
console.log('Email Configuration:', `Using ${config.email.service} with ${config.email.auth.user}`);
console.log('Note: This is a demonstration server with in-memory storage.');
console.log('In production, use a proper database and secure environment variables.');
console.log('=====================================\n');
