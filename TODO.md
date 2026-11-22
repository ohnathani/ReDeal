# TODO.md

Task tracking for the ReDeal project.

## Conventions

- **Status**: `[ ]` = Not started, `[~]` = In progress, `[x]` = Done
- **Priority**: `HIGH` / `MED` / `LOW`
- **Type**: `FEAT` (feature), `FIX` (bug), `TECH` (tech debt), `DOCS` (documentation)
- **Reference**: Link to related files or issues

---

## Existing Unfinished Features

| Status | Priority | Type | Task | Details |
|--------|----------|------|------|---------|
| `[ ]` | MED | FEAT | Request system follow-through | Requests can be posted and filtered; seller inbox and accept/decline are not built (deferred in `IMPLEMENTATION_LOG.md`) |
| `[ ]` | MED | FEAT | Edit / delete / archive listing | Deferred from Phase 3 |
| `[ ]` | MED | FEAT | Image upload for listings | Create Listing accepts an image URL only |
| `[ ]` | LOW | FEAT | Draft auto-save in Create Listing | Progress is saved only on submit |
| `[ ]` | LOW | FEAT | Real messaging | Messages are simulated and stored in the browser; real chat needs a backend, which is out of scope |

---

## Known Bugs

*No confirmed bugs. Items to check:*

| Status | Priority | Type | Task | Details |
|--------|----------|------|------|---------|
| `[ ]` | LOW | FIX | Verify header search on `index.html` and `product.html` | The search inputs have no `id`; confirm they do something, or wire them to the Marketplace search |

---

## Technical Debt

| Status | Priority | Type | Task | Details |
|--------|----------|------|------|---------|
| `[ ]` | MED | TECH | Verify Phase 4 in the browser | Auth was implemented and source-fixed (Luna Review 14), but no browser close-out is recorded in `IMPLEMENTATION_LOG.md`. Run the checklist in `PHASE_4_AUTH_PLAN.md` section 13 and log the result |
| `[ ]` | MED | TECH | Plaintext passwords in localStorage | Acceptable only for this prototype with fake credentials. Do not deploy without real backend auth |
| `[ ]` | MED | DOCS | Bring README and ARCHITECTURE up to date | Project structure should list `js/pages/`, `js/data/`, `tools/`, and the extra CSS and HTML pages |
| `[ ]` | LOW | TECH | Cross-tab favorites sync | Add `storage` event listener for cross-tab sync |
| `[ ]` | LOW | TECH | Multi-image gallery support | Extend product data model to support multiple images |
| `[ ]` | LOW | TECH | Figma design directory cleanup | Remove or archive `figma_design/` directory |
| `[ ]` | LOW | TECH | Convert product photos to WebP | Local JPGs added about 1 MB to the repo (noted in the log for Phase 9 polish) |
| `[ ]` | LOW | TECH | Accessibility audit | Planned as Phase 5 in the log |
| `[ ]` | LOW | TECH | TeleportHQ cleanup | Planned as Phase 6 in the log |

---

## Suggested Improvements

| Status | Priority | Type | Task | Details |
|--------|----------|------|------|---------|
| `[x]` | HIGH | FEAT | Create base HTML structure | Create `index.html` with semantic structure, skip link, header/main/footer |
| `[x]` | HIGH | FEAT | Set up CSS foundation | Create `css/variables.css`, `css/main.css`, `css/components.css` with Electric Violet design tokens |
| `[x]` | HIGH | FEAT | Set up JS foundation | Create `js/main.js`, `js/utils/dom.js`, `js/utils/events.js` |
| `[x]` | MED | FEAT | Create reusable components | Button, Card, Form, Modal components in `js/components/` |
| `[x]` | MED | TECH | Configure .gitignore | Add appropriate exclusions per AGENTS.md |
| `[ ]` | MED | FEAT | Add icon system | The same SVGs are pasted into every page; create an SVG sprite sheet and `Icon` component |
| `[ ]` | MED | FEAT | Search improvements | Debounced search and suggestions |
| `[ ]` | LOW | DOCS | Add component documentation | Document each component with usage examples |
| `[ ]` | LOW | FEAT | Add responsive navigation | Mobile hamburger menu with keyboard support |
| `[ ]` | LOW | FEAT | Add theme support | Light/dark mode with CSS variables and localStorage |
| `[ ]` | LOW | FEAT | Rating/review system | Seller and product ratings |
| `[ ]` | LOW | FEAT | PWA enhancements | Offline support, install prompt |

---

## Prioritized Tasks (Next Steps)

1. **Verify Phase 4 in the browser** and record the result in `IMPLEMENTATION_LOG.md`
2. **Update README.md and ARCHITECTURE.md** to match the current file structure
3. **Request system** — seller inbox, accept/decline
4. **Edit / delete listing**
5. **Image upload for listings** — client-side preview and validation
6. **Search improvements** — debounced, suggestions
7. **Icon system** — remove duplicated SVG markup
8. **Rating/review system**
9. **PWA enhancements**

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
| 2026-11-05 | Phase 3: Create Listing | Form, validation, localStorage persistence; closed after browser smoke test (10/10 pass) |
| 2026-11-05 | Phase 4: Authentication (implemented) | Login, signup, session, route guards, header auth, per-user favorites, profile page, guest bypass; Luna Review 14 fixes applied. Browser verification not yet recorded |
| 2026-11-05 | Real product images | 15 local photos replace SVG placeholders |
| 2026-11-22 | Requests page | Post form, category chips, search, sample requests |
| 2026-11-22 | Messages page | Conversation list, thread, quick replies; replies simulated |
| 2026-11-22 | Page consistency fixes | Requests page uses shared layout; logo removed from messages; `header__auth` added to login/signup; favicon tool moved to `tools/`; `sell.html` removed; manifest paths fixed (console clean on Requests page) |

---

*Update this file as work progresses. Keep it honest — don't invent tasks without evidence.*
