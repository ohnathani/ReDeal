---
globs: ["*.css"]
---

# CSS Rules

## Maintainable Styling

- **Single source of truth**: Design tokens in `variables.css` only
- **Component-scoped**: Styles for a component stay together
- **No redundancy**: Extract repeated patterns to utilities or components
- **Consistent ordering**: Properties grouped logically (layout → box → visual → typography)

## Responsive Layouts

- **Mobile-first**: Base styles for smallest screens, enhance with `min-width` media queries
- **Breakpoints** (defined in variables.css):
  ```css
  --bp-sm: 480px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  ```
- **Fluid typography**: Use `clamp()` for responsive text
  ```css
  h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
  ```
- **Flexible containers**: `max-width: 100%`, `width: 100%` on images/media

## CSS Variables (Custom Properties)

Define all reusable values in `variables.css`:

```css
:root {
  /* Colors — semantic names, not color names */
  --color-primary: #5E17EB;
  --color-primary-hover: #4710BD;
  --color-primary-light: #8755F5;
  --color-lavender: #EEE7FF;
  --color-lavender-soft: #F8F5FF;
  
  --color-background: #F7F6FA;
  --color-surface: #FFFFFF;
  --color-text: #191522;
  --color-text-secondary: #777180;
  --color-text-muted: #A39EAD;
  --color-border: #EAE7F0;
  --color-border-strong: #D8D1E5;
  
  /* Accent colors */
  --color-accent-mint: #20C997;
  --color-accent-yellow: #FFC857;
  
  /* Status colors */
  --color-success: #16865F;
  --color-warning: #A66B00;
  --color-error: #DC3545;
  
  /* Spacing — scale based */
  --space-xs: 0.25rem;  /* 4px */
  --space-sm: 0.5rem;   /* 8px */
  --space-md: 1rem;     /* 16px */
  --space-lg: 1.5rem;   /* 24px */
  --space-xl: 2rem;     /* 32px */
  --space-2xl: 3rem;    /* 48px */
  
  /* Typography */
  --font-sans: Inter, system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  
  /* Breakpoints */
  --bp-sm: 480px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  
  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
}
```

Usage:
```css
.card {
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}
```

## Naming Conventions

- **BEM-style** for components: `.block__element--modifier`
  ```css
  .card { }
  .card__title { }
  .card__title--highlighted { }
  .card--featured { }
  .card--selected { border-color: var(--color-primary); background: var(--color-lavender-soft); }
  ```
- **Utility classes**: `.u-` prefix for single-purpose
  ```css
  .u-visually-hidden { }
  .u-text-center { }
  .u-mt-md { margin-top: var(--space-md); }
  ```
- **State classes**: `.is-`, `.has-`
  ```css
  .is-active { }
  .is-loading { }
  .has-error { }
  ```
- **CSS Variables**: `--category-subcategory` (kebab-case)
  ```css
  --color-primary, --space-md, --font-sans, --bp-lg
  ```

## File Organization Order

```css
/* 1. Imports (variables only) */
@import 'variables.css';

/* 2. Reset / Normalize */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }

/* 3. Base styles (html, body, typography links) */
html { font-size: 100%; }
body { font-family: var(--font-sans); line-height: 1.5; }

/* 4. Layout (header, main, footer, grid systems) */
.header { }
.main { }
.footer { }
.grid { }

/* 5. Components (buttons, cards, forms, modals) */
.btn { }
.card { }
.form { }
.modal { }

/* 6. Utilities (helpers, overrides) */
.visually-hidden { }
.skip-link { }
```

## Avoid

| Avoid | Instead |
|-------|---------|
| `!important` | Higher specificity, cascade order, or utility class |
| Duplicate styles | Extract to component or utility |
| Magic numbers | CSS variables |
| Fixed widths | `max-width`, `%`, `fr`, `clamp()` |
| `px` for everything | `rem` for spacing/typography, `px` for borders/thin lines |
| ID selectors (`#id`) | Class selectors (`.class`) |
| Deep nesting (>3 levels) | Flatten, use BEM |
| Hardcoded colors | Use variables from `variables.css` |

## Responsive Patterns

```css
/* Container queries (preferred where supported) */
.card-container {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card { display: flex; }
}

/* Media queries (fallback) */
@media (min-width: 768px) {
  .grid--2 { grid-template-columns: repeat(2, 1fr); }
}

/* Fluid spacing */
.section { padding: clamp(1rem, 3vw, 3rem) clamp(1rem, 5vw, 4rem); }
```

## Component Style Template

```css
/* Component: Button */
.btn {
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  
  /* Box */
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  
  /* Visual */
  font-weight: 500;
  font-family: inherit;
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
  
  /* States */
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* Variants */
.btn--primary { background: var(--color-primary); color: white; }
.btn--primary:hover { background: var(--color-primary-hover); }
.btn--secondary { background: var(--color-surface); border-color: var(--color-border); }
.btn--secondary:hover { background: var(--color-border); }
.btn--ghost { background: transparent; color: var(--color-primary); }
.btn--ghost:hover { background: var(--color-lavender); }

/* Sizes */
.btn--sm { padding: var(--space-xs) var(--space-md); font-size: var(--text-xs); }
.btn--lg { padding: var(--space-md) var(--space-xl); font-size: var(--text-base); }
```

## Preserve Design Language

- Don't introduce new colors without adding to `variables.css`
- Don't override component styles in page-specific CSS — use modifier classes
- Keep visual consistency: same radius, shadows, transitions across components
- **Electric Violet palette is mandatory** — never use deprecated orange (`#BF4408`, `#E65103`) or blue (`#2563eb`, `#1d4ed8`) branding

---

*Enforced by Claude Code. See AGENTS.md for full conventions.*