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
 * Get created products for a specific user
 * @param {string} userId - User ID
 * @returns {Array} User's created products
 */
export function getCreatedProductsByUser(userId) {
  return getCreatedProducts().filter(p => p.sellerId === userId);
}

/**
 * Generate next available product ID (as string)
 * Considers both seed products and created products
 * @param {Array} [existingProducts=[]] - Additional products to consider (e.g., merged array from products.js)
 * @returns {string} Next ID as string
 */
export function getNextId(existingProducts = []) {
  const ids = [...existingProducts, ...getCreatedProducts()]
    .map(product => Number(product.id))
    .filter(Number.isFinite);

  return String(Math.max(0, ...ids) + 1);
}