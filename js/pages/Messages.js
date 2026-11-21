// Messages page: conversation list, search, filter, thread, composer, simulated replies
import { $, createElement } from '../utils/dom.js';
import { delegate, onReady } from '../utils/events.js';
import { initHeader } from '../components/Header.js';
import { requireAuth } from '../utils/auth-guard.js';
import { getProduct } from '../data/products.js';
import { loadConversations, saveConversations, startConversation, makeMessage } from '../data/messages.js';

const MAX_LENGTH = 500;
const REPLY_DELAY_MS = 1200;
const QUICK_REPLIES = ['Is this still available?', 'Can you do a lower price?', 'Where can we meet on campus?', 'Thanks!'];
const AUTO_REPLIES = [
  [/available/i, 'Yes, it is still available!'],
  [/price|lower|discount|offer/i, 'I can do a small discount if we meet on campus.'],
  [/meet|where|pickup/i, 'How about the campus gate? What time works for you?'],
  [/thank/i, 'You are welcome!']
];
const DEFAULT_REPLY = 'Sure! Let me know what works for you.';
const state = { user: null, list: [], activeId: null, typingId: null, filter: 'all', query: '' };
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
const dateFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

const lastMessage = (conv) => conv.messages[conv.messages.length - 1];
const getActive = () => state.list.find((c) => c.id === state.activeId);
const persist = () => saveConversations(state.user.id, state.list);

function formatStamp(iso) {
  const date = new Date(iso);
  return date.toDateString() === new Date().toDateString() ? timeFormat.format(date) : dateFormat.format(date);
}

function visibleConversations() {
  const query = state.query.trim().toLowerCase();
  const sortKey = (c) => new Date(lastMessage(c)?.at ?? Date.now());
  return state.list
    .filter((c) => state.filter === 'all' || c.unread > 0)
    .filter((c) => !query || [c.name, c.productTitle, lastMessage(c)?.text].some((t) => String(t ?? '').toLowerCase().includes(query)))
    .sort((a, b) => sortKey(b) - sortKey(a));
}

function renderItem(conv) {
  const last = lastMessage(conv);
  const active = conv.id === state.activeId;
  const attrs = { class: `chat__item${active ? ' chat__item--active' : ''}`, type: 'button', dataset: { id: conv.id } };
  if (active) attrs['aria-current'] = 'true';
  return createElement('li', {},
    createElement('button', attrs,
      createElement('span', { class: 'chat__avatar', 'aria-hidden': 'true' }, conv.initials),
      createElement('span', { class: 'chat__item-body' },
        createElement('span', { class: 'chat__item-top' },
          createElement('span', { class: 'chat__item-name' }, conv.name),
          last ? createElement('time', { class: 'chat__item-time', datetime: last.at }, formatStamp(last.at)) : ''),
        createElement('span', { class: 'chat__item-product' }, conv.productTitle || 'Listing'),
        createElement('span', { class: 'chat__item-preview' }, last ? last.text : 'No messages yet')),
      conv.unread > 0
        ? createElement('span', { class: 'chat__badge' }, String(conv.unread), createElement('span', { class: 'visually-hidden' }, ' unread'))
        : ''));
}

function renderList() {
  const items = visibleConversations();
  $('#conversation-list').replaceChildren(...items.map(renderItem));
  $('#list-empty').hidden = items.length > 0;
  const unread = state.list.filter((c) => c.unread > 0).length;
  $('[data-filter="unread"]').textContent = unread ? `Unread (${unread})` : 'Unread';
}

function renderBubble(msg) {
  return createElement('div', { class: `bubble bubble--${msg.from}` },
    createElement('p', { class: 'bubble__text' }, msg.text),
    createElement('time', { class: 'bubble__time', datetime: msg.at }, formatStamp(msg.at)));
}

function renderThread() {
  const conv = getActive();
  $('#chat').classList.toggle('chat--thread-open', Boolean(conv));
  if (!conv) return;
  const price = Number(conv.productPrice);
  const image = $('#thread-product-image');
  $('#thread-name').textContent = conv.name;
  $('#thread-product').href = `product.html?id=${encodeURIComponent(conv.productId)}`;
  $('#thread-product-title').textContent = conv.productTitle || 'View listing';
  $('#thread-product-price').textContent = Number.isFinite(price) && price > 0 ? `₱${price.toLocaleString()}` : '';
  image.hidden = !conv.productImage;
  if (conv.productImage) image.src = conv.productImage;
  const typing = $('#typing');
  typing.hidden = state.typingId !== conv.id;
  typing.textContent = `${conv.name} is typing…`;
  const log = $('#message-log');
  log.replaceChildren(...(conv.messages.length
    ? conv.messages.map(renderBubble)
    : [createElement('p', { class: 'chat__hint' }, `Say hello to ${conv.name}.`)]));
  log.scrollTop = log.scrollHeight;
}

function openConversation(id) {
  state.activeId = id;
  const conv = getActive();
  if (!conv) return;
  conv.unread = 0;
  persist();
  renderList();
  renderThread();
  $('#thread-name').focus();
}

function scheduleReply(conv, text) {
  state.typingId = conv.id;
  renderThread();
  window.setTimeout(() => {
    const [, reply] = AUTO_REPLIES.find(([pattern]) => pattern.test(text)) ?? [null, DEFAULT_REPLY];
    conv.messages.push(makeMessage('them', reply));
    conv.unread = conv.id === state.activeId ? 0 : conv.unread + 1;
    state.typingId = null;
    persist();
    renderList();
    renderThread();
  }, REPLY_DELAY_MS);
}

function sendMessage(text) {
  const conv = getActive();
  const clean = text.trim().slice(0, MAX_LENGTH);
  if (!conv || !clean) return;
  conv.messages.push(makeMessage('me', clean));
  persist();
  renderList();
  scheduleReply(conv, clean);
}

function setupComposer() {
  const form = $('#composer');
  const input = $('#message-input');
  const send = $('#send-btn');
  const sync = () => {
    send.disabled = !input.value.trim();
    input.style.height = 'auto';
    input.style.height = `${input.scrollHeight}px`;
  };
  input.addEventListener('input', sync);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage(input.value);
    input.value = '';
    sync();
  });
  $('#quick-replies').replaceChildren(...QUICK_REPLIES.map((text) =>
    createElement('button', { class: 'chat__chip', type: 'button' }, text)));
  delegate($('#quick-replies'), '.chat__chip', 'click', function () { sendMessage(this.textContent); });
}

function setupListControls() {
  delegate($('#conversation-list'), '.chat__item', 'click', function () { openConversation(this.dataset.id); });
  delegate($('.chat__tabs'), '[data-filter]', 'click', function () {
    state.filter = this.dataset.filter;
    document.querySelectorAll('.chat__tab').forEach((tab) => {
      const on = tab === this;
      tab.classList.toggle('chat__tab--active', on);
      tab.setAttribute('aria-pressed', String(on));
    });
    renderList();
  });
  $('#message-search')?.addEventListener('input', (e) => {
    state.query = e.target.value;
    renderList();
  });
  $('#back-btn').addEventListener('click', () => {
    state.activeId = null;
    renderThread();
    renderList();
  });
}

// messages.html?product=<id> opens (or creates) a conversation with that product's seller
function openFromQuery() {
  const productId = new URLSearchParams(window.location.search).get('product');
  const product = productId ? getProduct(productId) : null;
  if (!product) return;
  openConversation(startConversation(state.list, product).id);
  window.history.replaceState(null, '', window.location.pathname);
}

function init() {
  const user = requireAuth({ redirectTo: 'messages.html' });
  if (!user) return;
  initHeader({});
  state.user = user;
  state.list = loadConversations(user.id);
  setupListControls();
  setupComposer();
  renderList();
  openFromQuery();
}

onReady(init);
