/**
 * ReDeal — Requests Page Logic
 * Placeholder for future requests feature
 */

import { onReady } from '../utils/events.js';
import { initHeader, setCurrentPage } from '../components/Header.js';
import { requireAuth } from '../utils/auth-guard.js';
import { restoreSession } from '../data/auth.js';

/**
 * Initialize the requests page
 */
function init() {
  console.log('Requests page initialized');

  // Require authentication
  const user = requireAuth({ redirectTo: 'requests.html' });
  if (!user) {
    // Redirect handled by requireAuth
    return;
  }

  // Restore session and init header
  restoreSession();
  initHeader({});
  setCurrentPage('requests');

  // Listen for auth changes
  window.addEventListener('auth:login', () => {
    initHeader({});
    setCurrentPage('requests');
  });
  window.addEventListener('auth:logout', () => {
    initHeader({});
    setCurrentPage('requests');
  });
  window.addEventListener('auth:restore', () => {
    initHeader({});
    setCurrentPage('requests');
  });
}

onReady(init);