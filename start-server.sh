#!/bin/bash

echo "Starting Mirage Education System Server..."
echo "========================================"
echo "Using Gmail SMTP authentication for email verification"
echo "Email: caseyng100@gmail.com"
echo "App Password: aygi egvp bitj rjlc"
echo "========================================" 

# Install required dependencies if they don't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install express body-parser jsonwebtoken nodemailer bcryptjs
fi

# Check if Node.js is available
if ! command -v node &> /dev/null
then
    echo "Error: Node.js is not installed or not in PATH"
    exit 1
fi

# Check if the server.js file exists
if [ ! -f "server.js" ]; then
    echo "Error: server.js file not found"
    exit 1
fi

# Check if config.js file exists
if [ ! -f "config.js" ]; then
    echo "Error: config.js file not found"
    exit 1
fi

# Set environment variables for email configuration
export EMAIL_USER="caseyng100@gmail.com"
export EMAIL_PASS="aygi egvp bitj rjlc"
export JWT_SECRET="mirage-super-secret-jwt-key"
export FRONTEND_URL="http://localhost:8000"

echo "Environment variables set for email configuration"
echo "Starting Node.js server..."

# Start the Node.js server
node server.js

# Check if server started successfully
if [ $? -ne 0 ]; then
    echo "Error: Failed to start the server"
    exit 1
fi
