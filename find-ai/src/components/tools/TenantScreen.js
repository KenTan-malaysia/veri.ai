'use client';

import { useState, useMemo } from 'react';
import { Modal, ToolHeader, ActionBtn } from './shared';
import { makeCaseRef } from '../../lib/pdfExport';

// ────────────────────────────────────────────────────────────────────────────
// TOOL 1 — Tenant Credit Score (v0 MOCK DEMO)
//
// Spec lock: 2026-04-25 v3.4 (see ARCH_CREDIT_SCORE.md).
// Model: LHDN cert is the identity gate (pass/fail) + utility bills are the
// pure paying-behaviour score (0-100).
//
// 2026-04-25 update — UX revisions per Ken:
//   - LHDN verification step now offers both KEY-IN NUMBER and UPLOAD PDF
//     paths (tenant picks whichever is easier).
//   - Third utility tile changed from IWK to MOBILE POSTPAID (stronger signal:
//     monthly cycle, faster disconnection on non-payment, near-universal).
//
// THIS IS A MOCK DEMO BUILD:
//   - Any LHDN cert # OR uploaded file → returns fake "verified" data
//   - Any uploaded utility file → registers as a successful bill upload
//   - Score is hardcoded to a high number (94/100) for the demo
//   - Real OCR + real LHDN integration happens in later sessions per the
//     8-step build order in ARCH_CREDIT_SCORE.md
// ────────────────────────────────────────────────────────────────────────────

const DEMO_MODE = true;

// Inline EN/BM/ZH strings — kept local for v0 to avoid disturbing labels.js.
// When the spec stabilises post-pilot, move to labels.js for parity with TOOL 3.
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
    s2Sub: 'Tenant provides their previous tenancy stamp certificate. We cross-check it against the official LHDN STAMPS portal.',
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
    s3Sub: 'Tenant uploads utility bills covering the verified tenancy period. We read paying behaviour directly from the bills.',
    upload: 'Upload',
    uploaded: 'Uploaded',
    addBill: 'Add bill',
    tnb: 'TNB (Electricity)',
    water: 'Water (Air Selangor / SYABAS / etc)',
    mobile: 'Mobile postpaid (Maxis / CelcomDigi / U Mobile / Yes)',
    monthsCovered: 'months covered',
    seeScore: 'See paying behaviour score',
    needTwo: 'Upload at least TNB + Water to continue',
    s4Title: 'Paying Behaviour Score',
    paidOnTime: 'Bills paid on time',
    zeroCarry: 'Bills with zero carry-over',
    zeroLate: 'Late charges',
    zeroDisc: 'Disconnections',
    sourcedFrom: 'Sourced from',
    monthsBills: 'months of utility bills at the verified address',
    confidence: 'Confidence',
    confMature: 'Mature · 14 months verified',
    exportPdf: '🛡️ Export Trust Report PDF',
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
    s2Sub: 'Penyewa memberi sijil setem sewaan terdahulu. Kami semak silang dengan portal rasmi LHDN STAMPS.',
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
    s3Sub: 'Penyewa muat naik bil utiliti meliputi tempoh sewaan disahkan. Kami baca tingkah laku bayaran terus dari bil.',
    upload: 'Muat naik',
    uploaded: 'Dimuat naik',
    addBill: 'Tambah bil',
    tnb: 'TNB (Elektrik)',
    water: 'Air (Air Selangor / SYABAS / dll)',
    mobile: 'Pascabayar mudah alih (Maxis / CelcomDigi / U Mobile / Yes)',
    monthsCovered: 'bulan diliputi',
    seeScore: 'Lihat skor tingkah laku bayaran',
    needTwo: 'Muat naik sekurang-kurangnya TNB + Air untuk teruskan',
    s4Title: 'Skor Tingkah Laku Bayaran',
    paidOnTime: 'Bil dibayar tepat masa',
    zeroCarry: 'Bil tiada tunggakan dibawa',
    zeroLate: 'Caj lewat',
    zeroDisc: 'Pemutusan',
    sourcedFrom: 'Bersumberkan',
    monthsBills: 'bulan bil utiliti di alamat yang disahkan',
    confidence: 'Keyakinan',
    confMature: 'Matang · 14 bulan disahkan',
    exportPdf: '🛡️ Muat turun PDF Laporan Amanah',
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
    s2Sub: '租客提供其上一份租赁合约的印花证书。我们与官方 LHDN STAMPS 门户交叉验证。',
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
    s3Sub: '租客上传涵盖已验证租赁期间的公用事业账单。我们直接从账单读取付款行为。',
    upload: '上传',
    uploaded: '已上传',
    addBill: '添加账单',
    tnb: 'TNB（电费）',
    water: '水费（Air Selangor / SYABAS 等）',
    mobile: '手机后付（Maxis / CelcomDigi / U Mobile / Yes）',
    monthsCovered: '个月覆盖',
    seeScore: '查看付款行为评分',
    needTwo: '至少上传 TNB + 水费才能继续',
    s4Title: '付款行为评分',
    paidOnTime: '按时支付的账单',
    zeroCarry: '无欠款的账单',
    zeroLate: '迟缴费用',
    zeroDisc: '断缴',
    sourcedFrom: '来源于',
    monthsBills: '个月在已验证地址的公用事业账单',
    confidence: '可信度',
    confMature: '成熟 · 14 个月已验证',
    exportPdf: '🛡️ 下载信任报告 PDF',
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

// Mock LHDN-verified tenancy data — what the real LHDN cert lookup would return.
const MOCK_LHDN_RESULT = {
  tenantName: 'Ahmad bin Ali',
  tenantIC: '901223-08-4321',
  address: 'Unit 12-3A, Pangsapuri Damai, Jalan Bukit Raja, 81100 Johor Bahru, Johor',
  periodFrom: '01/10/2024',
  periodTo: '30/11/2025',
  months: 14,
  landlordName: 'Tan Ken Yap',
};

// Mock score result — what the real scoring engine would return after OCR.
// Third utility is now Mobile Postpaid (replaced IWK per Ken's call — stronger
// behaviour signal: monthly cycle, faster disconnection on non-payment, near-universal).
const MOCK_SCORE = {
  total: 94,
  paidOnTimePct: 100,
  zeroCarryPct: 100,
  lateCharges: 0,
  disconnections: 0,
  utilities: [
    { name: 'TNB', months: 14, onTime: 14, carry: 0, late: 0, disc: 0 },
    { name: 'Air Selangor', months: 14, onTime: 14, carry: 0, late: 0, disc: 0 },
    { name: 'Maxis Postpaid', months: 14, onTime: 14, carry: 0, late: 0, disc: 0 },
  ],
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function StepDots({ step, total = 4 }) {
  return (
    <div className="flex items-center gap-1.5 mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 rounded-full transition-all"
          style={{
            flex: i === step ? 2 : 1,
            background: i <= step ? '#0f172a' : '#e2e8f0',
          }}
        />
      ))}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, mono = false }) {
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl px-4 py-3.5 text-[15px] focus:outline-none ${mono ? 'font-mono' : 'font-semibold'}`}
        style={{ background: '#f8fafc', border: '1px solid #edf0f4', color: '#0f172a' }}
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

function BillTile({ label, uploaded, onUpload, t }) {
  return (
    <div
      className="p-3.5 rounded-xl flex items-center gap-3 transition"
      style={{
        background: uploaded ? '#d1fae5' : '#f8fafc',
        border: `1px solid ${uploaded ? '#a7f3d0' : '#edf0f4'}`,
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: uploaded ? '#065f46' : '#fff', boxShadow: uploaded ? 'none' : '0 1px 2px rgba(15,23,42,0.04)' }}
      >
        {uploaded ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold truncate" style={{ color: uploaded ? '#065f46' : '#0f172a' }}>
          {label}
        </div>
        <div className="text-[10px] mt-0.5" style={{ color: uploaded ? '#065f46' : '#94a3b8' }}>
          {uploaded ? `${t.uploaded} · 14 ${t.monthsCovered}` : t.addBill}
        </div>
      </div>
      <label
        className="text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition active:scale-95 flex-shrink-0"
        style={{ background: uploaded ? '#fff' : '#0f172a', color: uploaded ? '#065f46' : '#fff' }}
      >
        {uploaded ? '✓' : t.upload}
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) onUpload(); }}
        />
      </label>
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

  // Step 3 state — TNB + Water + Mobile (Mobile replaces IWK per Ken's call)
  const [bills, setBills] = useState({ tnb: false, water: false, mobile: false });

  // Step 4 state
  const [savedToCase, setSavedToCase] = useState(false);

  const goNext = () => setStep((s) => Math.min(s + 1, 4));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  // Mock LHDN verification — accepts both number and PDF paths.
  // 1.4s spinner, then return canonical mock data.
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

  const billsOk = bills.tnb && bills.water; // Mobile is optional

  // Save the screen result to case memory so chatbox + future tools can reference it.
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
            v0 mock — any cert # / PDF works · any uploaded bill counts · score is hardcoded
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

      {/* ═══ STEP 2 — LHDN CERT VERIFICATION (dual-input: number OR PDF) ═══ */}
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

      {/* ═══ STEP 3 — UTILITY BILLS (TNB + Water + Mobile) ═══ */}
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
            <BillTile label={t.tnb} uploaded={bills.tnb} onUpload={() => setBills((b) => ({ ...b, tnb: true }))} t={t} />
            <BillTile label={t.water} uploaded={bills.water} onUpload={() => setBills((b) => ({ ...b, water: true }))} t={t} />
            <BillTile label={t.mobile} uploaded={bills.mobile} onUpload={() => setBills((b) => ({ ...b, mobile: true }))} t={t} />
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

          {/* Per-utility breakdown */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
            {MOCK_SCORE.utilities.map((u, i) => (
              <div
                key={u.name}
                className="flex items-center gap-3 px-3.5 py-3"
                style={i > 0 ? { borderTop: '1px solid #edf0f4' } : {}}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-bold" style={{ color: '#0f172a' }}>{u.name}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: '#64748b' }}>
                    {u.onTime}/{u.months} {t.paidOnTime.toLowerCase()} · 0 {t.zeroLate.toLowerCase()} · 0 {t.zeroDisc.toLowerCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl" style={{ background: '#d1fae5', border: '1px solid #a7f3d0' }}>
              <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#065f46' }}>{t.paidOnTime}</div>
              <div className="text-[20px] font-bold mt-0.5" style={{ color: '#065f46' }}>{MOCK_SCORE.paidOnTimePct}%</div>
            </div>
            <div className="p-3 rounded-xl" style={{ background: '#d1fae5', border: '1px solid #a7f3d0' }}>
              <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#065f46' }}>{t.zeroCarry}</div>
              <div className="text-[20px] font-bold mt-0.5" style={{ color: '#065f46' }}>{MOCK_SCORE.zeroCarryPct}%</div>
            </div>
          </div>

          {/* DNA disclaimer */}
          <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
            <span className="text-[10px] flex-shrink-0">⚠️</span>
            <p className="text-[10.5px] leading-relaxed" style={{ color: '#92400E' }}>{t.landlordSafetyNote}</p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => alert('PDF export coming next session — see ARCH_CREDIT_SCORE.md build step 6.')}
              className="w-full py-3.5 rounded-xl text-[13px] font-bold text-white transition active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', boxShadow: '0 4px 16px rgba(15,23,42,0.2)' }}>
              {t.exportPdf}
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
