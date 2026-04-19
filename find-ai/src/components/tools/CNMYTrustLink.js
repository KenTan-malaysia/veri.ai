'use client';

import { useState, useCallback } from 'react';
import { Modal, ToolHeader, ActionBtn } from './shared';
import { L } from './labels';

// ===== TRAFFIC LIGHT COMPONENT =====
const TrafficLight = ({ color, label }) => {
  const colors = {
    green: { active: '#16a34a', glow: 'rgba(22,163,74,0.3)', ring: '#bbf7d0' },
    yellow: { active: '#f59e0b', glow: 'rgba(245,158,11,0.3)', ring: '#fde68a' },
    red: { active: '#dc2626', glow: 'rgba(220,38,38,0.3)', ring: '#fecaca' },
  };
  const c = colors[color] || colors.green;

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {/* Traffic light housing */}
      <div className="flex gap-3 px-5 py-3 rounded-full" style={{ background: '#1e293b' }}>
        {['red', 'yellow', 'green'].map(light => (
          <div key={light} className="w-8 h-8 rounded-full transition-all duration-500" style={{
            background: color === light ? colors[light].active : '#334155',
            boxShadow: color === light ? `0 0 16px ${colors[light].glow}, 0 0 4px ${colors[light].glow}` : 'inset 0 2px 4px rgba(0,0,0,0.3)',
            border: color === light ? `2px solid ${colors[light].ring}` : '2px solid #475569',
          }} />
        ))}
      </div>
      <span className="text-[12px] font-bold tracking-wide" style={{ color: c.active }}>{label}</span>
    </div>
  );
};

// ===== LOADING SPINNER =====
const Spinner = ({ text }) => (
  <div className="flex items-center gap-2 py-3 px-4 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#3b82f6', borderTopColor: 'transparent' }} />
    <span className="text-[12px] font-medium" style={{ color: '#64748b' }}>{text}</span>
  </div>
);

// ===== STATUS BADGE =====
const StatusBadge = ({ type, text }) => {
  const styles = {
    success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', icon: '✓' },
    warning: { bg: '#fffbeb', border: '#fde68a', color: '#92400e', icon: '!' },
    error: { bg: '#fef2f2', border: '#fecaca', color: '#dc2626', icon: '✕' },
  };
  const s = styles[type] || styles.warning;
  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-lg" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: s.color }}>{s.icon}</span>
      <span className="text-[11px] font-medium" style={{ color: s.color }}>{text}</span>
    </div>
  );
};

export default function CNMYTrustLink({ lang, onClose }) {
  const t = L[lang];
  const [uscc, setUscc] = useState('');
  const [usccValid, setUsccValid] = useState(null);
  const [mode, setMode] = useState('auto'); // 'auto' or 'manual'
  const [lookupState, setLookupState] = useState('idle'); // 'idle' | 'loading' | 'found' | 'notfound' | 'error'
  const [apiData, setApiData] = useState(null);
  const [company, setCompany] = useState({ name: '', nameEn: '', capital: '', taxRating: '', years: '', scope: '', abnormal: null, court: null });
  const [result, setResult] = useState(null);

  const validateUSCC = (code) => {
    const clean = code.replace(/\s/g, '').toUpperCase();
    setUscc(clean);
    if (clean.length === 0) { setUsccValid(null); setLookupState('idle'); return; }
    const valid = /^[0-9A-HJ-NP-RT-UW-Y]{18}$/.test(clean);
    setUsccValid(clean.length === 18 ? valid : null);
    setResult(null);

    // Auto-lookup when valid USCC and in auto mode
    if (clean.length === 18 && valid && mode === 'auto') {
      lookupUSCC(clean);
    }
  };

  const lookupUSCC = useCallback(async (code) => {
    setLookupState('loading');
    setApiData(null);
    setResult(null);

    try {
      const res = await fetch('/api/trust-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uscc: code }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLookupState('found');
        setApiData(data.data);
        // Auto-fill company details from API
        const c = data.data.company;
        const ts = data.data.trustScore;
        setCompany({
          name: c.nameCN || '',
          nameEn: c.nameEN || '',
          capital: c.registeredCapital?.amount?.toString() || '',
          taxRating: '', // API doesn't expose this directly in company, but we have the score
          years: c.yearsOperating?.toString() || '',
          scope: '',
          abnormal: null,
          court: null,
        });
        // Set result directly from API
        setResult({
          score: ts.score,
          grade: ts.grade,
          trafficLight: ts.trafficLight,
          risks: data.data.assessment.riskFactors || [],
          positives: data.data.assessment.positiveFactors || [],
          recommendation: data.data.assessment.recommendation || '',
          fromApi: true,
        });
      } else if (res.status === 404) {
        setLookupState('notfound');
      } else {
        setLookupState('error');
      }
    } catch (err) {
      setLookupState('error');
    }
  }, []);

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
    const trafficLight = grade === 'A' ? 'green' : grade === 'B' ? 'green' : grade === 'C' ? 'yellow' : 'red';
    setResult({ score, grade, trafficLight, risks, positives, fromApi: false });
  };

  const downloadReport = () => {
    if (!result) return;
    const gradeColors = { A: '#16a34a', B: '#3b82f6', C: '#f59e0b', D: '#dc2626' };
    const trafficColors = { green: '#16a34a', yellow: '#f59e0b', red: '#dc2626' };
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CN-MY Trust Report - ${uscc}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;padding:40px;max-width:800px;margin:0 auto;color:#1a1a1a;line-height:1.6}
.header{text-align:center;border-bottom:3px double #333;padding-bottom:20px;margin-bottom:30px}
.header h1{font-size:22px;letter-spacing:1px;margin-bottom:5px}.header h2{font-size:14px;color:#555;font-weight:normal}
.traffic{display:flex;justify-content:center;gap:12px;padding:16px;background:#1e293b;border-radius:40px;width:fit-content;margin:20px auto}
.light{width:36px;height:36px;border-radius:50%;border:2px solid #475569;background:#334155}
.light.active-green{background:#16a34a;border-color:#bbf7d0;box-shadow:0 0 16px rgba(22,163,74,0.4)}
.light.active-yellow{background:#f59e0b;border-color:#fde68a;box-shadow:0 0 16px rgba(245,158,11,0.4)}
.light.active-red{background:#dc2626;border-color:#fecaca;box-shadow:0 0 16px rgba(220,38,38,0.4)}
.grade-box{text-align:center;padding:20px;margin:20px 0;border:2px solid ${gradeColors[result.grade]};border-radius:8px}
.grade-letter{font-size:48px;font-weight:bold;color:${gradeColors[result.grade]}}
.section{margin-bottom:25px}.section h3{font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#555;border-bottom:1px solid #ddd;padding-bottom:5px;margin-bottom:10px}
.field{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}.field .label{color:#777}.field .value{font-weight:bold}
.risk{background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:12px;margin-bottom:8px;font-size:12px;color:#991b1b}
.pos{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:12px;margin-bottom:8px;font-size:12px;color:#166534}
.footer{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #ddd;font-size:11px;color:#999}</style></head>
<body>
<div class="header"><h1>CN-MY ENTERPRISE TRUST REPORT</h1><h2>Cross-Border Tenant Verification</h2></div>
<div class="traffic"><div class="light ${result.trafficLight === 'red' ? 'active-red' : ''}"></div><div class="light ${result.trafficLight === 'yellow' ? 'active-yellow' : ''}"></div><div class="light ${result.trafficLight === 'green' ? 'active-green' : ''}"></div></div>
<div class="grade-box"><div class="grade-letter">GRADE ${result.grade}</div><div style="font-size:14px;color:#555;margin-top:5px">Trust Score: ${result.score}/100</div></div>
<div class="section"><h3>Company Details</h3>
<div class="field"><span class="label">USCC</span><span class="value">${uscc}</span></div>
${company.name ? `<div class="field"><span class="label">Company (CN)</span><span class="value">${company.name}</span></div>` : ''}
${company.nameEn ? `<div class="field"><span class="label">Company (EN)</span><span class="value">${company.nameEn}</span></div>` : ''}
<div class="field"><span class="label">Paid-in Capital</span><span class="value">RMB ${parseFloat(company.capital||0).toLocaleString()}</span></div>
${company.taxRating ? `<div class="field"><span class="label">Tax Rating</span><span class="value">Grade ${company.taxRating}</span></div>` : ''}
<div class="field"><span class="label">Years in Operation</span><span class="value">${company.years || 'N/A'}</span></div>
${result.fromApi ? '<div class="field"><span class="label">Data Source</span><span class="value">Auto-verified via Trust Score API</span></div>' : ''}
</div>
${result.risks.length ? `<div class="section"><h3>Risk Factors</h3>${result.risks.map(r=>`<div class="risk">⚠️ ${r}</div>`).join('')}</div>` : ''}
${result.positives.length ? `<div class="section"><h3>Positive Factors</h3>${result.positives.map(p=>`<div class="pos">✅ ${p}</div>`).join('')}</div>` : ''}
${result.recommendation ? `<div class="section"><h3>Recommendation</h3><p style="font-size:13px;padding:12px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0">${result.recommendation}</p></div>` : ''}
<div class="section" style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:16px;font-size:12px"><h3 style="color:#92400e;border:none;padding:0;margin-bottom:8px">Disclaimer</h3><p>${t.trustDisclaimer}</p></div>
<div class="footer"><p>Generated by Find.ai — CN-MY Enterprise Trust Link</p><p>${new Date().toLocaleString('en-MY')}</p></div>
</body></html>`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = `Trust-Report-${uscc}-${new Date().toISOString().slice(0,10)}.html`;
    a.click();
  };

  const gradeStyle = {
    A: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    B: { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
    C: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
    D: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  };

  const trafficLabel = result?.trafficLight === 'green' ? t.trafficGreen : result?.trafficLight === 'yellow' ? t.trafficYellow : t.trafficRed;

  return (
    <Modal>
      <ToolHeader icon="🇨🇳" title={t.trustTitle} desc={t.trustDesc} onClose={onClose} />

      {/* Mode Toggle */}
      <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: '#f1f5f9' }}>
        <button onClick={() => { setMode('auto'); setResult(null); setLookupState('idle'); }}
          className="flex-1 py-2 rounded-lg text-[12px] font-semibold transition"
          style={mode === 'auto' ? { background: '#fff', color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: '#94a3b8' }}>
          {t.trustAuto}
        </button>
        <button onClick={() => { setMode('manual'); setResult(null); setLookupState('idle'); setApiData(null); }}
          className="flex-1 py-2 rounded-lg text-[12px] font-semibold transition"
          style={mode === 'manual' ? { background: '#fff', color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: '#94a3b8' }}>
          {t.trustManual}
        </button>
      </div>

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

        {/* Auto-lookup status */}
        {mode === 'auto' && lookupState === 'loading' && <Spinner text={t.trustLookup} />}
        {mode === 'auto' && lookupState === 'found' && <StatusBadge type="success" text={t.trustFound} />}
        {mode === 'auto' && lookupState === 'notfound' && (
          <div>
            <StatusBadge type="warning" text={t.trustNotFound} />
            <button onClick={() => { setMode('manual'); setLookupState('idle'); }}
              className="mt-2 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition"
              style={{ color: '#3b82f6', background: '#eff6ff' }}>
              {t.trustManual} →
            </button>
          </div>
        )}
        {mode === 'auto' && lookupState === 'error' && (
          <div>
            <StatusBadge type="error" text={t.trustOffline} />
            <div className="flex gap-2 mt-2">
              <button onClick={() => lookupUSCC(uscc)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition"
                style={{ color: '#3b82f6', background: '#eff6ff' }}>
                {t.trustRetry}
              </button>
              <button onClick={() => { setMode('manual'); setLookupState('idle'); }}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition"
                style={{ color: '#64748b', background: '#f1f5f9' }}>
                {t.trustManual} →
              </button>
            </div>
          </div>
        )}

        {/* Manual input fields — shown in manual mode or when API lookup fails */}
        {(mode === 'manual' || (mode === 'auto' && lookupState === 'idle' && !result)) && mode === 'manual' && (
          <>
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
          </>
        )}
      </div>

      {/* ===== RESULT SECTION ===== */}
      {result && (
        <div className="mt-4 space-y-3 fade-in">
          {/* Traffic Light */}
          <div className="rounded-[16px] overflow-hidden" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <TrafficLight color={result.trafficLight} label={trafficLabel} />
          </div>

          {/* Grade Card */}
          <div className="p-5 rounded-[14px] text-center" style={{ background: gradeStyle[result.grade].bg, border: `1.5px solid ${gradeStyle[result.grade].border}` }}>
            {result.fromApi && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full mb-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-[9px] font-semibold" style={{ color: '#3b82f6' }}>{t.trustAutoFill}</span>
              </div>
            )}
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748b' }}>{t.trustGrade}</div>
            <div className="text-4xl font-black mb-1" style={{ color: gradeStyle[result.grade].color }}>{result.grade}</div>
            <div className="text-[12px] font-medium mb-2" style={{ color: gradeStyle[result.grade].color }}>{t[`trust${result.grade}`]}</div>
            <div className="w-full rounded-full h-2 mt-3" style={{ background: '#e2e8f0' }}>
              <div className="h-2 rounded-full transition-all" style={{ width: `${result.score}%`, background: gradeStyle[result.grade].color }} />
            </div>
            <div className="text-[11px] mt-1" style={{ color: '#94a3b8' }}>{t.trustScore}: {result.score}/100</div>
          </div>

          {/* Company Info (for API results) */}
          {result.fromApi && company.name && (
            <div className="p-3 rounded-[12px] space-y-1" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className="text-[11px] font-bold mb-2" style={{ color: '#64748b' }}>
                {lang === 'en' ? 'Company Details' : lang === 'bm' ? 'Butiran Syarikat' : '公司信息'}
              </div>
              {company.name && <div className="flex justify-between text-[12px]"><span style={{ color: '#94a3b8' }}>{t.companyName}</span><span className="font-medium" style={{ color: '#0f172a' }}>{company.name}</span></div>}
              {company.nameEn && <div className="flex justify-between text-[12px]"><span style={{ color: '#94a3b8' }}>{t.companyNameEn}</span><span className="font-medium" style={{ color: '#0f172a' }}>{company.nameEn}</span></div>}
              {company.capital && <div className="flex justify-between text-[12px]"><span style={{ color: '#94a3b8' }}>{t.paidInCapital}</span><span className="font-medium" style={{ color: '#0f172a' }}>¥{parseFloat(company.capital).toLocaleString()}</span></div>}
              {company.years && <div className="flex justify-between text-[12px]"><span style={{ color: '#94a3b8' }}>{t.yearsOp}</span><span className="font-medium" style={{ color: '#0f172a' }}>{company.years} {lang === 'en' ? 'years' : lang === 'bm' ? 'tahun' : '年'}</span></div>}
            </div>
          )}

          {/* Recommendation (API only) */}
          {result.recommendation && (
            <div className="p-3 rounded-[12px]" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div className="text-[11px] font-bold mb-1" style={{ color: '#1d4ed8' }}>
                {lang === 'en' ? 'Recommendation' : lang === 'bm' ? 'Cadangan' : '建议'}
              </div>
              <p className="text-[12px]" style={{ color: '#1e40af' }}>{result.recommendation}</p>
            </div>
          )}

          {/* Risk Factors */}
          {result.risks.length > 0 && (
            <div className="p-3 rounded-[12px]" style={{ background: '#fef2f2' }}>
              <div className="text-[11px] font-bold mb-2" style={{ color: '#dc2626' }}>⚠️ {t.riskFactors}</div>
              {result.risks.map((r, i) => <p key={i} className="text-[12px] mb-1" style={{ color: '#991b1b' }}>• {r}</p>)}
            </div>
          )}

          {/* Positive Factors */}
          {result.positives.length > 0 && (
            <div className="p-3 rounded-[12px]" style={{ background: '#f0fdf4' }}>
              <div className="text-[11px] font-bold mb-2" style={{ color: '#16a34a' }}>✅ {t.positiveFactors}</div>
              {result.positives.map((p, i) => <p key={i} className="text-[12px] mb-1" style={{ color: '#166534' }}>• {p}</p>)}
            </div>
          )}

          {/* Download Button */}
          <button onClick={downloadReport}
            className="w-full py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {t.downloadReport}
          </button>

          {/* Disclaimer */}
          <div className="p-3 rounded-[12px]" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <p className="text-[11px]" style={{ color: '#92400e' }}>{t.trustDisclaimer}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
