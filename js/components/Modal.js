/**
 * ReDeal — Modal Component
 * Accessible modal dialog component
 */

import { createElement } from '../utils/dom.js';
import { trapFocus, onEscape, onClickOutside, on } from '../utils/events.js';

/**
 * Modal Component
 */
export class Modal {
  /**
   * @param {Object} options
   * @param {string} [options.title] - Modal title
   * @param {string|Element} [options.content] - Modal body content
   * @param {Array<Object>} [options.actions] - Action buttons [{ label, variant, handler, primary }]
   * @param {boolean} [options.closeOnOverlayClick=true] - Close on overlay click
   * @param {boolean} [options.closeOnEscape=true] - Close on Escape key
   * @param {Function} [options.onClose] - Called when modal closes
   * @param {Function} [options.onOpen] - Called when modal opens
   */
  constructor(options = {}) {
    this.title = options.title;
    this.content = options.content;
    this.actions = options.actions || [];
    this.closeOnOverlayClick = options.closeOnOverlayClick !== false;
    this.closeOnEscape = options.closeOnEscape !== false;
    this.onClose = options.onClose;
    this.onOpen = options.onOpen;

    this.overlay = null;
    this.modal = null;
    this.cleanupFns = [];
    this.previousActiveElement = null;
  }

  /**
   * Open the modal
   * @returns {Promise<void>}
   */
  open() {
    return new Promise((resolve) => {
      this.previousActiveElement = document.activeElement;

      // Create overlay
      this.overlay = createElement('div', {
        class: 'modal-overlay',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': this.title ? 'modal-title' : undefined,
      });

      // Create modal
      this.modal = createElement('div', { class: 'modal' });

      // Header
      if (this.title) {
        const header = createElement('div', { class: 'modal__header' });
        header.appendChild(createElement('h2', {
          id: 'modal-title',
          class: 'modal__title',
        }, this.title));

        const closeBtn = createElement('button', {
          class: 'modal__close',
          'aria-label': 'Close modal',
          onclick: () => this.close(),
        }, createElement('svg', {
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'aria-hidden': 'true',
        }, createElement('path', { d: 'M18 6L6 18M6 6l12 12' })));

        header.appendChild(closeBtn);
        this.modal.appendChild(header);
      }

      // Body
      const body = createElement('div', { class: 'modal__body' });
      if (typeof this.content === 'string') {
        body.innerHTML = this.content;
      } else if (this.content instanceof Node) {
        body.appendChild(this.content);
      }
      this.modal.appendChild(body);

      // Footer with actions
      if (this.actions.length > 0) {
        const footer = createElement('div', { class: 'modal__footer' });
        this.actions.forEach((action, index) => {
          const btn = createElement('button', {
            class: `btn ${action.variant || (action.primary ? 'btn--primary' : 'btn--secondary')}`,
            onclick: () => {
              if (action.handler) {
                const result = action.handler(this);
                if (result !== false) {
                  this.close();
                }
              } else {
                this.close();
              }
            },
          }, action.label);
          footer.appendChild(btn);
        });
        this.modal.appendChild(footer);
      }

      this.overlay.appendChild(this.modal);
      document.body.appendChild(this.overlay);

      // Force reflow for animation
      this.overlay.offsetHeight;

      // Open animation
      this.overlay.classList.add('modal-overlay--open');

      // Set up cleanup functions
      this.setupEventListeners();

      // Trap focus
      const releaseFocus = trapFocus(this.modal);
      this.cleanupFns.push(releaseFocus);

      // Call onOpen callback
      if (this.onOpen) {
        this.onOpen(this);
      }

      resolve();
    });
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Close on overlay click
    if (this.closeOnOverlayClick) {
      this.cleanupFns.push(
        onClickOutside(this.modal, () => this.close())
      );
    }

    // Close on Escape
    if (this.closeOnEscape) {
      this.cleanupFns.push(
        on(document, 'keydown', (e) => onEscape(e, () => this.close()))
      );
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close the modal
   * @returns {Promise<void>}
   */
  close() {
    return new Promise((resolve) => {
      if (!this.overlay) {
        resolve();
        return;
      }

      // Close animation
      this.overlay.classList.remove('modal-overlay--open');

      // Run cleanup
      this.cleanupFns.forEach(fn => fn());
      this.cleanupFns = [];

      // Restore body scroll
      document.body.style.overflow = '';

      // Wait for animation then remove
      setTimeout(() => {
        this.overlay?.remove();
        this.overlay = null;
        this.modal = null;

        // Restore focus
        if (this.previousActiveElement) {
          this.previousActiveElement.focus();
        }

        // Call onClose callback
        if (this.onClose) {
          this.onClose(this);
        }

        resolve();
      }, 200);
    });
  }

  /**
   * Update modal content
   * @param {string|Element} content - New content
   */
  setContent(content) {
    this.content = content;
    const body = this.modal?.querySelector('.modal__body');
    if (body) {
      if (typeof content === 'string') {
        body.innerHTML = content;
      } else if (content instanceof Node) {
        body.innerHTML = '';
        body.appendChild(content);
      }
    }
  }

  /**
   * Update modal title
   * @param {string} title - New title
   */
  setTitle(title) {
    this.title = title;
    const titleEl = this.modal?.querySelector('#modal-title');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }
}

/**
 * Confirmation modal helper
 * @param {Object} options
 * @param {string} options.title - Dialog title
 * @param {string} options.message - Confirmation message
 * @param {string} [options.confirmLabel='Confirm'] - Confirm button label
 * @param {string} [options.cancelLabel='Cancel'] - Cancel button label
 * @param {string} [options.variant='danger'] - 'danger' | 'primary' | 'secondary'
 * @returns {Promise<boolean>} - Resolves true if confirmed
 */
export function confirm(options) {
  return new Promise((resolve) => {
    const modal = new Modal({
      title: options.title,
      content: `<p style="color: var(--color-text); margin: 0;">${options.message}</p>`,
      actions: [
        {
          label: options.cancelLabel || 'Cancel',
          variant: 'btn--secondary',
          handler: () => resolve(false),
        },
        {
          label: options.confirmLabel || 'Confirm',
          variant: options.variant === 'danger' ? 'btn--primary' : `btn--${options.variant}`,
          primary: true,
          handler: () => resolve(true),
        },
      ],
    });
    modal.open();
  });
}

/**
 * Alert modal helper
 * @param {Object} options
 * @param {string} options.title - Dialog title
 * @param {string} options.message - Alert message
 * @param {string} [options.label='OK'] - Button label
 * @returns {Promise<void>}
 */
export function alert(options) {
  return new Promise((resolve) => {
    const modal = new Modal({
      title: options.title,
      content: `<p style="color: var(--color-text); margin: 0;">${options.message}</p>`,
      actions: [
        {
          label: options.label || 'OK',
          variant: 'btn--primary',
          primary: true,
          handler: () => resolve(),
        },
      ],
    });
    modal.open();
  });
}