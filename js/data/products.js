/**
 * ReDeal — Shared Product Data
 * Centralized product catalog for the marketplace
 */

import { categories, conditions } from './categories.js';
import { getCreatedProducts } from './storage.js';

// Helper to parse price strings for sorting
function parsePrice(priceStr) {
  const match = priceStr.match(/[\d,]+\.?\d*/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
}

// Sample product data — all prices in Philippine Peso (₱)
// Each product includes createdAt timestamp for proper sorting
export const seedProducts = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    price: '₱1,450',
    category: 'clothing',
    condition: 'good',
    timeAgo: '2h ago',
    sellerName: 'Jane Doe',
    sellerInitials: 'JD',
    sellerRating: 4.9,
    sellerReviews: 124,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    location: 'Makati, Metro Manila',
    isFavorite: false,
    createdAt: '2026-11-04T10:00:00Z',
    description: 'Authentic vintage denim jacket. High quality cotton, classic fit. Minor fading on the elbows and collar, giving it a beautiful patina. No major tears or stains. Perfect for everyday wear.',
    defects: ['Small repair on left sleeve cuff', 'Fading on collar'],
  },
  {
    id: '2',
    title: 'Mid-Century Modern Chair',
    price: '₱12,000',
    category: 'furniture',
    condition: 'good',
    timeAgo: '5h ago',
    sellerName: 'Mike Smith',
    sellerInitials: 'MS',
    sellerRating: 4.7,
    sellerReviews: 89,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop',
    location: 'BGC, Taguig',
    isFavorite: false,
    createdAt: '2026-11-04T07:00:00Z',
    description: 'Iconic mid-century modern lounge chair with ottoman. Walnut frame, original leather cushions. Professionally cleaned. Some wear on armrests consistent with age.',
    defects: ['Minor scratches on wood base', 'Leather has natural patina'],
  },
  {
    id: '3',
    title: 'Canon AE-1 35mm Film Camera',
    price: '₱8,500',
    category: 'electronics',
    condition: 'like-new',
    timeAgo: '1d ago',
    sellerName: 'Sarah R.',
    sellerInitials: 'SR',
    sellerRating: 4.8,
    sellerReviews: 203,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
    location: 'Quezon City, Metro Manila',
    isFavorite: true,
    createdAt: '2026-11-03T10:00:00Z',
    description: 'Classic Canon AE-1 Program with 50mm f/1.8 lens. Fully functional, light meter accurate. Includes original case, strap, and manual. Shutter speeds tested and accurate.',
    defects: ['Minor dust in viewfinder', 'Case has wear on corners'],
  },
  {
    id: '4',
    title: 'Vintage Leather Messenger Bag',
    price: '₱4,200',
    category: 'accessories',
    condition: 'good',
    timeAgo: '3h ago',
    sellerName: 'Alex Chen',
    sellerInitials: 'AC',
    sellerRating: 4.6,
    sellerReviews: 67,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    location: 'Cebu City, Cebu',
    isFavorite: false,
    createdAt: '2026-11-04T09:00:00Z',
    description: 'Handcrafted full-grain leather messenger bag. Brass hardware, adjustable shoulder strap. Fits 13" laptop. Develops beautiful patina over time.',
    defects: ['Small scratch on front flap', 'Strap shows normal wear'],
  },
  {
    id: '5',
    title: 'Retro Game Console Bundle',
    price: '₱3,500',
    category: 'electronics',
    condition: 'fair',
    timeAgo: '6h ago',
    sellerName: 'Tom Wilson',
    sellerInitials: 'TW',
    sellerRating: 4.3,
    sellerReviews: 45,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b258749f?w=400&h=400&fit=crop',
    location: 'Davao City, Davao del Sur',
    isFavorite: false,
    createdAt: '2026-11-04T06:00:00Z',
    description: 'Original Nintendo Entertainment System (NES) with 2 controllers, Zapper gun, and 15 game cartridges including Super Mario Bros, Duck Hunt, Zelda. Console cleaned and tested.',
    defects: ['Yellowing on console case', 'Controller cords have minor fraying', 'Box not included'],
  },
  {
    id: '6',
    title: 'Ceramic Plant Pots Set (3 pcs)',
    price: '₱850',
    category: 'home-garden',
    condition: 'new',
    timeAgo: '1h ago',
    sellerName: 'Lisa Park',
    sellerInitials: 'LP',
    sellerRating: 4.9,
    sellerReviews: 156,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
    location: 'Pasig, Metro Manila',
    isFavorite: false,
    createdAt: '2026-11-04T11:00:00Z',
    description: 'Set of 3 minimalist ceramic plant pots with drainage holes and saucers. Sizes: 4", 6", 8". Matte white finish. Perfect for succulents and small houseplants.',
    defects: [],
  },
  {
    id: '7',
    title: 'Harry Potter Complete Box Set',
    price: '₱2,800',
    category: 'books',
    condition: 'like-new',
    timeAgo: '4h ago',
    sellerName: 'Maria Santos',
    sellerInitials: 'MS',
    sellerRating: 4.8,
    sellerReviews: 78,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    location: 'Mandaluyong, Metro Manila',
    isFavorite: false,
    createdAt: '2026-11-04T08:00:00Z',
    description: 'Complete 7-book Harry Potter paperback box set. J.K. Rowling. All books in excellent condition, no creases or tears. Collector\'s edition box with artwork.',
    defects: ['Box has minor shelf wear'],
  },
  {
    id: '8',
    title: 'Mountain Bike - Trek Marlin 5',
    price: '₱22,000',
    category: 'sports',
    condition: 'good',
    timeAgo: '2d ago',
    sellerName: 'Carlos Reyes',
    sellerInitials: 'CR',
    sellerRating: 4.5,
    sellerReviews: 34,
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=400&fit=crop',
    location: 'Antipolo, Rizal',
    isFavorite: false,
    createdAt: '2026-11-02T10:00:00Z',
    description: 'Trek Marlin 5 Gen 2, size Medium (17.5"). 21-speed Shimano drivetrain, hydraulic disc brakes, 29" wheels. Recently serviced. Great for trails and commuting.',
    defects: ['Small scratch on top tube', 'Grips show normal wear'],
  },
  {
    id: '9',
    title: 'Vintage Omega Seamaster Watch',
    price: '₱45,000',
    category: 'collectibles',
    condition: 'good',
    timeAgo: '3d ago',
    sellerName: 'Robert Lim',
    sellerInitials: 'RL',
    sellerRating: 4.9,
    sellerReviews: 201,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
    location: 'Makati, Metro Manila',
    isFavorite: false,
    createdAt: '2026-11-01T10:00:00Z',
    description: '1970s Omega Seamaster 120m automatic. Stainless steel case, blue dial, date complication. Recently serviced, keeps excellent time. Original bracelet.',
    defects: ['Minor case scratches', 'Crystal has faint hairline'],
  },
  {
    id: '10',
    title: 'IKEA MALM Bed Frame (Queen)',
    price: '₱5,500',
    category: 'furniture',
    condition: 'like-new',
    timeAgo: '8h ago',
    sellerName: 'Anna Garcia',
    sellerInitials: 'AG',
    sellerRating: 4.4,
    sellerReviews: 52,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop',
    location: 'San Juan, Metro Manila',
    isFavorite: false,
    createdAt: '2026-11-04T04:00:00Z',
    description: 'IKEA MALM bed frame in white, queen size. Includes slatted base. Purchased 6 months ago, moving sale. Easy to disassemble. Mattress not included.',
    defects: ['Tiny chip on one bed slat (hidden)'],
  },
  {
    id: '11',
    title: 'Mechanical Keyboard - Keychron K2',
    price: '₱4,800',
    category: 'electronics',
    condition: 'new',
    timeAgo: '30m ago',
    sellerName: 'Kevin Park',
    sellerInitials: 'KP',
    sellerRating: 4.7,
    sellerReviews: 112,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop',
    location: 'Pasay, Metro Manila',
    isFavorite: false,
    createdAt: '2026-11-04T11:30:00Z',
    description: 'Keychron K2 Version 2, hot-swappable, Gateron Brown switches, RGB backlight, Bluetooth 5.1. Includes extra keycaps, switch puller, USB-C cable. Unopened box.',
    defects: [],
  },
  {
    id: '12',
    title: 'Designer Sunglasses - Ray-Ban Wayfarer',
    price: '₱3,200',
    category: 'accessories',
    condition: 'like-new',
    timeAgo: '1h ago',
    sellerName: 'Nicole Tan',
    sellerInitials: 'NT',
    sellerRating: 4.6,
    sellerReviews: 88,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    location: 'Ortigas, Pasig',
    isFavorite: false,
    createdAt: '2026-11-04T11:00:00Z',
    description: 'Authentic Ray-Ban RB2140 Wayfarer, black frame, green polarized lenses. Includes original case, cleaning cloth, and authenticity card. Worn only twice.',
    defects: ['Case has minor scuff'],
  },
];

// Merge seed products with created products (created first = newest)
const createdProducts = getCreatedProducts();
export const products = [...createdProducts, ...seedProducts];

/**
 * Get a single product by ID
 * @param {string} id - Product ID
 * @returns {Object|null} Product object or null if not found
 */
export function getProduct(id) {
  return products.find(p => String(p.id) === String(id)) || null;
}

/**
 * Filter products by query, category, and condition
 * @param {Object} options
 * @param {string} [options.query] - Search query
 * @param {string} [options.category] - Category ID
 * @param {string} [options.condition] - Condition ID
 * @returns {Array} Filtered products
 */
export function filterProducts({ query = '', category = 'all', condition = 'all' } = {}) {
  const q = query.trim().toLowerCase();

  return products.filter(product => {
    // Text search across title, category, description
    const matchesQuery = !q ||
      product.title.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.location.toLowerCase().includes(q);

    const matchesCategory = category === 'all' || product.category === category;
    const matchesCondition = condition === 'all' || product.condition === condition;

    return matchesQuery && matchesCategory && matchesCondition;
  });
}

/**
 * Sort products by criteria
 * @param {Array} products - Products array to sort
 * @param {string} sortBy - Sort option ID
 * @returns {Array} Sorted products (new array)
 */
export function sortProducts(products, sortBy = 'newest') {
  const sorted = [...products];

  switch (sortBy) {
    case 'newest':
      // Sort by createdAt timestamp (newer first)
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'price-low':
      return sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    case 'price-high':
      return sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    default:
      return sorted;
  }
}

/**
 * Get products with filters and sorting applied
 * @param {Object} options
 * @returns {Array} Processed products
 */
export function getProducts(options = {}) {
  const filtered = filterProducts(options);
  return sortProducts(filtered, options.sortBy);
}