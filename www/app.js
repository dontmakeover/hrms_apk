// Talent Factor HRMS - Mobile App JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Screen Management
    const screens = {
        onboarding1: document.getElementById('onboarding-1'),
        onboarding2: document.getElementById('onboarding-2'),
        onboarding3: document.getElementById('onboarding-3'),
        login: document.getElementById('login-screen'),
        signup: document.getElementById('signup-screen'),
        forgotPassword: document.getElementById('forgot-password-screen'),
        orgSetup1: document.getElementById('org-setup-1'),
        orgSetup2: document.getElementById('org-setup-2'),
        orgSetup3: document.getElementById('org-setup-3'),
        home: document.getElementById('home-screen')
    };

    let currentScreen = 'onboarding1';
    let touchStartX = 0;
    let touchEndX = 0;

    // Navigate to a specific screen
    function navigateTo(screenName, direction = 'forward') {
        const current = screens[currentScreen];
        const next = screens[screenName];

        if (!next || currentScreen === screenName) return;

        // Add slide-left class to current screen if going forward
        if (direction === 'forward') {
            current.classList.add('slide-left');
        }

        // Show the next screen
        setTimeout(() => {
            current.classList.remove('active', 'slide-left');
            next.classList.add('active');
            currentScreen = screenName;
        }, direction === 'forward' ? 200 : 0);
    }

    // Skip to signup (for first-time users after onboarding)
    function skipToAuth() {
        // Mark onboarding as completed
        localStorage.setItem('onboardingCompleted', 'true');
        // First-time users should see Signup page
        navigateTo('signup');
    }

    // Onboarding Navigation - Screen 1
    document.getElementById('skip-btn-1')?.addEventListener('click', skipToAuth);
    document.getElementById('next-btn-1')?.addEventListener('click', () => navigateTo('onboarding2'));

    // Onboarding Navigation - Screen 2
    document.getElementById('skip-btn-2')?.addEventListener('click', skipToAuth);
    document.getElementById('next-btn-2')?.addEventListener('click', () => navigateTo('onboarding3'));

    // Onboarding Navigation - Screen 3
    document.getElementById('get-started-btn')?.addEventListener('click', () => {
        localStorage.setItem('onboardingCompleted', 'true');
        // First-time users should see Signup page
        navigateTo('signup');
    });

    // Auth Screen Navigation
    document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('forgotPassword');
    });

    document.getElementById('contact-support-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        // Open email client for support
        window.location.href = 'mailto:support@talentfactor.com?subject=Support%20Request';
    });

    document.getElementById('login-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('login');
    });

    document.getElementById('back-to-login-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('login');
    });

    // Password Toggle Visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const eyeIcon = this.querySelector('.eye-icon');
            const eyeOffIcon = this.querySelector('.eye-off-icon');

            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.classList.add('hidden');
                eyeOffIcon.classList.remove('hidden');
            } else {
                input.type = 'password';
                eyeIcon.classList.remove('hidden');
                eyeOffIcon.classList.add('hidden');
            }
        });
    });

    // Login Form Submission
    document.getElementById('login-form')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (email && password) {
            const btn = this.querySelector('.auth-btn');
            btn.classList.add('loading');
            btn.textContent = '';

            // Simulate login
            setTimeout(() => {
                btn.classList.remove('loading');
                btn.textContent = 'Login';

                // Check if organization setup is completed
                const orgSetupCompleted = localStorage.getItem('organization_setup_completed');
                const orgSetupSkipped = localStorage.getItem('organization_setup_skipped');

                if (orgSetupCompleted === 'true' || orgSetupSkipped === 'true') {
                    navigateTo('home');
                } else {
                    // Navigate to organization setup
                    navigateTo('orgSetup1');
                }
            }, 1500);
        }
    });

    // Signup Form Submission
    document.getElementById('signup-form')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const employeeId = document.getElementById('signup-employee-id').value.trim(); // Optional
        const password = document.getElementById('signup-password').value;
        const termsAccepted = document.getElementById('terms-checkbox').checked;

        // Validation
        if (!name) {
            alert('Please enter your full name');
            return;
        }
        if (!email) {
            alert('Please enter your work email');
            return;
        }
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        if (!password) {
            alert('Please enter a password');
            return;
        }
        if (password.length < 8) {
            alert('Password must be at least 8 characters');
            return;
        }
        if (!termsAccepted) {
            alert('Please accept the Terms and Conditions');
            return;
        }

        // All validations passed (Employee ID is optional)
        const btn = this.querySelector('.auth-btn');
        btn.classList.add('loading');
        btn.textContent = '';

        // Simulate signup
        setTimeout(() => {
            btn.classList.remove('loading');
            btn.textContent = 'Sign Up';
            // After signup, go to organization setup
            navigateTo('orgSetup1');
        }, 1500);
    });

    // Forgot Password Form Submission
    document.getElementById('forgot-password-form')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('reset-email').value;

        if (email) {
            const btn = this.querySelector('.auth-btn');
            btn.classList.add('loading');
            btn.textContent = '';

            // Simulate sending reset link
            setTimeout(() => {
                btn.classList.remove('loading');
                btn.textContent = 'Send Reset Link';
                alert('Password reset link sent to your email!');
                navigateTo('login');
            }, 1500);
        }
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', function () {
        navigateTo('login');
    });

    // Touch/Swipe Support for Onboarding
    const onboardingScreens = [screens.onboarding1, screens.onboarding2, screens.onboarding3];

    onboardingScreens.forEach((screen, index) => {
        if (!screen) return;

        screen.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        screen.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(index);
        }, { passive: true });
    });

    function handleSwipe(currentIndex) {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentIndex < 2) {
                // Swipe left - go to next
                const nextScreens = ['onboarding2', 'onboarding3'];
                navigateTo(nextScreens[currentIndex]);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - go to previous
                const prevScreens = ['onboarding1', 'onboarding2'];
                navigateTo(prevScreens[currentIndex - 1], 'backward');
            }
        }
    }

    // Check if onboarding was completed
    function checkOnboardingStatus() {
        const completed = localStorage.getItem('onboardingCompleted');
        if (completed === 'true') {
            // Show Signup page by default for first-time users
            // Users can click "Already have an account? Login" to go to login
            screens.onboarding1.classList.remove('active');
            screens.signup.classList.add('active');
            currentScreen = 'signup';
        }
    }

    // Initialize
    checkOnboardingStatus();

    // Social Login Buttons (placeholder actions)
    document.querySelectorAll('.google-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Google Sign-In would be triggered here');
        });
    });

    document.querySelectorAll('.apple-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Apple Sign-In would be triggered here');
        });
    });

    // Terms and Conditions link
    document.getElementById('terms-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Open Terms and Conditions (could be a WebView or external URL)
        window.open('https://talentfactor.com/terms', '_blank');
    });

    // Privacy Policy link
    document.getElementById('privacy-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Open Privacy Policy (could be a WebView or external URL)
        window.open('https://talentfactor.com/privacy', '_blank');
    });

    // ===== Organization Setup Logic =====

    // Organization Setup Step 1 - Back Button
    document.getElementById('org-setup-1-back')?.addEventListener('click', () => {
        navigateTo('login', 'backward');
    });

    // Organization Setup Step 1 - Next Button
    document.getElementById('org-step-1-next')?.addEventListener('click', () => {
        const orgName = document.getElementById('org-name').value;
        const orgPhone = document.getElementById('org-phone').value;
        const countryCode = document.getElementById('selected-code').textContent;

        if (!orgName.trim()) {
            alert('Please enter your organization name');
            return;
        }
        if (!orgPhone.trim()) {
            alert('Please enter your organization phone number');
            return;
        }

        // Save to localStorage (simulated API save)
        localStorage.setItem('organization_name', orgName);
        localStorage.setItem('organization_phone', orgPhone);
        localStorage.setItem('organization_country_code', countryCode);

        // Show validation checkmark
        const inputCheck = document.querySelector('#org-setup-1 .input-check');
        if (inputCheck) inputCheck.classList.remove('hidden');

        // Pre-fill Step 2
        const adminOrgName = document.getElementById('admin-org-name');
        const adminOrgPhone = document.getElementById('admin-org-phone');
        if (adminOrgName) adminOrgName.value = orgName;
        if (adminOrgPhone) adminOrgPhone.value = orgPhone;

        navigateTo('orgSetup2');
    });

    // Organization Setup Step 2 - Back Button
    document.getElementById('org-setup-2-back')?.addEventListener('click', () => {
        navigateTo('orgSetup1', 'backward');
    });

    // Organization Setup Step 2 - Next Button
    document.getElementById('org-step-2-next')?.addEventListener('click', () => {
        const orgName = document.getElementById('admin-org-name').value;
        const orgPhone = document.getElementById('admin-org-phone').value;

        // Update saved values if changed
        if (orgName.trim()) {
            localStorage.setItem('organization_name', orgName);
        }
        if (orgPhone.trim()) {
            localStorage.setItem('organization_phone', orgPhone);
        }

        navigateTo('orgSetup3');
    });

    // Organization Setup Step 3 - Back Button
    document.getElementById('org-setup-3-back')?.addEventListener('click', () => {
        navigateTo('orgSetup2', 'backward');
    });

    // Organization Setup Step 3 - Next Button
    document.getElementById('org-step-3-next')?.addEventListener('click', () => {
        const selectedSize = document.querySelector('input[name="org-size"]:checked');
        if (selectedSize) {
            localStorage.setItem('organization_size', selectedSize.value);
        }

        // Mark organization setup as completed
        localStorage.setItem('organization_setup_completed', 'true');
        localStorage.removeItem('organization_setup_skipped');

        navigateTo('home');
    });

    // Organization Setup Step 3 - Skip Button
    document.getElementById('org-skip-btn')?.addEventListener('click', () => {
        localStorage.setItem('organization_setup_skipped', 'true');
        navigateTo('home');
    });

    // Size Option Cards Selection
    const sizeOptions = document.querySelectorAll('.size-option-card');
    sizeOptions.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected from all
            sizeOptions.forEach(c => c.classList.remove('selected'));
            // Add selected to clicked
            card.classList.add('selected');
            // Check the radio
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // Country Code Dropdown - Step 1
    const countryCodeBtn = document.getElementById('country-code-btn');
    const countryDropdown = document.getElementById('country-dropdown');

    countryCodeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        countryDropdown?.classList.toggle('hidden');
    });

    document.querySelectorAll('#country-dropdown .country-option').forEach(option => {
        option.addEventListener('click', () => {
            const code = option.getAttribute('data-code');
            document.getElementById('selected-code').textContent = code;
            countryDropdown?.classList.add('hidden');
        });
    });

    // Country Code Dropdown - Step 2
    const countryCodeBtn2 = document.getElementById('country-code-btn-2');
    const countryDropdown2 = document.getElementById('country-dropdown-2');

    countryCodeBtn2?.addEventListener('click', (e) => {
        e.stopPropagation();
        countryDropdown2?.classList.toggle('hidden');
    });

    document.querySelectorAll('#country-dropdown-2 .country-option').forEach(option => {
        option.addEventListener('click', () => {
            const code = option.getAttribute('data-code');
            document.getElementById('selected-code-2').textContent = code;
            countryDropdown2?.classList.add('hidden');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        countryDropdown?.classList.add('hidden');
        countryDropdown2?.classList.add('hidden');
    });

    // Organization name input validation feedback
    const orgNameInput = document.getElementById('org-name');
    orgNameInput?.addEventListener('input', () => {
        const inputCheck = document.querySelector('#org-setup-1 .input-check');
        if (orgNameInput.value.trim().length > 2) {
            inputCheck?.classList.remove('hidden');
        } else {
            inputCheck?.classList.add('hidden');
        }
    });
});

