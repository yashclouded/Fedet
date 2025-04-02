// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Auth Modal Functions
function openAuthModal(type) {
    const modal = document.getElementById('auth-modal');
    modal.style.display = 'flex';
    modal.classList.add('active');
    switchAuthTab(type);
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function switchAuthTab(type) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginTab = document.querySelector('.auth-tab:nth-child(1)');
    const signupTab = document.querySelector('.auth-tab:nth-child(2)');
    
    if (type === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
        // Default to student signup
        switchSignupType('student');
    }
}

function switchSignupType(type) {
    const studentForm = document.getElementById('student-signup-form');
    const companyForm = document.getElementById('company-signup-form');
    const studentBtn = document.querySelector('.signup-type-btn:nth-child(1)');
    const companyBtn = document.querySelector('.signup-type-btn:nth-child(2)');
    
    if (type === 'student') {
        studentForm.style.display = 'block';
        companyForm.style.display = 'none';
        studentBtn.classList.add('active');
        companyBtn.classList.remove('active');
    } else {
        studentForm.style.display = 'none';
        companyForm.style.display = 'block';
        studentBtn.classList.remove('active');
        companyBtn.classList.add('active');
    }
}

// Form Handlers
function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Add loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        console.log('Login submitted:', data);
        submitBtn.classList.remove('loading');
        showNotification('Login successful!', 'success');
        closeAuthModal();
        form.reset();
    }, 1500);
}

function handleStudentSignup(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Add loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        console.log('Student signup submitted:', data);
        submitBtn.classList.remove('loading');
        showNotification('Student registration successful!', 'success');
        closeAuthModal();
        form.reset();
    }, 1500);
}

function handleCompanySignup(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Add loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        console.log('Company signup submitted:', data);
        submitBtn.classList.remove('loading');
        showNotification('Company registration successful!', 'success');
        closeAuthModal();
        form.reset();
    }, 1500);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add initial animation class to elements
    document.querySelectorAll('.animate').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with animate class
    document.querySelectorAll('.animate').forEach((el) => observer.observe(el));

    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Add hover effect to service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Add loading animation to buttons
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.type === 'submit') {
                e.preventDefault();
                this.classList.add('loading');
                
                // Simulate API call
                setTimeout(() => {
                    this.classList.remove('loading');
                    showNotification('Action completed successfully!');
                }, 1500);
            }
        });
    });
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('auth-modal');
    if (event.target === modal) {
        closeAuthModal();
    }
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Add staggered animation for child elements
            const children = entry.target.querySelectorAll('.animate-child');
            children.forEach((child, index) => {
                child.style.animationDelay = `${index * 0.1}s`;
            });
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .service-card, .registration-card, .stat-item').forEach(element => {
    observer.observe(element);
}); 