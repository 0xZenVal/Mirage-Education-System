/**
 * Configuration for the Mirage Education Management System
 */

module.exports = {
    // Server Configuration
    server: {
        port: process.env.PORT || 8000,
        jwtSecret: process.env.JWT_SECRET || 'mirage-super-secret-jwt-key', // Change in production
        tokenExpiration: '1d'
    },
    
    // Email Configuration (Google SMTP)
    email: {
        service: 'gmail',
        auth: {
            user: 'caseyng100@gmail.com',
            pass: 'aygi egvp bitj rjlc' // App Password for Gmail
        },
        from: 'Mirage Education System <caseyng100@gmail.com>',
        verificationSubject: 'Verify Your Email - Mirage Education System',
        verificationExpiry: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    },
    
    // Database Configuration (would be MongoDB or similar in production)
    // This is simplified for demonstration purposes
    database: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/mirage',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    
    // Frontend URLs
    urls: {
        // Base URL of the frontend application
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8000',
        // URL for email verification success/failure
        verificationSuccessUrl: '/verification.html?status=success',
        verificationErrorUrl: '/verification.html?status=error'
    }
};
