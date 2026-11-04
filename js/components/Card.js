/**
 * ReDeal — Card Component
 * Reusable card component for products, features, etc.
 */

import { createElement, escapeHtml } from '../utils/dom.js';
import { toggleFavorite as toggleFavoriteUtil, isFavorite } from '../utils/favorites.js';

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
   * @param {boolean} data.isFavorite - Whether favorited
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
    this.isFavorite = data.isFavorite || false;
    this.onClick = data.onClick;
    this.onFavorite = data.onFavorite;
  }

  render() {
    const article = createElement('article', {
      class: 'product-card',
      dataset: { id: this.id },
    });

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

    // Favorite button
    const favoriteBtn = createElement('button', {
      class: `product-card__favorite ${this.isFavorite ? 'product-card__favorite--active' : ''}`,
      'aria-label': this.isFavorite ? 'Remove from favorites' : 'Add to favorites',
      'aria-pressed': this.isFavorite,
      onclick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleFavorite();
      },
    }, createElement('svg', {
      class: 'icon icon--sm',
      viewBox: '0 0 24 24',
      fill: this.isFavorite ? 'currentColor' : 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'aria-hidden': 'true',
    }, createElement('path', { d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' })));

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
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (this.onClick && !e.target.closest('.product-card__favorite')) {
          this.onClick(this.id, e);
        }
      }
    });

    article.setAttribute('tabindex', '0');
    article.setAttribute('role', 'article');

    return article;
  }

  toggleFavorite() {
    this.isFavorite = toggleFavoriteUtil(this.id);
    const favoriteBtn = this.element?.querySelector('.product-card__favorite');
    if (favoriteBtn) {
      favoriteBtn.classList.toggle('product-card__favorite--active', this.isFavorite);
      favoriteBtn.setAttribute('aria-label', this.isFavorite ? 'Remove from favorites' : 'Add to favorites');
      favoriteBtn.setAttribute('aria-pressed', this.isFavorite);
      favoriteBtn.querySelector('svg').setAttribute('fill', this.isFavorite ? 'currentColor' : 'none');
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
