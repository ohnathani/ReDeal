# Phase 4: Authentication Architecture Plan

**Status**: PLANNING ONLY — No implementation yet  
**Context**: Phase 3 (Create Listing) CLOSED and browser-verified. Phase 4 introduces authentication.

---

## 1. Executive Summary

This document defines the complete architecture for Phase 4: Authentication System. Scope includes:
- Login page (`login.html`)
- Signup page (`signup.html`)
- User data model and localStorage persistence
- Session management (login, logout, session restore)
- Route guards (protect create-listing, profile, messages, requests)
- Header integration (user avatar dropdown, auth state)
- Demo bypass (one-click "Continue as Guest" for prototype evaluation)

**Constraints**: Vanilla ES6+, no frameworks, no build tools, no backend. All persistence via localStorage. Design system: Electric Violet (`css/variables.css` tokens only).

---

## 2. User Data Model

### 2.1 localStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `redeal_user` | Object | Current logged-in user profile |
| `redeal_session` | String | Session token (simple UUID) |
| `redeal_users` | Array | All registered users (email as unique key) |

### 2.2 User Object Schema

```javascript
{
  id: 'usr_abc123',           // Unique user ID
  email: 'user@example.com',  // Unique, used for login
  name: 'John Doe',           // Display name
  initials: 'JD',             // Auto-generated from name
  avatar: null,               // Future: image URL or data URI
  createdAt: '2026-11-05T10:00:00Z',
  lastLogin: '2026-11-05T10:00:00Z',
  isDemo: false               // True for demo bypass user
}
```

### 2.3 Session Object Schema

```javascript
{
  userId: 'usr_abc123',
  token: 'sess_xyz789',       // Simple random string
  expiresAt: '2026-11-12T10:00:00Z', // 7 days
  createdAt: '2026-11-05T10:00:00Z'
}
```

### 2.4 Storage Module (`js/data/auth.js`)

New file. Exports:
- `registerUser({ email, password, name })` → `{ user, session }` or throws
- `loginUser({ email, password })` → `{ user, session }` or throws
- `logout()` → void
- `getCurrentUser()` → user object or null
- `restoreSession()` → user object or null (validates token + expiry)
- `updateUser(partial)` → updated user
- `demoLogin()` → `{ user, session }` (creates/returns demo user)

---

## 3. Pages

### 3.1 `login.html`
- Email input (type=email, required, autocomplete="email")
- Password input (type=password, required, autocomplete="current-password")
- "Remember me" checkbox (extends session to 30 days)
- "Forgot password?" link (placeholder — shows alert)
- Submit button (primary, disabled until valid)
- Link to signup page
- Demo bypass button (secondary, "Continue as Guest")
- Accessible: labels, aria-describedby for errors, focus management

### 3.2 `signup.html`
- Full name input (required, autocomplete="name")
- Email input (required, type=email, autocomplete="email")
- Password input (required, minlength=8, autocomplete="new-password")
- Confirm password input (required, matches password)
- Terms checkbox (required)
- Submit button (primary, disabled until all valid)
- Link to login page
- Demo bypass button (secondary, "Continue as Guest")
- Password strength indicator (optional, visual only)
- Accessible: same as login

### 3.3 Shared Layout
- Header with logo + back button (links to homepage)
- Centered card (max-width 400px)
- Footer with bottom nav (same as other pages)

---

## 4. Session Management

### 4.1 Login Flow
1. User submits valid credentials
2. `auth.js` validates against `redeal_users`
3. Generate session token + expiry (7 days default, 30 if "remember me")
4. Save session to `redeal_session`, user to `redeal_user`
5. Dispatch `auth:login` CustomEvent with user detail
6. Redirect to intended destination (or homepage)

### 4.2 Signup Flow
1. User submits valid registration
2. Check email not in `redeal_users`
3. Create user object, add to `redeal_users`
4. Auto-login: generate session, save, dispatch `auth:login`
5. Redirect to intended destination

### 4.3 Session Restore (on every page load)
1. Read `redeal_session` from localStorage
2. Validate token exists, not expired, user exists in `redeal_users`
3. If valid: load user into `redeal_user`, dispatch `auth:restore`
4. If invalid: clear stale data, dispatch `auth:logout`

### 4.4 Logout Flow
1. Clear `redeal_user` and `redeal_session`
2. Dispatch `auth:logout` CustomEvent
3. Redirect to homepage

### 4.5 Demo Bypass
- One-click "Continue as Guest" button on login/signup
- Creates/returns a persistent demo user (`demo@redeal.app`)
- Sets `isDemo: true` on user object
- Full session created (persists across reloads)
- Header shows "Guest" badge; Profile page shows demo notice

---

## 5. Route Guards

### 5.1 Protected Routes
| Route | Auth Required | Redirect If Unauthenticated |
|-------|---------------|------------------------------|
| `create-listing.html` | Yes | `login.html?redirect=create-listing.html` |
| `profile.html` | Yes | `login.html?redirect=profile.html` |
| `messages.html` | Yes | `login.html?redirect=messages.html` |
| `requests.html` | Yes | `login.html?redirect=requests.html` |

### 5.2 Public Routes (No Guard)
- `index.html`
- `marketplace.html`
- `product.html`
- `login.html`
- `signup.html`

### 5.3 Guard Implementation
- New utility: `js/utils/auth-guard.js`
- Export `requireAuth({ redirectTo })` — call at top of protected page modules
- Reads `redirect` query param, stores in sessionStorage for post-login redirect
- If no valid session: `window.location.href = login.html?redirect=...`
- If valid: returns user object, page continues initialization

### 5.4 Integration in Page Scripts
```javascript
// js/pages/CreateListing.js (top of init)
import { requireAuth } from '../utils/auth-guard.js';

function init() {
  const user = requireAuth({ redirectTo: 'create-listing.html' });
  if (!user) return; // Guard handled redirect
  // ... rest of init
}
```

---

## 6. Header Integration

### 6.1 Auth States
| State | Header Right Side |
|-------|-------------------|
| Unauthenticated | "Log In" (ghost) + "Sign Up" (primary) buttons |
| Authenticated | User avatar dropdown: Name, "My Listings", "Favorites", "Settings", "Log Out" |
| Demo User | Same as authenticated + "Guest" badge |

### 6.2 Avatar Dropdown Component
- New component: `js/components/UserMenu.js`
- Trigger: avatar button (44×44px touch target)
- Dropdown: positioned via CSS, closes on outside click/ESC
- Items: router links (no full reload) or anchor navigation
- "Log Out" button: calls `logout()`, dispatches `auth:logout`

### 6.3 Header Update Logic
- `js/components/Header.js` (new) or extend `js/main.js`
- Listen for `auth:login`, `auth:logout`, `auth:restore`
- Re-render auth section on auth state change
- Initialize on DOM ready: call `restoreSession()`, render accordingly

### 6.4 Bottom Nav Profile Link
- Always visible
- If unauthenticated: links to `login.html?redirect=profile.html`
- If authenticated: links to `profile.html`

---

## 7. Profile Page (`profile.html`)

### 7.1 Structure (Authenticated)
- User avatar + name + email
- "Guest Mode" badge if `isDemo`
- Stats: Listings, Favorites, Reviews (placeholders)
- Sections: "My Listings", "Favorites", "Settings"
- Each section: link to future pages + empty state for now

### 7.2 Structure (Unauthenticated)
- Redirect handled by route guard → login page

### 7.3 Settings Section
- Change name (input + save)
- Change password (current + new + confirm) — placeholder
- Delete account (destructive, confirmation modal) — placeholder
- "Log Out" button (secondary, full width)

---

## 8. Created Listings Ownership

### 8.1 Data Model Update
- `js/data/storage.js`: Created products get `sellerId` field (user.id)
- `getCreatedProducts()` filters by current user (or returns all for admin view)

### 8.2 Create Listing Integration
- `CreateListing.js` reads current user from `auth.js`
- New product object includes `sellerId`, `sellerName`, `sellerInitials` from user
- Demo user: sellerName = "Guest User", initials = "GU"

### 8.3 Marketplace/Product Detail
- `ProductCard` and `ProductDetail` show seller from product data (unchanged)
- "My Listings" on profile filters by `sellerId === currentUser.id`

---

## 9. Favorites Per-User

### 9.1 Data Model Update
- `favorites.js`: Storage key becomes `redeal_favorites_${userId}`
- `getFavorites()`, `setFavorites()`, `toggleFavorite()` accept optional userId
- On auth change: re-initialize favorites for new user

### 9.2 Migration
- On first login after Phase 4: migrate legacy `redeal_favorites` to user-scoped key

---

## 10. CSS Additions

### 10.1 New Tokens (in `css/variables.css`)
```css
/* Auth-specific */
--color-guest-badge: var(--color-accent-yellow);
--color-guest-badge-text: var(--color-warning);
```

### 10.2 New Components (in `css/components.css`)
```css
/* User Menu Dropdown */
.user-menu { position: relative; }
.user-menu__trigger { /* avatar button */ }
.user-menu__dropdown { /* absolute, right-aligned, shadow, radius */ }
.user-menu__item { /* padding, hover: lavender-soft */ }
.user-menu__divider { /* border-top */ }
.user-menu__item--destructive { color: var(--color-error); }

/* Auth Forms */
.auth-card { max-width: 400px; margin: auto; }
.auth-form .form-group { margin-bottom: var(--space-lg); }
.auth-form .form-actions { margin-top: var(--space-xl); }
.demo-bypass { /* secondary button styling */ }

/* Profile Page */
.profile-header { /* avatar, name, email, badge */ }
.profile-stats { /* grid of stat cards */ }
.profile-section { /* card with title + list */ }
```

### 10.3 Page-Specific CSS
- `css/login.css` — login page layout
- `css/signup.css` — signup page layout
- `css/profile.css` — profile page layout

---

## 11. JavaScript File Map

### 11.1 New Files
| File | Purpose |
|------|---------|
| `js/data/auth.js` | User/session persistence, auth operations |
| `js/utils/auth-guard.js` | Route guard utility |
| `js/components/Header.js` | Header component with auth state |
| `js/components/UserMenu.js` | Avatar dropdown component |
| `js/pages/Login.js` | Login page logic |
| `js/pages/Signup.js` | Signup page logic |
| `js/pages/Profile.js` | Profile page logic |
| `css/login.css` | Login page styles |
| `css/signup.css` | Signup page styles |
| `css/profile.css` | Profile page styles |
| `login.html` | Login page |
| `signup.html` | Signup page |

### 11.2 Modified Files
| File | Changes |
|------|---------|
| `js/main.js` | Import Header, initialize auth restore, listen for auth events |
| `js/data/storage.js` | Add `sellerId` to created products, filter by user |
| `js/utils/favorites.js` | User-scoped storage keys, migration |
| `js/pages/CreateListing.js` | Read current user for seller info, requireAuth guard |
| `js/pages/ProductDetail.js` | No change (reads seller from product data) |
| `js/components/Card.js` | No change |
| `index.html` | Update header to use Header component |
| `marketplace.html` | Update header |
| `product.html` | Update header |
| `requests.html` | Update header + add auth guard |
| `messages.html` | Update header + add auth guard |
| `profile.html` | Update header + add auth guard + Profile.js |
| `create-listing.html` | Update header + add auth guard |

---

## 12. Event Contract

| Event | Detail | Dispatched By | Listened By |
|-------|--------|---------------|-------------|
| `auth:login` | `{ user, session }` | `auth.js` | Header, pages needing user |
| `auth:logout` | `{}` | `auth.js` | Header, pages needing cleanup |
| `auth:restore` | `{ user }` | `auth.js` (on load) | Header, pages initializing |
| `favorites:changed` | `{ id, isFavorite, userId }` | `favorites.js` | ProductCard, ProductDetail |

---

## 13. Verification Checklist (Browser Tests)

### 13.1 Login Page
- [ ] Loads at `/login.html`
- [ ] Email/password validation works
- [ ] Submit disabled until valid
- [ ] Valid credentials → redirect to homepage (or `?redirect=`)
- [ ] Invalid credentials → error message
- [ ] "Remember me" extends session
- [ ] "Forgot password" shows alert
- [ ] Link to signup works
- [ ] Demo bypass creates session + redirects
- [ ] Keyboard accessible

### 13.2 Signup Page
- [ ] Loads at `/signup.html`
- [ ] All field validation works (name, email, password, confirm, terms)
- [ ] Password mismatch shows error
- [ ] Duplicate email shows error
- [ ] Valid submission → auto-login + redirect
- [ ] Link to login works
- [ ] Demo bypass works
- [ ] Keyboard accessible

### 13.3 Session Management
- [ ] Reload page → session restored (user persists)
- [ ] Expired session → cleared, treated as logged out
- [ ] Logout → clears session, redirects to homepage
- [ ] Demo user persists across reloads

### 13.4 Route Guards
- [ ] Access `create-listing.html` unauthenticated → redirects to login with `?redirect=`
- [ ] Access `profile.html` unauthenticated → redirects to login with `?redirect=`
- [ ] Access `messages.html` unauthenticated → redirects to login with `?redirect=`
- [ ] Access `requests.html` unauthenticated → redirects to login with `?redirect=`
- [ ] After login via redirect → lands on intended page
- [ ] Public pages accessible without auth

### 13.5 Header Integration
- [ ] Unauthenticated: shows "Log In" + "Sign Up"
- [ ] Authenticated: shows avatar dropdown with name, links, logout
- [ ] Dropdown: opens on click, closes on outside click/ESC
- [ ] Logout button works
- [ ] Demo user: shows "Guest" badge

### 13.6 Profile Page
- [ ] Authenticated: shows user info, stats placeholders, sections
- [ ] Demo user: shows "Guest Mode" badge
- [ ] Settings: change name works (persists)
- [ ] Logout from profile works

### 13.7 Created Listings Ownership
- [ ] Create listing while logged in → product has `sellerId`
- [ ] "My Listings" on profile shows only user's listings
- [ ] Marketplace shows all listings (including user's)
- [ ] Product detail shows correct seller name

### 13.8 Favorites Per-User
- [ ] Favorite items persist per user
- [ ] Switch users → favorites reset to new user's
- [ ] Legacy favorites migrated on first login

### 13.9 Cross-Cutting
- [ ] Zero console errors on all pages
- [ ] HTML validation passes (W3C)
- [ ] Responsive at 375px, 768px, 1200px
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Touch targets ≥ 44×44px
- [ ] Design tokens only (no hardcoded colors)

---

## 14. Implementation Sequence

| Milestone | Deliverable |
|-----------|-------------|
| **M1** | `js/data/auth.js` + `login.html` + `css/login.css` + `js/pages/Login.js` |
| **M2** | `signup.html` + `css/signup.css` + `js/pages/Signup.js` |
| **M3** | `js/utils/auth-guard.js` + integrate guards into protected pages |
| **M4** | `js/components/Header.js` + `js/components/UserMenu.js` + header integration |
| **M5** | `profile.html` + `css/profile.css` + `js/pages/Profile.js` |
| **M6** | `js/data/storage.js` (sellerId) + `js/utils/favorites.js` (per-user) + CreateListing integration |
| **M7** | Demo bypass, polish, browser verification (all 13.1-13.9 tests) |

Each milestone is independently committable and browser-testable.

---

## 15. Open Questions for Product Owner

1. **Password hashing**: No backend = plain text in localStorage. Acceptable for prototype? (Alternative: simple client-side hash like SHA-256 for obscurity)
2. **Email verification**: Skip for prototype? (No email sending capability)
3. **Session expiry**: 7 days default, 30 days "remember me" — acceptable?
4. **Demo user persistence**: Should demo user data persist across browser sessions? (Current plan: yes)
5. **Avatar images**: Phase 4 uses initials only. File upload for avatars deferred to Phase 5+?
6. **Profile "Settings"**: Only "Change name" implemented in Phase 4. Password change, delete account = placeholders?
7. **Redirect after login**: Always honor `?redirect=` or only for protected routes?
8. **Cross-tab auth sync**: `storage` event listener for logout/login in other tabs? (Nice to have, not required)

---

## 16. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Circular dependency: `auth.js` ↔ `storage.js` ↔ `favorites.js` | `auth.js` imports nothing from storage/favorites. Storage/favorites import auth for current user. One-way. |
| Session token in localStorage visible to XSS | No user input rendered unsanitized; `escapeHtml` used everywhere. CSP headers on deploy. |
| Demo user collides with real signup | Demo email `demo@redeal.app` reserved; signup rejects this email. |
| Route guard runs before DOM ready | Guard at module top level (before `onReady`), synchronous check. |
| Favorites migration loses data | Migration copies legacy `redeal_favorites` to user-scoped key only if user-scoped empty. |
| Header flash on auth state change | Header renders initial state from `restoreSession()` synchronously before paint. |

---

## 17. Appendix: File Templates

### 17.1 `login.html` Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Log In — ReDeal</title>
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/login.css">
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <header class="header" role="banner">...</header>
  <main id="main" class="main auth-main" role="main">
    <div class="auth-card">
      <header class="auth-card__header">
        <a href="index.html" class="auth-card__back">...</a>
        <h1 class="auth-card__title">Welcome back</h1>
        <p class="auth-card__subtitle">Log in to your ReDeal account</p>
      </header>
      <form id="login-form" class="auth-form" novalidate>...</form>
      <div class="auth-card__footer">
        <p>Don't have an account? <a href="signup.html">Sign up</a></p>
        <button type="button" class="btn btn--secondary btn--block demo-bypass">Continue as Guest</button>
      </div>
    </div>
  </main>
  <footer class="footer">...</footer>
  <script type="module" src="js/pages/Login.js"></script>
</body>
</html>
```

### 17.2 `js/data/auth.js` Skeleton
```javascript
const USER_KEY = 'redeal_user';
const SESSION_KEY = 'redeal_session';
const USERS_KEY = 'redeal_users';
const DEMO_EMAIL = 'demo@redeal.app';

function generateId(prefix = 'usr') { return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`; }
function generateToken() { return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`; }

export function getUsers() { /* ... */ }
export function saveUsers(users) { /* ... */ }
export function getCurrentUser() { /* ... */ }
export function getSession() { /* ... */ }
export function saveSession(session) { /* ... */ }
export function clearSession() { /* ... */ }
export function restoreSession() { /* validate token, expiry, user exists */ }
export function registerUser({ email, password, name }) { /* ... */ }
export function loginUser({ email, password, rememberMe }) { /* ... */ }
export function logout() { /* ... */ }
export function updateUser(partial) { /* ... */ }
export function demoLogin() { /* get or create demo user, create session */ }
```

---

*End of Phase 4 Architecture Plan. Ready for review and approval before implementation begins.*