/**
 * ReDeal — Category Data
 * Centralized category definitions for the marketplace
 */

export const categories = [
  { id: 'all', name: 'All Categories', icon: 'grid' },
  { id: 'electronics', name: 'Electronics', icon: 'cpu' },
  { id: 'clothing', name: 'Clothing', icon: 'shirt' },
  { id: 'furniture', name: 'Furniture', icon: 'home' },
  { id: 'accessories', name: 'Accessories', icon: 'watch' },
  { id: 'home-garden', name: 'Home & Garden', icon: 'flower' },
  { id: 'books', name: 'Books', icon: 'book' },
  { id: 'sports', name: 'Sports', icon: 'dumbbell' },
  { id: 'vehicles', name: 'Vehicles', icon: 'car' },
  { id: 'collectibles', name: 'Collectibles', icon: 'gem' },
];

export const conditions = [
  { id: 'all', name: 'All Conditions' },
  { id: 'new', name: 'New' },
  { id: 'like-new', name: 'Like New' },
  { id: 'good', name: 'Good' },
  { id: 'fair', name: 'Fair' },
  { id: 'poor', name: 'Poor' },
];

export const sortOptions = [
  { id: 'newest', name: 'Newest First' },
  { id: 'oldest', name: 'Oldest First' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
];

export function getCategoryName(id) {
  const category = categories.find(c => c.id === id);
  return category ? category.name : 'All Categories';
}

export function getConditionName(id) {
  const condition = conditions.find(c => c.id === id);
  return condition ? condition.name : 'All Conditions';
}

export function getSortName(id) {
  const sort = sortOptions.find(s => s.id === id);
  return sort ? sort.name : 'Newest First';
}