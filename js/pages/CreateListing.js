/**
 * ReDeal — Create Listing Page Logic
 * Handles form validation, submission, and saving new listings
 */

import { $, $$, createElement, escapeHtml } from '../utils/dom.js';
import { onReady, delegate } from '../utils/events.js';
import { categories, conditions, getCategoryName, getConditionName } from '../data/categories.js';
import { products as allProducts } from '../data/products.js';
import { addCreatedProduct, getCreatedProducts, getNextId } from '../data/storage.js';
import { alert as showAlert, confirm as showConfirm } from '../components/Modal.js';

let formDirty = false;
let isSubmitting = false;

/**
 * Initialize the create listing page
 */
function init() {
  console.log('Create Listing page initialized');

  // Populate category dropdown
  populateCategories();

  // Render condition radio buttons
  renderConditions();

  // Setup form validation
  setupValidation();

  // Setup form submission
  setupSubmission();

  // Setup cancel button
  setupCancel();

  // Setup beforeunload warning
  setupBeforeUnload();
}

/**
 * Populate category select with options from categories.js
 */
function populateCategories() {
  const select = $('#category');
  if (!select) return;

  categories.forEach(cat => {
    if (cat.id !== 'all') {
      const option = createElement('option', { value: cat.id }, cat.name);
      select.appendChild(option);
    }
  });
}

/**
 * Render condition radio buttons
 */
function renderConditions() {
  const group = $('#condition-group');
  if (!group) return;

  conditions.forEach((cond, index) => {
    if (cond.id === 'all') return;

    const id = `condition-${cond.id}`;
    const label = createElement('label', { class: 'radio-label' }, [
      createElement('input', {
        type: 'radio',
        id,
        name: 'condition',
        value: cond.id,
        required: true,
      }),
      createElement('span', {}, cond.name),
    ]);

    group.appendChild(label);
  });
}

/**
 * Validation rules for each field
 */
const validators = {
  title: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Title is required';
    if (trimmed.length < 5) return 'Title must be at least 5 characters';
    if (trimmed.length > 80) return 'Title must be no more than 80 characters';
    return null;
  },
  price: (value) => {
    if (!value || value.trim() === '') return 'Price is required';
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return 'Price must be greater than ₱0';
    if (!Number.isInteger(num)) return 'Price must be a whole number';
    return null;
  },
  category: (value) => {
    if (!value) return 'Please select a category';
    return null;
  },
  condition: (value) => {
    if (!value) return 'Please select a condition';
    return null;
  },
  description: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Description is required';
    if (trimmed.length < 20) return 'Description must be at least 20 characters';
    if (trimmed.length > 1000) return 'Description must be no more than 1000 characters';
    return null;
  },
  location: (value) => null, // Optional
  imageUrl: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return null; // Optional
    try {
      const url = new URL(trimmed);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return 'URL must use http or https';
      }
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },
};

/**
 * Field selectors mapping
 */
const fieldSelectors = {
  title: '#title',
  price: '#price',
  category: '#category',
  condition: 'input[name="condition"]:checked',
  description: '#description',
  location: '#location',
  imageUrl: '#image-url',
};

/**
 * Get field value
 */
function getFieldValue(fieldName) {
  const selector = fieldSelectors[fieldName];
  const el = $(selector);
  if (!el) return '';

  if (el.type === 'radio') {
    return el.value;
  }
  return el.value;
}

/**
 * Show error for a field
 */
function showError(fieldName, message) {
  const errorEl = $(`#${fieldName}-error`);
  const inputEl = $(fieldSelectors[fieldName]);

  if (errorEl) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  if (inputEl) {
    inputEl.style.borderColor = 'var(--color-error)';
    inputEl.setAttribute('aria-invalid', 'true');
    inputEl.setAttribute('aria-describedby', `${fieldName}-error`);
  }
}

/**
 * Clear error for a field
 */
function clearError(fieldName) {
  const errorEl = $(`#${fieldName}-error`);
  const inputEl = $(fieldSelectors[fieldName]);

  if (errorEl) {
    errorEl.textContent = '';
    errorEl.hidden = true;
  }

  if (inputEl) {
    inputEl.style.borderColor = '';
    inputEl.removeAttribute('aria-invalid');
    inputEl.removeAttribute('aria-describedby');
  }
}

/**
 * Validate a single field
 */
function validateField(fieldName) {
  const value = getFieldValue(fieldName);
  const error = validators[fieldName](value);

  if (error) {
    showError(fieldName, error);
    return false;
  } else {
    clearError(fieldName);
    return true;
  }
}

/**
 * Check if all required fields are valid
 */
function checkFormValidity() {
  const requiredFields = ['title', 'price', 'category', 'condition', 'description', 'imageUrl'];
  return requiredFields.map(field => validateField(field)).every(Boolean);
}

/**
 * Update submit button state
 */
function updateSubmitButton() {
  const submitBtn = $('#submit-btn');
  if (!submitBtn) return;

  const isValid = checkFormValidity() && !isSubmitting;
  submitBtn.disabled = !isValid;
  submitBtn.setAttribute('aria-disabled', !isValid);
}

/**
 * Setup real-time validation on input/change
 */
function setupValidation() {
  // Text inputs, textarea, select - validate on input and blur
  const textFields = ['title', 'price', 'category', 'description', 'location', 'imageUrl'];

  textFields.forEach(fieldName => {
    const selector = fieldSelectors[fieldName];
    if (!selector) return;

    // For select and input elements
    const els = $$(selector);
    els.forEach(el => {
      el.addEventListener('input', () => {
        formDirty = true;
        validateField(fieldName);
        updateSubmitButton();
      });

      el.addEventListener('blur', () => {
        validateField(fieldName);
        updateSubmitButton();
      });
    });
  });

  // Radio buttons - validate on change
  $$('input[name="condition"]').forEach(radio => {
    radio.addEventListener('change', () => {
      formDirty = true;
      validateField('condition');
      updateSubmitButton();
    });
  });

  // Initial validation check
  updateSubmitButton();
}

/**
 * Setup form submission handler
 */
function setupSubmission() {
  const form = $('#create-listing-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Final validation
    if (!checkFormValidity()) {
      // Focus first invalid field
      const firstInvalid = $$('.form-input[aria-invalid="true"], .form-textarea[aria-invalid="true"], .form-select[aria-invalid="true"]')[0];
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    isSubmitting = true;
    const submitBtn = $('#submit-btn');
    if (submitBtn) {
      submitBtn.classList.add('btn--loading');
      submitBtn.textContent = 'Creating...';
      submitBtn.disabled = true;
    }

    try {
      // Build product object
      const product = buildProductObject();

      // Save to localStorage
      addCreatedProduct(product);

      // Redirect to product detail page
      formDirty = false; // Prevent beforeunload warning
      window.location.href = `product.html?id=${product.id}`;
    } catch (error) {
      console.error('Failed to create listing:', error);
      await showAlert({
        title: 'Error',
        message: 'Failed to create listing. Please try again.',
      });
      isSubmitting = false;
      if (submitBtn) {
        submitBtn.classList.remove('btn--loading');
        submitBtn.textContent = 'Create Listing';
        updateSubmitButton();
      }
    }
  });
}

/**
 * Build product object from form data
 */
function buildProductObject() {
  const title = getFieldValue('title').trim();
  const price = Number(getFieldValue('price'));
  const category = getFieldValue('category');
  const condition = getFieldValue('condition');
  const description = getFieldValue('description').trim();
  const location = getFieldValue('location').trim() || 'Philippines';
  const imageUrl = getFieldValue('imageUrl').trim() || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';

  // Generate next ID using storage.getNextId with merged products array
  const nextId = getNextId(allProducts);

  // Generate seller initials from "You"
  const sellerInitials = 'YU';

  return {
    id: nextId,
    title,
    price: `₱${price.toLocaleString()}`,
    category,
    condition,
    timeAgo: 'Just now',
    sellerName: 'You',
    sellerInitials,
    sellerRating: 0,
    sellerReviews: 0,
    image: imageUrl,
    location,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    description,
    defects: [],
  };
}

/**
 * Setup cancel button
 */
function setupCancel() {
  const cancelBtn = $('#cancel-btn');
  if (!cancelBtn) return;

  cancelBtn.addEventListener('click', () => {
    if (formDirty) {
      showConfirm({
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Are you sure you want to leave?',
        confirmLabel: 'Leave',
        cancelLabel: 'Stay',
        variant: 'secondary',
      }).then(confirmed => {
        if (confirmed) {
          window.location.href = 'marketplace.html';
        }
      });
    } else {
      window.location.href = 'marketplace.html';
    }
  });
}

/**
 * Setup beforeunload warning for unsaved changes
 */
function setupBeforeUnload() {
  window.addEventListener('beforeunload', (e) => {
    if (formDirty && !isSubmitting) {
      e.preventDefault();
      e.returnValue = ''; // Standard for Chrome
      return ''; // Standard for Firefox
    }
  });
}

// Initialize on DOM ready
onReady(init);