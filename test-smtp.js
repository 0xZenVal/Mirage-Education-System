/**
 * Test script for Google SMTP Authentication
 * This script verifies that the provided Gmail credentials can successfully authenticate
 * and send emails through Google's SMTP server
 */

const nodemailer = require('nodemailer');

// Gmail and App Password from the configuration
const EMAIL = 'caseyng100@gmail.com';
const APP_PASSWORD = 'aygi egvp bitj rjlc';

// Create a nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false // For development only - remove in production
    }
});

// Verify the connection configuration
console.log('Attempting to verify SMTP connection...');
transporter.verify()
    .then(success => {
        console.log('✅ SMTP connection successful! The server is ready to accept messages.');
        
        // After successful connection, send a test email
        return sendTestEmail();
    })
    .catch(error => {
        console.error('❌ SMTP connection failed!');
        console.error('Error details:', error);
        console.log('\nPossible causes:');
        console.log('1. The App Password might be incorrect');
        console.log('2. Less secure app access might need to be enabled in Google Account');
        console.log('3. Network connectivity issues');
        process.exit(1);
    });

// Function to send a test email
async function sendTestEmail() {
    console.log('\nSending a test email...');
    
    const mailOptions = {
        from: `"Mirage System Test" <${EMAIL}>`,
        to: EMAIL, // Send to the same email for testing
        subject: 'Mirage SMTP Test ✅',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h1 style="color: #2563eb; text-align: center;">SMTP Configuration Test</h1>
                
                <p style="color: #333; line-height: 1.6;">
                    This is a test email from the Mirage Education Management System to verify that the SMTP configuration is working correctly.
                </p>
                
                <div style="background-color: #f8f9fa; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #555;">
                        <strong>Configuration Details:</strong><br>
                        Email: ${EMAIL}<br>
                        SMTP Service: Gmail<br>
                        Test Timestamp: ${new Date().toISOString()}
                    </p>
                </div>
                
                <p style="color: #333;">
                    If you received this email, your SMTP configuration is working correctly!
                </p>
                
                <div style="text-align: center; margin-top: 30px; color: #777; font-size: 0.9em;">
                    <p>Mirage Education Management System</p>
                </div>
            </div>
        `
    };
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        console.log('\nYour Google SMTP authentication is working correctly.');
        
        return true;
    } catch (error) {
        console.error('❌ Failed to send test email!');
        console.error('Error details:', error);
        return false;
    }
}
