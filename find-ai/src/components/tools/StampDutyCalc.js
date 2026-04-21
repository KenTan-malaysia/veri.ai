'use client';

import { useState, useEffect, useMemo } from 'react';
import { Modal, ToolHeader, RMInput, ActionBtn } from './shared';
import { L } from './labels';
import { exportReport, buildStampReport, makeCaseRef } from '../../lib/pdfExport';

// ───────────────────────────────────────────────────────────────────────
// Phase 1 TOOL 3 — SDSAS 2026 Stamp Duty Calculator
//
// - Prefills monthly rent from the active case memory (if available).
// - Produces a branded "SDSAS 2026 Tax Accuracy Certificate" PDF using
//   the shared src/lib/pdfExport.js module.
// - Writes the stamp duty result back to case memory so downstream
//   tools (Agreement Health Check, chatbox follow-ups) can reference it.
//
// Props:
//   lang            — 'en' | 'bm' | 'zh'
//   onClose         — close modal
//   activeMemory    — current case memory object (optional) — used for prefill
//   onSaveMemory    — (nextMemory) => void — persist updated memory
//   caseRef         — stable case ref for the PDF viral loop (optional)
//   profileLandlord — landlord name for the PDF letterhead (optional)
//   property        — property label for the PDF letterhead (optional)
// ───────────────────────────────────────────────────────────────────────

export default function StampDutyCalc({
  lang = 'en',
  onClose,
  activeMemory,
  onSaveMemory,
  caseRef,
  profileLandlord,
  property,
}) {
  const t = L[lang];
  const yv = [1, 2, 3, 5];

  // Derive prefills from case memory so the tool feels continuous with the chat.
  const memRent = activeMemory?.property?.monthlyRent;
  const memNickname = activeMemory?.property?.nickname || activeMemory?.property?.address;

  const [rent, setRent] = useState(memRent ? String(memRent) : '');
  const [years, setYears] = useState(1);
  const [result, setResult] = useState(null);
  const [savedToCase, setSavedToCase] = useState(false);

  // Keep our own stable case ref across re-renders in the same session.
  const stableCaseRef = useMemo(() => caseRef || makeCaseRef(), [caseRef]);

  // If the user swaps active chat while the modal is open, re-prefill.
  useEffect(() => {
    if (memRent && !rent) setRent(String(memRent));
  }, [memRent]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setSavedToCase(false);
  };

  // Persist the stamp-duty assessment back into case memory so future chat
  // turns + downstream tools (Audit) can reference it.
  const saveToCase = () => {
    if (!onSaveMemory || !result) return;
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
      property: {
        ...prev.property,
        monthlyRent: prev.property?.monthlyRent || rent,
      },
      taxDates: {
        ...prev.taxDates,
        // Mark stamp-duty calculation (not yet stamped — just computed).
        lastStampDate: prev.taxDates?.lastStampDate || '',
      },
      disputes: [
        ...(prev.disputes || []),
        {
          date: ymd,
          action: `SDSAS stamp duty calculated: RM ${Number(result.duty).toFixed(2)} (${years}y lease)`,
          note: `Ref ${stableCaseRef}`,
        },
      ],
    };
    onSaveMemory(next);
    setSavedToCase(true);
  };

  const exportToPDF = () => {
    if (!result) return;
    const payload = buildStampReport({
      rent: parseFloat(rent),
      years,
      result,
      lang,
      caseRef: stableCaseRef,
      landlord: profileLandlord || '',
      property: property || memNickname || '',
    });
    exportReport(payload);
  };

  return (
    <Modal>
      <ToolHeader icon="📄" title={t.stampTitle} desc={t.stampDesc} onClose={onClose} />
      <div className="space-y-5">
        <RMInput
          value={rent}
          onChange={(v) => { setRent(v); setResult(null); setSavedToCase(false); }}
          placeholder="2500"
          label={t.monthlyRent}
        />
        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{t.leaseDuration}</label>
          <div className="flex gap-2">
            {yv.map((y, i) => (
              <button key={y} onClick={() => { setYears(y); setResult(null); setSavedToCase(false); }}
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

          {/* === Phase 1 — PDF export + Case Memory save ====================== */}
          <div className="pt-3 space-y-2">
            <button
              onClick={exportToPDF}
              className="w-full py-3.5 rounded-xl text-[13px] font-bold text-white transition active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', boxShadow: '0 4px 16px rgba(15,23,42,0.2)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" x2="12" y1="15" y2="3"/>
              </svg>
              🛡️ {t.exportPdf}
            </button>

            {onSaveMemory && (
              <button
                onClick={saveToCase}
                disabled={savedToCase}
                className="w-full py-3 rounded-xl text-[12px] font-semibold transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: savedToCase ? '#d1fae5' : '#f8fafc', color: savedToCase ? '#065f46' : '#475569', border: `1px solid ${savedToCase ? '#a7f3d0' : '#e2e8f0'}` }}>
                {savedToCase ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {t.stampSavedToCase}
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {lang === 'en' ? 'Save to case' : lang === 'bm' ? 'Simpan ke kes' : '保存到案件'}
                  </>
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
