/**
 * ReDeal — Event Utilities
 * Helper functions for event handling
 */

/**
 * Event delegation helper
 * @param {Element} parent - Parent element to delegate to
 * @param {string} selector - Selector for target elements
 * @param {string} eventType - Event type (e.g., 'click')
 * @param {Function} handler - Event handler (receives event and matched target)
 * @returns {Function} - Cleanup function to remove listener
 */
export function delegate(parent, selector, eventType, handler) {
  const listener = (event) => {
    const target = event.target.closest(selector);
    if (target && parent.contains(target)) {
      handler.call(target, event, target);
    }
  };

  parent.addEventListener(eventType, listener);

  return () => parent.removeEventListener(eventType, listener);
}

/**
 * Run callback when DOM is ready
 * @param {Function} fn - Callback function
 */
export function onReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  }
}

/**
 * Debounce function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} - Debounced function with cancel method
 */
export function debounce(fn, delay) {
  let timeoutId;
  const debouncedFn = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
  debouncedFn.cancel = () => {
    clearTimeout(timeoutId);
  };
  return debouncedFn;
}

/**
 * Throttle function
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {Function} - Throttled function
 */
export function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Add event listener with automatic cleanup
 * @param {Element} element - Target element
 * @param {string} eventType - Event type
 * @param {Function} handler - Event handler
 * @param {Object} [options] - Event options
 * @returns {Function} - Cleanup function
 */
export function on(element, eventType, handler, options) {
  element.addEventListener(eventType, handler, options);
  return () => element.removeEventListener(eventType, handler, options);
}

/**
 * Add one-time event listener
 * @param {Element} element - Target element
 * @param {string} eventType - Event type
 * @param {Function} handler - Event handler
 * @param {Object} [options] - Event options
 */
export function once(element, eventType, handler, options) {
  element.addEventListener(eventType, handler, { ...options, once: true });
}

/**
 * Dispatch custom event
 * @param {Element} element - Target element
 * @param {string} eventName - Event name
 * @param {*} detail - Event detail
 * @param {Object} [options] - Event options
 * @returns {boolean} - Whether event was not cancelled
 */
export function emit(element, eventName, detail, options = {}) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  return element.dispatchEvent(event);
}

/**
 * Wait for event on element
 * @param {Element} element - Target element
 * @param {string} eventType - Event type
 * @param {Object} [options] - Event options
 * @returns {Promise<Event>} - Resolves with event
 */
export function waitForEvent(element, eventType, options = {}) {
  return new Promise((resolve) => {
    const handler = (event) => {
      element.removeEventListener(eventType, handler, options);
      resolve(event);
    };
    element.addEventListener(eventType, handler, options);
  });
}

/**
 * Handle keyboard navigation for focusable elements
 * @param {Element} container - Container element
 * @param {Object} options - Options
 * @param {string} [options.selector] - Focusable elements selector
 * @param {boolean} [options.loop=true] - Loop navigation
 * @returns {Function} - Cleanup function
 */
export function trapFocus(container, options = {}) {
  const { selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', loop = true } = options;

  const focusableElements = Array.from(container.querySelectorAll(selector)).filter(el => isVisible(el));
  if (focusableElements.length === 0) return () => {};

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handler = (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        if (loop) lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        if (loop) firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handler);
  firstElement.focus();

  return () => {
    container.removeEventListener('keydown', handler);
  };
}

/**
 * Check if element is visible
 * @param {Element} element
 * @returns {boolean}
 */
function isVisible(element) {
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}

/**
 * Click outside handler
 * @param {Element} element - Element to watch
 * @param {Function} handler - Handler when clicked outside
 * @returns {Function} - Cleanup function
 */
export function onClickOutside(element, handler) {
  const listener = (event) => {
    if (!element.contains(event.target)) {
      handler(event);
    }
  };

  // Use mousedown to catch before click
  document.addEventListener('mousedown', listener);

  return () => document.removeEventListener('mousedown', listener);
}

/**
 * Keyboard event helpers
 */
export const keys = {
  enter: 'Enter',
  escape: 'Escape',
  tab: 'Tab',
  space: ' ',
  arrowUp: 'ArrowUp',
  arrowDown: 'ArrowDown',
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
  home: 'Home',
  end: 'End',
};

/**
 * Check if key matches
 * @param {KeyboardEvent} event
 * @param {string|string[]} key - Key or keys to match
 * @returns {boolean}
 */
export function isKey(event, key) {
  const keysToCheck = Array.isArray(key) ? key : [key];
  return keysToCheck.includes(event.key);
}

/**
 * Handle escape key
 * @param {KeyboardEvent} event
 * @param {Function} handler
 */
export function onEscape(event, handler) {
  if (event.key === keys.escape) {
    handler(event);
  }
}

/**
 * Handle enter/space for button-like elements
 * @param {KeyboardEvent} event
 * @param {Function} handler
 */
export function onActivate(event, handler) {
  if (event.key === keys.enter || event.key === keys.space) {
    event.preventDefault();
    handler(event);
  }
}