/**
 * ReDeal — Authentication & Session Management
 * Handles user registration, login, session persistence, and demo bypass
 */

import { migrateLegacyFavorites } from '../utils/favorites.js';

const USER_KEY = 'redeal_user';
const SESSION_KEY = 'redeal_session';
const USERS_KEY = 'redeal_users';
const DEMO_EMAIL = 'demo@redeal.app';

/**
 * Generate a unique ID with prefix
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
function generateId(prefix = 'usr') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Generate a session token
 * @returns {string} Session token
 */
function generateToken() {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Get all registered users from localStorage
 * @returns {Array} Array of user objects
 */
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save users array to localStorage
 * @param {Array} users - Array of user objects
 */
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Get current logged-in user from localStorage
 * @returns {Object|null} User object or null
 */
export function getCurrentUser() {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Get current session from localStorage
 * @returns {Object|null} Session object or null
 */
export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Save session to localStorage
 * @param {Object} session - Session object
 */
function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Clear session and user from localStorage
 */
export function clearSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Validate session and restore user if valid
 * @returns {Object|null} User object if session valid, null otherwise
 */
export function restoreSession() {
  const session = getSession();
  if (!session) return null;

  // Check expiry
  if (new Date(session.expiresAt) < new Date()) {
    clearSession();
    return null;
  }

  // Verify user still exists
  const users = getUsers();
  const user = users.find(u => u.id === session.userId);
  if (!user) {
    clearSession();
    return null;
  }

  // Update lastLogin
  user.lastLogin = new Date().toISOString();
  saveUsers(users);

  // Save current user
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Migrate legacy favorites to user-scoped key
  migrateLegacyFavorites(user.id);

  // Dispatch auth:restore event
  window.dispatchEvent(new CustomEvent('auth:restore', { detail: { user } }));

  return user;
}

/**
 * Register a new user
 * @param {Object} params - Registration parameters
 * @param {string} params.email - User email
 * @param {string} params.password - User password (plain text for prototype)
 * @param {string} params.name - User full name
 * @returns {Object} { user, session }
 * @throws {Error} If email already exists
 */
export function registerUser({ email, password, name }) {
  const users = getUsers();

  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists');
  }

  // Reserve demo email
  if (email.toLowerCase() === DEMO_EMAIL) {
    throw new Error('This email is reserved');
  }

  // Create user
  const now = new Date().toISOString();
  const initials = name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const user = {
    id: generateId('usr'),
    email: email.toLowerCase(),
    password, // Plain text for prototype (no backend)
    name: name.trim(),
    initials,
    avatar: null,
    createdAt: now,
    lastLogin: now,
    isDemo: false,
  };

  users.push(user);
  saveUsers(users);

  // Create session (7 days default)
  const session = createSession(user.id, false);
  saveSession(session);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Migrate legacy favorites to user-scoped key
  migrateLegacyFavorites(user.id);

  // Dispatch auth:login event
  window.dispatchEvent(new CustomEvent('auth:login', { detail: { user, session } }));

  return { user, session };
}

/**
 * Login user with email and password
 * @param {Object} params - Login parameters
 * @param {string} params.email - User email
 * @param {string} params.password - User password
 * @param {boolean} params.rememberMe - Extend session to 30 days
 * @returns {Object} { user, session }
 * @throws {Error} If credentials invalid
 */
export function loginUser({ email, password, rememberMe = false }) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }

  // Update lastLogin
  user.lastLogin = new Date().toISOString();
  saveUsers(users);

  // Create session
  const session = createSession(user.id, rememberMe);
  saveSession(session);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Migrate legacy favorites to user-scoped key
  migrateLegacyFavorites(user.id);

  // Dispatch auth:login event
  window.dispatchEvent(new CustomEvent('auth:login', { detail: { user, session } }));

  return { user, session };
}

/**
 * Create a session object
 * @param {string} userId - User ID
 * @param {boolean} rememberMe - Extend to 30 days
 * @returns {Object} Session object
 */
function createSession(userId, rememberMe) {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 7));

  return {
    userId,
    token: generateToken(),
    expiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString(),
  };
}

/**
 * Logout current user
 */
export function logout() {
  clearSession();
  window.dispatchEvent(new CustomEvent('auth:logout', { detail: {} }));
}

/**
 * Update current user profile
 * @param {Object} partial - Partial user data to update
 * @returns {Object|null} Updated user or null if not logged in
 */
export function updateUser(partial) {
  const user = getCurrentUser();
  if (!user) return null;

  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index === -1) return null;

  // Don't allow updating email, password, id, createdAt via this method
  const { email, password, id, createdAt, ...allowed } = partial;
  const updatedUser = { ...user, ...allowed };

  // Regenerate initials if name changed
  if (allowed.name) {
    updatedUser.initials = allowed.name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  users[index] = updatedUser;
  saveUsers(users);
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

  return updatedUser;
}

/**
 * Demo bypass login - creates or returns demo user
 * @returns {Object} { user, session }
 */
export function demoLogin() {
  let users = getUsers();
  let demoUser = users.find(u => u.email === DEMO_EMAIL);

  if (!demoUser) {
    const now = new Date().toISOString();
    demoUser = {
      id: generateId('usr'),
      email: DEMO_EMAIL,
      password: 'demo-password', // Not used for demo login
      name: 'Guest User',
      initials: 'GU',
      avatar: null,
      createdAt: now,
      lastLogin: now,
      isDemo: true,
    };
    users.push(demoUser);
    saveUsers(users);
  }

  // Create session for demo user (7 days)
  const session = createSession(demoUser.id, false);
  saveSession(session);
  localStorage.setItem(USER_KEY, JSON.stringify(demoUser));

  // Migrate legacy favorites to user-scoped key
  migrateLegacyFavorites(demoUser.id);

  // Dispatch auth:login event
  window.dispatchEvent(new CustomEvent('auth:login', { detail: { user: demoUser, session } }));

  return { user: demoUser, session };
}

/**
 * Check if current user is demo user
 * @returns {boolean}
 */
export function isDemoUser() {
  const user = getCurrentUser();
  return user?.isDemo === true;
}

/**
 * Get redirect URL from sessionStorage (set by auth guard)
 * @returns {string|null} Redirect URL or null
 */
export function getRedirectUrl() {
  return sessionStorage.getItem('redeal_redirect_after_login');
}

/**
 * Set redirect URL in sessionStorage
 * @param {string} url - Redirect URL
 */
export function setRedirectUrl(url) {
  sessionStorage.setItem('redeal_redirect_after_login', url);
}

/**
 * Clear redirect URL
 */
export function clearRedirectUrl() {
  sessionStorage.removeItem('redeal_redirect_after_login');
}