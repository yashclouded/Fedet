// Modal functions
function openAuthModal(type) {
    const modal = document.getElementById('auth-modal');
    const tabs = modal.querySelectorAll('.tab-btn');
    const forms = modal.querySelectorAll('.auth-form');

    // Show modal
    modal.style.display = 'block';

    // Reset all tabs and forms
    tabs.forEach(tab => tab.classList.remove('active'));
    forms.forEach(form => form.classList.remove('active'));

    // Activate correct tab and form based on type
    switch(type) {
        case 'login':
            modal.querySelector('[data-tab="login"]').classList.add('active');
            document.getElementById('login-form-element').classList.add('active');
            break;
        case 'signup':
            modal.querySelector('[data-tab="signup-student"]').classList.add('active');
            document.getElementById('student-signup-form-element').classList.add('active');
            break;
        case 'signup-student':
            modal.querySelector('[data-tab="signup-student"]').classList.add('active');
            document.getElementById('student-signup-form-element').classList.add('active');
            break;
        case 'signup-company':
            modal.querySelector('[data-tab="signup-company"]').classList.add('active');
            document.getElementById('company-signup-form-element').classList.add('active');
            break;
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.style.display = 'none';
    
    // Reset all forms
    const forms = modal.querySelectorAll('form');
    forms.forEach(form => form.reset());
}

// Make functions available globally
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Close modal when clicking outside
    const modal = document.getElementById('auth-modal');
    window.onclick = function(event) {
        if (event.target === modal) {
            closeAuthModal();
        }
    };

    // Close modal when clicking the X button
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = closeAuthModal;
    }

    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            openAuthModal(tabType);
        });
    });

    // Forgot password functionality
    const forgotPasswordLink = document.querySelector('.forgot-password-link');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = document.querySelector('#login-email').value;
            if (!email) {
                showNotification('Please enter your email address', 'error');
                return;
            }
            try {
                await window.Auth.forgotPassword(email);
                closeAuthModal();
            } catch (error) {
                console.error('Forgot password error:', error);
            }
        });
    }

    // Form submission handlers
    const loginForm = document.getElementById('login-form-element');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            try {
                const email = this.querySelector('#login-email').value;
                const password = this.querySelector('#login-password').value;
                await window.Auth.login(email, password);
                closeAuthModal();
                this.reset();
            } catch (error) {
                console.error('Login error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });
    }

    const studentSignupForm = document.getElementById('student-signup-form-element');
    if (studentSignupForm) {
        studentSignupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            try {
                const formData = new FormData(this);
                await window.Auth.studentSignup(
                    formData.get('email'),
                    formData.get('password'),
                    formData.get('name'),
                    formData.get('university'),
                    formData.get('major')
                );
                closeAuthModal();
                this.reset();
            } catch (error) {
                console.error('Student signup error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });
    }

    const companySignupForm = document.getElementById('company-signup-form-element');
    if (companySignupForm) {
        companySignupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            try {
                const formData = new FormData(this);
                await window.Auth.companySignup(
                    formData.get('email'),
                    formData.get('password'),
                    formData.get('companyName'),
                    formData.get('industry'),
                    formData.get('description')
                );
                closeAuthModal();
                this.reset();
            } catch (error) {
                console.error('Company signup error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });
    }

    // Social auth buttons
    const googleBtn = document.querySelector('.social-auth-btn.google');
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                await window.Auth.signInWithGoogle();
            } catch (error) {
                console.error('Google sign in error:', error);
            }
        });
    }

    const githubBtn = document.querySelector('.social-auth-btn.github');
    if (githubBtn) {
        githubBtn.addEventListener('click', async () => {
            try {
                await window.Auth.signInWithGithub();
            } catch (error) {
                console.error('GitHub sign in error:', error);
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
            }
        });
    });

    // Password validation feedback
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            const isValid = this.checkValidity();
            const hint = this.parentElement.querySelector('.form-hint');
            if (hint) {
                hint.style.color = isValid ? '#4CAF50' : '#f44336';
            }
        });
    });

    // Animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate').forEach(element => {
        observer.observe(element);
    });

    // Add user profile dropdown
    const createUserProfileDropdown = () => {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const profileButton = document.createElement('div');
        profileButton.className = 'user-profile-button';
        
        // Get user profile data
        Auth.getUserProfile().then(profile => {
            const profilePic = profile.photoURL || 'default-avatar.png';
            const displayName = profile.name || profile.companyName || user.email;
            
            profileButton.innerHTML = `
                <img src="${profilePic}" alt="Profile" class="profile-pic">
                <span>${displayName}</span>
                <div class="dropdown-menu">
                    <a href="/profile.html">View Profile</a>
                    <a href="/settings.html">Settings</a>
                    <a href="/messages.html">Messages</a>
                    <a href="/notifications.html">Notifications</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="sign-out">Sign Out</a>
                </div>
            `;

            // Add click event for dropdown
            profileButton.addEventListener('click', (e) => {
                e.stopPropagation();
                profileButton.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                profileButton.classList.remove('active');
            });

            // Handle sign out
            profileButton.querySelector('.sign-out').addEventListener('click', async (e) => {
                e.preventDefault();
                await Auth.signOut();
            });

            // Add to navigation
            const nav = document.querySelector('.nav-links');
            nav.appendChild(profileButton);
        });
    };

    // Initialize user profile dropdown
    createUserProfileDropdown();
});