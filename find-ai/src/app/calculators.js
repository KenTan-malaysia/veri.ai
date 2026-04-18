'use client';

import { useState } from 'react';

// ===== SHARED — Banking-app components =====
const CloseBtn = ({ onClick }) => (
  <button onClick={onClick} className="w-10 h-10 flex items-center justify-center rounded-xl transition active:scale-90" style={{ background: '#f8fafc' }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
);

const ToolHeader = ({ icon, title, desc, onClose }) => (
  <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="text-[16px] font-bold" style={{ color: '#0f172a', letterSpacing: '-0.01em' }}>{title}</h3>
        <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>{desc}</p>
      </div>
    </div>
    <CloseBtn onClick={onClose} />
  </div>
);

const Modal = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}>
    <div className="bg-white w-full max-w-lg rounded-t-[24px] sm:rounded-[20px] px-6 pt-5 pb-6 max-h-[92vh] overflow-y-auto fade-in" style={{ boxShadow: '0 -8px 40px rgba(15,23,42,0.12)' }}>
      {/* Drag handle */}
      <div className="flex justify-center mb-3 sm:hidden">
        <div className="w-10 h-1 rounded-full" style={{ background: '#e2e8f0' }} />
      </div>
      {children}
    </div>
  </div>
);

const RMInput = ({ value, onChange, placeholder, label }) => (
  <div>
    <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{label}</label>
    <div className="flex items-center gap-2 rounded-xl px-4 py-3.5" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
      <span className="text-[13px] font-bold" style={{ color: '#94a3b8' }}>RM</span>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-transparent text-[16px] font-semibold focus:outline-none" style={{ color: '#0f172a' }} />
    </div>
  </div>
);

const ActionBtn = ({ onClick, disabled, label, color = '#0f172a' }) => (
  <button onClick={onClick} disabled={disabled}
    className="w-full py-4 rounded-xl text-[14px] font-bold text-white disabled:opacity-30 transition active:scale-[0.98]"
    style={{ background: color, boxShadow: `0 4px 16px ${color}40` }}>
    {label}
  </button>
);

// ===== LABELS =====
const L = {
  en: {
    tools: 'Property Tools',
    stampTitle: 'Stamp Duty Calculator', stampDesc: 'Tenancy agreement stamp duty',
    yieldTitle: 'Rental Yield Calculator', yieldDesc: 'Is your property worth it?',
    screenTitle: 'Tenant Screening', screenDesc: 'Check tenant risk before signing',
    healthTitle: 'Agreement Health Check', healthDesc: 'Is your agreement protecting you?',
    monthlyRent: 'Monthly Rent (RM)', leaseDuration: 'Lease Duration',
    years: ['1 year', '2 years', '3 years', '5 years'],
    stampResult: 'Stamp Duty Payable (SDSAS 2026)', stampExempt: 'Exempt — no stamp duty required',
    stampNote: 'Unstamped agreements cannot be used as evidence in court.',
    stampWho: 'Usually paid by tenant, but negotiable.',
    stampDeadline: 'Must stamp within 30 days of signing. Late = penalty up to 100%.',
    stampPerUnit: 'per RM250 unit of annual rent',
    sdsasNote: 'Self-assessment system (SDSAS) effective Jan 2026. RM2,400 exemption removed. You calculate and pay via MyTax.',
    oldDuty: 'Old Rules (Pre-2026)', dutyIncrease: 'Increase',
    wasExempt: 'This rental was previously EXEMPT (under RM2,400/yr). Under 2026 rules, stamp duty now applies.',
    vaultTitle: 'Photo Proof', vaultDesc: 'Protect yourself — snap, lock, done',
    vaultAddress: 'Property / Condo Name', vaultAddressHint: 'e.g. Lakefront Residence, Cyberjaya',
    vaultUnit: 'Unit Number', vaultType: 'What is this for?', vaultSelectType: 'Select one',
    vaultCheckIn: 'Tenant moving in', vaultCheckOut: 'Tenant moving out', vaultDamage: 'Recording damage', vaultGeneral: 'Other',
    vaultUpload: 'Add Photos', vaultUploadHint: 'Take photos or choose from gallery — we lock each one so it can\'t be disputed',
    vaultHashing: 'Locking your photos...', vaultPhotos: 'Your Photos', vaultHash: 'Protection',
    vaultGenerate: 'Create Proof Certificate', vaultVerified: 'LOCKED & PROTECTED',
    vaultCertId: 'Certificate No.', vaultDownload: 'Download Your Certificate',
    vaultLegalNote: 'This certificate proves your photos are original and untampered. It\'s accepted in Malaysian courts under the Evidence Act. Keep your original photos safe — don\'t edit or rename them.',
    annualRent: 'Annual Rent', purchasePrice: 'Purchase Price (RM)',
    monthlyExpenses: 'Monthly Expenses (RM)', expensesHint: 'Maintenance, insurance, assessment, quit rent',
    grossYield: 'Gross Yield', netYield: 'Net Yield',
    annualProfit: 'Annual Net Profit', monthlyProfit: 'Monthly Net Profit',
    verdict: 'Verdict',
    verdictGood: 'Good investment — above market average',
    verdictOk: 'Average — consider if appreciation potential exists',
    verdictWeak: 'Below average — review your rental pricing or expenses',
    calculate: 'Calculate',
    // Screening
    tenantSalary: 'Tenant Monthly Salary (RM)', rentAmount: 'Your Monthly Rent (RM)',
    jobType: 'Employment Type', occupants: 'Number of Occupants', bedrooms: 'Bedrooms in Unit',
    moveReason: 'Reason for Moving', hasGuarantor: 'Has Guarantor?',
    jobs: { permanent: 'Permanent', contract: 'Contract', selfEmployed: 'Self-Employed', unemployed: 'Unemployed/Student' },
    reasons: { leaseEnd: 'Lease ended', work: 'Closer to work', family: 'Family reasons', evicted: 'Evicted / Asked to leave', firstTime: 'First time renting' },
    yes: 'Yes', no: 'No', checkTenant: 'Screen Tenant',
    riskLevel: 'Risk Level', riskLow: 'LOW RISK', riskMed: 'MEDIUM RISK', riskHigh: 'HIGH RISK',
    redFlags: 'Red Flags', greenFlags: 'Green Flags', recommendation: 'Recommendation',
    affordability: 'Affordability Ratio',
    // Health check
    checkAgreement: 'Check Agreement', score: 'Agreement Score', missing: 'Missing Clauses', present: 'Present',
    strong: 'STRONG — Well protected', moderate: 'MODERATE — Some gaps to fix', weak: 'WEAK — Major gaps, high risk',
    clauses: [
      { id: 'latePay', q: 'Late payment penalty clause?' },
      { id: 'deposit', q: 'Security deposit amount specified (2+1)?' },
      { id: 'maintenance', q: 'Maintenance responsibility defined?' },
      { id: 'sublet', q: 'Subletting prohibition included?' },
      { id: 'earlyTermination', q: 'Early termination clause with notice period?' },
      { id: 'inventory', q: 'Check-in/check-out inventory checklist?' },
      { id: 'utility', q: 'Utility transfer & final bill clause?' },
      { id: 'stampDuty', q: 'Stamp duty responsibility stated?' },
      { id: 'renewal', q: 'Renewal terms defined?' },
      { id: 'dispute', q: 'Dispute resolution method stated?' },
    ],
    clauseFix: {
      latePay: 'Add: "Late payment charge of 10% p.a. on outstanding sum after 14 days"',
      deposit: 'Add: "Security deposit of 2 months rent + 0.5 month utility deposit"',
      maintenance: 'Add: "Tenant responsible for wear & tear items. Landlord responsible for structural & major systems"',
      sublet: 'Add: "Tenant shall not sublet, assign or part with possession without written consent"',
      earlyTermination: 'Add: "Either party may terminate with 2 months written notice + forfeiture of deposit"',
      inventory: 'Add: "Detailed inventory with photos to be signed by both parties at check-in and check-out"',
      utility: 'Add: "Tenant to transfer utilities to own name within 14 days. Final bills to be settled before deposit refund"',
      stampDuty: 'Add: "Stamp duty on this agreement shall be borne by the Tenant"',
      renewal: 'Add: "Tenant has first right of renewal with 2 months notice before expiry at revised terms"',
      dispute: 'Add: "Disputes to be referred to mediation before court proceedings"',
    },
    // Module C
    trustTitle: 'CN-MY Trust Link', trustDesc: 'Verify Chinese company before signing lease',
    usccLabel: '18-Digit USCC Code', usccHint: 'Unified Social Credit Code from business license',
    usccInvalid: 'Invalid USCC — must be 18 characters (letters + numbers)',
    companyName: 'Company Name (Chinese)', companyNameEn: 'Company Name (English)',
    paidInCapital: 'Paid-in Capital (RMB)', taxRating: 'Tax Credit Rating',
    taxRatings: { A: 'Grade A — Excellent', B: 'Grade B — Good', C: 'Grade C — Fair', D: 'Grade D — Poor' },
    yearsOp: 'Years in Operation', bizScope: 'Business Scope',
    bizScopes: { manufacturing: 'Manufacturing', trading: 'Trading', logistics: 'Logistics', tech: 'Technology', other: 'Other' },
    abnormalOps: 'On Abnormal Operations List?',
    courtRecords: 'Court/Legal Disputes?',
    generateReport: 'Generate Trust Report',
    trustGrade: 'Trust Grade', trustScore: 'Trust Score',
    trustA: 'GRADE A — Low Risk. Safe to proceed with standard terms.',
    trustB: 'GRADE B — Moderate. Proceed with additional safeguards (guarantor + extra deposit).',
    trustC: 'GRADE C — Elevated Risk. Require bank guarantee or parent company guarantee.',
    trustD: 'GRADE D — High Risk. Not recommended. If proceeding, require full prepayment.',
    riskFactors: 'Risk Factors', positiveFactors: 'Positive Factors',
    trustDisclaimer: 'Advisory report only. Not a credit guarantee. Verify all information independently before signing any agreement.',
    downloadReport: 'Download Trust Report',
    // Module D
    navTitle: 'Situation Navigator', navDesc: 'Step-by-step guide for property disputes',
    navPick: 'What situation are you facing?',
    navRentDefault: 'Rent Default', navRentDefaultDesc: 'Tenant hasn\'t paid rent',
    navDeposit: 'Deposit Dispute', navDepositDesc: 'Deposit not returned or unfair deductions',
    navEviction: 'Eviction Process', navEvictionDesc: 'Need to remove tenant legally',
    navTimeline: 'Timeline', navCost: 'Estimated Cost', navLaw: 'Legal Basis',
    navStep: 'Step', navAction: 'What to do', navWarning: 'Warning',
    navDocument: 'Document Template', navCopyDoc: 'Copy Template',
    navBack: 'Back to situations',
    // Module E — Can I Do This?
    bridgeTitle: 'Can I Do This?', bridgeDesc: 'Malaysia property compliance checker',
    bridgePick: 'What do you want to do in Malaysia?', bridgePickSub: 'Select your goal — we\'ll show everything you need',
    bridgeRent: 'Rent Property', bridgeBuy: 'Buy Property', bridgeOperate: 'Operate Business',
    bridgeRentHouse: 'Rent a House / Condo', bridgeRentHouseDesc: 'Residential tenancy as foreigner',
    bridgeRentOffice: 'Rent an Office / Shop', bridgeRentOfficeDesc: 'Commercial lease for business',
    bridgeRentFactory: 'Rent a Factory / Warehouse', bridgeRentFactoryDesc: 'Industrial lease for manufacturing',
    bridgeBuyHouse: 'Buy a House / Condo', bridgeBuyHouseDesc: 'Foreign ownership requirements',
    bridgeBuyLand: 'Buy Land', bridgeBuyLandDesc: 'Agricultural, development, vacant',
    bridgeOpenFnb: 'Open a Restaurant / F&B', bridgeOpenFnbDesc: 'Food business licensing',
    bridgeSetupFactory: 'Set Up a Factory', bridgeSetupFactoryDesc: 'Manufacturing operations',
    bridgeSpecify: 'Tell us more', bridgeSpecifySub: 'Different situations need different licenses',
    bridgeActivity: 'What will you do?', bridgeWhere: 'Where?', bridgeAgriLand: 'Is it on agricultural land?',
    bridgeForeignWorkers: 'Will you bring foreign workers?', bridgeCheckBtn: 'Check My Requirements',
    bridgeYes: 'Yes', bridgeNo: 'No', bridgeNotSure: 'Not Sure',
    bridgeVerdictYes: 'YES — You can do this', bridgeVerdictMaybe: 'CONDITIONALLY YES', bridgeVerdictNo: 'NOT ALLOWED',
    bridgeRequired: 'REQUIRED', bridgeRequiredSub: 'Must have before operating',
    bridgeRecommended: 'RECOMMENDED', bridgeRecommendedSub: 'Strongly advised',
    bridgeDept: 'Department', bridgeTimeline: 'Timeline', bridgeCost: 'Cost',
    bridgeTotalLicenses: 'Total licenses needed', bridgeTotalTime: 'Estimated total time',
    bridgeTotalCost: 'Estimated total cost', bridgeDownload: 'Download Full Checklist',
    bridgeAskAI: 'Ask Find.ai for Help', bridgeBack: 'Back',
    bridgeCNTrap: 'China Assumption Trap',
    bridgeNote: 'Advisory guide only. Requirements may vary by local authority. Consult a licensed advisor.',
    bridgeTimeline2: 'Typical Timeline',
    bridgeManufacturing: 'Manufacturing / Assembly', bridgeManufacturingDesc: 'Producing or assembling products',
    bridgeWarehouse: 'Warehouse / Storage', bridgeWarehouseDesc: 'Storing goods, logistics hub',
    bridgeChemical: 'Chemical / Hazardous', bridgeChemicalDesc: 'Working with chemicals',
    bridgeFoodProcessing: 'Food Processing', bridgeFoodProcessingDesc: 'Food manufacturing or packaging',
  },
  bm: {
    tools: 'Alat Hartanah',
    stampTitle: 'Kalkulator Duti Setem', stampDesc: 'Duti setem perjanjian sewa',
    yieldTitle: 'Kalkulator Pulangan Sewa', yieldDesc: 'Adakah hartanah anda berbaloi?',
    screenTitle: 'Saringan Penyewa', screenDesc: 'Semak risiko penyewa sebelum tandatangan',
    healthTitle: 'Semakan Perjanjian', healthDesc: 'Adakah perjanjian anda melindungi anda?',
    monthlyRent: 'Sewa Bulanan (RM)', leaseDuration: 'Tempoh Sewa',
    years: ['1 tahun', '2 tahun', '3 tahun', '5 tahun'],
    stampResult: 'Duti Setem Perlu Dibayar (SDSAS 2026)', stampExempt: 'Dikecualikan — tiada duti setem',
    stampNote: 'Perjanjian tanpa setem tidak boleh digunakan di mahkamah.',
    stampWho: 'Biasanya dibayar oleh penyewa, tetapi boleh dirunding.',
    stampDeadline: 'Mesti setem dalam 30 hari selepas tandatangan. Lewat = penalti sehingga 100%.',
    stampPerUnit: 'setiap unit RM250 sewa tahunan',
    sdsasNote: 'Sistem taksiran sendiri (SDSAS) berkuat kuasa Jan 2026. Pengecualian RM2,400 dimansuhkan. Anda kira dan bayar melalui MyTax.',
    oldDuty: 'Kadar Lama (Sebelum 2026)', dutyIncrease: 'Kenaikan',
    wasExempt: 'Sewa ini sebelum ini DIKECUALIKAN (bawah RM2,400/thn). Di bawah peraturan 2026, duti setem kini dikenakan.',
    vaultTitle: 'Bukti Foto', vaultDesc: 'Lindungi diri — tangkap, kunci, siap',
    vaultAddress: 'Nama Hartanah / Kondo', vaultAddressHint: 'cth. Lakefront Residence, Cyberjaya',
    vaultUnit: 'Nombor Unit', vaultType: 'Untuk apa ini?', vaultSelectType: 'Pilih satu',
    vaultCheckIn: 'Penyewa masuk', vaultCheckOut: 'Penyewa keluar', vaultDamage: 'Rakam kerosakan', vaultGeneral: 'Lain-lain',
    vaultUpload: 'Tambah Gambar', vaultUploadHint: 'Ambil gambar atau pilih dari galeri — kami kunci setiap satu supaya tak boleh dipertikaikan',
    vaultHashing: 'Mengunci gambar anda...', vaultPhotos: 'Gambar Anda', vaultHash: 'Perlindungan',
    vaultGenerate: 'Cipta Sijil Bukti', vaultVerified: 'DIKUNCI & DILINDUNGI',
    vaultCertId: 'No. Sijil', vaultDownload: 'Muat Turun Sijil Anda',
    vaultLegalNote: 'Sijil ini membuktikan gambar anda asli dan tidak diubah. Ia diterima di mahkamah Malaysia di bawah Akta Keterangan. Simpan gambar asal — jangan edit atau tukar nama.',
    annualRent: 'Sewa Tahunan', purchasePrice: 'Harga Belian (RM)',
    monthlyExpenses: 'Perbelanjaan Bulanan (RM)', expensesHint: 'Penyelenggaraan, insurans, cukai taksiran',
    grossYield: 'Pulangan Kasar', netYield: 'Pulangan Bersih',
    annualProfit: 'Untung Tahunan', monthlyProfit: 'Untung Bulanan',
    verdict: 'Keputusan',
    verdictGood: 'Pelaburan baik — melebihi purata pasaran',
    verdictOk: 'Sederhana — pertimbangkan potensi kenaikan nilai',
    verdictWeak: 'Di bawah purata — semak harga sewa atau perbelanjaan',
    calculate: 'Kira',
    tenantSalary: 'Gaji Bulanan Penyewa (RM)', rentAmount: 'Sewa Bulanan (RM)',
    jobType: 'Jenis Pekerjaan', occupants: 'Bilangan Penghuni', bedrooms: 'Bilik Tidur',
    moveReason: 'Sebab Pindah', hasGuarantor: 'Ada Penjamin?',
    jobs: { permanent: 'Tetap', contract: 'Kontrak', selfEmployed: 'Sendiri', unemployed: 'Menganggur/Pelajar' },
    reasons: { leaseEnd: 'Sewa tamat', work: 'Dekat tempat kerja', family: 'Sebab keluarga', evicted: 'Diusir', firstTime: 'Pertama kali sewa' },
    yes: 'Ya', no: 'Tidak', checkTenant: 'Saring Penyewa',
    riskLevel: 'Tahap Risiko', riskLow: 'RENDAH', riskMed: 'SEDERHANA', riskHigh: 'TINGGI',
    redFlags: 'Amaran', greenFlags: 'Positif', recommendation: 'Cadangan',
    affordability: 'Nisbah Kemampuan',
    checkAgreement: 'Semak Perjanjian', score: 'Skor Perjanjian', missing: 'Klausa Tiada', present: 'Ada',
    strong: 'KUAT — Dilindungi dengan baik', moderate: 'SEDERHANA — Ada jurang perlu diperbaiki', weak: 'LEMAH — Jurang besar, risiko tinggi',
    clauses: [
      { id: 'latePay', q: 'Klausa denda bayaran lewat?' },
      { id: 'deposit', q: 'Jumlah deposit dinyatakan (2+1)?' },
      { id: 'maintenance', q: 'Tanggungjawab penyelenggaraan dinyatakan?' },
      { id: 'sublet', q: 'Larangan sewa kecil?' },
      { id: 'earlyTermination', q: 'Klausa penamatan awal?' },
      { id: 'inventory', q: 'Senarai semak inventori masuk/keluar?' },
      { id: 'utility', q: 'Klausa pemindahan utiliti & bil akhir?' },
      { id: 'stampDuty', q: 'Tanggungjawab duti setem dinyatakan?' },
      { id: 'renewal', q: 'Terma pembaharuan dinyatakan?' },
      { id: 'dispute', q: 'Kaedah penyelesaian pertikaian?' },
    ],
    clauseFix: {
      latePay: 'Tambah: "Caj lewat 10% setahun atas baki tertunggak selepas 14 hari"',
      deposit: 'Tambah: "Deposit keselamatan 2 bulan sewa + 0.5 bulan deposit utiliti"',
      maintenance: 'Tambah: "Penyewa bertanggungjawab atas haus & lusuh. Tuan rumah bertanggungjawab atas struktur"',
      sublet: 'Tambah: "Penyewa tidak boleh menyewa kecil tanpa kebenaran bertulis"',
      earlyTermination: 'Tambah: "Mana-mana pihak boleh menamatkan dengan notis 2 bulan bertulis"',
      inventory: 'Tambah: "Inventori terperinci dengan gambar ditandatangani kedua-dua pihak"',
      utility: 'Tambah: "Penyewa perlu tukar nama utiliti dalam 14 hari"',
      stampDuty: 'Tambah: "Duti setem ditanggung oleh Penyewa"',
      renewal: 'Tambah: "Penyewa mempunyai hak pembaharuan pertama dengan notis 2 bulan"',
      dispute: 'Tambah: "Pertikaian dirujuk kepada mediasi sebelum mahkamah"',
    },
    trustTitle: 'Pautan Kepercayaan CN-MY', trustDesc: 'Sahkan syarikat China sebelum tandatangan sewa',
    usccLabel: 'Kod USCC 18 Digit', usccHint: 'Kod Kredit Sosial Bersepadu dari lesen perniagaan',
    usccInvalid: 'USCC tidak sah — mesti 18 aksara (huruf + nombor)',
    companyName: 'Nama Syarikat (中文)', companyNameEn: 'Nama Syarikat (English)',
    paidInCapital: 'Modal Berbayar (RMB)', taxRating: 'Penarafan Kredit Cukai',
    taxRatings: { A: 'Gred A — Cemerlang', B: 'Gred B — Baik', C: 'Gred C — Sederhana', D: 'Gred D — Lemah' },
    yearsOp: 'Tahun Beroperasi', bizScope: 'Skop Perniagaan',
    bizScopes: { manufacturing: 'Pembuatan', trading: 'Perdagangan', logistics: 'Logistik', tech: 'Teknologi', other: 'Lain-lain' },
    abnormalOps: 'Dalam Senarai Operasi Tidak Normal?',
    courtRecords: 'Rekod Mahkamah/Pertikaian?',
    generateReport: 'Jana Laporan Kepercayaan',
    trustGrade: 'Gred Kepercayaan', trustScore: 'Skor Kepercayaan',
    trustA: 'GRED A — Risiko Rendah. Selamat diteruskan.',
    trustB: 'GRED B — Sederhana. Teruskan dengan penjamin + deposit tambahan.',
    trustC: 'GRED C — Risiko Tinggi. Minta jaminan bank.',
    trustD: 'GRED D — Sangat Berisiko. Tidak digalakkan.',
    riskFactors: 'Faktor Risiko', positiveFactors: 'Faktor Positif',
    trustDisclaimer: 'Laporan nasihat sahaja. Bukan jaminan kredit. Sahkan semua maklumat secara bebas.',
    downloadReport: 'Muat Turun Laporan',
    navTitle: 'Navigator Situasi', navDesc: 'Panduan langkah demi langkah untuk pertikaian',
    navPick: 'Apa situasi anda?',
    navRentDefault: 'Sewa Tertunggak', navRentDefaultDesc: 'Penyewa tak bayar sewa',
    navDeposit: 'Pertikaian Deposit', navDepositDesc: 'Deposit tak dipulangkan',
    navEviction: 'Proses Pengusiran', navEvictionDesc: 'Perlu usir penyewa secara sah',
    navTimeline: 'Garis Masa', navCost: 'Anggaran Kos', navLaw: 'Asas Undang-undang',
    navStep: 'Langkah', navAction: 'Apa perlu buat', navWarning: 'Amaran',
    navDocument: 'Templat Dokumen', navCopyDoc: 'Salin Templat',
    navBack: 'Kembali ke situasi',
    // Module E — Boleh Saya Buat Ini?
    bridgeTitle: 'Boleh Buat Ini?', bridgeDesc: 'Semakan pematuhan hartanah Malaysia',
    bridgePick: 'Apa yang anda mahu buat di Malaysia?', bridgePickSub: 'Pilih matlamat anda — kami tunjukkan semua yang perlu',
    bridgeRent: 'Sewa Hartanah', bridgeBuy: 'Beli Hartanah', bridgeOperate: 'Operasi Perniagaan',
    bridgeRentHouse: 'Sewa Rumah / Kondo', bridgeRentHouseDesc: 'Sewaan kediaman sebagai warga asing',
    bridgeRentOffice: 'Sewa Pejabat / Kedai', bridgeRentOfficeDesc: 'Sewa komersial untuk perniagaan',
    bridgeRentFactory: 'Sewa Kilang / Gudang', bridgeRentFactoryDesc: 'Sewa perindustrian untuk pembuatan',
    bridgeBuyHouse: 'Beli Rumah / Kondo', bridgeBuyHouseDesc: 'Syarat pemilikan asing',
    bridgeBuyLand: 'Beli Tanah', bridgeBuyLandDesc: 'Pertanian, pembangunan, kosong',
    bridgeOpenFnb: 'Buka Restoran / F&B', bridgeOpenFnbDesc: 'Pelesenan perniagaan makanan',
    bridgeSetupFactory: 'Tubuhkan Kilang', bridgeSetupFactoryDesc: 'Operasi pembuatan',
    bridgeSpecify: 'Beritahu kami lagi', bridgeSpecifySub: 'Situasi berbeza perlukan lesen berbeza',
    bridgeActivity: 'Apa yang akan anda buat?', bridgeWhere: 'Di mana?', bridgeAgriLand: 'Adakah di atas tanah pertanian?',
    bridgeForeignWorkers: 'Akan bawa pekerja asing?', bridgeCheckBtn: 'Semak Keperluan Saya',
    bridgeYes: 'Ya', bridgeNo: 'Tidak', bridgeNotSure: 'Tidak Pasti',
    bridgeVerdictYes: 'YA — Anda boleh buat ini', bridgeVerdictMaybe: 'YA BERSYARAT', bridgeVerdictNo: 'TIDAK DIBENARKAN',
    bridgeRequired: 'WAJIB', bridgeRequiredSub: 'Mesti ada sebelum beroperasi',
    bridgeRecommended: 'DISYORKAN', bridgeRecommendedSub: 'Sangat digalakkan',
    bridgeDept: 'Jabatan', bridgeTimeline: 'Garis Masa', bridgeCost: 'Kos',
    bridgeTotalLicenses: 'Jumlah lesen diperlukan', bridgeTotalTime: 'Anggaran jumlah masa',
    bridgeTotalCost: 'Anggaran jumlah kos', bridgeDownload: 'Muat Turun Senarai Penuh',
    bridgeAskAI: 'Tanya Find.ai', bridgeBack: 'Kembali',
    bridgeCNTrap: 'Perangkap Andaian China',
    bridgeNote: 'Panduan nasihat sahaja. Keperluan mungkin berbeza mengikut pihak berkuasa tempatan.',
    bridgeTimeline2: 'Garis Masa Biasa',
    bridgeManufacturing: 'Pembuatan / Pemasangan', bridgeManufacturingDesc: 'Menghasilkan atau memasang produk',
    bridgeWarehouse: 'Gudang / Penyimpanan', bridgeWarehouseDesc: 'Menyimpan barang, hab logistik',
    bridgeChemical: 'Kimia / Berbahaya', bridgeChemicalDesc: 'Bekerja dengan bahan kimia',
    bridgeFoodProcessing: 'Pemprosesan Makanan', bridgeFoodProcessingDesc: 'Pengilangan atau pembungkusan makanan',
  },
  zh: {
    tools: '房产工具',
    stampTitle: '印花税计算器', stampDesc: '租约印花税',
    yieldTitle: '租金回报计算器', yieldDesc: '您的房产值得投资吗？',
    screenTitle: '租客筛查', screenDesc: '签约前检查租客风险',
    healthTitle: '协议健康检查', healthDesc: '您的协议是否保护您？',
    monthlyRent: '月租金 (RM)', leaseDuration: '租约期限',
    years: ['1年', '2年', '3年', '5年'],
    stampResult: '应付印花税 (SDSAS 2026)', stampExempt: '豁免 — 无需缴纳印花税',
    stampNote: '未盖章的协议不能在法庭上作为证据。',
    stampWho: '通常由租客支付，但可协商。',
    stampDeadline: '签约后30天内必须盖章。逾期 = 最高100%罚款。',
    stampPerUnit: '每RM250年租单位',
    sdsasNote: '自我评估系统（SDSAS）2026年1月生效。RM2,400豁免已取消。您需通过MyTax自行计算和缴付。',
    oldDuty: '旧规则（2026年前）', dutyIncrease: '涨幅',
    wasExempt: '此租金之前获豁免（低于RM2,400/年）。2026年新规下，现需缴纳印花税。',
    vaultTitle: '照片证明', vaultDesc: '保护自己 — 拍照、锁定、完成',
    vaultAddress: '房产/公寓名称', vaultAddressHint: '例：Lakefront Residence, Cyberjaya',
    vaultUnit: '单位号', vaultType: '这是用于什么？', vaultSelectType: '选择一个',
    vaultCheckIn: '租客入住', vaultCheckOut: '租客退房', vaultDamage: '记录损坏', vaultGeneral: '其他',
    vaultUpload: '添加照片', vaultUploadHint: '拍照或从相册选择 — 我们会锁定每张照片，确保无法被争议',
    vaultHashing: '正在锁定您的照片...', vaultPhotos: '您的照片', vaultHash: '保护方式',
    vaultGenerate: '创建证明证书', vaultVerified: '已锁定和保护',
    vaultCertId: '证书编号', vaultDownload: '下载您的证书',
    vaultLegalNote: '本证书证明您的照片为原始照片且未被篡改。它依据马来西亚证据法在法庭上被接受。请妥善保管原始照片 — 不要编辑或重命名。',
    annualRent: '年租金', purchasePrice: '购买价格 (RM)',
    monthlyExpenses: '每月支出 (RM)', expensesHint: '管理费、保险、门牌税、地税',
    grossYield: '毛回报率', netYield: '净回报率',
    annualProfit: '年净利润', monthlyProfit: '月净利润',
    verdict: '评估',
    verdictGood: '好投资 — 高于市场平均',
    verdictOk: '一般 — 考虑升值潜力',
    verdictWeak: '低于平均 — 检查租金或支出',
    calculate: '计算',
    tenantSalary: '租客月薪 (RM)', rentAmount: '月租金 (RM)',
    jobType: '就业类型', occupants: '住户人数', bedrooms: '卧室数量',
    moveReason: '搬迁原因', hasGuarantor: '有担保人？',
    jobs: { permanent: '全职', contract: '合同', selfEmployed: '自雇', unemployed: '无业/学生' },
    reasons: { leaseEnd: '租约到期', work: '靠近工作', family: '家庭原因', evicted: '被驱逐', firstTime: '首次租房' },
    yes: '是', no: '否', checkTenant: '筛查租客',
    riskLevel: '风险等级', riskLow: '低风险', riskMed: '中等风险', riskHigh: '高风险',
    redFlags: '警告', greenFlags: '优点', recommendation: '建议',
    affordability: '负担能力比',
    checkAgreement: '检查协议', score: '协议评分', missing: '缺失条款', present: '已有',
    strong: '强 — 保护良好', moderate: '中等 — 需要修补', weak: '弱 — 重大漏洞，高风险',
    clauses: [
      { id: 'latePay', q: '逾期付款罚款条款？' },
      { id: 'deposit', q: '押金金额明确（2+1）？' },
      { id: 'maintenance', q: '维修责任明确？' },
      { id: 'sublet', q: '禁止转租条款？' },
      { id: 'earlyTermination', q: '提前终止条款？' },
      { id: 'inventory', q: '入住/退房清单？' },
      { id: 'utility', q: '水电转名及最终账单条款？' },
      { id: 'stampDuty', q: '印花税责任明确？' },
      { id: 'renewal', q: '续约条款？' },
      { id: 'dispute', q: '争议解决方式？' },
    ],
    clauseFix: {
      latePay: '添加："逾期14天后按年利率10%收取滞纳金"',
      deposit: '添加："押金为2个月租金 + 0.5个月水电押金"',
      maintenance: '添加："租客负责日常损耗，房东负责结构性维修"',
      sublet: '添加："未经书面同意，租客不得转租"',
      earlyTermination: '添加："任何一方可提前2个月书面通知终止"',
      inventory: '添加："双方签署附照片的详细清单"',
      utility: '添加："租客须在14天内将水电转至本人名下"',
      stampDuty: '添加："印花税由租客承担"',
      renewal: '添加："租客有优先续约权，需提前2个月通知"',
      dispute: '添加："争议先提交调解再诉诸法院"',
    },
    trustTitle: '中马信任链接', trustDesc: '签约前验证中国公司资质',
    usccLabel: '18位统一社会信用代码', usccHint: '营业执照上的统一社会信用代码',
    usccInvalid: '无效USCC — 必须为18位字符（字母+数字）',
    companyName: '公司名称（中文）', companyNameEn: '公司名称（英文）',
    paidInCapital: '实缴资本（人民币）', taxRating: '纳税信用等级',
    taxRatings: { A: 'A级 — 优秀', B: 'B级 — 良好', C: 'C级 — 一般', D: 'D级 — 较差' },
    yearsOp: '运营年限', bizScope: '经营范围',
    bizScopes: { manufacturing: '制造业', trading: '贸易', logistics: '物流', tech: '科技', other: '其他' },
    abnormalOps: '是否在经营异常名录？',
    courtRecords: '是否有法院/法律纠纷？',
    generateReport: '生成信任报告',
    trustGrade: '信任等级', trustScore: '信任分数',
    trustA: 'A级 — 低风险。可安全签约。',
    trustB: 'B级 — 中等风险。建议增加担保人和额外押金。',
    trustC: 'C级 — 较高风险。要求银行担保。',
    trustD: 'D级 — 高风险。不建议签约。',
    riskFactors: '风险因素', positiveFactors: '积极因素',
    trustDisclaimer: '仅供参考。非信用担保。签约前请独立核实所有信息。',
    downloadReport: '下载信任报告',
    navTitle: '情况导航', navDesc: '房产纠纷分步指南',
    navPick: '您面临什么情况？',
    navRentDefault: '租金拖欠', navRentDefaultDesc: '租客未缴租金',
    navDeposit: '押金纠纷', navDepositDesc: '押金未退还或不合理扣除',
    navEviction: '驱逐流程', navEvictionDesc: '需要合法驱逐租客',
    navTimeline: '时间线', navCost: '预估费用', navLaw: '法律依据',
    navStep: '步骤', navAction: '该怎么做', navWarning: '警告',
    navDocument: '文件模板', navCopyDoc: '复制模板',
    navBack: '返回情况列表',
    // Module E — 我能做这个吗？
    bridgeTitle: '我能做吗？', bridgeDesc: '马来西亚房产合规检查器',
    bridgePick: '您想在马来西亚做什么？', bridgePickSub: '选择您的目标 — 我们会展示您需要的一切',
    bridgeRent: '租赁房产', bridgeBuy: '购买房产', bridgeOperate: '经营业务',
    bridgeRentHouse: '租住宅/公寓', bridgeRentHouseDesc: '外国人住宅租赁',
    bridgeRentOffice: '租办公室/店铺', bridgeRentOfficeDesc: '商业租赁',
    bridgeRentFactory: '租工厂/仓库', bridgeRentFactoryDesc: '工业租赁用于制造',
    bridgeBuyHouse: '买住宅/公寓', bridgeBuyHouseDesc: '外国人购房要求',
    bridgeBuyLand: '买土地', bridgeBuyLandDesc: '农业、开发、空地',
    bridgeOpenFnb: '开餐厅/餐饮', bridgeOpenFnbDesc: '食品经营许可',
    bridgeSetupFactory: '建厂', bridgeSetupFactoryDesc: '制造业运营',
    bridgeSpecify: '告诉我们更多', bridgeSpecifySub: '不同情况需要不同许可证',
    bridgeActivity: '您要做什么？', bridgeWhere: '在哪里？', bridgeAgriLand: '是否在农业用地上？',
    bridgeForeignWorkers: '是否带外劳？', bridgeCheckBtn: '检查我的要求',
    bridgeYes: '是', bridgeNo: '否', bridgeNotSure: '不确定',
    bridgeVerdictYes: '可以 — 您能做这个', bridgeVerdictMaybe: '有条件可以', bridgeVerdictNo: '不允许',
    bridgeRequired: '必需', bridgeRequiredSub: '运营前必须具备',
    bridgeRecommended: '建议', bridgeRecommendedSub: '强烈建议',
    bridgeDept: '部门', bridgeTimeline: '时间线', bridgeCost: '费用',
    bridgeTotalLicenses: '所需许可证总数', bridgeTotalTime: '预计总时间',
    bridgeTotalCost: '预计总费用', bridgeDownload: '下载完整清单',
    bridgeAskAI: '咨询Find.ai', bridgeBack: '返回',
    bridgeCNTrap: '中国思维陷阱',
    bridgeNote: '仅供参考。要求可能因当地主管部门而异。请咨询持牌顾问。',
    bridgeTimeline2: '典型时间线',
    bridgeManufacturing: '制造/组装', bridgeManufacturingDesc: '生产或组装产品',
    bridgeWarehouse: '仓储', bridgeWarehouseDesc: '存储货物、物流中心',
    bridgeChemical: '化学/危险品', bridgeChemicalDesc: '处理化学品',
    bridgeFoodProcessing: '食品加工', bridgeFoodProcessingDesc: '食品制造或包装',
  },
};

// ===== STAMP DUTY (SDSAS 2026) =====
function StampDutyCalc({ lang, onClose }) {
  const t = L[lang];
  const [rent, setRent] = useState('');
  const [years, setYears] = useState(1);
  const [result, setResult] = useState(null);
  const yv = [1, 2, 3, 5];

  const calc = () => {
    const r = parseFloat(rent);
    if (!r || r <= 0) return;
    const annual = r * 12;

    // === SDSAS 2026 — No RM2,400 exemption, new rates ===
    const units = Math.ceil(annual / 250);
    const rate = years <= 1 ? 1 : years <= 3 ? 3 : years <= 5 ? 5 : 7;
    const grossDuty = units * rate;
    const duty = Math.max(grossDuty, grossDuty > 0 ? 10 : 0); // RM10 minimum

    // === Old rules (pre-2026) for comparison ===
    const oldExcess = Math.max(0, annual - 2400);
    const oldUnits = oldExcess > 0 ? Math.ceil(oldExcess / 250) : 0;
    const oldRate = years <= 1 ? 1 : years <= 3 ? 2 : 4;
    const oldDuty = oldUnits > 0 ? Math.max(oldUnits * oldRate, 10) : 0;

    setResult({ duty, annual, units, rate, oldDuty, increase: duty - oldDuty });
  };

  return (
    <Modal>
      <ToolHeader icon="📄" title={t.stampTitle} desc={t.stampDesc} onClose={onClose} />
      <div className="space-y-5">
        <RMInput value={rent} onChange={(v) => { setRent(v); setResult(null); }} placeholder="2500" label={t.monthlyRent} />
        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{t.leaseDuration}</label>
          <div className="flex gap-2">
            {yv.map((y, i) => (
              <button key={y} onClick={() => { setYears(y); setResult(null); }}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold transition active:scale-95"
                style={years === y
                  ? { background: '#0f172a', color: '#fff', boxShadow: '0 2px 8px rgba(15,23,42,0.2)' }
                  : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }
                }>
                {t.years[i]}
              </button>
            ))}
          </div>
        </div>
        <ActionBtn onClick={calc} disabled={!rent} label={t.calculate} />
      </div>
      {result && (
        <div className="mt-6 space-y-3 fade-in">
          {/* Main duty result */}
          <div className="p-5 rounded-2xl" style={{ background: '#0f172a' }}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.stampResult}</div>
            <div className="text-3xl font-bold text-white">RM {result.duty.toFixed(2)}</div>
            <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{t.annualRent}: RM {result.annual.toLocaleString()}</span>
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{result.units} × RM{result.rate}</span>
            </div>
          </div>

          {/* SDSAS 2026 badge */}
          <div className="p-3.5 rounded-xl flex items-start gap-3" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
            <span className="text-[9px] px-2 py-1 rounded-md font-bold flex-shrink-0" style={{ background: '#0f172a', color: '#fff' }}>SDSAS 2026</span>
            <p className="text-[11px] leading-relaxed" style={{ color: '#64748b' }}>{t.sdsasNote}</p>
          </div>

          {/* Old vs New comparison */}
          {result.oldDuty > 0 && (
            <div className="p-3.5 rounded-xl flex justify-between items-center" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{t.oldDuty}</div>
                <div className="text-[14px] font-semibold line-through" style={{ color: '#94a3b8' }}>RM {result.oldDuty.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{t.dutyIncrease}</div>
                <div className="text-[14px] font-bold" style={{ color: '#dc2626' }}>+RM {result.increase.toFixed(2)}</div>
              </div>
            </div>
          )}
          {result.oldDuty === 0 && (
            <div className="p-3.5 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
              <p className="text-[11px] font-medium" style={{ color: '#991b1b' }}>{t.wasExempt}</p>
            </div>
          )}

          {/* Warnings */}
          <div className="pt-1 space-y-2">
            <p className="text-[11px]" style={{ color: '#94a3b8' }}>⚠️ {t.stampNote}</p>
            <p className="text-[11px]" style={{ color: '#94a3b8' }}>💡 {t.stampWho}</p>
            <p className="text-[11px]" style={{ color: '#94a3b8' }}>📅 {t.stampDeadline}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ===== RENTAL YIELD =====
function RentalYieldCalc({ lang, onClose }) {
  const t = L[lang];
  const [price, setPrice] = useState('');
  const [rent, setRent] = useState('');
  const [expenses, setExpenses] = useState('');
  const [result, setResult] = useState(null);

  const calc = () => {
    const p = parseFloat(price), r = parseFloat(rent), e = parseFloat(expenses) || 0;
    if (!p || !r) return;
    const ar = r * 12, ae = e * 12;
    setResult({ gross: (ar / p) * 100, net: ((ar - ae) / p) * 100, annualProfit: ar - ae, monthlyProfit: r - e });
  };

  const v = (n) => n >= 5 ? { text: t.verdictGood, color: '#16a34a', bg: '#f0fdf4' } : n >= 3 ? { text: t.verdictOk, color: '#d97706', bg: '#fffbeb' } : { text: t.verdictWeak, color: '#dc2626', bg: '#fef2f2' };

  return (
    <Modal>
      <ToolHeader icon="📊" title={t.yieldTitle} desc={t.yieldDesc} onClose={onClose} />
      <div className="space-y-5">
        <RMInput value={price} onChange={(val) => { setPrice(val); setResult(null); }} placeholder="500000" label={t.purchasePrice} />
        <RMInput value={rent} onChange={(val) => { setRent(val); setResult(null); }} placeholder="2500" label={t.monthlyRent} />
        <div>
          <RMInput value={expenses} onChange={(val) => { setExpenses(val); setResult(null); }} placeholder="350" label={t.monthlyExpenses} />
          <p className="text-[10px] mt-1.5 pl-1" style={{ color: '#cbd5e1' }}>{t.expensesHint}</p>
        </div>
        <ActionBtn onClick={calc} disabled={!price || !rent} label={t.calculate} />
      </div>
      {result && (
        <div className="mt-6 space-y-3 fade-in">
          {/* Hero result — net yield */}
          <div className="p-5 rounded-2xl" style={{ background: '#0f172a' }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.grossYield}</div>
                <div className="text-2xl font-bold text-white mt-1">{result.gross.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.netYield}</div>
                <div className="text-2xl font-bold mt-1" style={{ color: v(result.net).color === '#16a34a' ? '#4ade80' : v(result.net).color === '#d97706' ? '#fbbf24' : '#f87171' }}>{result.net.toFixed(2)}%</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
              <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{t.annualProfit}</div>
              <div className="text-[16px] font-bold mt-1" style={{ color: '#0f172a' }}>RM {result.annualProfit.toLocaleString()}</div>
            </div>
            <div className="p-3.5 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
              <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{t.monthlyProfit}</div>
              <div className="text-[16px] font-bold mt-1" style={{ color: '#0f172a' }}>RM {result.monthlyProfit.toLocaleString()}</div>
            </div>
          </div>
          <div className="p-3.5 rounded-xl" style={{ background: v(result.net).bg, border: `1px solid ${v(result.net).color}25` }}>
            <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>{t.verdict}</div>
            <div className="text-[13px] font-semibold" style={{ color: v(result.net).color }}>{v(result.net).text}</div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ===== TENANT SCREENING =====
function TenantScreen({ lang, onClose }) {
  const t = L[lang];
  const [salary, setSalary] = useState('');
  const [rent, setRent] = useState('');
  const [job, setJob] = useState('');
  const [occupants, setOccupants] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [reason, setReason] = useState('');
  const [guarantor, setGuarantor] = useState(null);
  const [result, setResult] = useState(null);

  const screen = () => {
    const s = parseFloat(salary), r = parseFloat(rent), occ = parseInt(occupants) || 1, bed = parseInt(bedrooms) || 1;
    if (!s || !r) return;

    const ratio = s / r;
    let score = 0, reds = [], greens = [];

    // Affordability (40 pts)
    if (ratio >= 4) { score += 40; greens.push(lang === 'en' ? `Salary is ${ratio.toFixed(1)}x rent — very comfortable` : lang === 'bm' ? `Gaji ${ratio.toFixed(1)}x sewa — sangat selesa` : `薪资是租金的${ratio.toFixed(1)}倍 — 非常宽裕`); }
    else if (ratio >= 3) { score += 25; greens.push(lang === 'en' ? `Salary is ${ratio.toFixed(1)}x rent — acceptable` : lang === 'bm' ? `Gaji ${ratio.toFixed(1)}x sewa — boleh diterima` : `薪资是租金的${ratio.toFixed(1)}倍 — 可接受`); }
    else if (ratio >= 2) { score += 10; reds.push(lang === 'en' ? `Salary only ${ratio.toFixed(1)}x rent — tight budget, high default risk` : lang === 'bm' ? `Gaji hanya ${ratio.toFixed(1)}x sewa — bajet ketat` : `薪资仅为租金的${ratio.toFixed(1)}倍 — 预算紧张`); }
    else { reds.push(lang === 'en' ? `Salary below 2x rent — very high default risk` : lang === 'bm' ? `Gaji bawah 2x sewa — risiko sangat tinggi` : `薪资低于租金2倍 — 违约风险极高`); }

    // Job (20 pts)
    if (job === 'permanent') { score += 20; greens.push(lang === 'en' ? 'Permanent employment — stable income' : lang === 'bm' ? 'Pekerjaan tetap — pendapatan stabil' : '全职工作 — 收入稳定'); }
    else if (job === 'contract') { score += 12; }
    else if (job === 'selfEmployed') { score += 8; reds.push(lang === 'en' ? 'Self-employed — income may fluctuate, request bank statements' : lang === 'bm' ? 'Bekerja sendiri — minta penyata bank' : '自雇 — 收入可能波动，要求银行对账单'); }
    else if (job === 'unemployed') { reds.push(lang === 'en' ? 'No employment — who pays the rent?' : lang === 'bm' ? 'Tiada pekerjaan — siapa bayar sewa?' : '无业 — 谁付租金？'); }

    // Occupants (15 pts)
    if (occ <= bed * 2) { score += 15; }
    else { reds.push(lang === 'en' ? `${occ} people in ${bed} bedrooms — potential overcrowding` : lang === 'bm' ? `${occ} orang dalam ${bed} bilik — mungkin sesak` : `${bed}间卧室住${occ}人 — 可能过于拥挤`); }

    // Reason (15 pts)
    if (reason === 'evicted') { reds.push(lang === 'en' ? 'Was evicted — ask why and verify with previous landlord' : lang === 'bm' ? 'Pernah diusir — tanya sebab dan sahkan dengan tuan rumah lama' : '曾被驱逐 — 询问原因并联系前房东核实'); }
    else if (reason === 'leaseEnd' || reason === 'work' || reason === 'family') { score += 15; }
    else if (reason === 'firstTime') { score += 10; }

    // Guarantor (10 pts)
    if (guarantor) { score += 10; greens.push(lang === 'en' ? 'Has guarantor — added security' : lang === 'bm' ? 'Ada penjamin — keselamatan tambahan' : '有担保人 — 额外保障'); }
    else if (ratio < 3) { reds.push(lang === 'en' ? 'No guarantor with tight budget — request one' : lang === 'bm' ? 'Tiada penjamin dengan bajet ketat — minta seorang' : '预算紧张且无担保人 — 应要求提供'); }

    const level = score >= 70 ? 'low' : score >= 40 ? 'med' : 'high';
    let rec;
    if (level === 'low') rec = lang === 'en' ? 'Safe to proceed. Standard agreement is sufficient.' : lang === 'bm' ? 'Selamat diteruskan. Perjanjian standard mencukupi.' : '可以签约。标准协议即可。';
    else if (level === 'med') rec = lang === 'en' ? 'Proceed with caution. Request guarantor and extra deposit if possible.' : lang === 'bm' ? 'Teruskan dengan berhati-hati. Minta penjamin dan deposit tambahan.' : '谨慎进行。尽可能要求担保人和额外押金。';
    else rec = lang === 'en' ? 'High risk — consider rejecting or require guarantor + 3 months deposit + post-dated cheques.' : lang === 'bm' ? 'Risiko tinggi — pertimbangkan menolak atau minta penjamin + 3 bulan deposit.' : '高风险 — 考虑拒绝，或要求担保人 + 3个月押金 + 预签支票。';

    setResult({ score, level, reds, greens, ratio, rec });
  };

  const levelStyle = { low: { text: t.riskLow, color: '#16a34a', bg: '#f0fdf4' }, med: { text: t.riskMed, color: '#d97706', bg: '#fffbeb' }, high: { text: t.riskHigh, color: '#dc2626', bg: '#fef2f2' } };

  return (
    <Modal>
      <ToolHeader icon="🔍" title={t.screenTitle} desc={t.screenDesc} onClose={onClose} />
      <div className="space-y-5">
        <RMInput value={salary} onChange={(v) => { setSalary(v); setResult(null); }} placeholder="5000" label={t.tenantSalary} />
        <RMInput value={rent} onChange={(v) => { setRent(v); setResult(null); }} placeholder="2500" label={t.rentAmount} />

        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{t.jobType}</label>
          <div className="grid grid-cols-2 gap-2">
            {['permanent', 'contract', 'selfEmployed', 'unemployed'].map(j => (
              <button key={j} onClick={() => { setJob(j); setResult(null); }}
                className="py-3 rounded-xl text-[12px] font-semibold transition active:scale-95"
                style={job === j
                  ? { background: '#0f172a', color: '#fff', boxShadow: '0 2px 8px rgba(15,23,42,0.2)' }
                  : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }
                }>
                {t.jobs[j]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{t.occupants}</label>
            <input type="number" value={occupants} onChange={(e) => { setOccupants(e.target.value); setResult(null); }} placeholder="2"
              className="w-full py-3 px-4 rounded-xl text-[14px] font-medium focus:outline-none"
              style={{ background: '#f8fafc', border: '1px solid #edf0f4', color: '#0f172a' }} />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{t.bedrooms}</label>
            <input type="number" value={bedrooms} onChange={(e) => { setBedrooms(e.target.value); setResult(null); }} placeholder="3"
              className="w-full py-3 px-4 rounded-xl text-[14px] font-medium focus:outline-none"
              style={{ background: '#f8fafc', border: '1px solid #edf0f4', color: '#0f172a' }} />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{t.moveReason}</label>
          <div className="flex flex-wrap gap-2">
            {['leaseEnd', 'work', 'family', 'evicted', 'firstTime'].map(r => (
              <button key={r} onClick={() => { setReason(r); setResult(null); }}
                className="px-3.5 py-2 rounded-xl text-[11px] font-semibold transition active:scale-95"
                style={reason === r
                  ? { background: '#0f172a', color: '#fff' }
                  : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }
                }>
                {t.reasons[r]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{t.hasGuarantor}</label>
          <div className="flex gap-2">
            <button onClick={() => { setGuarantor(true); setResult(null); }}
              className="flex-1 py-3 rounded-xl text-[13px] font-semibold transition active:scale-95"
              style={guarantor === true
                ? { background: '#0f172a', color: '#fff' }
                : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }
              }>{t.yes}</button>
            <button onClick={() => { setGuarantor(false); setResult(null); }}
              className="flex-1 py-3 rounded-xl text-[13px] font-semibold transition active:scale-95"
              style={guarantor === false
                ? { background: '#0f172a', color: '#fff' }
                : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }
              }>{t.no}</button>
          </div>
        </div>

        <ActionBtn onClick={screen} disabled={!salary || !rent || !job} label={t.checkTenant} />
      </div>

      {result && (
        <div className="mt-6 space-y-3 fade-in">
          <div className="p-5 rounded-2xl text-center" style={{ background: '#0f172a' }}>
            <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.riskLevel}</div>
            <div className="text-xl font-bold" style={{ color: levelStyle[result.level].color === '#16a34a' ? '#4ade80' : levelStyle[result.level].color === '#d97706' ? '#fbbf24' : '#f87171' }}>{levelStyle[result.level].text}</div>
            <div className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{t.affordability}: {result.ratio.toFixed(1)}x</div>
            <div className="w-full rounded-full h-1.5 mt-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-1.5 rounded-full transition-all" style={{ width: `${result.score}%`, background: levelStyle[result.level].color === '#16a34a' ? '#4ade80' : levelStyle[result.level].color === '#d97706' ? '#fbbf24' : '#f87171' }} />
            </div>
            <div className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{result.score}/100</div>
          </div>

          {result.reds.length > 0 && (
            <div className="p-3 rounded-[12px] bg-red-50">
              <div className="text-[11px] font-bold text-red-700 mb-2">{t.redFlags}</div>
              {result.reds.map((r, i) => <p key={i} className="text-[12px] text-red-800 mb-1">• {r}</p>)}
            </div>
          )}
          {result.greens.length > 0 && (
            <div className="p-3 rounded-[12px] bg-green-50">
              <div className="text-[11px] font-bold text-green-700 mb-2">{t.greenFlags}</div>
              {result.greens.map((g, i) => <p key={i} className="text-[12px] text-green-800 mb-1">• {g}</p>)}
            </div>
          )}

          <div className="p-3 rounded-[12px] border border-indigo-100 bg-indigo-50">
            <div className="text-[11px] font-bold text-indigo-700 mb-1">{t.recommendation}</div>
            <p className="text-[12px] text-indigo-900">{result.rec}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ===== AGREEMENT HEALTH CHECK =====
function AgreementHealth({ lang, onClose }) {
  const t = L[lang];
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const toggle = (id) => {
    setAnswers(prev => ({ ...prev, [id]: !prev[id] }));
    setResult(null);
  };

  const check = () => {
    const total = t.clauses.length;
    const present = t.clauses.filter(c => answers[c.id]).length;
    const missingClauses = t.clauses.filter(c => !answers[c.id]);
    const pct = Math.round((present / total) * 100);
    const level = pct >= 80 ? 'strong' : pct >= 50 ? 'moderate' : 'weak';
    setResult({ present, total, pct, level, missingClauses });
  };

  const levelStyle = { strong: { color: '#16a34a', bg: '#f0fdf4' }, moderate: { color: '#d97706', bg: '#fffbeb' }, weak: { color: '#dc2626', bg: '#fef2f2' } };

  return (
    <Modal>
      <ToolHeader icon="📋" title={t.healthTitle} desc={t.healthDesc} onClose={onClose} />

      <div className="space-y-2 mb-5">
        {t.clauses.map(c => (
          <button key={c.id} onClick={() => toggle(c.id)}
            className="w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-xl transition active:scale-[0.98]"
            style={answers[c.id]
              ? { background: '#f0fdf4', border: '1px solid #bbf7d0' }
              : { background: '#f8fafc', border: '1px solid #edf0f4' }
            }>
            <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
              style={answers[c.id] ? { background: '#0f172a' } : { background: '#e2e8f0' }}>
              {answers[c.id] && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
            </div>
            <span className="text-[13px] font-medium" style={{ color: answers[c.id] ? '#0f172a' : '#64748b' }}>{c.q}</span>
          </button>
        ))}
      </div>

      <ActionBtn onClick={check} label={t.checkAgreement} />

      {result && (
        <div className="mt-6 space-y-3 fade-in">
          <div className="p-5 rounded-2xl text-center" style={{ background: '#0f172a' }}>
            <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.score}</div>
            <div className="text-3xl font-bold text-white">{result.pct}%</div>
            <div className="text-[12px] font-medium mt-1" style={{ color: levelStyle[result.level].color === '#16a34a' ? '#4ade80' : levelStyle[result.level].color === '#d97706' ? '#fbbf24' : '#f87171' }}>{t[result.level]}</div>
            <div className="text-[11px] text-gray-400 mt-1">{result.present}/{result.total} {t.present}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="h-2 rounded-full transition-all" style={{ width: `${result.pct}%`, background: levelStyle[result.level].color }} />
            </div>
          </div>

          {result.missingClauses.length > 0 && (
            <div className="p-3 rounded-[12px] bg-red-50">
              <div className="text-[11px] font-bold text-red-700 mb-2">{t.missing}</div>
              {result.missingClauses.map(c => (
                <div key={c.id} className="mb-2 last:mb-0">
                  <p className="text-[12px] text-red-800 font-medium">• {c.q}</p>
                  <p className="text-[11px] text-red-600 pl-3 mt-0.5">{t.clauseFix[c.id]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

// ===== EVIDENCE VAULT =====
function EvidenceVault({ lang, onClose }) {
  const t = L[lang];
  const [photos, setPhotos] = useState([]);
  const [property, setProperty] = useState({ address: '', unit: '', type: '' });
  const [processing, setProcessing] = useState(false);
  const [certificate, setCertificate] = useState(null);

  const hashFile = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handlePhotos = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setProcessing(true);
    const newPhotos = [];
    for (const file of files) {
      const hash = await hashFile(file);
      const timestamp = new Date().toISOString();
      const preview = URL.createObjectURL(file);
      newPhotos.push({ name: file.name, size: file.size, hash, timestamp, preview, type: file.type });
    }
    setPhotos(prev => [...prev, ...newPhotos]);
    setProcessing(false);
  };

  const removePhoto = (idx) => {
    setPhotos(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[idx].preview);
      updated.splice(idx, 1);
      return updated;
    });
    setCertificate(null);
  };

  const generateCertificate = () => {
    if (!photos.length || !property.address) return;
    const certData = {
      id: 'CERT-' + Date.now().toString(36).toUpperCase(),
      generatedAt: new Date().toISOString(),
      property: { ...property },
      photos: photos.map(p => ({ name: p.name, hash: p.hash, timestamp: p.timestamp, size: p.size })),
      totalPhotos: photos.length,
    };
    setCertificate(certData);
  };

  const downloadCertificate = () => {
    if (!certificate) return;
    const d = certificate;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Section 90A Certificate - ${d.id}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;padding:40px;max-width:800px;margin:0 auto;color:#1a1a1a;line-height:1.6}
.header{text-align:center;border-bottom:3px double #333;padding-bottom:20px;margin-bottom:30px}
.header h1{font-size:22px;letter-spacing:1px;margin-bottom:5px}.header h2{font-size:14px;color:#555;font-weight:normal}
.badge{display:inline-block;padding:4px 16px;border:2px solid #b45309;color:#b45309;font-size:11px;font-weight:bold;letter-spacing:2px;margin-top:10px;border-radius:3px}
.section{margin-bottom:25px}.section h3{font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#555;border-bottom:1px solid #ddd;padding-bottom:5px;margin-bottom:10px}
.field{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}.field .label{color:#777}.field .value{font-weight:bold;text-align:right;max-width:60%;word-break:break-all}
.photo-table{width:100%;border-collapse:collapse;font-size:12px;margin-top:10px}
.photo-table th{background:#f5f5f5;padding:8px;text-align:left;border:1px solid #ddd;font-size:11px;text-transform:uppercase;letter-spacing:0.5px}
.photo-table td{padding:8px;border:1px solid #ddd;font-family:monospace;font-size:11px;word-break:break-all}
.legal{background:#fefce8;border:1px solid #fde68a;border-radius:6px;padding:16px;margin-top:30px;font-size:12px}
.legal h3{color:#92400e;margin-bottom:8px;font-size:13px}
.footer{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #ddd;font-size:11px;color:#999}
@media print{body{padding:20px}.legal{break-inside:avoid}}</style></head>
<body>
<div class="header"><h1>CERTIFICATE OF AUTHENTICITY</h1><h2>Digital Evidence — Property Inventory Record</h2><div class="badge">SECTION 90A COMPLIANT</div></div>
<div class="section"><h3>Certificate Details</h3>
<div class="field"><span class="label">Certificate ID</span><span class="value">${d.id}</span></div>
<div class="field"><span class="label">Generated</span><span class="value">${new Date(d.generatedAt).toLocaleString('en-MY')}</span></div>
<div class="field"><span class="label">Total Evidence Items</span><span class="value">${d.totalPhotos}</span></div>
<div class="field"><span class="label">Hash Algorithm</span><span class="value">SHA-256</span></div></div>
<div class="section"><h3>Property Information</h3>
<div class="field"><span class="label">Address</span><span class="value">${d.property.address}</span></div>
${d.property.unit ? `<div class="field"><span class="label">Unit</span><span class="value">${d.property.unit}</span></div>` : ''}
${d.property.type ? `<div class="field"><span class="label">Type</span><span class="value">${d.property.type}</span></div>` : ''}</div>
<div class="section"><h3>Evidence Registry</h3>
<table class="photo-table"><thead><tr><th>#</th><th>File Name</th><th>SHA-256 Hash</th><th>Timestamp (UTC)</th><th>Size</th></tr></thead>
<tbody>${d.photos.map((p, i) => `<tr><td>${i + 1}</td><td>${p.name}</td><td>${p.hash}</td><td>${p.timestamp}</td><td>${(p.size / 1024).toFixed(1)} KB</td></tr>`).join('')}</tbody></table></div>
<div class="legal"><h3>Legal Notice — Evidence Act 1950, Section 90A</h3>
<p>This certificate is produced in compliance with Section 90A of the Evidence Act 1950 (Malaysia). Each digital photograph listed above has been individually processed through the SHA-256 cryptographic hash algorithm at the time of upload. The hash value serves as a unique digital fingerprint — any modification to the original file, however minor, will produce a different hash value, thereby proving tampering.</p>
<p style="margin-top:8px">This document is intended to accompany the original digital photographs as supporting evidence of their authenticity and integrity in any legal proceedings, tribunal hearing, or dispute resolution process in Malaysia.</p>
<p style="margin-top:8px"><strong>Important:</strong> This certificate must be presented together with the original unmodified digital photographs. The party relying on this evidence should retain the original files in unmodified form.</p></div>
<div class="footer"><p>Generated by Find.ai — Malaysian PropTech Compliance Platform</p><p>This is a computer-generated document. No signature is required.</p></div>
</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Section90A-Certificate-${d.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal>
      <ToolHeader icon="🔒" title={t.vaultTitle} desc={t.vaultDesc} onClose={onClose} />

      {/* Property details */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t.vaultAddress}</label>
          <input type="text" value={property.address} onChange={(e) => { setProperty(p => ({ ...p, address: e.target.value })); setCertificate(null); }}
            placeholder={t.vaultAddressHint} className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-sky-400" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t.vaultUnit}</label>
            <input type="text" value={property.unit} onChange={(e) => { setProperty(p => ({ ...p, unit: e.target.value })); setCertificate(null); }}
              placeholder="A-12-03" className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-sky-400" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t.vaultType}</label>
            <select value={property.type} onChange={(e) => { setProperty(p => ({ ...p, type: e.target.value })); setCertificate(null); }}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-sky-400 bg-white">
              <option value="">{t.vaultSelectType}</option>
              <option value="Check-in">{t.vaultCheckIn}</option>
              <option value="Check-out">{t.vaultCheckOut}</option>
              <option value="Damage Report">{t.vaultDamage}</option>
              <option value="General">{t.vaultGeneral}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Photo upload */}
      <div className="mb-4">
        <label className="w-full flex flex-col items-center gap-2.5 py-8 rounded-[14px] border-2 border-dashed border-sky-200 bg-sky-50 cursor-pointer hover:bg-sky-100 active:bg-sky-150 transition">
          <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <span className="text-[14px] font-semibold text-sky-700">{t.vaultUpload}</span>
          <span className="text-[11px] text-sky-500 text-center px-4 leading-relaxed">{t.vaultUploadHint}</span>
          <input type="file" accept="image/*" multiple capture="environment" onChange={handlePhotos} className="hidden" />
        </label>
      </div>

      {processing && (
        <div className="text-center py-3">
          <div className="inline-block w-5 h-5 border-2 border-sky-300 border-t-sky-600 rounded-full animate-spin" />
          <p className="text-[11px] text-gray-500 mt-2">{t.vaultHashing}</p>
        </div>
      )}

      {/* Photo list */}
      {photos.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{t.vaultPhotos} ({photos.length})</div>
          {photos.map((p, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <img src={p.preview} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-gray-800 truncate">{p.name}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-[10px] text-green-600 font-medium">{t.vaultVerified}</span>
                </div>
                <div className="text-[10px] text-gray-400">{new Date(p.timestamp).toLocaleString()}</div>
              </div>
              <button onClick={() => removePhoto(i)} className="text-gray-300 hover:text-red-500 p-1 flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Generate certificate */}
      <div className="mb-2">
        <ActionBtn onClick={generateCertificate} disabled={!photos.length || !property.address} label={t.vaultGenerate} />
      </div>

      {/* Certificate result */}
      {certificate && (
        <div className="mt-3 space-y-3 fade-in">
          <div className="p-4 rounded-[14px] bg-green-50 border border-green-200 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div className="text-[15px] font-bold text-green-800 mb-1">{t.vaultVerified}</div>
            <div className="text-[12px] text-green-700 mb-3">{certificate.totalPhotos} {t.vaultPhotos.toLowerCase()}</div>
            <div className="inline-flex items-center gap-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">{t.vaultCertId}: {certificate.id}</span>
            </div>
          </div>

          <button onClick={downloadCertificate}
            className="w-full py-3 rounded-xl text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200 hover:bg-sky-100 transition flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {t.vaultDownload}
          </button>

          <div className="p-3 rounded-[12px] bg-amber-50 border border-amber-100">
            <p className="text-[11px] text-amber-800">{t.vaultLegalNote}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ===== MODULE C: CN-MY TRUST LINK =====
function CNMYTrustLink({ lang, onClose }) {
  const t = L[lang];
  const [uscc, setUscc] = useState('');
  const [usccValid, setUsccValid] = useState(null);
  const [company, setCompany] = useState({ name: '', nameEn: '', capital: '', taxRating: '', years: '', scope: '', abnormal: null, court: null });
  const [result, setResult] = useState(null);

  const validateUSCC = (code) => {
    const clean = code.replace(/\s/g, '').toUpperCase();
    setUscc(clean);
    if (clean.length === 0) { setUsccValid(null); return; }
    // USCC: 18 chars, alphanumeric (0-9, A-H, J-N, P-R, T-U, W-Y)
    const valid = /^[0-9A-HJ-NP-RT-UW-Y]{18}$/.test(clean);
    setUsccValid(clean.length === 18 ? valid : null);
    setResult(null);
  };

  const generateTrust = () => {
    const cap = parseFloat(company.capital) || 0;
    let score = 0;
    const risks = [];
    const positives = [];

    // Paid-in capital (30 pts)
    if (cap >= 10000000) { score += 30; positives.push(lang === 'en' ? `Strong capital: RMB ${(cap/10000).toLocaleString()}万 (${(cap/1000000).toFixed(1)}M)` : lang === 'bm' ? `Modal kukuh: RMB ${(cap/10000).toLocaleString()}万` : `实缴资本雄厚：RMB ${(cap/10000).toLocaleString()}万`); }
    else if (cap >= 1000000) { score += 20; positives.push(lang === 'en' ? `Adequate capital: RMB ${(cap/10000).toLocaleString()}万` : lang === 'bm' ? `Modal memadai: RMB ${(cap/10000).toLocaleString()}万` : `资本充足：RMB ${(cap/10000).toLocaleString()}万`); }
    else if (cap >= 100000) { score += 10; risks.push(lang === 'en' ? `Low capital: RMB ${(cap/10000).toFixed(1)}万 — may lack financial stability` : lang === 'bm' ? `Modal rendah — mungkin kurang stabil` : `资本较低 — 可能财务不稳定`); }
    else { risks.push(lang === 'en' ? 'Very low capital — high flight risk' : lang === 'bm' ? 'Modal sangat rendah — risiko tinggi' : '资本极低 — 跑路风险高'); }

    // Tax rating (25 pts)
    if (company.taxRating === 'A') { score += 25; positives.push(lang === 'en' ? 'Grade A taxpayer — excellent compliance' : lang === 'bm' ? 'Pembayar cukai Gred A' : 'A级纳税人 — 合规优秀'); }
    else if (company.taxRating === 'B') { score += 18; positives.push(lang === 'en' ? 'Grade B taxpayer — good compliance' : lang === 'bm' ? 'Pembayar cukai Gred B' : 'B级纳税人 — 合规良好'); }
    else if (company.taxRating === 'C') { score += 8; risks.push(lang === 'en' ? 'Grade C taxpayer — fair compliance, monitor closely' : lang === 'bm' ? 'Pembayar cukai Gred C — pantau rapat' : 'C级纳税人 — 需密切关注'); }
    else if (company.taxRating === 'D') { risks.push(lang === 'en' ? 'Grade D taxpayer — poor compliance, serious concern' : lang === 'bm' ? 'Pembayar cukai Gred D — kebimbangan serius' : 'D级纳税人 — 严重关注'); }

    // Years in operation (20 pts)
    const yrs = parseInt(company.years) || 0;
    if (yrs >= 10) { score += 20; positives.push(lang === 'en' ? `${yrs} years operating — well-established` : lang === 'bm' ? `${yrs} tahun beroperasi — mantap` : `运营${yrs}年 — 经验丰富`); }
    else if (yrs >= 5) { score += 15; positives.push(lang === 'en' ? `${yrs} years operating — established` : lang === 'bm' ? `${yrs} tahun beroperasi` : `运营${yrs}年 — 已站稳`); }
    else if (yrs >= 2) { score += 8; }
    else { risks.push(lang === 'en' ? `Only ${yrs} year(s) — new company, higher risk` : lang === 'bm' ? `Hanya ${yrs} tahun — syarikat baru` : `仅运营${yrs}年 — 新公司，风险较高`); }

    // Abnormal operations (15 pts)
    if (company.abnormal === false) { score += 15; positives.push(lang === 'en' ? 'Not on abnormal operations list' : lang === 'bm' ? 'Tiada dalam senarai tidak normal' : '未列入经营异常名录'); }
    else if (company.abnormal === true) { risks.push(lang === 'en' ? 'ON Abnormal Operations List — critical red flag' : lang === 'bm' ? 'DALAM senarai tidak normal — amaran kritikal' : '已列入经营异常名录 — 严重警告'); }

    // Court records (10 pts)
    if (company.court === false) { score += 10; positives.push(lang === 'en' ? 'No known court disputes' : lang === 'bm' ? 'Tiada pertikaian mahkamah' : '无已知法律纠纷'); }
    else if (company.court === true) { risks.push(lang === 'en' ? 'Has court/legal dispute records — investigate details' : lang === 'bm' ? 'Ada rekod pertikaian — siasat butiran' : '有法律纠纷记录 — 需调查详情'); }

    const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 35 ? 'C' : 'D';
    setResult({ score, grade, risks, positives });
  };

  const downloadReport = () => {
    if (!result) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CN-MY Trust Report - ${uscc}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;padding:40px;max-width:800px;margin:0 auto;color:#1a1a1a;line-height:1.6}
.header{text-align:center;border-bottom:3px double #333;padding-bottom:20px;margin-bottom:30px}
.header h1{font-size:22px;letter-spacing:1px;margin-bottom:5px}.header h2{font-size:14px;color:#555;font-weight:normal}
.grade-box{text-align:center;padding:20px;margin:20px 0;border:2px solid ${result.grade==='A'?'#16a34a':result.grade==='B'?'#3b82f6':result.grade==='C'?'#f59e0b':'#dc2626'};border-radius:8px}
.grade-letter{font-size:48px;font-weight:bold;color:${result.grade==='A'?'#16a34a':result.grade==='B'?'#3b82f6':result.grade==='C'?'#f59e0b':'#dc2626'}}
.section{margin-bottom:25px}.section h3{font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#555;border-bottom:1px solid #ddd;padding-bottom:5px;margin-bottom:10px}
.field{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}.field .label{color:#777}.field .value{font-weight:bold}
.risk{background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:12px;margin-bottom:8px;font-size:12px;color:#991b1b}
.pos{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:12px;margin-bottom:8px;font-size:12px;color:#166534}
.footer{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #ddd;font-size:11px;color:#999}</style></head>
<body>
<div class="header"><h1>CN-MY ENTERPRISE TRUST REPORT</h1><h2>Cross-Border Tenant Verification</h2></div>
<div class="grade-box"><div class="grade-letter">GRADE ${result.grade}</div><div style="font-size:14px;color:#555;margin-top:5px">Trust Score: ${result.score}/100</div></div>
<div class="section"><h3>Company Details</h3>
<div class="field"><span class="label">USCC</span><span class="value">${uscc}</span></div>
${company.name ? `<div class="field"><span class="label">Company (CN)</span><span class="value">${company.name}</span></div>` : ''}
${company.nameEn ? `<div class="field"><span class="label">Company (EN)</span><span class="value">${company.nameEn}</span></div>` : ''}
<div class="field"><span class="label">Paid-in Capital</span><span class="value">RMB ${parseFloat(company.capital||0).toLocaleString()}</span></div>
<div class="field"><span class="label">Tax Rating</span><span class="value">Grade ${company.taxRating || 'N/A'}</span></div>
<div class="field"><span class="label">Years in Operation</span><span class="value">${company.years || 'N/A'}</span></div>
<div class="field"><span class="label">Business Scope</span><span class="value">${company.scope || 'N/A'}</span></div>
<div class="field"><span class="label">Abnormal Operations</span><span class="value">${company.abnormal ? 'YES ⚠️' : 'No'}</span></div>
<div class="field"><span class="label">Court Records</span><span class="value">${company.court ? 'YES ⚠️' : 'No'}</span></div></div>
${result.risks.length ? `<div class="section"><h3>Risk Factors</h3>${result.risks.map(r=>`<div class="risk">⚠️ ${r}</div>`).join('')}</div>` : ''}
${result.positives.length ? `<div class="section"><h3>Positive Factors</h3>${result.positives.map(p=>`<div class="pos">✅ ${p}</div>`).join('')}</div>` : ''}
<div class="section" style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:16px;font-size:12px"><h3 style="color:#92400e;border:none;padding:0;margin-bottom:8px">Disclaimer</h3><p>${t.trustDisclaimer}</p></div>
<div class="footer"><p>Generated by Find.ai — CN-MY Enterprise Trust Link</p><p>${new Date().toLocaleString('en-MY')}</p></div>
</body></html>`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = `Trust-Report-${uscc}-${new Date().toISOString().slice(0,10)}.html`;
    a.click();
  };

  const gradeStyle = { A: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' }, B: { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' }, C: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' }, D: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' } };

  return (
    <Modal>
      <ToolHeader icon="🇨🇳" title={t.trustTitle} desc={t.trustDesc} onClose={onClose} />

      {/* USCC Input */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.usccLabel}</label>
          <input type="text" value={uscc} onChange={(e) => validateUSCC(e.target.value)} maxLength={18}
            placeholder="91310000MA1FL8XQ30" className="w-full py-2.5 px-3 rounded-xl text-sm font-mono tracking-wider focus:outline-none"
            style={{ border: `1.5px solid ${usccValid === false ? '#fecaca' : usccValid === true ? '#bbf7d0' : '#e2e8f0'}`, background: '#f8fafc', color: '#0f172a' }} />
          <p className="text-[10px] mt-1 pl-1" style={{ color: usccValid === false ? '#dc2626' : '#94a3b8' }}>
            {usccValid === false ? t.usccInvalid : t.usccHint}
          </p>
          {usccValid && <div className="flex items-center gap-1 mt-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg><span className="text-[10px] font-medium" style={{ color: '#16a34a' }}>Valid USCC format</span></div>}
        </div>

        {/* Company Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.companyName}</label>
            <input type="text" value={company.name} onChange={(e) => { setCompany(c => ({ ...c, name: e.target.value })); setResult(null); }}
              placeholder="深圳市某某科技有限公司" className="w-full py-2.5 px-3 rounded-xl text-sm focus:outline-none" style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }} />
          </div>
          <div className="col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.companyNameEn}</label>
            <input type="text" value={company.nameEn} onChange={(e) => { setCompany(c => ({ ...c, nameEn: e.target.value })); setResult(null); }}
              placeholder="Shenzhen XYZ Technology Co., Ltd." className="w-full py-2.5 px-3 rounded-xl text-sm focus:outline-none" style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }} />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.paidInCapital}</label>
          <div className="flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>¥</span>
            <input type="number" value={company.capital} onChange={(e) => { setCompany(c => ({ ...c, capital: e.target.value })); setResult(null); }}
              placeholder="5000000" className="flex-1 bg-transparent text-lg font-semibold focus:outline-none" style={{ color: '#0f172a' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.taxRating}</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['A','B','C','D'].map(r => (
                <button key={r} onClick={() => { setCompany(c => ({ ...c, taxRating: r })); setResult(null); }}
                  className="py-2 rounded-lg text-[13px] font-bold transition"
                  style={company.taxRating === r
                    ? { background: gradeStyle[r].bg, border: `1.5px solid ${gradeStyle[r].border}`, color: gradeStyle[r].color }
                    : { background: 'white', border: '1px solid #e2e8f0', color: '#94a3b8' }
                  }>{r}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.yearsOp}</label>
            <input type="number" value={company.years} onChange={(e) => { setCompany(c => ({ ...c, years: e.target.value })); setResult(null); }}
              placeholder="5" className="w-full py-2.5 px-3 rounded-xl text-sm focus:outline-none" style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }} />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.bizScope}</label>
          <div className="flex flex-wrap gap-1.5">
            {['manufacturing','trading','logistics','tech','other'].map(s => (
              <button key={s} onClick={() => { setCompany(c => ({ ...c, scope: s })); setResult(null); }}
                className="px-3 py-1.5 rounded-full text-[11px] font-medium transition"
                style={company.scope === s
                  ? { background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)', color: '#1d4ed8' }
                  : { background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }
                }>{t.bizScopes[s]}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.abnormalOps}</label>
            <div className="flex gap-2">
              <button onClick={() => { setCompany(c => ({ ...c, abnormal: false })); setResult(null); }}
                className="flex-1 py-2 rounded-xl text-[12px] font-medium transition"
                style={company.abnormal === false ? { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' } : { background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }}>{t.no}</button>
              <button onClick={() => { setCompany(c => ({ ...c, abnormal: true })); setResult(null); }}
                className="flex-1 py-2 rounded-xl text-[12px] font-medium transition"
                style={company.abnormal === true ? { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' } : { background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }}>{t.yes}</button>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.courtRecords}</label>
            <div className="flex gap-2">
              <button onClick={() => { setCompany(c => ({ ...c, court: false })); setResult(null); }}
                className="flex-1 py-2 rounded-xl text-[12px] font-medium transition"
                style={company.court === false ? { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' } : { background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }}>{t.no}</button>
              <button onClick={() => { setCompany(c => ({ ...c, court: true })); setResult(null); }}
                className="flex-1 py-2 rounded-xl text-[12px] font-medium transition"
                style={company.court === true ? { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' } : { background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }}>{t.yes}</button>
            </div>
          </div>
        </div>

        <ActionBtn onClick={generateTrust} disabled={!usccValid || !company.taxRating || !company.capital} label={t.generateReport} />
      </div>

      {/* Result */}
      {result && (
        <div className="mt-4 space-y-3 fade-in">
          <div className="p-5 rounded-[14px] text-center" style={{ background: gradeStyle[result.grade].bg, border: `1.5px solid ${gradeStyle[result.grade].border}` }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748b' }}>{t.trustGrade}</div>
            <div className="text-4xl font-black mb-1" style={{ color: gradeStyle[result.grade].color }}>{result.grade}</div>
            <div className="text-[12px] font-medium mb-2" style={{ color: gradeStyle[result.grade].color }}>{t[`trust${result.grade}`]}</div>
            <div className="w-full rounded-full h-2 mt-3" style={{ background: '#e2e8f0' }}>
              <div className="h-2 rounded-full transition-all" style={{ width: `${result.score}%`, background: gradeStyle[result.grade].color }} />
            </div>
            <div className="text-[11px] mt-1" style={{ color: '#94a3b8' }}>{t.trustScore}: {result.score}/100</div>
          </div>

          {result.risks.length > 0 && (
            <div className="p-3 rounded-[12px]" style={{ background: '#fef2f2' }}>
              <div className="text-[11px] font-bold mb-2" style={{ color: '#dc2626' }}>⚠️ {t.riskFactors}</div>
              {result.risks.map((r, i) => <p key={i} className="text-[12px] mb-1" style={{ color: '#991b1b' }}>• {r}</p>)}
            </div>
          )}
          {result.positives.length > 0 && (
            <div className="p-3 rounded-[12px]" style={{ background: '#f0fdf4' }}>
              <div className="text-[11px] font-bold mb-2" style={{ color: '#16a34a' }}>✅ {t.positiveFactors}</div>
              {result.positives.map((p, i) => <p key={i} className="text-[12px] mb-1" style={{ color: '#166534' }}>• {p}</p>)}
            </div>
          )}

          <button onClick={downloadReport}
            className="w-full py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {t.downloadReport}
          </button>

          <div className="p-3 rounded-[12px]" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <p className="text-[11px]" style={{ color: '#92400e' }}>{t.trustDisclaimer}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ===== MODULE D: SITUATION NAVIGATOR =====
const SITUATIONS = {
  en: {
    rentDefault: {
      title: 'Rent Default',
      law: 'Distress Act 1951 + Contracts Act 1950',
      timeline: '2-8 weeks depending on action taken',
      cost: 'RM50-500 (court fees) or RM0 (negotiation)',
      steps: [
        { title: 'Send written reminder (Day 1-7)', action: 'Send WhatsApp/letter to tenant. Keep a record. Polite but firm — "Your rent of RM[X] was due on [date]."', warning: 'Don\'t threaten. Don\'t mention eviction yet.' },
        { title: 'Issue formal demand letter (Day 8-14)', action: 'Send a Letter of Demand (LOD) via registered mail or hand-deliver with witness. State the amount, deadline (14 days), and that legal action will follow.', warning: 'Must be in writing. WhatsApp alone may not be sufficient for court.' },
        { title: 'File at Magistrate Court (Day 15-30)', action: 'If unpaid, file Form 198 at Magistrate Court. Filing fee: ~RM50. You can do this without a lawyer for claims under RM5,000.', warning: 'You must have the signed tenancy agreement and proof of demand letter.' },
        { title: 'Distress application (Alternative)', action: 'Under Distress Act 1951, apply for a distress warrant to seize tenant\'s movable property as security for unpaid rent.', warning: 'This is a legal process — you CANNOT seize property yourself. Only a bailiff can do this.' },
      ],
      document: `LETTER OF DEMAND

Date: [DATE]
To: [TENANT NAME]
Address: [PROPERTY ADDRESS]

RE: DEMAND FOR PAYMENT OF OUTSTANDING RENTAL

Dear Sir/Madam,

I refer to the Tenancy Agreement dated [DATE] for the property at [ADDRESS].

I hereby demand payment of the outstanding rental sum of RM[AMOUNT] being rent due for the month(s) of [MONTHS], within FOURTEEN (14) days from the date of this letter.

TAKE NOTICE that if payment is not received within the stipulated period, I shall proceed to take legal action against you without further notice, and you shall be liable for all costs incurred.

Yours faithfully,
[LANDLORD NAME]
[IC NUMBER]
[CONTACT NUMBER]`,
    },
    deposit: {
      title: 'Deposit Dispute',
      law: 'Contracts Act 1950 + Specific Relief Act 1950',
      timeline: '2-12 weeks',
      cost: 'RM0 (negotiation) to RM2,000 (tribunal/court)',
      steps: [
        { title: 'Document everything (Immediately)', action: 'Take photos/videos of property condition at check-out. Compare with check-in inventory. Use Find.ai Photo Proof tool to hash and timestamp evidence.', warning: 'Without evidence, it becomes your word against theirs.' },
        { title: 'Request itemized deduction list (Day 1-7)', action: 'Ask landlord/tenant for a written breakdown of all deductions with receipts. Reasonable deductions: actual damage beyond normal wear & tear, unpaid utilities, cleaning if excessively dirty.', warning: 'Landlord CANNOT deduct for normal wear & tear (faded paint, minor scuffs).' },
        { title: 'Send demand letter (Day 8-21)', action: 'If deposit not returned or deductions unfair, send a formal Letter of Demand. State the amount owed and give 14 days to respond.', warning: 'Keep all communication in writing (email/letter). Verbal promises don\'t hold up.' },
        { title: 'File at Tribunal/Court (Day 22+)', action: 'File at Tribunal for Consumer Claims (under RM50,000) or Magistrate Court. Bring: tenancy agreement, check-in/out photos, demand letter, receipts.', warning: 'Tribunal is faster and cheaper than court. You don\'t need a lawyer.' },
      ],
      document: `LETTER OF DEMAND — RETURN OF SECURITY DEPOSIT

Date: [DATE]
To: [LANDLORD/TENANT NAME]
Address: [ADDRESS]

RE: DEMAND FOR RETURN OF SECURITY DEPOSIT

Dear Sir/Madam,

I refer to the Tenancy Agreement dated [DATE] for the property at [ADDRESS], which expired/was terminated on [END DATE].

The security deposit of RM[AMOUNT] was paid at the commencement of the tenancy. The property was returned in good condition, subject to reasonable wear and tear, on [CHECK-OUT DATE].

I hereby demand the full return of the security deposit of RM[AMOUNT] within FOURTEEN (14) days from the date of this letter.

Should payment not be received within the stipulated period, I shall file a claim at the Tribunal for Consumer Claims / Magistrate Court without further notice.

Yours faithfully,
[YOUR NAME]
[IC NUMBER]
[CONTACT NUMBER]`,
    },
    eviction: {
      title: 'Eviction Process',
      law: 'Specific Relief Act 1950 + Distress Act 1951',
      timeline: '1-6 months (legal process)',
      cost: 'RM500-5,000+ (legal fees + court)',
      steps: [
        { title: 'Serve written notice (Month 1)', action: 'Send formal notice to vacate. If lease expired: reasonable notice (typically 1-2 months). If breach: notice period per agreement (usually 14-30 days). Send via registered mail + keep a copy.', warning: 'NEVER change locks, cut utilities, or remove tenant belongings. This is ILLEGAL self-help eviction and you can be sued.' },
        { title: 'File for possession order (Month 2)', action: 'If tenant refuses to leave, file an application for a Possession Order at the High Court under the Specific Relief Act 1950. You will need a lawyer for this.', warning: 'This is NOT a Magistrate Court matter. Eviction orders come from High Court.' },
        { title: 'Court hearing (Month 2-4)', action: 'Attend court hearing. Bring: tenancy agreement, proof of breach/expiry, notice to vacate sent, evidence of non-payment (if applicable).', warning: 'The court may give the tenant time to vacate (usually 14-30 days from order).' },
        { title: 'Writ of Possession (Month 4-6)', action: 'If tenant still refuses to leave after court order, apply for a Writ of Possession. A court bailiff will physically remove the tenant and their belongings.', warning: 'Only the bailiff can remove the tenant. You cannot do this yourself even with a court order.' },
      ],
      document: `NOTICE TO VACATE

Date: [DATE]
To: [TENANT NAME]
Property: [PROPERTY ADDRESS]

RE: NOTICE TO VACATE PREMISES

Dear Sir/Madam,

I refer to the Tenancy Agreement dated [DATE] for the above property.

[CHOOSE ONE:]
☐ The tenancy agreement expired on [DATE] and will not be renewed.
☐ You are in breach of Clause [X] of the Tenancy Agreement, specifically: [DESCRIBE BREACH].

You are hereby given [30] days' notice to vacate the premises by [VACATE DATE].

Please ensure the property is returned in the same condition as at commencement, subject to reasonable wear and tear, and all keys are returned.

Failure to vacate by the above date will result in legal proceedings being commenced against you without further notice.

Yours faithfully,
[LANDLORD NAME]
[IC NUMBER]
[CONTACT NUMBER]`,
    },
  },
  bm: {
    rentDefault: {
      title: 'Sewa Tertunggak',
      law: 'Akta Distres 1951 + Akta Kontrak 1950',
      timeline: '2-8 minggu bergantung tindakan',
      cost: 'RM50-500 (fi mahkamah) atau RM0 (rundingan)',
      steps: [
        { title: 'Hantar peringatan bertulis (Hari 1-7)', action: 'Hantar WhatsApp/surat. Simpan rekod. Sopan tapi tegas.', warning: 'Jangan ugut. Jangan sebut pengusiran lagi.' },
        { title: 'Keluarkan surat tuntutan rasmi (Hari 8-14)', action: 'Hantar Surat Tuntutan melalui pos berdaftar. Nyatakan jumlah, tarikh akhir (14 hari), dan tindakan undang-undang.', warning: 'Mesti bertulis. WhatsApp sahaja mungkin tidak cukup untuk mahkamah.' },
        { title: 'Failkan di Mahkamah Majistret (Hari 15-30)', action: 'Failkan Borang 198. Fi: ~RM50. Boleh tanpa peguam untuk tuntutan bawah RM5,000.', warning: 'Mesti ada perjanjian sewa dan bukti surat tuntutan.' },
        { title: 'Permohonan distres (Alternatif)', action: 'Di bawah Akta Distres 1951, mohon waran distres untuk rampas harta alih penyewa.', warning: 'Hanya bailif boleh buat ini. Anda TIDAK BOLEH rampas sendiri.' },
      ],
      document: `SURAT TUNTUTAN

Tarikh: [TARIKH]
Kepada: [NAMA PENYEWA]
Alamat: [ALAMAT HARTANAH]

PER: TUNTUTAN BAYARAN SEWA TERTUNGGAK

Tuan/Puan,

Saya merujuk kepada Perjanjian Sewa bertarikh [TARIKH] untuk hartanah di [ALAMAT].

Dengan ini saya menuntut bayaran sewa tertunggak sebanyak RM[JUMLAH] untuk bulan [BULAN], dalam tempoh EMPAT BELAS (14) hari dari tarikh surat ini.

AMBIL PERHATIAN bahawa jika bayaran tidak diterima, saya akan mengambil tindakan undang-undang tanpa notis lanjut.

Yang benar,
[NAMA TUAN RUMAH]
[NO IC]
[NO TELEFON]`,
    },
    deposit: {
      title: 'Pertikaian Deposit',
      law: 'Akta Kontrak 1950 + Akta Relief Spesifik 1950',
      timeline: '2-12 minggu',
      cost: 'RM0 (rundingan) hingga RM2,000 (tribunal/mahkamah)',
      steps: [
        { title: 'Dokumentasi (Segera)', action: 'Ambil gambar/video keadaan hartanah. Bandingkan dengan inventori masuk. Guna alat Bukti Foto Find.ai.', warning: 'Tanpa bukti, jadi cakap lawan cakap.' },
        { title: 'Minta senarai potongan (Hari 1-7)', action: 'Minta senarai bertulis semua potongan dengan resit.', warning: 'Tuan rumah TIDAK BOLEH potong untuk haus & lusuh biasa.' },
        { title: 'Hantar surat tuntutan (Hari 8-21)', action: 'Hantar Surat Tuntutan rasmi. Nyatakan jumlah dan beri 14 hari.', warning: 'Simpan semua komunikasi bertulis.' },
        { title: 'Failkan di Tribunal (Hari 22+)', action: 'Failkan di Tribunal Tuntutan Pengguna (bawah RM50,000). Bawa: perjanjian, gambar, surat tuntutan.', warning: 'Tribunal lebih cepat dan murah. Tidak perlu peguam.' },
      ],
      document: `SURAT TUNTUTAN — PULANGAN DEPOSIT

Tarikh: [TARIKH]
Kepada: [NAMA]
Alamat: [ALAMAT]

PER: TUNTUTAN PULANGAN DEPOSIT KESELAMATAN

Tuan/Puan,

Saya merujuk Perjanjian Sewa bertarikh [TARIKH] untuk hartanah di [ALAMAT], yang tamat pada [TARIKH TAMAT].

Deposit keselamatan sebanyak RM[JUMLAH] telah dibayar. Hartanah dipulangkan dalam keadaan baik pada [TARIKH KELUAR].

Dengan ini saya menuntut pulangan penuh deposit RM[JUMLAH] dalam EMPAT BELAS (14) hari.

Yang benar,
[NAMA ANDA]
[NO IC]`,
    },
    eviction: {
      title: 'Proses Pengusiran',
      law: 'Akta Relief Spesifik 1950 + Akta Distres 1951',
      timeline: '1-6 bulan (proses undang-undang)',
      cost: 'RM500-5,000+ (fi guaman + mahkamah)',
      steps: [
        { title: 'Hantar notis bertulis (Bulan 1)', action: 'Hantar notis rasmi untuk mengosongkan. Tempoh notis mengikut perjanjian (biasanya 14-30 hari).', warning: 'JANGAN tukar kunci, potong bekalan, atau buang barang penyewa. Ini HARAM.' },
        { title: 'Failkan perintah milikan (Bulan 2)', action: 'Failkan permohonan Perintah Milikan di Mahkamah Tinggi. Perlu peguam.', warning: 'Ini bukan perkara Mahkamah Majistret.' },
        { title: 'Perbicaraan (Bulan 2-4)', action: 'Hadiri perbicaraan. Bawa perjanjian, bukti pelanggaran, notis yang dihantar.', warning: 'Mahkamah mungkin beri penyewa masa untuk keluar.' },
        { title: 'Writ Milikan (Bulan 4-6)', action: 'Jika penyewa masih enggan keluar, mohon Writ Milikan. Bailif akan usir penyewa.', warning: 'Hanya bailif boleh usir. Anda tidak boleh buat sendiri.' },
      ],
      document: `NOTIS MENGOSONGKAN

Tarikh: [TARIKH]
Kepada: [NAMA PENYEWA]
Hartanah: [ALAMAT]

PER: NOTIS MENGOSONGKAN PREMIS

Tuan/Puan,

Saya merujuk Perjanjian Sewa bertarikh [TARIKH].

Anda diberi notis [30] hari untuk mengosongkan premis sebelum [TARIKH KOSONG].

Kegagalan mengosongkan akan menyebabkan tindakan undang-undang tanpa notis lanjut.

Yang benar,
[NAMA TUAN RUMAH]
[NO IC]`,
    },
  },
  zh: {
    rentDefault: {
      title: '租金拖欠',
      law: '1951年扣押法 + 1950年合同法',
      timeline: '2-8周，取决于采取的行动',
      cost: 'RM50-500（法院费）或 RM0（协商）',
      steps: [
        { title: '发送书面提醒（第1-7天）', action: '发送WhatsApp/信函给租客。保留记录。礼貌但坚定。', warning: '不要威胁，暂不提驱逐。' },
        { title: '发出正式催款函（第8-14天）', action: '通过挂号信发送催款函。说明金额、截止日期（14天）和将采取法律行动。', warning: '必须书面。仅WhatsApp可能不够法庭使用。' },
        { title: '向推事庭提交（第15-30天）', action: '提交198表格。费用约RM50。RM5,000以下可自行申请。', warning: '须有签署的租约和催款函证明。' },
        { title: '扣押申请（替代方案）', action: '根据1951年扣押法，申请扣押令扣押租客动产作为欠租担保。', warning: '只有法警可以执行。您不能自行扣押。' },
      ],
      document: `催款函

日期：[日期]
致：[租客姓名]
地址：[物业地址]

主题：要求支付拖欠租金

先生/女士：

本人参照[日期]签订的租赁协议，物业位于[地址]。

特此要求您在本函日期起十四（14）天内支付拖欠租金RM[金额]，涵盖[月份]的租金。

如未在规定期限内收到付款，本人将采取法律行动，届时您将承担所有相关费用。

此致
[房东姓名]
[身份证号]
[联系电话]`,
    },
    deposit: {
      title: '押金纠纷',
      law: '1950年合同法 + 1950年特定救济法',
      timeline: '2-12周',
      cost: 'RM0（协商）至 RM2,000（仲裁/法院）',
      steps: [
        { title: '记录一切（立即）', action: '拍摄退房时物业状况照片/视频。与入住清单对比。使用Find.ai照片证明工具。', warning: '没有证据就是口说无凭。' },
        { title: '要求详细扣除清单（第1-7天）', action: '要求书面列出所有扣除项及收据。', warning: '房东不能扣除正常磨损（褪色油漆、轻微划痕）。' },
        { title: '发送催款函（第8-21天）', action: '发送正式催款函。说明金额，给14天回复。', warning: '保留所有书面通信。' },
        { title: '向仲裁庭/法院提交（第22天+）', action: '向消费者索赔仲裁庭提交（RM50,000以下）。带上：租约、照片、催款函。', warning: '仲裁庭比法院更快更便宜，不需要律师。' },
      ],
      document: `催款函 — 退还押金

日期：[日期]
致：[姓名]
地址：[地址]

主题：要求退还押金

先生/女士：

本人参照[日期]的租赁协议，物业位于[地址]，已于[终止日期]终止。

押金RM[金额]已于租赁开始时支付。物业已于[退房日期]以良好状态归还。

特此要求在本函日期起十四（14）天内全额退还押金RM[金额]。

此致
[您的姓名]
[身份证号]`,
    },
    eviction: {
      title: '驱逐流程',
      law: '1950年特定救济法 + 1951年扣押法',
      timeline: '1-6个月（法律程序）',
      cost: 'RM500-5,000+（律师费+法院费）',
      steps: [
        { title: '发送书面通知（第1个月）', action: '发送正式搬迁通知。通知期按协议（通常14-30天）。通过挂号信发送。', warning: '绝对不要换锁、断水断电或搬走租客物品。这是非法的。' },
        { title: '申请占有令（第2个月）', action: '向高等法院申请占有令。需要律师。', warning: '这不是推事庭的事项。' },
        { title: '法庭审理（第2-4个月）', action: '出席审理。带上：租约、违约证据、发出的通知。', warning: '法院可能给租客时间搬迁。' },
        { title: '占有令执行（第4-6个月）', action: '如租客仍拒绝搬离，申请执行占有令。法警将强制搬迁。', warning: '只有法警可以执行，即使有法院命令您也不能自行驱逐。' },
      ],
      document: `搬迁通知

日期：[日期]
致：[租客姓名]
物业：[物业地址]

主题：搬迁通知

先生/女士：

本人参照[日期]的租赁协议。

特此给予[30]天通知，请于[搬迁日期]前腾出物业。

逾期未搬将导致法律诉讼，届时不再另行通知。

此致
[房东姓名]
[身份证号]`,
    },
  },
};

function SituationNavigator({ lang, onClose }) {
  const t = L[lang];
  const sits = SITUATIONS[lang];
  const [active, setActive] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyDoc = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!active) {
    return (
      <Modal>
        <ToolHeader icon="🧭" title={t.navTitle} desc={t.navDesc} onClose={onClose} />
        <p className="text-[13px] font-medium mb-4" style={{ color: '#334155' }}>{t.navPick}</p>
        <div className="space-y-2.5">
          {[
            { id: 'rentDefault', icon: '💸', title: t.navRentDefault, desc: t.navRentDefaultDesc },
            { id: 'deposit', icon: '🔒', title: t.navDeposit, desc: t.navDepositDesc },
            { id: 'eviction', icon: '🚪', title: t.navEviction, desc: t.navEvictionDesc },
          ].map(s => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className="w-full flex items-center gap-3 text-left px-4 py-4 rounded-[14px] bg-white card-hover"
              style={{ border: '1px solid #e2e8f0' }}>
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="text-[14px] font-semibold" style={{ color: '#1e293b' }}>{s.title}</div>
                <div className="text-[11px]" style={{ color: '#94a3b8' }}>{s.desc}</div>
              </div>
              <svg className="ml-auto flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          ))}
        </div>
      </Modal>
    );
  }

  const sit = sits[active];

  return (
    <Modal>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setActive(null)} className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: '#3b82f6' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          {t.navBack}
        </button>
        <CloseBtn onClick={onClose} />
      </div>

      <h3 className="text-lg font-bold mb-1" style={{ color: '#0f172a' }}>{sit.title}</h3>

      {/* Info bar */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6' }}>⚖️ {sit.law}</span>
        <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>⏱ {sit.timeline}</span>
        <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>💰 {sit.cost}</span>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-5">
        {sit.steps.map((step, i) => (
          <div key={i} className="rounded-[14px] overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
            <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#f8fafc' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-white"
                style={{ background: '#0f172a' }}>{i + 1}</div>
              <span className="text-[13px] font-semibold" style={{ color: '#1e293b' }}>{step.title}</span>
            </div>
            <div className="px-4 py-3 space-y-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748b' }}>{t.navAction}</div>
                <p className="text-[12px] leading-relaxed" style={{ color: '#334155' }}>{step.action}</p>
              </div>
              <div className="rounded-lg px-3 py-2" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                <p className="text-[11px]" style={{ color: '#92400e' }}>⚠️ {step.warning}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document template */}
      <div className="rounded-[14px] overflow-hidden mb-3" style={{ border: '1px solid #e2e8f0' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: '#f8fafc' }}>
          <span className="text-[12px] font-semibold" style={{ color: '#1e293b' }}>📄 {t.navDocument}</span>
          <button onClick={() => copyDoc(sit.document)}
            className="text-[11px] px-3 py-1.5 rounded-lg font-semibold transition"
            style={copied
              ? { background: '#0f172a', color: 'white' }
              : { background: 'white', border: '1px solid #e2e8f0', color: '#334155' }
            }>{copied ? '✓ Copied!' : t.navCopyDoc}</button>
        </div>
        <div className="px-4 py-3">
          <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-sans" style={{ color: '#475569' }}>{sit.document}</pre>
        </div>
      </div>
    </Modal>
  );
}

// ===== CAN I DO THIS — COMPLIANCE DATA =====
const COMPLIANCE_GOALS = {
  rentFactory: {
    en: {
      verdict: 'maybe',
      verdictText: 'You CAN do this — but requirements depend on the activity and land type. Agricultural land MUST be converted first.',
      cnTrap: 'In China, land use change (土地用途变更) is a standard process with clear timelines. In Malaysia, it requires State Authority approval and can take 12-24 months with NO guarantee of success. Do NOT sign lease until conversion is confirmed.',
      summary: { licenses: '6 required + 2 recommended', time: '14-30 months (land conversion is bottleneck)', cost: 'RM60K - RM275K+' },
      required: [
        { name: 'Land Use Conversion', dept: 'Pejabat Tanah (Land Office)', detail: 'Convert agricultural → industrial under NLC Section 124. Must be done BEFORE any building or operations.', time: '12-24 months', cost: 'RM50K-200K premium', warn: 'May be rejected' },
        { name: 'DOE Environmental License', dept: 'Jabatan Alam Sekitar (DOE)', detail: 'Environmental Impact Assessment (EIA) required for manufacturing. Scheduled waste handling needs separate registration.', time: '3-6 months', cost: 'RM5K-50K (EIA)' },
        { name: 'Factory & Machinery Registration', dept: 'DOSH (Jabatan Keselamatan & Kesihatan)', detail: 'Register under Factories & Machinery Act 1967. Boiler/pressure vessel certs if applicable. OSHA compliance audit.', time: '1-3 months', cost: 'RM1K-5K' },
        { name: 'PBT Business License', dept: 'Majlis Perbandaran / Daerah', detail: 'Local council business premise license. Annual renewal. Must match approved land use.', time: '2-4 weeks', cost: 'RM200-2K/year' },
        { name: 'Fire Certificate (CF)', dept: 'Bomba (Fire & Rescue Dept)', detail: 'Fire safety cert for factory operations. Inspection of fire exits, extinguishers, suppression systems.', time: '2-6 weeks', cost: 'RM500-3K' },
        { name: 'Foreign Worker Permits', dept: 'Imigresen Malaysia + MOHR', detail: 'Apply via FWCMS system. Need: levy payment, SOCSO registration, workers\' housing compliance (Act 446). Quota approval from MOHR.', time: '2-6 months', cost: 'RM1.8K-2.5K/worker/year' },
      ],
      recommended: [
        { name: 'MIDA Manufacturing License', dept: 'MIDA (Investment Authority)', detail: 'If capital > RM2.5M or 75+ workers. Unlocks tax incentives (Pioneer Status / ITA). Strongly recommended for foreign companies.', time: '2-4 months', cost: 'Free to apply' },
        { name: 'Environmental Liability Insurance', dept: 'Any licensed insurer', detail: 'EQA 1974 holds landlord AND tenant liable. Insurance protects both parties from environmental claims and cleanup costs.', cost: 'RM3K-15K/year' },
      ],
    },
    bm: {
      verdict: 'maybe',
      verdictText: 'BOLEH — tetapi bergantung pada aktiviti dan jenis tanah. Tanah pertanian MESTI ditukar dahulu.',
      cnTrap: 'Di China, tukar guna tanah (土地用途变更) proses standard dengan jangka masa jelas. Di Malaysia, ia perlu kelulusan Pihak Berkuasa Negeri dan boleh ambil 12-24 bulan TANPA jaminan. JANGAN tandatangan sewa sehingga penukaran disahkan.',
      summary: { licenses: '6 wajib + 2 disyorkan', time: '14-30 bulan (penukaran tanah adalah penghalang)', cost: 'RM60K - RM275K+' },
      required: [
        { name: 'Penukaran Guna Tanah', dept: 'Pejabat Tanah', detail: 'Tukar pertanian → perindustrian di bawah KTN Seksyen 124. Mesti dibuat SEBELUM sebarang pembinaan.', time: '12-24 bulan', cost: 'RM50K-200K premium', warn: 'Mungkin ditolak' },
        { name: 'Lesen Alam Sekitar DOE', dept: 'Jabatan Alam Sekitar (JAS)', detail: 'EIA diperlukan untuk pembuatan. Pengendalian sisa berjadual perlu pendaftaran berasingan.', time: '3-6 bulan', cost: 'RM5K-50K (EIA)' },
        { name: 'Pendaftaran Kilang & Jentera', dept: 'JKKP (DOSH)', detail: 'Daftar di bawah Akta Kilang & Jentera 1967. Sijil dandang/vesel tekanan jika berkenaan.', time: '1-3 bulan', cost: 'RM1K-5K' },
        { name: 'Lesen Perniagaan PBT', dept: 'Majlis Perbandaran / Daerah', detail: 'Lesen premis perniagaan pihak berkuasa tempatan. Pembaharuan tahunan.', time: '2-4 minggu', cost: 'RM200-2K/tahun' },
        { name: 'Sijil Bomba (CF)', dept: 'Bomba', detail: 'Sijil keselamatan kebakaran untuk operasi kilang.', time: '2-6 minggu', cost: 'RM500-3K' },
        { name: 'Permit Pekerja Asing', dept: 'Imigresen + MOHR', detail: 'Mohon melalui FWCMS. Perlu: bayaran levi, pendaftaran PERKESO, pematuhan perumahan (Akta 446).', time: '2-6 bulan', cost: 'RM1.8K-2.5K/pekerja/tahun' },
      ],
      recommended: [
        { name: 'Lesen Pembuatan MIDA', dept: 'MIDA', detail: 'Jika modal > RM2.5J atau 75+ pekerja. Buka insentif cukai.', time: '2-4 bulan', cost: 'Percuma' },
        { name: 'Insurans Liabiliti Alam Sekitar', dept: 'Penanggung insurans berlesen', detail: 'AKS 1974 menjadikan tuan rumah DAN penyewa bertanggungjawab.', cost: 'RM3K-15K/tahun' },
      ],
    },
    zh: {
      verdict: 'maybe',
      verdictText: '可以——但取决于活动类型和土地性质。农业用地必须先完成用途转换。',
      cnTrap: '在中国，土地用途变更是有明确时间表的标准流程。在马来西亚，需要州政府批准，可能需要12-24个月且不保证成功。在用途转换确认前，不要签租约。',
      summary: { licenses: '6项必需 + 2项建议', time: '14-30个月（土地转换是瓶颈）', cost: 'RM6万 - RM27.5万+' },
      required: [
        { name: '土地用途转换', dept: '土地局 (Pejabat Tanah)', detail: '根据《国家土地法》第124条将农业用地转为工业用地。必须在任何建设或运营之前完成。', time: '12-24个月', cost: 'RM5万-20万溢价', warn: '可能被拒绝' },
        { name: 'DOE环境许可证', dept: '环境局 (JAS)', detail: '制造业需要环境影响评估（EIA）。危险废物处理需单独注册。', time: '3-6个月', cost: 'RM5千-5万 (EIA)' },
        { name: '工厂与机械注册', dept: 'DOSH（职业安全与健康局）', detail: '根据《1967年工厂与机械法》注册。锅炉/压力容器需另行认证。', time: '1-3个月', cost: 'RM1千-5千' },
        { name: 'PBT营业执照', dept: '市/县议会', detail: '地方政府营业场所执照。需年度续期。必须符合已批准的土地用途。', time: '2-4周', cost: 'RM200-2千/年' },
        { name: '消防证书 (CF)', dept: '消防与救援局 (Bomba)', detail: '工厂运营所需的消防安全证书。', time: '2-6周', cost: 'RM500-3千' },
        { name: '外劳许可证', dept: '移民局 + 人力资源部', detail: '通过FWCMS系统申请。需要：人头税、SOCSO注册、工人住房合规（第446号法令）。', time: '2-6个月', cost: 'RM1.8千-2.5千/工人/年' },
      ],
      recommended: [
        { name: 'MIDA制造业许可证', dept: 'MIDA（投资促进局）', detail: '资本超过RM250万或75+工人时需要。可享受税收优惠。', time: '2-4个月', cost: '免费申请' },
        { name: '环境责任保险', dept: '任何持牌保险公司', detail: '《1974年环境质量法》规定房东和租户双方均有责任。保险保护双方。', cost: 'RM3千-1.5万/年' },
      ],
    },
  },
  rentHouse: {
    en: {
      verdict: 'yes',
      verdictText: 'Foreigners CAN rent residential property in Malaysia freely. No restrictions on tenancy — only on purchase.',
      cnTrap: 'In China, tenants have statutory right to terminate (解除权 Art. 563) and right of first refusal (优先购买权 Art. 726). Neither exists in Malaysia. Your deposit is your only leverage — protect it.',
      summary: { licenses: '0 licenses needed', time: '1-2 weeks', cost: 'RM3K-10K upfront (deposit + stamp duty)' },
      required: [
        { name: 'Valid Passport + Visa', dept: 'Imigresen Malaysia', detail: 'Must have valid pass (work permit, MM2H, student pass, etc.). Tourist visa technically allows short-term rental but not long-term tenancy.', time: 'Already have', cost: 'Varies' },
        { name: 'Tenancy Agreement (Stamped)', dept: 'LHDN (IRB) via MyTax', detail: 'Written agreement is essential. MUST be stamped within 30 days. Unstamped = cannot be used in court. Use SDSAS self-assessment from Jan 2026.', time: '1-2 weeks', cost: 'RM100-500 (stamp duty)' },
        { name: 'Security Deposit (2+1)', dept: 'Paid to landlord', detail: 'Standard: 2 months rent (security) + 0.5 month (utility deposit). Get receipts. Document everything with photos at check-in.', time: 'Upfront', cost: '2.5 months rent' },
      ],
      recommended: [
        { name: 'Use Find.ai Evidence Vault', dept: 'Find.ai Photo Proof tool', detail: 'SHA-256 hash your check-in photos. Creates court-ready evidence under Section 90A Evidence Act. Protects your deposit claim.', time: '10 minutes', cost: 'Free' },
        { name: 'Verify Landlord Ownership', dept: 'Pejabat Tanah (Land Office)', detail: 'Do a title search to confirm the person renting to you actually owns the property. Scams exist.', time: 'Same day', cost: 'RM50-100' },
      ],
    },
    bm: {
      verdict: 'yes',
      verdictText: 'Warga asing BOLEH menyewa hartanah kediaman di Malaysia dengan bebas. Tiada sekatan ke atas sewaan.',
      cnTrap: 'Di China, penyewa ada hak penamatan berkanun (解除权) dan hak pembelian pertama (优先购买权). Kedua-duanya TIADA di Malaysia. Deposit anda satu-satunya leverage — lindunginya.',
      summary: { licenses: '0 lesen diperlukan', time: '1-2 minggu', cost: 'RM3K-10K pendahuluan (deposit + duti setem)' },
      required: [
        { name: 'Pasport Sah + Visa', dept: 'Imigresen Malaysia', detail: 'Mesti ada pas sah. Visa pelancong membenarkan sewa jangka pendek sahaja.', time: 'Sudah ada', cost: 'Pelbagai' },
        { name: 'Perjanjian Sewa (Bersetem)', dept: 'LHDN melalui MyTax', detail: 'Perjanjian bertulis penting. MESTI disetem dalam 30 hari. Tanpa setem = tak boleh guna di mahkamah.', time: '1-2 minggu', cost: 'RM100-500 (duti setem)' },
        { name: 'Deposit Keselamatan (2+1)', dept: 'Bayar kepada tuan rumah', detail: 'Standard: 2 bulan sewa (keselamatan) + 0.5 bulan (deposit utiliti). Dapatkan resit.', time: 'Pendahuluan', cost: '2.5 bulan sewa' },
      ],
      recommended: [
        { name: 'Guna Find.ai Bukti Foto', dept: 'Alat Bukti Foto Find.ai', detail: 'Hash SHA-256 gambar masuk anda. Cipta bukti mahkamah di bawah Seksyen 90A Akta Keterangan.', time: '10 minit', cost: 'Percuma' },
        { name: 'Sahkan Pemilikan Tuan Rumah', dept: 'Pejabat Tanah', detail: 'Buat carian hakmilik untuk sahkan pemilik sebenar. Penipuan wujud.', time: 'Hari yang sama', cost: 'RM50-100' },
      ],
    },
    zh: {
      verdict: 'yes',
      verdictText: '外国人可以在马来西亚自由租赁住宅。租赁没有限制——只有购买有限制。',
      cnTrap: '在中国，租户有法定解除权（第563条）和优先购买权（第726条）。马来西亚都没有这些权利。你的押金是唯一的筹码——保护好它。',
      summary: { licenses: '不需要许可证', time: '1-2周', cost: 'RM3千-1万预付（押金+印花税）' },
      required: [
        { name: '有效护照 + 签证', dept: '马来西亚移民局', detail: '必须持有有效签证（工作准证、MM2H、学生签证等）。旅游签证仅允许短期租赁。', time: '已有', cost: '不等' },
        { name: '租约（已盖章）', dept: 'LHDN（税务局）通过MyTax', detail: '书面协议必不可少。必须在30天内盖章。未盖章=不能在法庭上使用。2026年1月起使用SDSAS自评系统。', time: '1-2周', cost: 'RM100-500（印花税）' },
        { name: '押金（2+1）', dept: '支付给房东', detail: '标准：2个月租金（押金）+ 0.5个月（水电押金）。索取收据。入住时拍照记录一切。', time: '预付', cost: '2.5个月租金' },
      ],
      recommended: [
        { name: '使用Find.ai照片证明', dept: 'Find.ai照片证明工具', detail: 'SHA-256哈希锁定入住照片。根据《证据法》第90A条创建法庭证据。保护您的押金索赔。', time: '10分钟', cost: '免费' },
        { name: '核实房东所有权', dept: '土地局', detail: '进行产权搜索，确认出租人确实拥有该房产。存在诈骗。', time: '当天', cost: 'RM50-100' },
      ],
    },
  },
  buyHouse: {
    en: {
      verdict: 'maybe',
      verdictText: 'Foreigners CAN buy — but minimum price threshold applies (varies by state). State Authority consent required.',
      cnTrap: 'No "定金 double return" (earnest money) in Malaysia — if you default, you simply lose your deposit. No 优先购买权 (right of first refusal) for tenants. No 质保期 warranty like China — developer warranty is only 24 months from VP.',
      summary: { licenses: '5 required + 2 recommended', time: '4-6 months', cost: 'RM35K-55K+ (excluding property price)' },
      required: [
        { name: 'Verify Minimum Price Threshold', dept: 'State Government', detail: 'Most states: RM1,000,000 min. Penang island: RM1,000,000. Penang mainland: RM500,000. Johor (Forest City): RM600,000. Property MUST be above threshold.', time: 'Before signing', cost: 'Free to check', warn: 'Below threshold = rejected' },
        { name: 'State Authority Consent', dept: 'Pejabat Tanah & Galian', detail: 'Apply via lawyer. Foreign ownership must be approved by State Authority under NLC. Non-strata titles are harder to get approved.', time: '3-6 months', cost: 'RM1K-3K (legal fees)' },
        { name: 'Stamp Duty on SPA', dept: 'LHDN (IRB) via MyTax', detail: 'Tiered: 1% (first RM100K), 2% (RM100K-500K), 3% (RM500K-1M), 4% (above RM1M). SDSAS self-assessment applies from 2026.', time: 'Within 30 days', cost: 'RM24,000+ (on RM1M)' },
        { name: 'Legal Fees & Disbursements', dept: 'Licensed Malaysian lawyer', detail: 'SPA legal fees (tiered scale), loan agreement fees (if financing), title transfer fees, registration fees.', time: 'Throughout process', cost: 'RM10K-25K total' },
        { name: 'RPGT Awareness', dept: 'LHDN (IRB)', detail: 'Real Property Gains Tax: foreigners pay 30% on gains (first 5 years), 10% (after year 5). File within 60 days of disposal.', time: 'On future sale', cost: '30% of profit if sold <5 years', warn: '30% tax if sold early' },
      ],
      recommended: [
        { name: 'Land Title Search', dept: 'Pejabat Tanah', detail: 'Verify: freehold/leasehold, caveats, charges, Malay Reserve status, encumbrances. CRITICAL — do before paying anything.', time: 'Same day', cost: 'RM50-100' },
        { name: 'Defect Inspection (Sub-sale)', dept: 'Licensed building inspector', detail: 'Developer warranty is only 24 months from VP (no 质保期 like China). For sub-sale, inspect BEFORE signing SPA.', time: '1-2 days', cost: 'RM500-1.5K' },
      ],
      timeline: [
        { step: 'Week 1-2: Sign SPA + pay 10% deposit', detail: 'Lawyer prepares SPA. You pay booking + deposit.' },
        { step: 'Month 1-3: State Authority consent', detail: 'Application submitted. Wait for approval. If rejected, SPA is void.' },
        { step: 'Month 3-4: Stamp duty + balance payment', detail: 'Pay stamp duty via SDSAS. Complete balance 90% (or bank loan disbursement).' },
        { step: 'Month 4-6: Title transfer registered', detail: 'Title transferred at Land Office. Keys handed over. Done!' },
      ],
    },
    bm: {
      verdict: 'maybe',
      verdictText: 'Warga asing BOLEH beli — tetapi ambang harga minimum dikenakan (berbeza mengikut negeri). Kelulusan Pihak Berkuasa Negeri diperlukan.',
      cnTrap: 'Tiada "pulangan berganda 定金" di Malaysia. Tiada 优先购买权 untuk penyewa. Waranti pemaju hanya 24 bulan dari VP.',
      summary: { licenses: '5 wajib + 2 disyorkan', time: '4-6 bulan', cost: 'RM35K-55K+ (tidak termasuk harga hartanah)' },
      required: [
        { name: 'Sahkan Ambang Harga Minimum', dept: 'Kerajaan Negeri', detail: 'Kebanyakan negeri: RM1,000,000 min. Pulau Pinang: RM1,000,000 (pulau), RM500,000 (tanah besar).', time: 'Sebelum tandatangan', cost: 'Percuma', warn: 'Di bawah ambang = ditolak' },
        { name: 'Kelulusan Pihak Berkuasa Negeri', dept: 'Pejabat Tanah & Galian', detail: 'Mohon melalui peguam. Pemilikan asing perlu kelulusan di bawah KTN.', time: '3-6 bulan', cost: 'RM1K-3K (yuran guaman)' },
        { name: 'Duti Setem SPA', dept: 'LHDN melalui MyTax', detail: 'Berperingkat: 1% (RM100K pertama), 2% (RM100K-500K), 3% (RM500K-1J), 4% (atas RM1J).', time: 'Dalam 30 hari', cost: 'RM24,000+ (pada RM1J)' },
        { name: 'Yuran Guaman', dept: 'Peguam berlesen Malaysia', detail: 'Yuran guaman SPA, yuran perjanjian pinjaman, yuran pemindahan hakmilik.', time: 'Sepanjang proses', cost: 'RM10K-25K jumlah' },
        { name: 'Kesedaran CKHT', dept: 'LHDN', detail: 'Cukai Keuntungan Harta Tanah: asing bayar 30% (5 tahun pertama), 10% (selepas 5 tahun).', time: 'Pada jualan masa depan', cost: '30% keuntungan jika jual <5 tahun', warn: 'Cukai 30% jika jual awal' },
      ],
      recommended: [
        { name: 'Carian Hakmilik Tanah', dept: 'Pejabat Tanah', detail: 'Sahkan: kekal/pajakan, kaveat, gadaian, status Simpanan Melayu. KRITIKAL.', time: 'Hari yang sama', cost: 'RM50-100' },
        { name: 'Pemeriksaan Kecacatan', dept: 'Pemeriksa bangunan berlesen', detail: 'Waranti pemaju hanya 24 bulan dari VP. Untuk sub-jualan, periksa SEBELUM SPA.', time: '1-2 hari', cost: 'RM500-1.5K' },
      ],
      timeline: [
        { step: 'Minggu 1-2: Tandatangan SPA + bayar 10% deposit', detail: 'Peguam sediakan SPA.' },
        { step: 'Bulan 1-3: Kelulusan Pihak Berkuasa Negeri', detail: 'Permohonan dihantar. Tunggu kelulusan.' },
        { step: 'Bulan 3-4: Duti setem + bayaran baki', detail: 'Bayar duti setem melalui SDSAS.' },
        { step: 'Bulan 4-6: Pemindahan hakmilik', detail: 'Hakmilik dipindahkan. Kunci diserahkan.' },
      ],
    },
    zh: {
      verdict: 'maybe',
      verdictText: '外国人可以购买——但各州有最低价格门槛。需要州政府批准。',
      cnTrap: '马来西亚没有"定金双倍返还"。没有优先购买权。开发商质保期仅24个月（从VP算起），不像中国的质保期制度。',
      summary: { licenses: '5项必需 + 2项建议', time: '4-6个月', cost: 'RM3.5万-5.5万+（不含房价）' },
      required: [
        { name: '核实最低价格门槛', dept: '州政府', detail: '大多数州：RM100万起。槟城岛：RM100万。槟城大陆：RM50万。房产必须超过门槛。', time: '签约前', cost: '免费查询', warn: '低于门槛=被拒' },
        { name: '州政府批准', dept: '土地及矿物局', detail: '通过律师申请。外国人所有权须获州政府批准。', time: '3-6个月', cost: 'RM1千-3千（律师费）' },
        { name: 'SPA印花税', dept: 'LHDN（税务局）通过MyTax', detail: '分级：1%（首RM10万）、2%（RM10万-50万）、3%（RM50万-100万）、4%（超过RM100万）。', time: '30天内', cost: 'RM2.4万+（RM100万房产）' },
        { name: '律师费及支出', dept: '马来西亚持牌律师', detail: 'SPA律师费、贷款协议费、产权转让费、登记费。', time: '全程', cost: 'RM1万-2.5万总计' },
        { name: 'RPGT（房产盈利税）', dept: 'LHDN（税务局）', detail: '外国人：5年内出售征30%，5年后征10%。处置后60天内申报。', time: '未来出售时', cost: '5年内出售利润的30%', warn: '提前出售税率30%' },
      ],
      recommended: [
        { name: '产权搜索', dept: '土地局', detail: '核实：永久/租赁产权、禁令、抵押、马来保留地状态。极其重要——付款前必做。', time: '当天', cost: 'RM50-100' },
        { name: '房屋缺陷检查', dept: '持牌建筑检查员', detail: '开发商质保仅24个月。二手房交易，签SPA前务必检查。', time: '1-2天', cost: 'RM500-1,500' },
      ],
      timeline: [
        { step: '第1-2周：签SPA + 付10%定金', detail: '律师准备SPA。支付订金和首付。' },
        { step: '第1-3月：州政府审批', detail: '提交申请。等待批准。若被拒，SPA作废。' },
        { step: '第3-4月：印花税 + 余款', detail: '通过SDSAS缴纳印花税。完成90%余款。' },
        { step: '第4-6月：产权过户登记', detail: '土地局完成产权过户。交钥匙。完成！' },
      ],
    },
  },
  buyLand: {
    en: {
      verdict: 'maybe',
      verdictText: 'Foreigners CAN buy land — but strict restrictions apply. Malay Reserved Land and NCR land are OFF LIMITS. State consent required.',
      cnTrap: 'In China, ALL land is state-owned and you only buy use rights (70/40/50 years). In Malaysia, FREEHOLD means you own it forever. But beware: "leasehold" does NOT auto-renew like China. Also Malay Reserved Land is a concept that does not exist in China — buying it as a foreigner is legally VOID.',
      summary: { licenses: '3 required + 2 recommended', time: '6-18 months', cost: 'RM50K-200K+ (excluding land price)' },
      required: [
        { name: 'Verify Land Status', dept: 'Pejabat Tanah', detail: 'CRITICAL: Check for Malay Reserved Land, NCR claims (Sabah/Sarawak), category (agriculture/building/industry), caveats, charges. Non-Malay purchase of Malay Reserved Land is VOID.', time: '1-3 days', cost: 'RM50-200', warn: 'Malay Reserved = CANNOT buy' },
        { name: 'State Authority Consent', dept: 'Pejabat Tanah & Galian', detail: 'All foreign land purchases require State Authority consent under NLC Section 433B. For transactions >RM20M, EPU (Economic Planning Unit) approval also needed.', time: '3-12 months', cost: 'RM5K-20K (legal + application)' },
        { name: 'Land Use Conversion (if needed)', dept: 'Pejabat Tanah', detail: 'If buying agricultural land for development/factory, must convert under NLC Section 124. Using agricultural land for non-agricultural purposes WITHOUT conversion = criminal offense.', time: '12-24 months', cost: 'RM50K-200K premium', warn: 'Criminal offense if used without conversion' },
      ],
      recommended: [
        { name: 'Survey & Boundary Check', dept: 'Licensed land surveyor (JUPEM)', detail: 'Verify actual boundaries match title. Encroachment issues are common especially for rural/agricultural land.', time: '2-4 weeks', cost: 'RM3K-10K' },
        { name: 'Environmental Assessment', dept: 'DOE / Environmental consultant', detail: 'If planning development: check flood zones, environmental sensitivity, scheduled waste history. Some land may have contamination from previous use.', time: '1-3 months', cost: 'RM5K-50K' },
      ],
    },
    bm: {
      verdict: 'maybe',
      verdictText: 'Warga asing BOLEH beli tanah — tetapi sekatan ketat dikenakan. Tanah Simpanan Melayu dan tanah NCR DILARANG.',
      cnTrap: 'Di China, SEMUA tanah milik negara (hak guna 70/40/50 tahun). Di Malaysia, KEKAL bermakna milik selama-lamanya. Tetapi "pajakan" TIDAK diperbaharui automatik. Tanah Simpanan Melayu = pembelian oleh bukan Melayu TERBATAL.',
      summary: { licenses: '3 wajib + 2 disyorkan', time: '6-18 bulan', cost: 'RM50K-200K+ (tidak termasuk harga tanah)' },
      required: [
        { name: 'Sahkan Status Tanah', dept: 'Pejabat Tanah', detail: 'KRITIKAL: Semak Tanah Simpanan Melayu, tuntutan NCR, kategori, kaveat. Pembelian Tanah Simpanan Melayu oleh bukan Melayu adalah TERBATAL.', time: '1-3 hari', cost: 'RM50-200', warn: 'Simpanan Melayu = TAK BOLEH beli' },
        { name: 'Kelulusan Pihak Berkuasa Negeri', dept: 'Pejabat Tanah & Galian', detail: 'Semua pembelian tanah asing perlu kelulusan di bawah KTN Seksyen 433B.', time: '3-12 bulan', cost: 'RM5K-20K' },
        { name: 'Penukaran Guna Tanah (jika perlu)', dept: 'Pejabat Tanah', detail: 'Jika beli tanah pertanian untuk pembangunan, mesti tukar di bawah KTN Seksyen 124. Tanpa penukaran = kesalahan jenayah.', time: '12-24 bulan', cost: 'RM50K-200K', warn: 'Kesalahan jenayah tanpa penukaran' },
      ],
      recommended: [
        { name: 'Ukur & Semakan Sempadan', dept: 'Juruukur berlesen (JUPEM)', detail: 'Sahkan sempadan sebenar padanan hakmilik. Isu pencerobohan biasa untuk tanah luar bandar.', time: '2-4 minggu', cost: 'RM3K-10K' },
        { name: 'Penilaian Alam Sekitar', dept: 'JAS / Perunding alam sekitar', detail: 'Jika merancang pembangunan: semak zon banjir, sensitiviti alam sekitar.', time: '1-3 bulan', cost: 'RM5K-50K' },
      ],
    },
    zh: {
      verdict: 'maybe',
      verdictText: '外国人可以买地——但限制严格。马来保留地和原住民习惯地（NCR）禁止购买。需州政府批准。',
      cnTrap: '在中国，所有土地国有（使用权70/40/50年）。在马来西亚，永久产权意味着永远拥有。但"租赁产权"不会像中国一样自动续期。马来保留地是中国不存在的概念——外国人购买在法律上无效。',
      summary: { licenses: '3项必需 + 2项建议', time: '6-18个月', cost: 'RM5万-20万+（不含地价）' },
      required: [
        { name: '核实土地状态', dept: '土地局', detail: '极重要：检查是否为马来保留地、NCR索赔、土地类别、禁令、抵押。非马来人购买马来保留地在法律上无效。', time: '1-3天', cost: 'RM50-200', warn: '马来保留地=不能购买' },
        { name: '州政府批准', dept: '土地及矿物局', detail: '所有外国人土地购买需根据《国家土地法》第433B条获得州政府批准。超过RM2000万的交易还需EPU批准。', time: '3-12个月', cost: 'RM5千-2万' },
        { name: '土地用途转换（如需要）', dept: '土地局', detail: '若购买农业用地用于开发/建厂，须根据第124条申请转换。未转换即用于非农业目的=刑事犯罪。', time: '12-24个月', cost: 'RM5万-20万溢价', warn: '未转换使用属刑事犯罪' },
      ],
      recommended: [
        { name: '测量与边界检查', dept: '持牌测量师 (JUPEM)', detail: '核实实际边界与产权一致。农村/农业用地的侵占问题很常见。', time: '2-4周', cost: 'RM3千-1万' },
        { name: '环境评估', dept: '环境局/环境顾问', detail: '若计划开发：检查洪水区、环境敏感度、历史废物。部分土地可能有前用户遗留污染。', time: '1-3个月', cost: 'RM5千-5万' },
      ],
    },
  },
  rentOffice: {
    en: {
      verdict: 'yes',
      verdictText: 'Foreigners CAN lease commercial space in Malaysia. Company registration (SSM or foreign branch) is typically required to operate.',
      cnTrap: 'In China, penalty clauses (违约金) are enforceable. In Malaysia, penalty clauses are VOID — only "liquidated damages" (genuine pre-estimate of loss) are valid. Also: "转让费" (key money) to outgoing tenant is NOT protected — landlord can refuse the assignment.',
      summary: { licenses: '3 required + 1 recommended', time: '1-3 months', cost: 'RM5K-30K upfront' },
      required: [
        { name: 'Company Registration', dept: 'SSM (Suruhanjaya Syarikat Malaysia)', detail: 'Register Sdn Bhd, branch office, or representative office. Foreign companies need SSM + Companies Commission approval.', time: '2-4 weeks', cost: 'RM1K-5K' },
        { name: 'Tenancy Agreement (Stamped)', dept: 'LHDN via MyTax', detail: 'Commercial leases: stamp within 30 days. Leases >3 years must be REGISTERED at Land Office to bind future owners.', time: '1-2 weeks', cost: 'RM500-5K (stamp duty)', warn: '>3 years? Register or risk losing lease if property sold' },
        { name: 'PBT Business License', dept: 'Majlis Perbandaran / Daerah', detail: 'Required for all commercial operations. Specific license category depends on business type. Annual renewal.', time: '2-4 weeks', cost: 'RM200-2K/year' },
      ],
      recommended: [
        { name: 'Fire Safety Certificate', dept: 'Bomba', detail: 'Required if premises exceed certain size or occupancy thresholds. Check with local Bomba office.', time: '2-4 weeks', cost: 'RM300-1K' },
      ],
    },
    bm: {
      verdict: 'yes',
      verdictText: 'Warga asing BOLEH menyewa ruang komersial di Malaysia. Pendaftaran syarikat (SSM atau cawangan asing) biasanya diperlukan.',
      cnTrap: 'Di China, klausa penalti (违约金) boleh dikuatkuasakan. Di Malaysia, klausa penalti TERBATAL. "转让费" (wang kunci) kepada penyewa lama TIDAK dilindungi.',
      summary: { licenses: '3 wajib + 1 disyorkan', time: '1-3 bulan', cost: 'RM5K-30K pendahuluan' },
      required: [
        { name: 'Pendaftaran Syarikat', dept: 'SSM', detail: 'Daftar Sdn Bhd, pejabat cawangan, atau pejabat wakil. Syarikat asing perlu kelulusan SSM.', time: '2-4 minggu', cost: 'RM1K-5K' },
        { name: 'Perjanjian Sewa (Bersetem)', dept: 'LHDN melalui MyTax', detail: 'Setem dalam 30 hari. Sewa >3 tahun MESTI didaftarkan di Pejabat Tanah.', time: '1-2 minggu', cost: 'RM500-5K', warn: '>3 tahun? Daftar atau risiko hilang sewa' },
        { name: 'Lesen Perniagaan PBT', dept: 'Majlis Perbandaran / Daerah', detail: 'Diperlukan untuk semua operasi komersial. Pembaharuan tahunan.', time: '2-4 minggu', cost: 'RM200-2K/tahun' },
      ],
      recommended: [
        { name: 'Sijil Keselamatan Kebakaran', dept: 'Bomba', detail: 'Diperlukan jika premis melebihi saiz atau ambang penghuni tertentu.', time: '2-4 minggu', cost: 'RM300-1K' },
      ],
    },
    zh: {
      verdict: 'yes',
      verdictText: '外国人可以在马来西亚租赁商业空间。通常需要公司注册（SSM或外国分公司）才能运营。',
      cnTrap: '在中国，违约金条款可强制执行。在马来西亚，惩罚性条款无效——只有"预定损害赔偿"有效。"转让费"（顶手费）给退租方不受保护——房东可拒绝转让。',
      summary: { licenses: '3项必需 + 1项建议', time: '1-3个月', cost: 'RM5千-3万预付' },
      required: [
        { name: '公司注册', dept: 'SSM（马来西亚公司委员会）', detail: '注册Sdn Bhd、分公司或代表处。外国公司需SSM批准。', time: '2-4周', cost: 'RM1千-5千' },
        { name: '租约（已盖章）', dept: 'LHDN通过MyTax', detail: '商业租赁：30天内盖章。超过3年的租赁必须在土地局登记。', time: '1-2周', cost: 'RM500-5千（印花税）', warn: '超3年？须登记否则房产出售时租约可能无效' },
        { name: 'PBT营业执照', dept: '市/县议会', detail: '所有商业运营必需。具体许可类别取决于业务类型。需年度续期。', time: '2-4周', cost: 'RM200-2千/年' },
      ],
      recommended: [
        { name: '消防安全证书', dept: '消防与救援局 (Bomba)', detail: '若场所超过一定面积或人数标准则需要。咨询当地消防局。', time: '2-4周', cost: 'RM300-1千' },
      ],
    },
  },
  openFnb: {
    en: {
      verdict: 'maybe',
      verdictText: 'Foreigners CAN open F&B in Malaysia — but it requires MULTIPLE licenses from different departments. Plan 3-6 months lead time.',
      cnTrap: 'In China, food business licensing is centralized through one authority (市场监督管理局). In Malaysia, you need SEPARATE licenses from PBT, MOH, Bomba, and possibly JAKIM (halal). Each has its own process and timeline. No single-window clearance.',
      summary: { licenses: '6 required + 2 recommended', time: '3-6 months', cost: 'RM10K-50K (licenses only)' },
      required: [
        { name: 'Company Registration', dept: 'SSM', detail: 'Register business entity. Foreign-owned F&B may need WRT (Wholesale & Retail Trade) license from KPDNHEP.', time: '2-4 weeks', cost: 'RM1K-5K' },
        { name: 'PBT Business Premise License', dept: 'Majlis Perbandaran / Daerah', detail: 'Food premise license from local council. Requires premises inspection. Zoning must allow F&B — not all "commercial" lots qualify.', time: '2-6 weeks', cost: 'RM300-3K/year', warn: 'Not all commercial zones allow F&B' },
        { name: 'Food Handler Certificate', dept: 'MOH (Kementerian Kesihatan)', detail: 'ALL food handlers must attend Typhoid Injection + Food Handler Course. Certificate valid 1 year. No exceptions.', time: '1-2 weeks', cost: 'RM50-100/person' },
        { name: 'Food Premise License', dept: 'MOH / Pejabat Kesihatan Daerah', detail: 'Separate from PBT license. Health inspection of kitchen, storage, waste disposal. Grade A/B/C displayed publicly.', time: '2-4 weeks', cost: 'RM200-500' },
        { name: 'Fire Certificate', dept: 'Bomba', detail: 'Mandatory for all F&B premises. Kitchen suppression system may be required for certain setups.', time: '2-4 weeks', cost: 'RM500-2K' },
        { name: 'Signboard License', dept: 'PBT', detail: 'Separate license for your restaurant signage. Size, placement, and illumination regulated by local council.', time: '1-2 weeks', cost: 'RM100-500/year' },
      ],
      recommended: [
        { name: 'Halal Certification', dept: 'JAKIM / JAIN', detail: 'Strongly recommended for wider market appeal. Muslim-majority country — halal cert significantly increases customer base.', time: '3-6 months', cost: 'RM1K-5K' },
        { name: 'Liquor License (if applicable)', dept: 'PBT + Customs', detail: 'If serving alcohol. ONLY granted in non-Muslim majority areas. Some states (Kelantan, Terengganu) = near impossible. Annual renewal + customs duty.', time: '1-3 months', cost: 'RM500-5K/year', warn: 'Some states prohibit alcohol entirely' },
      ],
    },
    bm: {
      verdict: 'maybe',
      verdictText: 'Warga asing BOLEH buka F&B di Malaysia — tetapi memerlukan PELBAGAI lesen dari jabatan berbeza. Rancang 3-6 bulan.',
      cnTrap: 'Di China, pelesenan F&B berpusat melalui satu pihak berkuasa. Di Malaysia, perlu lesen BERASINGAN dari PBT, KKM, Bomba, dan mungkin JAKIM (halal). Tiada kaunter sehenti.',
      summary: { licenses: '6 wajib + 2 disyorkan', time: '3-6 bulan', cost: 'RM10K-50K (lesen sahaja)' },
      required: [
        { name: 'Pendaftaran Syarikat', dept: 'SSM', detail: 'Daftar entiti perniagaan. F&B milik asing mungkin perlu lesen WRT dari KPDNHEP.', time: '2-4 minggu', cost: 'RM1K-5K' },
        { name: 'Lesen Premis PBT', dept: 'Majlis Perbandaran', detail: 'Lesen premis makanan. Perlu pemeriksaan. Bukan semua zon "komersial" boleh F&B.', time: '2-6 minggu', cost: 'RM300-3K/tahun', warn: 'Bukan semua zon komersial boleh F&B' },
        { name: 'Sijil Pengendali Makanan', dept: 'KKM', detail: 'SEMUA pengendali makanan perlu suntikan Tifoid + Kursus Pengendali Makanan.', time: '1-2 minggu', cost: 'RM50-100/orang' },
        { name: 'Lesen Premis Makanan', dept: 'KKM / Pejabat Kesihatan Daerah', detail: 'Berasingan dari PBT. Pemeriksaan kesihatan dapur, penyimpanan, buangan sisa.', time: '2-4 minggu', cost: 'RM200-500' },
        { name: 'Sijil Bomba', dept: 'Bomba', detail: 'Wajib untuk semua premis F&B. Sistem penindasan dapur mungkin diperlukan.', time: '2-4 minggu', cost: 'RM500-2K' },
        { name: 'Lesen Papan Tanda', dept: 'PBT', detail: 'Lesen berasingan untuk papan tanda restoran anda.', time: '1-2 minggu', cost: 'RM100-500/tahun' },
      ],
      recommended: [
        { name: 'Pensijilan Halal', dept: 'JAKIM / JAIN', detail: 'Sangat digalakkan. Negara majoriti Muslim — sijil halal meningkatkan pelanggan.', time: '3-6 bulan', cost: 'RM1K-5K' },
        { name: 'Lesen Arak (jika berkenaan)', dept: 'PBT + Kastam', detail: 'Jika hidang alkohol. HANYA di kawasan bukan majoriti Muslim. Sesetengah negeri = hampir mustahil.', time: '1-3 bulan', cost: 'RM500-5K/tahun', warn: 'Sesetengah negeri larang arak sepenuhnya' },
      ],
    },
    zh: {
      verdict: 'maybe',
      verdictText: '外国人可以在马来西亚开餐饮——但需要从多个部门获取多个许可证。提前规划3-6个月。',
      cnTrap: '在中国，食品经营许可通过市场监督管理局一个部门办理。在马来西亚，需要分别从PBT、卫生部、消防局，可能还有JAKIM（清真）获取许可。没有一站式服务。',
      summary: { licenses: '6项必需 + 2项建议', time: '3-6个月', cost: 'RM1万-5万（仅许可证）' },
      required: [
        { name: '公司注册', dept: 'SSM', detail: '注册商业实体。外资餐饮可能需要KPDNHEP的WRT执照。', time: '2-4周', cost: 'RM1千-5千' },
        { name: 'PBT营业场所执照', dept: '市/县议会', detail: '地方议会的食品场所执照。需场地检查。并非所有"商业"区都允许餐饮。', time: '2-6周', cost: 'RM300-3千/年', warn: '不是所有商业区都允许餐饮' },
        { name: '食品处理员证书', dept: '卫生部 (MOH)', detail: '所有食品处理员必须接种伤寒疫苗+完成食品处理课程。证书有效期1年。无例外。', time: '1-2周', cost: 'RM50-100/人' },
        { name: '食品场所许可证', dept: '卫生部/区卫生办公室', detail: '与PBT执照分开。厨房、储存、废物处理的卫生检查。等级A/B/C公开展示。', time: '2-4周', cost: 'RM200-500' },
        { name: '消防证书', dept: '消防与救援局 (Bomba)', detail: '所有餐饮场所必需。某些设置可能需要厨房灭火系统。', time: '2-4周', cost: 'RM500-2千' },
        { name: '招牌许可证', dept: 'PBT', detail: '餐厅招牌的单独许可证。尺寸、位置和照明由地方议会管理。', time: '1-2周', cost: 'RM100-500/年' },
      ],
      recommended: [
        { name: '清真认证', dept: 'JAKIM / JAIN', detail: '强烈建议。穆斯林占多数的国家——清真认证显著扩大客户群。', time: '3-6个月', cost: 'RM1千-5千' },
        { name: '酒类许可证（如适用）', dept: 'PBT + 海关', detail: '如供应酒精。仅限非穆斯林多数区域。部分州（吉兰丹、登嘉楼）几乎不可能。', time: '1-3个月', cost: 'RM500-5千/年', warn: '部分州完全禁酒' },
      ],
    },
  },
  setupFactory: {
    en: {
      verdict: 'maybe',
      verdictText: 'Foreign companies CAN set up factories in Malaysia — it\'s actively encouraged by MIDA. But the licensing process involves 8+ departments.',
      cnTrap: 'In China, factory setup in industrial zones (工业园区) is streamlined with government support. In Malaysia, you must separately approach MIDA, DOE, DOSH, PBT, Bomba, TNB, Imigresen, and SSM. There is NO single-window service. Hire a local compliance consultant.',
      summary: { licenses: '8 required + 2 recommended', time: '6-18 months', cost: 'RM100K-500K+ (setup compliance)' },
      required: [
        { name: 'MIDA Manufacturing License', dept: 'MIDA', detail: 'Required if capital ≥RM2.5M or ≥75 workers. Apply via InvestMalaysia portal. Can unlock Pioneer Status (tax holiday) or ITA.', time: '2-4 months', cost: 'Free to apply' },
        { name: 'SSM Company Registration', dept: 'SSM', detail: 'Register Malaysian entity (Sdn Bhd). Foreign ownership: up to 100% allowed in manufacturing (most sectors).', time: '2-4 weeks', cost: 'RM1K-5K' },
        { name: 'DOE Environmental License', dept: 'Jabatan Alam Sekitar', detail: 'EIA for prescribed activities. Written approval (WA) for non-prescribed. Scheduled waste registration if applicable.', time: '3-6 months', cost: 'RM10K-100K' },
        { name: 'Factory & Machinery Registration', dept: 'DOSH', detail: 'Register under FMA 1967. Certificate of Fitness for pressure vessels, hoists, cranes. OSHA compliance.', time: '1-3 months', cost: 'RM2K-10K' },
        { name: 'PBT Business License', dept: 'Majlis Perbandaran', detail: 'Business premise license. Factory must be in properly zoned industrial land.', time: '2-4 weeks', cost: 'RM500-5K/year' },
        { name: 'Fire Certificate', dept: 'Bomba', detail: 'Fire cert required. Factories storing chemicals need additional hazmat compliance.', time: '2-6 weeks', cost: 'RM1K-5K' },
        { name: 'TNB Industrial Power', dept: 'TNB (Tenaga Nasional)', detail: '3-phase industrial power application. High deposit required. May need substation for large factories.', time: '3-6 months', cost: 'RM50K-500K (deposit + installation)', warn: 'Long wait — apply FIRST' },
        { name: 'Foreign Worker Permits', dept: 'Imigresen + MOHR', detail: 'FWCMS application. Quota depends on sector and factory size. Workers housing compliance (Act 446) mandatory.', time: '2-6 months', cost: 'RM1.8K-2.5K/worker/year' },
      ],
      recommended: [
        { name: 'Environmental Liability Insurance', dept: 'Licensed insurer', detail: 'Landlord AND tenant are liable under EQA 1974. Covers cleanup costs, fines, third-party claims.', cost: 'RM5K-20K/year' },
        { name: 'Customs/FTZ Registration', dept: 'Royal Malaysian Customs', detail: 'If in Free Trade Zone or Licensed Manufacturing Warehouse. Tax exemptions on raw materials and machinery imports.', time: '1-3 months', cost: 'RM2K-10K' },
      ],
    },
    bm: {
      verdict: 'maybe',
      verdictText: 'Syarikat asing BOLEH tubuhkan kilang di Malaysia — digalakkan oleh MIDA. Tetapi melibatkan 8+ jabatan.',
      cnTrap: 'Di China, penubuhan kilang di zon perindustrian dipermudahkan. Di Malaysia, perlu mohon secara berasingan ke MIDA, JAS, JKKP, PBT, Bomba, TNB, Imigresen, dan SSM. TIADA kaunter sehenti.',
      summary: { licenses: '8 wajib + 2 disyorkan', time: '6-18 bulan', cost: 'RM100K-500K+' },
      required: [
        { name: 'Lesen Pembuatan MIDA', dept: 'MIDA', detail: 'Diperlukan jika modal ≥RM2.5J atau ≥75 pekerja. Mohon melalui InvestMalaysia.', time: '2-4 bulan', cost: 'Percuma' },
        { name: 'Pendaftaran Syarikat SSM', dept: 'SSM', detail: 'Daftar Sdn Bhd. Pemilikan asing sehingga 100% dibenarkan dalam pembuatan.', time: '2-4 minggu', cost: 'RM1K-5K' },
        { name: 'Lesen Alam Sekitar DOE', dept: 'JAS', detail: 'EIA untuk aktiviti yang ditetapkan. Pendaftaran sisa berjadual jika berkenaan.', time: '3-6 bulan', cost: 'RM10K-100K' },
        { name: 'Pendaftaran Kilang & Jentera', dept: 'JKKP', detail: 'Daftar di bawah AKJ 1967. Sijil Kesesuaian untuk vesel tekanan, kren.', time: '1-3 bulan', cost: 'RM2K-10K' },
        { name: 'Lesen Perniagaan PBT', dept: 'Majlis Perbandaran', detail: 'Kilang mesti di tanah perindustrian yang dizonkan.', time: '2-4 minggu', cost: 'RM500-5K/tahun' },
        { name: 'Sijil Bomba', dept: 'Bomba', detail: 'Kilang simpan bahan kimia perlu pematuhan hazmat tambahan.', time: '2-6 minggu', cost: 'RM1K-5K' },
        { name: 'Kuasa Industri TNB', dept: 'TNB', detail: 'Permohonan kuasa 3 fasa. Deposit tinggi. Mungkin perlu pencawang.', time: '3-6 bulan', cost: 'RM50K-500K', warn: 'Lama — mohon DULU' },
        { name: 'Permit Pekerja Asing', dept: 'Imigresen + MOHR', detail: 'Permohonan FWCMS. Pematuhan perumahan (Akta 446) wajib.', time: '2-6 bulan', cost: 'RM1.8K-2.5K/pekerja/tahun' },
      ],
      recommended: [
        { name: 'Insurans Liabiliti Alam Sekitar', dept: 'Penanggung insurans', detail: 'Tuan rumah DAN penyewa bertanggungjawab di bawah AKS 1974.', cost: 'RM5K-20K/tahun' },
        { name: 'Pendaftaran Kastam/ZPB', dept: 'Kastam DiRaja Malaysia', detail: 'Jika dalam Zon Perdagangan Bebas. Pengecualian cukai bahan mentah.', time: '1-3 bulan', cost: 'RM2K-10K' },
      ],
    },
    zh: {
      verdict: 'maybe',
      verdictText: '外国公司可以在马来西亚建厂——MIDA积极鼓励。但许可流程涉及8个以上部门。',
      cnTrap: '在中国，工业园区建厂流程精简且有政府支持。在马来西亚，需要分别向MIDA、环境局、DOSH、PBT、消防局、TNB、移民局和SSM申请。没有一站式服务。建议聘请本地合规顾问。',
      summary: { licenses: '8项必需 + 2项建议', time: '6-18个月', cost: 'RM10万-50万+（合规设置）' },
      required: [
        { name: 'MIDA制造业许可证', dept: 'MIDA', detail: '资本≥RM250万或≥75名工人时需要。通过InvestMalaysia门户申请。可享先锋地位税收优惠。', time: '2-4个月', cost: '免费申请' },
        { name: 'SSM公司注册', dept: 'SSM', detail: '注册马来西亚实体（Sdn Bhd）。制造业允许外资100%持股（大多数行业）。', time: '2-4周', cost: 'RM1千-5千' },
        { name: 'DOE环境许可证', dept: '环境局', detail: '规定活动需EIA。非规定活动需书面批准。危险废物需另行注册。', time: '3-6个月', cost: 'RM1万-10万' },
        { name: '工厂与机械注册', dept: 'DOSH', detail: '根据《1967年工厂与机械法》注册。压力容器、起重机需适用证书。', time: '1-3个月', cost: 'RM2千-1万' },
        { name: 'PBT营业执照', dept: '市议会', detail: '工厂必须在正确分区的工业用地上。', time: '2-4周', cost: 'RM500-5千/年' },
        { name: '消防证书', dept: '消防局', detail: '存储化学品的工厂需额外危险品合规。', time: '2-6周', cost: 'RM1千-5千' },
        { name: 'TNB工业电力', dept: 'TNB（国家能源）', detail: '三相工业电力申请。高额押金。大型工厂可能需要变电站。', time: '3-6个月', cost: 'RM5万-50万（押金+安装）', warn: '耗时长——优先申请' },
        { name: '外劳许可证', dept: '移民局 + 人力资源部', detail: 'FWCMS申请。配额取决于行业和工厂规模。工人住房合规（第446号法令）强制执行。', time: '2-6个月', cost: 'RM1.8千-2.5千/工人/年' },
      ],
      recommended: [
        { name: '环境责任保险', dept: '持牌保险公司', detail: '《1974年环境质量法》规定房东和租户双方均有责任。', cost: 'RM5千-2万/年' },
        { name: '海关/自贸区注册', dept: '皇家海关', detail: '若在自由贸易区或许可制造仓库内。原材料和机械进口免税。', time: '1-3个月', cost: 'RM2千-1万' },
      ],
    },
  },
};

// ===== CAN I DO THIS — COMPONENT =====
function LegalBridge({ lang, onClose }) {
  const t = L[lang];
  const [goal, setGoal] = useState(null);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (idx) => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));

  const goals = [
    { section: t.bridgeRent, items: [
      { id: 'rentHouse', icon: '🏠', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', title: t.bridgeRentHouse, desc: t.bridgeRentHouseDesc },
      { id: 'rentOffice', icon: '🏢', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', title: t.bridgeRentOffice, desc: t.bridgeRentOfficeDesc },
      { id: 'rentFactory', icon: '🏭', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', title: t.bridgeRentFactory, desc: t.bridgeRentFactoryDesc },
    ]},
    { section: t.bridgeBuy, items: [
      { id: 'buyHouse', icon: '🏡', gradient: 'linear-gradient(135deg, #16a34a, #4ade80)', title: t.bridgeBuyHouse, desc: t.bridgeBuyHouseDesc },
      { id: 'buyLand', icon: '🌍', gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', title: t.bridgeBuyLand, desc: t.bridgeBuyLandDesc },
    ]},
    { section: t.bridgeOperate, items: [
      { id: 'openFnb', icon: '🍜', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)', title: t.bridgeOpenFnb, desc: t.bridgeOpenFnbDesc },
      { id: 'setupFactory', icon: '⚙️', gradient: 'linear-gradient(135deg, #14b8a6, #2dd4bf)', title: t.bridgeSetupFactory, desc: t.bridgeSetupFactoryDesc },
    ]},
  ];

  // SCREEN 1: Goal picker
  if (!goal) {
    return (
      <Modal>
        <ToolHeader icon="⚖️" title={t.bridgeTitle} desc={t.bridgeDesc} onClose={onClose} />
        <p className="text-[13px] font-medium mb-1" style={{ color: '#334155' }}>{t.bridgePick}</p>
        <p className="text-[11px] mb-4" style={{ color: '#94a3b8' }}>{t.bridgePickSub}</p>
        {goals.map((group, gi) => (
          <div key={gi}>
            <div className="text-[10px] font-bold uppercase tracking-widest mt-4 mb-2" style={{ color: '#94a3b8' }}>{group.section}</div>
            {group.items.map(g => (
              <button key={g.id} onClick={() => setGoal(g.id)}
                className="w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-[14px] bg-white card-hover mb-2"
                style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: g.gradient }}>
                  <span className="text-lg">{g.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold" style={{ color: '#1e293b' }}>{g.title}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: '#94a3b8' }}>{g.desc}</div>
                </div>
                <span style={{ color: '#cbd5e1', fontSize: 14 }}>›</span>
              </button>
            ))}
          </div>
        ))}
        <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
          <span className="text-[9px]" style={{ color: '#94a3b8' }}>{t.bridgeNote}</span>
        </div>
      </Modal>
    );
  }

  // SCREEN 2: Compliance Roadmap
  const data = COMPLIANCE_GOALS[goal]?.[lang];
  if (!data) { setGoal(null); return null; }

  const verdictColor = data.verdict === 'yes' ? { bg: '#f0fdf4', border: '#bbf7d0', label: '#15803d', text: '#166534' }
    : data.verdict === 'no' ? { bg: '#fef2f2', border: '#fecaca', label: '#dc2626', text: '#991b1b' }
    : { bg: '#fffbeb', border: '#fde68a', label: '#92400e', text: '#78350f' };
  const verdictLabel = data.verdict === 'yes' ? t.bridgeVerdictYes : data.verdict === 'no' ? t.bridgeVerdictNo : t.bridgeVerdictMaybe;

  const downloadChecklist = () => {
    let text = `${t.bridgeTitle} — Compliance Checklist\n${'='.repeat(50)}\n\n`;
    text += `${verdictLabel}\n${data.verdictText}\n\n`;
    text += `--- ${t.bridgeRequired} ---\n`;
    data.required.forEach((item, i) => {
      text += `\n${i + 1}. ${item.name}\n   ${t.bridgeDept}: ${item.dept}\n   ${item.detail}\n`;
      if (item.time) text += `   ${t.bridgeTimeline}: ${item.time}\n`;
      if (item.cost) text += `   ${t.bridgeCost}: ${item.cost}\n`;
      if (item.warn) text += `   ⚠️ ${item.warn}\n`;
    });
    if (data.recommended?.length) {
      text += `\n--- ${t.bridgeRecommended} ---\n`;
      data.recommended.forEach((item, i) => {
        text += `\n${data.required.length + i + 1}. ${item.name}\n   ${t.bridgeDept}: ${item.dept}\n   ${item.detail}\n`;
        if (item.time) text += `   ${t.bridgeTimeline}: ${item.time}\n`;
        if (item.cost) text += `   ${t.bridgeCost}: ${item.cost}\n`;
      });
    }
    text += `\n--- Summary ---\n${t.bridgeTotalLicenses}: ${data.summary.licenses}\n${t.bridgeTotalTime}: ${data.summary.time}\n${t.bridgeTotalCost}: ${data.summary.cost}\n`;
    text += `\n${t.bridgeNote}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `find-ai-compliance-checklist.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal>
      <ToolHeader icon="⚖️" title={t.bridgeTitle} desc={t.bridgeDesc} onClose={() => setGoal(null)} />

      {/* Verdict */}
      <div className="rounded-[14px] p-4 mb-3" style={{ background: verdictColor.bg, border: `1px solid ${verdictColor.border}` }}>
        <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: verdictColor.label }}>
          {data.verdict === 'maybe' ? '⚠️' : data.verdict === 'yes' ? '✅' : '🚫'} {verdictLabel}
        </div>
        <p className="text-[12px] font-semibold leading-relaxed" style={{ color: verdictColor.text }}>{data.verdictText}</p>
      </div>

      {/* China Trap */}
      <div className="rounded-[14px] p-3.5 mb-4" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
        <div className="text-[10px] font-bold mb-1 flex items-center gap-1" style={{ color: '#991b1b' }}>🇨🇳 {t.bridgeCNTrap}</div>
        <p className="text-[11px] leading-relaxed" style={{ color: '#7f1d1d' }}>{data.cnTrap}</p>
      </div>

      {/* Required */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ background: '#dc2626', color: 'white' }}>{t.bridgeRequired}</span>
          <span className="text-[11px] font-semibold" style={{ color: '#334155' }}>{t.bridgeRequiredSub}</span>
        </div>
        {data.required.map((item, idx) => (
          <div key={idx} className="rounded-[10px] mb-1.5 overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
            <button onClick={() => toggleExpand(`r${idx}`)} className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left" style={{ background: expanded[`r${idx}`] ? '#f8fafc' : 'white' }}>
              <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>{idx + 1}</span>
              <div className="flex-1">
                <div className="text-[12px] font-semibold" style={{ color: '#1e293b' }}>{item.name}</div>
                <div className="text-[10px] mt-0.5 font-medium" style={{ color: '#3b82f6' }}>→ {item.dept}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ transform: expanded[`r${idx}`] ? 'rotate(180deg)' : '', transition: 'transform 0.2s', flexShrink: 0, marginTop: 4 }}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {expanded[`r${idx}`] && (
              <div className="px-3 pb-3 fade-in">
                <p className="text-[11px] leading-relaxed mb-2" style={{ color: '#475569' }}>{item.detail}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.time && <span className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: '#f1f5f9', color: '#475569' }}>⏱ {item.time}</span>}
                  {item.cost && <span className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: '#eff6ff', color: '#2563eb' }}>💰 {item.cost}</span>}
                  {item.warn && <span className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: '#fef2f2', color: '#dc2626' }}>⚠️ {item.warn}</span>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommended */}
      {data.recommended?.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ background: '#f59e0b', color: 'white' }}>{t.bridgeRecommended}</span>
            <span className="text-[11px] font-semibold" style={{ color: '#334155' }}>{t.bridgeRecommendedSub}</span>
          </div>
          {data.recommended.map((item, idx) => (
            <div key={idx} className="rounded-[10px] mb-1.5 overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
              <button onClick={() => toggleExpand(`c${idx}`)} className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left" style={{ background: expanded[`c${idx}`] ? '#f8fafc' : 'white' }}>
                <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }}>{data.required.length + idx + 1}</span>
                <div className="flex-1">
                  <div className="text-[12px] font-semibold" style={{ color: '#1e293b' }}>{item.name}</div>
                  <div className="text-[10px] mt-0.5 font-medium" style={{ color: '#3b82f6' }}>→ {item.dept}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ transform: expanded[`c${idx}`] ? 'rotate(180deg)' : '', transition: 'transform 0.2s', flexShrink: 0, marginTop: 4 }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {expanded[`c${idx}`] && (
                <div className="px-3 pb-3 fade-in">
                  <p className="text-[11px] leading-relaxed mb-2" style={{ color: '#475569' }}>{item.detail}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.time && <span className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: '#f1f5f9', color: '#475569' }}>⏱ {item.time}</span>}
                    {item.cost && <span className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: '#eff6ff', color: '#2563eb' }}>💰 {item.cost}</span>}
                    {item.warn && <span className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: '#fef2f2', color: '#dc2626' }}>⚠️ {item.warn}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Timeline (if available) */}
      {data.timeline && (
        <div className="mb-3">
          <div className="text-[11px] font-bold mb-2 flex items-center gap-1" style={{ color: '#334155' }}>📅 {t.bridgeTimeline2}</div>
          {data.timeline.map((item, idx) => (
            <div key={idx} className="flex gap-2.5 mb-0.5">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: idx === data.timeline.length - 1 ? '#16a34a' : idx === 0 ? '#3b82f6' : '#f59e0b' }} />
                {idx < data.timeline.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ background: '#e2e8f0' }} />}
              </div>
              <div className="pb-3">
                <div className="text-[11px] font-semibold" style={{ color: '#1e293b' }}>{item.step}</div>
                <div className="text-[10px] mt-0.5" style={{ color: '#64748b' }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="rounded-[14px] p-4 mb-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <div className="flex justify-between mb-1.5"><span className="text-[11px]" style={{ color: '#64748b' }}>{t.bridgeTotalLicenses}</span><span className="text-[11px] font-bold" style={{ color: '#0f172a' }}>{data.summary.licenses}</span></div>
        <div className="flex justify-between mb-1.5"><span className="text-[11px]" style={{ color: '#64748b' }}>{t.bridgeTotalTime}</span><span className="text-[11px] font-bold" style={{ color: '#0f172a' }}>{data.summary.time}</span></div>
        <div className="flex justify-between"><span className="text-[11px]" style={{ color: '#64748b' }}>{t.bridgeTotalCost}</span><span className="text-[13px] font-bold" style={{ color: '#0f172a' }}>{data.summary.cost}</span></div>
      </div>

      {/* Actions */}
      <button onClick={downloadChecklist} className="w-full py-3 rounded-xl text-[12px] font-semibold text-white mb-2" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>📥 {t.bridgeDownload}</button>
      <button onClick={() => { setGoal(null); setExpanded({}); }} className="w-full py-2.5 rounded-xl text-[11px] font-medium" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>← {t.bridgeBack}</button>

      <div className="text-center mt-3"><span className="text-[9px]" style={{ color: '#94a3b8' }}>{t.bridgeNote}</span></div>
    </Modal>
  );
}


// ===== MAIN EXPORT =====
export default function Calculators({ lang, onClose }) {
  const [active, setActive] = useState(null);
  const t = L[lang];

  if (active === 'stamp') return <StampDutyCalc lang={lang} onClose={() => setActive(null)} />;
  if (active === 'yield') return <RentalYieldCalc lang={lang} onClose={() => setActive(null)} />;
  if (active === 'screen') return <TenantScreen lang={lang} onClose={() => setActive(null)} />;
  if (active === 'health') return <AgreementHealth lang={lang} onClose={() => setActive(null)} />;
  if (active === 'vault') return <EvidenceVault lang={lang} onClose={() => setActive(null)} />;
  if (active === 'trust') return <CNMYTrustLink lang={lang} onClose={() => setActive(null)} />;
  if (active === 'navigator') return <SituationNavigator lang={lang} onClose={() => setActive(null)} />;
  if (active === 'bridge') return <LegalBridge lang={lang} onClose={() => setActive(null)} />;

  const categories = [
    {
      label: lang === 'en' ? 'Calculators' : lang === 'bm' ? 'Kalkulator' : '计算器',
      tools: [
        { id: 'stamp', icon: '📄', title: t.stampTitle, desc: t.stampDesc },
        { id: 'yield', icon: '📊', title: t.yieldTitle, desc: t.yieldDesc },
      ],
    },
    {
      label: lang === 'en' ? 'Risk & Compliance' : lang === 'bm' ? 'Risiko & Pematuhan' : '风险与合规',
      tools: [
        { id: 'screen', icon: '🔍', title: t.screenTitle, desc: t.screenDesc },
        { id: 'health', icon: '📋', title: t.healthTitle, desc: t.healthDesc },
        { id: 'trust', icon: '🇨🇳', title: t.trustTitle, desc: t.trustDesc },
      ],
    },
    {
      label: lang === 'en' ? 'Protection & Legal' : lang === 'bm' ? 'Perlindungan & Undang-undang' : '保护与法律',
      tools: [
        { id: 'vault', icon: '🔒', title: t.vaultTitle, desc: t.vaultDesc },
        { id: 'navigator', icon: '🧭', title: t.navTitle, desc: t.navDesc },
        { id: 'bridge', icon: '⚖️', title: t.bridgeTitle, desc: t.bridgeDesc },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white w-full max-w-lg rounded-t-[24px] sm:rounded-[20px] px-6 pt-5 pb-6 max-h-[88vh] overflow-y-auto fade-in" style={{ boxShadow: '0 -8px 40px rgba(15,23,42,0.12)' }}>
        {/* Drag handle */}
        <div className="flex justify-center mb-3 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ background: '#e2e8f0' }} />
        </div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[18px] font-bold" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>{t.tools}</h3>
          <CloseBtn onClick={onClose} />
        </div>

        {categories.map((cat, ci) => (
          <div key={ci} className={ci > 0 ? 'mt-5' : ''}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2.5 pl-1" style={{ color: '#cbd5e1' }}>{cat.label}</div>
            <div className="space-y-2">
              {cat.tools.map(tool => (
                <button key={tool.id} onClick={() => setActive(tool.id)}
                  className="w-full flex items-center gap-3.5 text-left px-4 py-3.5 rounded-2xl transition active:scale-[0.98]"
                  style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
                  <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: '#fff', border: '1px solid #edf0f4' }}>{tool.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold" style={{ color: '#0f172a' }}>{tool.title}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>{tool.desc}</div>
                  </div>
                  <svg className="flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Shield security strip */}
        <div className="flex items-center justify-center gap-1.5 mt-5 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span className="text-[9px] font-medium" style={{ color: '#cbd5e1' }}>All data encrypted & stored on your device</span>
        </div>
      </div>
    </div>
  );
}
