/**
 * ReDeal — LocalStorage Persistence for Created Listings
 * Handles saving and merging user-created products with seed data
 */

const CREATED_KEY = 'redeal_created_products';

/**
 * Get all created products from localStorage
 * @returns {Array} Array of created product objects
 */
export function getCreatedProducts() {
  try {
    const data = localStorage.getItem(CREATED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save created products to localStorage
 * @param {Array} products - Array of created product objects
 */
export function saveCreatedProducts(products) {
  localStorage.setItem(CREATED_KEY, JSON.stringify(products));
}

/**
 * Add a new created product (prepends to maintain newest-first order)
 * @param {Object} product - Product object to add
 * @returns {Array} Updated created products array
 */
export function addCreatedProduct(product) {
  const created = getCreatedProducts();
  created.unshift(product); // Prepend (newest first)
  saveCreatedProducts(created);
  return created;
}

/**
 * Generate next available product ID (as string)
 * Considers both seed products (from products.js) and created products
 * @returns {string} Next ID as string
 */
export function getNextId() {
  // Import seed products dynamically to avoid circular dependency
  // We'll read from the merged products array in products.js instead
  // This function is kept for API completeness; actual ID generation
  // happens in CreateListing.js where we have access to the merged array
  return '0'; // Placeholder - actual logic in CreateListing.js
}