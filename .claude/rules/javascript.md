---
globs: ["*.js"]
---

# JavaScript Rules

## Vanilla JavaScript Only

- **No frameworks**: React, Vue, Angular, Svelte, etc.
- **No build tools**: Vite, Webpack, Parcel, Rollup, etc.
- **No transpilation**: Write ES6+ that runs in modern browsers
- **No package.json**: No npm, yarn, pnpm, no node_modules
- **Use platform APIs**: fetch, IntersectionObserver, ResizeObserver, CSS Grid, Flexbox

## ES6+ Syntax

- **Modules**: `type="module"` in HTML, `import`/`export` in JS
- **Arrow functions**: For callbacks and short functions
- **const/let**: No `var`
- **Template literals**: For string interpolation
- **Destructuring**: For objects and arrays
- **Optional chaining**: `obj?.prop?.method()`
- **Nullish coalescing**: `value ?? default`
- **Async/await**: For promises

## Readable & Modular Functions

```js
// Good: Single responsibility, descriptive name
function calculateTotal(items, taxRate = 0.1) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + taxRate);
}

// Good: Pure function, easy to test
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

// Avoid: Multiple responsibilities
function processOrderAndSendEmailAndUpdateUI(order) { /* ... */ }
```

## Proper Event Listeners

- **Named functions** for removable listeners:
  ```js
  function handleClick(event) { /* ... */ }
  button.addEventListener('click', handleClick);
  // Later: button.removeEventListener('click', handleClick);
  ```

- **Event delegation** for dynamic lists:
  ```js
  document.body.addEventListener('click', event => {
    const button = event.target.closest('[data-action="delete"]');
    if (button) handleDelete(button.dataset.id);
  });
  ```

- **Passive listeners** for scroll/touch:
  ```js
  window.addEventListener('scroll', onScroll, { passive: true });
  ```

- **AbortController** for cleanup:
  ```js
  const controller = new AbortController();
  element.addEventListener('click', handler, { signal: controller.signal });
  // Later: controller.abort();
  ```

## DOM Manipulation Best Practices

- **Create elements programmatically** (not innerHTML with user data):
  ```js
  // Safe
  const div = document.createElement('div');
  div.textContent = userInput;
  
  // Unsafe (XSS risk)
  div.innerHTML = userInput;
  ```

- **Use utilities** for common operations:
  ```js
  // js/utils/dom.js
  export const $ = (sel, ctx = document) => ctx.querySelector(sel);
  export const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  export function createElement(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') el.className = v;
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (k.startsWith('on') && typeof v === 'function') 
        el.addEventListener(k.slice(2).toLowerCase(), v);
      else el.setAttribute(k, v);
    });
    children.flat().forEach(c => el.append(
      typeof c === 'string' ? document.createTextNode(c) : c
    ));
    return el;
  }
  ```

- **Batch DOM operations** to avoid reflows:
  ```js
  // Bad: Multiple reflows
  items.forEach(item => container.appendChild(createItem(item)));
  
  // Good: Single reflow
  const fragment = document.createDocumentFragment();
  items.forEach(item => fragment.appendChild(createItem(item)));
  container.appendChild(fragment);
  ```

## Error Handling

- **Try/catch for async operations**:
  ```js
  async function fetchUser(id) {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error; // Re-throw or return fallback
    }
  }
  ```

- **Graceful degradation**: Feature detection over browser detection
  ```js
  if ('IntersectionObserver' in window) {
    // Use IntersectionObserver
  } else {
    // Fallback: scroll listener
  }
  ```

- **User-facing errors**: Show in UI, not just console
  ```js
  function showError(message) {
    const toast = createElement('div', { class: 'toast toast--error', role: 'alert' }, message);
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }
  ```

## Avoid Global Variables

- **Use modules**: Each file is its own scope
- **Export only what's needed**:
  ```js
  // utils/api.js
  export async function fetchJson(url, options) { /* ... */ }
  export const API_BASE = '/api';
  
  // Not exported (private)
  function internalHelper() { /* ... */ }
  ```

- **Singleton pattern** for shared state:
  ```js
  // store.js
  const state = { user: null, items: [] };
  export function getState() { return state; }
  export function setState(key, value) { state[key] = value; }
  ```

## Avoid Inline JavaScript

| Avoid | Use |
|-------|-----|
| `<button onclick="doSomething()">` | `button.addEventListener('click', doSomething)` |
| `<script>init()</script>` | `<script type="module" src="js/main.js"></script>` |
| `href="javascript:void(0)"` | `<button>` or `<a href="#"></a>` with preventDefault |

## Component Pattern

```js
// js/components/Modal.js
export class Modal {
  constructor({ title, content, onClose }) {
    this.title = title;
    this.content = content;
    this.onClose = onClose;
    this.element = null;
    this._handleKeydown = this._handleKeydown.bind(this);
  }
  
  open() {
    this.element = this._createElement();
    document.body.appendChild(this.element);
    document.addEventListener('keydown', this._handleKeydown);
    this.element.querySelector('[data-close]').focus();
  }
  
  close() {
    this.element?.remove();
    document.removeEventListener('keydown', this._handleKeydown);
    this.onClose?.();
  }
  
  _handleKeydown(event) {
    if (event.key === 'Escape') this.close();
  }
  
  _createElement() {
    return createElement('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modal-title' }, [
      createElement('div', { class: 'modal__overlay', 'data-close': true }),
      createElement('div', { class: 'modal__content' }, [
        createElement('header', { class: 'modal__header' }, [
          createElement('h2', { id: 'modal-title', class: 'modal__title' }, this.title),
          createElement('button', { class: 'modal__close', 'data-close': true, 'aria-label': 'Close' }, '×')
        ]),
        createElement('div', { class: 'modal__body' }, this.content)
      ])
    ]);
  }
}
```

## Data Attributes for JS Hooks

```html
<!-- HTML -->
<button data-action="save" data-id="123">Save</button>

<!-- JS -->
document.body.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  
  const action = button.dataset.action;
  const id = button.dataset.id;
  
  if (action === 'save') handleSave(id);
});
```

## Performance

- **Debounce/throttle** frequent events:
  ```js
  function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }
  
  window.addEventListener('resize', debounce(onResize, 150));
  ```

- **Lazy load** non-critical modules:
  ```js
  const modalButton = $('#open-modal');
  modalButton.addEventListener('click', async () => {
    const { Modal } = await import('./components/Modal.js');
    new Modal({ title: 'Hello', content: 'World' }).open();
  });
  ```

- **RequestAnimationFrame** for animations:
  ```js
  function animate(element, keyframes, options) {
    return element.animate(keyframes, options);
  }
  ```

---

*Enforced by Claude Code. See AGENTS.md for full conventions.*