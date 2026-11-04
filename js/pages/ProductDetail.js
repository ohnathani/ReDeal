/**
 * ReDeal — Product Detail Page Logic
 * Handles product detail rendering, gallery, favorites, and actions
 */

import { $, $$, createElement, escapeHtml, empty } from '../utils/dom.js';
import { onReady, delegate } from '../utils/events.js';
import { getProduct } from '../data/products.js';
import { getCategoryName, getConditionName } from '../data/categories.js';
import { isFavorite as isFavoriteUtil, toggleFavorite } from '../utils/favorites.js';
import { Modal, alert } from '../components/Modal.js';

let currentProduct = null;
let currentImageIndex = 0;

/**
 * Initialize the product detail page
 */
function init() {
  console.log('Product Detail page initialized');

  // Get product ID from URL
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    showNotFound();
    return;
  }

  // Load product data
  currentProduct = getProduct(productId);

  if (!currentProduct) {
    showNotFound();
    return;
  }

  // Initialize favorites from localStorage
  currentProduct.isFavorite = isFavoriteUtil(currentProduct.id);

  // Render product
  renderProduct(currentProduct);

  // Setup event listeners
  setupEventListeners();

  // Update document title
  document.title = `${escapeHtml(currentProduct.title)} — ReDeal`;
}

/**
 * Share product using Web Share API or clipboard fallback
 */
async function shareProduct() {
  if (!currentProduct) return;

  const shareData = {
    title: currentProduct.title,
    text: `${currentProduct.title} - ${currentProduct.price} on ReDeal`,
    url: window.location.href
  };

  try {
    if (navigator.share && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return;
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.log('Share cancelled or failed:', err.message);
    }
  }

  // Clipboard fallback
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!');
  } catch (err) {
    console.warn('Clipboard write failed:', err);
    // Final fallback: show modal with link to copy
    showShareFallbackModal();
  }
}

/**
 * Handle share button click (non-async wrapper for delegation)
 */
function handleShare(event, button) {
  shareProduct();
}

/**
 * Show share fallback modal with copyable link (no inline onclick)
 */
function showShareFallbackModal() {
  const input = createElement('input', {
    type: 'text',
    class: 'form-input',
    value: window.location.href,
    readonly: true,
    style: 'font-family: var(--font-mono); font-size: var(--text-sm);'
  });

  // Select all text on click/focus
  input.addEventListener('click', () => input.select());
  input.addEventListener('focus', () => input.select());

  const modal = new Modal({
    title: 'Share Link',
    content: createElement('div', {}, [
      createElement('p', {
        style: 'margin-bottom: var(--space-md); color: var(--color-text-secondary);'
      }, 'Unable to copy automatically. Please copy the link below:'),
      createElement('div', { class: 'form-group' }, input),
      createElement('p', { class: 'form-hint' }, 'Click the link to select all, then press Ctrl+C (Cmd+C on Mac) to copy.')
    ]),
    actions: [
      { label: 'Close', variant: 'btn--primary', primary: true },
    ],
  });
  modal.open();
}

/**
 * Show a temporary toast notification
 */
function showToast(message) {
  // Remove existing toast
  const existing = $('.toast');
  if (existing) existing.remove();

  const toast = createElement('div', { class: 'toast', role: 'status', 'aria-live': 'polite' }, message);
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add('toast--show'));

  // Remove after delay
  setTimeout(() => {
    toast.classList.remove('toast--show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Render the product detail page
 */
function renderProduct(product) {
  const container = $('#product-detail-container');
  const notFound = $('#product-not-found');

  if (!container) return;

  if (notFound) notFound.hidden = true;
  container.hidden = false;

  // Build the product detail HTML
  container.innerHTML = `
    <!-- Breadcrumb -->
    <nav class="product-breadcrumb" aria-label="Breadcrumb">
      <span class="product-breadcrumb__item">
        <a href="index.html" class="product-breadcrumb__link">Home</a>
        <span class="product-breadcrumb__separator" aria-hidden="true">/</span>
      </span>
      <span class="product-breadcrumb__item">
        <a href="marketplace.html" class="product-breadcrumb__link">Marketplace</a>
        <span class="product-breadcrumb__separator" aria-hidden="true">/</span>
      </span>
      <span class="product-breadcrumb__item">
        <span class="product-breadcrumb__current" aria-current="page">${escapeHtml(product.title)}</span>
      </span>
    </nav>

    <!-- Product Detail Grid (Desktop: two-column layout) -->
    <div class="product-detail-grid">
      <!-- Gallery -->
      <section class="product-gallery" aria-label="Product images">
        <div class="gallery__main" role="img" aria-label="${escapeHtml(product.title)} main image">
          <img
            class="gallery__main-image"
            src="${escapeHtml(product.image)}"
            alt="${escapeHtml(product.title)}"
            loading="eager"
          >
          <div class="gallery__placeholder" hidden>
            <svg class="icon icon--xl" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
        </div>
        <div class="gallery__thumbs" role="tablist" aria-label="Product thumbnails">
          <button
            class="gallery__thumb gallery__thumb--active"
            role="tab"
            aria-selected="true"
            aria-label="${escapeHtml(product.title)}"
            data-index="0"
          >
            <img src="${escapeHtml(product.image)}" alt="" loading="lazy">
          </button>
        </div>
      </section>

      <!-- Product Info -->
      <div class="product-info">
      <header class="product-info__header">
        <div class="product-info__badges">
          <span class="badge badge--primary">${escapeHtml(getCategoryName(product.category))}</span>
          <span class="badge badge--neutral">${escapeHtml(getConditionName(product.condition))}</span>
        </div>
        <h1 class="product-info__title">${escapeHtml(product.title)}</h1>
        <div class="product-info__price price price--large">${escapeHtml(product.price)}</div>
      </header>

      <div class="product-info__meta">
        <span class="product-info__meta-item">
          <svg class="product-info__meta-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>${escapeHtml(product.location)}</span>
        </span>
        <span class="product-info__meta-item">
          <svg class="product-info__meta-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span>Listed ${escapeHtml(product.timeAgo)}</span>
        </span>
      </div>

      <div class="product-info__description">
        ${escapeHtml(product.description)}
      </div>

      ${product.defects && product.defects.length > 0 ? `
        <section class="product-info__section" aria-labelledby="defects-heading">
          <h2 id="defects-heading" class="product-info__section-title">Defects & Functionality</h2>
          <ul class="product-info__defects">
            ${product.defects.map(defect => `
              <li class="product-info__defect">
                <svg class="product-info__defect-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
                <span>${escapeHtml(defect)}</span>
              </li>
            `).join('')}
          </ul>
        </section>
      ` : ''}

      <!-- Seller Card -->
      <section class="seller-card" aria-labelledby="seller-heading">
        <div class="seller-card__avatar">
          <div class="avatar avatar--lg" aria-hidden="true">${escapeHtml(product.sellerInitials)}</div>
        </div>
        <div class="seller-card__info">
          <h2 id="seller-heading" class="seller-card__name">${escapeHtml(product.sellerName)}</h2>
          <div class="seller-card__rating">
            <div class="rating">
              <div class="rating__stars" aria-hidden="true">
                ${renderStars(product.sellerRating)}
              </div>
              <span class="rating__value">${product.sellerRating.toFixed(1)}</span>
              <span class="rating__count">(${product.sellerReviews} reviews)</span>
            </div>
          </div>
        </div>
        <div class="seller-card__action">
          <button class="btn btn--ghost btn--sm" data-action="message-seller">Message</button>
        </div>
      </section>

    </div> <!-- /product-detail-grid -->

      <!-- Actions -->
      <div class="product-actions" role="group" aria-label="Product actions">
        <div class="product-actions__primary">
          <button class="btn btn--primary btn--lg btn--block" data-action="make-offer">
            <svg class="btn__icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Make Offer
          </button>
        </div>
        <div class="product-actions__secondary">
          <button class="favorite-btn ${product.isFavorite ? 'favorite-btn--active' : ''}" data-action="toggle-favorite" aria-label="${product.isFavorite ? 'Remove from favorites' : 'Add to favorites'}" aria-pressed="${product.isFavorite}">
            <svg class="icon icon--md" aria-hidden="true" viewBox="0 0 24 24" fill="${product.isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button class="btn btn--secondary btn--lg btn--block" data-action="message-seller">
            <svg class="btn__icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Message Seller
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Action Bar -->
    <div class="action-bar" role="toolbar" aria-label="Product actions">
      <button class="action-bar__item action-bar__item--favorite favorite-btn ${product.isFavorite ? 'favorite-btn--active' : ''}" data-action="toggle-favorite" aria-label="${product.isFavorite ? 'Remove from favorites' : 'Add to favorites'}" aria-pressed="${product.isFavorite}">
        <svg class="icon icon--md" aria-hidden="true" viewBox="0 0 24 24" fill="${product.isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <button class="action-bar__item btn btn--secondary btn--block" data-action="message-seller">
        <svg class="btn__icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Message</span>
      </button>
      <button class="action-bar__item btn btn--primary btn--block" data-action="make-offer">Make Offer</button>
    </div>
  `;
}

/**
 * Render star rating SVG
 */
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHtml = '';

  for (let i = 0; i < fullStars; i++) {
    starsHtml += `
      <svg class="rating__star rating__star--filled" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    `;
  }

  if (hasHalfStar) {
    starsHtml += `
      <svg class="rating__star rating__star--filled" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    `;
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHtml += `
      <svg class="rating__star" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    `;
  }

  return starsHtml;
}

/**
 * Show not found state
 */
function showNotFound() {
  const container = $('#product-detail-container');
  const notFound = $('#product-not-found');

  if (container) container.hidden = true;
  if (notFound) notFound.hidden = false;

  document.title = 'Product Not Found — ReDeal';
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Listen for favorites changes from other pages
  window.addEventListener('favorites-changed', handleFavoritesChanged);

  // Share button
  delegate(document, '.product-detail-header__share', 'click', handleShare);

  // Favorite button
  delegate(document, '[data-action="toggle-favorite"]', 'click', handleFavoriteToggle);

  // Message Seller
  delegate(document, '[data-action="message-seller"]', 'click', handleMessageSeller);

  // Make Offer
  delegate(document, '[data-action="make-offer"]', 'click', handleMakeOffer);

  // Thumbnail clicks
  delegate(document, '.gallery__thumb', 'click', handleThumbnailClick);

  // Keyboard support for thumbnails
  delegate(document, '.gallery__thumb', 'keydown', (e, target) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleThumbnailClick(e, target);
    }
  });

  // Image load/error handling
  const mainImage = $('.gallery__main-image');
  const placeholder = $('.gallery__placeholder');

  if (mainImage) {
    mainImage.addEventListener('load', () => {
      mainImage.classList.remove('gallery__main-image--loading');
      if (placeholder) placeholder.hidden = true;
    });

    mainImage.addEventListener('error', () => {
      mainImage.classList.add('gallery__main-image--error');
      mainImage.hidden = true;
      if (placeholder) placeholder.hidden = false;
    });
  }

  // Thumbnail error handling - match main image fallback behavior
  $$('.gallery__thumb img').forEach(thumbImg => {
    thumbImg.addEventListener('error', () => {
      // Hide the broken thumbnail image, the button will still be clickable but show nothing
      thumbImg.hidden = true;
      thumbImg.style.display = 'none';
    });
  });
}

/**
 * Handle favorites changed event from other pages
 */
function handleFavoritesChanged(event) {
  if (!currentProduct) return;

  const { id, isFavorite } = event.detail;
  if (id === currentProduct.id) {
    currentProduct.isFavorite = isFavorite;

    // Update all favorite buttons
    const favoriteButtons = $$('[data-action="toggle-favorite"]');
    favoriteButtons.forEach(btn => {
      btn.classList.toggle('favorite-btn--active', isFavorite);
      btn.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
      btn.setAttribute('aria-pressed', isFavorite);
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', isFavorite ? 'currentColor' : 'none');
      }
    });
  }
}

/**
 * Handle favorite toggle
 */
function handleFavoriteToggle(event, button) {
  if (!currentProduct) return;

  const newState = toggleFavorite(currentProduct.id);
  currentProduct.isFavorite = newState;

  // Update all favorite buttons
  const favoriteButtons = $$('[data-action="toggle-favorite"]');
  favoriteButtons.forEach(btn => {
    btn.classList.toggle('favorite-btn--active', newState);
    btn.setAttribute('aria-label', newState ? 'Remove from favorites' : 'Add to favorites');
    btn.setAttribute('aria-pressed', newState);
    const svg = btn.querySelector('svg');
    if (svg) {
      svg.setAttribute('fill', newState ? 'currentColor' : 'none');
    }
  });

  console.log(`Favorite toggled: ${currentProduct.id} = ${newState}`);
}

/**
 * Handle Message Seller
 */
function handleMessageSeller(event, button) {
  if (!currentProduct) return;

  const modal = new Modal({
    title: 'Message Seller',
    content: `
      <div class="prototype-badge">Prototype — Messaging not connected</div>
      <p style="margin-bottom: var(--space-md); color: var(--color-text-secondary);">
        This is a prototype. The messaging feature is not yet connected to a backend.
      </p>
      <p style="margin-bottom: var(--space-md); color: var(--color-text-secondary);">
        You would be messaging <strong>${escapeHtml(currentProduct.sellerName)}</strong> about <strong>"${escapeHtml(currentProduct.title)}"</strong>.
      </p>
      <form id="message-form">
        <div class="form-group">
          <label for="message-input" class="form-label">Your Message</label>
          <textarea id="message-input" class="form-textarea" rows="4" placeholder="Hi, I'm interested in this item..." required></textarea>
          <span class="form-hint">Your message will be sent when messaging is implemented.</span>
        </div>
      </form>
    `,
    actions: [
      { label: 'Cancel', variant: 'btn--secondary' },
      { label: 'Send Message', variant: 'btn--primary', primary: true, handler: (modalInstance) => {
        const input = modalInstance.modal.querySelector('textarea');
        const text = (input?.value ?? '').trim();

        if (!text) {
          return false;
        }

        modalInstance.close();

        requestAnimationFrame(() => {
          alert({
            title: 'Message Sent',
            message: 'Your message has been sent to the seller. (Prototype — no backend.)',
          });
        });

        return false;
      }}
    ],
  });

  modal.open();

  // Enable send button when message has content (initially disabled)
  const messageInput = $('#message-input');
  const sendBtn = $$('.modal__footer .btn--primary')[0];
  if (messageInput && sendBtn) {
    sendBtn.disabled = true;
    messageInput.addEventListener('input', () => {
      sendBtn.disabled = !messageInput.value.trim();
    });
  }
}

/**
 * Handle Make Offer
 */
function handleMakeOffer(event, button) {
  if (!currentProduct) return;

  const modal = new Modal({
    title: 'Make Offer',
    content: `
      <div class="prototype-badge">Prototype — No actual transaction</div>
      <p style="margin-bottom: var(--space-md); color: var(--color-text-secondary);">
        This is a prototype. No actual transaction will occur.
      </p>
      <p style="margin-bottom: var(--space-md); color: var(--color-text-secondary);">
        Current price: <strong>${escapeHtml(currentProduct.price)}</strong>
      </p>
      <form id="offer-form">
        <div class="form-group">
          <label for="offer-input" class="form-label">Your Offer (₱)</label>
          <input
            type="number"
            id="offer-input"
            class="form-input"
            min="1"
            step="1"
            placeholder="Enter your offer"
            required
            autocomplete="off"
          >
          <span class="form-hint">Enter an amount in Philippine Pesos (₱).</span>
        </div>
      </form>
    `,
    actions: [
      { label: 'Cancel', variant: 'btn--secondary' },
      { label: 'Submit Offer', variant: 'btn--primary', primary: true, handler: (modalInstance) => {
        const input = modalInstance.modal.querySelector('input[type="number"], input');
        const raw = (input?.value ?? '').trim();
        const amount = Number(raw);

        if (!raw || !Number.isFinite(amount) || amount <= 0) {
          return false;
        }

        modalInstance.close();

        requestAnimationFrame(() => {
          alert({
            title: 'Offer Sent',
            message: `Your offer of ₱${amount.toLocaleString()} has been sent. (Prototype — no backend.)`,
          });
        });

        return false;
      }}
    ],
  });

  modal.open();

  // Enable submit button when offer has valid value (initially disabled)
  const offerInput = $('#offer-input');
  const submitBtn = $$('.modal__footer .btn--primary')[0];
  if (offerInput && submitBtn) {
    submitBtn.disabled = true;
    offerInput.addEventListener('input', () => {
      const value = parseInt(offerInput.value, 10);
      submitBtn.disabled = isNaN(value) || value < 1;
    });
  }
}

/**
 * Handle thumbnail click
 */
function handleThumbnailClick(event, thumb) {
  const index = parseInt(thumb.dataset.index, 10);
  if (isNaN(index) || index === currentImageIndex) return;

  // Update active state
  $$('.gallery__thumb').forEach((t, i) => {
    t.classList.toggle('gallery__thumb--active', i === index);
    t.setAttribute('aria-selected', i === index);
  });

  // Update main image
  const mainImage = $('.gallery__main-image');
  const placeholder = $('.gallery__placeholder');

  if (mainImage && currentProduct) {
    mainImage.src = currentProduct.image;
    mainImage.alt = `${currentProduct.title} - Image ${index + 1}`;
    mainImage.classList.add('gallery__main-image--loading');
    mainImage.hidden = false;
    if (placeholder) placeholder.hidden = true;
  }

  currentImageIndex = index;
}

// Initialize on DOM ready
onReady(init);