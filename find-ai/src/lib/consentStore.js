// src/lib/consentStore.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Consent request store with degraded localStorage fallback (v3.7.14).
//
// Server-of-truth path: Supabase consent_requests table (see 0002 migration).
// Used by /api/consent/{request,inbox,respond}.
//
// Degraded path: this module's localStorage layer. When the API routes return
// `degradedMode: true` (Supabase not configured), the browser falls back to
// these helpers so pilots can demo the full UOB-style PIN flow on a single
// device — even open two tabs (landlord tab creates request, tenant tab sees
// it in /inbox, PIN-approves, /trust auto-flips tier).
//
// Schema (matches Supabase consent_requests):
//   {
//     id, requester_role, requester_display, target_anon_id, target_email,
//     report_id, requested_tier, current_tier, reason, property_address,
//     status, expires_at, responded_at, pin_verified_at, decline_reason,
//     approval_hash, created_at, updated_at
//   }
//
// All functions are SSR-safe.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'fa_consent_requests_v1';     // array of consent request rows
const DAY = 24 * 60 * 60 * 1000;
const EXPIRY_MS = 7 * DAY;

function readLS() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function writeLS(list) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list || []));
  } catch (e) { /* blocked */ }
}

function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'cr-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
}

// Auto-expire pending rows older than 7 days on every read.
function withExpiry(list) {
  const now = Date.now();
  let dirty = false;
  const out = list.map((r) => {
    if (r.status === 'pending' && r.expires_at && new Date(r.expires_at).getTime() < now) {
      dirty = true;
      return { ...r, status: 'expired', updated_at: new Date().toISOString() };
    }
    return r;
  });
  if (dirty) writeLS(out);
  return out;
}

export function localCreate({
  requesterDisplay = 'Landlord',
  requesterRole = 'landlord',
  targetAnonId,
  targetEmail = null,
  reportId,
  requestedTier,
  currentTier,
  reason = '',
  propertyAddress = '',
}) {
  if (!targetAnonId || !reportId || !requestedTier || !currentTier) {
    return { ok: false, error: 'missing_fields' };
  }
  const now = new Date().toISOString();
  const row = {
    id: uuid(),
    requester_user_id: null,
    requester_role: requesterRole,
    requester_display: requesterDisplay,
    target_user_id: null,
    target_anon_id: targetAnonId,
    target_email: targetEmail,
    trust_card_id: null,
    report_id: reportId,
    requested_tier: requestedTier,
    current_tier: currentTier,
    reason,
    property_address: propertyAddress,
    status: 'pending',
    expires_at: new Date(Date.now() + EXPIRY_MS).toISOString(),
    responded_at: null,
    pin_verified_at: null,
    decline_reason: null,
    approval_hash: null,
    created_at: now,
    updated_at: now,
  };
  const list = readLS();
  list.unshift(row);
  writeLS(list);
  return { ok: true, request: row };
}

export function localGetById(id) {
  const list = withExpiry(readLS());
  return list.find((r) => r.id === id) || null;
}

export function localInbox({ targetEmail = null } = {}) {
  const list = withExpiry(readLS());
  return list
    .filter((r) => r.status === 'pending' && (!targetEmail || !r.target_email || r.target_email === targetEmail))
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
}

// v3.7.15 — Sent-tab listing (degraded mode). Local doesn't track requester
// identity (no auth), so for v0 demo we return ALL non-cancelled rows in
// reverse-chrono. Once Supabase is live, /api/consent/sent owns this query.
export function localSent({ status = 'all' } = {}) {
  const list = withExpiry(readLS());
  return list
    .filter((r) => status === 'all' ? true : r.status === status)
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
}

// v3.7.15 — Landlord-side cancel of a pending consent.
export function localCancel(id) {
  const list = readLS();
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return { ok: false, error: 'not_found' };
  const row = list[idx];
  if (row.status !== 'pending') return { ok: false, error: 'already_finalized', status: row.status };
  const now = new Date().toISOString();
  list[idx] = { ...row, status: 'cancelled', updated_at: now };
  writeLS(list);
  return { ok: true, request: list[idx] };
}

export function localRespond(id, { action, declineReason = null, approvalHash = null }) {
  const list = readLS();
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return { ok: false, error: 'not_found' };
  const row = list[idx];
  if (row.status !== 'pending') return { ok: false, error: 'already_responded', status: row.status };
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    list[idx] = { ...row, status: 'expired', updated_at: new Date().toISOString() };
    writeLS(list);
    return { ok: false, error: 'expired' };
  }
  const now = new Date().toISOString();
  const next = {
    ...row,
    status: action === 'approve' ? 'approved' : 'declined',
    responded_at: now,
    pin_verified_at: action === 'approve' ? now : null,
    decline_reason: action === 'decline' ? declineReason : null,
    approval_hash: action === 'approve' ? approvalHash : null,
    updated_at: now,
  };
  list[idx] = next;
  writeLS(list);
  return { ok: true, request: next };
}

// SHA-256 of (id | targetAnonId | requestedTier | timestamp) — used as Section 90A
// approval hash. Computed client-side in degraded mode.
export async function computeApprovalHash(row, ts = new Date().toISOString()) {
  if (typeof window === 'undefined' || !window.crypto?.subtle) return null;
  const text = `${row.id}|${row.target_anon_id}|${row.requested_tier}|${ts}`;
  const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Build a wa.me share URL with a templated message for the tenant.
// Phone is optional — if absent, returns the bare wa.me link the landlord
// can paste into any chat. v3.7.15 — supports EN/BM/中文 templates.
export function buildWhatsAppShareUrl({ requestId, requesterDisplay, propertyAddress, requestedTier, phone = '', lang = 'en' }) {
  const TIER_LABELS = {
    en: {
      T1: 'categorical info (age range, citizenship)',
      T2: 'first name',
      T3: 'last name',
      T4: 'phone, email, employer',
      T5: 'IC (signing-time only)',
    },
    bm: {
      T1: 'maklumat kategori (julat umur, kewarganegaraan)',
      T2: 'nama pertama',
      T3: 'nama keluarga',
      T4: 'telefon, emel, majikan',
      T5: 'IC (hanya semasa menandatangani)',
    },
    zh: {
      T1: '类别信息（年龄段、国籍）',
      T2: '名字',
      T3: '姓氏',
      T4: '电话、邮箱、雇主',
      T5: '身份证（仅签约时）',
    },
  };
  const TEMPLATES = {
    en: ({ requester, what, property, url }) => [
      `Hi — ${requester} on Veri.ai is requesting your ${what}${property ? ` for ${property}` : ''}.`,
      '',
      'Open the link to review and approve with your Veri PIN:',
      url,
      '',
      "(Veri.ai is Malaysia's pre-signing trust toolkit. Free for tenants. No identity is shared without your PIN approval.)",
    ],
    bm: ({ requester, what, property, url }) => [
      `Hai — ${requester} di Veri.ai meminta ${what} anda${property ? ` untuk ${property}` : ''}.`,
      '',
      'Buka pautan untuk semak dan luluskan dengan PIN Veri anda:',
      url,
      '',
      '(Veri.ai ialah alat kepercayaan pra-tandatangan Malaysia. Percuma untuk penyewa. Tiada identiti dikongsi tanpa kelulusan PIN anda.)',
    ],
    zh: ({ requester, what, property, url }) => [
      `您好 — Veri.ai 上的 ${requester} 请求您的${what}${property ? `（房产：${property}）` : ''}。`,
      '',
      '打开链接，使用您的 Veri PIN 审核并批准：',
      url,
      '',
      '（Veri.ai 是马来西亚的签约前信任工具。租客免费。未经您的 PIN 批准，绝不分享任何身份信息。）',
    ],
  };
  const langKey = TEMPLATES[lang] ? lang : 'en';
  const tierMap = TIER_LABELS[langKey] || TIER_LABELS.en;
  const what = tierMap[requestedTier] || (langKey === 'bm' ? 'maklumat identiti' : langKey === 'zh' ? '身份信息' : 'identity info');
  const url = (typeof window !== 'undefined' ? window.location.origin : 'https://veri.ai') + `/consent/${requestId}`;
  const lines = TEMPLATES[langKey]({
    requester: requesterDisplay || (langKey === 'bm' ? 'seorang tuan tanah' : langKey === 'zh' ? '一位房东' : 'a landlord'),
    what,
    property: propertyAddress || '',
    url,
  });
  const msg = encodeURIComponent(lines.join('\n').trim());
  const phoneClean = String(phone || '').replace(/\D/g, '');
  return phoneClean ? `https://wa.me/${phoneClean}?text=${msg}` : `https://wa.me/?text=${msg}`;
}
