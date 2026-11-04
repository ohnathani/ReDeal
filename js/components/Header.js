/**
 * ReDeal — Header Component
 * Renders header with auth state awareness
 */

import { $, $$, createElement, escapeHtml, empty } from '../utils/dom.js';
import { onReady } from '../utils/events.js';
import { getCurrentUser, restoreSession, logout, isDemoUser } from '../data/auth.js';
import { initUserMenu } from './UserMenu.js';

let headerElement = null;
let userMenuController = null;
let initialized = false;

/**
 * Initialize header component
 * @param {Object} options
 * @param {HTMLElement} options.container - Container to render header into (optional, defaults to existing .header)
 * @returns {HTMLElement} Header element
 */
export function initHeader({ container } = {}) {
  if (initialized) {
    return headerElement;
  }

  // Try to find existing header or use container
  headerElement = container?.querySelector('.header') || $('.header');

  if (!headerElement) {
    console.warn('Header element not found');
    return null;
  }

  // Restore session on init
  const user = restoreSession();
  renderAuthSection(user);

  // Listen for auth events (auth:restore handled by direct call in initHeader)
  window.addEventListener('auth:login', handleAuthChange);
  window.addEventListener('auth:logout', handleAuthChange);

  // Initialize user menu if user exists
  if (user) {
    initUserMenuComponent();
  }

  initialized = true;
  return headerElement;
}

/**
 * Handle auth state change
 * @param {CustomEvent} event
 */
function handleAuthChange(event) {
  const user = event.detail?.user ?? getCurrentUser();
  renderAuthSection(user);

  if (user) {
    initUserMenuComponent();
  } else {
    destroyUserMenu();
  }
}

/**
 * Render auth section based on user state
 * @param {Object|null} user
 */
function renderAuthSection(user) {
  const authContainer = headerElement?.querySelector('.header__auth');
  if (!authContainer) return;

  if (user) {
    // Authenticated state

    authContainer.innerHTML = '';
    const authActions = createElement('div', { class: 'auth-actions auth-actions--authenticated' }, [
      // New Listing button (only show on desktop, not on create-listing page)
      createElement('a', {
        href: 'create-listing.html',
        class: 'btn btn--primary header__new-listing',
        'aria-label': 'Create new listing',
      }, '➕ New Listing'),
      // User menu trigger
      createElement('button', {
        class: 'user-menu__trigger',
        'data-user-menu-trigger': '',
        'aria-label': `Account menu for ${escapeHtml(user.name)}`,
        'aria-expanded': 'false',
        'aria-haspopup': 'true',
      }, [
        createElement('div', { class: 'avatar avatar--sm' }, user.initials),
      ]),
    ]);

    authContainer.appendChild(authActions);
  } else {
    // Unauthenticated state
    authContainer.innerHTML = '';
    const authActions = createElement('div', { class: 'auth-actions' }, [
      createElement('a', {
        href: 'login.html',
        class: 'btn btn--ghost btn--sm',
      }, 'Log In'),
      createElement('a', {
        href: 'signup.html',
        class: 'btn btn--primary btn--sm',
      }, 'Sign Up'),
    ]);

    authContainer.appendChild(authActions);
  }
}

/**
 * Initialize user menu component
 */
function initUserMenuComponent() {
  destroyUserMenu();
  userMenuController = initUserMenu('[data-user-menu-trigger]');
}

/**
 * Destroy user menu component
 */
function destroyUserMenu() {
  if (userMenuController) {
    userMenuController.destroy();
    userMenuController = null;
  }
}

/**
 * Update header for current page (set active nav, etc.)
 * @param {string} currentPage - Current page identifier
 */
export function setCurrentPage(currentPage) {
  if (!headerElement) return;

  // Update any page-specific header elements
  const newListingBtn = headerElement.querySelector('.header__new-listing');
  if (newListingBtn) {
    // Show on marketplace, hide on create-listing
    newListingBtn.classList.toggle('is-hidden', currentPage === 'create-listing');
  }
}

/**
 * Get header element
 * @returns {HTMLElement|null}
 */
export function getHeader() {
  return headerElement;
}

/**
 * Cleanup header (remove event listeners)
 */
export function destroyHeader() {
  window.removeEventListener('auth:login', handleAuthChange);
  window.removeEventListener('auth:logout', handleAuthChange);
  destroyUserMenu();
  headerElement = null;
}