# CHANGELOG.md

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial documentation system (AGENTS.md, CLAUDE.md, README.md, ARCHITECTURE.md, TODO.md, CHANGELOG.md)
- Claude Code rules (.claude/rules/html.md, .claude/rules/css.md, .claude/rules/javascript.md)
- Claude Code settings (.claude/settings.json)
- Git ignore configuration (.gitignore)
- **Electric Violet design system** — New brand identity with centralized design tokens in `css/variables.css`
- **Base project structure** — `index.html`, CSS foundation (`variables.css`, `main.css`, `components.css`), JS foundation (`main.js`, `utils/dom.js`, `utils/events.js`)
- **Core components** — Button, Card (ProductCard, FeatureCard), Modal with confirm/alert helpers in `js/components/`
- **Favicon assets** — favicon.svg, apple-touch-icon.svg, manifest.json, generate-favicons.html
- **Phase 1: Project Setup & Base Architecture** — Complete foundation with design system, component library, shared data layer
- **Phase 2: Product Detail Page** — Full product detail experience with gallery, product info, seller card, favorite toggle, Message Seller/Make Offer modals, share functionality, responsive design
- **Phase 2 Fixes (Luna Review 1-3)** — Resolved all Priority 0, 1, 2 conditions across 3 reviews
- **Phase 3: Create Listing** (closed 2026-11-05) — `create-listing.html` with validation, localStorage persistence, and Modal-based unsaved-changes confirm; new listings appear in Marketplace and Home
- **Phase 4: Authentication** (implemented 2026-11-05) — `login.html`, `signup.html`, session handling, route guards, header auth area, per-user favorites, profile page, "Continue as Guest" demo bypass. Browser verification for Phase 4 is not recorded in `IMPLEMENTATION_LOG.md`
- **Real product photos** (2026-11-05) — 15 local images in `assets/images/products/` replace SVG placeholders
- **Requests page** (2026-11-22) — `requests.html`, `js/pages/Requests.js`, `css/requests.css`: post-a-request form with validation, category filter chips, request search, sample requests
- **Messages page** (2026-11-22) — `messages.html`, `js/pages/Messages.js`, `css/messages.css`: conversation list with All/Unread tabs, chat thread, quick replies. Replies are simulated and stored only in the browser (prototype)
- **`tools/` folder** — favicon generator moved here as `generate-favicons.html`, `.css`, `.js`

### Changed
- **Deprecated orange branding** (`#BF4408`, `#E65103`, `#2563eb`, `#1d4ed8`) replaced with Electric Violet palette
- Updated all documentation and rules to enforce Electric Violet as the official design system
- **Hardcoded colors eliminated** — All CSS uses design tokens from `variables.css` (added `--color-on-primary`, `--color-success-bg`, `--color-warning-bg`, `--color-error-bg`, `--shadow-action-bar`, `--overlay-backdrop`)
- **PWA manifest routes** — Changed from absolute (`/marketplace`, `/sell`) to relative (`./marketplace.html`, `./sell.html`)
- **Modal handlers** — Fixed async regression causing double-close; alerts now sequence via `onClose` callback
- **Requests page layout** (2026-11-22) — `requests.html` was a standalone preview with `#` links; it now uses the shared header, skip link, bottom nav, footer, meta description and favicon/manifest links
- **Header logo removed from `messages.html`** — no page shows the logo now, so headers are consistent
- **`login.html` and `signup.html`** — added the `header__auth` container used by the other pages
- **Favicon generator** — moved to `tools/`; inline `onclick` and hardcoded colors removed (now uses tokens from `variables.css`); fixed blank canvas previews

### Fixed
- Homepage bottom nav `preventDefault()` blocking navigation
- Modal submit buttons not initially disabled
- Duplicate H1 in `product.html`
- Share/back buttons < 44×44px touch targets
- Favorites sync documentation corrected (same-document only)
- Gallery counter removed (single image per product)
- Missing PWA icons created (favicon.svg, apple-touch-icon.svg, manifest SVG icons)
- Missing thumbnail error handler added
- Native `prompt()`/`alert()` replaced with Modal component helpers
- Implementation log accuracy — all claims downgraded to "Manually Tested (unverified)" without browser evidence
- **`assets/manifest.json` paths** (2026-11-22) — icon, shortcut and `start_url` paths are now relative to the `assets/` folder; removes the 404 for `icon-192.svg` and the manifest warning in the console
- **"Product Not Found" on valid product URLs** (DEFERRED-1) — fixed via String coercion in product lookup (2026-11-05)

### Removed
- **`sell.html`** (2026-11-22) — redirect page deleted; the manifest shortcut now points to `create-listing.html`

---

## [1.0.0] - 2026-11-04

### Added
- Project initialization
- Initial README.md with project name

---

## Template for Future Releases

## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Now removed features

### Fixed
- Bug fixes

### Security
- Vulnerability fixes

---

*Do not fabricate historical changes. Only document actual changes as they happen.*
