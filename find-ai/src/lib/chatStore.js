// src/lib/chatStore.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — multi-conversation chat store (v3.7.12).
//
// Backs the /chat workspace's conversation sidebar. Stores all conversations
// in `localStorage[CHAT_HISTORY_KEY]` as an array sorted by updatedAt desc.
// Active conversation tracked via `localStorage[ACTIVE_CHAT_ID_KEY]`.
//
// Schema:
//   Conversation = {
//     id:        string  // stable per-thread (uuidv4-ish)
//     title:     string  // human-readable, derived from first user message
//     messages:  Array<{role:'user'|'assistant', content:string}>
//     lang:      'en' | 'bm' | 'zh'
//     createdAt: ISO string
//     updatedAt: ISO string
//   }
//
// Storage location:
//   localStorage['fi_chat_history']  → JSON.stringify(Array<Conversation>)
//   localStorage['fi_active_chat_id'] → string (id of active conversation)
//
// Migration:
//   v3.7.7 stored a single-element array `[{caseRef, messages, lang, savedAt}]`.
//   `loadAll()` detects that shape (missing `id`) and migrates it transparently —
//   we generate an id, derive a title, and treat caseRef as id if present.
//
// All functions are SSR-safe — they no-op if `window` is undefined.
// ─────────────────────────────────────────────────────────────────────────────

import { CHAT_HISTORY_KEY, ACTIVE_CHAT_ID_KEY } from './storageKeys';

const MAX_CONVERSATIONS = 50; // hard cap to prevent unbounded localStorage growth

// ── id generator ───────────────────────────────────────────────────────────
export function newId() {
  // Time-prefixed for sortable IDs even if updatedAt clocks drift.
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `c-${ts}-${rand}`;
}

// ── title derivation ───────────────────────────────────────────────────────
export function deriveTitle(messages, fallback = 'New conversation') {
  const firstUser = (messages || []).find((m) => m && m.role === 'user' && m.content);
  if (!firstUser) return fallback;
  const raw = String(firstUser.content || '').trim();
  if (!raw) return fallback;
  // Take first sentence-ish chunk, max 60 chars.
  const cut = raw.split(/[\n.?!]/)[0].trim();
  const t = (cut || raw).slice(0, 60);
  return t.length < raw.length ? `${t}…` : t;
}

// ── core CRUD ──────────────────────────────────────────────────────────────
function safeRead() {
  if (typeof window === 'undefined') return null;
  try {
    const s = window.localStorage.getItem(CHAT_HISTORY_KEY);
    if (!s) return null;
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function safeWrite(list) {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = (list || []).slice(0, MAX_CONVERSATIONS);
    window.localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) { /* quota / blocked */ }
}

function migrate(raw) {
  // Already in new shape (every entry has id) → return as-is, sorted.
  if ((raw || []).every((c) => c && typeof c.id === 'string')) {
    return [...raw].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  }
  // Legacy single-conversation shape from v3.7.7 — migrate.
  const now = new Date().toISOString();
  return (raw || []).map((c) => {
    if (!c) return null;
    const id = c.id || c.caseRef || newId();
    const messages = Array.isArray(c.messages) ? c.messages : [];
    return {
      id,
      title: c.title || deriveTitle(messages),
      messages,
      lang: c.lang || 'en',
      createdAt: c.savedAt || c.createdAt || now,
      updatedAt: c.savedAt || c.updatedAt || now,
    };
  }).filter(Boolean);
}

export function loadAll() {
  const raw = safeRead();
  if (!raw) return [];
  return migrate(raw);
}

export function getActiveId() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(ACTIVE_CHAT_ID_KEY);
  } catch (e) { return null; }
}

export function setActiveId(id) {
  if (typeof window === 'undefined') return;
  try {
    if (id) window.localStorage.setItem(ACTIVE_CHAT_ID_KEY, id);
    else window.localStorage.removeItem(ACTIVE_CHAT_ID_KEY);
  } catch (e) { /* blocked */ }
}

export function getById(id) {
  if (!id) return null;
  return loadAll().find((c) => c.id === id) || null;
}

// Create a new conversation, persist, set active, return it.
export function createConversation({ lang = 'en', initialMessages = [] } = {}) {
  const now = new Date().toISOString();
  const conv = {
    id: newId(),
    title: deriveTitle(initialMessages),
    messages: initialMessages,
    lang,
    createdAt: now,
    updatedAt: now,
  };
  const list = [conv, ...loadAll()];
  safeWrite(list);
  setActiveId(conv.id);
  return conv;
}

// Save (upsert) a conversation. Bumps updatedAt + re-derives title if not pinned.
export function upsertConversation(conv) {
  if (!conv || !conv.id) return null;
  const now = new Date().toISOString();
  const list = loadAll();
  const idx = list.findIndex((c) => c.id === conv.id);
  const next = {
    ...conv,
    title: conv.title || deriveTitle(conv.messages),
    updatedAt: now,
  };
  if (idx >= 0) list[idx] = next;
  else list.unshift(next);
  // Re-sort by updatedAt desc so saved one floats to top.
  list.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  safeWrite(list);
  return next;
}

// Update messages for an existing conversation by id (most common path).
export function updateMessages(id, messages, lang) {
  if (!id) return null;
  const list = loadAll();
  const idx = list.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  const now = new Date().toISOString();
  const existing = list[idx];
  const next = {
    ...existing,
    messages,
    lang: lang || existing.lang,
    // Re-derive title only if it was the auto-default (still 'New conversation' or empty)
    title: (existing.title && existing.title !== 'New conversation')
      ? existing.title
      : deriveTitle(messages, existing.title),
    updatedAt: now,
  };
  list[idx] = next;
  list.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  safeWrite(list);
  return next;
}

export function deleteConversation(id) {
  if (!id) return;
  const list = loadAll().filter((c) => c.id !== id);
  safeWrite(list);
  // If active was deleted, clear it.
  if (getActiveId() === id) setActiveId(null);
}

export function renameConversation(id, title) {
  if (!id) return null;
  const list = loadAll();
  const idx = list.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], title: title || deriveTitle(list[idx].messages), updatedAt: new Date().toISOString() };
  safeWrite(list);
  return list[idx];
}

// Convenience: human-friendly relative time (no external lib).
export function relativeTime(iso, lang = 'en') {
  if (!iso) return '';
  const now = Date.now();
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Math.max(0, now - then);
  const min = Math.round(diff / 60000);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  const L = {
    en: { now: 'just now', minAgo: (n) => `${n}m ago`, hrAgo: (n) => `${n}h ago`, dayAgo: (n) => `${n}d ago`, longAgo: 'a while ago' },
    bm: { now: 'baru saja', minAgo: (n) => `${n}m lalu`, hrAgo: (n) => `${n}j lalu`, dayAgo: (n) => `${n}h lalu`, longAgo: 'lama dahulu' },
    zh: { now: '刚才', minAgo: (n) => `${n}分钟前`, hrAgo: (n) => `${n}小时前`, dayAgo: (n) => `${n}天前`, longAgo: '很久以前' },
  };
  const t = L[lang] || L.en;
  if (min < 1) return t.now;
  if (min < 60) return t.minAgo(min);
  if (hr < 24) return t.hrAgo(hr);
  if (day < 30) return t.dayAgo(day);
  return t.longAgo;
}
