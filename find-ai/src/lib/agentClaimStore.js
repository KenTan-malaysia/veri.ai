// src/lib/agentClaimStore.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Agent claim store with degraded localStorage fallback (v3.7.17).
//
// Mirrors the Supabase agent_claims table for v0 demo (single-device, two-tab).
// Used when /api/agent/claim/* return degradedMode:true OR Ken's pilots run
// before Supabase keys debug clears.
//
// Schema (matches DB):
//   id, agent_user_id (nullable), agent_name, agent_email, agent_agency,
//   agent_bovaep, agent_phone, trust_card_id, report_id, property_address,
//   landlord_user_id (nullable), landlord_email (nullable), status,
//   expires_at, responded_at, pin_verified_at, reject_reason, approval_hash,
//   forward_token, forward_token_used_at, is_verified_agent, created_at,
//   updated_at
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'fa_agent_claims_v1';
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

function readLS() {
  if (typeof window === 'undefined') return [];
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
  return 'ac-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
}

// 48-char base64url-ish token. Unguessable enough for v0; production should
// use a HMAC-signed value tied to the row's content.
export function generateForwardToken() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(36);
    crypto.getRandomValues(arr);
    return btoa(String.fromCharCode(...arr))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  // Fallback (less secure, only used if no crypto.getRandomValues)
  return Array.from({ length: 48 }, () =>
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'[Math.floor(Math.random() * 64)]
  ).join('');
}

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

export function localCreateClaim({
  agentName, agentEmail, agentAgency = null, agentBovaep = null, agentPhone = null,
  reportId, propertyAddress = null,
  landlordEmail = null,
}) {
  if (!agentName || !agentEmail || !reportId) return { ok: false, error: 'missing_fields' };
  const now = new Date().toISOString();
  const row = {
    id: uuid(),
    agent_user_id: null,
    agent_name: agentName,
    agent_email: agentEmail.toLowerCase(),
    agent_agency: agentAgency,
    agent_bovaep: agentBovaep,
    agent_phone: agentPhone,
    trust_card_id: null,
    report_id: reportId,
    property_address: propertyAddress,
    landlord_user_id: null,
    landlord_email: landlordEmail ? landlordEmail.toLowerCase() : null,
    status: 'pending',
    expires_at: new Date(Date.now() + EXPIRY_MS).toISOString(),
    responded_at: null,
    pin_verified_at: null,
    reject_reason: null,
    approval_hash: null,
    forward_token: null,
    forward_token_used_at: null,
    is_verified_agent: !!(agentBovaep && agentBovaep.trim()),  // optimistic v0; real verify later
    created_at: now,
    updated_at: now,
  };
  const list = readLS();
  list.unshift(row);
  writeLS(list);
  return { ok: true, claim: row };
}

export function localGetClaimById(id) {
  const list = withExpiry(readLS());
  return list.find((r) => r.id === id) || null;
}

export function localGetClaimByToken(token) {
  if (!token) return null;
  const list = withExpiry(readLS());
  return list.find((r) => r.forward_token === token && r.status === 'approved') || null;
}

export function localPendingForLandlord({ landlordEmail = null } = {}) {
  const list = withExpiry(readLS());
  return list
    .filter((r) => r.status === 'pending')
    .filter((r) => !landlordEmail || !r.landlord_email || r.landlord_email === landlordEmail.toLowerCase())
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
}

export function localAgentSent({ agentEmail = null } = {}) {
  const list = withExpiry(readLS());
  return list
    .filter((r) => !agentEmail || r.agent_email === agentEmail.toLowerCase())
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
}

export function localRespondClaim(id, { action, rejectReason = null, approvalHash = null }) {
  const list = readLS();
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return { ok: false, error: 'not_found' };
  const row = list[idx];
  if (row.status !== 'pending') return { ok: false, error: 'already_finalized', status: row.status };
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    list[idx] = { ...row, status: 'expired', updated_at: new Date().toISOString() };
    writeLS(list);
    return { ok: false, error: 'expired' };
  }
  const now = new Date().toISOString();
  const next = {
    ...row,
    status: action === 'approve' ? 'approved' : 'rejected',
    responded_at: now,
    pin_verified_at: action === 'approve' ? now : null,
    reject_reason: action === 'reject' ? rejectReason : null,
    approval_hash: action === 'approve' ? approvalHash : null,
    forward_token: action === 'approve' ? (row.forward_token || generateForwardToken()) : null,
    updated_at: now,
  };
  list[idx] = next;
  writeLS(list);
  return { ok: true, claim: next };
}

export function localWithdrawClaim(id) {
  const list = readLS();
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return { ok: false, error: 'not_found' };
  if (list[idx].status !== 'pending') return { ok: false, error: 'already_finalized' };
  list[idx] = { ...list[idx], status: 'withdrawn', updated_at: new Date().toISOString() };
  writeLS(list);
  return { ok: true, claim: list[idx] };
}

export function localMarkTokenUsed(token) {
  if (!token) return null;
  const list = readLS();
  const idx = list.findIndex((r) => r.forward_token === token);
  if (idx < 0) return null;
  if (list[idx].forward_token_used_at) return list[idx];  // already used
  list[idx] = { ...list[idx], forward_token_used_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  writeLS(list);
  return list[idx];
}

export async function computeClaimApprovalHash(row, ts = new Date().toISOString()) {
  if (typeof window === 'undefined' || !window.crypto?.subtle) return null;
  const text = `${row.id}|${row.report_id}|${row.agent_email}|${ts}`;
  const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Build a wa.me URL for the agent forwarding the screening link to the tenant.
export function buildAgentForwardUrl({ reportId, forwardToken }) {
  if (typeof window === 'undefined') return `/screen/${reportId}?agent=${forwardToken}`;
  return `${window.location.origin}/screen/${reportId}?agent=${forwardToken}`;
}

export function buildAgentToTenantWhatsApp({ reportId, forwardToken, propertyAddress = '', tenantPhone = '', lang = 'en' }) {
  const url = buildAgentForwardUrl({ reportId, forwardToken });
  const TEMPLATES = {
    en: ({ url, property }) => [
      `Hi — I'm helping with the rental${property ? ` at ${property}` : ''}. Please open this Veri.ai link to start your tenant screening (free, takes ~5 min):`,
      url,
      '',
      'You\'ll upload your LHDN cert + utility bills. Your identity stays anonymous by default — only released to the landlord if you approve via your Veri PIN.',
    ],
    bm: ({ url, property }) => [
      `Hai — saya membantu dengan sewa${property ? ` di ${property}` : ''}. Sila buka pautan Veri.ai ini untuk mula saringan penyewa anda (percuma, ~5 minit):`,
      url,
      '',
      'Anda akan muat naik sijil LHDN + bil utiliti. Identiti anda kekal tanpa nama secara lalai — hanya didedahkan kepada tuan tanah jika anda lulus melalui PIN Veri anda.',
    ],
    zh: ({ url, property }) => [
      `您好 — 我正在协助${property ? `「${property}」` : ''}的租赁。请打开此 Veri.ai 链接开始您的租客筛查（免费，约 5 分钟）：`,
      url,
      '',
      '您将上传 LHDN 证明 + 水电单。默认情况下您的身份保持匿名 — 只有在您通过 Veri PIN 批准后才会向房东披露。',
    ],
  };
  const lines = (TEMPLATES[lang] || TEMPLATES.en)({ url, property: propertyAddress });
  const msg = encodeURIComponent(lines.join('\n').trim());
  const phoneClean = String(tenantPhone || '').replace(/\D/g, '');
  return phoneClean ? `https://wa.me/${phoneClean}?text=${msg}` : `https://wa.me/?text=${msg}`;
}
