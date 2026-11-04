/**
 * ReDeal — Main Application Entry Point
 * Initializes the app and renders components
 */

import { $, $$, createElement, escapeHtml } from './utils/dom.js';
import { onReady, delegate, debounce } from './utils/events.js';
import { ProductCard, FeatureCard } from './components/Card.js';
import { Modal } from './components/Modal.js';
import { products } from './data/products.js';
import { getFavorites, initProductFavorites } from './utils/favorites.js';

// Sample product data imported from shared module (homepage shows first 6)
const sampleProducts = products.slice(0, 6);

// Initialize favorites from localStorage
initProductFavorites(sampleProducts);

// Feature cards data
const features = [
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    title: 'Browse & Discover',
    content: 'Search thousands of listings from verified student sellers.',
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 15h.01"/></svg>`,
    title: 'Chat Securely',
    content: 'Message sellers directly in-app. No phone numbers needed.',
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>`,
    title: 'Post a Request',
    content: "Can't find it? Let sellers know what you're looking for.",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    title: 'Safe Transactions',
    content: 'Meet on campus or use verified pickup points. Your safety first.',
  },
];

/**
 * Render product cards to grid
 * @param {HTMLElement} container - Grid container
 * @param {Array} products - Product data array
 */
function renderProducts(container, products) {
  container.innerHTML = '';

  products.forEach(product => {
    const card = new ProductCard({
      ...product,
      onClick: (id) => handleProductClick(id),
      onFavorite: (id, isFavorite) => handleFavoriteToggle(id, isFavorite),
    });
    container.appendChild(card.render());
  });
}

/**
 * Render feature cards
 * @param {HTMLElement} container - Grid container
 * @param {Array} features - Feature data array
 */
function renderFeatures(container, features) {
  container.innerHTML = '';

  features.forEach(feature => {
    const card = new FeatureCard({
      ...feature,
      onClick: () => console.log('Feature clicked:', feature.title),
    });
    container.appendChild(card.render());
  });
}

/**
 * Handle product card click
 * @param {string} productId - Product ID
 */
function handleProductClick(productId) {
  const product = sampleProducts.find(p => p.id === productId);
  if (product) {
    console.log('Navigate to product detail:', product.title);
    window.location.href = `product.html?id=${productId}`;
  }
}

/**
 * Handle favorite toggle
 * @param {string} productId - Product ID
 * @param {boolean} isFavorite - New favorite state
 */
function handleFavoriteToggle(productId, isFavorite) {
  const product = sampleProducts.find(p => p.id === productId);
  if (product) {
    product.isFavorite = isFavorite;
    console.log(`${isFavorite ? 'Added to' : 'Removed from'} favorites:`, product.title);
  }

  // Also update the full products array for cross-page consistency
  const fullProduct = products.find(p => p.id === productId);
  if (fullProduct) {
    fullProduct.isFavorite = isFavorite;
  }
}

/**
 * Show product detail modal (demo)
 * @param {Object} product - Product data
 */
function showProductDetail(product) {
  const content = `
    <div style="display: grid; gap: var(--space-md);">
      <div style="aspect-ratio: 1; border-radius: var(--radius-lg); overflow: hidden; background: var(--color-background);">
        <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div>
        <h3 style="font-size: var(--text-xl); font-weight: 600; margin-bottom: var(--space-xs);">${product.title}</h3>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-md);">${product.category} • Listed ${product.timeAgo}</p>
        <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--color-primary); margin-bottom: var(--space-md);">${product.price}</div>
        <div style="display: flex; align-items: center; gap: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--color-border);">
          <div class="avatar avatar--sm">${product.sellerInitials}</div>
          <div>
            <div style="font-weight: 600;">Sold by ${product.sellerName}</div>
            <div style="font-size: var(--text-sm); color: var(--color-text-muted);">Trusted seller</div>
          </div>
        </div>
      </div>
      <div style="display: flex; gap: var(--space-sm);">
        <button class="btn btn--primary btn--block">Message Seller</button>
        <button class="btn btn--secondary btn--block">Make Offer</button>
      </div>
    </div>
  `;

  const modal = new Modal({
    title: 'Product Details',
    content,
    actions: [
      { label: 'Close', variant: 'btn--secondary' },
    ],
    onClose: () => console.log('Product detail closed'),
  });

  modal.open();
}

/**
 * Initialize the application
 */
function init() {
  console.log('ReDeal app initialized');

  // Render feature cards
  const featuresGrid = $('#listings-grid');
  if (featuresGrid) {
    // The features are in the how-it-works section
    const howItWorksGrid = $('.how-it-works__grid');
    if (howItWorksGrid) {
      renderFeatures(howItWorksGrid, features);
    }
  }

  // Render product listings
  const listingsGrid = $('#listings-grid');
  if (listingsGrid) {
    renderProducts(listingsGrid, sampleProducts);
  }

  // Set up event delegation for bottom nav
  delegate(document.body, '.bottom-nav__item', 'click', (e, item) => {
    // Remove active from all
    $$('.bottom-nav__item').forEach(i => i.classList.remove('bottom-nav__item--active'));
    // Add active to clicked
    item.classList.add('bottom-nav__item--active');

    // Allow normal anchor navigation
    const href = item.getAttribute('href');
    if (href && href !== '#') {
      console.log('Navigate to:', href);
    }
  });

  // Set up New Listing button
  const newListingBtn = $('.header__new-listing');
  if (newListingBtn) {
    newListingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'create-listing.html';
    });
  }

  // Set up auth buttons
  delegate(document.body, '.auth-actions__buttons .btn', 'click', (e, btn) => {
    const action = btn.textContent.trim();
    console.log('Auth action:', action);
    // In a real app, show login/signup modal
    if (action === 'Log In') {
      showLoginModal();
    } else if (action === 'Sign Up') {
      showSignupModal();
    }
  });

  // Search input handler — navigate to marketplace with query
  const searchInput = $('.header__search-input');
  if (searchInput) {
    const debouncedSearch = debounce((e) => {
      const query = e.target.value.trim();
      if (query) {
        window.location.href = `marketplace.html?q=${encodeURIComponent(query)}`;
      }
    }, 300);

    searchInput.addEventListener('input', debouncedSearch);

    // Also handle Enter key
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        debouncedSearch.cancel();
        const query = e.target.value.trim();
        if (query) {
          window.location.href = `marketplace.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
  }
}

/**
 * Show login modal
 */
function showLoginModal() {
  const modal = new Modal({
    title: 'Log In',
    content: `
      <form id="login-form" style="display: grid; gap: var(--space-md);">
        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <input type="email" id="email" class="form-input" placeholder="you@example.com" required autocomplete="email">
        </div>
        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input type="password" id="password" class="form-input" placeholder="••••••••" required autocomplete="current-password">
        </div>
        <label class="form-check" style="display: flex; align-items: center; gap: var(--space-sm); cursor: pointer;">
          <input type="checkbox" class="form-check-input">
          <span class="form-check-label">Remember me</span>
        </label>
        <p style="font-size: var(--text-sm); color: var(--color-text-muted); margin: 0;">
          <a href="#" style="color: var(--color-primary);">Forgot password?</a>
        </p>
      </form>
    `,
    actions: [
      { label: 'Cancel', variant: 'btn--secondary' },
      { label: 'Log In', variant: 'btn--primary', primary: true, handler: () => {
        const form = modal.modal.querySelector('#login-form');
        if (form) {
          const formData = new FormData(form);
          console.log('Login:', Object.fromEntries(formData));
          return true;
        }
        return false;
      }},
    ],
  });
  modal.open();
}

/**
 * Show signup modal
 */
function showSignupModal() {
  const modal = new Modal({
    title: 'Create Account',
    content: `
      <form id="signup-form" style="display: grid; gap: var(--space-md);">
        <div class="form-group">
          <label class="form-label" for="name">Full Name</label>
          <input type="text" id="name" class="form-input" placeholder="John Doe" required autocomplete="name">
        </div>
        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <input type="email" id="email" class="form-input" placeholder="you@example.com" required autocomplete="email">
        </div>
        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input type="password" id="password" class="form-input" placeholder="••••••••" required autocomplete="new-password" minlength="8">
        </div>
        <div class="form-group">
          <label class="form-label" for="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" class="form-input" placeholder="••••••••" required autocomplete="new-password">
        </div>
        <label class="form-check" style="display: flex; align-items: center; gap: var(--space-sm); cursor: pointer;">
          <input type="checkbox" class="form-check-input" required>
          <span class="form-check-label">I agree to the <a href="#" style="color: var(--color-primary);">Terms of Service</a> and <a href="#" style="color: var(--color-primary);">Privacy Policy</a></span>
        </label>
      </form>
    `,
    actions: [
      { label: 'Cancel', variant: 'btn--secondary' },
      { label: 'Create Account', variant: 'btn--primary', primary: true, handler: () => {
        const form = modal.modal.querySelector('#signup-form');
        if (form) {
          const formData = new FormData(form);
          console.log('Signup:', Object.fromEntries(formData));
          return true;
        }
        return false;
      }},
    ],
  });
  modal.open();
}

// Initialize when DOM is ready
onReady(init);

// Export for potential testing
export { init, sampleProducts, features };