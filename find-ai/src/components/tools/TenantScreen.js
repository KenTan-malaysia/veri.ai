'use client';

import { useState, useMemo } from 'react';
import { Modal, ToolHeader, ActionBtn } from './shared';
import { makeCaseRef } from '../../lib/pdfExport';

// ────────────────────────────────────────────────────────────────────────────
// TOOL 1 — Tenant Credit Score (v0 MOCK DEMO)
//
// Spec lock: 2026-04-25 v3.4 (see ARCH_CREDIT_SCORE.md).
//
// Model:
//   STEP 2 — LHDN cert is the IDENTITY GATE only. Pass/fail. Proves the tenant
//            is a real previous renter at a real address. Contributes ZERO to
//            the credit score. Tenant can either key in cert # OR upload PDF.
//   STEP 3 — Utility bills are the PURE PAYING-BEHAVIOUR SCORE (0-100). Tenant
//            picks the lowest-effort method per utility:
//              · Account # only (we look up the bill — works for current month)
//              · Upload 1 recent bill (one bill natively contains 3-6 months
//                of "Bayaran Diterima" payment history — strongest signal/effort)
//              · Upload multiple bills (max coverage)
//
// THIS IS A MOCK DEMO BUILD:
//   - Any LHDN cert # OR uploaded LHDN PDF → returns fake "verified" data
//   - Account # OR uploaded bill → marks utility as covered (mock 14 months)
//   - Score is hardcoded to 94/100
//   - Real OCR + LHDN integration happens in later sessions per build order
//     in ARCH_CREDIT_SCORE.md
// ────────────────────────────────────────────────────────────────────────────

const DEMO_MODE = true;

// Inline EN/BM/ZH strings — kept local for v0 to avoid disturbing labels.js.
const STR = {
  en: {
    title: 'Tenant Credit Score',
    desc: 'LHDN-verified tenancy + utility paying behaviour',
    stepLabel: 'Step',
    of: 'of',
    s1Title: 'Tenant identity',
    s1Sub: 'Enter what the tenant told you. We will verify it next.',
    nameLabel: 'Full name (per MyKad)',
    namePh: 'Ahmad bin Ali',
    icLabel: 'IC last 4 digits',
    icPh: '4321',
    s2Title: 'LHDN tenancy verification',
    s2Sub: 'This step proves the tenant really rented before. We cross-check the cert against LHDN STAMPS — nothing from the cert affects the score.',
    methodNumber: '⌨️  Key in number',
    methodPdf: '📎  Upload PDF',
    certLabel: 'LHDN stamp certificate number',
    certPh: 'e.g. ABC1234567890',
    pdfDropPrompt: 'Tap to upload LHDN cert PDF',
    pdfDropHint: 'PDF or image · max 10 MB',
    pdfReady: 'Ready to verify',
    verify: 'Verify with LHDN',
    verifying: 'Verifying with LHDN…',
    verified: 'LHDN VERIFIED',
    verifiedTenancy: 'Verified previous tenancy',
    period: 'Period',
    address: 'Address',
    icMatched: 'IC matches MyKad on file',

    s3Title: 'Utility payment history',
    s3Sub: 'For each utility, pick whichever the tenant has handy. Account number alone is enough — one recent bill is even better (it includes 3-6 months of payment history).',
    add: 'Add',
    edit: 'Edit',
    methodAcct: '⌨️  Account number',
    methodAcctHint: 'Quick check · current bill only',
    methodUpload: '📎  Upload bill',
    methodUploadHint: '★ Best · 1 bill includes 3 months history',
    acctPlaceholder: 'Account number',
    acctTnbPh: 'e.g. 220012345678',
    acctWaterPh: 'e.g. 4001234567',
    acctMobilePh: 'e.g. 0123456789',
    uploadAnyBill: 'Tap to upload bill (any recent month)',
    uploadHint: 'PDF or photo · 1 bill = 3 months timing data',
    confirm: 'Confirm',
    cancel: 'Cancel',
    addedAcct: 'Account ····{tail} · Active · 1 bill checked',
    addedFile: 'Bill uploaded · 3 months timing extracted',
    addedFileFromAcct: 'Account ····{tail} · 3 months timing extracted',

    tnb: 'TNB (Electricity)',
    water: 'Water (Air Selangor / SYABAS)',
    mobile: 'Mobile postpaid (Maxis / CelcomDigi / U Mobile / Yes)',
    monthsCovered: 'months covered',
    seeScore: 'See paying behaviour score',
    needTwo: 'Add at least TNB + Water to continue',

    s4Title: 'Paying Behaviour Score',
    timingHeader: 'Average payment timing',
    gapBefore: '{n} days BEFORE due date',
    gapAfter: '{n} days AFTER due date',
    gapSame: 'On the due date',
    variance: '±{n} days variance',
    predictHigh: 'Highly predictable',
    predictMid: 'Somewhat predictable',
    predictLow: 'Erratic',
    upfrontTag: '✓ Upfront tenant',
    onTimeTag: '✓ On-time tenant',
    lateTag: '⚠ Late tenant',
    tierUpfront: 'Upfront',
    tierOnTime: 'On-time',
    tierLate: 'Late',
    tierVeryLate: 'Very late',
    tierDefault: 'Default',
    months: 'months',
    autoDebit: 'auto-debit',
    sourcedFrom: 'Sourced from',
    monthsBills: 'months of utility bills at the verified address',
    confidence: 'Confidence',
    confMature: 'Mature · 14 months verified',
    exportCard: '🛡️ Save Trust Card',
    cardBrand: 'TRUST CARD',
    cardSub: 'Business-card format · WhatsApp shareable',
    cardVerified: 'MyDigital ID verified',
    cardEarlyDays: '{n} days early',
    cardLateDays: '{n} days late',
    cardOnTime: 'On the day',
    cardUtilities: 'TNB · Water · Mobile · LHDN ✓',
    saveCase: 'Save to case memory',
    savedCase: 'Saved to case memory',
    landlordSafetyNote: 'This score reflects payment behaviour only. The decision to enter tenancy rests with you.',
    next: 'Next',
    back: 'Back',
    start: 'Start credit check',
    introTitle: 'Run a credit check on this tenant',
    introBullets: [
      'LHDN-verified tenancy proof (government source)',
      'Utility paying behaviour from real bills',
      'Branded Find.ai Trust Report PDF',
    ],
    introTime: '~3 minutes · Tenant cooperation required',
  },
  bm: {
    title: 'Skor Kredit Penyewa',
    desc: 'Sewaan disahkan LHDN + tingkah laku bayaran utiliti',
    stepLabel: 'Langkah',
    of: 'daripada',
    s1Title: 'Identiti penyewa',
    s1Sub: 'Masukkan apa yang penyewa beritahu anda. Kami akan sahkan seterusnya.',
    nameLabel: 'Nama penuh (ikut MyKad)',
    namePh: 'Ahmad bin Ali',
    icLabel: '4 digit akhir IC',
    icPh: '4321',
    s2Title: 'Pengesahan sewaan LHDN',
    s2Sub: 'Langkah ini membuktikan penyewa benar-benar pernah menyewa. Kami semak silang sijil dengan LHDN STAMPS — tiada apa-apa dari sijil mempengaruhi skor.',
    methodNumber: '⌨️  Masukkan nombor',
    methodPdf: '📎  Muat naik PDF',
    certLabel: 'Nombor sijil setem LHDN',
    certPh: 'cth. ABC1234567890',
    pdfDropPrompt: 'Ketuk untuk muat naik PDF sijil LHDN',
    pdfDropHint: 'PDF atau imej · maks 10 MB',
    pdfReady: 'Sedia untuk sahkan',
    verify: 'Sahkan dengan LHDN',
    verifying: 'Mengesah dengan LHDN…',
    verified: 'DISAHKAN LHDN',
    verifiedTenancy: 'Sewaan terdahulu disahkan',
    period: 'Tempoh',
    address: 'Alamat',
    icMatched: 'IC sepadan dengan MyKad dalam fail',

    s3Title: 'Sejarah bayaran utiliti',
    s3Sub: 'Untuk setiap utiliti, pilih apa yang penyewa ada di tangan. Nombor akaun sahaja sudah cukup — satu bil terkini lagi bagus (termasuk 3-6 bulan sejarah bayaran).',
    add: 'Tambah',
    edit: 'Ubah',
    methodAcct: '⌨️  Nombor akaun',
    methodAcctHint: 'Semakan pantas · bil semasa sahaja',
    methodUpload: '📎  Muat naik bil',
    methodUploadHint: '★ Terbaik · 1 bil = 3 bulan sejarah',
    acctPlaceholder: 'Nombor akaun',
    acctTnbPh: 'cth. 220012345678',
    acctWaterPh: 'cth. 4001234567',
    acctMobilePh: 'cth. 0123456789',
    uploadAnyBill: 'Ketuk untuk muat naik bil (mana-mana bulan terkini)',
    uploadHint: 'PDF atau foto · 1 bil = 3 bulan data masa',
    confirm: 'Sahkan',
    cancel: 'Batal',
    addedAcct: 'Akaun ····{tail} · Aktif · 1 bil disemak',
    addedFile: 'Bil dimuat naik · 3 bulan masa diekstrak',
    addedFileFromAcct: 'Akaun ····{tail} · 3 bulan masa diekstrak',

    tnb: 'TNB (Elektrik)',
    water: 'Air (Air Selangor / SYABAS)',
    mobile: 'Pascabayar mudah alih (Maxis / CelcomDigi / U Mobile / Yes)',
    monthsCovered: 'bulan diliputi',
    seeScore: 'Lihat skor tingkah laku bayaran',
    needTwo: 'Tambah sekurang-kurangnya TNB + Air untuk teruskan',

    s4Title: 'Skor Tingkah Laku Bayaran',
    timingHeader: 'Purata masa bayaran',
    gapBefore: '{n} hari SEBELUM tarikh akhir',
    gapAfter: '{n} hari SELEPAS tarikh akhir',
    gapSame: 'Pada tarikh akhir',
    variance: 'varians ±{n} hari',
    predictHigh: 'Sangat boleh diramal',
    predictMid: 'Sederhana boleh diramal',
    predictLow: 'Tidak konsisten',
    upfrontTag: '✓ Penyewa awal',
    onTimeTag: '✓ Penyewa tepat masa',
    lateTag: '⚠ Penyewa lewat',
    tierUpfront: 'Awal',
    tierOnTime: 'Tepat masa',
    tierLate: 'Lewat',
    tierVeryLate: 'Sangat lewat',
    tierDefault: 'Gagal',
    months: 'bulan',
    autoDebit: 'auto-debit',
    sourcedFrom: 'Bersumberkan',
    monthsBills: 'bulan bil utiliti di alamat yang disahkan',
    confidence: 'Keyakinan',
    confMature: 'Matang · 14 bulan disahkan',
    exportCard: '🛡️ Simpan Kad Amanah',
    cardBrand: 'KAD AMANAH',
    cardSub: 'Format kad bisnes · boleh dikongsi WhatsApp',
    cardVerified: 'Disahkan MyDigital ID',
    cardEarlyDays: '{n} hari awal',
    cardLateDays: '{n} hari lewat',
    cardOnTime: 'Pada hari itu',
    cardUtilities: 'TNB · Air · Mudah Alih · LHDN ✓',
    saveCase: 'Simpan ke memori kes',
    savedCase: 'Disimpan ke memori kes',
    landlordSafetyNote: 'Skor ini hanya menggambarkan tingkah laku bayaran. Keputusan meneruskan sewaan terletak pada anda.',
    next: 'Seterusnya',
    back: 'Kembali',
    start: 'Mulakan semakan kredit',
    introTitle: 'Jalankan semakan kredit ke atas penyewa ini',
    introBullets: [
      'Bukti sewaan disahkan LHDN (sumber kerajaan)',
      'Tingkah laku bayaran utiliti dari bil sebenar',
      'PDF Laporan Amanah Find.ai berjenama',
    ],
    introTime: '~3 minit · Memerlukan kerjasama penyewa',
  },
  zh: {
    title: '租客信用评分',
    desc: 'LHDN 认证租赁 + 公用事业付款行为',
    stepLabel: '步骤',
    of: '/ 共',
    s1Title: '租客身份',
    s1Sub: '输入租客告诉您的信息。我们将在下一步验证。',
    nameLabel: '全名（按身份证）',
    namePh: 'Ahmad bin Ali',
    icLabel: '身份证后4位',
    icPh: '4321',
    s2Title: 'LHDN 租赁验证',
    s2Sub: '此步骤证明租客确实租赁过。我们与 LHDN STAMPS 交叉验证 — 证书内容不影响评分。',
    methodNumber: '⌨️  输入编号',
    methodPdf: '📎  上传 PDF',
    certLabel: 'LHDN 印花证书编号',
    certPh: '例：ABC1234567890',
    pdfDropPrompt: '点击上传 LHDN 证书 PDF',
    pdfDropHint: 'PDF 或图片 · 最大 10 MB',
    pdfReady: '准备验证',
    verify: '通过 LHDN 验证',
    verifying: '正在通过 LHDN 验证…',
    verified: 'LHDN 已验证',
    verifiedTenancy: '已验证的过往租赁',
    period: '期间',
    address: '地址',
    icMatched: '身份证与档案中 MyKad 匹配',

    s3Title: '公用事业付款记录',
    s3Sub: '每项公用事业，选租客手头有的。仅账户编号已足够 — 一份近期账单更佳（含3-6个月付款历史）。',
    add: '添加',
    edit: '编辑',
    methodAcct: '⌨️  账户编号',
    methodAcctHint: '快速核查 · 仅当前账单',
    methodUpload: '📎  上传账单',
    methodUploadHint: '★ 最佳 · 1 张账单 = 3 个月历史',
    acctPlaceholder: '账户编号',
    acctTnbPh: '例：220012345678',
    acctWaterPh: '例：4001234567',
    acctMobilePh: '例：0123456789',
    uploadAnyBill: '点击上传账单（任何近期月份）',
    uploadHint: 'PDF 或照片 · 1 张账单 = 3 个月时间数据',
    confirm: '确认',
    cancel: '取消',
    addedAcct: '账户 ····{tail} · 活跃 · 1 张账单已核查',
    addedFile: '账单已上传 · 提取 3 个月付款时间',
    addedFileFromAcct: '账户 ····{tail} · 提取 3 个月付款时间',

    tnb: 'TNB（电费）',
    water: '水费（Air Selangor / SYABAS）',
    mobile: '手机后付（Maxis / CelcomDigi / U Mobile / Yes）',
    monthsCovered: '个月覆盖',
    seeScore: '查看付款行为评分',
    needTwo: '至少添加 TNB + 水费才能继续',

    s4Title: '付款行为评分',
    timingHeader: '平均付款时间',
    gapBefore: '到期日前 {n} 天',
    gapAfter: '到期日后 {n} 天',
    gapSame: '到期日当天',
    variance: '±{n} 天波动',
    predictHigh: '高度可预测',
    predictMid: '中等可预测',
    predictLow: '不稳定',
    upfrontTag: '✓ 提前付款租客',
    onTimeTag: '✓ 准时付款租客',
    lateTag: '⚠ 迟付款租客',
    tierUpfront: '提前',
    tierOnTime: '准时',
    tierLate: '迟付',
    tierVeryLate: '严重迟付',
    tierDefault: '违约',
    months: '个月',
    autoDebit: '自动扣款',
    sourcedFrom: '来源于',
    monthsBills: '个月在已验证地址的公用事业账单',
    confidence: '可信度',
    confMature: '成熟 · 14 个月已验证',
    exportCard: '🛡️ 保存信任卡',
    cardBrand: '信任卡',
    cardSub: '名片格式 · 可通过 WhatsApp 分享',
    cardVerified: 'MyDigital ID 已验证',
    cardEarlyDays: '提前 {n} 天',
    cardLateDays: '迟 {n} 天',
    cardOnTime: '当天',
    cardUtilities: 'TNB · 水费 · 手机 · LHDN ✓',
    saveCase: '保存到案件记忆',
    savedCase: '已保存到案件记忆',
    landlordSafetyNote: '此评分仅反映付款行为。是否签约的决定权在您。',
    next: '下一步',
    back: '返回',
    start: '开始信用查核',
    introTitle: '对此租客进行信用查核',
    introBullets: [
      'LHDN 认证租赁证明（政府来源）',
      '从真实账单读取的公用事业付款行为',
      'Find.ai 品牌信任报告 PDF',
    ],
    introTime: '约 3 分钟 · 需租客配合',
  },
};

// Mock LHDN-verified tenancy data
const MOCK_LHDN_RESULT = {
  tenantName: 'Ahmad bin Ali',
  tenantIC: '901223-08-4321',
  address: 'Unit 12-3A, Pangsapuri Damai, Jalan Bukit Raja, 81100 Johor Bahru, Johor',
  periodFrom: '01/10/2024',
  periodTo: '30/11/2025',
  months: 14,
  landlordName: 'Tan Ken Yap',
};

// Mock score result — v3.4.1 timing-tier model.
// Each utility tracks per-month payment timing relative to due date:
//   upfront  = paid 7+ days before due date
//   onTime   = paid 0-6 days before due date
//   late     = paid 1-7 days after due date (within grace)
//   veryLate = paid 8+ days after due date
//   default  = carry-over to next bill or disconnection notice
// Mock shows a high-quality tenant: mostly upfront, no late events.
const MOCK_SCORE = {
  total: 94,
  avgGapDays: -4,        // negative = paid before due (good)
  varianceDays: 2,       // low variance = predictable
  utilities: [
    { name: 'TNB',            months: 14, upfront: 12, onTime: 2, late: 0, veryLate: 0, default: 0, autoDebit: false },
    { name: 'Air Selangor',   months: 14, upfront: 14, onTime: 0, late: 0, veryLate: 0, default: 0, autoDebit: true  },
    { name: 'Maxis Postpaid', months: 14, upfront: 13, onTime: 1, late: 0, veryLate: 0, default: 0, autoDebit: true  },
  ],
};

const COVERAGE_MOCK_MONTHS = 14;

// ─── helpers ─────────────────────────────────────────────────────────────────

function StepDots({ step, total = 4 }) {
  return (
    <div className="flex items-center gap-1.5 mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 rounded-full transition-all"
          style={{ flex: i === step ? 2 : 1, background: i <= step ? '#0f172a' : '#e2e8f0' }}
        />
      ))}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, mono = false }) {
  return (
    <div>
      {label && <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl px-4 py-3.5 text-[15px] focus:outline-none ${mono ? 'font-mono' : 'font-semibold'}`}
        style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#0f172a' }}
      />
    </div>
  );
}

function VerifiedBadge({ label }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
      style={{ background: '#065f46', color: '#fff' }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {label}
    </span>
  );
}

function MethodTabs({ value, onChange, t }) {
  const opts = [
    { id: 'number', label: t.methodNumber },
    { id: 'pdf', label: t.methodPdf },
  ];
  return (
    <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#f1f5f9' }}>
      {opts.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className="flex-1 py-2.5 rounded-lg text-[12px] font-bold transition active:scale-[0.98]"
            style={active
              ? { background: '#fff', color: '#0f172a', boxShadow: '0 1px 3px rgba(15,23,42,0.08)' }
              : { background: 'transparent', color: '#64748b' }
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function PdfDropZone({ pdfName, onPick, t }) {
  return (
    <label
      className="block rounded-xl cursor-pointer transition active:scale-[0.99]"
      style={pdfName
        ? { background: '#d1fae5', border: '1px dashed #65a30d' }
        : { background: '#f8fafc', border: '1px dashed #cbd5e1' }
      }
    >
      <div className="px-4 py-6 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: pdfName ? '#065f46' : '#fff', boxShadow: pdfName ? 'none' : '0 1px 2px rgba(15,23,42,0.04)' }}
        >
          {pdfName ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold truncate" style={{ color: pdfName ? '#065f46' : '#0f172a' }}>
            {pdfName || t.pdfDropPrompt}
          </div>
          <div className="text-[10.5px] mt-0.5 truncate" style={{ color: pdfName ? '#065f46' : '#94a3b8' }}>
            {pdfName ? t.pdfReady : t.pdfDropHint}
          </div>
        </div>
      </div>
      <input
        type="file"
        accept="application/pdf,image/*"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) onPick(e.target.files[0].name); }}
      />
    </label>
  );
}

// ─── BillTile — utility input with two methods (account # OR upload) ─────────
//
// State machine per tile:
//   { open: false, method: null }            ← initial collapsed
//   { open: true, method: null }             ← expanded, method picker shown
//   { open: true, method: 'acct', value: '' }← account # input visible
//   { open: true, method: 'file', file: ''}  ← file picker visible
//   { done: true, method, value | file }     ← collapsed green, with summary

function BillTile({ label, ph, state, setState, t }) {
  const { open = false, method = null, value = '', file = '', done = false } = state || {};

  // Collapsed completed state — green tile with summary.
  // Path 1 (account #): subdued — only confirms account is active, 1 bill of data.
  // Path 2 (upload):    full green — 3 months of native bill timing data extracted.
  if (done) {
    const tail = (value || '0000').slice(-4);
    const summary = method === 'acct'
      ? t.addedAcct.replace('{tail}', tail)
      : t.addedFile;
    return (
      <div className="p-3.5 rounded-xl flex items-center gap-3"
        style={{ background: '#d1fae5', border: '1px solid #a7f3d0' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#065f46' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-bold truncate" style={{ color: '#065f46' }}>{label}</div>
          <div className="text-[10px] mt-0.5 truncate" style={{ color: '#065f46' }}>{summary}</div>
        </div>
        <button
          onClick={() => setState({ open: true, method: null, value: '', file: '', done: false })}
          className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition active:scale-95 flex-shrink-0"
          style={{ background: '#fff', color: '#065f46' }}
        >
          {t.edit}
        </button>
      </div>
    );
  }

  // Closed initial state — tile with Add button
  if (!open) {
    return (
      <div className="p-3.5 rounded-xl flex items-center gap-3"
        style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: '#fff', boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-bold truncate" style={{ color: '#0f172a' }}>{label}</div>
          <div className="text-[10px] mt-0.5" style={{ color: '#94a3b8' }}>—</div>
        </div>
        <button
          onClick={() => setState({ open: true, method: null, value: '', file: '', done: false })}
          className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition active:scale-95 flex-shrink-0"
          style={{ background: '#0f172a', color: '#fff' }}
        >
          {t.add}
        </button>
      </div>
    );
  }

  // Expanded — picker or chosen-method input
  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
      {/* Header row */}
      <div className="px-3.5 pt-3.5 pb-2.5 flex items-center justify-between">
        <div className="text-[12px] font-bold" style={{ color: '#0f172a' }}>{label}</div>
        <button
          onClick={() => setState({ open: false, method: null, value: '', file: '', done: false })}
          className="text-[10px] font-semibold px-2 py-1 rounded transition active:scale-95"
          style={{ color: '#64748b' }}
        >
          {t.cancel}
        </button>
      </div>

      {/* Method picker — Upload first (★ best) per realistic data path; account # second */}
      {!method && (
        <div className="px-3.5 pb-3.5 space-y-2">
          <button
            onClick={() => setState({ ...state, method: 'file' })}
            className="w-full p-3 rounded-lg text-left transition active:scale-[0.99] flex items-center justify-between"
            style={{ background: '#fff', border: '1px solid #65a30d' }}
          >
            <div>
              <div className="text-[13px] font-bold" style={{ color: '#0f172a' }}>{t.methodUpload}</div>
              <div className="text-[10.5px] mt-0.5" style={{ color: '#65a30d' }}>{t.methodUploadHint}</div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded flex-shrink-0" style={{ background: '#d1fae5', color: '#065f46' }}>★</span>
          </button>
          <button
            onClick={() => setState({ ...state, method: 'acct' })}
            className="w-full p-3 rounded-lg text-left transition active:scale-[0.99]"
            style={{ background: '#fff', border: '1px solid #cbd5e1' }}
          >
            <div className="text-[13px] font-bold" style={{ color: '#0f172a' }}>{t.methodAcct}</div>
            <div className="text-[10.5px] mt-0.5" style={{ color: '#94a3b8' }}>{t.methodAcctHint}</div>
          </button>
        </div>
      )}

      {/* Account # input */}
      {method === 'acct' && (
        <div className="px-3.5 pb-3.5 space-y-2.5">
          <TextInput value={value} onChange={(v) => setState({ ...state, value: v })} placeholder={ph} mono />
          <div className="flex gap-2">
            <button
              onClick={() => setState({ ...state, method: null })}
              className="px-4 py-2.5 rounded-lg text-[12px] font-semibold transition active:scale-95"
              style={{ background: '#fff', color: '#475569', border: '1px solid #e2e8f0' }}
            >
              {t.back}
            </button>
            <button
              onClick={() => setState({ ...state, done: true })}
              disabled={!value.trim()}
              className="flex-1 py-2.5 rounded-lg text-[12px] font-bold text-white disabled:opacity-40 transition active:scale-[0.98]"
              style={{ background: '#0f172a' }}
            >
              {t.confirm}
            </button>
          </div>
        </div>
      )}

      {/* File upload input */}
      {method === 'file' && (
        <div className="px-3.5 pb-3.5 space-y-2.5">
          <label
            className="block p-3 rounded-lg cursor-pointer transition active:scale-[0.99]"
            style={file
              ? { background: '#d1fae5', border: '1px dashed #65a30d' }
              : { background: '#fff', border: '1px dashed #cbd5e1' }
            }
          >
            <div className="flex items-center gap-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={file ? '#065f46' : '#64748b'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                {file ? <polyline points="20 6 9 17 4 12" /> : <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></>}
              </svg>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold truncate" style={{ color: file ? '#065f46' : '#0f172a' }}>
                  {file || t.uploadAnyBill}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: file ? '#065f46' : '#94a3b8' }}>
                  {file ? t.pdfReady : t.uploadHint}
                </div>
              </div>
            </div>
            <input
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) setState({ ...state, file: e.target.files[0].name }); }}
            />
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setState({ ...state, method: null })}
              className="px-4 py-2.5 rounded-lg text-[12px] font-semibold transition active:scale-95"
              style={{ background: '#fff', color: '#475569', border: '1px solid #e2e8f0' }}
            >
              {t.back}
            </button>
            <button
              onClick={() => setState({ ...state, done: true })}
              disabled={!file}
              className="flex-1 py-2.5 rounded-lg text-[12px] font-bold text-white disabled:opacity-40 transition active:scale-[0.98]"
              style={{ background: '#0f172a' }}
            >
              {t.confirm}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── UtilityTimingCard — per-utility tier breakdown bar ─────────────────────
//
// Stacked horizontal bar showing the distribution of payment timing tiers
// for one utility, with a legend below. Tiers shown only if count > 0 to
// keep the legend compact.
function UtilityTimingCard({ utility, t }) {
  const total = utility.months || 1;
  const segs = [
    { key: 'upfront',  count: utility.upfront  || 0, color: '#10b981', icon: '🥇', label: t.tierUpfront },
    { key: 'onTime',   count: utility.onTime   || 0, color: '#84cc16', icon: '✅', label: t.tierOnTime },
    { key: 'late',     count: utility.late     || 0, color: '#f59e0b', icon: '⚠️', label: t.tierLate },
    { key: 'veryLate', count: utility.veryLate || 0, color: '#ef4444', icon: '🔴', label: t.tierVeryLate },
    { key: 'default',  count: utility.default  || 0, color: '#1e293b', icon: '💀', label: t.tierDefault },
  ].filter((s) => s.count > 0);

  return (
    <div className="p-3.5 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="text-[12px] font-bold truncate" style={{ color: '#0f172a' }}>{utility.name}</div>
          {utility.autoDebit && (
            <span className="text-[8.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ background: '#dbeafe', color: '#1e40af' }}>{t.autoDebit}</span>
          )}
        </div>
        <div className="text-[10px] flex-shrink-0" style={{ color: '#94a3b8' }}>{utility.months} {t.months}</div>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden mb-2" style={{ background: '#e2e8f0' }}>
        {segs.map((s) => (
          <div key={s.key} style={{ width: `${(s.count / total) * 100}%`, background: s.color }} title={`${s.label}: ${s.count}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {segs.map((s) => (
          <span key={s.key} className="text-[10.5px] font-semibold flex items-center gap-1" style={{ color: '#475569' }}>
            <span>{s.icon}</span>
            <span>{s.count} {s.label.toLowerCase()}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── TrustCardPreview — business-card-format Trust Card visual ──────────────
//
// Replaces the "Export PDF Report" output with a compact business-card visual
// (~85×55mm credit-card aspect, ~1.586:1) that's WhatsApp-shareable and
// glanceable in 2 seconds. The actual exported artifact (Phase 1 build step
// 6) will render this same layout as a single-page PDF at business-card
// dimensions plus a QR code that triggers Live Bound Verification.
function TrustCardPreview({ tenantName, tenantIC, score, lhdnResult, avgGapDays, caseRef, t }) {
  const gapText = avgGapDays < 0
    ? t.cardEarlyDays.replace('{n}', String(Math.abs(avgGapDays)))
    : avgGapDays > 0
      ? t.cardLateDays.replace('{n}', String(avgGapDays))
      : t.cardOnTime;

  return (
    <div className="rounded-2xl overflow-hidden" style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      boxShadow: '0 8px 24px rgba(15,23,42,0.10), 0 1px 2px rgba(15,23,42,0.06)',
    }}>
      {/* Top strip — navy gradient with brand */}
      <div className="px-4 py-2.5 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="flex items-center gap-2">
          <span className="text-white text-[11px] font-black tracking-tight">🛡️ FIND.AI</span>
          <span className="text-[8.5px] font-black uppercase tracking-widest" style={{ color: '#B8893A' }}>
            {t.cardBrand}
          </span>
        </div>
        <span className="text-[8px] font-mono" style={{ color: 'rgba(255,255,255,0.55)' }}>2026.04.25</span>
      </div>

      {/* Body */}
      <div className="px-4 pt-3.5 pb-3 space-y-3">
        {/* Tenant identity row */}
        <div>
          <div className="text-[15px] font-bold leading-tight" style={{ color: '#0f172a' }}>{tenantName || 'Tenant'}</div>
          <div className="text-[9.5px] mt-0.5" style={{ color: '#94a3b8' }}>
            IC ····{tenantIC || 'XXXX'} · {t.cardVerified}
          </div>
        </div>

        {/* Score row + star rating */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-[32px] font-bold leading-none" style={{ color: '#0f172a' }}>{score}</div>
              <div className="text-[12px]" style={{ color: '#94a3b8' }}>/ 100</div>
            </div>
            <div className="text-[9.5px] font-bold mt-1.5" style={{ color: '#065f46' }}>
              {t.upfrontTag} · {gapText}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] tracking-tight" style={{ color: '#B8893A' }}>★★★★★</div>
            <div className="text-[8.5px] mt-0.5" style={{ color: '#94a3b8' }}>{lhdnResult?.months || 14} {t.months}</div>
          </div>
        </div>
      </div>

      {/* Bottom strip — utilities + QR + ref */}
      <div className="px-4 py-2.5 flex items-center justify-between"
        style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <div className="text-[9px] font-semibold leading-snug min-w-0 truncate" style={{ color: '#475569' }}>
          {t.cardUtilities}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Tiny QR placeholder — real QR triggers LBV face-match */}
          <div className="w-7 h-7 rounded-sm relative" style={{ background: '#0f172a' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" className="absolute inset-0">
              <rect x="3" y="3" width="6" height="6" fill="#fff"/>
              <rect x="5" y="5" width="2" height="2" fill="#0f172a"/>
              <rect x="19" y="3" width="6" height="6" fill="#fff"/>
              <rect x="21" y="5" width="2" height="2" fill="#0f172a"/>
              <rect x="3" y="19" width="6" height="6" fill="#fff"/>
              <rect x="5" y="21" width="2" height="2" fill="#0f172a"/>
              <rect x="11" y="11" width="6" height="6" fill="#fff"/>
              <rect x="13" y="13" width="2" height="2" fill="#0f172a"/>
              <rect x="11" y="3" width="2" height="2" fill="#fff"/>
              <rect x="14" y="5" width="2" height="2" fill="#fff"/>
              <rect x="22" y="11" width="2" height="2" fill="#fff"/>
              <rect x="11" y="22" width="2" height="2" fill="#fff"/>
              <rect x="19" y="19" width="3" height="3" fill="#fff"/>
              <rect x="23" y="22" width="2" height="2" fill="#fff"/>
            </svg>
          </div>
          <span className="text-[8.5px] font-mono" style={{ color: '#94a3b8' }}>{(caseRef || 'FA-XXXX').slice(0, 9)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function TenantScreen({
  lang = 'en',
  onClose,
  onAsk,
  askLabel,
  activeMemory,
  onSaveMemory,
  caseRef,
  profileLandlord,
  property,
}) {
  const t = STR[lang] || STR.en;
  const stableCaseRef = useMemo(() => caseRef || makeCaseRef(), [caseRef]);

  // Step machine: 0 intro / 1 identity / 2 LHDN / 3 bills / 4 score
  const [step, setStep] = useState(0);

  // Step 1 state
  const [tenantName, setTenantName] = useState(activeMemory?.tenant?.name || (DEMO_MODE ? MOCK_LHDN_RESULT.tenantName : ''));
  const [tenantIC, setTenantIC] = useState(activeMemory?.tenant?.icLast4 || (DEMO_MODE ? '4321' : ''));

  // Step 2 state — dual-input: tenant picks number OR pdf
  const [lhdnMethod, setLhdnMethod] = useState('number'); // 'number' | 'pdf'
  const [certNumber, setCertNumber] = useState(DEMO_MODE ? 'ABC1234567890' : '');
  const [lhdnPdfName, setLhdnPdfName] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [lhdnResult, setLhdnResult] = useState(null);

  // Step 3 state — TNB + Water + Mobile, each with its own mini-state machine
  const blank = { open: false, method: null, value: '', file: '', done: false };
  const [tnbState, setTnbState] = useState(blank);
  const [waterState, setWaterState] = useState(blank);
  const [mobileState, setMobileState] = useState(blank);

  // Step 4 state
  const [savedToCase, setSavedToCase] = useState(false);

  const goNext = () => setStep((s) => Math.min(s + 1, 4));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  // Mock LHDN verification — accepts both number and PDF paths.
  const verifyWithLHDN = () => {
    const ready = lhdnMethod === 'number' ? !!certNumber.trim() : !!lhdnPdfName;
    if (!ready) return;
    setVerifying(true);
    setTimeout(() => {
      setLhdnResult(MOCK_LHDN_RESULT);
      setVerifying(false);
    }, 1400);
  };

  const verifyDisabled = verifying || (lhdnMethod === 'number' ? !certNumber.trim() : !lhdnPdfName);

  // TNB + Water required, Mobile is bonus
  const billsOk = tnbState.done && waterState.done;

  const saveToCase = () => {
    if (!onSaveMemory) return;
    const prev = activeMemory || {
      property: { nickname: '', state: '', propertyType: '', address: '', monthlyRent: '' },
      disputes: [],
      taxDates: { lastStampDate: '', assessmentDue: '', insuranceRenewal: '', myInvoisStatus: '' },
      tenant: { name: '', icLast4: '', usccOrPassport: '', deposit: '', consented: false, consentedAt: null },
    };
    const today = new Date();
    const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const next = {
      ...prev,
      tenant: { ...prev.tenant, name: tenantName, icLast4: tenantIC },
      disputes: [
        ...(prev.disputes || []),
        {
          date: ymd,
          action: `Tenant credit score: ${MOCK_SCORE.total}/100 · LHDN verified · ${MOCK_LHDN_RESULT.months} months utility history`,
          note: `Ref ${stableCaseRef}`,
        },
      ],
    };
    onSaveMemory(next);
    setSavedToCase(true);
  };

  // ─── render ───────────────────────────────────────────────────────────────

  return (
    <Modal>
      <ToolHeader icon="🛡️" title={t.title} desc={t.desc} onClose={onClose} onAsk={onAsk} askLabel={askLabel} />

      {DEMO_MODE && (
        <div className="mb-4 px-3 py-2 rounded-lg flex items-center gap-2"
          style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
            style={{ background: '#92400E', color: '#fff' }}>DEMO</span>
          <span className="text-[11px] font-semibold" style={{ color: '#92400E' }}>
            v0 mock — any input counts as success · score is hardcoded 94/100
          </span>
        </div>
      )}

      {step > 0 && step < 4 && <StepDots step={step} total={4} />}

      {/* ═══ STEP 0 — INTRO ═══ */}
      {step === 0 && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#B8893A' }}>
              TOOL 1 · {t.title}
            </div>
            <h4 className="text-[18px] font-bold text-white leading-tight">{t.introTitle}</h4>
            <div className="mt-4 space-y-2">
              {t.introBullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8893A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{b}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              {t.introTime}
            </div>
          </div>
          <ActionBtn onClick={goNext} label={t.start} />
        </div>
      )}

      {/* ═══ STEP 1 — TENANT IDENTITY ═══ */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>
              {t.stepLabel} 1 {t.of} 3
            </div>
            <h4 className="text-[16px] font-bold" style={{ color: '#0f172a' }}>{t.s1Title}</h4>
            <p className="text-[12px] mt-1" style={{ color: '#64748b' }}>{t.s1Sub}</p>
          </div>
          <TextInput label={t.nameLabel} value={tenantName} onChange={setTenantName} placeholder={t.namePh} />
          <TextInput label={t.icLabel} value={tenantIC} onChange={setTenantIC} placeholder={t.icPh} mono />
          <div className="flex gap-2 pt-2">
            <button onClick={goBack} className="px-5 py-3.5 rounded-xl text-[13px] font-semibold transition active:scale-95"
              style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
              {t.back}
            </button>
            <div className="flex-1">
              <ActionBtn onClick={goNext} disabled={!tenantName || !tenantIC} label={t.next} />
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 2 — LHDN CERT VERIFICATION (identity gate only) ═══ */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>
              {t.stepLabel} 2 {t.of} 3
            </div>
            <h4 className="text-[16px] font-bold" style={{ color: '#0f172a' }}>{t.s2Title}</h4>
            <p className="text-[12px] mt-1 leading-relaxed" style={{ color: '#64748b' }}>{t.s2Sub}</p>
          </div>

          {!lhdnResult && (
            <>
              <MethodTabs value={lhdnMethod} onChange={(v) => { setLhdnMethod(v); setLhdnResult(null); }} t={t} />

              {lhdnMethod === 'number' && (
                <TextInput
                  label={t.certLabel}
                  value={certNumber}
                  onChange={(v) => { setCertNumber(v); setLhdnResult(null); }}
                  placeholder={t.certPh}
                  mono
                />
              )}

              {lhdnMethod === 'pdf' && (
                <PdfDropZone
                  pdfName={lhdnPdfName}
                  onPick={(name) => { setLhdnPdfName(name); setLhdnResult(null); }}
                  t={t}
                />
              )}

              <button
                onClick={verifyWithLHDN}
                disabled={verifyDisabled}
                className="w-full py-3.5 rounded-xl text-[13px] font-bold text-white disabled:opacity-40 transition active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ background: '#0f172a', boxShadow: '0 4px 16px rgba(15,23,42,0.2)' }}
              >
                {verifying ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" opacity="0.25" />
                      <path d="M22 12a10 10 0 0 1-10 10" strokeLinecap="round" />
                    </svg>
                    {t.verifying}
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4" />
                      <path d="M12 2l8.5 4.7v7c0 4.5-3 8.5-8.5 10.3-5.5-1.8-8.5-5.8-8.5-10.3V6.7L12 2z" />
                    </svg>
                    {t.verify}
                  </>
                )}
              </button>
            </>
          )}

          {lhdnResult && (
            <div className="p-4 rounded-2xl space-y-3 fade-in" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div className="flex items-center justify-between">
                <VerifiedBadge label={t.verified} />
                <span className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>stamps.hasil.gov.my</span>
              </div>
              <div className="text-[13px] font-bold" style={{ color: '#0f172a' }}>{t.verifiedTenancy}</div>
              <div className="space-y-1.5 pt-1">
                <div className="flex gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest w-16 flex-shrink-0 mt-0.5" style={{ color: '#65a30d' }}>{t.period}</span>
                  <span className="text-[12px] font-semibold" style={{ color: '#0f172a' }}>{lhdnResult.periodFrom} → {lhdnResult.periodTo} ({lhdnResult.months} mo)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest w-16 flex-shrink-0 mt-0.5" style={{ color: '#65a30d' }}>{t.address}</span>
                  <span className="text-[12px] leading-snug" style={{ color: '#0f172a' }}>{lhdnResult.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-2 mt-1" style={{ borderTop: '1px solid #bbf7d0' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-[11px] font-semibold" style={{ color: '#15803d' }}>{t.icMatched}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button onClick={goBack} className="px-5 py-3.5 rounded-xl text-[13px] font-semibold transition active:scale-95"
              style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
              {t.back}
            </button>
            <div className="flex-1">
              <ActionBtn onClick={goNext} disabled={!lhdnResult} label={t.next} />
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 3 — UTILITY BILLS (per-tile dual-input: account # OR upload) ═══ */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>
              {t.stepLabel} 3 {t.of} 3
            </div>
            <h4 className="text-[16px] font-bold" style={{ color: '#0f172a' }}>{t.s3Title}</h4>
            <p className="text-[12px] mt-1 leading-relaxed" style={{ color: '#64748b' }}>{t.s3Sub}</p>
          </div>

          <div className="space-y-2.5">
            <BillTile label={t.tnb} ph={t.acctTnbPh} state={tnbState} setState={setTnbState} t={t} />
            <BillTile label={t.water} ph={t.acctWaterPh} state={waterState} setState={setWaterState} t={t} />
            <BillTile label={t.mobile} ph={t.acctMobilePh} state={mobileState} setState={setMobileState} t={t} />
          </div>

          {!billsOk && (
            <p className="text-[11px] text-center" style={{ color: '#94a3b8' }}>{t.needTwo}</p>
          )}

          <div className="flex gap-2 pt-2">
            <button onClick={goBack} className="px-5 py-3.5 rounded-xl text-[13px] font-semibold transition active:scale-95"
              style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
              {t.back}
            </button>
            <div className="flex-1">
              <ActionBtn onClick={goNext} disabled={!billsOk} label={t.seeScore} />
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 4 — SCORE REVEAL ═══ */}
      {step === 4 && (
        <div className="space-y-3 fade-in">
          {/* Hero score card — navy */}
          <div className="p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.s4Title}</div>
              <VerifiedBadge label="LHDN" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-5xl font-bold text-white leading-none">{MOCK_SCORE.total}</div>
              <div className="text-[14px]" style={{ color: 'rgba(255,255,255,0.5)' }}>/ 100</div>
            </div>
            <div className="text-[12px] mt-3 pt-3" style={{ color: 'rgba(255,255,255,0.6)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {t.sourcedFrom} {MOCK_LHDN_RESULT.months} {t.monthsBills}
            </div>
          </div>

          {/* Confidence + tenant identity card */}
          <div className="p-3.5 rounded-xl flex items-center gap-3" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#0f172a', color: '#fff' }}>
              <span className="text-[14px] font-bold">{(tenantName || 'T').charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold truncate" style={{ color: '#0f172a' }}>{tenantName}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#64748b' }}>{t.confidence}: <span style={{ color: '#065f46', fontWeight: 700 }}>{t.confMature}</span></div>
            </div>
          </div>

          {/* Average timing card — the headline insight */}
          <div className="p-4 rounded-2xl" style={{ background: '#d1fae5', border: '1px solid #a7f3d0' }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#065f46' }}>{t.timingHeader}</div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: '#065f46', color: '#fff' }}>{t.upfrontTag}</span>
            </div>
            <div className="text-[20px] font-bold leading-tight" style={{ color: '#065f46' }}>
              {MOCK_SCORE.avgGapDays < 0
                ? t.gapBefore.replace('{n}', String(Math.abs(MOCK_SCORE.avgGapDays)))
                : MOCK_SCORE.avgGapDays > 0
                  ? t.gapAfter.replace('{n}', String(MOCK_SCORE.avgGapDays))
                  : t.gapSame}
            </div>
            <div className="text-[11px] mt-1.5 font-semibold" style={{ color: '#047857' }}>
              {t.predictHigh} · {t.variance.replace('{n}', String(MOCK_SCORE.varianceDays))}
            </div>
          </div>

          {/* Per-utility timing breakdown — stacked bar + legend per utility */}
          <div className="space-y-2">
            {MOCK_SCORE.utilities.map((u) => (
              <UtilityTimingCard key={u.name} utility={u} t={t} />
            ))}
          </div>

          {/* Trust Card preview — replaces the old "PDF report" output.
              Business-card format (~85×55mm credit-card aspect) — designed
              for WhatsApp shareability and 2-second glanceability. */}
          <div className="pt-2">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>
              {t.cardSub}
            </div>
            <TrustCardPreview
              tenantName={tenantName}
              tenantIC={tenantIC}
              score={MOCK_SCORE.total}
              lhdnResult={MOCK_LHDN_RESULT}
              avgGapDays={MOCK_SCORE.avgGapDays}
              caseRef={stableCaseRef}
              t={t}
            />
          </div>

          {/* DNA disclaimer */}
          <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
            <span className="text-[10px] flex-shrink-0">⚠️</span>
            <p className="text-[10.5px] leading-relaxed" style={{ color: '#92400E' }}>{t.landlordSafetyNote}</p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => alert('Trust Card export coming next session — see ARCH_CREDIT_SCORE.md build step 6 (business-card format · 85×55mm PDF + LBV QR).')}
              className="w-full py-3.5 rounded-xl text-[13px] font-bold text-white transition active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', boxShadow: '0 4px 16px rgba(15,23,42,0.2)' }}>
              {t.exportCard}
            </button>

            {onSaveMemory && (
              <button
                onClick={saveToCase}
                disabled={savedToCase}
                className="w-full py-3 rounded-xl text-[12px] font-semibold transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                style={{
                  background: savedToCase ? '#d1fae5' : '#f8fafc',
                  color: savedToCase ? '#065f46' : '#475569',
                  border: `1px solid ${savedToCase ? '#a7f3d0' : '#e2e8f0'}`,
                }}>
                {savedToCase ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {t.savedCase}
                  </>
                ) : (
                  t.saveCase
                )}
              </button>
            )}

            <div className="text-center pt-1">
              <span className="text-[9px] font-mono" style={{ color: '#cbd5e1' }}>Ref · {stableCaseRef}</span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
