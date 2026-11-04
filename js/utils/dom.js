/**
 * ReDeal — DOM Utilities
 * Helper functions for DOM manipulation
 */

/**
 * Query selector shorthand
 * @param {string} selector - CSS selector
 * @param {Element|Document} [context=document] - Context to search in
 * @returns {Element|null}
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Query selector all shorthand
 * @param {string} selector - CSS selector
 * @param {Element|Document} [context=document] - Context to search in
 * @returns {Element[]}
 */
export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/**
 * Create an element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} [attributes={}] - Attributes to set
 * @param {...(string|Node)} children - Child nodes or text content
 * @returns {Element}
 */
export function createElement(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.assign(element.dataset, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'html') {
      element.innerHTML = value;
    } else {
      element.setAttribute(key, value);
    }
  });

  children.flat().forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });

  return element;
}

/**
 * Set multiple attributes on an element
 * @param {Element} element - Target element
 * @param {Object} attributes - Attributes to set
 */
export function setAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.assign(element.dataset, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
}

/**
 * Toggle a class on an element
 * @param {Element} element - Target element
 * @param {string} className - Class to toggle
 * @param {boolean} [force] - Force add/remove
 * @returns {boolean} - Whether class is now present
 */
export function toggleClass(element, className, force) {
  return element.classList.toggle(className, force);
}

/**
 * Add class(es) to an element
 * @param {Element} element - Target element
 * @param {...string} classNames - Classes to add
 */
export function addClass(element, ...classNames) {
  element.classList.add(...classNames);
}

/**
 * Remove class(es) from an element
 * @param {Element} element - Target element
 * @param {...string} classNames - Classes to remove
 */
export function removeClass(element, ...classNames) {
  element.classList.remove(...classNames);
}

/**
 * Check if element has a class
 * @param {Element} element - Target element
 * @param {string} className - Class to check
 * @returns {boolean}
 */
export function hasClass(element, className) {
  return element.classList.contains(className);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string}
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Safely set HTML content (sanitizes if needed)
 * @param {Element} element - Target element
 * @param {string} html - HTML string
 */
export function setHtml(element, html) {
  element.innerHTML = html;
}

/**
 * Remove all children from an element
 * @param {Element} element - Target element
 */
export function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Insert element after another element
 * @param {Element} newElement - Element to insert
 * @param {Element} referenceElement - Element to insert after
 */
export function insertAfter(newElement, referenceElement) {
  referenceElement.parentNode?.insertBefore(newElement, referenceElement.nextSibling);
}

/**
 * Get closest parent matching selector
 * @param {Element} element - Starting element
 * @param {string} selector - CSS selector
 * @returns {Element|null}
 */
export function closest(element, selector) {
  return element.closest(selector);
}

/**
 * Get element's index among siblings
 * @param {Element} element - Target element
 * @returns {number}
 */
export function getIndex(element) {
  return Array.from(element.parentNode?.children || []).indexOf(element);
}

/**
 * Check if element is visible
 * @param {Element} element - Target element
 * @returns {boolean}
 */
export function isVisible(element) {
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}

/**
 * Get element's computed style value
 * @param {Element} element - Target element
 * @param {string} property - CSS property
 * @returns {string}
 */
export function getStyle(element, property) {
  return getComputedStyle(element).getPropertyValue(property);
}

/**
 * Set CSS custom property on element
 * @param {Element} element - Target element
 * @param {string} property - Property name (e.g., '--color-primary')
 * @param {string} value - Property value
 */
export function setCssVar(element, property, value) {
  element.style.setProperty(property, value);
}

/**
 * Get CSS custom property value
 * @param {Element} element - Target element (or document.documentElement for global)
 * @param {string} property - Property name (e.g., '--color-primary')
 * @returns {string}
 */
export function getCssVar(element, property) {
  return getComputedStyle(element).getPropertyValue(property).trim();
}