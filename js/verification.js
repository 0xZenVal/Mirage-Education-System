document.addEventListener('DOMContentLoaded', () => {
    const emailDisplay = document.getElementById('emailDisplay');
    const resendEmailBtn = document.getElementById('resendEmailBtn');
    const continueToLoginBtn = document.getElementById('continueToLoginBtn');
    const retryVerificationBtn = document.getElementById('retryVerificationBtn');
    
    const verificationPending = document.getElementById('verificationPending');
    const verificationSuccess = document.getElementById('verificationSuccess');
    const verificationError = document.getElementById('verificationError');
    
    // Get email from localStorage (set during registration)
    const userEmail = localStorage.getItem('registeredEmail');
    
    // Display the user's email
    if (emailDisplay && userEmail) {
        emailDisplay.textContent = userEmail;
    } else if (emailDisplay) {
        emailDisplay.textContent = 'your email address';
    }
    
    // Check for verification token in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const verifyStatus = urlParams.get('status');
    
    // If there's a token, attempt to verify the email
    if (token) {
        verifyEmail(token);
    } else if (verifyStatus === 'success') {
        // Show success message if status is passed directly
        showVerificationState('success');
    } else if (verifyStatus === 'error') {
        // Show error message if status is passed directly
        showVerificationState('error');
    }
    
    // Add event listeners
    if (resendEmailBtn) {
        resendEmailBtn.addEventListener('click', async () => {
            resendVerificationEmail();
        });
    }
    
    if (continueToLoginBtn) {
        continueToLoginBtn.addEventListener('click', () => {
            window.location.href = 'index.html#login';
        });
    }
    
    if (retryVerificationBtn) {
        retryVerificationBtn.addEventListener('click', () => {
            resendVerificationEmail();
        });
    }
    
    // Function to verify email with token
    async function verifyEmail(token) {
        try {
            // In a real application, this would make an API call to verify the token
            const response = await fetch(`/api/verify-email?token=${token}`, {
                method: 'GET'
            });
            
            if (response.ok) {
                showVerificationState('success');
            } else {
                showVerificationState('error');
            }
        } catch (error) {
            console.error('Verification error:', error);
            showVerificationState('error');
        }
    }
    
    // Function to resend verification email
    async function resendVerificationEmail() {
        if (!userEmail) {
            alert('Email address not found. Please register again.');
            window.location.href = 'registration.html';
            return;
        }
        
        // Update button state
        resendEmailBtn.disabled = true;
        resendEmailBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Sending...';
        
        try {
            // In a real application, this would make an API call to resend the verification email
            const response = await fetch('/api/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userEmail })
            });
            
            if (response.ok) {
                // Show success message
                alert('Verification email has been resent. Please check your inbox.');
            } else {
                // Show error message
                alert('Failed to resend verification email. Please try again later.');
            }
        } catch (error) {
            console.error('Resend verification error:', error);
            alert('An error occurred while trying to resend the verification email.');
        } finally {
            // Reset button state
            resendEmailBtn.disabled = false;
            resendEmailBtn.innerHTML = '<i class="fas fa-redo-alt mr-1"></i> Resend Email';
        }
    }
    
    // Function to show different verification states
    function showVerificationState(state) {
        // Hide all states first
        verificationPending.classList.add('hidden');
        verificationSuccess.classList.add('hidden');
        verificationError.classList.add('hidden');
        
        // Show the appropriate state
        if (state === 'success') {
            verificationSuccess.classList.remove('hidden');
        } else if (state === 'error') {
            verificationError.classList.remove('hidden');
        } else {
            verificationPending.classList.remove('hidden');
        }
    }
    
    // For demonstration purposes, let's detect if the server is not running
    // and provide appropriate feedback
    window.addEventListener('load', () => {
        // Check if we're in a development environment without the server
        const isDemoMode = true; // Set this to true for demo without a backend server
        
        if (isDemoMode) {
            // If there's a token parameter, simulate verification result
            if (token) {
                // For demo, let's assume token verification is successful if it's "valid_token"
                if (token === 'valid_token') {
                    showVerificationState('success');
                } else {
                    showVerificationState('error');
                }
            }
            
            // Override the resend email functionality in demo mode
            if (resendEmailBtn) {
                resendEmailBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Disable the button and show loading state
                    resendEmailBtn.disabled = true;
                    resendEmailBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Sending...';
                    
                    // Simulate API call delay
                    setTimeout(() => {
                        alert('Demo: Verification email would be resent in a real application. Check your inbox.');
                        
                        // Reset button state
                        resendEmailBtn.disabled = false;
                        resendEmailBtn.innerHTML = '<i class="fas fa-redo-alt mr-1"></i> Resend Email';
                    }, 1500);
                }, true); // Use capturing to override
            }
            
            // Add demo notice
            const demoNotice = document.createElement('div');
            demoNotice.classList.add('max-w-xl', 'mx-auto', 'mb-6', 'p-4', 'rounded-lg', 'bg-dark-300', 'border-l-4', 'border-yellow-500', 'text-yellow-400');
            demoNotice.innerHTML = `
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-info-circle text-yellow-400 mt-0.5"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm">
                            <strong>Demo Mode:</strong> This is a frontend demonstration. In a real deployment, this page would connect to a Node.js server to verify your email.
                        </p>
                        <p class="text-xs mt-2">
                            <a href="verification.html?token=valid_token" class="text-yellow-400 underline">Simulate successful verification</a> | 
                            <a href="verification.html?token=invalid_token" class="text-yellow-400 underline">Simulate failed verification</a>
                        </p>
                    </div>
                </div>
            `;
            
            const container = document.querySelector('.container');
            if (container) {
                container.insertBefore(demoNotice, container.firstChild);
            }
        }
    });
});
