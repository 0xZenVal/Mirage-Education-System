document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const registerButton = document.getElementById('registerButton');
    const registrationMessage = document.getElementById('registrationMessage');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable the button and show loading state
            registerButton.disabled = true;
            registerButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating Account...';
            
            // Validate the form
            const isValid = validateForm();
            
            if (isValid) {
                try {
                    // Collect form data
                    const formData = {
                        firstName: document.getElementById('firstName').value.trim(),
                        lastName: document.getElementById('lastName').value.trim(),
                        email: document.getElementById('email').value.trim(),
                        studentId: document.getElementById('studentId').value.trim(),
                        password: document.getElementById('password').value,
                    };
                    
                    // Send the data to the server
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        // Successful registration
                        showMessage('success', 'Registration successful! Redirecting to verification page...');
                        
                        // Store the email in localStorage for the verification page
                        localStorage.setItem('registeredEmail', formData.email);
                        
                        // Redirect to the verification page after a short delay
                        setTimeout(() => {
                            window.location.href = '/verification.html';
                        }, 1500);
                    } else {
                        // Registration failed
                        showMessage('error', data.message || 'Registration failed. Please try again.');
                        
                        // Reset the button state
                        registerButton.disabled = false;
                        registerButton.innerHTML = '<i class="fas fa-user-plus mr-2"></i>Create Account';
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                    showMessage('error', 'An error occurred during registration. Please try again later.');
                    
                    // Reset the button state
                    registerButton.disabled = false;
                    registerButton.innerHTML = '<i class="fas fa-user-plus mr-2"></i>Create Account';
                }
            } else {
                // Reset the button state
                registerButton.disabled = false;
                registerButton.innerHTML = '<i class="fas fa-user-plus mr-2"></i>Create Account';
            }
        });
        
        // Add password confirmation validation
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        confirmPasswordInput.addEventListener('input', () => {
            if (passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.setCustomValidity('Passwords do not match');
            } else {
                confirmPasswordInput.setCustomValidity('');
            }
        });
        
        passwordInput.addEventListener('input', () => {
            if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.setCustomValidity('Passwords do not match');
            } else {
                confirmPasswordInput.setCustomValidity('');
            }
        });
    }
    
    // Form validation function
    function validateForm() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const studentId = document.getElementById('studentId').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // Reset any previous messages
        registrationMessage.classList.add('hidden');
        
        // Validate first name and last name
        if (!firstName || !lastName) {
            showMessage('error', 'Please enter your full name.');
            return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showMessage('error', 'Please enter a valid email address.');
            return false;
        }
        
        // Validate student ID
        if (!studentId) {
            showMessage('error', 'Please enter your student ID.');
            return false;
        }
        
        // Validate password (minimum 8 characters)
        if (!password || password.length < 8) {
            showMessage('error', 'Password must be at least 8 characters long.');
            return false;
        }
        
        // Validate password confirmation
        if (password !== confirmPassword) {
            showMessage('error', 'Passwords do not match.');
            return false;
        }
        
        // Validate terms agreement
        if (!terms) {
            showMessage('error', 'You must agree to the Terms and Conditions.');
            return false;
        }
        
        return true;
    }
    
    // Function to display messages
    function showMessage(type, message) {
        registrationMessage.classList.remove('hidden', 'bg-green-900/30', 'bg-red-900/30', 'border-green-500', 'border-red-500', 'text-green-400', 'text-red-400');
        
        if (type === 'success') {
            registrationMessage.classList.add('bg-green-900/30', 'border-l-4', 'border-green-500', 'text-green-400');
            registrationMessage.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
        } else {
            registrationMessage.classList.add('bg-red-900/30', 'border-l-4', 'border-red-500', 'text-red-400');
            registrationMessage.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
        }
        
        registrationMessage.classList.remove('hidden');
        
        // Scroll to the message
        registrationMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // For demonstration purposes, let's detect if the server is not running
    // and provide appropriate feedback
    window.addEventListener('load', () => {
        // Check if we're in a development environment without the server
        const isDemoMode = true; // Set this to true for demo without a backend server
        
        if (isDemoMode && registrationForm) {
            const demoNotice = document.createElement('div');
            demoNotice.classList.add('mb-6', 'p-4', 'rounded-lg', 'bg-dark-300', 'border-l-4', 'border-yellow-500', 'text-yellow-400');
            demoNotice.innerHTML = `
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-info-circle text-yellow-400 mt-0.5"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm">
                            <strong>Demo Mode:</strong> This is a frontend demonstration. In a real deployment, this form would connect to a Node.js server for registration and email verification.
                        </p>
                    </div>
                </div>
            `;
            
            registrationForm.insertBefore(demoNotice, registrationForm.firstChild);
            
            // Override the form submission in demo mode
            registrationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (validateForm()) {
                    // Store the email in localStorage for the verification page
                    const email = document.getElementById('email').value.trim();
                    localStorage.setItem('registeredEmail', email);
                    
                    // Simulate successful registration
                    showMessage('success', 'Demo registration successful! Redirecting to verification page...');
                    
                    // Redirect to the verification page after a short delay
                    setTimeout(() => {
                        window.location.href = 'verification.html';
                    }, 1500);
                }
            }, true); // Use capturing to override the previous listener
        }
    });
});
