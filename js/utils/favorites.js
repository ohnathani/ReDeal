/**
 * ReDeal — Favorites Utility
 * Manages favorite products persistence via localStorage
 */

const STORAGE_KEY = 'redeal_favorites';

/**
 * Get all favorite product IDs from localStorage
 * @returns {Set<string>} Set of product IDs
 */
export function getFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (e) {
    console.warn('Failed to read favorites from localStorage:', e);
  }
  return new Set();
}

/**
 * Save favorite product IDs to localStorage
 * @param {Set<string>} favorites - Set of product IDs
 */
export function setFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  } catch (e) {
    console.warn('Failed to save favorites to localStorage:', e);
  }
}

/**
 * Check if a product is favorited
 * @param {string} id - Product ID
 * @returns {boolean}
 */
export function isFavorite(id) {
  return getFavorites().has(id);
}

/**
 * Toggle favorite state for a product
 * @param {string} id - Product ID
 * @returns {boolean} New favorite state
 */
export function toggleFavorite(id) {
  const favorites = getFavorites();
  const newState = !favorites.has(id);

  if (newState) {
    favorites.add(id);
  } else {
    favorites.delete(id);
  }

  setFavorites(favorites);

  // Dispatch custom event for UI updates
  window.dispatchEvent(new CustomEvent('favorites-changed', {
    detail: { id, isFavorite: newState }
  }));

  return newState;
}

/**
 * Initialize favorites from product data (for initial render)
 * @param {Array} products - Product array to update with favorite status
 */
export function initProductFavorites(products) {
  const favorites = getFavorites();
  products.forEach(product => {
    product.isFavorite = favorites.has(product.id);
  });
}