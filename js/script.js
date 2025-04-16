// Initialize elements immediately visible on page load
function initializeVisibleElements() {
    const fadeInElements = document.querySelectorAll('.fade-in');
    
    // Make elements above the fold visible immediately
    fadeInElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            setTimeout(() => {
                element.classList.add('visible');
            }, 300); // Small delay for better effect
        }
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initial setup for elements that are immediately visible
    initializeVisibleElements();
    
    // Fade-in animation using Intersection Observer
    const fadeInElements = document.querySelectorAll('.fade-in:not(.visible)');
    
    // Create an observer with options
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If element is in viewport
            if (entry.isIntersecting) {
                // Add visible class to trigger the animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 150); // Small delay for better effect
                
                // Unobserve the element after it's animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // Use viewport as root
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -10% 0px' // Trigger slightly before fully in view
    });
    
    // Observe each fade-in element
    fadeInElements.forEach(element => {
        observer.observe(element);
    });
    
    // Form validation for the login form
    const loginForm = document.querySelector('#login form');
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const loginButton = document.querySelector('#login button');
    
    if (loginForm) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Simple validation for email
            if (!emailInput.value || !emailInput.value.includes('@')) {
                emailInput.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                emailInput.style.borderColor = '';
            }
            
            // Simple validation for password
            if (!passwordInput.value || passwordInput.value.length < 6) {
                passwordInput.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                passwordInput.style.borderColor = '';
            }
            
            if (isValid) {
                // For demo purposes, we'll just show an alert
                alert('Login functionality would be implemented in a real system.');
                // Reset form
                loginForm.reset();
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Fallback for browsers that don't support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        fadeInElements.forEach(element => {
            element.classList.add('visible');
        });
    }
});

// Add a small preloader effect and handle scroll events
window.addEventListener('load', () => {
    // Add a slight delay for smoother experience
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 200);
    
    // Also handle scroll events for elements that might be missed by IntersectionObserver
    const handleScroll = () => {
        const fadeInElements = document.querySelectorAll('.fade-in:not(.visible)');
        fadeInElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                setTimeout(() => {
                    element.classList.add('visible');
                }, 150);
            }
        });
    };
    
    // Add scroll event listener with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 100);
    });
    
    // Initial check on load
    handleScroll();
});
