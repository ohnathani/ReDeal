/**
 * ReDeal — Favorites Utility
 * Manages favorite products persistence via localStorage (per-user)
 */

import { getCurrentUser } from '../data/auth.js';

const BASE_STORAGE_KEY = 'redeal_favorites';

/**
 * Get the storage key for a specific user
 * @param {string} [userId] - User ID (uses current user from session if not provided)
 * @returns {string} Storage key
 */
function getStorageKey(userId) {
  // If userId not provided, derive from current session
  if (!userId) {
    const user = getCurrentUser();
    if (user) {
      userId = user.id;
    }
  }
  if (userId) {
    return `${BASE_STORAGE_KEY}_${userId}`;
  }
  // Fallback to legacy key for migration
  return BASE_STORAGE_KEY;
}

/**
 * Get all favorite product IDs from localStorage for a user
 * @param {string} [userId] - User ID
 * @returns {Set<string>} Set of product IDs
 */
export function getFavorites(userId) {
  try {
    const key = getStorageKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (e) {
    console.warn('Failed to read favorites from localStorage:', e);
  }
  return new Set();
}

/**
 * Save favorite product IDs to localStorage for a user
 * @param {Set<string>} favorites - Set of product IDs
 * @param {string} [userId] - User ID
 */
export function setFavorites(favorites, userId) {
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify([...favorites]));
  } catch (e) {
    console.warn('Failed to save favorites to localStorage:', e);
  }
}

/**
 * Check if a product is favorited
 * @param {string} id - Product ID
 * @param {string} [userId] - User ID
 * @returns {boolean}
 */
export function isFavorite(id, userId) {
  return getFavorites(userId).has(id);
}

/**
 * Toggle favorite state for a product
 * @param {string} id - Product ID
 * @param {string} [userId] - User ID
 * @returns {boolean} New favorite state
 */
export function toggleFavorite(id, userId) {
  const favorites = getFavorites(userId);
  const newState = !favorites.has(id);

  if (newState) {
    favorites.add(id);
  } else {
    favorites.delete(id);
  }

  setFavorites(favorites, userId);

  // Dispatch custom event for UI updates (includes userId for cross-tab sync)
  window.dispatchEvent(new CustomEvent('favorites:changed', {
    detail: { id, isFavorite: newState, userId }
  }));

  return newState;
}

/**
 * Initialize favorites from product data (for initial render)
 * @param {Array} products - Product array to update with favorite status
 * @param {string} [userId] - User ID
 */
export function initProductFavorites(products, userId) {
  const favorites = getFavorites(userId);
  products.forEach(product => {
    product.isFavorite = favorites.has(product.id);
  });
}

/**
 * Migrate legacy favorites to user-scoped key
 * Called on first login after Phase 4
 * @param {string} userId - User ID
 */
export function migrateLegacyFavorites(userId) {
  try {
    const legacyKey = BASE_STORAGE_KEY;
    const userKey = getStorageKey(userId);

    // Only migrate if user key doesn't exist yet
    if (localStorage.getItem(userKey)) return;

    const legacyData = localStorage.getItem(legacyKey);
    if (legacyData) {
      localStorage.setItem(userKey, legacyData);
      console.log('Migrated legacy favorites to user-scoped key');
    }
  } catch (e) {
    console.warn('Failed to migrate favorites:', e);
  }
}