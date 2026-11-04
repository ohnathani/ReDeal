/**
 * ReDeal — User Menu Dropdown Component
 * Avatar-triggered dropdown with user actions
 */

import { $, $$, createElement, escapeHtml } from '../utils/dom.js';
import { onReady, delegate, trapFocus } from '../utils/events.js';
import { logout, isDemoUser, getCurrentUser } from '../data/auth.js';

let currentMenu = null;

/**
 * Create and initialize user menu
 * @param {Object} options
 * @param {HTMLElement} options.trigger - Trigger element (avatar button)
 * @returns {Object} Menu controller
 */
export function createUserMenu({ trigger }) {
  let dropdown = null;
  let isOpen = false;
  let focusTrap = null;

  const user = getCurrentUser();
  if (!user) return null;

  // Create dropdown element
  function createDropdown() {
    const isDemo = user.isDemo === true;

    dropdown = createElement('div', {
      class: 'user-menu__dropdown',
      role: 'menu',
      'aria-orientation': 'vertical',
    }, [
      // User info header
      createElement('div', { class: 'user-menu__header' }, [
        createElement('div', { class: 'user-menu__avatar' }, [
          createElement('div', { class: 'avatar avatar--md', 'aria-hidden': 'true' }, user.initials),
        ]),
        createElement('div', { class: 'user-menu__user-info' }, [
          createElement('div', { class: 'user-menu__name' }, escapeHtml(user.name)),
          createElement('div', { class: 'user-menu__email' }, escapeHtml(user.email)),
          ...(isDemo ? [
            createElement('span', { class: 'badge badge--guest' }, 'Guest Mode'),
          ] : []),
        ]),
      ]),

      // Divider
      createElement('div', { class: 'user-menu__divider', role: 'separator' }),

      // Menu items
      createMenuItem('My Listings', 'profile.html', 'list'),
      createMenuItem('Favorites', 'profile.html#favorites', 'heart'),
      createMenuItem('Settings', 'profile.html#settings', 'settings'),

      // Divider
      createElement('div', { class: 'user-menu__divider', role: 'separator' }),

      // Logout
      createElement('button', {
        class: 'user-menu__item user-menu__item--destructive',
        role: 'menuitem',
        'data-action': 'logout',
      }, [
        createElement('svg', { class: 'user-menu__icon', 'aria-hidden': 'true', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
          createElement('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
          createElement('path', { d: 'M16 17l5-5-5-5' }),
          createElement('path', { d: 'M21 12H9' }),
        ]),
        'Log Out',
      ]),
    ]);

    document.body.appendChild(dropdown);

    // Attach click handler to dropdown AFTER it's created
    dropdown.addEventListener('click', handleMenuClick);

    positionDropdown();
  }

  function createMenuItem(label, href, iconName) {
    const icons = {
      list: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
      heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
      settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    };

    return createElement('a', {
      class: 'user-menu__item',
      href,
      role: 'menuitem',
    }, [
      createElement('svg', { class: 'user-menu__icon', 'aria-hidden': 'true', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, icons[iconName] || ''),
      label,
    ]);
  }

  function positionDropdown() {
    if (!dropdown || !trigger) return;

    const rect = trigger.getBoundingClientRect();
    const dropdownWidth = 280; // approximate
    const viewportWidth = window.innerWidth;

    // Right-align dropdown, keep within viewport
    let left = rect.right - dropdownWidth;
    if (left < 12) left = 12;
    if (left + dropdownWidth > viewportWidth - 12) {
      left = viewportWidth - dropdownWidth - 12;
    }

    dropdown.style.left = `${left}px`;
    dropdown.style.top = `${rect.bottom + 8}px`;
  }

  function open() {
    if (isOpen || !trigger) return;

    if (!dropdown) createDropdown();

    isOpen = true;
    dropdown.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');

    // Position and show with animation
    requestAnimationFrame(() => {
      positionDropdown();
      dropdown.classList.add('user-menu__dropdown--open');
    });

    // Trap focus
    focusTrap = trapFocus(dropdown);

    // Close on outside click
    document.addEventListener('click', handleOutsideClick, { capture: true });
    document.addEventListener('keydown', handleKeydown);

    // Reposition on scroll/resize
    window.addEventListener('scroll', positionDropdown, { passive: true });
    window.addEventListener('resize', positionDropdown, { passive: true });
  }

  function close() {
    if (!isOpen) return;

    isOpen = false;
    trigger.setAttribute('aria-expanded', 'false');

    if (dropdown) {
      dropdown.classList.remove('user-menu__dropdown--open');
      setTimeout(() => {
        if (!isOpen && dropdown) dropdown.hidden = true;
      }, 200);
    }

    if (focusTrap) {
      focusTrap();
      focusTrap = null;
    }

    document.removeEventListener('click', handleOutsideClick, { capture: true });
    document.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('scroll', positionDropdown);
    window.removeEventListener('resize', positionDropdown);
  }

  function toggle() {
    if (isOpen) close();
    else open();
  }

  function handleOutsideClick(e) {
    if (dropdown && !dropdown.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) {
      close();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      close();
      trigger.focus();
    } else if (e.key === 'Tab' && dropdown) {
      // Let trapFocus handle tab cycling
    }
  }

  function handleMenuClick(e) {
    const item = e.target.closest('.user-menu__item');
    if (!item) return;

    const action = item.dataset.action;
    if (action === 'logout') {
      e.preventDefault();
      close();
      handleLogout();
    }
    // Links (My Listings, Favorites, Settings) navigate normally
  }

  function handleLogout() {
    logout();
    // auth:logout event will trigger header update
    window.location.href = 'index.html';
  }

  // Attach click handler to trigger
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    toggle();
  });

  // Listen for auth changes to close menu
  window.addEventListener('auth:logout', close);
  window.addEventListener('auth:login', close);

  return {
    open,
    close,
    toggle,
    destroy() {
      close();
      dropdown?.remove();
      dropdown = null;
    },
  };
}

/**
 * Initialize user menu from trigger element
 * @param {string} triggerSelector - Selector for trigger button
 * @returns {Object|null} Menu controller
 */
export function initUserMenu(triggerSelector = '[data-user-menu-trigger]') {
  const trigger = $(triggerSelector);
  if (!trigger) return null;

  return createUserMenu({ trigger });
}