// src/lib/pdfExport.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri.ai — Shared PDF Export Module (Phase 1 doctrine)
//
// Single, branded report generator used by all four Phase 1 tools:
//   - Tenant Screening    → "Tenant Screening Report"
//   - Agreement Health    → "Agreement Health Check Report"
//   - SDSAS 2026          → "SDSAS 2026 Tax Accuracy Certificate"
//   - Chatbox save        → "Veri.ai Advisory Summary"
//
// ZERO NPM DEPENDENCIES — uses the browser's native print-to-PDF flow.
// Works on every modern browser, including iOS Safari + Android Chrome,
// where the "Save as PDF" option is built into the print dialog / share sheet.
//
// Every report emits the same letterhead, footer disclaimer, and QR code so
// receipts look uniform when shared on WhatsApp — the viral loop for Phase 1.
//
// Usage:
//   import { exportReport, makeCaseRef } from '@/lib/pdfExport';
//   exportReport({
//     kind: 'stamp',
//     lang: 'en',
//     title: 'SDSAS 2026 Tax Accuracy Certificate',
//     caseRef: 'FA-20260421-7XKQ',        // optional — auto-generated if missing
//     meta: {
//       preparedFor: 'Mr. Ken Tan',
//       property: 'Lot 5, Jalan Budi, KL',
//       date: '2026-04-21',               // optional — defaults to today
//     },
//     sections: [
//       { heading: 'Assessment', kind: 'badge', data: { label: 'Stamp Duty Payable', value: 'RM 144.00', tone: 'navy' } },
//       { heading: 'Computation', kind: 'kv', data: [
//           ['Monthly rent', 'RM 2,500'],
//           ['Annual rent', 'RM 30,000'],
//           ['Units (annual / 250)', '120'],
//           ['Rate tier (≤3 yrs)', 'RM 1 per RM 250'],
//           ['Stamp duty', 'RM 120.00'],
//           ['Minimum (SDSAS)', 'RM 10.00'],
//           ['Payable', 'RM 144.00'],
//         ]
//       },
//       { heading: 'How to stamp', kind: 'list', data: [
//         'Log in to STAMPS @ stamps.hasil.gov.my with your MyDigital ID.',
//         'Submit the instrument within 30 days of execution.',
//         'Pay via FPX; download the e-Duti Setem QR certificate.',
//         'Keep the certificate with your tenancy agreement.',
//       ] },
//     ],
//   });
//
// Payload shape:
//   kind:     'screen' | 'audit' | 'stamp' | 'chat'
//   lang:     'en' | 'bm' | 'zh'          (defaults to 'en')
//   title:    string                      (hero of the cover tile)
//   caseRef:  string                      (optional; auto-generated if blank)
//   meta:     { preparedFor?, property?, date? }
//   sections: Array<{ heading, kind, data }>
//
// Supported section kinds:
//   'text'   → data: string | string[]         — paragraphs
//   'list'   → data: string[]                  — bulleted list
//   'kv'     → data: Array<[label, value]>     — key/value grid
//   'table'  → data: { headers: string[], rows: string[][] }
//   'badge'  → data: { label, value, tone?, sub? }   tone: navy|blue|yellow|red|purple|green
//   'score'  → data: { grade: 'A'|'B'|'C'|'D'|number, label, sub? }
//   'flags'  → data: Array<{ severity: 'red'|'amber'|'green', title, detail }>
//
// Output:
//   Opens a new window with the rendered HTML report, then auto-fires
//   window.print() once the QR code + fonts have loaded. The user selects
//   "Save as PDF" in the print dialog — identical on Chrome, Edge, Safari,
//   Firefox, Android Chrome, iOS Safari.
//
// ─────────────────────────────────────────────────────────────────────────────

// Psychology labels — kept in a single source of truth so chat UI and PDF
// match exactly. See src/lib/screeningPsychology.js for the research spine.
import {
  PATTERN_LABELS,
  INSIGHT_LABELS,
  CONFIDENCE_LABELS,
} from './screeningPsychology';

const BRAND = {
  navy: '#0f172a',
  navy2: '#1e293b',
  ink: '#0f172a',
  muted: '#64748b',
  faint: '#94a3b8',
  line: '#e2e8f0',
  soft: '#f8fafc',
  amber: '#f59e0b',
  amberBg: '#fef3c7',
  amberEdge: '#fde68a',
  tones: {
    navy:   { bg: '#0f172a', ink: '#ffffff', edge: '#0f172a' },
    blue:   { bg: '#dbeafe', ink: '#1e40af', edge: '#bfdbfe' },
    yellow: { bg: '#fef3c7', ink: '#92400e', edge: '#fde68a' },
    red:    { bg: '#fee2e2', ink: '#991b1b', edge: '#fecaca' },
    purple: { bg: '#ede9fe', ink: '#5b21b6', edge: '#ddd6fe' },
    green:  { bg: '#d1fae5', ink: '#065f46', edge: '#a7f3d0' },
  },
  severity: {
    red:    { bg: '#fee2e2', ink: '#991b1b', edge: '#fecaca', tag: 'HIGH RISK' },
    amber:  { bg: '#fef3c7', ink: '#92400e', edge: '#fde68a', tag: 'REVIEW'    },
    green:  { bg: '#d1fae5', ink: '#065f46', edge: '#a7f3d0', tag: 'OK'        },
  },
};

const KIND_LABELS = {
  screen: { en: 'Tenant Screening Report',        bm: 'Laporan Saringan Penyewa',        zh: '租客背景核查报告' },
  audit:  { en: 'Agreement Health Check',         bm: 'Pemeriksaan Kesihatan Perjanjian', zh: '租约健康审查报告' },
  stamp:  { en: 'SDSAS 2026 Tax Accuracy Certificate', bm: 'Sijil Ketepatan Duti Setem SDSAS 2026', zh: 'SDSAS 2026 印花税准确性证书' },
  chat:   { en: 'Advisory Summary',               bm: 'Ringkasan Khidmat Nasihat',       zh: '咨询摘要' },
};

const I18N = {
  en: {
    letterhead: 'Veri.ai · Malaysian Property Compliance Toolkit',
    strap: "Don't sign blind.",
    case: 'Case ref',
    date: 'Date prepared',
    preparedFor: 'Prepared for',
    property: 'Property',
    verify: 'Scan to verify this report at veri.ai',
    shield: 'Support tool only — not legal advice.',
    pdpa: 'Personal data collected under PDPA 2010. Retained for dispute support; deletable on request.',
    disclaimer: 'This report summarises publicly available Malaysian legal reference material together with the information you provided. It is NOT a substitute for independent legal advice from a qualified Peguambela & Peguamcara. Verify critical actions with a licensed professional before relying on them.',
    continue: 'Continue your case at',
    page: 'Page',
    of: 'of',
  },
  bm: {
    letterhead: 'Veri.ai · Kit Pematuhan Hartanah Malaysia',
    strap: 'Jangan tandatangan buta.',
    case: 'Rujukan kes',
    date: 'Tarikh sedia',
    preparedFor: 'Disediakan untuk',
    property: 'Hartanah',
    verify: 'Imbas untuk sahkan laporan ini di veri.ai',
    shield: 'Alat sokongan sahaja — bukan nasihat undang-undang.',
    pdpa: 'Data peribadi dikumpul di bawah APDP 2010. Disimpan untuk sokongan pertikaian; boleh dipadam atas permintaan.',
    disclaimer: 'Laporan ini merumuskan rujukan undang-undang Malaysia yang tersedia secara umum bersama maklumat yang anda berikan. Ia BUKAN pengganti nasihat undang-undang bebas daripada Peguambela & Peguamcara yang bertauliah. Sahkan tindakan penting dengan profesional berlesen sebelum bergantung padanya.',
    continue: 'Teruskan kes anda di',
    page: 'Halaman',
    of: 'daripada',
  },
  zh: {
    letterhead: 'Veri.ai · 马来西亚房产合规工具箱',
    strap: '签约前先查清。',
    case: '案件编号',
    date: '报告日期',
    preparedFor: '收件人',
    property: '物业',
    verify: '扫码到 veri.ai 验证此报告',
    shield: '仅供参考——不构成法律意见。',
    pdpa: '个人资料依据 PDPA 2010 收集。用于争议支援用途；可按要求删除。',
    disclaimer: '本报告综合马来西亚公开法律参考资料与您提供的信息。它不能取代由合格执业律师提供的独立法律意见。依赖任何关键行动前，请向持牌专业人士核实。',
    continue: '访问案件后续于',
    page: '第',
    of: '页 / 共',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Public helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a Veri.ai case reference ID, e.g. "FA-20260421-7XKQ".
 * Stable pattern for QR viral loop: veri.ai/r/FA-YYYYMMDD-XXXX
 */
export function makeCaseRef(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/1/I/O ambiguity
  let tail = '';
  for (let i = 0; i < 4; i++) tail += CHARS[Math.floor(Math.random() * CHARS.length)];
  return `FA-${ymd}-${tail}`;
}

/**
 * Builds the veri.ai viral-loop URL for a given case ref.
 * If the domain moves, update here and every QR across all tools updates.
 */
export function caseUrl(caseRef) {
  return `https://veri.ai/r/${encodeURIComponent(caseRef)}`;
}

/**
 * Main entry point. Opens a new tab with the branded report and fires
 * window.print() once the document is ready. The user saves as PDF.
 */
export function exportReport(payload) {
  if (typeof window === 'undefined') return; // SSR guard
  const prepared = preparePayload(payload);
  const html = renderHTML(prepared);

  const win = window.open('', '_blank');
  if (!win) {
    // Popup blocked — fall back to a same-tab data-URL download so the user
    // can still see + save the report.
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.location.href = url;
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  // Give the QR <img> a beat to load before firing print, otherwise the
  // QR box prints blank on slow connections.
  const waitForImages = () => {
    const imgs = Array.from(win.document.images || []);
    if (imgs.length === 0) return Promise.resolve();
    return Promise.all(imgs.map(img =>
      img.complete ? Promise.resolve()
        : new Promise(res => { img.onload = img.onerror = res; })
    ));
  };
  win.addEventListener('load', () => {
    waitForImages().then(() => {
      try { win.focus(); win.print(); } catch (_) {}
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Internals
// ─────────────────────────────────────────────────────────────────────────────

function preparePayload(p) {
  const lang = (p.lang && I18N[p.lang]) ? p.lang : 'en';
  const kind = KIND_LABELS[p.kind] ? p.kind : 'chat';
  const caseRef = p.caseRef || makeCaseRef();
  const date = p.meta?.date || formatDate(new Date(), lang);
  const kindLabel = KIND_LABELS[kind][lang];
  const title = p.title || kindLabel;
  return {
    kind,
    lang,
    caseRef,
    title,
    kindLabel,
    sections: Array.isArray(p.sections) ? p.sections : [],
    meta: {
      preparedFor: p.meta?.preparedFor || '',
      property: p.meta?.property || '',
      date,
    },
  };
}

function formatDate(d, lang) {
  const pad = (n) => String(n).padStart(2, '0');
  const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return iso;
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function qrSrc(caseRef) {
  // Public, keyless, stable QR service. Falls back to URL text if blocked.
  const target = caseUrl(caseRef);
  return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=2&data=${encodeURIComponent(target)}`;
}

function renderSections(sections) {
  return sections.map(renderSection).join('\n');
}

function renderSection(s) {
  const heading = s.heading ? `<h2 class="sec-h">${esc(s.heading)}</h2>` : '';
  switch (s.kind) {
    case 'text':   return heading + renderText(s.data);
    case 'list':   return heading + renderList(s.data);
    case 'kv':     return heading + renderKV(s.data);
    case 'table':  return heading + renderTable(s.data);
    case 'badge':  return heading + renderBadge(s.data);
    case 'score':  return heading + renderScore(s.data);
    case 'flags':  return heading + renderFlags(s.data);
    default:       return heading + renderText(s.data);
  }
}

function renderText(data) {
  const paras = Array.isArray(data) ? data : [data];
  return paras.filter(Boolean).map(p => `<p class="sec-p">${esc(p)}</p>`).join('');
}

function renderList(data) {
  const items = (data || []).map(x => `<li>${esc(x)}</li>`).join('');
  return `<ul class="sec-ul">${items}</ul>`;
}

function renderKV(data) {
  const rows = (data || []).map(([k, v]) => `
    <tr>
      <th>${esc(k)}</th>
      <td>${esc(v)}</td>
    </tr>`).join('');
  return `<table class="sec-kv"><tbody>${rows}</tbody></table>`;
}

function renderTable(data) {
  const headers = (data?.headers || []).map(h => `<th>${esc(h)}</th>`).join('');
  const rows = (data?.rows || []).map(r =>
    `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`
  ).join('');
  return `<table class="sec-tbl"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
}

function renderBadge(data) {
  const tone = BRAND.tones[data?.tone] || BRAND.tones.navy;
  const sub = data?.sub ? `<div class="badge-sub">${esc(data.sub)}</div>` : '';
  return `
    <div class="badge" style="background:${tone.bg};color:${tone.ink};border:1px solid ${tone.edge}">
      <div class="badge-label">${esc(data?.label || '')}</div>
      <div class="badge-value">${esc(data?.value || '')}</div>
      ${sub}
    </div>`;
}

function renderScore(data) {
  const grade = data?.grade ?? '—';
  const color = ({
    A: BRAND.tones.green,
    B: BRAND.tones.blue,
    C: BRAND.tones.yellow,
    D: BRAND.tones.red,
  })[String(grade).toUpperCase()] || BRAND.tones.navy;
  const sub = data?.sub ? `<div class="score-sub">${esc(data.sub)}</div>` : '';
  return `
    <div class="score" style="background:${color.bg};color:${color.ink};border:1px solid ${color.edge}">
      <div class="score-grade">${esc(grade)}</div>
      <div class="score-label">${esc(data?.label || '')}</div>
      ${sub}
    </div>`;
}

function renderFlags(data) {
  return `<div class="flags">${(data || []).map(f => {
    const tone = BRAND.severity[f.severity] || BRAND.severity.amber;
    return `
      <div class="flag" style="background:${tone.bg};color:${tone.ink};border:1px solid ${tone.edge}">
        <div class="flag-top">
          <span class="flag-tag">${tone.tag}</span>
          <span class="flag-title">${esc(f.title || '')}</span>
        </div>
        ${f.detail ? `<div class="flag-detail">${esc(f.detail)}</div>` : ''}
      </div>`;
  }).join('')}</div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML document
// ─────────────────────────────────────────────────────────────────────────────

function renderHTML(p) {
  const t = I18N[p.lang];
  const metaRows = [
    p.meta.preparedFor && `<tr><th>${t.preparedFor}</th><td>${esc(p.meta.preparedFor)}</td></tr>`,
    p.meta.property     && `<tr><th>${t.property}</th><td>${esc(p.meta.property)}</td></tr>`,
    `<tr><th>${t.case}</th><td>${esc(p.caseRef)}</td></tr>`,
    `<tr><th>${t.date}</th><td>${esc(p.meta.date)}</td></tr>`,
  ].filter(Boolean).join('');

  return `<!doctype html>
<html lang="${p.lang}">
<head>
<meta charset="utf-8">
<title>${esc(p.title)} · ${esc(p.caseRef)} · Veri.ai</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  :root {
    --navy: ${BRAND.navy};
    --navy2: ${BRAND.navy2};
    --ink: ${BRAND.ink};
    --muted: ${BRAND.muted};
    --faint: ${BRAND.faint};
    --line: ${BRAND.line};
    --soft: ${BRAND.soft};
    --amber: ${BRAND.amber};
    --amberBg: ${BRAND.amberBg};
    --amberEdge: ${BRAND.amberEdge};
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
    color: var(--ink);
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 18mm 16mm 20mm;
    margin: 0 auto;
    background: #fff;
  }

  /* ── Letterhead ───────────────────────────────────────────── */
  .head {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%);
    color: #fff;
    border-radius: 18px;
    padding: 18px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .head-brand { display: flex; align-items: center; gap: 12px; }
  .shield {
    width: 36px; height: 36px; border-radius: 10px;
    background: #ffffff1a;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .head-name {
    font-size: 16px; font-weight: 700; letter-spacing: -0.015em;
  }
  .head-strap {
    font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
    color: #ffffffa6; margin-top: 2px;
  }
  .head-right { text-align: right; }
  .head-kind {
    font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
    color: #ffffffa6;
  }
  .head-title {
    font-size: 14px; font-weight: 700; margin-top: 2px; letter-spacing: -0.01em;
  }

  /* ── Meta table ───────────────────────────────────────────── */
  .meta {
    width: 100%; border-collapse: collapse; margin-top: 16px;
    font-size: 11px;
  }
  .meta th, .meta td {
    padding: 8px 12px; border-bottom: 1px solid var(--line);
    text-align: left; vertical-align: top;
  }
  .meta th {
    color: var(--faint); font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.08em; font-size: 9px;
    width: 30%;
  }
  .meta td { color: var(--ink); font-weight: 600; }

  /* ── Title block ──────────────────────────────────────────── */
  .doc-title {
    margin-top: 22px; font-size: 22px; font-weight: 800;
    letter-spacing: -0.02em; color: var(--navy);
  }

  /* ── Sections ─────────────────────────────────────────────── */
  .sec { margin-top: 20px; }
  .sec-h {
    font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--faint); margin: 16px 0 8px;
  }
  .sec-p { font-size: 12px; line-height: 1.55; margin: 6px 0; color: var(--ink); }

  .sec-ul { margin: 6px 0 6px 18px; padding: 0; }
  .sec-ul li { font-size: 12px; line-height: 1.55; margin: 3px 0; color: var(--ink); }

  .sec-kv { width: 100%; border-collapse: collapse; }
  .sec-kv th, .sec-kv td {
    padding: 7px 10px; border-bottom: 1px solid var(--line);
    font-size: 11.5px; text-align: left; vertical-align: top;
  }
  .sec-kv th { color: var(--muted); font-weight: 500; width: 45%; }
  .sec-kv td { color: var(--ink); font-weight: 600; }

  .sec-tbl { width: 100%; border-collapse: collapse; font-size: 11.5px; }
  .sec-tbl th {
    background: var(--soft); color: var(--muted);
    text-align: left; padding: 8px 10px; font-weight: 600;
    text-transform: uppercase; font-size: 9.5px; letter-spacing: 0.08em;
    border-bottom: 1px solid var(--line);
  }
  .sec-tbl td {
    padding: 8px 10px; border-bottom: 1px solid var(--line);
    color: var(--ink);
  }

  .badge {
    border-radius: 14px; padding: 16px 18px; margin-top: 4px;
  }
  .badge-label {
    font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
    opacity: 0.7; font-weight: 700;
  }
  .badge-value { font-size: 26px; font-weight: 800; margin-top: 4px; letter-spacing: -0.02em; }
  .badge-sub { font-size: 11px; opacity: 0.75; margin-top: 6px; }

  .score {
    border-radius: 16px; padding: 20px 22px; display: flex;
    align-items: baseline; gap: 16px;
  }
  .score-grade { font-size: 42px; font-weight: 800; letter-spacing: -0.04em; }
  .score-label { font-size: 14px; font-weight: 700; }
  .score-sub { font-size: 11px; opacity: 0.8; margin-left: auto; }

  .flags { display: flex; flex-direction: column; gap: 8px; }
  .flag { border-radius: 12px; padding: 10px 14px; }
  .flag-top { display: flex; align-items: center; gap: 10px; }
  .flag-tag {
    font-size: 9px; font-weight: 800; letter-spacing: 0.1em;
    padding: 3px 7px; border-radius: 5px; background: #ffffffcc;
  }
  .flag-title { font-size: 12.5px; font-weight: 700; }
  .flag-detail { font-size: 11.5px; margin-top: 6px; opacity: 0.9; line-height: 1.5; }

  /* ── Footer ───────────────────────────────────────────────── */
  .foot {
    margin-top: 28px; padding-top: 14px; border-top: 1px solid var(--line);
    display: flex; gap: 18px; align-items: flex-start;
  }
  .qr {
    flex: 0 0 120px; text-align: center;
  }
  .qr img {
    width: 120px; height: 120px; border: 1px solid var(--line);
    border-radius: 10px; background: #fff;
  }
  .qr-cap {
    font-size: 9.5px; color: var(--muted); margin-top: 6px; line-height: 1.4;
  }
  .qr-url {
    font-size: 9.5px; color: var(--navy); font-weight: 700; margin-top: 2px;
    word-break: break-all;
  }
  .foot-body { flex: 1; }
  .shield-chip {
    display: inline-block; padding: 5px 10px; border-radius: 8px;
    background: var(--amberBg); color: #92400e;
    font-size: 10px; font-weight: 800; letter-spacing: 0.08em;
    text-transform: uppercase; border: 1px solid var(--amberEdge);
  }
  .foot-p {
    font-size: 10.5px; line-height: 1.55; color: var(--muted);
    margin: 8px 0 0;
  }
  .foot-pdpa {
    font-size: 9.5px; color: var(--faint); margin-top: 10px;
    line-height: 1.5;
  }

  /* ── Print rules ──────────────────────────────────────────── */
  @media print {
    .page { padding: 12mm 14mm 14mm; }
    .head { break-inside: avoid; }
    .foot { break-inside: avoid; }
    .badge, .score, .flag, .sec-kv, .sec-tbl { break-inside: avoid; }
    @page { size: A4; margin: 0; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="head">
    <div class="head-brand">
      <!-- v3.4.38 — Shield removed. Wordmark-only brand. -->
      <div>
        <div class="head-name">Find<span style="color:#B8893A">.ai</span></div>
        <div class="head-strap">${esc(t.letterhead)}</div>
      </div>
    </div>
    <div class="head-right">
      <div class="head-kind">${esc(p.kindLabel)}</div>
      <div class="head-title">${esc(t.strap)}</div>
    </div>
  </div>

  <table class="meta">
    <tbody>${metaRows}</tbody>
  </table>

  <div class="doc-title">${esc(p.title)}</div>

  <div class="sec">
    ${renderSections(p.sections)}
  </div>

  <div class="foot">
    <div class="qr">
      <img src="${qrSrc(p.caseRef)}" alt="QR to ${esc(caseUrl(p.caseRef))}"
           onerror="this.style.display='none'">
      <div class="qr-cap">${esc(t.verify)}</div>
      <div class="qr-url">${esc(caseUrl(p.caseRef))}</div>
    </div>
    <div class="foot-body">
      <span class="shield-chip">${esc(t.shield)}</span>
      <p class="foot-p">${esc(t.disclaimer)}</p>
      <p class="foot-pdpa">${esc(t.pdpa)} · ${esc(t.continue)} veri.ai</p>
    </div>
  </div>

</div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Convenience builders — each Phase 1 tool's standard payload shape.
// Keeps tool files thin: build a plain object, pass to buildXReport, export.
// ─────────────────────────────────────────────────────────────────────────────

// ── Tenant-screening specific i18n (Track Record — dossier-framed) ────────
// v3.3.3 T13 dossier pivot: the report no longer leads with a 0-100 score
// on the tenant's name. The hero badge now states what evidence is on file
// ("4 of 4 signals on file"). Score is retained internally for sort order
// but is NEVER surfaced as the headline number. Headings reframed from
// "Payment Discipline Index" → "Track record" to describe the tenant's
// DOCUMENTED evidence, not a verdict on them.
const SCREEN_I18N = {
  en: {
    trackRecordHeading: 'Track record',
    trackRecordLabel: 'Evidence on file',
    coverage4: '4 of 4 signals on file',
    coverage3: '3 of 4 signals on file',
    coverage2: '2 of 4 signals on file',
    coverage1: '1 of 4 signals on file',
    coverage0: 'No signals on file',
    coverageSub: 'Signals captured during the viewing with tenant\'s verbal consent.',
    tenantHeading: 'Tenant at the viewing',
    tenantName: 'Full name (per MyKad)',
    tenantIC: 'IC last 4',
    tenantPhone: 'Mobile',
    signalsHeading: 'Evidence captured',
    colSignal: 'Signal',
    colVendor: 'App / Vendor',
    colAccount: 'Name on account',
    colOnTime: 'On-time (of 12 mo)',
    colTenure: 'Tenure',
    colArrears: 'Arrears now?',
    findingsHeading: 'Observations',
    notesHeading: 'Notes',
    noVerdict: 'This report is NOT a credit score, NOT a grade, and NOT a recommendation. The track record describes documented evidence only — the decision to enter into a tenancy rests entirely with the landlord.',
    subDna: 'Veri.ai surfaces payment behaviour captured at the viewing. Signals shown were displayed on the tenant\'s own device under their verbal consent. No data was pulled from CCRIS, CTOS or any credit bureau.',
    signalElectricity: 'Electricity',
    signalMobile: 'Mobile postpaid',
    signalInternet: 'Home internet',
    signalWildcard: 'Voluntary subscription',
    yes: 'Yes', no: 'No', dash: '—',
    behaviourHeading: 'Behavioural observations',
    confidenceLabel: 'Confidence',
    adjustBonus: '+{n} consistency factor noted',
    adjustPenalty: '{n} priority-misalignment factor noted',
  },
  bm: {
    trackRecordHeading: 'Rekod jejak',
    trackRecordLabel: 'Bukti dalam fail',
    coverage4: '4 daripada 4 isyarat dalam fail',
    coverage3: '3 daripada 4 isyarat dalam fail',
    coverage2: '2 daripada 4 isyarat dalam fail',
    coverage1: '1 daripada 4 isyarat dalam fail',
    coverage0: 'Tiada isyarat dalam fail',
    coverageSub: 'Isyarat direkod semasa tinjauan dengan kebenaran lisan penyewa.',
    tenantHeading: 'Penyewa semasa tinjauan',
    tenantName: 'Nama penuh (ikut MyKad)',
    tenantIC: '4 digit akhir IC',
    tenantPhone: 'Mudah alih',
    signalsHeading: 'Bukti direkod',
    colSignal: 'Isyarat',
    colVendor: 'Aplikasi / Vendor',
    colAccount: 'Nama pada akaun',
    colOnTime: 'Tepat masa (12 bln)',
    colTenure: 'Tempoh',
    colArrears: 'Tunggakan sekarang?',
    findingsHeading: 'Pemerhatian',
    notesHeading: 'Nota',
    noVerdict: 'Laporan ini BUKAN skor kredit, BUKAN gred, dan BUKAN cadangan. Rekod jejak ini hanya menggambarkan bukti yang didokumenkan — keputusan untuk meneruskan sewaan sepenuhnya di tangan tuan rumah.',
    subDna: 'Veri.ai hanya memaparkan tingkah laku bayaran yang direkod semasa tinjauan. Isyarat ditunjukkan pada peranti penyewa sendiri dengan kebenaran lisan. Tiada data diambil daripada CCRIS, CTOS atau mana-mana biro kredit.',
    signalElectricity: 'Elektrik',
    signalMobile: 'Pascabayar mudah alih',
    signalInternet: 'Internet rumah',
    signalWildcard: 'Langganan sukarela',
    yes: 'Ya', no: 'Tidak', dash: '—',
    behaviourHeading: 'Pemerhatian tingkah laku',
    confidenceLabel: 'Keyakinan',
    adjustBonus: 'Faktor konsistensi +{n} dicatat',
    adjustPenalty: 'Faktor misalignment keutamaan {n} dicatat',
  },
  zh: {
    trackRecordHeading: '履历',
    trackRecordLabel: '已归档证据',
    coverage4: '已归档 4 / 4 项信号',
    coverage3: '已归档 3 / 4 项信号',
    coverage2: '已归档 2 / 4 项信号',
    coverage1: '已归档 1 / 4 项信号',
    coverage0: '尚未归档任何信号',
    coverageSub: '信号于看房时经租客口头同意后在其本人设备上展示。',
    tenantHeading: '看房当天的租客',
    tenantName: '全名（按身份证）',
    tenantIC: '身份证后4位',
    tenantPhone: '手机',
    signalsHeading: '已记录证据',
    colSignal: '信号',
    colVendor: '应用 / 服务商',
    colAccount: '账户姓名',
    colOnTime: '按时（12个月）',
    colTenure: '账户时长',
    colArrears: '当前欠款？',
    findingsHeading: '观察',
    notesHeading: '说明',
    noVerdict: '本报告并非信用评分、并非评级、也不是推荐建议。履历仅描述已归档的证据——是否签约完全由房东自行决定。',
    subDna: 'Veri.ai 仅展示看房时记录的付款行为。所有信号均在租客本人设备上、经其口头同意后展示。未从 CCRIS、CTOS 或任何征信机构拉取数据。',
    signalElectricity: '电费',
    signalMobile: '手机后付',
    signalInternet: '家庭宽带',
    signalWildcard: '自愿订阅',
    yes: '是', no: '否', dash: '—',
    behaviourHeading: '行为观察',
    confidenceLabel: '置信度',
    adjustBonus: '已记录一致性因素 +{n}',
    adjustPenalty: '已记录优先级错位因素 {n}',
  },
};

// Tone band now driven by COVERAGE (evidence completeness), not by score.
// This is the doctrinal pivot — we reward a COMPLETE record, not a "good"
// tenant. Slate for 0-1 signals (incomplete but not bad), amber for 2/4,
// blue for 3/4, green for 4/4. No red, ever — a sparse record is not a
// verdict on the tenant.
function coverageTone(c) {
  const v = Number(c);
  if (Number.isNaN(v)) return 'navy';
  if (v >= 4) return 'green';
  if (v >= 3) return 'blue';
  if (v >= 2) return 'yellow';
  return 'navy';
}

// Human-readable coverage statement for the badge value. Returns the full
// "X of 4 signals on file" string in the active language.
function coverageBadgeValue(t, c) {
  const v = Math.max(0, Math.min(4, Number(c) || 0));
  return ([t.coverage0, t.coverage1, t.coverage2, t.coverage3, t.coverage4])[v];
}

function signalLabel(t, key) {
  return ({
    electricity: t.signalElectricity,
    mobile: t.signalMobile,
    internet: t.signalInternet,
    wildcard: t.signalWildcard,
  })[key] || key;
}

/**
 * Build the Tenant Screening report (Payment Discipline Scan — Bloomberg-not-FICO).
 *
 * Expected payload shape:
 *   tenant: { name, icLast4, phone, landlord }
 *   index:  { score: 0-100, coverage: 0-4 }
 *   signals: Array<{
 *     key: 'electricity'|'mobile'|'internet'|'wildcard',
 *     vendor?, accountName?, onTimeMonths?, tenure?, hasArrears?, wildcardCategory?
 *   }>
 *   flags: Array<{ severity:'red'|'amber'|'green', title, detail? }>
 */
export function buildScreenReport({ tenant, index, signals, flags, behaviour, lang = 'en', caseRef, property }) {
  const t = SCREEN_I18N[lang] || SCREEN_I18N.en;
  const pl = PATTERN_LABELS[lang] || PATTERN_LABELS.en;
  const il = INSIGHT_LABELS[lang] || INSIGHT_LABELS.en;
  const cl = CONFIDENCE_LABELS[lang] || CONFIDENCE_LABELS.en;

  const tenantKV = tenant && {
    heading: t.tenantHeading,
    kind: 'kv',
    data: [
      [t.tenantName, tenant.name || t.dash],
      [t.tenantIC,   tenant.icLast4 || t.dash],
      [t.tenantPhone, tenant.phone || t.dash],
    ],
  };

  const sigTable = Array.isArray(signals) && signals.length ? {
    heading: t.signalsHeading,
    kind: 'table',
    data: {
      headers: [t.colSignal, t.colVendor, t.colAccount, t.colOnTime, t.colTenure, t.colArrears],
      rows: signals.map(s => [
        signalLabel(t, s.key),
        s.vendor || t.dash,
        s.accountName || t.dash,
        (s.onTimeMonths || s.onTimeMonths === 0) ? `${s.onTimeMonths} / 12` : t.dash,
        s.tenure || t.dash,
        s.hasArrears === true ? t.yes : (s.hasArrears === false ? t.no : t.dash),
      ]),
    },
  } : null;

  // Dossier-framed badge: headline is coverage statement, not score.
  // The internal numeric score (index.score) is intentionally NOT shown
  // anywhere in the PDF — doctrine says the report describes evidence
  // on file, not a grade on the tenant.
  const trackRecordBadge = index != null ? {
    heading: t.trackRecordHeading,
    kind: 'badge',
    data: {
      label: t.trackRecordLabel,
      value: coverageBadgeValue(t, index.coverage),
      tone: coverageTone(index.coverage),
      sub: t.coverageSub,
    },
  } : null;

  // Behavioural Observations — psychology layer. Explains the SHAPE of the
  // score (priorities, tenure, voluntary commitment, ownership match) so the
  // landlord reads behaviour, not a verdict.
  const behaviourSection = (behaviour && behaviour.pattern) ? {
    heading: t.behaviourHeading,
    kind: 'text',
    data: [
      `${pl[behaviour.pattern]?.title || behaviour.pattern} — ${pl[behaviour.pattern]?.sub || ''}`,
      `${t.confidenceLabel}: ${cl[behaviour.confidence] || behaviour.confidence || ''}`,
      ...((behaviour.insights || []).map(k => `• ${il[k] || k}`)),
      behaviour.adjust > 0
        ? t.adjustBonus.replace('{n}', String(behaviour.adjust))
        : behaviour.adjust < 0
          ? t.adjustPenalty.replace('{n}', String(behaviour.adjust))
          : '',
    ].filter(Boolean),
  } : null;

  return {
    kind: 'screen',
    lang,
    caseRef,
    title: KIND_LABELS.screen[lang] || KIND_LABELS.screen.en,
    meta: { preparedFor: tenant?.landlord || '', property },
    sections: [
      trackRecordBadge,
      behaviourSection,
      tenantKV,
      sigTable,
      flags?.length && { heading: t.findingsHeading, kind: 'flags', data: flags },
      {
        heading: t.notesHeading,
        kind: 'text',
        data: [t.noVerdict, t.subDna],
      },
    ].filter(Boolean),
  };
}

export function buildAuditReport({ parties, score, flags, rewrites, lang = 'en', caseRef, property }) {
  return {
    kind: 'audit',
    lang,
    caseRef,
    title: KIND_LABELS.audit[lang] || KIND_LABELS.audit.en,
    meta: { preparedFor: parties?.landlord || '', property },
    sections: [
      score != null && {
        heading: 'Health score',
        kind: 'score',
        data: { grade: score.grade, label: score.label || 'Agreement health', sub: score.sub },
      },
      parties && {
        heading: 'Parties',
        kind: 'kv',
        data: [
          ['Landlord', parties.landlord || '—'],
          ['Tenant', parties.tenant || '—'],
          ['Monthly rent', parties.rent ? `RM ${parties.rent}` : '—'],
          ['Term (months)', parties.term || '—'],
        ],
      },
      flags?.length && { heading: 'Clause flags', kind: 'flags', data: flags },
      rewrites?.length && { heading: 'Suggested rewrites', kind: 'list', data: rewrites },
    ].filter(Boolean),
  };
}

export function buildStampReport({ rent, years, result, lang = 'en', caseRef, landlord, property }) {
  return {
    kind: 'stamp',
    lang,
    caseRef,
    title: KIND_LABELS.stamp[lang] || KIND_LABELS.stamp.en,
    meta: { preparedFor: landlord || '', property },
    sections: [
      {
        heading: 'Assessment',
        kind: 'badge',
        data: {
          label: 'Stamp duty payable (SDSAS 2026)',
          value: `RM ${Number(result.duty).toFixed(2)}`,
          tone: 'navy',
          sub: `${result.units} × RM${result.rate} tier · minimum RM 10`,
        },
      },
      {
        heading: 'Computation',
        kind: 'kv',
        data: [
          ['Monthly rent (RM)', Number(rent).toLocaleString()],
          ['Lease term (years)', String(years)],
          ['Annual rent (RM)', Number(result.annual).toLocaleString()],
          ['Units (ceil(annual / 250))', String(result.units)],
          ['Rate tier (RM per unit)', String(result.rate)],
          ['Stamp duty payable', `RM ${Number(result.duty).toFixed(2)}`],
        ],
      },
      {
        heading: 'How to stamp (STAMPS / e-Duti Setem)',
        kind: 'list',
        data: [
          'Log in to stamps.hasil.gov.my with your MyDigital ID.',
          'Submit the tenancy instrument within 30 days of execution to avoid penalty.',
          'Pay the duty via FPX; download the e-Duti Setem QR certificate.',
          'Attach the certificate to both counterpart copies of the tenancy agreement.',
          'Retain digital + paper copies for at least 7 years (tax audit window).',
        ],
      },
      {
        heading: 'Notes',
        kind: 'text',
        data: [
          'SDSAS 2026 removes the prior RM2,400 annual-rent exemption. Every tenancy now incurs duty, with a RM10 floor.',
          'Under SDSAS self-assessment, an under-declaration attracts up to RM10,000 per incorrect assessment (Stamp Act 1949 s.62, as amended by Finance Act 2025).',
        ],
      },
    ],
  };
}

export function buildChatReport({ title, messages, lang = 'en', caseRef, property, landlord }) {
  return {
    kind: 'chat',
    lang,
    caseRef,
    title: title || (KIND_LABELS.chat[lang] || KIND_LABELS.chat.en),
    meta: { preparedFor: landlord || '', property },
    sections: (messages || []).map((m, i) => ({
      heading: m.role === 'user' ? `Q${i + 1}` : `A${i + 1}`,
      kind: 'text',
      data: m.content || '',
    })),
  };
}
