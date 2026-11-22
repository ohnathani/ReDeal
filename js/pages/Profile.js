/**
 * ReDeal — Profile Page Logic
 * Renders user profile, listings, favorites, and settings
 */

import { $, createElement } from '../utils/dom.js';
import { onReady } from '../utils/events.js';
import { requireAuth } from '../utils/auth-guard.js';
import { getCurrentUser, getUsers, logout, updateUser } from '../data/auth.js';
import { getCreatedProducts } from '../data/storage.js';
import { getFavorites } from '../utils/favorites.js';
import { products } from '../data/products.js';
import { ProductCard } from '../components/Card.js';
import { confirm } from '../components/Modal.js';
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

  renderProfileOverview();

  // Update settings form
  const settingsName = $('#settings-name');
  if (settingsName) settingsName.value = currentUser.name;
  const settingsUsername = $('#settings-username');
  if (settingsUsername) settingsUsername.value = currentUser.username || '';
  const settingsBio = $('#settings-bio');
  if (settingsBio) settingsBio.value = currentUser.bio || '';
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
 * Render the current user's saved profile information
 */
function renderProfileOverview() {
  const avatar = $('#profile-avatar');
  const name = $('#profile-name');
  const username = $('#profile-username');
  const bio = $('#profile-bio');
  const email = $('#profile-email');
  const badges = $('#profile-badges');
  const memberSince = $('#profile-member-since');
  const createdAt = $('#profile-created-at');

  if (avatar) {
    avatar.replaceChildren();
    if (currentUser.avatar) {
      avatar.appendChild(createElement('img', {
        src: currentUser.avatar,
        alt: '',
        'aria-hidden': 'true',
      }));
    } else {
      avatar.textContent = currentUser.initials || '';
    }
  }
  if (name) name.textContent = currentUser.name || '';
  if (username) username.textContent = currentUser.username ? `@${currentUser.username}` : 'Username not set';
  if (bio) bio.textContent = currentUser.bio || 'No bio added yet.';
  if (email) email.textContent = currentUser.email || '';
  if (badges) {
    badges.replaceChildren();
    if (currentUser.isDemo) {
      badges.appendChild(createElement('span', { class: 'badge badge--guest' }, 'Guest Mode'));
    }
  }

  const date = currentUser.createdAt ? new Date(currentUser.createdAt) : null;
  if (memberSince && createdAt && date && Number.isFinite(date.getTime())) {
    createdAt.dateTime = date.toISOString();
    createdAt.textContent = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
    memberSince.hidden = false;
  } else if (memberSince) {
    memberSince.hidden = true;
  }
}

/**
 * Load and render profile statistics
 */
function loadStats() {
  const userProducts = getCreatedProducts().filter(p => p.sellerId === currentUser.id);
  const favorites = getFavorites();
  const favoriteCount = products.filter(product => favorites.has(String(product.id))).length;

  const statListings = $('#stat-listings');
  const statFavorites = $('#stat-favorites');

  if (statListings) statListings.textContent = userProducts.length;
  if (statFavorites) statFavorites.textContent = favoriteCount;
}

/**
 * Load and render user's listings
 */
async function loadMyListings() {
  const grid = $('#my-listings-grid');
  const empty = $('#my-listings-empty');

  if (!grid) return;

  const userProducts = getCreatedProducts().filter(p => p.sellerId === currentUser.id);
  grid.replaceChildren();

  if (userProducts.length === 0) {
    grid.hidden = true;
    if (empty) empty.hidden = false;
    return;
  }

  grid.hidden = false;
  if (empty) empty.hidden = true;

  // Sort by newest first
  userProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  userProducts.forEach(product => {
    const isSold = String(product.status || '').toLowerCase() === 'sold' || product.sold === true;
    const card = new ProductCard({
      ...product,
      onClick: (id) => window.location.href = `product.html?id=${id}`,
      onFavorite: (id, isFav) => {
        // Update local favorite state
        const p = userProducts.find(x => x.id === id);
        if (p) p.isFavorite = isFav;
      },
    });
    const listing = createElement('div', { class: 'profile-listing' },
      createElement('span', { class: `profile-listing__status${isSold ? ' profile-listing__status--sold' : ''}` },
        isSold ? 'Sold' : 'Active'),
      card.render());
    grid.appendChild(listing);
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
  const favoriteProducts = products.filter(p => favorites.has(String(p.id)));
  grid.replaceChildren();

  if (favoriteProducts.length === 0) {
    grid.hidden = true;
    if (empty) empty.hidden = false;
    return;
  }

  grid.hidden = false;
  if (empty) empty.hidden = true;

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
  initProfileForm();

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
 * Initialize profile editing interactions
 */
function initProfileForm() {
  const nameInput = $('#settings-name');
  const usernameInput = $('#settings-username');
  const bioInput = $('#settings-bio');
  const saveProfileBtn = $('#save-profile-btn');
  const inputs = [nameInput, usernameInput, bioInput].filter(Boolean);

  if (inputs.length && saveProfileBtn) {
    updateSettingsSaveButton();
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        clearProfileError();
        clearSettingsSuccess();
        updateSettingsSaveButton();
      });
    });
    saveProfileBtn.addEventListener('click', handleSaveProfile);
  }

  if (window.location.hash === '#settings') {
    requestAnimationFrame(() => $('#settings')?.scrollIntoView({ block: 'start' }));
  }
}

/**
 * Keep the save control disabled until a profile field has changed
 */
function updateSettingsSaveButton() {
  const nameInput = $('#settings-name');
  const usernameInput = $('#settings-username');
  const bioInput = $('#settings-bio');
  const saveProfileBtn = $('#save-profile-btn');

  if (!nameInput || !usernameInput || !bioInput || !saveProfileBtn) return;

  const unchanged = nameInput.value.trim() === (currentUser?.name || '') &&
    usernameInput.value.trim() === (currentUser?.username || '') &&
    bioInput.value.trim() === (currentUser?.bio || '');
  const disabled = unchanged;
  saveProfileBtn.disabled = disabled;
  saveProfileBtn.setAttribute('aria-disabled', String(disabled));
}

/**
 * Clear profile form error state
 */
function clearProfileError() {
  const errorEl = $('#settings-profile-error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.hidden = true;
  }
  ['#settings-name', '#settings-username', '#settings-bio'].forEach(selector => {
    $(selector)?.removeAttribute('aria-invalid');
  });
}

/**
 * Show a profile form validation error
 * @param {HTMLElement} input
 * @param {string} message
 */
function showProfileError(input, message) {
  const errorEl = $('#settings-profile-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }
  input.setAttribute('aria-invalid', 'true');
  input.focus();
}

/**
 * Clear the inline profile success message
 */
function clearSettingsSuccess() {
  const successEl = $('#settings-profile-success');
  if (!successEl) return;

  successEl.textContent = '';
  successEl.hidden = true;
  successEl.classList.remove('profile-settings__message--visible');
}

/**
 * Show the inline profile success message
 */
function showSettingsSuccess() {
  const successEl = $('#settings-profile-success');
  if (!successEl) return;

  successEl.textContent = 'Profile updated';
  successEl.hidden = false;
  requestAnimationFrame(() => {
    if (!successEl.hidden) {
      successEl.classList.add('profile-settings__message--visible');
    }
  });
}

/**
 * Handle profile form submission
 */
async function handleSaveProfile() {
  const nameInput = $('#settings-name');
  const usernameInput = $('#settings-username');
  const bioInput = $('#settings-bio');
  const saveBtn = $('#save-profile-btn');

  if (!nameInput || !usernameInput || !bioInput) return;

  const name = nameInput.value.trim();
  const username = usernameInput.value.trim();
  const bio = bioInput.value.trim();

  if (!name) {
    showProfileError(nameInput, 'Full name is required');
    clearSettingsSuccess();
    updateSettingsSaveButton();
    return;
  }

  if (name.length < 2) {
    showProfileError(nameInput, 'Full name must be at least 2 characters');
    clearSettingsSuccess();
    updateSettingsSaveButton();
    return;
  }

  if (name.length > 50) {
    showProfileError(nameInput, 'Full name must be 50 characters or fewer');
    clearSettingsSuccess();
    updateSettingsSaveButton();
    return;
  }

  if (/[<>]/.test(name)) {
    showProfileError(nameInput, 'Full name cannot contain HTML characters');
    clearSettingsSuccess();
    updateSettingsSaveButton();
    return;
  }

  if (username && !/^[a-zA-Z0-9._]{3,24}$/.test(username)) {
    showProfileError(usernameInput, 'Username must be 3–24 characters using letters, numbers, periods, or underscores');
    clearSettingsSuccess();
    updateSettingsSaveButton();
    return;
  }

  const usernameTaken = username && getUsers().some(user =>
    user.id !== currentUser.id && String(user.username || '').toLowerCase() === username.toLowerCase());
  if (usernameTaken) {
    showProfileError(usernameInput, 'That username is already in use');
    clearSettingsSuccess();
    updateSettingsSaveButton();
    return;
  }

  if (bio.length > 160) {
    showProfileError(bioInput, 'Bio must be 160 characters or fewer');
    clearSettingsSuccess();
    updateSettingsSaveButton();
    return;
  }

  clearProfileError();
  clearSettingsSuccess();

  // Disable button
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.setAttribute('aria-disabled', 'true');
    saveBtn.textContent = 'Saving...';
  }

  try {
    const updated = updateUser({ name, username, bio });
    if (!updated) throw new Error('No authenticated user was updated');

    currentUser = updated;
    usernameInput.value = updated.username || '';
    renderProfileOverview();
    window.dispatchEvent(new CustomEvent('auth:login', { detail: { user: updated } }));
    showSettingsSuccess();
  } catch (error) {
    console.error('Failed to save profile:', error);
    showProfileError(nameInput, 'Failed to save changes. Please try again.');
  } finally {
    if (saveBtn) {
      saveBtn.textContent = 'Save Changes';
    }
    updateSettingsSaveButton();
  }
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

// Initialize on DOM ready
onReady(init);
