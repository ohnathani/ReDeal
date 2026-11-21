// Messages data layer: per-user localStorage persistence (redeal_messages_<userId>)
import { getProducts } from './products.js';

const storageKey = (userId) => `redeal_messages_${userId}`;
const minutesAgo = (m) => new Date(Date.now() - m * 60000).toISOString();

export function makeMessage(from, text) {
  return { id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, from, text, at: new Date().toISOString() };
}

function conversationFromProduct(product, messages = [], unread = 0) {
  return {
    id: `c_${product.id}`,
    productId: product.id,
    name: product.sellerName || 'Seller',
    initials: product.sellerInitials || '?',
    productTitle: product.title,
    productPrice: product.price,
    productImage: product.image || '',
    unread,
    messages
  };
}

function seed() {
  const products = getProducts();
  const items = Array.isArray(products) ? products.slice(0, 3) : [];
  const scripts = [
    [['me', 'Is this still available?', 190], ['them', 'Yes, it is! Are you interested?', 185]],
    [['me', 'Can you do a lower price?', 1500], ['them', 'I can do a small discount if we meet on campus.', 1490]],
    [['them', 'Hi! I saw you liked my listing. Any questions?', 60]]
  ];
  return items.map((product, i) => {
    const messages = scripts[i].map(([from, text, ago], n) => ({ id: `seed_${product.id}_${n}`, from, text, at: minutesAgo(ago) }));
    return conversationFromProduct(product, messages, i === 2 ? 1 : 0);
  });
}

export function saveConversations(userId, list) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(list));
  } catch (err) {
    console.error('Could not save messages', err);
  }
}

export function loadConversations(userId) {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey(userId)));
    if (Array.isArray(stored)) return stored;
  } catch (err) {
    console.error('Could not read messages', err);
  }
  const seeded = seed();
  saveConversations(userId, seeded);
  return seeded;
}

// Returns the existing conversation for a product, or creates one at the top of the list.
export function startConversation(list, product) {
  const id = `c_${product.id}`;
  let conv = list.find((c) => c.id === id);
  if (!conv) {
    conv = conversationFromProduct(product);
    list.unshift(conv);
  }
  return conv;
}
