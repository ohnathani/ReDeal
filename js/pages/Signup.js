/**
 * ReDeal — Signup Page Logic
 * Handles form validation, submission, and demo bypass
 */

import { $, $$, createElement, escapeHtml } from '../utils/dom.js';
import { onReady, delegate } from '../utils/events.js';
import { registerUser, demoLogin, getRedirectUrl, clearRedirectUrl } from '../data/auth.js';
import { alert } from '../components/Modal.js';

let isSubmitting = false;

/**
 * Initialize the signup page
 */
function init() {
  console.log('Signup page initialized');

  setupValidation();
  setupSubmission();
  setupDemoBypass();
  setupPasswordToggles();
}

/**
 * Setup real-time validation
 */
function setupValidation() {
  const form = $('#signup-form');
  if (!form) return;

  const nameInput = $('#name');
  const emailInput = $('#email');
  const passwordInput = $('#password');
  const confirmInput = $('#confirm-password');
  const termsInput = $('#terms');

  // Name validation
  nameInput?.addEventListener('input', () => {
    validateName(nameInput);
    updateSubmitButton();
  });
  nameInput?.addEventListener('blur', () => {
    validateName(nameInput);
    updateSubmitButton();
  });

  // Email validation
  emailInput?.addEventListener('input', () => {
    validateEmail(emailInput);
    updateSubmitButton();
  });
  emailInput?.addEventListener('blur', () => {
    validateEmail(emailInput);
    updateSubmitButton();
  });

  // Password validation
  passwordInput?.addEventListener('input', () => {
    validatePassword(passwordInput);
    validateConfirmPassword();
    updateSubmitButton();
  });
  passwordInput?.addEventListener('blur', () => {
    validatePassword(passwordInput);
    validateConfirmPassword();
    updateSubmitButton();
  });

  // Confirm password validation
  confirmInput?.addEventListener('input', () => {
    validateConfirmPassword();
    updateSubmitButton();
  });
  confirmInput?.addEventListener('blur', () => {
    validateConfirmPassword();
    updateSubmitButton();
  });

  // Terms validation
  termsInput?.addEventListener('change', () => {
    validateTerms(termsInput);
    updateSubmitButton();
  });

  // No initial validation - button starts disabled in HTML
  // Validation runs on first user interaction (input/blur/change)
}

/**
 * Validate name field
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function validateName(input) {
  const value = input.value.trim();
  const errorId = 'name-error';
  const errorEl = $(`#${errorId}`);

  if (!value) {
    showError(input, errorEl, 'Full name is required');
    return false;
  }

  if (value.length < 2) {
    showError(input, errorEl, 'Name must be at least 2 characters');
    return false;
  }

  clearError(input, errorEl);
  return true;
}

/**
 * Validate email field
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function validateEmail(input) {
  const value = input.value.trim();
  const errorId = 'email-error';
  const errorEl = $(`#${errorId}`);

  if (!value) {
    showError(input, errorEl, 'Email is required');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    showError(input, errorEl, 'Please enter a valid email address');
    return false;
  }

  clearError(input, errorEl);
  return true;
}

/**
 * Validate password field
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function validatePassword(input) {
  const value = input.value;
  const errorId = 'password-error';
  const errorEl = $(`#${errorId}`);

  if (!value) {
    showError(input, errorEl, 'Password is required');
    return false;
  }

  if (value.length < 8) {
    showError(input, errorEl, 'Password must be at least 8 characters');
    return false;
  }

  clearError(input, errorEl);
  return true;
}

/**
 * Validate confirm password field
 * @returns {boolean}
 */
function validateConfirmPassword() {
  const passwordInput = $('#password');
  const confirmInput = $('#confirm-password');
  const errorId = 'confirm-password-error';
  const errorEl = $(`#${errorId}`);

  if (!passwordInput || !confirmInput) return false;

  const password = passwordInput.value;
  const confirm = confirmInput.value;

  if (!confirm) {
    showError(confirmInput, errorEl, 'Please confirm your password');
    return false;
  }

  if (password !== confirm) {
    showError(confirmInput, errorEl, 'Passwords do not match');
    return false;
  }

  clearError(confirmInput, errorEl);
  return true;
}

/**
 * Validate terms checkbox
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function validateTerms(input) {
  const errorId = 'terms-error';
  const errorEl = $(`#${errorId}`);

  if (!input.checked) {
    showError(input, errorEl, 'You must agree to the Terms of Service and Privacy Policy');
    return false;
  }

  clearError(input, errorEl);
  return true;
}

/**
 * Show error for an input
 * @param {HTMLInputElement} input
 * @param {HTMLElement} errorEl
 * @param {string} message
 */
function showError(input, errorEl, message) {
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }
  input.setAttribute('aria-invalid', 'true');
  input.style.borderColor = 'var(--color-error)';
}

/**
 * Clear error for an input
 * @param {HTMLInputElement} input
 * @param {HTMLElement} errorEl
 */
function clearError(input, errorEl) {
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.hidden = true;
  }
  input.removeAttribute('aria-invalid');
  input.style.borderColor = '';
}

/**
 * Check if form is valid
 * @returns {boolean}
 */
function checkFormValidity() {
  const nameInput = $('#name');
  const emailInput = $('#email');
  const passwordInput = $('#password');
  const confirmInput = $('#confirm-password');
  const termsInput = $('#terms');

  if (!nameInput || !emailInput || !passwordInput || !confirmInput || !termsInput) return false;

  const nameValid = validateName(nameInput);
  const emailValid = validateEmail(emailInput);
  const passwordValid = validatePassword(passwordInput);
  const confirmValid = validateConfirmPassword();
  const termsValid = validateTerms(termsInput);

  return nameValid && emailValid && passwordValid && confirmValid && termsValid && !isSubmitting;
}

/**
 * Update submit button state
 */
function updateSubmitButton() {
  const submitBtn = $('#submit-btn');
  if (!submitBtn) return;

  const isValid = checkFormValidity();
  submitBtn.disabled = !isValid;
  submitBtn.setAttribute('aria-disabled', !isValid);
}

/**
 * Setup form submission
 */
function setupSubmission() {
  const form = $('#signup-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!checkFormValidity()) {
      // Focus first invalid field
      const firstInvalid = $$('[aria-invalid="true"]')[0];
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    isSubmitting = true;
    setSubmittingState(true);

    try {
      const name = $('#name').value.trim();
      const email = $('#email').value.trim();
      const password = $('#password').value;

      const { user } = registerUser({ name, email, password });

      // Success - redirect
      const redirectUrl = getRedirectUrl();
      clearRedirectUrl();

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.location.href = 'index.html';
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setSubmittingState(false);
      isSubmitting = false;
      updateSubmitButton();

      await alert({
        title: 'Sign Up Failed',
        message: error.message || 'Failed to create account. Please try again.',
      });

      // Focus email field on error
      const emailInput = $('#email');
      if (emailInput) emailInput.focus();
    }
  });
}

/**
 * Set submitting state on button
 * @param {boolean} submitting
 */
function setSubmittingState(submitting) {
  const submitBtn = $('#submit-btn');
  if (!submitBtn) return;

  const btnText = submitBtn.querySelector('.btn__text');
  const btnLoading = submitBtn.querySelector('.btn__loading');

  if (submitting) {
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;
    if (btnText) btnText.hidden = true;
    if (btnLoading) btnLoading.hidden = false;
  } else {
    submitBtn.classList.remove('btn--loading');
    if (btnText) btnText.hidden = false;
    if (btnLoading) btnLoading.hidden = true;
  }
}

/**
 * Setup demo bypass button
 */
function setupDemoBypass() {
  const demoBtn = $('#demo-bypass-btn');
  if (!demoBtn) return;

  demoBtn.addEventListener('click', async () => {
    if (isSubmitting) return;

    isSubmitting = true;
    setSubmittingState(true);

    try {
      demoLogin();

      // Success - redirect
      const redirectUrl = getRedirectUrl();
      clearRedirectUrl();

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.location.href = 'index.html';
      }
    } catch (error) {
      console.error('Demo login failed:', error);
      setSubmittingState(false);
      isSubmitting = false;

      await alert({
        title: 'Error',
        message: 'Failed to start guest session. Please try again.',
      });
    }
  });
}

/**
 * Setup password visibility toggles
 */
function setupPasswordToggles() {
  const toggleBtns = $$('.form-input-toggle');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.toggleTarget;
      const input = $(`#${targetId}`);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      // Update icon
      const svg = btn.querySelector('svg');
      if (svg) {
        if (isPassword) {
          // Show "hide" icon (eye with slash)
          svg.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          `;
        } else {
          // Show "show" icon (eye)
          svg.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          `;
        }
      }

      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });
}

// Initialize on DOM ready
onReady(init);