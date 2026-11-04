# ARCHITECTURE.md

Frontend architecture documentation for the ReDeal project.

## Overview

This project follows a simple, scalable vanilla frontend architecture using native browser APIs. No frameworks, no build steps, no transpilation.

## Design System (Electric Violet)

The complete design token palette is centralized in `css/variables.css`. This is the **single source of truth** for all design values.

### CSS Custom Properties (from `variables.css`)

```css
:root {
  /* === Brand Colors (Electric Violet) === */
  --color-primary: #5E17EB;
  --color-primary-hover: #4710BD;
  --color-primary-light: #8755F5;
  --color-lavender: #EEE7FF;
  --color-lavender-soft: #F8F5FF;

  /* === Neutral Colors === */
  --color-background: #F7F6FA;
  --color-surface: #FFFFFF;
  --color-text: #191522;
  --color-text-secondary: #777180;
  --color-text-muted: #A39EAD;
  --color-border: #EAE7F0;
  --color-border-strong: #D8D1E5;

  /* === Accent Colors === */
  --color-accent-mint: #20C997;
  --color-accent-yellow: #FFC857;

  /* === Status Colors === */
  --color-success: #16865F;
  --color-warning: #A66B00;
  --color-error: #DC3545;

  /* === Status Color Backgrounds (light variants for badges/alerts) === */
  --color-success-bg: #E8F7F0;
  --color-warning-bg: #FFF8E1;
  --color-error-bg: #FDEDEA;

  /* === On-Primary (text/icon color on primary backgrounds) === */
  --color-on-primary: #FFFFFF;

  /* === Spacing === */
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */

  /* === Typography === */
  --font-sans: Inter, system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, monospace;
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 2rem;      /* 32px */

  /* === Breakpoints === */
  --bp-sm: 480px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;

  /* === Radius === */
  --radius-sm: 0.25rem;  /* 4px */
  --radius-md: 0.5rem;   /* 8px */
  --radius-lg: 0.75rem;  /* 12px */
  --radius-xl: 1rem;     /* 16px */
  --radius-full: 9999px; /* Pills, avatars */

  /* === Shadows === */
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  --shadow-focus: 0 0 0 3px rgb(94 23 235 / 0.3);
  --shadow-action-bar: 0 -4px 12px rgb(0 0 0 / 0.05);

  /* === Overlay/Backdrop === */
  --overlay-backdrop: rgba(0, 0, 0, 0.5);

  /* === Transitions === */
  --transition-fast: 100ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  /* === Z-Index Scale === */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
  --z-toast: 800;

  /* === Container Max Widths === */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
  --container-full: 100%;

  /* === Focus Ring === */
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;
  --focus-ring-color: var(--color-primary);
}
```

/* === Dark Mode (optional - for future use) === */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #141218;
    --color-surface: #1C1A22;
    --color-text: #F2F0F7;
    --color-text-secondary: #A39EAD;
    --color-text-muted: #777180;
    --color-border: #2D2A38;
    --color-border-strong: #3D3A4A;
    --color-lavender-soft: #2E2A3E;
  }
}

/* === High Contrast Mode (optional - for future use) === */
@media (prefers-contrast: high) {
  :root {
    --color-border: var(--color-text);
    --color-border-strong: var(--color-text);
    --shadow-md: 0 0 0 1px var(--color-text);
    --shadow-lg: 0 0 0 2px var(--color-text);
  }
}
```

## HTML Page Structure

### Entry Point: `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ReDeal</title>
  <meta name="description" content="...">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/components.css">
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  
  <header class="header" role="banner">
    <!-- Site header -->
  </header>
  
  <main id="main" class="main" role="main">
    <!-- Page content -->
  </main>
  
  <footer class="footer" role="contentinfo">
    <!-- Site footer -->
  </footer>
  
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Key Principles

- **Single HTML file** for SPA-like behavior (or multiple pages with shared layout)
- **Semantic landmarks**: header, main, footer, nav, aside
- **Skip link** for keyboard users
- **CSS before JS** — stylesheets in `<head>`, script at end of `<body>`
- **ES Modules** — `<script type="module">` for modern JS

## CSS Organization

### File Structure

```
css/
├── variables.css      # CSS Custom Properties (design tokens) — SINGLE SOURCE OF TRUTH
├── main.css           # Reset, base, layout
└── components.css     # Reusable UI components
```

### variables.css — Design Tokens

All design tokens are defined here. **No other CSS file should define colors, spacing, typography, or other design tokens.**

### main.css — Reset, Base, Layout

```css
/* 1. Reset / Normalize */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html { -webkit-text-size-adjust: 100%; }
body { 
  line-height: 1.5; 
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-background);
  font-size: var(--text-base);
}
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }

/* 2. Base Typography */
h1 { font-size: var(--text-3xl); font-weight: 700; line-height: 1.2; }
h2 { font-size: var(--text-2xl); font-weight: 600; line-height: 1.3; }
h3 { font-size: var(--text-xl); font-weight: 600; line-height: 1.4; }
a { color: var(--color-primary); text-decoration: none; }
a:hover { text-decoration: underline; }

/* 3. Layout */
.header { padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--color-border); }
.main { padding: var(--space-lg); max-width: var(--bp-xl); margin: 0 auto; }
.footer { padding: var(--space-lg); border-top: 1px solid var(--color-border); text-align: center; }

/* 4. Utilities */
.visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}
.skip-link {
  position: absolute; top: -100%; left: var(--space-md); 
  padding: var(--space-sm) var(--space-md); background: var(--color-primary);
  color: white; border-radius: var(--radius-md); z-index: 100;
}
.skip-link:focus { top: var(--space-md); }
```

### components.css — Reusable Components

```css
/* Button */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--space-sm); padding: var(--space-sm) var(--space-lg);
  font-weight: 500; border-radius: var(--radius-md);
  border: 1px solid transparent; cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}
.btn:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
.btn--primary { background: var(--color-primary); color: var(--color-on-primary); }
.btn--primary:hover { background: var(--color-primary-hover); }
.btn--secondary { background: var(--color-surface); color: var(--color-text); border-color: var(--color-border); }
.btn--secondary:hover { background: var(--color-border); }
.btn--ghost { background: transparent; color: var(--color-primary); }
.btn--ghost:hover { background: var(--color-lavender); }

/* Card */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}
.card__title { font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--space-sm); }
.card__content { color: var(--color-text-muted); }
.card--selected { border-color: var(--color-primary); background: var(--color-lavender-soft); }

/* Form */
.form-group { margin-bottom: var(--space-md); }
.form-label { display: block; margin-bottom: var(--space-xs); font-weight: 500; }
.form-input {
  width: 100%; padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border); border-radius: var(--radius-md);
  background: var(--color-background); color: var(--color-text);
}
.form-input:focus { outline: 2px solid var(--color-primary); outline-offset: 1px; border-color: transparent; }

/* Badge */
.badge {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm); font-size: var(--text-xs);
  font-weight: 600; border-radius: var(--radius-full);
}
.badge--primary { background: var(--color-lavender); color: var(--color-primary); }
.badge--success { background: var(--color-success-bg); color: var(--color-success); }
.badge--warning { background: var(--color-warning-bg); color: var(--color-warning); }
.badge--error { background: var(--color-error-bg); color: var(--color-error); }

/* Grid */
.grid { display: grid; gap: var(--space-md); }
.grid--2 { grid-template-columns: repeat(2, 1fr); }
.grid--3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 768px) { .grid--2, .grid--3 { grid-template-columns: 1fr; } }
```

## JavaScript Organization

### File Structure

```
js/
├── main.js                    # App initialization
├── components/
│   ├── Header.js             # Header component
│   ├── Card.js               # Card component
│   └── Modal.js              # Modal component
└── utils/
    ├── dom.js                # DOM helpers
    ├── events.js             # Event utilities
    └── api.js                # API helpers (if needed)
```

### Module Pattern (ES Modules)

```js
// js/components/Card.js
export class Card {
  constructor({ title, content, action }) {
    this.title = title;
    this.content = content;
    this.action = action;
  }
  
  render() {
    const article = document.createElement('article');
    article.className = 'card';
    article.innerHTML = `
      <h3 class="card__title">${this.escapeHtml(this.title)}</h3>
      <div class="card__content">${this.content}</div>
      ${this.action ? `<button class="btn btn--primary">${this.escapeHtml(this.action.label)}</button>` : ''}
    `;
    
    if (this.action) {
      article.querySelector('.btn').addEventListener('click', this.action.handler);
    }
    
    return article;
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
```

```js
// js/main.js
import { Card } from './components/Card.js';
import { $, $$ } from './utils/dom.js';

function init() {
  const container = $('#card-container');
  if (!container) return;
  
  const cards = [
    { title: 'Card 1', content: 'Content 1', action: { label: 'Action', handler: () => console.log('clicked') } },
    { title: 'Card 2', content: 'Content 2' }
  ];
  
  cards.forEach(data => {
    const card = new Card(data);
    container.appendChild(card.render());
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

### Utility Modules

```js
// js/utils/dom.js
export function $(selector, context = document) {
  return context.querySelector(selector);
}

export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

export function createElement(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'class') element.className = value;
    else if (key === 'dataset') Object.assign(element.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  children.flat().forEach(child => {
    if (typeof child === 'string') element.appendChild(document.createTextNode(child));
    else if (child instanceof Node) element.appendChild(child);
  });
  return element;
}
```

```js
// js/utils/events.js
export function delegate(parent, selector, eventType, handler) {
  parent.addEventListener(eventType, e => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) handler.call(target, e);
  });
}

export function onReady(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}
```

## DOM Manipulation

- **Create elements**: `document.createElement()` + `createElement()` utility
- **Query**: `$()` / `$$()` utilities (thin wrappers)
- **Insert**: `appendChild()`, `append()`, `prepend()`
- **Remove**: `element.remove()`
- **Classes**: `classList.add()`, `remove()`, `toggle()`, `contains()`
- **Attributes**: `getAttribute()`, `setAttribute()`, `dataset`
- **Events**: `addEventListener()` with named handlers for removal
- **Never**: `innerHTML` with user data (XSS risk), use `textContent` or `createElement()`

## Event Handling

### Patterns

1. **Delegation** (preferred for lists/tables):
   ```js
   delegate(document.body, '[data-action="delete"]', 'click', handleDelete);
   ```

2. **Direct binding** (for unique elements):
   ```js
   const btn = $('#submit-btn');
   btn.addEventListener('click', handleSubmit);
   ```

3. **Component events** (custom events for communication):
   ```js
   // Dispatch
   element.dispatchEvent(new CustomEvent('card:save', { detail: { id, data } }));
   
   // Listen
   document.addEventListener('card:save', e => { /* handle */ });
   ```

### Best Practices

- Use `focus-visible` for keyboard focus styles (CSS handles this)
- Passive listeners for scroll/touch: `addEventListener('scroll', fn, { passive: true })`
- Clean up: `abortController` or `removeEventListener` in teardown
- One handler per event type per element (use delegation instead)

## Data Flow & State Management

### Simple State Pattern

```js
// js/store.js
export const state = {
  user: null,
  items: [],
  ui: { loading: false, error: null }
};

export function setState(path, value) {
  const keys = path.split('.');
  let obj = state;
  for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
  obj[keys[keys.length - 1]] = value;
  document.dispatchEvent(new CustomEvent('state:change', { detail: { path, value } }));
}

export function getState(path) {
  return path.split('.').reduce((obj, key) => obj?.[key], state);
}

// Subscribe
document.addEventListener('state:change', e => {
  if (e.detail.path === 'items') renderItems();
});
```

### Data Fetching

```js
// js/utils/api.js
export async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
}
```

## Asset Organization

```
assets/
├── images/
│   ├── hero.jpg           # Large images
│   ├── avatar.png         # UI images
│   └── favicon.ico        # Favicon
├── fonts/
│   └── (woff2 files if self-hosting)
└── icons/
    ├── icon-home.svg      # Inline or <use>
    ├── icon-menu.svg
    └── sprites.svg        # SVG sprite sheet
```

### Icon Usage

Preferred: **Inline SVG** or **SVG Sprite**

```html
<!-- Inline -->
<svg class="icon" aria-hidden="true"><use href="assets/icons/sprites.svg#home"></use></svg>

<!-- Or as component -->
<Icon name="home" />
```

```js
// js/components/Icon.js
export function Icon({ name, size = 24, label }) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.className = 'icon';
  svg.setAttribute('aria-hidden', label ? 'false' : 'true');
  svg.style.width = svg.style.height = `${size}px`;
  if (label) svg.setAttribute('aria-label', label);
  
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `assets/icons/sprites.svg#${name}`);
  svg.appendChild(use);
  
  return svg;
}
```

## Page & Script Interaction

### Single Page Application (SPA) Style

```
index.html
  └── main.js (entry)
       ├── Header.js (mounts to <header>)
       ├── Router.js (handles hash/history routing)
       ├── Views/
       │   ├── HomeView.js
       │   ├── AboutView.js
       │   └── ContactView.js
       └── Shared Components (Card, Modal, etc.)
```

### Multi-Page (Traditional)

```
index.html        → js/main.js (home page logic)
about.html        → js/about.js
contact.html      → js/contact.js
shared: css/*, js/utils/*, js/components/*
```

## Performance Considerations

- **No build step** — browser caches individual files
- **ES Modules** — native caching, parallel loading
- **CSS Variables** — no runtime computation
- **Defer non-critical JS** — `defer` or `type="module"` (implicit defer)
- **Preload critical assets** — `<link rel="preload" as="style" href="css/main.css">`
- **Optimize images** — WebP, appropriate dimensions, `srcset`
- **Minimize reflows** — batch DOM reads/writes

## Security

- **No `eval()` or `new Function()`**
- **Sanitize user input** before DOM insertion (escapeHtml utility)
- **CSP headers** when deployed (configure on server)
- **HTTPS only** in production
- **No inline scripts** — CSP friendly

---

*This architecture is designed to be simple, maintainable, and scalable without tooling complexity.*