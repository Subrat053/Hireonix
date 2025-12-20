// ========================================
// Hireonix - MAIN JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeHamburgerMenu();
    initializeFormSubmission();
    initializeScrollAnimations();
    initializeSmoothScroll();
});

// ========================================
// HAMBURGER MENU FUNCTIONALITY
// ========================================

function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('menuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-list a');

    // Open menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close menu
    function closeMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    menuClose.addEventListener('click', closeMenu);

    // Close menu when link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ========================================
// FORM SUBMISSION WITH PHPMAILER
// ========================================

function initializeFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formStatus.textContent = '';
        formStatus.className = '';

        try {
            // Send data to PHP backend
            const response = await fetch('../server/send-email.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Success message
                formStatus.className = 'form-status success';
                formStatus.textContent = '✓ Message sent successfully! We\'ll get back to you soon.';
                contactForm.reset();
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = '';
                }, 5000);
            } else {
                // Error message
                formStatus.className = 'form-status error';
                formStatus.textContent = '✗ Error: ' + (result.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            formStatus.className = 'form-status error';
            formStatus.textContent = '✗ Network error. Please check your connection and try again.';
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    // Real-time form validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField.call(this);
            }
        });
    });
}

function validateField() {
    const field = this;
    const value = field.value.trim();
    let isValid = true;

    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }

    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        isValid = phoneRegex.test(value);
    }

    if (!isValid) {
        field.classList.add('error');
        field.style.borderColor = '#fee2e2';
    } else {
        field.classList.remove('error');
        field.style.borderColor = '';
    }

    return isValid;
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initializeScrollAnimations() {
    // Observe elements for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation delay based on element position
                const elements = document.querySelectorAll('.fade-in-up, .slide-in-left, .zoom-in');
                elements.forEach((el, index) => {
                    if (el === entry.target) {
                        el.style.animationDelay = (index * 0.1) + 's';
                    }
                });
                
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in-up, .slide-in-left, .zoom-in').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Add scroll class to header
window.addEventListener('scroll', function() {
    const header = document.getElementById('site-header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 8px 30px rgba(37, 99, 235, 0.2)';
    } else {
        header.style.boxShadow = '0 4px 20px rgba(37, 99, 235, 0.1)';
    }
});

// Prevent multiple form submissions
function preventDoubleSubmit() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function() {
        const submitBtn = this.querySelector('.btn-submit');
        if (submitBtn.disabled) {
            return false;
        }
    });
}

// Add animation to cards on hover
document.querySelectorAll('.intro-card, .opportunity-card, .review-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease-in-out';
    });
});

// Initialize ripple effect on buttons
document.querySelectorAll('.btn-apply, .btn-primary, .btn-submit').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        // Remove previous ripples
        const existingRipple = this.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        this.appendChild(ripple);
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Skip to main content with keyboard shortcut
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        document.querySelector('.intro-links')?.scrollIntoView({ behavior: 'smooth' });
    }
});

// Log initialization
console.log('Hireonix - Application Initialized Successfully ✓');