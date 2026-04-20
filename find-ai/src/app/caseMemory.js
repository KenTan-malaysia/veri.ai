'use client';

// ═══════════════════════════════════════════════════════════════════════
// Find.ai — Case-File Memory Module
//
// Per-case persistent context that rides along with each chat thread.
// Extends the existing chatHistory item shape (id, title, messages, ...)
// with an optional `memory` sub-object — backwards compatible.
//
// Scope: case-file memory (NOT global cross-session memory).
// Storage: localStorage, via the existing fi_chat_history key.
// PDPA: tenant fields are gated behind an explicit consent gate
//       (fi_pdpa_consent) per PDPA 2010 + 2024 amendments.
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

// ───────────────────────────────────────────────────────────────────────
// Case types — used for routing + system prompt framing
// ───────────────────────────────────────────────────────────────────────
export const CASE_TYPES = [
  { key: 'general',        icon: '💬', en: 'General',            bm: 'Umum',               zh: '一般咨询' },
  { key: 'rent_default',   icon: '💸', en: 'Rent default',       bm: 'Tunggakan sewa',     zh: '欠租纠纷' },
  { key: 'deposit_dispute',icon: '🔒', en: 'Deposit dispute',    bm: 'Pertikaian deposit', zh: '押金争议' },
  { key: 'eviction',       icon: '🚪', en: 'Eviction',           bm: 'Pengusiran',         zh: '驱逐租客' },
  { key: 'stamp_duty',     icon: '📄', en: 'Stamp duty / SDSAS', bm: 'Duti setem / SDSAS', zh: '印花税 / SDSAS' },
  { key: 'commercial',     icon: '🏪', en: 'Commercial lease',   bm: 'Sewa komersial',     zh: '商业租约' },
  { key: 'industrial',     icon: '🏭', en: 'Industrial / CN-MY', bm: 'Industri / CN-MY',   zh: '工业 / 中马' },
];

// ───────────────────────────────────────────────────────────────────────
// localStorage helpers — match page.js conventions
// ───────────────────────────────────────────────────────────────────────
const PDPA_KEY = 'fi_pdpa_consent';

const safeLoad = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

const safeSave = (key, val) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

// ───────────────────────────────────────────────────────────────────────
// PDPA consent helpers — tenant data is ONLY usable after explicit grant
// ───────────────────────────────────────────────────────────────────────
export function hasPdpaConsent(type = 'tenantData') {
  const c = safeLoad(PDPA_KEY, {});
  return Boolean(c[type]);
}

export function grantPdpaConsent(type = 'tenantData') {
  const c = safeLoad(PDPA_KEY, {});
  c[type] = true;
  c.timestamp = Date.now();
  safeSave(PDPA_KEY, c);
  return c;
}

export function revokePdpaConsent(type = 'tenantData') {
  const c = safeLoad(PDPA_KEY, {});
  delete c[type];
  c.revokedAt = Date.now();
  safeSave(PDPA_KEY, c);
  return c;
}

// ───────────────────────────────────────────────────────────────────────
// Empty memory factory — used by New Case modal + fallback for old chats
// ───────────────────────────────────────────────────────────────────────
export function emptyMemory() {
  return {
    property: { nickname: '', state: '', propertyType: '', address: '', monthlyRent: '' },
    disputes: [],
    taxDates: { lastStampDate: '', assessmentDue: '', insuranceRenewal: '', myInvoisStatus: '' },
    tenant:  { name: '', icLast4: '', usccOrPassport: '', deposit: '', consented: false, consentedAt: null },
  };
}

// ───────────────────────────────────────────────────────────────────────
// buildCaseMemoryContext — compile memory object into a single string
// that the API injects into the system prompt.
//
// Rules:
//  - Never emit empty sections (keeps context short).
//  - Tenant block is redacted if consent is missing.
//  - Output is plain text (no markdown) — the system prompt wraps it.
// ───────────────────────────────────────────────────────────────────────
export function buildCaseMemoryContext(memory, opts = {}) {
  if (!memory || typeof memory !== 'object') return '';
  const lines = [];
  const consent = typeof opts.tenantConsent === 'boolean' ? opts.tenantConsent : hasPdpaConsent('tenantData');

  // Property portfolio
  const p = memory.property || {};
  const propBits = [];
  if (p.nickname)      propBits.push(`Nickname: ${p.nickname}`);
  if (p.state)         propBits.push(`State: ${p.state}`);
  if (p.propertyType)  propBits.push(`Type: ${p.propertyType}`);
  if (p.address)       propBits.push(`Address: ${p.address}`);
  if (p.monthlyRent)   propBits.push(`Monthly rent: RM${p.monthlyRent}`);
  if (propBits.length) {
    lines.push('PROPERTY');
    propBits.forEach(b => lines.push(`- ${b}`));
  }

  // Active disputes / timeline
  const disputes = Array.isArray(memory.disputes) ? memory.disputes : [];
  if (disputes.length) {
    lines.push('');
    lines.push('CASE TIMELINE');
    disputes.slice(-8).forEach(d => {
      const date = d.date || '—';
      const action = d.action || '';
      const note = d.note ? ` · ${d.note}` : '';
      lines.push(`- ${date}: ${action}${note}`);
    });
  }

  // Tax + compliance dates
  const t = memory.taxDates || {};
  const taxBits = [];
  if (t.lastStampDate)     taxBits.push(`Last stamp duty paid: ${t.lastStampDate}`);
  if (t.assessmentDue)     taxBits.push(`Cukai taksiran due: ${t.assessmentDue}`);
  if (t.insuranceRenewal)  taxBits.push(`Insurance renewal: ${t.insuranceRenewal}`);
  if (t.myInvoisStatus)    taxBits.push(`MyInvois status: ${t.myInvoisStatus}`);
  if (taxBits.length) {
    lines.push('');
    lines.push('TAX / COMPLIANCE DATES');
    taxBits.forEach(b => lines.push(`- ${b}`));
  }

  // Tenant — PDPA-gated
  const tn = memory.tenant || {};
  const tenantHasData = tn.name || tn.icLast4 || tn.usccOrPassport || tn.deposit;
  if (tenantHasData) {
    lines.push('');
    if (consent && tn.consented) {
      lines.push('TENANT (user-provided, PDPA consent on file)');
      if (tn.name)            lines.push(`- Name: ${tn.name}`);
      if (tn.icLast4)         lines.push(`- IC (last 4): ****${tn.icLast4}`);
      if (tn.usccOrPassport)  lines.push(`- USCC / passport: ${tn.usccOrPassport}`);
      if (tn.deposit)         lines.push(`- Deposit held: RM${tn.deposit}`);
    } else {
      lines.push('TENANT — REDACTED (no PDPA consent). Do not reference tenant identity details.');
    }
  }

  return lines.join('\n').trim();
}

// ───────────────────────────────────────────────────────────────────────
// UI language strings
// ───────────────────────────────────────────────────────────────────────
const UI = {
  en: {
    title: 'Case memory',
    subtitle: 'Context I remember for this case',
    explainer: 'Everything stays on your device. I use this to give continuity across follow-ups — not as legal advice.',
    property: 'Property',
    nickname: 'Nickname (e.g. "Mont Kiara unit")',
    state: 'State',
    propertyType: 'Type',
    address: 'Address',
    monthlyRent: 'Monthly rent (RM)',
    caseType: 'Case type',
    disputes: 'Case timeline',
    addEvent: 'Add event',
    eventDate: 'Date',
    eventAction: 'What happened',
    eventNote: 'Note (optional)',
    taxDates: 'Tax & compliance',
    lastStampDate: 'Last stamp duty paid',
    assessmentDue: 'Cukai taksiran due',
    insuranceRenewal: 'Insurance renewal',
    myInvoisStatus: 'MyInvois status',
    tenant: 'Tenant details',
    tenantName: 'Tenant name',
    icLast4: 'IC (last 4 digits only)',
    uscc: 'USCC / passport',
    deposit: 'Deposit held (RM)',
    pdpaHeader: 'Storing tenant data — PDPA 2010 consent required',
    pdpaBody: 'Malaysia\'s Personal Data Protection Act requires explicit consent before you record a tenant\'s identifying information — even on your own device. Tick the box if the tenant has agreed.',
    pdpaAgree: 'The tenant has consented to this information being stored in Find.ai for case management purposes.',
    pdpaLocked: 'Tenant fields are locked until consent is granted.',
    save: 'Save memory',
    cancel: 'Cancel',
    clear: 'Clear memory',
    close: 'Close',
    noTenantYet: 'No tenant details saved',
    placeholderAction: 'Sent LOD via registered post',
    states: ['Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Perak','Perlis','Penang','Sabah','Sarawak','Selangor','Terengganu','KL','Putrajaya','Labuan'],
    types: ['Condo / Apt', 'Landed', 'Commercial', 'Industrial', 'Land'],
  },
  bm: {
    title: 'Memori kes',
    subtitle: 'Konteks yang saya ingat untuk kes ini',
    explainer: 'Semua data kekal di peranti anda. Saya guna ini untuk kesinambungan soalan susulan — bukan nasihat guaman.',
    property: 'Hartanah',
    nickname: 'Nama panggilan (cth. "Unit Mont Kiara")',
    state: 'Negeri',
    propertyType: 'Jenis',
    address: 'Alamat',
    monthlyRent: 'Sewa bulanan (RM)',
    caseType: 'Jenis kes',
    disputes: 'Timeline kes',
    addEvent: 'Tambah peristiwa',
    eventDate: 'Tarikh',
    eventAction: 'Apa yang berlaku',
    eventNote: 'Catatan (pilihan)',
    taxDates: 'Cukai & pematuhan',
    lastStampDate: 'Duti setem terakhir dibayar',
    assessmentDue: 'Cukai taksiran perlu dibayar',
    insuranceRenewal: 'Pembaharuan insurans',
    myInvoisStatus: 'Status MyInvois',
    tenant: 'Maklumat penyewa',
    tenantName: 'Nama penyewa',
    icLast4: 'IC (4 digit terakhir sahaja)',
    uscc: 'USCC / pasport',
    deposit: 'Deposit disimpan (RM)',
    pdpaHeader: 'Simpan data penyewa — keizinan PDPA 2010 diperlukan',
    pdpaBody: 'Akta Perlindungan Data Peribadi 2010 memerlukan keizinan eksplisit sebelum anda merekod maklumat pengenalan penyewa — walaupun di peranti sendiri. Tandakan kotak jika penyewa bersetuju.',
    pdpaAgree: 'Penyewa bersetuju maklumat ini disimpan dalam Find.ai untuk pengurusan kes.',
    pdpaLocked: 'Medan penyewa dikunci sehingga keizinan diberi.',
    save: 'Simpan memori',
    cancel: 'Batal',
    clear: 'Kosongkan memori',
    close: 'Tutup',
    noTenantYet: 'Tiada maklumat penyewa disimpan',
    placeholderAction: 'Hantar LOD melalui pos berdaftar',
    states: ['Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Perak','Perlis','Penang','Sabah','Sarawak','Selangor','Terengganu','KL','Putrajaya','Labuan'],
    types: ['Kondo / Apt', 'Berkembar', 'Komersial', 'Industri', 'Tanah'],
  },
  zh: {
    title: '案件记忆',
    subtitle: '我为此案件记住的上下文',
    explainer: '所有数据仅存于您的设备。我用它来保持后续问题的连贯性 — 并非法律意见。',
    property: '房产',
    nickname: '昵称（例如"Mont Kiara 单位"）',
    state: '州属',
    propertyType: '类型',
    address: '地址',
    monthlyRent: '月租（RM）',
    caseType: '案件类型',
    disputes: '案件时间线',
    addEvent: '添加事件',
    eventDate: '日期',
    eventAction: '发生了什么',
    eventNote: '备注（可选）',
    taxDates: '税务与合规',
    lastStampDate: '上次印花税缴纳',
    assessmentDue: '门牌税到期',
    insuranceRenewal: '保险续保',
    myInvoisStatus: 'MyInvois 状态',
    tenant: '租客详情',
    tenantName: '租客姓名',
    icLast4: 'IC（仅限最后4位）',
    uscc: 'USCC / 护照',
    deposit: '押金（RM）',
    pdpaHeader: '存储租客数据 — 需要 PDPA 2010 同意',
    pdpaBody: '马来西亚《2010年个人数据保护法》要求在记录租客身份信息之前必须获得明确同意 — 即使在您自己的设备上。如果租客已同意，请勾选方框。',
    pdpaAgree: '租客同意在 Find.ai 中存储此信息以用于案件管理。',
    pdpaLocked: '未获得同意前，租客字段已锁定。',
    save: '保存记忆',
    cancel: '取消',
    clear: '清除记忆',
    close: '关闭',
    noTenantYet: '尚未保存租客详情',
    placeholderAction: '通过挂号信发送律师函',
    states: ['柔佛','吉打','吉兰丹','马六甲','森美兰','彭亨','霹雳','玻璃市','槟城','沙巴','砂拉越','雪兰莪','登嘉楼','吉隆坡','布城','纳闽'],
    types: ['公寓', '有地', '商用', '工业', '土地'],
  },
};

// ───────────────────────────────────────────────────────────────────────
// <CaseMemoryModal /> — Bento-styled editor.
// Props:
//   open        boolean
//   lang        'en' | 'bm' | 'zh'
//   memory      object (matches emptyMemory())
//   caseType    string (one of CASE_TYPES[*].key)
//   onSave      (nextMemory, nextCaseType) => void
//   onClose     () => void
//   onClear     () => void   (optional — shows Clear button if provided)
// ───────────────────────────────────────────────────────────────────────
export function CaseMemoryModal({ open, lang = 'en', memory, caseType = 'general', onSave, onClose, onClear }) {
  const t = UI[lang] || UI.en;
  const [draft, setDraft] = useState(memory || emptyMemory());
  const [type, setType] = useState(caseType);
  const [consent, setConsent] = useState(Boolean((memory?.tenant || {}).consented) && hasPdpaConsent('tenantData'));

  // Sync when modal reopens with different data
  useEffect(() => {
    if (open) {
      setDraft(memory || emptyMemory());
      setType(caseType);
      setConsent(Boolean((memory?.tenant || {}).consented) && hasPdpaConsent('tenantData'));
    }
  }, [open, memory, caseType]);

  if (!open) return null;

  const setProperty = (k, v) => setDraft(d => ({ ...d, property: { ...d.property, [k]: v } }));
  const setTax      = (k, v) => setDraft(d => ({ ...d, taxDates: { ...d.taxDates, [k]: v } }));
  const setTenant   = (k, v) => setDraft(d => ({ ...d, tenant:   { ...d.tenant,   [k]: v } }));

  const addEvent = () => setDraft(d => ({ ...d, disputes: [...(d.disputes || []), { date: '', action: '', note: '' }] }));
  const updateEvent = (i, k, v) => setDraft(d => {
    const next = [...(d.disputes || [])];
    next[i] = { ...next[i], [k]: v };
    return { ...d, disputes: next };
  });
  const removeEvent = (i) => setDraft(d => ({ ...d, disputes: (d.disputes || []).filter((_, j) => j !== i) }));

  const toggleConsent = (checked) => {
    setConsent(checked);
    if (checked) grantPdpaConsent('tenantData');
    else revokePdpaConsent('tenantData');
    setTenant('consented', checked);
    setTenant('consentedAt', checked ? Date.now() : null);
  };

  const handleSave = () => {
    // If no consent, strip any lingering tenant identity data before save
    const clean = { ...draft };
    if (!consent) {
      clean.tenant = { ...emptyMemory().tenant };
    }
    onSave?.(clean, type);
  };

  const section = (title) => (
    <div className="text-[10px] font-bold uppercase tracking-widest mb-2 pl-1" style={{ color: '#94a3b8' }}>{title}</div>
  );

  const inputStyle = { color: '#0f172a', border: '1px solid #e2e8f0' };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(15,23,42,0.5)' }}
      onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-[28px] sm:rounded-[28px] max-h-[92vh] overflow-y-auto"
        style={{ background: 'linear-gradient(180deg, #fafbfc 0%, #f1f4f8 100%)' }}>
        {/* Header */}
        <div className="sticky top-0 z-10 px-5 py-4 flex items-center justify-between" style={{ background: 'rgba(250,251,252,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
          <div>
            <div className="text-[16px] font-bold" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>{t.title}</div>
            <div className="text-[11px]" style={{ color: '#64748b' }}>{t.subtitle}</div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 transition active:scale-95" style={{ color: '#64748b' }} aria-label={t.close}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="px-4 pb-28 pt-4 space-y-3">
          {/* Hero explainer */}
          <div className="rounded-[24px] p-5 text-white"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', boxShadow: '0 4px 20px rgba(15,23,42,0.12)' }}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
              style={{ background: 'rgba(16,185,129,0.18)', color: '#6ee7b7' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
              Beta · per-case
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>{t.explainer}</p>
          </div>

          {/* Case type */}
          <div>
            {section(t.caseType)}
            <div className="grid grid-cols-3 gap-2">
              {CASE_TYPES.map(ct => {
                const active = ct.key === type;
                return (
                  <button key={ct.key} onClick={() => setType(ct.key)}
                    className="rounded-2xl p-3 transition active:scale-[0.96] flex flex-col items-center gap-1.5"
                    style={active
                      ? { background: '#0f172a', boxShadow: '0 4px 16px rgba(15,23,42,0.2)' }
                      : { background: 'white', border: '1px solid #e2e8f0' }
                    }>
                    <span className="text-lg">{ct.icon}</span>
                    <span className="text-[10px] font-bold leading-tight text-center" style={{ color: active ? '#fff' : '#475569' }}>{ct[lang] || ct.en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Property */}
          <div>
            {section(t.property)}
            <div className="rounded-2xl p-3 space-y-2" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
              <input value={draft.property?.nickname || ''} onChange={(e) => setProperty('nickname', e.target.value)}
                placeholder={t.nickname}
                className="w-full bg-[#f8fafc] rounded-xl px-3 py-2.5 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300"
                style={inputStyle} />
              <div className="grid grid-cols-2 gap-2">
                <select value={draft.property?.state || ''} onChange={(e) => setProperty('state', e.target.value)}
                  className="bg-[#f8fafc] rounded-xl px-3 py-2.5 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300"
                  style={inputStyle}>
                  <option value="">{t.state}</option>
                  {t.states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={draft.property?.propertyType || ''} onChange={(e) => setProperty('propertyType', e.target.value)}
                  className="bg-[#f8fafc] rounded-xl px-3 py-2.5 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300"
                  style={inputStyle}>
                  <option value="">{t.propertyType}</option>
                  {t.types.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <input value={draft.property?.address || ''} onChange={(e) => setProperty('address', e.target.value)}
                placeholder={t.address}
                className="w-full bg-[#f8fafc] rounded-xl px-3 py-2.5 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300"
                style={inputStyle} />
              <input type="number" value={draft.property?.monthlyRent || ''} onChange={(e) => setProperty('monthlyRent', e.target.value)}
                placeholder={t.monthlyRent}
                className="w-full bg-[#f8fafc] rounded-xl px-3 py-2.5 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300"
                style={inputStyle} />
            </div>
          </div>

          {/* Disputes / timeline */}
          <div>
            {section(t.disputes)}
            <div className="rounded-2xl p-3 space-y-2" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
              {(draft.disputes || []).map((d, i) => (
                <div key={i} className="rounded-xl p-2.5 flex flex-col gap-1.5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div className="flex items-center gap-2">
                    <input type="date" value={d.date || ''} onChange={(e) => updateEvent(i, 'date', e.target.value)}
                      className="flex-shrink-0 bg-white rounded-lg px-2 py-1.5 text-[11px] font-semibold focus:outline-none"
                      style={inputStyle} />
                    <button onClick={() => removeEvent(i)}
                      className="ml-auto text-[10px] px-2 py-1 rounded-lg font-semibold transition active:scale-95"
                      style={{ color: '#dc2626', background: '#fee2e2' }}>×</button>
                  </div>
                  <input value={d.action || ''} onChange={(e) => updateEvent(i, 'action', e.target.value)}
                    placeholder={t.placeholderAction}
                    className="w-full bg-white rounded-lg px-2.5 py-2 text-[12px] font-semibold focus:outline-none"
                    style={inputStyle} />
                  <input value={d.note || ''} onChange={(e) => updateEvent(i, 'note', e.target.value)}
                    placeholder={t.eventNote}
                    className="w-full bg-white rounded-lg px-2.5 py-2 text-[12px] focus:outline-none"
                    style={inputStyle} />
                </div>
              ))}
              <button onClick={addEvent}
                className="w-full rounded-xl py-2.5 text-[12px] font-bold transition active:scale-[0.98]"
                style={{ background: '#f1f5f9', color: '#475569', border: '1px dashed #cbd5e1' }}>
                + {t.addEvent}
              </button>
            </div>
          </div>

          {/* Tax / compliance */}
          <div>
            {section(t.taxDates)}
            <div className="rounded-2xl p-3 grid grid-cols-2 gap-2" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold" style={{ color: '#64748b' }}>{t.lastStampDate}</span>
                <input type="date" value={draft.taxDates?.lastStampDate || ''} onChange={(e) => setTax('lastStampDate', e.target.value)}
                  className="bg-[#f8fafc] rounded-xl px-3 py-2.5 text-[12px] font-semibold focus:outline-none" style={inputStyle} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold" style={{ color: '#64748b' }}>{t.assessmentDue}</span>
                <input type="date" value={draft.taxDates?.assessmentDue || ''} onChange={(e) => setTax('assessmentDue', e.target.value)}
                  className="bg-[#f8fafc] rounded-xl px-3 py-2.5 text-[12px] font-semibold focus:outline-none" style={inputStyle} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold" style={{ color: '#64748b' }}>{t.insuranceRenewal}</span>
                <input type="date" value={draft.taxDates?.insuranceRenewal || ''} onChange={(e) => setTax('insuranceRenewal', e.target.value)}
                  className="bg-[#f8fafc] rounded-xl px-3 py-2.5 text-[12px] font-semibold focus:outline-none" style={inputStyle} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold" style={{ color: '#64748b' }}>{t.myInvoisStatus}</span>
                <select value={draft.taxDates?.myInvoisStatus || ''} onChange={(e) => setTax('myInvoisStatus', e.target.value)}
                  className="bg-[#f8fafc] rounded-xl px-3 py-2.5 text-[12px] font-semibold focus:outline-none" style={inputStyle}>
                  <option value="">—</option>
                  <option value="registered">Registered</option>
                  <option value="pending">Pending</option>
                  <option value="exempt">Exempt</option>
                </select>
              </label>
            </div>
          </div>

          {/* Tenant — PDPA gated */}
          <div>
            {section(t.tenant)}
            <div className="rounded-2xl p-4 space-y-3" style={{ background: consent ? 'white' : '#fef3c7', border: `1px solid ${consent ? '#e2e8f0' : '#fde68a'}` }}>
              {/* PDPA consent card */}
              <div className="rounded-xl p-3" style={{ background: consent ? '#ecfdf5' : 'rgba(245,158,11,0.12)', border: `1px solid ${consent ? '#a7f3d0' : '#f59e0b'}` }}>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: consent ? '#10b981' : '#f59e0b' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold" style={{ color: consent ? '#065f46' : '#78350f' }}>{t.pdpaHeader}</div>
                    <div className="text-[10px] mt-1 leading-snug" style={{ color: consent ? '#047857' : '#92400e' }}>{t.pdpaBody}</div>
                  </div>
                </div>
                <label className="flex items-start gap-2 mt-3 cursor-pointer select-none">
                  <input type="checkbox" checked={consent} onChange={(e) => toggleConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-emerald-600" />
                  <span className="text-[11px] font-semibold leading-snug" style={{ color: consent ? '#065f46' : '#78350f' }}>{t.pdpaAgree}</span>
                </label>
              </div>

              {/* Tenant fields — disabled until consent */}
              <fieldset disabled={!consent} style={{ opacity: consent ? 1 : 0.45 }} className="space-y-2">
                {!consent && (
                  <div className="text-[10px] font-semibold text-center py-1" style={{ color: '#78350f' }}>{t.pdpaLocked}</div>
                )}
                <input value={draft.tenant?.name || ''} onChange={(e) => setTenant('name', e.target.value)}
                  placeholder={t.tenantName}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2.5 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300"
                  style={inputStyle} />
                <div className="grid grid-cols-2 gap-2">
                  <input value={draft.tenant?.icLast4 || ''} onChange={(e) => setTenant('icLast4', e.target.value.slice(0, 4))}
                    placeholder={t.icLast4} maxLength={4} inputMode="numeric"
                    className="bg-[#f8fafc] rounded-xl px-3 py-2.5 text-[13px] font-semibold focus:outline-none" style={inputStyle} />
                  <input value={draft.tenant?.usccOrPassport || ''} onChange={(e) => setTenant('usccOrPassport', e.target.value)}
                    placeholder={t.uscc}
                    className="bg-[#f8fafc] rounded-xl px-3 py-2.5 text-[13px] font-semibold focus:outline-none" style={inputStyle} />
                </div>
                <input type="number" value={draft.tenant?.deposit || ''} onChange={(e) => setTenant('deposit', e.target.value)}
                  placeholder={t.deposit}
                  className="w-full bg-[#f8fafc] rounded-xl px-3 py-2.5 text-[13px] font-semibold focus:outline-none" style={inputStyle} />
              </fieldset>
            </div>
          </div>

          {/* Clear (optional, destructive) */}
          {onClear && (
            <button onClick={onClear}
              className="w-full rounded-2xl py-3 text-[12px] font-bold transition active:scale-[0.98]"
              style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>
              {t.clear}
            </button>
          )}
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 left-0 right-0 z-10 px-4 py-3" style={{ background: 'linear-gradient(180deg, rgba(241,244,248,0) 0%, #f1f4f8 40%)' }}>
          <div className="flex gap-2.5">
            <button onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-[13px] font-semibold transition active:scale-[0.98]"
              style={{ background: 'white', color: '#64748b', border: '1px solid #e2e8f0' }}>{t.cancel}</button>
            <button onClick={handleSave}
              className="flex-[2] py-3 rounded-2xl text-[14px] font-bold text-white transition active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', boxShadow: '0 4px 16px rgba(15,23,42,0.2)' }}>{t.save} →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseMemoryModal;
