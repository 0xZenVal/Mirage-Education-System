# Mirage Education Management System

A comprehensive web-based education management system designed to revolutionize the academic experience for both students and lecturers by addressing key challenges in course management, communication, and organization.

## Features

1. **Automated Course Registration**
   - Automated reminders
   - Pre-laid schedules
   - Real-time availability checks

2. **Enhanced Communication**
   - Direct messaging between students and lecturers
   - File sharing capabilities
   - Real-time notifications

3. **Centralized Information**
   - Course schedules display
   - Assignment deadlines with progress tracking
   - Weightage indication for assignments

4. **Secure Access**
   - User authentication with email verification
   - Profile management
   - JWT-based security

5. **Course Management**
   - Tools for administrators to add, edit, and delete courses

6. **Schedule Planning**
   - Create and manage study schedules

7. **Task Management**
   - Add, edit, and delete tasks and deadlines

8. **Push Notifications**
   - Reminders for upcoming tasks and deadlines

9. **Progress Tracking**
   - Academic performance insights

10. **Resource Storage**
    - Section for storing notes and study materials

## Design Features

- Minimalistic, sleek design with dark tone colors
- Responsive layout for all device sizes
- Smooth fade-in animations for all elements
- Modern UI with Google Fonts and Font Awesome icons

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- Tailwind CSS for styling
- Intersection Observer API for animations
- Google Fonts for typography
- Font Awesome for icons

### Backend
- Node.js with Express.js
- JWT for authentication
- Nodemailer for sending verification emails
- Google SMTP for email delivery

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Frontend Only Setup
1. Clone this repository
2. Open `index.html` in a web browser
3. Navigate through the frontend interface

### Full Stack Setup (Frontend + Backend)
1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure email settings in `config.js` (already set up with provided credentials)
4. Start the server:
   ```
   npm start
   ```
5. Access the application at `http://localhost:8000`

## Email Verification Flow

1. User registers through the registration form
2. System sends a verification email to the provided address
3. User clicks the verification link in the email
4. Email is verified and user can now log in

## Directory Structure

```
mirage-education-system/
├── assets/                  # Static assets like images
├── css/
│   └── styles.css           # Custom CSS styles
├── js/
│   ├── script.js            # Main JavaScript file
│   ├── registration.js      # Registration form handling
│   └── verification.js      # Email verification handling
├── config.js                # Server configuration
├── server.js                # Express.js server
├── package.json             # Node.js dependencies
├── index.html               # Main homepage
├── registration.html        # Registration page
└── verification.html        # Email verification page
```

## Demo Credentials

For demonstration purposes, the following email credentials are configured:

- Email: caseyng100@gmail.com
- App Password: aygi egvp bitj rjlc

**Note:** In a production environment, these credentials should be stored as environment variables and not hard-coded.

## Credits

- Concept based on "Integrated System Project - Proposal" by Casey Ng
- Design inspired by modern web applications
- Images from Pexels.com
