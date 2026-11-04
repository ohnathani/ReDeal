# AGENTS.md

General instructions for AI coding agents working on the ReDeal project.

## Project Overview

**ReDeal** is a vanilla frontend project using only HTML, CSS, and JavaScript. No frameworks, no backend, no database, no build tools.

## Project Structure

```
ReDeal CMSC 3/
├── index.html              # Main entry point
├── css/
│   ├── main.css           # Primary stylesheet
│   ├── components.css     # Reusable component styles
│   └── variables.css      # CSS custom properties (design tokens)
├── js/
│   ├── main.js            # Application entry point
│   ├── components/        # Reusable UI components
│   └── utils/             # Helper functions
├── assets/
│   ├── images/            # Image assets
│   ├── fonts/             # Local fonts (if any)
│   └── icons/             # Icon files (SVG preferred)
├── .claude/
│   ├── rules/             # Claude Code rules
│   └── settings.json      # Claude Code settings
├── AGENTS.md              # This file
├── CLAUDE.md              # Claude Code specific instructions
├── ARCHITECTURE.md        # Architecture documentation
├── TODO.md                # Task tracking
├── CHANGELOG.md           # Version history
└── .gitignore
```

## Design System (Electric Violet) — Single Source of Truth

**All colors, spacing, typography, and design tokens are defined exclusively in `css/variables.css`. Never hardcode design values elsewhere.**

### Official Brand Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#5E17EB` | Primary actions, active nav, links, important interactive elements |
| `--color-primary-hover` | `#4710BD` | Hover states for primary elements |
| `--color-primary-light` | `#8755F5` | Lighter variant for gradients, backgrounds |
| `--color-lavender` | `#EEE7FF` | Selected states, subtle highlighted surfaces |
| `--color-lavender-soft` | `#F8F5FF` | Very subtle backgrounds, hover on cards |

### Neutral Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | `#F7F6FA` | Main page background |
| `--color-surface` | `#FFFFFF` | Card surfaces, modals, inputs |
| `--color-text` | `#191522` | Primary text (dark violet) |
| `--color-text-secondary` | `#777180` | Secondary text, labels |
| `--color-text-muted` | `#A39EAD` | Placeholder, disabled, meta text |
| `--color-border` | `#EAE7F0` | Default borders |
| `--color-border-strong` | `#D8D1E5` | Emphasized borders, focus rings |

### Accent Colors (Use Sparingly)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent-mint` | `#20C997` | Success states, positive indicators |
| `--color-accent-yellow` | `#FFC857` | Warnings, attention-grabbing highlights |

### Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#16865F` | Success messages, confirmations |
| `--color-warning` | `#A66B00` | Warning messages |
| `--color-error` | `#DC3545` | Error messages, destructive actions |

### Spacing Scale

```css
--space-xs: 0.25rem;    /* 4px */
--space-sm: 0.5rem;     /* 8px */
--space-md: 1rem;       /* 16px */
--space-lg: 1.5rem;     /* 24px */
--space-xl: 2rem;       /* 32px */
--space-2xl: 3rem;      /* 48px */
```

### Typography

```css
--font-sans: Inter, system-ui, -apple-system, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, monospace;
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 2rem;       /* 32px */
```

### Breakpoints

```css
--bp-sm: 480px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
```

### Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;  /* Pills, avatars */
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

### Transitions

```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 350ms ease;
```

## Design Guardrails (Mandatory)

- **Electric Violet is the official ReDeal brand identity.** `#5E17EB` is the primary brand color.
- **Never reintroduce the deprecated orange branding** (`#BF4408`, `#E65103`, `#2563eb`, `#1d4ed8`).
- **Use centralized CSS custom properties** from `variables.css` instead of scattered hardcoded colors.
- **Use violet for primary actions**, active navigation, links, and important interactive elements.
- **Use lavender (`#EEE7FF`)** for selected states and subtle highlighted surfaces.
- **Use mint (`#20C997`) and yellow (`#FFC857`) sparingly** for secondary accents only.
- **Maintain readable contrast** and accessible color combinations (WCAG 2.1 AA minimum).
- **Preserve a consistent visual identity** across every page and component.

## HTML Conventions

- **Semantic HTML5**: Use `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<nav>` appropriately
- **Valid markup**: All tags properly closed, attributes quoted
- **Accessibility first**: Proper heading hierarchy (h1-h6), alt text for images, ARIA labels where needed
- **SEO basics**: Descriptive `<title>`, meta description, Open Graph tags
- **Avoid unnecessary divs**: Prefer semantic elements over generic containers
- **Indentation**: 2 spaces, consistent nesting
- **Comments**: Use `<!-- Component Name -->` for major sections

## CSS Conventions

- **CSS Variables**: Define colors, spacing, typography in `variables.css` only
- **Mobile-first**: Base styles for mobile, enhance with media queries
- **BEM-style naming**: `.block__element--modifier` for component classes
- **No !important**: Except for utility overrides (`.visually-hidden`)
- **No duplicate styles**: Extract common patterns to components
- **Responsive breakpoints**: Use variables from `variables.css`
- **Organization**: Variables → Reset/Base → Layout → Components → Utilities

## JavaScript Conventions

- **Vanilla ES6+ only**: No transpilation, no bundlers
- **Module pattern**: Use IIFE or ES modules (`type="module"`)
- **Single responsibility**: Each function does one thing
- **Event delegation**: Prefer single listener on parent over many on children
- **No inline JavaScript**: No `onclick=""` in HTML
- **No global pollution**: Wrap in modules, export only what's needed
- **Error handling**: Try/catch for async operations, graceful degradation
- **Naming**: camelCase for variables/functions, PascalCase for constructors/classes

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `main.css`, `user-card.js` |
| CSS Classes | BEM | `.card__title--highlighted` |
| JS Variables/Functions | camelCase | `currentUser`, `renderCard()` |
| JS Classes/Constructors | PascalCase | `UserCard`, `APIClient` |
| CSS Variables | kebab-case | `--color-primary`, `--spacing-md` |
| Data Attributes | kebab-case | `data-user-id` |

## Accessibility Requirements

- **WCAG 2.1 AA** minimum compliance
- Semantic heading structure (one h1 per page)
- Focus visible states on all interactive elements
- Color contrast ratios: 4.5:1 normal text, 3:1 large text
- Keyboard navigation for all functionality
- ARIA labels for icon-only buttons
- Alt text for all informative images
- Skip to main content link

## Responsive Design Requirements

- Mobile-first approach
- Fluid typography using `clamp()`
- Flexible layouts with CSS Grid/Flexbox
- Touch targets minimum 44×44px
- No horizontal scrolling
- Images: `max-width: 100%; height: auto;`

## Code Organization

```
CSS Order:
1. @import (variables only)
2. Reset / Normalize
3. Base styles (html, body, typography)
4. Layout (header, main, footer, grid)
5. Components (buttons, cards, forms)
6. Utilities (visually-hidden, sr-only, etc.)

JS Order:
1. Imports
2. Constants / Configuration
3. Utility functions
4. Component classes/functions
5. Event handlers
6. Initialization
```

## Git Workflow

- **Main branch**: `main` (protected)
- **Feature branches**: `feature/short-description`
- **Commit messages**: Conventional Commits format
  - `feat: add user card component`
  - `fix: resolve mobile menu toggle`
  - `docs: update architecture`
  - `refactor: simplify event handling`
- **No direct commits to main**: Use PRs (even if solo)
- **Squash and merge** preferred

## Testing & Verification

Before considering any change complete:
1. Open in browser (File → Open or live server)
2. Test keyboard navigation (Tab, Shift+Tab, Enter, Escape)
3. Test responsive: resize browser, check mobile view
4. Check console for errors
5. Validate HTML: https://validator.w3.org/
6. Test in at least two browsers

## Rules Against Unnecessary Dependencies

- **No frameworks**: React, Vue, Angular, Svelte, etc.
- **No build tools**: Vite, Webpack, Parcel, etc.
- **No CSS frameworks**: Bootstrap, Tailwind, etc.
- **No JS libraries**: jQuery, Lodash, etc. (unless explicitly approved)
- **No package.json**: No npm, yarn, pnpm
- **Use platform APIs**: fetch, IntersectionObserver, CSS Grid, etc.
- **Write it yourself**: Small utilities over importing

## Overengineering Prevention

- Start simple, add complexity only when needed
- No abstraction without 3+ use cases
- No "future-proofing" for unknown requirements
- Delete dead code immediately
- Prefer native browser features over polyfills

---

*This document is imported by CLAUDE.md. All AI agents should follow these conventions.*