/**
 * ReDeal — Card Component
 * Reusable card component for products, features, etc.
 */

import { createElement, escapeHtml } from '../utils/dom.js';
import { toggleFavorite as toggleFavoriteUtil, isFavorite } from '../utils/favorites.js';

const HEART_PATH = 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';
const TAG_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><path d="M7 7h.01"/></svg>';

/**
 * Heart icon markup. Built as a string and set with innerHTML so the browser
 * creates a real SVG element (document.createElement('svg') does not render).
 * @param {boolean} filled
 * @returns {string}
 */
function heartIcon(filled) {
  return `<svg viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${HEART_PATH}"/></svg>`;
}

/**
 * Product Card Component
 */
export class ProductCard {
  /**
   * @param {Object} data - Product data
   * @param {string} data.id - Product ID
   * @param {string} data.title - Product title
   * @param {string} data.price - Price string (e.g., "₱145")
   * @param {string} data.category - Category (e.g., "Furniture")
   * @param {string} data.timeAgo - Time ago string (e.g., "2h ago")
   * @param {string} data.sellerName - Seller name
   * @param {string} data.sellerInitials - Seller initials
   * @param {string} data.image - Image URL
   * @param {number} [data.likes] - Likes from other people (the current user's own like is added on top)
   * @param {boolean} [data.openToOffers] - Seller accepts offers (shows the "Open to offers" pill)
   * @param {Function} [data.onClick] - Click handler
   * @param {Function} [data.onFavorite] - Favorite toggle handler
   */
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.price = data.price;
    this.category = data.category;
    this.timeAgo = data.timeAgo;
    this.sellerName = data.sellerName;
    this.sellerInitials = data.sellerInitials;
    this.image = data.image;
    // Saved favorites are the source of truth for the heart, so every page agrees
    this.isFavorite = isFavorite(String(data.id));
    this.likes = Number(data.likes) || 0;
    this.openToOffers = data.openToOffers === true;
    this.onClick = data.onClick;
    this.onFavorite = data.onFavorite;
  }

  render() {
    const article = createElement('article', {
      class: 'product-card',
      dataset: { id: this.id },
    });
    this.el = article;

    // Image container with price tag and favorite button
    const imageContainer = createElement('div', { class: 'product-card__image-container' });

    if (this.image) {
      const productImage = createElement('img', {
        class: 'product-card__image',
        src: this.image,
        alt: escapeHtml(this.title),
        loading: 'lazy',
      });

      // Keep the card layout intact when a remote image is unavailable.
      productImage.addEventListener('error', () => {
        productImage.replaceWith(createElement('div', {
          class: 'product-card__placeholder',
          role: 'img',
          'aria-label': `${this.title} image unavailable`,
        }, 'Image unavailable'));
      }, { once: true });

      imageContainer.appendChild(productImage);
    } else {
      // Placeholder
      imageContainer.appendChild(createElement('div', {
        class: 'product-card__placeholder',
        role: 'img',
        'aria-label': `${this.title} image unavailable`,
      }, 'Image unavailable'));
    }

    // Price tag
    imageContainer.appendChild(createElement('div', {
      class: 'product-card__price-tag',
    }, escapeHtml(this.price)));

    // Overlay chips on the image: offers (bottom-left), heart + likes (bottom-right)
    if (this.openToOffers) {
      imageContainer.appendChild(createElement('span', {
        class: 'product-card__offer',
        html: `${TAG_ICON}<span class="product-card__offer-text">Open to offers</span>`,
      }));
    }

    // Favorite button: heart + like count (overlaid on the image, bottom-right)
    const favoriteBtn = createElement('button', {
      class: `product-card__favorite ${this.isFavorite ? 'product-card__favorite--active' : ''}`.trim(),
      type: 'button',
      'aria-label': this.favoriteLabel(),
      'aria-pressed': String(this.isFavorite),
      html: this.favoriteContent(),
      onclick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleFavorite();
      },
    });

    imageContainer.appendChild(favoriteBtn);

    article.appendChild(imageContainer);

    // Details
    const details = createElement('div', { class: 'product-card__details' });

    // Title row
    const titleRow = createElement('div', { class: 'product-card__title-row' });
    titleRow.appendChild(createElement('h3', {
      class: 'product-card__title',
    }, escapeHtml(this.title)));

    details.appendChild(titleRow);

    // Meta
    details.appendChild(createElement('p', {
      class: 'product-card__meta',
    }, `${escapeHtml(this.category)} • ${escapeHtml(this.timeAgo)}`));

    // Seller row
    const sellerRow = createElement('div', { class: 'product-card__seller-row' });
    sellerRow.appendChild(createElement('div', {
      class: 'product-card__avatar',
    }, escapeHtml(this.sellerInitials)));
    sellerRow.appendChild(createElement('span', {
      class: 'product-card__seller-name',
    }, escapeHtml(this.sellerName)));

    details.appendChild(sellerRow);
    article.appendChild(details);

    // Click handler
    if (this.onClick) {
      article.addEventListener('click', (e) => {
        if (!e.target.closest('.product-card__favorite')) {
          this.onClick(this.id, e);
        }
      });
    }

    // Keyboard support
    article.addEventListener('keydown', (e) => {
      // Let the favorite button handle its own Enter/Space
      if (e.target.closest('.product-card__favorite')) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (this.onClick) {
          this.onClick(this.id, e);
        }
      }
    });

    article.setAttribute('tabindex', '0');
    article.setAttribute('role', 'article');

    return article;
  }

  /** Likes shown on the card: other people's likes plus the current user's own */
  get likeCount() {
    return this.likes + (this.isFavorite ? 1 : 0);
  }

  favoriteContent() {
    return `${heartIcon(this.isFavorite)}<span class="product-card__likes" aria-hidden="true">${this.likeCount}</span>`;
  }

  favoriteLabel() {
    const n = this.likeCount;
    return `${this.isFavorite ? 'Remove from favorites' : 'Add to favorites'} (${n} ${n === 1 ? 'like' : 'likes'})`;
  }

  toggleFavorite() {
    this.isFavorite = toggleFavoriteUtil(this.id);
    const favoriteBtn = (this.el ?? this.element)?.querySelector('.product-card__favorite');
    if (favoriteBtn) {
      favoriteBtn.classList.toggle('product-card__favorite--active', this.isFavorite);
      favoriteBtn.setAttribute('aria-label', this.favoriteLabel());
      favoriteBtn.setAttribute('aria-pressed', String(this.isFavorite));
      favoriteBtn.innerHTML = this.favoriteContent();
    }
    if (this.onFavorite) {
      this.onFavorite(this.id, this.isFavorite);
    }
  }

  get element() {
    return document.querySelector(`.product-card[data-id="${this.id}"]`);
  }

  update(data) {
    Object.assign(this, data);
    const el = this.element;
    if (el) {
      const newEl = this.render();
      el.replaceWith(newEl);
    }
  }
}

/**
 * Feature Card Component (for "How it works" section)
 */
export class FeatureCard {
  /**
   * @param {Object} data
   * @param {string} data.icon - SVG icon HTML
   * @param {string} data.title
   * @param {string} data.content
   * @param {Function} [data.onClick]
   */
  constructor(data) {
    this.icon = data.icon;
    this.title = data.title;
    this.content = data.content;
    this.onClick = data.onClick;
  }

  render() {
    const article = createElement('article', { class: 'card card--feature' });

    article.appendChild(createElement('div', {
      class: 'card__icon',
      html: this.icon,
    }));

    article.appendChild(createElement('h3', {
      class: 'card__title',
    }, this.title));

    article.appendChild(createElement('p', {
      class: 'card__content',
    }, this.content));

    if (this.onClick) {
      article.style.cursor = 'pointer';
      article.addEventListener('click', this.onClick);
      article.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.onClick(e);
        }
      });
      article.setAttribute('tabindex', '0');
    }

    return article;
  }
}

/**
 * Generic Card Component
 */
export class Card {
  /**
   * @param {Object} data
   * @param {string} [data.title]
   * @param {string} [data.content]
   * @param {Object} [data.action] - { label, handler }
   * @param {string} [data.variant] - 'default' | 'selected' | 'feature'
   */
  constructor(data = {}) {
    this.title = data.title;
    this.content = data.content;
    this.action = data.action;
    this.variant = data.variant || 'default';
  }

  render() {
    const article = createElement('article', {
      class: `card ${this.variant !== 'default' ? `card--${this.variant}` : ''}`,
    });

    if (this.title) {
      article.appendChild(createElement('h3', {
        class: 'card__title',
      }, this.title));
    }

    if (this.content) {
      article.appendChild(createElement('div', {
        class: 'card__content',
      }, this.content));
    }

    if (this.action) {
      const btn = createElement('button', {
        class: 'btn btn--primary',
        onclick: this.action.handler,
      }, this.action.label);
      article.appendChild(btn);
    }

    return article;
  }
}
