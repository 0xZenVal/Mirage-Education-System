/**
 * Authentication Routes
 * Defines the API endpoints for authentication operations
 */

const express = require('express');
const authController = require('../auth/auth-controller');
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, studentId, password } = req.body;
        
        // Validation
        if (!firstName || !lastName || !email || !studentId || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Register the user
        const result = await authController.registerUser({
            firstName,
            lastName,
            email,
            studentId,
            password
        });
        
        // Return success response
        res.status(201).json(result);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(error.message === 'Email already registered' ? 400 : 500)
            .json({ message: error.message || 'An error occurred during registration' });
    }
});

/**
 * @route   GET /api/auth/verify-email
 * @desc    Verify user email with token
 * @access  Public
 */
router.get('/verify-email', (req, res) => {
    try {
        const { token } = req.query;
        
        if (!token) {
            return res.redirect(`${process.env.FRONTEND_URL || ''}/verification.html?status=error`);
        }
        
        // Verify the email
        authController.verifyEmail(token);
        
        // Redirect to success page
        return res.redirect(`${process.env.FRONTEND_URL || ''}/verification.html?status=success`);
    } catch (error) {
        console.error('Verification error:', error);
        return res.redirect(`${process.env.FRONTEND_URL || ''}/verification.html?status=error`);
    }
});

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification email
 * @access  Public
 */
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        // Resend verification email
        const result = await authController.resendVerificationEmail(email);
        
        // Return success response
        res.status(200).json(result);
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(error.message === 'User not found' ? 404 : 500)
            .json({ message: error.message || 'An error occurred while resending the verification email' });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        // Login the user
        const result = await authController.loginUser({ email, password });
        
        // Return token and user data
        res.status(200).json(result);
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ message: error.message || 'Invalid credentials' });
    }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 */
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        // Request password reset
        const result = await authController.requestPasswordReset(email);
        
        // Return success response
        res.status(200).json(result);
    } catch (error) {
        console.error('Password reset request error:', error);
        // Always return 200 to prevent email enumeration
        res.status(200).json({ 
            message: 'If your email is registered, you will receive a password reset link'
        });
    }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        
        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }
        
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }
        
        // Reset the password
        const result = await authController.resetPassword(token, password);
        
        // Return success response
        res.status(200).json(result);
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(400).json({ message: error.message || 'An error occurred during password reset' });
    }
});

module.exports = router;
