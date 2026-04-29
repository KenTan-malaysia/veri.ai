'use client';

import { useState, useMemo } from 'react';
import { Modal, ToolHeader, ActionBtn } from './shared';
import { makeCaseRef } from '../../lib/pdfExport';
// v3.7.2 — Real OCR wire-in (replaces v0 mock for LHDN cert + utility bills
// when Anthropic credits are funded; gracefully falls back to mock otherwise).
import { verifyLhdnCert, verifyUtilityBill } from '../../lib/billVerification';

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

// v3.7.4 — DEMO_MODE is now env-driven via NEXT_PUBLIC_DEMO_MODE.
// Default: DEMO_MODE = true (so dev / preview / out-of-the-box deploys still
// show the demo flow with prefilled mock data and DEMO banners).
// To disable for production pilot: set NEXT_PUBLIC_DEMO_MODE='false' in
// Vercel env vars (or any value that isn't literally 'true'). Real users
// then see empty inputs, no DEMO banner, and the upload flow drives the
// actual data pipeline.
const DEMO_MODE = (process.env.NEXT_PUBLIC_DEMO_MODE ?? 'true') === 'true';

// v3.7.2 — Helper: read a File as base64 + POST to /api/screen/extract.
// Returns { ok: true, fields } on success, { ok: false, degradedMode, message } otherwise.
// Used by both the LHDN cert upload step and utility-bill uploads in BillTile.
async function extractFromFile(file, kind, opts = {}) {
  if (!file) return { ok: false, message: 'No file' };
  // Size guard (matches /api/screen/extract MAX_IMAGE_BASE64_BYTES ≈ 5MB raw)
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, message: 'File exceeds 5MB upload cap. Try a smaller image.' };
  }
  const mediaType = file.type === 'application/pdf'
    ? 'application/pdf'
    : (file.type && file.type.startsWith('image/'))
      ? file.type
      : 'image/jpeg';
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const s = String(reader.result || '');
      const idx = s.indexOf('base64,');
      resolve(idx >= 0 ? s.slice(idx + 7) : s);
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
  try {
    const res = await fetch('/api/screen/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, imageBase64: base64, mediaType, vendor: opts.vendor || null, lang: opts.lang || 'en' }),
    });
    const data = await res.json();
    if (!data.ok) {
      return { ok: false, degradedMode: !!data.degradedMode, message: data.message || 'OCR unavailable' };
    }
    return { ok: true, fields: data.fields || {} };
  } catch (err) {
    return { ok: false, degradedMode: true, message: err?.message || 'Network error' };
  }
}

// Inline EN/BM/ZH strings — kept local for v0 to avoid disturbing labels.js.
const STR = {
  en: {
    title: 'Tenant Credit Score',
    desc: 'LHDN-verified tenancy + utility paying behaviour',
    stepLabel: 'Step',
    of: 'of',
    s1Title: 'Tenant identity',
    s1Sub: 'Enter what the tenant told you. We will verify it next.',
    returningTenantHeader: '🔄 Has this tenant been screened by Veri.ai before?',
    returningTenantPh: 'Phone or IC last 4',
    returningTenantLookup: '🔍 Look up existing Trust Score',
    returningTenantOr: '— or —',
    returningTenantNew: '↓ Continue with new screening',
    returningTenantFound: '✓ Found existing Trust Score',
    returningTenantFoundDesc: 'Verified {months} months ago by Landlord {handle} · Trust Score {score}/100 ({tier})',
    returningTenantReuse: 'Re-use this score',
    returningTenantRefresh: 'Refresh with latest bills',
    returningTenantNotFound: 'No existing profile found — proceed with new screening below',
    returningTenantDemoNote: 'Demo: any phone/IC returns a mock previous score. In production, lookup queries the tenant profile DB and triggers Live Bound Verification (LBV) for the tenant to release their score.',
    nameLabel: 'Full name (per MyKad)',
    namePh: 'Ahmad bin Ali',
    icLabel: "Tenant's IC last 4 digits",
    icSubtitle: '(the person you are screening)',
    icPh: '4321',
    s2Title: 'LHDN tenancy verification',
    s2Sub: 'This step proves the tenant really rented before. We cross-check the cert against LHDN STAMPS — nothing from the cert affects the score.',
    lhdnHelp: "What's a LHDN cert?",
    lhdnHelpBody: 'Every legally stamped tenancy agreement (rent over RM150/month) gets a unique LHDN reference number. Ask the tenant\'s previous landlord — usually starts with letters followed by digits.',
    lhdnSkip: 'Skip — no cert / first-time renter',
    lhdnSkipNote: 'Landlord proceeds at own discretion · Veri.ai is a support tool',
    lhdnSkipped: 'LHDN SKIPPED',
    identityUnverified: 'Identity unverified',
    methodNumber: '⌨️  Key in number',
    methodPdf: '📎  Upload PDF',
    methodForeign: '🌏  Foreign tenant',
    foreignNote: 'No LHDN cert? Foreign tenants don\'t have a Malaysian stamped tenancy. Submit alternative documents instead — passport + employer letter + (optional) overseas-rental reference.',
    foreignPassportLabel: 'Passport last 4 digits',
    foreignPassportPh: 'e.g. 4321',
    foreignNationalityLabel: 'Nationality',
    foreignNationalityPh: 'e.g. Indonesian, Singaporean, Indian',
    foreignEmployerLabel: 'Employer letter (PDF / image)',
    foreignEmployerHint: 'Letter on company letterhead confirming employment + monthly salary',
    foreignRentalRefLabel: 'Overseas rental reference (optional)',
    foreignRentalRefHint: 'Letter from previous landlord overseas, or utility bill in tenant\'s name from prior country',
    foreignSubmit: 'Submit alternative documents',
    foreignDemoNote: 'Demo: any input counts as success. In production, employer letter is OCR-verified for company registration + salary; rental reference is checked against international tenant-screening databases (ICAS, etc.).',
    foreignVerified: 'Identity verified · alt-doc',
    foreignIdentityNote: 'Identity verified via foreign documents. No LHDN previous-tenancy bonus on Trust Score.',
    foreignNoLhdnBonus: 'Note: Trust Score will rely entirely on utility-bill payment history (Step 3) since no LHDN-anchored previous-tenancy data is available for non-Malaysian tenancies.',
    certLabel: 'LHDN stamp certificate number',
    certPh: 'e.g. ABC1234567890',
    pdfDropPrompt: 'Tap to upload LHDN cert PDF',
    pdfDropHint: 'PDF or image · max 10 MB',
    pdfReady: 'Ready to verify',
    verify: '🔗 Open LHDN STAMPS',
    verifying: 'Verifying with LHDN…',
    verified: 'LHDN VERIFIED',
    uploadScreenshot: '📎 Upload screenshot',
    uploadScreenshotShort: '📎 Upload',
    screenshotUploaded: 'Screenshot uploaded · verifying',
    lhdnDemoNote: 'Step 1: tap Open LHDN STAMPS → opens portal in new tab. Step 2: screenshot the verification page. Step 3: come back here and tap Upload screenshot. (In production, the cert # auto-fills the portal.)',
    verifiedTenancy: 'Verified previous tenancy',
    period: 'Period',
    address: 'Address',
    icMatched: 'IC matches MyKad on file',

    s3Title: 'Utility payment history',
    s3Sub: 'All 3 optional — add at least 1. More uploads → higher Trust Score Confidence. Per utility: account # = quick check, upload bill = 3-month history.',
    tileOptional: 'Optional · pick easier method',
    add: 'Add',
    edit: 'Edit',
    methodAcct: '⌨️  Account number',
    methodAcctHint: 'Quick check · current bill only',
    methodUpload: '📎  Upload bill',
    methodUploadHint: '★ Best · 1 bill includes 3 months history',
    acctTnbPh: 'e.g. 220012345678',
    acctWaterPh: 'e.g. 4001234567',
    acctMobilePh: 'e.g. 0123456789',
    verifyOnExternal: '🔗 Open {provider} to check this account',
    demoNoteAcct: 'In production, this deep-links to {provider} with the account # pre-filled. For demo, opens {provider} home — return to Veri.ai after.',
    portalOpened: '{provider} opened in a new tab',
    portalOpenedHint: 'Check the bill on the {provider} site, then come back here and tap below.',
    markVerified: '✓ I checked — mark verified',
    uploadAnyBill: 'Tap to upload bill (any recent month)',
    uploadHint: 'PDF or photo · 1 bill = 3 months timing data',
    confirm: 'Confirm',
    cancel: 'Cancel',
    addedAcct: 'Account ····{tail} · Verified via {provider}',
    addedFile: 'Bill uploaded · 3 months timing extracted',

    tnb: 'TNB (Electricity)',
    water: 'Water (Air Selangor / SYABAS)',
    mobile: 'Mobile postpaid (Maxis / CelcomDigi / U Mobile / Yes)',
    monthsCovered: 'months covered',
    seeScore: 'See paying behaviour score',
    needTwo: 'Add at least 1 utility for paying-behaviour signal',
    scaleHeader: 'Trust Score breakdown',
    scaleBehaviourLabel: 'Behaviour (paying quality)',
    scaleTrustLabel: 'Trust Score (after confidence)',
    scaleEquals: 'equals',
    tierRisky: 'Risky',
    tierMixed: 'Mixed',
    tierSolid: 'Solid',
    tierOutstandingScale: 'Outstanding',
    confLandlordJudgment: 'Landlord judgment required',
    confIdentityOnly: 'Identity-only · No payment data',
    confBehaviourOnly: 'Behaviour-only · No LHDN anchor',
    confLimited: 'Limited data · {n} of 3 utilities',

    s4Title: 'Trust Score',
    s4SubBehaviour: 'Behaviour',
    s4SubConfidence: 'Confidence',
    s4Formula: 'Behaviour {b} × Confidence {c}%',
    s4EffortHint: 'Upload more bills → Trust Score rises',
    methodologyLink: 'How is this calculated?',
    methodologyTitle: 'How the Trust Score works',
    methodologyBody: 'Two parts: BEHAVIOUR (how well the tenant paid past utility bills, based on payment timing relative to due date) × CONFIDENCE (how much evidence backs that judgment — more bills + LHDN-verified tenancy = higher confidence). Both numbers are visible above. The exact algorithm is proprietary; categories are public. Read more: HOW_TRUST_SCORE_WORKS.md',
    methodologyDecision: 'Veri.ai surfaces evidence. The rental decision rests with you, the landlord.',
    scenarioHeader: 'See how the score adapts to shared evidence',
    scenarioSub: 'Same tenant — different evidence depth = different Trust Score',
    scenarioFull: '🌳 Full evidence',
    scenarioPartial: '🌿 Partial evidence',
    scenarioLimited: '🌱 Limited evidence',
    scenarioFullDesc: 'LHDN ✓ + 3 utility bills',
    scenarioPartialDesc: 'LHDN ✓ + 1 utility bill',
    scenarioLimitedDesc: 'LHDN skipped + 1 utility bill',
    verifyHeader: 'Bill verification',
    verifyDemoNote: 'In production, each bill is checked against 5 fraud signals',
    verifyTemplate: 'Bill template matches TNB / utility format',
    verifyAddress: 'Service address matches LHDN tenancy',
    verifyExif: 'Photo metadata: original capture',
    verifyAccount: 'Account number consistent across bills',
    verifyCycle: 'Billing dates are sequential',
    verifyAllPassed: 'All checks passed',
    verifyPartial: 'Partial verification',
    verifyConfidence: 'Verification confidence',
    confTierMature: 'Mature',
    confTierEstablished: 'Established',
    confTierProvisional: 'Provisional',
    confTierInitial: 'Initial',
    confDescMature: 'Full data',
    confDescEstablished: 'Solid coverage',
    confDescProvisional: 'Partial coverage',
    confDescInitial: 'Minimal data',
    timingHeader: 'Average payment timing',
    gapBefore: '{n} days BEFORE due date',
    gapAfter: '{n} days AFTER due date',
    gapSame: 'On the due date',
    variance: '±{n} days variance',
    predictHigh: 'Highly predictable',
    predictMid: 'Somewhat predictable',
    predictLow: 'Erratic',
    upfrontTag: '✓ Upfront payment pattern',
    onTimeTag: '✓ On-time payment pattern',
    lateTag: '⚠ Late payment pattern',
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
    shareWhatsApp: '📲 Forward via WhatsApp',
    doneBackHome: '← Done · Back to home',
    screenAnother: '🔄 Screen another tenant',
    cardBrand: 'TRUST CARD',
    cardSub: 'Business-card format · WhatsApp shareable',
    cardVerified: 'MyDigital ID verified',
    cardPermanentRecord: 'Permanent record · re-usable for future rentals',
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
      'Branded Veri.ai Trust Report PDF',
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
    returningTenantHeader: '🔄 Pernah disaring oleh Veri.ai sebelum ini?',
    returningTenantPh: 'Telefon atau 4 digit IC',
    returningTenantLookup: '🔍 Cari Skor Amanah sedia ada',
    returningTenantOr: '— atau —',
    returningTenantNew: '↓ Teruskan dengan saringan baru',
    returningTenantFound: '✓ Skor Amanah sedia ada dijumpai',
    returningTenantFoundDesc: 'Disahkan {months} bulan lepas oleh Tuan rumah {handle} · Skor Amanah {score}/100 ({tier})',
    returningTenantReuse: 'Guna semula skor ini',
    returningTenantRefresh: 'Segarkan dengan bil terkini',
    returningTenantNotFound: 'Tiada profil sedia ada — teruskan dengan saringan baru di bawah',
    returningTenantDemoNote: 'Demo: mana-mana telefon/IC mengembalikan skor mock. Dalam pengeluaran, carian kueri DB profil penyewa dan mencetuskan Pengesahan Terikat Hidup (LBV) untuk penyewa membenarkan skor mereka.',
    nameLabel: 'Nama penuh (ikut MyKad)',
    namePh: 'Ahmad bin Ali',
    icLabel: '4 digit akhir IC penyewa',
    icSubtitle: '(orang yang anda saring)',
    icPh: '4321',
    s2Title: 'Pengesahan sewaan LHDN',
    s2Sub: 'Langkah ini membuktikan penyewa benar-benar pernah menyewa. Kami semak silang sijil dengan LHDN STAMPS — tiada apa-apa dari sijil mempengaruhi skor.',
    lhdnHelp: 'Apa itu sijil LHDN?',
    lhdnHelpBody: 'Setiap perjanjian sewaan yang disahkan setem (sewa lebih RM150/bulan) ada nombor rujukan LHDN unik. Tanya tuan rumah penyewa sebelum ini — biasanya bermula dengan huruf diikuti angka.',
    lhdnSkip: 'Langkau — tiada sijil / penyewa kali pertama',
    lhdnSkipNote: 'Tuan rumah meneruskan atas budi bicara sendiri · Veri.ai adalah alat sokongan',
    lhdnSkipped: 'LHDN DILANGKAU',
    identityUnverified: 'Identiti tidak disahkan',
    methodNumber: '⌨️  Masukkan nombor',
    methodPdf: '📎  Muat naik PDF',
    methodForeign: '🌏  Penyewa asing',
    foreignNote: 'Tiada sijil LHDN? Penyewa asing tidak mempunyai sijil sewa Malaysia. Sila kemukakan dokumen alternatif — pasport + surat majikan + (pilihan) rujukan sewa luar negara.',
    foreignPassportLabel: '4 digit terakhir pasport',
    foreignPassportPh: 'cth. 4321',
    foreignNationalityLabel: 'Kewarganegaraan',
    foreignNationalityPh: 'cth. Indonesia, Singapura, India',
    foreignEmployerLabel: 'Surat majikan (PDF / imej)',
    foreignEmployerHint: 'Surat di atas kop syarikat mengesahkan pekerjaan + gaji bulanan',
    foreignRentalRefLabel: 'Rujukan sewa luar negara (pilihan)',
    foreignRentalRefHint: 'Surat dari tuan rumah sebelumnya di luar negara, atau bil utiliti atas nama penyewa dari negara terdahulu',
    foreignSubmit: 'Hantar dokumen alternatif',
    foreignDemoNote: 'Demo: sebarang input dianggap berjaya. Dalam pengeluaran, surat majikan disahkan OCR untuk pendaftaran syarikat + gaji; rujukan sewa diperiksa terhadap pangkalan data penyaringan penyewa antarabangsa.',
    foreignVerified: 'Identiti disahkan · dok alt',
    foreignIdentityNote: 'Identiti disahkan melalui dokumen asing. Tiada bonus tenancy LHDN pada Trust Score.',
    foreignNoLhdnBonus: 'Nota: Trust Score akan bergantung sepenuhnya pada sejarah pembayaran bil utiliti (Langkah 3) kerana tiada data tenancy berasaskan LHDN untuk sewa bukan-Malaysia.',
    certLabel: 'Nombor sijil setem LHDN',
    certPh: 'cth. ABC1234567890',
    pdfDropPrompt: 'Ketuk untuk muat naik PDF sijil LHDN',
    pdfDropHint: 'PDF atau imej · maks 10 MB',
    pdfReady: 'Sedia untuk sahkan',
    verify: '🔗 Buka LHDN STAMPS',
    verifying: 'Mengesah dengan LHDN…',
    verified: 'DISAHKAN LHDN',
    uploadScreenshot: '📎 Muat naik tangkapan skrin',
    uploadScreenshotShort: '📎 Muat naik',
    screenshotUploaded: 'Tangkapan skrin dimuat naik · mengesah',
    lhdnDemoNote: 'Langkah 1: ketuk Buka LHDN STAMPS → buka portal dalam tab baru. Langkah 2: tangkap skrin halaman pengesahan. Langkah 3: kembali ke sini dan ketuk Muat naik tangkapan skrin. (Dalam pengeluaran, no. sijil auto-isi portal.)',
    verifiedTenancy: 'Sewaan terdahulu disahkan',
    period: 'Tempoh',
    address: 'Alamat',
    icMatched: 'IC sepadan dengan MyKad dalam fail',

    s3Title: 'Sejarah bayaran utiliti',
    s3Sub: 'Semua 3 pilihan — tambah sekurang-kurangnya 1. Lebih banyak = Keyakinan Skor Amanah lebih tinggi. Per utiliti: nombor akaun = semakan pantas, muat naik bil = sejarah 3 bulan.',
    tileOptional: 'Pilihan · pilih cara mudah',
    add: 'Tambah',
    edit: 'Ubah',
    methodAcct: '⌨️  Nombor akaun',
    methodAcctHint: 'Semakan pantas · bil semasa sahaja',
    methodUpload: '📎  Muat naik bil',
    methodUploadHint: '★ Terbaik · 1 bil = 3 bulan sejarah',
    acctTnbPh: 'cth. 220012345678',
    acctWaterPh: 'cth. 4001234567',
    acctMobilePh: 'cth. 0123456789',
    verifyOnExternal: '🔗 Buka {provider} untuk semak akaun ini',
    demoNoteAcct: 'Dalam pengeluaran, ini deep-link ke {provider} dengan no. akaun pra-isi. Untuk demo, buka laman utama {provider} — kembali ke Veri.ai selepas itu.',
    portalOpened: '{provider} dibuka dalam tab baru',
    portalOpenedHint: 'Semak bil di laman {provider}, kemudian kembali ke sini dan ketuk di bawah.',
    markVerified: '✓ Saya dah semak — tandakan disahkan',
    uploadAnyBill: 'Ketuk untuk muat naik bil (mana-mana bulan terkini)',
    uploadHint: 'PDF atau foto · 1 bil = 3 bulan data masa',
    confirm: 'Sahkan',
    cancel: 'Batal',
    addedAcct: 'Akaun ····{tail} · Disahkan melalui {provider}',
    addedFile: 'Bil dimuat naik · 3 bulan masa diekstrak',

    tnb: 'TNB (Elektrik)',
    water: 'Air (Air Selangor / SYABAS)',
    mobile: 'Pascabayar mudah alih (Maxis / CelcomDigi / U Mobile / Yes)',
    monthsCovered: 'bulan diliputi',
    seeScore: 'Lihat skor tingkah laku bayaran',
    needTwo: 'Tambah sekurang-kurangnya 1 utiliti untuk isyarat tingkah laku bayaran',
    scaleHeader: 'Pecahan Skor Amanah',
    scaleBehaviourLabel: 'Tingkah laku (kualiti bayaran)',
    scaleTrustLabel: 'Skor Amanah (selepas keyakinan)',
    scaleEquals: 'sama dengan',
    tierRisky: 'Berisiko',
    tierMixed: 'Bercampur',
    tierSolid: 'Mantap',
    tierOutstandingScale: 'Cemerlang',
    confLandlordJudgment: 'Pertimbangan tuan rumah diperlukan',
    confIdentityOnly: 'Identiti sahaja · Tiada data bayaran',
    confBehaviourOnly: 'Tingkah laku sahaja · Tiada anchor LHDN',
    confLimited: 'Data terhad · {n} daripada 3 utiliti',

    s4Title: 'Skor Amanah',
    s4SubBehaviour: 'Tingkah laku',
    s4SubConfidence: 'Keyakinan',
    s4Formula: 'Tingkah laku {b} × Keyakinan {c}%',
    s4EffortHint: 'Muat naik lebih bil → Skor Amanah meningkat',
    methodologyLink: 'Bagaimana dikira?',
    methodologyTitle: 'Cara Skor Amanah berfungsi',
    methodologyBody: 'Dua bahagian: TINGKAH LAKU (sebaik mana penyewa bayar bil utiliti lepas, berdasarkan masa bayaran berbanding tarikh akhir) × KEYAKINAN (banyak mana bukti menyokong penilaian — lebih bil + sewaan disahkan LHDN = keyakinan lebih tinggi). Kedua-dua nombor ditunjukkan di atas. Algoritma tepat adalah proprietari; kategori adalah awam.',
    methodologyDecision: 'Veri.ai memaparkan bukti. Keputusan menyewa terletak pada anda, tuan rumah.',
    scenarioHeader: 'Lihat bagaimana skor berubah dengan bukti yang dikongsi',
    scenarioSub: 'Penyewa sama — kedalaman bukti berbeza = Skor Amanah berbeza',
    scenarioFull: '🌳 Bukti penuh',
    scenarioPartial: '🌿 Bukti separa',
    scenarioLimited: '🌱 Bukti terhad',
    scenarioFullDesc: 'LHDN ✓ + 3 bil utiliti',
    scenarioPartialDesc: 'LHDN ✓ + 1 bil utiliti',
    scenarioLimitedDesc: 'LHDN dilangkau + 1 bil utiliti',
    verifyHeader: 'Pengesahan bil',
    verifyDemoNote: 'Dalam pengeluaran, setiap bil disemak terhadap 5 isyarat penipuan',
    verifyTemplate: 'Templat bil sepadan dengan format TNB / utiliti',
    verifyAddress: 'Alamat servis sepadan dengan sewaan LHDN',
    verifyExif: 'Metadata foto: tangkapan asal',
    verifyAccount: 'Nombor akaun konsisten merentas bil',
    verifyCycle: 'Tarikh bil berurutan',
    verifyAllPassed: 'Semua semakan lulus',
    verifyPartial: 'Pengesahan sebahagian',
    verifyConfidence: 'Keyakinan pengesahan',
    confTierMature: 'Matang',
    confTierEstablished: 'Mantap',
    confTierProvisional: 'Sementara',
    confTierInitial: 'Awal',
    confDescMature: 'Data penuh',
    confDescEstablished: 'Liputan kukuh',
    confDescProvisional: 'Liputan separa',
    confDescInitial: 'Data minimum',
    timingHeader: 'Purata masa bayaran',
    gapBefore: '{n} hari SEBELUM tarikh akhir',
    gapAfter: '{n} hari SELEPAS tarikh akhir',
    gapSame: 'Pada tarikh akhir',
    variance: 'varians ±{n} hari',
    predictHigh: 'Sangat boleh diramal',
    predictMid: 'Sederhana boleh diramal',
    predictLow: 'Tidak konsisten',
    upfrontTag: '✓ Corak bayaran awal',
    onTimeTag: '✓ Corak bayaran tepat masa',
    lateTag: '⚠ Corak bayaran lewat',
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
    shareWhatsApp: '📲 Hantar melalui WhatsApp',
    doneBackHome: '← Selesai · Kembali ke utama',
    screenAnother: '🔄 Saring penyewa lain',
    cardBrand: 'KAD AMANAH',
    cardSub: 'Format kad bisnes · boleh dikongsi WhatsApp',
    cardVerified: 'Disahkan MyDigital ID',
    cardPermanentRecord: 'Rekod kekal · boleh diguna semula untuk sewaan akan datang',
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
      'PDF Laporan Amanah Veri.ai berjenama',
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
    returningTenantHeader: '🔄 此租客之前曾被 Veri.ai 筛查过吗？',
    returningTenantPh: '电话或身份证后4位',
    returningTenantLookup: '🔍 查询现有信任分数',
    returningTenantOr: '— 或 —',
    returningTenantNew: '↓ 继续新筛查',
    returningTenantFound: '✓ 找到现有信任分数',
    returningTenantFoundDesc: '由房东 {handle} 于 {months} 个月前验证 · 信任分数 {score}/100（{tier}）',
    returningTenantReuse: '使用此分数',
    returningTenantRefresh: '使用最新账单刷新',
    returningTenantNotFound: '未找到现有档案 — 继续下方新筛查',
    returningTenantDemoNote: '演示：任何电话/身份证返回模拟先前分数。生产版中，查询会调用租客档案数据库并触发实时绑定验证（LBV）让租客释放其分数。',
    nameLabel: '全名（按身份证）',
    namePh: 'Ahmad bin Ali',
    icLabel: '租客身份证后4位',
    icSubtitle: '（您要筛查的人）',
    icPh: '4321',
    s2Title: 'LHDN 租赁验证',
    s2Sub: '此步骤证明租客确实租赁过。我们与 LHDN STAMPS 交叉验证 — 证书内容不影响评分。',
    lhdnHelp: 'LHDN 证书是什么？',
    lhdnHelpBody: '每份合法盖印的租赁合约（月租超过 RM150）都有唯一的 LHDN 参考编号。向租客的前任房东询问 — 通常以字母开头加数字。',
    lhdnSkip: '跳过 — 无证书 / 首次租赁',
    lhdnSkipNote: '房东自行决定 · Veri.ai 是辅助工具',
    lhdnSkipped: '已跳过 LHDN',
    identityUnverified: '身份未验证',
    methodNumber: '⌨️  输入编号',
    methodPdf: '📎  上传 PDF',
    methodForeign: '🌏  外籍租客',
    foreignNote: '没有 LHDN 印花证书？外籍租客没有马来西亚的印花租约。请提交替代文件——护照 + 雇主信件 +（可选）海外租赁推荐信。',
    foreignPassportLabel: '护照末 4 位',
    foreignPassportPh: '例如：4321',
    foreignNationalityLabel: '国籍',
    foreignNationalityPh: '例如：印尼、新加坡、印度',
    foreignEmployerLabel: '雇主信件（PDF / 图片）',
    foreignEmployerHint: '使用公司信纸的信件，确认雇佣关系 + 月薪',
    foreignRentalRefLabel: '海外租赁推荐（可选）',
    foreignRentalRefHint: '前任海外房东的信件，或以租客姓名出具的前国家水电账单',
    foreignSubmit: '提交替代文件',
    foreignDemoNote: '演示：任何输入均视为成功。生产环境中，雇主信件将通过 OCR 验证公司注册 + 薪资；租赁推荐将与国际租客筛选数据库进行核对。',
    foreignVerified: '身份验证 · 替代文件',
    foreignIdentityNote: '通过外籍文件验证身份。Trust Score 不享 LHDN 前租约加分。',
    foreignNoLhdnBonus: '注意：由于非马来西亚租约没有 LHDN 关联的前租约数据，Trust Score 将完全依赖水电账单付款历史（步骤 3）。',
    certLabel: 'LHDN 印花证书编号',
    certPh: '例：ABC1234567890',
    pdfDropPrompt: '点击上传 LHDN 证书 PDF',
    pdfDropHint: 'PDF 或图片 · 最大 10 MB',
    pdfReady: '准备验证',
    verify: '🔗 打开 LHDN STAMPS',
    verifying: '正在通过 LHDN 验证…',
    verified: 'LHDN 已验证',
    uploadScreenshot: '📎 上传截图',
    uploadScreenshotShort: '📎 上传',
    screenshotUploaded: '截图已上传 · 正在验证',
    lhdnDemoNote: '步骤 1：点击打开 LHDN STAMPS → 在新标签打开门户。步骤 2：截图验证页面。步骤 3：返回此处并点击上传截图。（生产版会自动预填证书编号。）',
    verifiedTenancy: '已验证的过往租赁',
    period: '期间',
    address: '地址',
    icMatched: '身份证与档案中 MyKad 匹配',

    s3Title: '公用事业付款记录',
    s3Sub: '3 项均为可选 — 至少添加 1 项。上传越多 → 信任分数可信度越高。每项：账户编号 = 快速核查，上传账单 = 3 个月历史。',
    tileOptional: '可选 · 选择更简单的方式',
    add: '添加',
    edit: '编辑',
    methodAcct: '⌨️  账户编号',
    methodAcctHint: '快速核查 · 仅当前账单',
    methodUpload: '📎  上传账单',
    methodUploadHint: '★ 最佳 · 1 张账单 = 3 个月历史',
    acctTnbPh: '例：220012345678',
    acctWaterPh: '例：4001234567',
    acctMobilePh: '例：0123456789',
    verifyOnExternal: '🔗 打开 {provider} 查询此账户',
    demoNoteAcct: '在生产版本中，这会深度链接到 {provider} 并预填账户编号。演示版仅打开 {provider} 主页 — 之后请返回 Veri.ai。',
    portalOpened: '{provider} 已在新标签打开',
    portalOpenedHint: '在 {provider} 网站查看账单，然后返回此处点击下方按钮。',
    markVerified: '✓ 已核查 — 标记为已验证',
    uploadAnyBill: '点击上传账单（任何近期月份）',
    uploadHint: 'PDF 或照片 · 1 张账单 = 3 个月时间数据',
    confirm: '确认',
    cancel: '取消',
    addedAcct: '账户 ····{tail} · 通过 {provider} 验证',
    addedFile: '账单已上传 · 提取 3 个月付款时间',

    tnb: 'TNB（电费）',
    water: '水费（Air Selangor / SYABAS）',
    mobile: '手机后付（Maxis / CelcomDigi / U Mobile / Yes）',
    monthsCovered: '个月覆盖',
    seeScore: '查看付款行为评分',
    needTwo: '至少添加 1 项公用事业以获得付款行为信号',
    scaleHeader: '信任分数详解',
    scaleBehaviourLabel: '行为（付款质量）',
    scaleTrustLabel: '信任分数（应用可信度后）',
    scaleEquals: '等于',
    tierRisky: '风险',
    tierMixed: '中等',
    tierSolid: '稳健',
    tierOutstandingScale: '优秀',
    confLandlordJudgment: '需房东自行判断',
    confIdentityOnly: '仅身份 · 无付款数据',
    confBehaviourOnly: '仅行为 · 无 LHDN 锚定',
    confLimited: '数据有限 · 3 项中的 {n} 项',

    s4Title: '信任分数',
    s4SubBehaviour: '行为',
    s4SubConfidence: '可信度',
    s4Formula: '行为 {b} × 可信度 {c}%',
    s4EffortHint: '上传更多账单 → 信任分数上升',
    methodologyLink: '如何计算？',
    methodologyTitle: '信任分数的工作原理',
    methodologyBody: '两部分：行为（基于付款时间相对于到期日，租客过往支付公用事业账单的表现）× 可信度（多少证据支撑此判断 — 更多账单 + LHDN 已验证租赁 = 更高可信度）。两个数字均显示在上方。具体算法专有；类别公开。',
    methodologyDecision: 'Veri.ai 呈现证据。租赁决定权在您，房东。',
    scenarioHeader: '查看分数如何随分享的证据变化',
    scenarioSub: '同一租客 — 证据深度不同 = 信任分数不同',
    scenarioFull: '🌳 完整证据',
    scenarioPartial: '🌿 部分证据',
    scenarioLimited: '🌱 有限证据',
    scenarioFullDesc: 'LHDN ✓ + 3 项公用事业账单',
    scenarioPartialDesc: 'LHDN ✓ + 1 项公用事业账单',
    scenarioLimitedDesc: '已跳过 LHDN + 1 项公用事业账单',
    verifyHeader: '账单验证',
    verifyDemoNote: '生产版中，每张账单将通过 5 项防欺诈信号检查',
    verifyTemplate: '账单模板符合 TNB / 公用事业格式',
    verifyAddress: '服务地址与 LHDN 租赁地址匹配',
    verifyExif: '照片元数据：原始拍摄',
    verifyAccount: '账户编号在多张账单间一致',
    verifyCycle: '账单日期按顺序排列',
    verifyAllPassed: '所有检查通过',
    verifyPartial: '部分验证',
    verifyConfidence: '验证可信度',
    confTierMature: '成熟',
    confTierEstablished: '稳定',
    confTierProvisional: '临时',
    confTierInitial: '初步',
    confDescMature: '数据完整',
    confDescEstablished: '覆盖良好',
    confDescProvisional: '部分覆盖',
    confDescInitial: '数据极少',
    timingHeader: '平均付款时间',
    gapBefore: '到期日前 {n} 天',
    gapAfter: '到期日后 {n} 天',
    gapSame: '到期日当天',
    variance: '±{n} 天波动',
    predictHigh: '高度可预测',
    predictMid: '中等可预测',
    predictLow: '不稳定',
    upfrontTag: '✓ 提前付款模式',
    onTimeTag: '✓ 准时付款模式',
    lateTag: '⚠ 迟付款模式',
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
    shareWhatsApp: '📲 通过 WhatsApp 转发',
    doneBackHome: '← 完成 · 返回主页',
    screenAnother: '🔄 筛查另一位租客',
    cardBrand: '信任卡',
    cardSub: '名片格式 · 可通过 WhatsApp 分享',
    cardVerified: 'MyDigital ID 已验证',
    cardPermanentRecord: '永久记录 · 可用于未来租赁',
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
      'Veri.ai 品牌信任报告 PDF',
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

// ═══════════════════════════════════════════════════════════════════════════
// ⚠️  TRADE SECRET — SERVER-SIDE MIGRATION REQUIRED FOR v1 PRODUCTION
// ═══════════════════════════════════════════════════════════════════════════
//
// The exact multiplier values in this function are PROPRIETARY and represent
// Veri.ai's core scoring methodology. Currently they live in client code,
// which means anyone can View Source on the production site (or open
// browser DevTools) and steal the exact values.
//
// FOR THE v0 MOCK DEMO this is acceptable — every value is fake demo data.
//
// BEFORE v1 PRODUCTION LAUNCH (REQUIRED — DO NOT SKIP):
//   1. Move this function to a server-side API endpoint (POST /api/score)
//   2. Client only receives the computed Trust Score + tier label, NEVER raw
//      multiplier values or factor weights
//   3. Multiplier values stored in server-side config (env or DB), never sent
//      to client
//   4. API response shape must NOT leak weights via field structure
//   5. Production logs must NOT include raw scoring inputs
//   6. Add NDA + IP confidentiality clause to engineering onboarding
//   7. Consider patent application for the multi-signal verification methodology
//
// See SCORING_DISCLOSURE_POLICY.md for the 3-tier disclosure rule.
// See HOW_TRUST_SCORE_WORKS.md for what's safe to publish (no exact numbers).
//
// ═══════════════════════════════════════════════════════════════════════════
//
// Confidence multiplier — Trust Score = Behaviour × Confidence
//
// v3.4.4 (Ken's fairness call): a perfect-paying tenant who provides 1 bill
// should NOT get the same Trust Score as one who provides 6 bills. The
// behaviour quality is the same, but the confidence in our judgment is not.
//
// Multiplier table (also in ARCH_CREDIT_SCORE.md — internal Tier 3 doc only):
//   LHDN ✓ + 3 utilities     → 1.00 multiplier · Mature tier
//   LHDN ✓ + 2 utilities     → 0.85 · Established
//   LHDN ✓ + 1 utility       → 0.70 · Provisional
//   LHDN ✓ + 0 utilities     → 0.55 · Initial (identity-only)
//   LHDN ✗ + 3 utilities     → 0.75 · Provisional (behaviour-only)
//   LHDN ✗ + 2 utilities     → 0.65 · Provisional (behaviour-only)
//   LHDN ✗ + 1 utility       → 0.50 · Initial (minimal)
//   LHDN ✗ + 0 utilities     → 0.30 · Initial (shouldn't reach scoring)
//
// Returns { mul, tierKey } — caller derives tier label from STR.
function computeConfidence(lhdnVerified, billsCount) {
  if (lhdnVerified) {
    if (billsCount >= 3) return { mul: 1.00, tierKey: 'Mature' };
    if (billsCount === 2) return { mul: 0.85, tierKey: 'Established' };
    if (billsCount === 1) return { mul: 0.70, tierKey: 'Provisional' };
    return { mul: 0.55, tierKey: 'Initial' };
  }
  if (billsCount >= 3) return { mul: 0.75, tierKey: 'Provisional' };
  if (billsCount === 2) return { mul: 0.65, tierKey: 'Provisional' };
  if (billsCount === 1) return { mul: 0.50, tierKey: 'Initial' };
  return { mul: 0.30, tierKey: 'Initial' };
}

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

function TextInput({ label, value, onChange, placeholder, mono = false, inputMode = 'text' }) {
  // inputMode controls the on-screen keyboard on mobile:
  //   'numeric' → number pad (no decimal) — used for IC, account #
  //   'tel'     → phone keypad (digits + special chars)
  //   'text'    → default keyboard
  // pattern="[0-9]*" forces iOS to show the numeric keyboard
  // (older iOS versions ignore inputMode but respect pattern).
  const isNumeric = inputMode === 'numeric' || inputMode === 'tel';
  return (
    <div>
      {label && <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{label}</label>}
      <input
        type="text"
        inputMode={inputMode}
        pattern={isNumeric ? '[0-9]*' : undefined}
        autoComplete="off"
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
    // v3.7.3 — Foreign tenant alternative path (no LHDN cert exists for non-MY rentals)
    { id: 'foreign', label: t.methodForeign },
  ];
  return (
    <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#f1f5f9' }}>
      {opts.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className="flex-1 py-2.5 rounded-lg text-[11.5px] font-bold transition active:scale-[0.98]"
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

function BillTile({ label, ph, deepLinkUrl, deepLinkLabel, state, setState, t, lang = 'en', vendor = null }) {
  const {
    open = false,
    method = null,
    value = '',
    file = '',
    verified = false,
    done = false,
    extracted = null,        // v3.7.2/3 — real OCR fields, when ready
    signals = null,          // v3.7.3 — Tier 1 verification signals
    extracting = false,      // v3.7.3 — OCR in flight
    extractError = '',       // v3.7.3 — degraded-mode message
  } = state || {};

  // Collapsed completed state — green tile with summary.
  // Path 1 (account #): subdued — verified via deep-link to provider portal.
  // Path 2 (upload):    full green — 3 months of native bill timing data extracted.
  // v3.7.3 — Real OCR badge + verification signal pills shown when extracted is present.
  if (done) {
    const tail = (value || '0000').slice(-4);
    const summary = method === 'acct'
      ? t.addedAcct.replace('{tail}', tail).replace('{provider}', deepLinkLabel || 'provider')
      : t.addedFile;
    const hasOcr = !!(extracted && extracted.vendor !== undefined);
    const sigSummary = signals ? `${signals.score}/100` : null;
    return (
      <div className="p-3.5 rounded-xl space-y-2"
        style={{ background: '#d1fae5', border: '1px solid #a7f3d0' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#065f46' }}>
            {extracting ? (
              <span style={{
                width: 12, height: 12, borderRadius: '50%',
                border: '1.5px solid #fff', borderTopColor: 'transparent',
                animation: 'screen-spin 0.7s linear infinite', display: 'inline-block',
              }} />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-bold truncate" style={{ color: '#065f46' }}>{label}</div>
            <div className="text-[10px] mt-0.5 truncate" style={{ color: '#065f46' }}>
              {extracting ? 'Reading bill…' : summary}
            </div>
          </div>
          <button
            onClick={() => setState({ open: true, method: null, value: '', file: '', verified: false, done: false })}
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition active:scale-95 flex-shrink-0"
            style={{ background: '#fff', color: '#065f46' }}
          >
            {t.edit}
          </button>
        </div>
        {/* v3.7.3 — Real OCR badge + Tier 1 signals */}
        {hasOcr && !extracting && (
          <div className="space-y-1 pt-1.5" style={{ borderTop: '1px solid #a7f3d0' }}>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="inline-block px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-widest"
                style={{ background: '#0F1E3F', color: '#fff' }}
              >
                ✦ Veri AI
              </span>
              {sigSummary && (
                <span className="text-[10px] font-bold" style={{ color: '#15803d' }}>
                  Auth: {sigSummary}
                </span>
              )}
              {extracted.vendor && (
                <span className="text-[10px] font-mono" style={{ color: '#065f46' }}>
                  · {extracted.vendor}
                </span>
              )}
              {extracted.amountDue && (
                <span className="text-[10px] font-mono" style={{ color: '#065f46' }}>
                  · RM {extracted.amountDue}
                </span>
              )}
            </div>
            {signals && signals.signals.length > 0 && (
              <div className="space-y-0.5">
                {signals.signals.slice(0, 3).map((s, i) => (
                  <div key={i} className="flex items-start gap-1 text-[10px] leading-snug">
                    <span style={{
                      color: s.level === 'green' ? '#16a34a' : s.level === 'amber' ? '#92400E' : '#A32D2D',
                      flexShrink: 0,
                    }}>
                      {s.level === 'green' ? '✓' : s.level === 'amber' ? '⚠' : '✕'}
                    </span>
                    <span style={{ color: s.level === 'green' ? '#15803d' : s.level === 'amber' ? '#92400E' : '#A32D2D' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Degraded-mode notice when OCR failed */}
        {extractError && !extracting && (
          <div className="pt-1.5 text-[10px] leading-snug" style={{ color: '#92400E', borderTop: '1px solid #a7f3d0' }}>
            ⚠ {extractError}
          </div>
        )}
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
          <div className="text-[10px] mt-0.5 italic" style={{ color: '#94a3b8' }}>{t.tileOptional}</div>
        </div>
        <button
          onClick={() => setState({ open: true, method: null, value: '', file: '', verified: false, done: false })}
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
          onClick={() => setState({ open: false, method: null, value: '', file: '', verified: false, done: false })}
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

      {/* Account # input — v3.4.22 side-by-side deep-link + upload pattern.
            Per Ken: "create a UI button just beside when the link was open".
            Two buttons in same row:
              • Left (navy): 🔗 Open {provider} — opens portal, no auto-mark
              • Right (gold border): 📎 Upload screenshot — file picker, marks done
            Matches realistic Path A: deep-link → portal → screenshot → upload back. */}
      {method === 'acct' && (
        <div className="px-3.5 pb-3.5 space-y-2.5">
          <TextInput value={value} onChange={(v) => setState({ ...state, value: v })} placeholder={ph} mono inputMode="numeric" />

          <div className="flex gap-2">
            <a
              href={deepLinkUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { if (!value.trim()) e.preventDefault(); }}
              className={`flex-1 py-2.5 rounded-lg text-[12px] font-bold text-center transition active:scale-[0.98] ${value.trim() ? '' : 'pointer-events-none opacity-40'}`}
              style={{ background: '#0f172a', color: '#fff', textDecoration: 'none' }}
            >
              {t.verifyOnExternal.replace('{provider}', deepLinkLabel || 'provider')}
            </a>
            <label
              className={`flex-1 py-2.5 rounded-lg text-[12px] font-bold text-center transition active:scale-[0.98] cursor-pointer ${value.trim() ? '' : 'pointer-events-none opacity-40'}`}
              style={{ background: '#fff', color: '#0f172a', border: '2px solid #B8893A' }}
            >
              {t.uploadScreenshotShort}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  // Optimistic UI — mark filename + done immediately so the user sees progress.
                  // OCR runs in parallel and enriches the state when it returns.
                  setState({ ...state, file: f.name, done: true, extracting: true, extractError: '' });
                  const result = await extractFromFile(f, 'utility_bill', { lang, vendor });
                  if (result.ok && result.fields) {
                    setState((prev) => ({
                      ...(prev || state),
                      file: f.name,
                      done: true,
                      extracting: false,
                      extracted: result.fields,
                      signals: verifyUtilityBill(result.fields),
                      extractError: '',
                    }));
                  } else {
                    setState((prev) => ({
                      ...(prev || state),
                      file: f.name,
                      done: true,
                      extracting: false,
                      extracted: null,
                      signals: null,
                      extractError: result.degradedMode ? (result.message || 'OCR unavailable. Demo data shown.') : '',
                    }));
                  }
                }}
              />
            </label>
          </div>
          <p className="text-[10px] italic leading-snug" style={{ color: '#94a3b8' }}>
            {t.demoNoteAcct.replace(/\{provider\}/g, deepLinkLabel || 'provider')}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setState({ ...state, method: null })}
              className="flex-1 py-2.5 rounded-lg text-[12px] font-semibold transition active:scale-95"
              style={{ background: '#fff', color: '#475569', border: '1px solid #e2e8f0' }}
            >
              {t.back}
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
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                // Mark filename immediately so the Confirm button enables.
                setState({ ...state, file: f.name, extracting: true, extractError: '' });
                const result = await extractFromFile(f, 'utility_bill', { lang, vendor });
                if (result.ok && result.fields) {
                  setState((prev) => ({
                    ...(prev || state),
                    file: f.name,
                    extracting: false,
                    extracted: result.fields,
                    signals: verifyUtilityBill(result.fields),
                    extractError: '',
                  }));
                } else {
                  setState((prev) => ({
                    ...(prev || state),
                    file: f.name,
                    extracting: false,
                    extracted: null,
                    signals: null,
                    extractError: result.degradedMode ? (result.message || 'OCR unavailable. Demo data shown.') : '',
                  }));
                }
              }}
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

// ─── HelpHint — collapsible (?) info bubble ──────────────────────────────────
//
// Used inline next to fields that need a quick "what is this?" explainer.
// Tap (?) → expands a small body card. Tap again → collapses.
// Also dismissible via close button.
function HelpHint({ title, body }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold transition active:scale-90 ml-1.5"
        style={{ background: open ? '#0f172a' : '#e2e8f0', color: open ? '#fff' : '#64748b' }}
        aria-label={title}
      >
        ?
      </button>
      {open && (
        <div className="mt-2 p-3 rounded-xl text-[11px] leading-relaxed fade-in"
          style={{ background: '#f0f9ff', border: '1px solid #bae6fd', color: '#075985' }}>
          <div className="font-bold mb-1">{title}</div>
          <div>{body}</div>
        </div>
      )}
    </span>
  );
}

// ─── ScoreScale — visual benchmark for the 0-100 score ──────────────────────
//
// Horizontal gradient bar with a marker at the actual score position.
// Helps landlords interpret "94/100" vs "70" vs "51" — what's good?
// v3.4.20 — ScoreScale redesigned to match analyst-target-price reference
// (Ken's screenshot of stock-analyst Avg Target Price visualization).
// Two markers on same gradient bar:
//   • Behaviour Score (above) — what the tenant actually paid like
//   • Trust Score (below) — score after Confidence multiplier
// The visual GAP between markers tells the story of evidence depth:
//   • No gap → full evidence (markers aligned)
//   • Big gap → partial evidence pulled the headline score down
// Math row at bottom: Behaviour × Confidence = Trust Score (educational).
function ScoreScale({ behaviourScore, trustScore, confMul, confTierLabel, t }) {
  const behaviourPos = Math.max(2, Math.min(98, behaviourScore)); // clamp slightly so markers don't fall off the edge
  const trustPos = Math.max(2, Math.min(98, trustScore));
  const markersOverlap = Math.abs(behaviourPos - trustPos) < 4;

  return (
    <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15,23,42,0.06)' }}>
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>
          {t.scaleHeader}
        </div>
      </div>

      {/* Behaviour label + value (above bar) */}
      <div className="text-center mb-1.5">
        <div className="text-[10px]" style={{ color: '#64748b' }}>{t.scaleBehaviourLabel}</div>
        <div className="text-[20px] font-bold leading-none mt-0.5" style={{ color: '#0f172a' }}>{behaviourScore}</div>
      </div>

      {/* The bar with two markers */}
      <div className="relative h-3 rounded-full mb-1.5" style={{
        background: 'linear-gradient(to right, #ef4444 0%, #f59e0b 39%, #84cc16 69%, #10b981 84%, #10b981 100%)',
      }}>
        {/* Behaviour marker (top, slightly above bar) */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          style={{ left: `${behaviourPos}%` }}>
          <div className="rounded-full bg-white"
            style={{
              width: 18, height: 18,
              border: '3px solid #0f172a',
              boxShadow: '0 2px 6px rgba(15,23,42,0.35)',
            }} />
        </div>
        {/* Trust Score marker (only show separately if not overlapping with Behaviour) */}
        {!markersOverlap && (
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${trustPos}%` }}>
            <div className="rounded-full"
              style={{
                width: 18, height: 18,
                background: '#fff',
                border: '3px solid #B8893A',
                boxShadow: '0 2px 6px rgba(184,137,58,0.35)',
              }} />
          </div>
        )}
      </div>

      {/* Trust Score label + value (below bar) */}
      <div className="text-center mb-3">
        <div className="text-[10px]" style={{ color: '#64748b' }}>{t.scaleTrustLabel}</div>
        <div className="text-[20px] font-bold leading-none mt-0.5" style={{ color: '#B8893A' }}>{trustScore}</div>
      </div>

      {/* Range arrow line + tier band labels */}
      <div className="relative mt-1 mb-2">
        <div className="h-px" style={{ background: '#cbd5e1' }} />
        <div className="absolute left-0 top-1/2 -translate-y-1/2"
          style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderRight: '6px solid #cbd5e1' }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2"
          style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid #cbd5e1' }} />
      </div>
      <div className="flex justify-between text-[9px] font-semibold mb-3" style={{ color: '#94a3b8' }}>
        <span>{t.tierRisky}</span>
        <span>{t.tierMixed}</span>
        <span>{t.tierSolid}</span>
        <span>{t.tierOutstandingScale} ★</span>
      </div>

      {/* Math row: Behaviour × Confidence = Trust Score */}
      <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
        <div className="text-center">
          <div className="text-[9px] uppercase tracking-widest" style={{ color: '#94a3b8' }}>{t.s4SubBehaviour}</div>
          <div className="text-[16px] font-bold mt-0.5" style={{ color: '#0f172a' }}>{behaviourScore}</div>
        </div>
        <div className="text-center" style={{ borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
          <div className="text-[9px] uppercase tracking-widest flex items-center justify-center gap-0.5" style={{ color: '#94a3b8' }}>
            {t.s4SubConfidence}
            {/* v3.7.2 — T4 confidence tooltip per sprint-2 backlog */}
            <HelpHint
              title={t.s4SubConfidence}
              body={`${confTierLabel || ''} · ${Math.round(confMul * 100)}% confidence multiplier. Confidence reflects how much evidence we have on the tenant — more LHDN months + more utility bills = higher confidence. The Trust Score = Behaviour × Confidence, so partial evidence shrinks the headline number even if behaviour is perfect.`}
            />
          </div>
          <div className="text-[16px] font-bold mt-0.5" style={{ color: '#0f172a' }}>{Math.round(confMul * 100)}%</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] uppercase tracking-widest" style={{ color: '#94a3b8' }}>{t.s4Title}</div>
          <div className="text-[16px] font-bold mt-0.5" style={{ color: '#B8893A' }}>{trustScore}</div>
        </div>
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
function TrustCardPreview({ tenantName, tenantIC, score, behaviour, tierLabel, lhdnVerified, lhdnResult, avgGapDays, caseRef, t }) {
  const gapText = avgGapDays < 0
    ? t.cardEarlyDays.replace('{n}', String(Math.abs(avgGapDays)))
    : avgGapDays > 0
      ? t.cardLateDays.replace('{n}', String(avgGapDays))
      : t.cardOnTime;

  // Star rating reflects Trust Score (not raw behaviour)
  const stars = score >= 85 ? '★★★★★' : score >= 70 ? '★★★★' : score >= 55 ? '★★★' : score >= 40 ? '★★' : '★';

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
          <span className="text-white text-[11px] font-black tracking-tight">FIND<span style={{ color: '#B8893A' }}>.AI</span></span>
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
            IC ····{tenantIC || 'XXXX'} · {lhdnVerified ? t.cardVerified : t.identityUnverified}
          </div>
        </div>

        {/* Trust Score + Behaviour breakdown */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-[32px] font-bold leading-none" style={{ color: '#0f172a' }}>{score}</div>
              <div className="text-[12px]" style={{ color: '#94a3b8' }}>/ 100</div>
            </div>
            <div className="text-[9.5px] font-bold mt-1.5" style={{ color: '#065f46' }}>
              {t.s4SubBehaviour} {behaviour} · {tierLabel}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] tracking-tight" style={{ color: '#B8893A' }}>{stars}</div>
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

      {/* v3.4.23 — "Permanent record" badge per ARCH_USER_PROFILES.md.
          Signals to tenants that this Trust Score is a portable artifact —
          they can re-use it for future rentals via Veri.ai's tenant profile
          + LBV (Live Bound Verification). Subtle, never the headline. */}
      <div className="px-4 py-1.5 text-center text-[8px] uppercase tracking-widest font-semibold"
        style={{ background: '#0f172a', color: 'rgba(184,137,58,0.85)' }}>
        🔄 {t.cardPermanentRecord}
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
  // v3.4.35 — Submission context from /screen/[ref] route.
  // When tenant lands via a generated request link, this is populated with
  // { ref, mode, landlordName, property } from the URL params. The score
  // reveal step encodes these into the WhatsApp share URL so the recipient
  // sees the proper context on /trust/[reportId].
  submissionContext,
}) {
  const t = STR[lang] || STR.en;
  const stableCaseRef = useMemo(() => caseRef || makeCaseRef(), [caseRef]);

  // Step machine: 0 intro / 1 identity / 2 LHDN / 3 bills / 4 score
  const [step, setStep] = useState(0);

  // Step 1 state
  const [tenantName, setTenantName] = useState(activeMemory?.tenant?.name || (DEMO_MODE ? MOCK_LHDN_RESULT.tenantName : ''));
  const [tenantIC, setTenantIC] = useState(activeMemory?.tenant?.icLast4 || (DEMO_MODE ? '4321' : ''));

  // v3.4.23 — Returning tenant lookup (DEMO placeholder for ARCH_USER_PROFILES.md)
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState(null); // null | 'found' | 'notfound'

  // Step 2 state — dual-input: tenant picks number OR pdf
  const [lhdnMethod, setLhdnMethod] = useState('number'); // 'number' | 'pdf'
  const [certNumber, setCertNumber] = useState(DEMO_MODE ? 'ABC1234567890' : '');
  const [lhdnPdfName, setLhdnPdfName] = useState('');
  // v3.4.21 — `verifying` spinner state removed. LHDN verify is now a deep-link.
  const [lhdnResult, setLhdnResult] = useState(null);
  // v3.7.2 — Real OCR state. When an LHDN cert image/PDF is uploaded and
  // /api/screen/extract returns real fields, lhdnExtracted holds them and
  // lhdnVerifySignals holds the Tier 1 fraud-defense signals. Either may be
  // null if the OCR is unavailable (Anthropic credits / network) — UI then
  // falls back to MOCK_LHDN_RESULT so the demo still works.
  const [lhdnExtracted, setLhdnExtracted] = useState(null);
  const [lhdnVerifySignals, setLhdnVerifySignals] = useState(null);
  const [lhdnExtracting, setLhdnExtracting] = useState(false);
  const [lhdnExtractError, setLhdnExtractError] = useState('');

  // v3.7.3 — Foreign tenant alternative path state.
  // Non-Malaysian tenants don't have an LHDN STAMPS-anchored previous tenancy.
  // Alternative documents: passport last-4 + employer letter + (optional) overseas-rental reference.
  const [foreignPassportLast4, setForeignPassportLast4] = useState('');
  const [foreignEmployerLetterName, setForeignEmployerLetterName] = useState('');
  const [foreignRentalRefName, setForeignRentalRefName] = useState('');
  const [foreignNationality, setForeignNationality] = useState('');

  // Step 3 state — TNB + Water + Mobile, each with its own mini-state machine
  const blank = { open: false, method: null, value: '', file: '', done: false };
  const [tnbState, setTnbState] = useState(blank);
  const [waterState, setWaterState] = useState(blank);
  const [mobileState, setMobileState] = useState(blank);

  // Step 4 state
  const [savedToCase, setSavedToCase] = useState(false);

  // v3.4.17 — DEMO Evidence Scenario toggle (only active when DEMO_MODE)
  const [demoScenario, setDemoScenario] = useState(null); // null | 'full' | 'partial' | 'limited'

  const goNext = () => setStep((s) => Math.min(s + 1, 4));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  // "Screen another tenant" — full reset to start a fresh case. Used at the
  // end of score reveal so landlords can run a back-to-back screening
  // without re-opening the modal.
  const resetForScreenAnother = () => {
    setStep(0);
    setTenantName(DEMO_MODE ? MOCK_LHDN_RESULT.tenantName : '');
    setTenantIC(DEMO_MODE ? '4321' : '');
    setLhdnMethod('number');
    setCertNumber(DEMO_MODE ? 'ABC1234567890' : '');
    setLhdnPdfName('');
    setLhdnResult(null);
    setLhdnExtracted(null);
    setLhdnVerifySignals(null);
    setLhdnExtracting(false);
    setLhdnExtractError('');
    setForeignPassportLast4('');
    setForeignEmployerLetterName('');
    setForeignRentalRefName('');
    setForeignNationality('');
    setTnbState(blank);
    setWaterState(blank);
    setMobileState(blank);
    setSavedToCase(false);
  };

  // v3.4.21 — verifyWithLHDN function + verifying spinner state removed.
  // LHDN verification is now a deep-link to stamps.hasil.gov.my (same 1-click
  // pattern as TNB Account #) that sets the mock result on click.
  const verifyDisabled = (lhdnMethod === 'number' ? !certNumber.trim() : !lhdnPdfName);

  // v3.4.3 (Ken): Veri.ai is a support tool, landlord decides what's enough.
  // At least 1 utility is enough to proceed. Even mobile-only is OK.
  // Landlord sees clear "limited data" badge if they proceed with partial data.
  const billsCount = (tnbState.done ? 1 : 0) + (waterState.done ? 1 : 0) + (mobileState.done ? 1 : 0);
  const billsOk = billsCount >= 1;

  // v3.4.4 (Ken): Trust Score = Behaviour × Confidence. Behaviour reflects
  // how well they paid (mock 95). Confidence reflects evidence depth (varies
  // by LHDN status + bill count). Different evidence = different Trust Score
  // for the same behaviour quality. Fair, transparent, motivates more uploads.
  const actualLhdnVerified = !!(lhdnResult && !lhdnResult.skipped);

  // v3.4.17 — Evidence Scenario toggle (DEMO only).
  // Per Ken: "don't judge tenants — show how the score adapts to evidence."
  // When demoScenario is set, override the actualLhdnVerified + billsCount
  // with the scenario values so landlords can see how the SAME tenant gets
  // different Trust Scores based on what they shared. Default null = use
  // whatever the user actually clicked through.
  const SCENARIOS = {
    full:    { lhdnVerified: true,  billsCount: 3, shown: { tnb: true,  water: true,  mobile: true  } },
    partial: { lhdnVerified: true,  billsCount: 1, shown: { tnb: true,  water: false, mobile: false } },
    limited: { lhdnVerified: false, billsCount: 1, shown: { tnb: false, water: false, mobile: true  } },
  };
  const scenarioOverride = demoScenario ? SCENARIOS[demoScenario] : null;
  const lhdnVerified = scenarioOverride ? scenarioOverride.lhdnVerified : actualLhdnVerified;
  const effectiveBillsCount = scenarioOverride ? scenarioOverride.billsCount : billsCount;
  const utilityShown = scenarioOverride ? scenarioOverride.shown : { tnb: tnbState.done, water: waterState.done, mobile: mobileState.done };

  const { mul: confMul, tierKey: confTierKey } = computeConfidence(lhdnVerified, effectiveBillsCount);
  const behaviourScore = MOCK_SCORE.total;            // mock 95
  const trustScore = Math.round(behaviourScore * confMul);
  const confTierLabel = t[`confTier${confTierKey}`] || confTierKey;
  const confTierDesc  = t[`confDesc${confTierKey}`]  || '';

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
      <ToolHeader icon="" title={t.title} desc={t.desc} onClose={onClose} onAsk={onAsk} askLabel={askLabel} />

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

          {/* v3.4.23 — Returning tenant lookup placeholder (DEMO).
              Shows pilots the planned portable Trust Score concept per
              ARCH_USER_PROFILES.md. In production: queries tenant profile DB
              + triggers LBV (push to tenant phone, live face match, then
              score released to landlord). For demo: any input returns mock
              result with re-use / refresh choice. */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #FDE68A' }}>
            <div className="px-3.5 py-2.5 flex items-center gap-2" style={{ background: '#FEF3C7' }}>
              <span className="text-[11px] font-bold" style={{ color: '#92400E' }}>{t.returningTenantHeader}</span>
              <span className="text-[8.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ml-auto" style={{ background: '#92400E', color: '#fff' }}>DEMO</span>
            </div>
            <div className="px-3.5 py-3 space-y-2">
              {!lookupResult && (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={lookupQuery}
                      onChange={(e) => setLookupQuery(e.target.value)}
                      placeholder={t.returningTenantPh}
                      inputMode="numeric"
                      className="flex-1 rounded-lg px-3 py-2 text-[13px] font-mono focus:outline-none"
                      style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
                    />
                    <button
                      onClick={() => {
                        if (lookupQuery.trim()) {
                          setLookupResult('found'); // mock always returns found in DEMO
                        }
                      }}
                      disabled={!lookupQuery.trim()}
                      className="px-3 py-2 rounded-lg text-[11.5px] font-bold text-white disabled:opacity-40 transition active:scale-95"
                      style={{ background: '#0f172a' }}
                    >
                      {t.returningTenantLookup}
                    </button>
                  </div>
                  <div className="text-[10px] text-center italic" style={{ color: '#94a3b8' }}>{t.returningTenantOr}</div>
                </>
              )}

              {lookupResult === 'found' && (
                <div className="p-3 rounded-lg space-y-2" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[12px] font-bold" style={{ color: '#15803d' }}>{t.returningTenantFound}</span>
                  </div>
                  <div className="text-[10.5px] leading-snug" style={{ color: '#15803d' }}>
                    {t.returningTenantFoundDesc
                      .replace('{months}', '2')
                      .replace('{handle}', 'L***rd A')
                      .replace('{score}', '95')
                      .replace('{tier}', 'Mature')}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setTenantName(MOCK_LHDN_RESULT.tenantName);
                        setTenantIC('4321');
                        setLhdnResult(MOCK_LHDN_RESULT);
                        setTnbState({ ...blank, done: true, method: 'file' });
                        setWaterState({ ...blank, done: true, method: 'file' });
                        setMobileState({ ...blank, done: true, method: 'file' });
                        setStep(4); // jump straight to score reveal
                      }}
                      className="flex-1 py-2 rounded-lg text-[11px] font-bold text-white transition active:scale-95"
                      style={{ background: '#0f172a' }}
                    >
                      {t.returningTenantReuse}
                    </button>
                    <button
                      onClick={() => {
                        setTenantName(MOCK_LHDN_RESULT.tenantName);
                        setTenantIC('4321');
                        setLookupResult(null);
                        setLookupQuery('');
                      }}
                      className="flex-1 py-2 rounded-lg text-[11px] font-semibold transition active:scale-95"
                      style={{ background: '#fff', color: '#475569', border: '1px solid #e2e8f0' }}
                    >
                      {t.returningTenantRefresh}
                    </button>
                  </div>
                </div>
              )}

              <p className="text-[9.5px] italic leading-snug" style={{ color: '#94a3b8' }}>{t.returningTenantDemoNote}</p>
            </div>
          </div>

          <div className="text-[10px] text-center font-semibold" style={{ color: '#94a3b8' }}>{t.returningTenantNew}</div>

          <TextInput label={t.nameLabel} value={tenantName} onChange={setTenantName} placeholder={t.namePh} />
          <div>
            <TextInput label={t.icLabel} value={tenantIC} onChange={setTenantIC} placeholder={t.icPh} mono inputMode="numeric" />
            <p className="text-[10px] mt-1.5 italic" style={{ color: '#94a3b8' }}>{t.icSubtitle}</p>
          </div>
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
            <div className="flex items-start">
              <h4 className="text-[16px] font-bold" style={{ color: '#0f172a' }}>{t.s2Title}</h4>
              <HelpHint title={t.lhdnHelp} body={t.lhdnHelpBody} />
            </div>
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

              {/* v3.7.3 — Foreign tenant alternative path.
                  Non-Malaysians don't have an LHDN STAMPS-anchored previous
                  tenancy (the cert only exists for tenancies stamped in MY).
                  Alternative documents: passport last-4 + nationality +
                  employer letter + (optional) overseas-rental reference. */}
              {lhdnMethod === 'foreign' && (
                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-lg text-[11px] leading-relaxed"
                    style={{ background: '#f0f9ff', border: '1px solid #bae6fd', color: '#075985' }}>
                    {t.foreignNote}
                  </div>
                  <TextInput
                    label={t.foreignPassportLabel}
                    value={foreignPassportLast4}
                    onChange={(v) => { setForeignPassportLast4(v.slice(0, 4)); setLhdnResult(null); }}
                    placeholder={t.foreignPassportPh}
                    mono
                    inputMode="numeric"
                  />
                  <TextInput
                    label={t.foreignNationalityLabel}
                    value={foreignNationality}
                    onChange={(v) => { setForeignNationality(v); setLhdnResult(null); }}
                    placeholder={t.foreignNationalityPh}
                  />
                  <PdfDropZone
                    pdfName={foreignEmployerLetterName}
                    onPick={(name) => { setForeignEmployerLetterName(name); setLhdnResult(null); }}
                    t={{ ...t, pdfDropPrompt: t.foreignEmployerLabel, pdfDropHint: t.foreignEmployerHint, pdfReady: t.pdfReady }}
                  />
                  <PdfDropZone
                    pdfName={foreignRentalRefName}
                    onPick={(name) => { setForeignRentalRefName(name); }}
                    t={{ ...t, pdfDropPrompt: t.foreignRentalRefLabel, pdfDropHint: t.foreignRentalRefHint, pdfReady: t.pdfReady }}
                  />
                  <button
                    onClick={() => {
                      // Foreign-tenant submission — sets a foreign-flagged result
                      // so the verified-result card branches accordingly. Score
                      // formula treats foreign verification as identity-only
                      // (no LHDN previous-tenancy bonus); utility bills score
                      // remains the primary signal.
                      setLhdnResult({
                        foreign: true,
                        passportLast4: foreignPassportLast4,
                        nationality: foreignNationality,
                        employerLetter: foreignEmployerLetterName,
                        rentalRef: foreignRentalRefName || null,
                      });
                      // Auto-fill the IC last-4 with passport last-4 so the
                      // downstream "Tenant identity" line stays consistent.
                      setTenantIC(foreignPassportLast4);
                    }}
                    disabled={!foreignPassportLast4 || foreignPassportLast4.length < 4 || !foreignNationality.trim() || !foreignEmployerLetterName}
                    className="w-full py-3 rounded-xl text-[12px] font-bold text-white disabled:opacity-40 transition active:scale-[0.98]"
                    style={{ background: '#0f172a' }}
                  >
                    {t.foreignSubmit}
                  </button>
                  <p className="text-[10px] italic leading-snug" style={{ color: '#94a3b8' }}>
                    {t.foreignDemoNote}
                  </p>
                </div>
              )}

              {/* v3.4.22 — Side-by-side deep-link + upload screenshot pattern
                  per Ken's UX call ("create a UI button just beside when the
                  link was open"). Two buttons in same row:
                    • Left (navy): 🔗 Open LHDN STAMPS — opens portal, no auto-mark
                    • Right (gold border): 📎 Upload screenshot — file picker, marks verified
                  Matches the realistic Path A workflow from ARCH_CREDIT_SCORE.md:
                  open portal → screenshot → upload back → OCR extracts result.
                  v3.7.3 — Hidden when method === 'foreign' (foreign flow has
                  its own submit button above). */}
              {lhdnMethod !== 'foreign' && (
              <>
              <div className="flex gap-2">
                <a
                  href="https://stamps.hasil.gov.my"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { if (verifyDisabled) e.preventDefault(); }}
                  className={`flex-1 py-3 rounded-xl text-[12px] font-bold text-white text-center transition active:scale-[0.98] ${verifyDisabled ? 'pointer-events-none opacity-40' : ''}`}
                  style={{ background: '#0f172a', textDecoration: 'none' }}
                >
                  {t.verify}
                </a>
                <label
                  className={`flex-1 py-3 rounded-xl text-[12px] font-bold text-center transition active:scale-[0.98] cursor-pointer ${verifyDisabled ? 'pointer-events-none opacity-40' : ''}`}
                  style={{ background: '#fff', color: '#0f172a', border: '2px solid #B8893A' }}
                >
                  {t.uploadScreenshot}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLhdnExtracting(true);
                      setLhdnExtractError('');
                      const result = await extractFromFile(file, 'lhdn_cert', { lang });
                      setLhdnExtracting(false);
                      if (result.ok && result.fields) {
                        // Real OCR succeeded — build a canonical lhdnResult shape
                        // by merging extracted fields with mock structure for the
                        // fields the API doesn't return. This way the existing
                        // result-card renderer keeps working unchanged.
                        const f = result.fields;
                        const periodMonths = f.leaseTermMonths || MOCK_LHDN_RESULT.months;
                        const merged = {
                          ...MOCK_LHDN_RESULT,
                          tenantName: f.tenantName || MOCK_LHDN_RESULT.tenantName,
                          months: periodMonths,
                          address: f.propertyAddress || MOCK_LHDN_RESULT.address,
                          monthlyRent: f.monthlyRent || MOCK_LHDN_RESULT.monthlyRent,
                          stampDuty: f.stampDuty || MOCK_LHDN_RESULT.stampDuty,
                          executionDate: f.executionDate || MOCK_LHDN_RESULT.executionDate,
                          stampedDate: f.stampedDate || MOCK_LHDN_RESULT.stampedDate,
                        };
                        setLhdnExtracted(f);
                        setLhdnVerifySignals(verifyLhdnCert(f));
                        setLhdnResult(merged);
                        // If extracted tenant name differs from current, update
                        if (f.tenantName) setTenantName(f.tenantName);
                        if (f.tenantICLast4) setTenantIC(f.tenantICLast4);
                      } else {
                        // Graceful degraded — fall back to mock so demo still works
                        if (result.degradedMode) {
                          setLhdnExtractError(result.message || 'OCR temporarily unavailable. Using demo data.');
                        }
                        setLhdnResult(MOCK_LHDN_RESULT);
                      }
                    }}
                  />
                </label>
              </div>
              {/* v3.7.2 — OCR loading indicator */}
              {lhdnExtracting && (
                <div
                  className="p-3 rounded-xl flex items-center gap-2 fade-in"
                  style={{ background: '#F3EFE4', border: '1px solid #E7E1D2' }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: '1.5px solid #0F1E3F',
                      borderTopColor: 'transparent',
                      animation: 'screen-spin 0.7s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  <span className="text-[12px] font-semibold" style={{ color: '#0F1E3F' }}>
                    Veri is reading your LHDN cert…
                  </span>
                  <style jsx>{`
                    @keyframes screen-spin { to { transform: rotate(360deg); } }
                  `}</style>
                </div>
              )}

              {/* v3.7.2 — OCR degraded-mode notice */}
              {lhdnExtractError && !lhdnExtracting && (
                <div
                  className="p-3 rounded-xl text-[11px] leading-relaxed fade-in"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E' }}
                >
                  ⚠ {lhdnExtractError}
                </div>
              )}

              <p className="text-[10px] italic leading-snug" style={{ color: '#94a3b8' }}>
                {t.lhdnDemoNote}
              </p>
              </>
              )}

              {/* Skip option — Veri.ai is a support tool, landlord decides */}
              <div className="pt-1">
                <button
                  onClick={() => setLhdnResult({ skipped: true })}
                  className="w-full py-2.5 rounded-xl text-[12px] font-semibold transition active:scale-[0.98]"
                  style={{ background: 'transparent', color: '#64748b', border: '1px dashed #cbd5e1' }}
                >
                  {t.lhdnSkip}
                </button>
                <p className="text-[10px] text-center mt-1.5 leading-snug" style={{ color: '#94a3b8' }}>
                  {t.lhdnSkipNote}
                </p>
              </div>
            </>
          )}

          {/* Verified result — green (Malaysian LHDN flow) */}
          {lhdnResult && !lhdnResult.skipped && !lhdnResult.foreign && (
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

              {/* v3.7.2 — Real OCR badge + Tier 1 verification signals */}
              {lhdnExtracted && (
                <div className="pt-2 mt-1 space-y-2" style={{ borderTop: '1px solid #bbf7d0' }}>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest"
                      style={{ background: '#0F1E3F', color: '#fff' }}
                    >
                      ✦ Veri AI · Real OCR
                    </span>
                    {lhdnVerifySignals && (
                      <span className="text-[10px] font-bold" style={{ color: '#15803d' }}>
                        Authenticity: {lhdnVerifySignals.score}/100
                      </span>
                    )}
                  </div>
                  {lhdnVerifySignals && lhdnVerifySignals.signals.length > 0 && (
                    <div className="space-y-1">
                      {lhdnVerifySignals.signals.slice(0, 5).map((s, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[10.5px] leading-relaxed">
                          <span style={{
                            color: s.level === 'green' ? '#16a34a' : s.level === 'amber' ? '#92400E' : '#A32D2D',
                            flexShrink: 0,
                            marginTop: 1,
                          }}>
                            {s.level === 'green' ? '✓' : s.level === 'amber' ? '⚠' : '✕'}
                          </span>
                          <span style={{ color: s.level === 'green' ? '#15803d' : s.level === 'amber' ? '#92400E' : '#A32D2D' }}>
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* v3.7.3 — Verified result — blue (Foreign tenant alternative-document flow) */}
          {lhdnResult && lhdnResult.foreign && (
            <div className="p-4 rounded-2xl space-y-3 fade-in" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest"
                  style={{ background: '#0369a1', color: '#fff' }}
                >
                  ✓ {t.foreignVerified}
                </span>
                <span className="text-[9px] font-mono" style={{ color: '#94a3b8' }}>
                  passport · employer letter
                </span>
              </div>
              <div className="text-[13px] font-bold" style={{ color: '#075985' }}>{t.foreignIdentityNote}</div>
              <div className="space-y-1.5 pt-1">
                <div className="flex gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest w-20 flex-shrink-0 mt-0.5" style={{ color: '#0369a1' }}>{t.foreignNationalityLabel}</span>
                  <span className="text-[12px] font-semibold" style={{ color: '#0f172a' }}>{lhdnResult.nationality}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest w-20 flex-shrink-0 mt-0.5" style={{ color: '#0369a1' }}>{t.foreignPassportLabel}</span>
                  <span className="text-[12px] font-mono" style={{ color: '#0f172a' }}>•••• {lhdnResult.passportLast4}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest w-20 flex-shrink-0 mt-0.5" style={{ color: '#0369a1' }}>{t.foreignEmployerLabel}</span>
                  <span className="text-[12px] leading-snug" style={{ color: '#0f172a' }}>{lhdnResult.employerLetter}</span>
                </div>
                {lhdnResult.rentalRef && (
                  <div className="flex gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest w-20 flex-shrink-0 mt-0.5" style={{ color: '#0369a1' }}>{t.foreignRentalRefLabel}</span>
                    <span className="text-[12px] leading-snug" style={{ color: '#0f172a' }}>{lhdnResult.rentalRef}</span>
                  </div>
                )}
              </div>
              <div className="pt-2 mt-1 text-[10.5px] leading-relaxed" style={{ color: '#075985', borderTop: '1px solid #bae6fd' }}>
                {t.foreignNoLhdnBonus}
              </div>
            </div>
          )}

          {/* Skipped result — amber, no green check */}
          {lhdnResult && lhdnResult.skipped && (
            <div className="p-4 rounded-2xl space-y-2 fade-in" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest" style={{ background: '#92400E', color: '#fff' }}>
                  ⊘ {t.lhdnSkipped}
                </span>
                <button onClick={() => setLhdnResult(null)} className="text-[10px] font-semibold" style={{ color: '#92400E' }}>
                  {t.back}
                </button>
              </div>
              <div className="text-[12px] font-semibold" style={{ color: '#92400E' }}>{t.identityUnverified}</div>
              <div className="text-[10.5px] leading-relaxed" style={{ color: '#92400E' }}>{t.lhdnSkipNote}</div>
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
            <BillTile
              label={t.tnb}
              ph={t.acctTnbPh}
              deepLinkUrl="https://www.mytnb.com.my"
              deepLinkLabel="TNB"
              state={tnbState}
              setState={setTnbState}
              t={t}
              lang={lang}
              vendor="TNB"
            />
            <BillTile
              label={t.water}
              ph={t.acctWaterPh}
              deepLinkUrl="https://www.airselangor.com"
              deepLinkLabel="Air Selangor"
              state={waterState}
              setState={setWaterState}
              t={t}
              lang={lang}
              vendor="AirSelangor"
            />
            <BillTile
              label={t.mobile}
              ph={t.acctMobilePh}
              deepLinkUrl="https://www.maxis.com.my"
              deepLinkLabel="Maxis"
              state={mobileState}
              setState={setMobileState}
              t={t}
              lang={lang}
              vendor="Maxis"
            />
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

          {/* v3.4.17 — Evidence Scenario picker (DEMO only).
              Per Ken: "show how the score adapts to evidence, don't judge tenants."
              Same tenant, different evidence depth → different Trust Score.
              Lets pilots see how the system responds to evidence quality without
              labeling anyone as a "good" or "bad" tenant. */}
          {DEMO_MODE && (
            <div className="p-3 rounded-xl" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ background: '#92400E', color: '#fff' }}>DEMO</span>
                <span className="text-[10.5px] font-bold" style={{ color: '#92400E' }}>{t.scenarioHeader}</span>
              </div>
              <p className="text-[10px] mb-2 leading-snug" style={{ color: '#92400E' }}>{t.scenarioSub}</p>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'full',    label: t.scenarioFull,    desc: t.scenarioFullDesc },
                  { key: 'partial', label: t.scenarioPartial, desc: t.scenarioPartialDesc },
                  { key: 'limited', label: t.scenarioLimited, desc: t.scenarioLimitedDesc },
                ].map((s) => {
                  const active = demoScenario === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setDemoScenario(active ? null : s.key)}
                      className="p-2 rounded-lg text-left transition active:scale-95"
                      style={active
                        ? { background: '#0f172a', color: '#fff', border: '1px solid #0f172a' }
                        : { background: '#fff', color: '#92400E', border: '1px solid #FDE68A' }
                      }
                    >
                      <div className="text-[10.5px] font-bold leading-tight">{s.label}</div>
                      <div className="text-[9px] mt-1 leading-tight" style={{ opacity: 0.75 }}>{s.desc}</div>
                    </button>
                  );
                })}
              </div>
              {demoScenario && (
                <button
                  onClick={() => setDemoScenario(null)}
                  className="text-[10px] font-semibold mt-2 underline"
                  style={{ color: '#92400E', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ← Back to actual data
                </button>
              )}
            </div>
          )}

          {/* Hero Trust Score card — navy. Trust Score = Behaviour × Confidence.
              LHDN badge: green if verified, amber if skipped. */}
          <div className="p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.s4Title}</div>
              {lhdnVerified ? (
                <VerifiedBadge label="LHDN" />
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
                  style={{ background: '#92400E', color: '#fff' }}>
                  ⊘ {t.lhdnSkipped}
                </span>
              )}
            </div>

            {/* Big Trust Score */}
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-5xl font-bold text-white leading-none">{trustScore}</div>
              <div className="text-[14px]" style={{ color: 'rgba(255,255,255,0.5)' }}>/ 100</div>
            </div>

            {/* Behaviour × Confidence breakdown */}
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <span>{t.s4SubBehaviour}</span>
                <span className="font-bold text-white">{behaviourScore}</span>
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>×</span>
                <span>{t.s4SubConfidence}</span>
                <span className="font-bold text-white">{Math.round(confMul * 100)}%</span>
              </div>
              <div className="text-[10px] mt-1.5 flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest" style={{ background: 'rgba(184,137,58,0.2)', color: '#B8893A' }}>{confTierLabel}</span>
                <span>·</span>
                <span>{confTierDesc}</span>
                {!lhdnVerified && <><span>·</span><span>{t.identityUnverified}</span></>}
              </div>
            </div>
          </div>

          {/* T2 — Score benchmark scale (v3.4.20 redesigned to dual-marker style)
              Shows Behaviour × Confidence = Trust Score visually. Two markers
              on the bar: Behaviour (navy) and Trust Score (gold). The gap
              between them = how much evidence depth pulled the headline down. */}
          <ScoreScale
            behaviourScore={behaviourScore}
            trustScore={trustScore}
            confMul={confMul}
            confTierLabel={confTierLabel}
            t={t}
          />

          {/* Methodology link — public-tier disclosure of how the Trust Score
              works. Builds trust at the moment of decision. Implementation per
              SCORING_DISCLOSURE_POLICY.md Tier 2 (in-product drill-in only). */}
          <div className="text-center">
            <HelpHint title={t.methodologyTitle} body={`${t.methodologyBody}\n\n${t.methodologyDecision}`} />
            <span className="text-[11px] font-semibold underline ml-1" style={{ color: '#475569' }}>
              {t.methodologyLink}
            </span>
          </div>

          {/* Effort hint — gamification: more uploads = higher Trust Score */}
          {confMul < 1.0 && (
            <div className="text-[10.5px] text-center italic" style={{ color: '#94a3b8' }}>
              {t.s4EffortHint}
            </div>
          )}

          {/* Landlord-judgment chip — surfaces when LHDN skipped or partial bills */}
          {(!lhdnVerified || effectiveBillsCount < 3) && (
            <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
              <span className="text-[10px] flex-shrink-0">⚠️</span>
              <div className="flex-1">
                <div className="text-[11px] font-bold" style={{ color: '#92400E' }}>{t.confLandlordJudgment}</div>
                <div className="text-[10.5px] mt-0.5" style={{ color: '#92400E' }}>
                  {!lhdnVerified && effectiveBillsCount < 3
                    ? `${t.identityUnverified} · ${t.confLimited.replace('{n}', String(effectiveBillsCount))}`
                    : !lhdnVerified
                      ? t.identityUnverified
                      : t.confLimited.replace('{n}', String(effectiveBillsCount))}
                </div>
              </div>
            </div>
          )}

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

          {/* Per-utility timing breakdown — only show utilities landlord actually provided.
              Honest mock: if landlord skipped Water, no Water card here. */}
          <div className="space-y-2">
            {MOCK_SCORE.utilities
              .filter((_u, i) => (i === 0 ? utilityShown.tnb : i === 1 ? utilityShown.water : utilityShown.mobile))
              .map((u) => (
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
              score={trustScore}
              behaviour={behaviourScore}
              tierLabel={confTierLabel}
              lhdnVerified={lhdnVerified}
              lhdnResult={MOCK_LHDN_RESULT}
              avgGapDays={MOCK_SCORE.avgGapDays}
              caseRef={stableCaseRef}
              t={t}
            />
          </div>

          {/* v3.4.18 — Bill Verification panel.
              UI placeholder showing the planned Tier 1 fraud-defense lattice
              (per ARCH_BILL_VERIFICATION.md). v0 mock simulates all checks as
              passed; v1 production wires the actual Claude-vision OCR + EXIF
              + address match + account consistency + cycle sequence checks.
              Pilots see this UI to understand the planned defense AND to
              build trust that bill photos won't be fakeable in production. */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
            <div className="px-3.5 py-2.5 flex items-center justify-between" style={{ background: '#f8fafc', borderBottom: '1px solid #edf0f4' }}>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold" style={{ color: '#0f172a' }}>{t.verifyHeader}</span>
                <span className="text-[8.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ background: '#FEF3C7', color: '#92400E' }}>DEMO</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: '#d1fae5', color: '#065f46' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {t.verifyAllPassed}
              </span>
            </div>
            <div className="px-3.5 py-2.5 space-y-1">
              {[t.verifyTemplate, t.verifyAddress, t.verifyExif, t.verifyAccount, t.verifyCycle].map((check, i) => (
                <div key={i} className="flex items-start gap-2">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span className="text-[10.5px] leading-snug" style={{ color: '#475569' }}>{check}</span>
                </div>
              ))}
            </div>
            <div className="px-3.5 py-2 italic text-[9.5px]" style={{ color: '#94a3b8', borderTop: '1px solid #f1f5f9' }}>
              {t.verifyDemoNote}
            </div>
          </div>

          {/* DNA disclaimer */}
          <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
            <span className="text-[10px] flex-shrink-0">⚠️</span>
            <p className="text-[10.5px] leading-relaxed" style={{ color: '#92400E' }}>{t.landlordSafetyNote}</p>
          </div>

          {/* Action buttons. WhatsApp forward is FIRST in v0 because it's the
              actually-working action — landlords/agents get a real shareable
              summary right now. Save Trust Card (real PDF) ships in v1. */}
          <div className="pt-2 space-y-2">

            {/* WhatsApp forward — opens WhatsApp with Trust Card link.
                v3.4.31 (Sprint 1): switched from text-only dump to short URL +
                concise summary. The URL hits /r/{reportId} → redirects to
                /trust/{reportId}, which has full OG meta tags so WhatsApp/
                Telegram render a rich link preview. THIS is the viral mechanic
                per WEB_UX_PATTERNS.md + ARCH_REVEAL_TIERS.md.
                v3.4.35 (Sprint 1-3): URL now encodes actual score data in
                query params so cross-device sharing shows the real submission
                (not hardcoded mock). Plus landlord/property context if the
                tenant came in via /screen/{ref} link. */}
            {(() => {
              const ORIGIN = (typeof window !== 'undefined' && window.location && window.location.origin) || 'https://find-ai-lovat.vercel.app';
              const ctx = (typeof submissionContext !== 'undefined' && submissionContext) || {};
              const mode = ctx.mode || 'anonymous';

              // Anonymous tenant ID for this Trust Card. In v0 generated from
              // case ref hash; in v1 issued by Supabase as part of tenant profile.
              const anonId = `T-${(stableCaseRef || 'XXXX').slice(-4).toUpperCase()}`;

              // v3.4.35 — Encode actual score data into URL query params so
              // /trust/[reportId] renders the real submission cross-device.
              const params = new URLSearchParams();
              params.set('s', String(trustScore));
              params.set('b', String(behaviourScore));
              params.set('c', String(Math.round(confMul * 100)));
              params.set('ct', confTierLabel || 'High');
              params.set('t', anonId);
              params.set('m', mode);
              if (mode === 'verified' && tenantName) params.set('n', tenantName);
              params.set('lh', lhdnVerified ? '1' : '0');
              params.set('lm', String(MOCK_LHDN_RESULT.months || 14));
              params.set('u', String(effectiveBillsCount));
              params.set('ag', String(MOCK_SCORE.avgGapDays));
              if (ctx.landlordName) params.set('ll', ctx.landlordName);
              if (ctx.property) params.set('pp', ctx.property);

              const trustUrl = `${ORIGIN}/trust/${stableCaseRef}?${params.toString()}`;

              const lhdnLine = lhdnVerified
                ? `✓ LHDN-verified ${MOCK_LHDN_RESULT.months} months previous tenancy`
                : '⊘ LHDN not verified — landlord judgment required';
              const contextLine = ctx.landlordName
                ? `For: ${ctx.landlordName}${ctx.property ? ` · ${ctx.property}` : ''}\n\n`
                : '';
              const modeLine = mode === 'anonymous'
                ? 'Anonymous Mode · Identity reveals tier-by-tier as deal progresses.'
                : 'Verified Mode · Tenant name shared.';
              const waMsg =
`Veri.ai Trust Card

${contextLine}Trust Score: ${trustScore} / 100
${lhdnLine}
${effectiveBillsCount}/3 utility bills · avg ${MOCK_SCORE.avgGapDays < 0 ? `${Math.abs(MOCK_SCORE.avgGapDays)} days BEFORE due` : `${MOCK_SCORE.avgGapDays} days AFTER due`}

View card: ${trustUrl}

— Veri.ai · Don't sign blind.
${modeLine}`;
              const waUrl = `https://wa.me/?text=${encodeURIComponent(waMsg)}`;
              return (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 rounded-xl text-[13px] font-bold text-white text-center transition active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    boxShadow: '0 4px 16px rgba(37,211,102,0.30)',
                    textDecoration: 'none',
                  }}>
                  {t.shareWhatsApp}
                </a>
              );
            })()}

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

          {/* "What next?" footer — clear exit options after score reveal.
              v3.4.27: dropped "thumb-zone" framing. Web pattern: the user can
              exit via browser back, the X close button, or these two buttons. */}
          <div className="pt-3 mt-2 grid grid-cols-2 gap-2" style={{ borderTop: '1px solid #f1f5f9' }}>
            <button
              onClick={resetForScreenAnother}
              className="py-2.5 rounded-xl text-[11.5px] font-semibold transition active:scale-[0.98]"
              style={{ background: '#fff', color: '#475569', border: '1px solid #e2e8f0' }}>
              {t.screenAnother}
            </button>
            <button
              onClick={onClose}
              className="py-2.5 rounded-xl text-[11.5px] font-semibold transition active:scale-[0.98]"
              style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
              {t.doneBackHome}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
