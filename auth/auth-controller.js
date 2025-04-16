/**
 * Authentication Controller
 * Handles user registration, verification, login, and password reset
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const emailService = require('./email-service');
const config = require('../config');

// In-memory storage for users and tokens (would use a database in production)
const users = [];
const verificationTokens = new Map();
const passwordResetTokens = new Map();

/**
 * Register a new user
 */
async function registerUser(userData) {
    const { firstName, lastName, email, studentId, password } = userData;
    
    // Check if email is already registered
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        throw new Error('Email already registered');
    }
    
    // Hash the password
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
    const verificationToken = generateToken();
    
    // Store token with expiry (24 hours)
    verificationTokens.set(verificationToken, {
        email,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
    });
    
    // Send verification email
    await emailService.sendVerificationEmail(email, verificationToken);
    
    // Add user to the in-memory database
    users.push(newUser);
    
    return {
        message: 'Registration successful! Please check your email to verify your account.'
    };
}

/**
 * Verify a user's email using the token sent via email
 */
function verifyEmail(token) {
    // Check if token exists and is valid
    const verification = verificationTokens.get(token);
    
    if (!verification) {
        throw new Error('Invalid or expired verification token');
    }
    
    // Check if token is expired
    if (verification.expiresAt < Date.now()) {
        verificationTokens.delete(token);
        throw new Error('Verification token has expired');
    }
    
    // Find and update user
    const userIndex = users.findIndex(user => user.email === verification.email);
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }
    
    // Update user verification status
    users[userIndex].isVerified = true;
    
    // Remove used token
    verificationTokens.delete(token);
    
    return {
        message: 'Email verified successfully! You can now log in.'
    };
}

/**
 * Resend verification email
 */
async function resendVerificationEmail(email) {
    // Check if user exists
    const user = users.find(user => user.email === email);
    
    if (!user) {
        throw new Error('User not found');
    }
    
    // Check if user is already verified
    if (user.isVerified) {
        throw new Error('Email is already verified');
    }
    
    // Remove any existing tokens for this email
    for (const [token, verification] of verificationTokens.entries()) {
        if (verification.email === email) {
            verificationTokens.delete(token);
        }
    }
    
    // Generate new verification token
    const verificationToken = generateToken();
    
    // Store token with expiry (24 hours)
    verificationTokens.set(verificationToken, {
        email,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
    });
    
    // Send verification email
    await emailService.sendVerificationEmail(email, verificationToken);
    
    return {
        message: 'Verification email sent successfully!'
    };
}

/**
 * Authenticate a user and return a JWT token
 */
async function loginUser(credentials) {
    const { email, password } = credentials;
    
    // Find user
    const user = users.find(user => user.email === email);
    
    // Check if user exists
    if (!user) {
        throw new Error('Invalid email or password');
    }
    
    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    
    // Check if user is verified
    if (!user.isVerified) {
        throw new Error('Please verify your email before logging in');
    }
    
    // Generate JWT token
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.server.jwtSecret,
        { expiresIn: config.server.tokenExpiration }
    );
    
    return {
        token,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            studentId: user.studentId
        }
    };
}

/**
 * Request a password reset
 */
async function requestPasswordReset(email) {
    // Find user
    const user = users.find(user => user.email === email);
    
    // Check if user exists
    if (!user) {
        throw new Error('User not found');
    }
    
    // Generate reset token
    const resetToken = generateToken();
    
    // Store token with expiry (1 hour)
    passwordResetTokens.set(resetToken, {
        email,
        expiresAt: Date.now() + 60 * 60 * 1000
    });
    
    // Send password reset email
    await emailService.sendPasswordResetEmail(email, resetToken);
    
    return {
        message: 'Password reset email sent successfully!'
    };
}

/**
 * Reset a user's password using the token sent via email
 */
async function resetPassword(token, newPassword) {
    // Check if token exists and is valid
    const reset = passwordResetTokens.get(token);
    
    if (!reset) {
        throw new Error('Invalid or expired reset token');
    }
    
    // Check if token is expired
    if (reset.expiresAt < Date.now()) {
        passwordResetTokens.delete(token);
        throw new Error('Reset token has expired');
    }
    
    // Find user
    const userIndex = users.findIndex(user => user.email === reset.email);
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user's password
    users[userIndex].password = hashedPassword;
    
    // Remove used token
    passwordResetTokens.delete(token);
    
    return {
        message: 'Password reset successfully!'
    };
}

// Helper function to generate random tokens
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Export functions for use in routes
module.exports = {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
    loginUser,
    requestPasswordReset,
    resetPassword
};
