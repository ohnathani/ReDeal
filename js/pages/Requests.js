
// Requests page: post a request, filter by category, search, delete your own
import { $, createElement } from '../utils/dom.js';
import { delegate, onReady } from '../utils/events.js';
import { initHeader } from '../components/Header.js';
import { requireAuth } from '../utils/auth-guard.js';

const STORAGE_KEY = 'redeal_requests';
const DAY_MS = 86400000;
// Local list for now; swap for js/data/categories.js if you want one shared source.
const CATEGORIES = ['Books & Textbooks', 'Electronics', 'Clothing', 'Furniture', 'School Supplies', 'Sports', 'Other'];

const FIELDS = {
  title: { id: 'request-title', validate: (v) => (v.length < 5 ? 'Title must be at least 5 characters.' : '') },
  category: { id: 'request-category', validate: (v) => (v ? '' : 'Please choose a category.') },
  budget: { id: 'request-budget', validate: (v) => (/^\d+$/.test(v) && Number(v) >= 1 ? '' : 'Enter a whole number of 1 or more.') },
  description: { id: 'request-description', validate: (v) => (v.length < 10 ? 'Details must be at least 10 characters.' : '') }
};

const state = { user: null, requests: [], category: 'All', query: '', highlightId: null };

/* ---------- Data ---------- */
function seedRequests() {
  const hoursAgo = (h) => new Date(Date.now() - h * 3600000).toISOString();
  return [
    { id: 'req_seed_1', title: 'Calculus textbook (Stewart)', category: 'Books & Textbooks', budget: 600, description: 'Any recent edition is fine. Pencil marks okay. Can meet near the library.', authorId: 'seed', authorName: 'Maria S.', createdAt: hoursAgo(2) },
    { id: 'req_seed_2', title: 'Mini fan or desk lamp', category: 'Electronics', budget: 300, description: 'Looking for something small for a dorm desk. Working condition only.', authorId: 'seed', authorName: 'Jon R.', createdAt: hoursAgo(30) },
    { id: 'req_seed_3', title: 'Used PE uniform (size M)', category: 'Clothing', budget: 250, description: 'Clean and complete set if possible. Happy to pick up on campus.', authorId: 'seed', authorName: 'Ana L.', createdAt: hoursAgo(72) }
  ];
}

function loadRequests() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored)) return stored;
  } catch (err) {
    console.error('Could not read requests', err);
  }
  return seedRequests();
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.requests));
  } catch (err) {
    console.error('Could not save requests', err);
  }
}

/* ---------- Rendering ---------- */
function timeAgo(iso) {
  const minutes = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} h ago`;
  return `${Math.floor(minutes / 1440)} d ago`;
}

function renderCard(req) {
  const mine = req.authorId === state.user.id;
  const isNew = Date.now() - new Date(req.createdAt) < DAY_MS;
  const classes = ['request-card', mine && 'request-card--mine', req.id === state.highlightId && 'request-card--highlight'].filter(Boolean).join(' ');
  return createElement('article', { class: classes },
    createElement('div', { class: 'request-card__tags' },
      createElement('span', { class: 'request-card__category' }, req.category),
      isNew ? createElement('span', { class: 'request-card__badge request-card__badge--new' }, 'New') : '',
      mine ? createElement('span', { class: 'request-card__badge request-card__badge--mine' }, 'Your request') : ''),
    createElement('h3', { class: 'request-card__title' }, req.title),
    createElement('p', { class: 'request-card__budget' },
      createElement('span', { class: 'request-card__budget-label' }, 'Budget'),
      createElement('span', { class: 'request-card__budget-amount' }, `₱${req.budget.toLocaleString()}`)),
    createElement('p', { class: 'request-card__description' }, req.description),
    createElement('div', { class: 'request-card__footer' },
      createElement('span', { class: 'request-card__time' }, `${req.authorName} · ${timeAgo(req.createdAt)}`),
      mine
        ? createElement('button', { class: 'request-card__action request-card__action--ghost', type: 'button', dataset: { action: 'delete', id: req.id } }, 'Delete')
        : createElement('a', { class: 'request-card__action', href: 'messages.html' }, 'I have this')));
}

function renderChips() {
  const chip = (label) => createElement('button',
    { class: 'requests-chip', type: 'button', 'aria-pressed': String(state.category === label), dataset: { category: label } }, label);
  $('#request-chips').replaceChildren(...['All', ...CATEGORIES].map(chip));
}

function render() {
  const query = state.query.trim().toLowerCase();
  const items = state.requests.filter((r) =>
    (state.category === 'All' || r.category === state.category) &&
    (!query || `${r.title} ${r.description}`.toLowerCase().includes(query)));
  $('#requests-list').replaceChildren(...items.map(renderCard));
  $('#requests-count').textContent = `${items.length} ${items.length === 1 ? 'request' : 'requests'}`;
  $('#requests-empty').hidden = items.length > 0;
  const none = state.requests.length === 0;
  $('#requests-empty-title').textContent = none ? 'No requests yet' : 'No matching requests';
  $('#requests-empty-message').textContent = none
    ? "Post what you're looking for and sellers can reach out."
    : 'Try a different category or search.';
}

let statusTimer;
function setStatus(message) {
  $('#request-status').textContent = message;
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => { $('#request-status').textContent = ''; }, 4000);
}

/* ---------- Form ---------- */
function validateField(name, show) {
  const { id, validate } = FIELDS[name];
  const input = $(`#${id}`);
  const message = validate(input.value.trim());
  if (show) {
    const error = $(`#${id}-error`);
    error.textContent = message;
    error.hidden = !message;
    input.setAttribute('aria-invalid', String(Boolean(message)));
  }
  return !message;
}

function updateSubmit() {
  const valid = Object.keys(FIELDS).map((name) => validateField(name, false)).every(Boolean);
  const button = $('#request-submit');
  button.disabled = !valid;
  button.setAttribute('aria-disabled', String(!valid));
}

function resetForm() {
  $('#request-form').reset();
  Object.values(FIELDS).forEach(({ id }) => {
    $(`#${id}-error`).hidden = true;
    $(`#${id}`).removeAttribute('aria-invalid');
    delete $(`#${id}`).dataset.touched;
  });
  updateSubmit();
}

function setFormOpen(open) {
  $('#request-form-section').hidden = !open;
  const button = $('#toggle-form-btn');
  button.setAttribute('aria-expanded', String(open));
  button.textContent = open ? 'Cancel' : 'Post a request';
  if (open) $('#request-title').focus();
}

function submitRequest() {
  if (!Object.keys(FIELDS).map((name) => validateField(name, true)).every(Boolean)) return;
  const value = (name) => $(`#${FIELDS[name].id}`).value.trim();
  const request = {
    id: `req_${Date.now()}`,
    title: value('title'),
    category: value('category'),
    budget: Number(value('budget')),
    description: value('description'),
    authorId: state.user.id,
    authorName: state.user.name || 'You',
    createdAt: new Date().toISOString()
  };
  state.requests.unshift(request);
  state.highlightId = request.id;
  state.category = 'All';
  state.query = '';
  $('#request-search').value = '';
  persist();
  resetForm();
  setFormOpen(false);
  renderChips();
  render();
  setStatus('Your request was posted.');
  window.setTimeout(() => { state.highlightId = null; render(); }, 4000);
}

function setupForm() {
  const form = $('#request-form');
  const nameOf = (el) => Object.keys(FIELDS).find((name) => FIELDS[name].id === el.id);
  form.addEventListener('input', (e) => {
    const name = nameOf(e.target);
    if (name && e.target.dataset.touched) validateField(name, true);
    updateSubmit();
  });
  form.addEventListener('focusout', (e) => {
    const name = nameOf(e.target);
    if (!name) return;
    e.target.dataset.touched = 'true';
    validateField(name, true);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitRequest();
  });
  $('#request-category').append(...CATEGORIES.map((c) => createElement('option', { value: c }, c)));
  $('#toggle-form-btn').addEventListener('click', () => setFormOpen($('#request-form-section').hidden));
  updateSubmit();
}

/* ---------- List controls ---------- */
function setupList() {
  delegate($('#request-chips'), '.requests-chip', 'click', function () {
    state.category = this.dataset.category;
    renderChips();
    render();
  });
  $('#request-search').addEventListener('input', (e) => {
    state.query = e.target.value;
    render();
  });
  // Two-step delete (no native confirm): first click arms it, second click deletes.
  delegate($('#requests-list'), '[data-action="delete"]', 'click', function () {
    if (this.dataset.confirm !== 'true') {
      this.dataset.confirm = 'true';
      this.textContent = 'Confirm delete?';
      window.setTimeout(() => {
        if (this.isConnected && this.dataset.confirm === 'true') {
          delete this.dataset.confirm;
          this.textContent = 'Delete';
        }
      }, 4000);
      return;
    }
    state.requests = state.requests.filter((r) => r.id !== this.dataset.id);
    persist();
    render();
    setStatus('Request deleted.');
  });
}

function init() {
  const user = requireAuth({ redirectTo: 'requests.html' });
  if (!user) return;
  initHeader({});
  state.user = user;
  state.requests = loadRequests();
  setupForm();
  setupList();
  renderChips();
  render();
}

onReady(init);
