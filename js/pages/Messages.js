/**
 * ReDeal — Messages Page Logic
 * Placeholder for future messages feature
 */

import { onReady } from '../utils/events.js';
import { initHeader, setCurrentPage } from '../components/Header.js';
import { requireAuth } from '../utils/auth-guard.js';
import { restoreSession } from '../data/auth.js';

/**
 * Initialize the messages page
 */
function init() {
  console.log('Messages page initialized');

  // Require authentication
  const user = requireAuth({ redirectTo: 'messages.html' });
  if (!user) {
    // Redirect handled by requireAuth
    return;
  }

  // Restore session and init header
  restoreSession();
  initHeader({});
  setCurrentPage('messages');

  // Listen for auth changes
  window.addEventListener('auth:login', () => {
    initHeader({});
    setCurrentPage('messages');
  });
  window.addEventListener('auth:logout', () => {
    initHeader({});
    setCurrentPage('messages');
  });
  window.addEventListener('auth:restore', () => {
    initHeader({});
    setCurrentPage('messages');
  });
}

onReady(init);