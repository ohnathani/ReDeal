/**
 * ReDeal — Profile Page Logic
 * Renders user profile, listings, favorites, and settings
 */

import { $, $$, createElement, escapeHtml, empty } from '../utils/dom.js';
import { onReady } from '../utils/events.js';
import { requireAuth } from '../utils/auth-guard.js';
import { getCurrentUser, logout, updateUser } from '../data/auth.js';
import { getCreatedProducts } from '../data/storage.js';
import { getFavorites, isFavorite as isFavoriteUtil } from '../utils/favorites.js';
import { ProductCard } from '../components/Card.js';
import { alert, confirm } from '../components/Modal.js';
import { initHeader, setCurrentPage } from '../components/Header.js';

// Require authentication
const user = requireAuth({ redirectTo: 'profile.html' });
if (!user) {
  // Redirect handled by requireAuth
}

let currentUser = user;

/**
 * Initialize the profile page
 */
async function init() {
  console.log('Profile page initialized');

  // Initialize header
  initHeader({});
  setCurrentPage('profile');

  // Listen for auth changes
  window.addEventListener('auth:login', handleAuthChange);
  window.addEventListener('auth:logout', handleAuthChange);
  window.addEventListener('auth:restore', handleAuthChange);

  // Initial render
  await renderProfile();
  setupEventListeners();
}

/**
 * Handle auth state change
 * @param {CustomEvent} event
 */
function handleAuthChange(event) {
  currentUser = event.detail?.user ?? getCurrentUser();
  if (currentUser) {
    renderProfile();
  } else {
    showUnauthenticated();
  }
}

/**
 * Show unauthenticated state
 */
function showUnauthenticated() {
  const content = $('#profile-content');
  const unauth = $('#profile-unauthenticated');
  if (content) content.hidden = true;
  if (unauth) unauth.hidden = false;
}

/**
 * Render profile for authenticated user
 */
async function renderProfile() {
  const content = $('#profile-content');
  const unauth = $('#profile-unauthenticated');
  if (content) content.hidden = false;
  if (unauth) unauth.hidden = true;

  if (!currentUser) return;

  // Update header info
  const avatar = $('#profile-avatar');
  const name = $('#profile-name');
  const email = $('#profile-email');
  const badges = $('#profile-badges');

  if (avatar) {
    avatar.textContent = currentUser.initials;
    avatar.style.background = getAvatarColor(currentUser.id);
  }
  if (name) name.textContent = currentUser.name;
  if (email) email.textContent = currentUser.email;
  if (badges) {
    badges.innerHTML = '';
    if (currentUser.isDemo) {
      const badge = createElement('span', { class: 'badge badge--guest' }, 'Guest Mode');
      badges.appendChild(badge);
    }
  }

  // Update settings form
  const settingsName = $('#settings-name');
  if (settingsName) settingsName.value = currentUser.name;
  const settingsEmail = $('#settings-email');
  if (settingsEmail) settingsEmail.value = currentUser.email;
  updateSettingsSaveButton();

  // Load stats
  await loadStats();

  // Load sections
  await loadMyListings();
  await loadFavorites();
}

/**
 * Generate consistent avatar color from user ID
 * @param {string} id
 * @returns {string}
 */
function getAvatarColor(id) {
  const colors = [
    'linear-gradient(135deg, #5E17EB, #8755F5)',
    'linear-gradient(135deg, #20C997, #40E0B0)',
    'linear-gradient(135deg, #FFC857, #FFD97D)',
    'linear-gradient(135deg, #DC3545, #FF6B6B)',
    'linear-gradient(135deg, #16865F, #2ECC71)',
    'linear-gradient(135deg, #6C5CE7, #A29BFE)',
    'linear-gradient(135deg, #FD9644, #FDCB6E)',
    'linear-gradient(135deg, #E84393, #FD79A8)',
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Load and render profile statistics
 */
async function loadStats() {
  const createdProducts = getCreatedProducts();
  const userProducts = createdProducts.filter(p => p.sellerId === currentUser.id);
  const favorites = getFavorites();

  const statListings = $('#stat-listings');
  const statFavorites = $('#stat-favorites');
  const statReviews = $('#stat-reviews');

  if (statListings) statListings.textContent = userProducts.length;
  if (statFavorites) statFavorites.textContent = favorites.size;
  if (statReviews) statReviews.textContent = '0'; // Placeholder
}

/**
 * Load and render user's listings
 */
async function loadMyListings() {
  const grid = $('#my-listings-grid');
  const empty = $('#my-listings-empty');

  if (!grid) return;

  const createdProducts = getCreatedProducts();
  const userProducts = createdProducts.filter(p => p.sellerId === currentUser.id);

  if (userProducts.length === 0) {
    grid.hidden = true;
    if (empty) empty.hidden = false;
    return;
  }

  grid.hidden = false;
  if (empty) empty.hidden = true;

  // Sort by newest first
  userProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  grid.innerHTML = '';
  userProducts.forEach(product => {
    const card = new ProductCard({
      ...product,
      onClick: (id) => window.location.href = `product.html?id=${id}`,
      onFavorite: (id, isFav) => {
        // Update local favorite state
        const p = userProducts.find(x => x.id === id);
        if (p) p.isFavorite = isFav;
      },
    });
    grid.appendChild(card.render());
  });
}

/**
 * Load and render user's favorites
 */
async function loadFavorites() {
  const grid = $('#favorites-grid');
  const empty = $('#favorites-empty');

  if (!grid) return;

  const favorites = getFavorites();
  const allProducts = await import('../data/products.js').then(m => m.products);
  const favoriteProducts = allProducts.filter(p => favorites.has(String(p.id)));

  if (favoriteProducts.length === 0) {
    grid.hidden = true;
    if (empty) empty.hidden = false;
    return;
  }

  grid.hidden = false;
  if (empty) empty.hidden = true;

  grid.innerHTML = '';
  favoriteProducts.forEach(product => {
    const card = new ProductCard({
      ...product,
      onClick: (id) => window.location.href = `product.html?id=${id}`,
      onFavorite: (id, isFav) => {
        const p = favoriteProducts.find(x => x.id === id);
        if (p) p.isFavorite = isFav;
      },
    });
    grid.appendChild(card.render());
  });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  initSettingsTab();

  // Logout button
  const logoutBtn = $('#logout-btn');
  logoutBtn?.addEventListener('click', handleLogout);

  // Listen for favorites changes
  window.addEventListener('favorites:changed', () => {
    loadStats();
    loadFavorites();
  });
}

/**
 * Initialize the settings section interactions
 */
function initSettingsTab() {
  const nameInput = $('#settings-name');
  const saveNameBtn = $('#save-name-btn');
  const deleteAccountBtn = $('#delete-account-btn');

  if (nameInput && saveNameBtn) {
    updateSettingsSaveButton();
    nameInput.addEventListener('input', () => {
      clearError(nameInput, $('#settings-name-error'));
      clearSettingsSuccess();
      updateSettingsSaveButton();
    });
    saveNameBtn.addEventListener('click', handleSaveName);
  }

  deleteAccountBtn?.addEventListener('click', handleDeleteAccount);

  if (window.location.hash === '#settings') {
    requestAnimationFrame(() => $('#settings')?.scrollIntoView({ block: 'start' }));
  }
}

/**
 * Keep the display-name save control disabled until there is a changed value
 */
function updateSettingsSaveButton() {
  const nameInput = $('#settings-name');
  const saveNameBtn = $('#save-name-btn');

  if (!nameInput || !saveNameBtn) return;

  const value = nameInput.value.trim();
  const disabled = !value || value === currentUser?.name;
  saveNameBtn.disabled = disabled;
  saveNameBtn.setAttribute('aria-disabled', String(disabled));
}

/**
 * Clear the inline display-name success message
 */
function clearSettingsSuccess() {
  const successEl = $('#settings-name-success');
  if (!successEl) return;

  successEl.textContent = '';
  successEl.hidden = true;
  successEl.classList.remove('profile-settings__message--visible');
}

/**
 * Show the inline display-name success message
 */
function showSettingsSuccess() {
  const successEl = $('#settings-name-success');
  if (!successEl) return;

  successEl.textContent = 'Name updated';
  successEl.hidden = false;
  requestAnimationFrame(() => {
    if (!successEl.hidden) {
      successEl.classList.add('profile-settings__message--visible');
    }
  });
}

/**
 * Handle save name
 */
async function handleSaveName() {
  const nameInput = $('#settings-name');
  const errorEl = $('#settings-name-error');
  const saveBtn = $('#save-name-btn');

  if (!nameInput) return;

  const name = nameInput.value.trim();

  if (!name) {
    showError(nameInput, errorEl, 'Name is required');
    clearSettingsSuccess();
    updateSettingsSaveButton();
    nameInput.focus();
    return;
  }

  if (name.length < 2) {
    showError(nameInput, errorEl, 'Name must be at least 2 characters');
    clearSettingsSuccess();
    updateSettingsSaveButton();
    nameInput.focus();
    return;
  }

  if (name.length > 50) {
    showError(nameInput, errorEl, 'Name must be 50 characters or fewer');
    clearSettingsSuccess();
    updateSettingsSaveButton();
    nameInput.focus();
    return;
  }

  if (/[<>]/.test(name)) {
    showError(nameInput, errorEl, 'Display name cannot contain HTML characters');
    clearSettingsSuccess();
    updateSettingsSaveButton();
    nameInput.focus();
    return;
  }

  clearError(nameInput, errorEl);
  clearSettingsSuccess();

  // Disable button
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.setAttribute('aria-disabled', 'true');
    saveBtn.textContent = 'Saving...';
  }

  try {
    const updated = updateUser({ name });
    if (!updated) throw new Error('No authenticated user was updated');

    currentUser = updated;
    // Update the profile header immediately and notify the shared site header.
    const nameEl = $('#profile-name');
    if (nameEl) nameEl.textContent = updated.name;
    const avatarEl = $('#profile-avatar');
    if (avatarEl) avatarEl.textContent = updated.initials;
    window.dispatchEvent(new CustomEvent('auth:login', { detail: { user: updated } }));
    showSettingsSuccess();
    nameInput.focus();
  } catch (error) {
    console.error('Failed to save name:', error);
    showError(nameInput, errorEl, 'Failed to save changes. Please try again.');
    nameInput.focus();
  } finally {
    if (saveBtn) {
      saveBtn.textContent = 'Save Changes';
    }
    updateSettingsSaveButton();
  }
}

/**
 * Show the prototype limitation for account deletion
 */
async function handleDeleteAccount() {
  await alert({
    title: 'Delete Account',
    message: 'Account deletion is not available in this prototype.',
  });
}

/**
 * Handle logout
 */
async function handleLogout() {
  const confirmed = await confirm({
    title: 'Log Out',
    message: 'Are you sure you want to log out?',
    confirmLabel: 'Log Out',
    cancelLabel: 'Cancel',
    variant: 'secondary',
  });

  if (confirmed) {
    logout();
    window.location.href = 'index.html';
  }
}

/**
 * Show error for input
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
  input.classList.add('profile-settings__input--error');
}

/**
 * Clear error for input
 * @param {HTMLInputElement} input
 * @param {HTMLElement} errorEl
 */
function clearError(input, errorEl) {
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.hidden = true;
  }
  input.removeAttribute('aria-invalid');
  input.classList.remove('profile-settings__input--error');
}

// Initialize on DOM ready
onReady(init);
