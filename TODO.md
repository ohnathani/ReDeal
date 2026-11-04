# TODO.md

Task tracking for the ReDeal project.

## Conventions

- **Status**: `[ ]` = Not started, `[~]` = In progress, `[x]` = Done
- **Priority**: `HIGH` / `MED` / `LOW`
- **Type**: `FEAT` (feature), `FIX` (bug), `TECH` (tech debt), `DOCS` (documentation)
- **Reference**: Link to related files or issues

---

## Existing Unfinished Features

*None identified — project is at initial setup stage.*

---

## Known Bugs

*None identified — project is at initial setup stage.*

---

## Technical Debt

*None identified — project is at initial setup stage.*

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

1. **Implement marketplace page** — Create `marketplace.html` based on Figma frame3 design with filters, sort, and product grid
2. **Implement product detail page** — Create `product.html` based on Figma productdetailsscreen design with gallery, info, description, defects, proof photos, seller
3. **Add more sample data** — Create JSON data files for products, categories, sellers
4. **Implement routing** — Simple hash-based or history-based router for SPA navigation
5. **Add accessibility audit** — Run through WCAG 2.1 AA checklist
6. **Test cross-browser** — Verify in Chrome, Firefox, Safari

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

---

*Update this file as work progresses. Keep it honest — don't invent tasks without evidence.*