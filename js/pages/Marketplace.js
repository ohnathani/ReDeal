/**
 * ReDeal — Marketplace Page Logic
 * Handles search, filters, sorting, and product grid rendering
 */

import { $, $$, createElement, escapeHtml } from '../utils/dom.js';
import { onReady, delegate, debounce } from '../utils/events.js';
import { products, getProducts } from '../data/products.js';
import { categories, conditions, sortOptions, getCategoryName, getConditionName, getSortName } from '../data/categories.js';
import { ProductCard } from '../components/Card.js';
import { getFavorites, initProductFavorites } from '../utils/favorites.js';

const state = {
  query: '',
  category: 'all',
  condition: 'all',
  sortBy: 'newest',
};

/**
 * Initialize filter dropdowns
 */
function initFilters() {
  const categorySelect = $('#category-filter');
  const conditionSelect = $('#condition-filter');
  const sortSelect = $('#sort-filter');

  // Populate category filter
  if (categorySelect) {
    categories.forEach(cat => {
      if (cat.id !== 'all') {
        categorySelect.appendChild(createElement('option', { value: cat.id }, cat.name));
      }
    });
  }

  // Populate condition filter
  if (conditionSelect) {
    conditions.forEach(cond => {
      if (cond.id !== 'all') {
        conditionSelect.appendChild(createElement('option', { value: cond.id }, cond.name));
      }
    });
  }

  // Sort options already in HTML
}

/**
 * Read URL query parameters and update state
 */
function readUrlParams() {
  const params = new URLSearchParams(window.location.search);

  if (params.has('q')) {
    state.query = params.get('q');
    const searchInput = $('#search-input');
    if (searchInput) searchInput.value = state.query;
  }
  if (params.has('category')) state.category = params.get('category');
  if (params.has('condition')) state.condition = params.get('condition');
  if (params.has('sort')) state.sortBy = params.get('sort');

  // Update select values
  if ($('#category-filter')) $('#category-filter').value = state.category;
  if ($('#condition-filter')) $('#condition-filter').value = state.condition;
  if ($('#sort-filter')) $('#sort-filter').value = state.sortBy;
}

/**
 * Update URL with current state (without reload)
 */
function updateUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set('q', state.query);
  if (state.category !== 'all') params.set('category', state.category);
  if (state.condition !== 'all') params.set('condition', state.condition);
  if (state.sortBy !== 'newest') params.set('sort', state.sortBy);

  const newUrl = params.toString() ? `marketplace.html?${params.toString()}` : 'marketplace.html';
  window.history.replaceState({}, '', newUrl);
}

/**
 * Render product grid
 */
function renderProducts() {
  const grid = $('#listings-grid');
  const emptyState = $('#empty-state');
  const emptyMessage = $('#empty-message');
  const resultsCount = $('#results-count');

  if (!grid) return;

  const filteredProducts = getProducts(state);

  // Update results count
  if (resultsCount) {
    const total = products.length;
    const showing = filteredProducts.length;
    if (state.query || state.category !== 'all' || state.condition !== 'all') {
      resultsCount.textContent = `Showing ${showing} of ${total} results`;
    } else {
      resultsCount.textContent = `${total} listings`;
    }
  }

  if (filteredProducts.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.hidden = false;
    if (emptyMessage) {
      let msg = 'No listings match your criteria';
      if (state.query) msg += ` for "${escapeHtml(state.query)}"`;
      if (state.category !== 'all') msg += ` in ${escapeHtml(getCategoryName(state.category))}`;
      if (state.condition !== 'all') msg += ` with condition ${escapeHtml(getConditionName(state.condition))}`;
      emptyMessage.textContent = msg;
    }
    return;
  }

  if (emptyState) emptyState.hidden = true;

  grid.innerHTML = '';
  filteredProducts.forEach(product => {
    const card = new ProductCard({
      ...product,
      onClick: (id) => {
        window.location.href = `product.html?id=${id}`;
      },
      onFavorite: (id, isFavorite) => {
        // Favorites handled by ProductCard internally + localStorage
        console.log(`Favorite toggled: ${id} = ${isFavorite}`);
      },
    });
    grid.appendChild(card.render());
  });
}

/**
 * Handle search input
 */
function setupSearch() {
  const searchInput = $('#search-input');
  if (!searchInput) return;

  const debouncedSearch = debounce((e) => {
    state.query = e.target.value.trim();
    updateUrl();
    renderProducts();
  }, 300);

  searchInput.addEventListener('input', debouncedSearch);

  // Also handle Enter key for immediate search
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      debouncedSearch.cancel?.(); // Clear pending debounce if available
      state.query = e.target.value.trim();
      updateUrl();
      renderProducts();
    }
  });
}

/**
 * Setup filter change handlers
 */
function setupFilters() {
  const categoryFilter = $('#category-filter');
  const conditionFilter = $('#condition-filter');
  const sortFilter = $('#sort-filter');
  const clearFiltersBtn = $('#clear-filters-btn');

  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      state.category = e.target.value;
      updateUrl();
      renderProducts();
    });
  }

  if (conditionFilter) {
    conditionFilter.addEventListener('change', (e) => {
      state.condition = e.target.value;
      updateUrl();
      renderProducts();
    });
  }

  if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      updateUrl();
      renderProducts();
    });
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      state.query = '';
      state.category = 'all';
      state.condition = 'all';
      state.sortBy = 'newest';

      const searchInput = $('#search-input');
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = 'all';
      if (conditionFilter) conditionFilter.value = 'all';
      if (sortFilter) sortFilter.value = 'newest';

      updateUrl();
      renderProducts();
    });
  }
}

/**
 * Initialize the marketplace page
 */
function init() {
  console.log('Marketplace page initialized');

  // Initialize favorites from localStorage
  initProductFavorites(products);

  initFilters();
  readUrlParams();
  setupSearch();
  setupFilters();
  renderProducts();
}

onReady(init);