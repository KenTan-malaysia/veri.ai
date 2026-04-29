'use client';

import { useState } from 'react';

// ===== SHARED =====
const CloseBtn = ({ onClick }) => (
  <button onClick={onClick} className="text-gray-400 hover:text-gray-600 p-1">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
);

const ToolHeader = ({ icon, gradient, title, desc, onClose }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: gradient }}>
        <span className="text-lg">{icon}</span>
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <p className="text-[11px] text-gray-400">{desc}</p>
      </div>
    </div>
    <CloseBtn onClick={onClose} />
  </div>
);

const Modal = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
    <div className="bg-white w-full max-w-lg rounded-t-[20px] sm:rounded-[20px] p-6 max-h-[90vh] overflow-y-auto fade-in">
      {children}
    </div>
  </div>
);

const RMInput = ({ value, onChange, placeholder, label }) => (
  <div>
    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{label}</label>
    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3">
      <span className="text-sm text-gray-400 font-medium">RM</span>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-transparent text-lg font-semibold text-gray-900 focus:outline-none" />
    </div>
  </div>
);

// ===== LABELS =====
const L = {
  en: {
    tools: 'Property Tools',
    stampTitle: 'Stamp Duty Calculator', stampDesc: 'Tenancy agreement stamp duty',
    yieldTitle: 'Rental Yield Calculator', yieldDesc: 'Is your property worth it?',
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
    annualRent: 'Annual Rent', purchasePrice: 'Purchase Price (RM)',
    monthlyExpenses: 'Monthly Expenses (RM)', expensesHint: 'Maintenance, insurance, assessment, quit rent',
    grossYield: 'Gross Yield', netYield: 'Net Yield',
    annualProfit: 'Annual Net Profit', monthlyProfit: 'Monthly Net Profit',
    verdict: 'Verdict',
    verdictGood: 'Good investment — above market average',
    verdictOk: 'Average — consider if appreciation potential exists',
    verdictWeak: 'Below average — review your rental pricing or expenses',
    calculate: 'Calculate',
  },
  bm: {
    tools: 'Alat Hartanah',
    stampTitle: 'Kalkulator Duti Setem', stampDesc: 'Duti setem perjanjian sewa',
    yieldTitle: 'Kalkulator Pulangan Sewa', yieldDesc: 'Adakah hartanah anda berbaloi?',
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
    annualRent: 'Sewa Tahunan', purchasePrice: 'Harga Belian (RM)',
    monthlyExpenses: 'Perbelanjaan Bulanan (RM)', expensesHint: 'Penyelenggaraan, insurans, cukai taksiran',
    grossYield: 'Pulangan Kasar', netYield: 'Pulangan Bersih',
    annualProfit: 'Untung Tahunan', monthlyProfit: 'Untung Bulanan',
    verdict: 'Keputusan',
    verdictGood: 'Pelaburan baik — melebihi purata pasaran',
    verdictOk: 'Sederhana — pertimbangkan potensi kenaikan nilai',
    verdictWeak: 'Di bawah purata — semak harga sewa atau perbelanjaan',
    calculate: 'Kira',
  },
  zh: {
    tools: '房产工具',
    stampTitle: '印花税计算器', stampDesc: '租约印花税',
    yieldTitle: '租金回报计算器', yieldDesc: '您的房产值得投资吗？',
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
    annualRent: '年租金', purchasePrice: '购买价格 (RM)',
    monthlyExpenses: '每月支出 (RM)', expensesHint: '管理费、保险、门牌税、地税',
    grossYield: '毛回报率', netYield: '净回报率',
    annualProfit: '年净利润', monthlyProfit: '月净利润',
    verdict: '评估',
    verdictGood: '好投资 — 高于市场平均',
    verdictOk: '一般 — 考虑升值潜力',
    verdictWeak: '低于平均 — 检查租金或支出',
    calculate: '计算',
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
      <ToolHeader icon="📄" gradient="linear-gradient(135deg, #f59e0b, #eab308)" title={t.stampTitle} desc={t.stampDesc} onClose={onClose} />
      <div className="space-y-4">
        <RMInput value={rent} onChange={(v) => { setRent(v); setResult(null); }} placeholder="2500" label={t.monthlyRent} />
        <div>
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t.leaseDuration}</label>
          <div className="flex gap-2">
            {yv.map((y, i) => (
              <button key={y} onClick={() => { setYears(y); setResult(null); }}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-medium transition border ${years === y ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                {t.years[i]}
              </button>
            ))}
          </div>
        </div>
        <button onClick={calc} disabled={!rent} className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #f59e0b, #eab308)' }}>{t.calculate}</button>
      </div>
      {result && (
        <div className="mt-5 space-y-3 fade-in">
          {/* Main duty result */}
          <div className="p-4 rounded-[14px] border" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.stampResult}</div>
            <div className="text-2xl font-bold" style={{ color: '#92400e' }}>RM {result.duty.toFixed(2)}</div>
            <div className="text-[12px] text-gray-500 mt-2">{t.annualRent}: RM {result.annual.toLocaleString()}</div>
            <div className="text-[11px] text-gray-400 mt-1">{result.units} × RM{result.rate} {t.stampPerUnit}</div>
          </div>

          {/* SDSAS 2026 badge */}
          <div className="p-3 rounded-[12px] bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">SDSAS 2026</span>
            </div>
            <p className="text-[11px] text-blue-800">{t.sdsasNote}</p>
          </div>

          {/* Old vs New comparison */}
          {result.oldDuty > 0 && (
            <div className="p-3 rounded-[12px] bg-gray-50 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase">{t.oldDuty}</div>
                  <div className="text-sm font-semibold text-gray-500 line-through">RM {result.oldDuty.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase">{t.dutyIncrease}</div>
                  <div className="text-sm font-bold text-red-600">+RM {result.increase.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
          {result.oldDuty === 0 && (
            <div className="p-3 rounded-[12px] bg-red-50 border border-red-100">
              <p className="text-[11px] text-red-700 font-medium">{t.wasExempt}</p>
            </div>
          )}

          {/* Warnings */}
          <div className="pt-2 space-y-1.5">
            <p className="text-[11px] text-gray-500">⚠️ {t.stampNote}</p>
            <p className="text-[11px] text-gray-500">💡 {t.stampWho}</p>
            <p className="text-[11px] text-gray-500">📅 {t.stampDeadline}</p>
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
      <ToolHeader icon="📊" gradient="linear-gradient(135deg, #FF7E5F, #FEB47B)" title={t.yieldTitle} desc={t.yieldDesc} onClose={onClose} />
      <div className="space-y-4">
        <RMInput value={price} onChange={(val) => { setPrice(val); setResult(null); }} placeholder="500000" label={t.purchasePrice} />
        <RMInput value={rent} onChange={(val) => { setRent(val); setResult(null); }} placeholder="2500" label={t.monthlyRent} />
        <div>
          <RMInput value={expenses} onChange={(val) => { setExpenses(val); setResult(null); }} placeholder="350" label={t.monthlyExpenses} />
          <p className="text-[10px] text-gray-400 mt-1 pl-1">{t.expensesHint}</p>
        </div>
        <button onClick={calc} disabled={!price || !rent} className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>{t.calculate}</button>
      </div>
      {result && (
        <div className="mt-5 space-y-3 fade-in">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-[12px] bg-gray-50 text-center">
              <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{t.grossYield}</div>
              <div className="text-xl font-bold text-gray-900">{result.gross.toFixed(2)}%</div>
            </div>
            <div className="p-3.5 rounded-[12px] text-center" style={{ background: v(result.net).bg }}>
              <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{t.netYield}</div>
              <div className="text-xl font-bold" style={{ color: v(result.net).color }}>{result.net.toFixed(2)}%</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-[12px] bg-gray-50">
              <div className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">{t.annualProfit}</div>
              <div className="text-base font-bold">RM {result.annualProfit.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-[12px] bg-gray-50">
              <div className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">{t.monthlyProfit}</div>
              <div className="text-base font-bold">RM {result.monthlyProfit.toLocaleString()}</div>
            </div>
          </div>
          <div className="p-3.5 rounded-[12px] border" style={{ background: v(result.net).bg, borderColor: v(result.net).color + '30' }}>
            <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{t.verdict}</div>
            <div className="text-[13px] font-semibold" style={{ color: v(result.net).color }}>{v(result.net).text}</div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ===== MAIN EXPORT =====
export default function Calculators({ lang, onClose }) {
  const [active, setActive] = useState(null);
  const t = L[lang];

  if (active === 'stamp') return <StampDutyCalc lang={lang} onClose={() => setActive(null)} />;
  if (active === 'yield') return <RentalYieldCalc lang={lang} onClose={() => setActive(null)} />;

  const tools = [
    { id: 'stamp', icon: '📄', gradient: 'linear-gradient(135deg, #f59e0b, #eab308)', title: t.stampTitle, desc: t.stampDesc },
    { id: 'yield', icon: '📊', gradient: 'linear-gradient(135deg, #FF7E5F, #FEB47B)', title: t.yieldTitle, desc: t.yieldDesc },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white w-full max-w-lg rounded-t-[20px] sm:rounded-[20px] p-6 fade-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-900">{t.tools}</h3>
          <CloseBtn onClick={onClose} />
        </div>
        <div className="space-y-2.5">
          {tools.map(tool => (
            <button key={tool.id} onClick={() => setActive(tool.id)}
              className="w-full flex items-center gap-3 text-left px-4 py-4 rounded-[14px] border border-gray-100 bg-white card-hover"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: tool.gradient }}>
                <span className="text-lg">{tool.icon}</span>
              </div>
              <div>
                <div className="text-[14px] font-semibold text-gray-800">{tool.title}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{tool.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
