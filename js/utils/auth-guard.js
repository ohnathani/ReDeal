/**
 * ReDeal — Authentication Route Guard
 * Protects routes that require authentication
 */

import { restoreSession, getCurrentUser, setRedirectUrl } from '../data/auth.js';

/**
 * Require authentication for a page
 * Call this at the top of protected page modules (before DOM ready)
 * @param {Object} options
 * @param {string} options.redirectTo - Current page URL (for redirect after login)
 * @returns {Object|null} Current user object if authenticated, null if redirected
 */
export function requireAuth({ redirectTo }) {
  // Try to restore session first
  const user = restoreSession();

  if (!user) {
    // No valid session - store redirect and navigate to login
    const currentUrl = redirectTo || window.location.pathname + window.location.search;
    setRedirectUrl(currentUrl);
    window.location.href = `login.html?redirect=${encodeURIComponent(currentUrl)}`;
    return null;
  }

  return user;
}

/**
 * Optional auth - returns user if authenticated, undefined if not
 * Use for pages that work both authenticated and unauthenticated
 * @returns {Object|undefined} Current user or undefined
 */
export function optionalAuth() {
  return getCurrentUser();
}

/**
 * Redirect if already authenticated (for login/signup pages)
 * @param {string} fallback - Where to redirect authenticated users
 */
export function redirectIfAuthenticated(fallback = 'index.html') {
  const user = restoreSession();
  if (user) {
    window.location.href = fallback;
  }
}