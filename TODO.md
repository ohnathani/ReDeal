# TODO.md

Task tracking for the ReDeal project.

## Conventions

- **Status**: `[ ]` = Not started, `[~]` = In progress, `[x]` = Done
- **Priority**: `HIGH` / `MED` / `LOW`
- **Type**: `FEAT` (feature), `FIX` (bug), `TECH` (tech debt), `DOCS` (documentation)
- **Reference**: Link to related files or issues

---

## Existing Unfinished Features

*None identified — Phase 1 and Phase 2 complete.*

---

## Known Bugs

*None identified — all Luna Review 1-3 Priority 0, 1, 2 conditions resolved.*

---

## Technical Debt

| Status | Priority | Type | Task | Details |
|--------|----------|------|------|---------|
| `[ ]` | LOW | TECH | Cross-tab favorites sync | Add `storage` event listener for cross-tab sync |
| `[ ]` | LOW | TECH | Multi-image gallery support | Extend product data model to support multiple images |
| `[ ]` | LOW | TECH | Figma design directory cleanup | Remove or archive `figma_design/` directory |
| `[ ]` | LOW | TECH | Unsplash images in data layer | Replace placeholder images with local assets |

---

## Suggested Improvements

| Status | Priority | Type | Task | Details |
|--------|----------|------|------|---------|
| `[x]` | HIGH | FEAT | Create base HTML structure | Create `index.html` with semantic structure, skip link, header/main/footer |
| `[x]` | HIGH | FEAT | Set up CSS foundation | Create `css/variables.css`, `css/main.css`, `css/components.css` with Electric Violet design tokens |
| `[x]` | HIGH | FEAT | Set up JS foundation | Create `js/main.js`, `js/utils/dom.js`, `js/utils/events.js` |
| `[x]` | MED | FEAT | Create reusable components | Button, Card, Form, Modal components in `js/components/` |
| `[ ]` | MED | FEAT | Add icon system | Create SVG sprite sheet and `Icon` component |
| `[x]` | MED | TECH | Configure .gitignore | Add appropriate exclusions per AGENTS.md |
| `[ ]` | LOW | DOCS | Add component documentation | Document each component with usage examples |
| `[ ]` | LOW | FEAT | Add responsive navigation | Mobile hamburger menu with keyboard support |
| `[ ]` | LOW | FEAT | Add theme support | Light/dark mode with CSS variables and localStorage |

---

## Prioritized Tasks (Next Steps)

1. **Phase 3 Planning** — Define scope for user auth, messaging, offers, dashboard, search, image upload, ratings, PWA
2. **User authentication flow** — Login/signup pages with form validation
3. **Real messaging system** — WebSocket/backend integration
4. **Offer/transaction system** — Backend integration for offers
5. **User dashboard** — My listings, favorites, purchases, sales
6. **Search improvements** — Debounced, suggestions
7. **Image upload for listings** — Client-side preview, validation
8. **Rating/review system** — Seller and product ratings
9. **PWA enhancements** — Offline support, install prompt

---

## Completed

| Date | Task | Notes |
|------|------|-------|
| 2026-11-04 | Initialize documentation system | Created AGENTS.md, CLAUDE.md, README.md, ARCHITECTURE.md, TODO.md, CHANGELOG.md, .claude/rules/*, .claude/settings.json, .gitignore |
| 2026-11-04 | Update to Electric Violet design system | Updated all docs, rules, and created css/variables.css with new palette |
| 2026-11-04 | Create base project structure | Created index.html, css/ (variables.css, main.css, components.css), js/ (main.js, utils/, components/) |
| 2026-11-04 | Implement core components | Button, Card (ProductCard, FeatureCard), Modal with confirm/alert helpers |
| 2026-11-04 | Set up utility modules | dom.js, events.js with delegation, debounce, throttle, focus trap, etc. |
| 2026-11-04 | Create favicon assets | favicon.svg, apple-touch-icon.svg, manifest.json, generate-favicons.html |
| 2026-11-04 | Phase 1: Project Setup & Base Architecture | Complete foundation with design system, component library, shared data layer |
| 2026-11-04 | Phase 2: Product Detail Page | Gallery, product info, seller card, favorite toggle, Message Seller/Make Offer modals, share, responsive |
| 2026-11-04 | Luna Review 1 fixes | Git integrity, imports, bottom nav, modal buttons, duplicate H1, touch targets |
| 2026-11-04 | Luna Review 2 fixes | Hardcoded colors, gallery counter, PWA icons, thumbnail errors, prompt/alert replacement |
| 2026-11-04 | Luna Review 3 fixes | P0 modal regression, share fallback inline JS, PWA manifest routes, log accuracy |

---

*Update this file as work progresses. Keep it honest — don't invent tasks without evidence.*