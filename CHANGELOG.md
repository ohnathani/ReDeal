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

### Changed
- **Deprecated orange branding** (`#BF4408`, `#E65103`, `#2563eb`, `#1d4ed8`) replaced with Electric Violet palette
- Updated all documentation and rules to enforce Electric Violet as the official design system
- **Hardcoded colors eliminated** — All CSS uses design tokens from `variables.css` (added `--color-on-primary`, `--color-success-bg`, `--color-warning-bg`, `--color-error-bg`, `--shadow-action-bar`, `--overlay-backdrop`)
- **PWA manifest routes** — Changed from absolute (`/marketplace`, `/sell`) to relative (`./marketplace.html`, `./sell.html`)
- **Modal handlers** — Fixed async regression causing double-close; alerts now sequence via `onClose` callback

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