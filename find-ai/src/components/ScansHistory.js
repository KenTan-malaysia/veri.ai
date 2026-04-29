'use client';

// ═══════════════════════════════════════════════════════════════════════
// Veri.ai — "Your scans" history view (v9.6 T12 + T13 dossier pivot)
//
// A landlord who's run 3 scans on 3 different prospects wants to compare
// them side-by-side before signing. Up until now the scan artifact was
// write-only: Scan → PDF → hope the landlord saves the PDF. Case Memory
// quietly persisted every scan inside
//   fi_chat_history[i].memory.screening
// but nothing surfaced it back to the user.
//
// v9.6 T13 — DOSSIER PIVOT. The prior v9.6 T12 build surfaced a big
// 0-100 "Payment Discipline Index" as the card hero, which read as a
// grade ON the tenant. Ken's directive (2026-04-23): swap from "this
// tenant scores X" to "this is what this tenant HAS." Scatter cards now
// lead with evidence on file; the 0-100 number is hidden from the UI
// entirely (still persisted internally for PDF + legacy data). The tone
// band is now driven by COVERAGE (signals captured) not by score — so the
// visual accent reads as "evidence completeness" not "tenant quality."
//
// DNA: bullseye. Pre-signing trust — the user compares multiple prospects
// before committing. Not post-signing admin (that's Phase 2).
//
// No verdict, no recommendation — same doctrine as TenantScreen.js. The
// track record describes observed behaviour only. The landlord decides.
// ═══════════════════════════════════════════════════════════════════════

import { useState, useMemo } from 'react';
import { buildScreenReport, exportReport } from '../lib/pdfExport';

// ─── i18n ──────────────────────────────────────────────────────────────
const UI = {
  en: {
    title: 'Your scans',
    sub: 'Every track record you\'ve captured — tap any card to see the evidence or re-export its PDF.',
    empty: 'No scans yet.',
    emptySub: 'Every tenant you screen shows up here so you can compare prospects before signing.',
    close: 'Close',
    back: 'Back',
    reexport: 'Re-export PDF',
    openDetail: 'Open detail',
    countOne: '1 scan saved',
    countMany: '{n} scans saved',
    trackRecord: 'Track record',
    trackRecordFor: 'Track record for',
    onFile: 'on file',
    coverage4: '4 of 4 signals on file',
    coverage3: '3 of 4 signals on file',
    coverage2: '2 of 4 signals on file',
    coverage1: '1 of 4 signals on file',
    coverage0: 'No signals on file',
    evidenceHeading: 'Evidence on file',
    tenantHeading: 'Tenant',
    propertyHeading: 'Property',
    tenantName: 'Name',
    tenantIC: 'IC last 4',
    tenantPhone: 'Phone',
    propertyNickname: 'Nickname',
    propertyAddress: 'Address',
    ref: 'Ref',
    date: 'Date',
    noTenantName: 'Unnamed tenant',
    noProperty: '—',
    signalElectricity: 'Electricity',
    signalMobile: 'Mobile postpaid',
    signalInternet: 'Home internet',
    signalWildcard: 'Voluntary subscription',
    onTime: 'On-time',
    tenure: 'Tenure',
    arrears: 'Arrears',
    yes: 'Yes', no: 'No', dash: '—',
    disclaimer: 'This track record describes observed behaviour only. It is NOT a credit score, NOT a grade, and NOT a recommendation.',
  },
  bm: {
    title: 'Saringan anda',
    sub: 'Setiap rekod jejak yang anda telah kumpulkan — ketuk kad untuk lihat bukti atau eksport semula PDF.',
    empty: 'Belum ada saringan.',
    emptySub: 'Setiap penyewa yang anda saring muncul di sini supaya anda boleh bandingkan calon sebelum tandatangan.',
    close: 'Tutup',
    back: 'Kembali',
    reexport: 'Eksport PDF semula',
    openDetail: 'Buka butiran',
    countOne: '1 saringan disimpan',
    countMany: '{n} saringan disimpan',
    trackRecord: 'Rekod jejak',
    trackRecordFor: 'Rekod jejak untuk',
    onFile: 'dalam fail',
    coverage4: '4 daripada 4 isyarat dalam fail',
    coverage3: '3 daripada 4 isyarat dalam fail',
    coverage2: '2 daripada 4 isyarat dalam fail',
    coverage1: '1 daripada 4 isyarat dalam fail',
    coverage0: 'Tiada isyarat dalam fail',
    evidenceHeading: 'Bukti dalam fail',
    tenantHeading: 'Penyewa',
    propertyHeading: 'Hartanah',
    tenantName: 'Nama',
    tenantIC: '4 digit akhir IC',
    tenantPhone: 'Telefon',
    propertyNickname: 'Nama panggilan',
    propertyAddress: 'Alamat',
    ref: 'Rujukan',
    date: 'Tarikh',
    noTenantName: 'Penyewa tanpa nama',
    noProperty: '—',
    signalElectricity: 'Elektrik',
    signalMobile: 'Pascabayar mudah alih',
    signalInternet: 'Internet rumah',
    signalWildcard: 'Langganan sukarela',
    onTime: 'Tepat masa',
    tenure: 'Tempoh',
    arrears: 'Tunggakan',
    yes: 'Ya', no: 'Tidak', dash: '—',
    disclaimer: 'Rekod jejak ini hanya menggambarkan tingkah laku yang diperhatikan. Ia BUKAN skor kredit, BUKAN gred dan BUKAN cadangan.',
  },
  zh: {
    title: '您的筛查',
    sub: '您收集到的每份履历 — 点击任意卡片查看证据或重新导出 PDF。',
    empty: '尚无筛查记录。',
    emptySub: '您筛查过的每位租客都会出现在这里，方便您在签约前对比候选人。',
    close: '关闭',
    back: '返回',
    reexport: '重新导出 PDF',
    openDetail: '查看详情',
    countOne: '已保存 1 次筛查',
    countMany: '已保存 {n} 次筛查',
    trackRecord: '履历',
    trackRecordFor: '履历 —',
    onFile: '已归档',
    coverage4: '已归档 4 / 4 项信号',
    coverage3: '已归档 3 / 4 项信号',
    coverage2: '已归档 2 / 4 项信号',
    coverage1: '已归档 1 / 4 项信号',
    coverage0: '尚未归档任何信号',
    evidenceHeading: '已归档证据',
    tenantHeading: '租客',
    propertyHeading: '房产',
    tenantName: '姓名',
    tenantIC: '身份证后4位',
    tenantPhone: '电话',
    propertyNickname: '昵称',
    propertyAddress: '地址',
    ref: '编号',
    date: '日期',
    noTenantName: '未命名租客',
    noProperty: '—',
    signalElectricity: '电费',
    signalMobile: '手机后付',
    signalInternet: '家庭宽带',
    signalWildcard: '自愿订阅',
    onTime: '按时',
    tenure: '账户时长',
    arrears: '欠款',
    yes: '是', no: '否', dash: '—',
    disclaimer: '本履历仅描述观察到的行为。它不是信用评分、不是评级、也不是推荐建议。',
  },
};

// ─── Pure data utility ─────────────────────────────────────────────────
// Walks fi_chat_history and surfaces every case that saved a screening.
// Returns newest-first so the landlord sees their most recent scan up top
// (matches the mental model of a "recent activity" feed).
export function collectScans(chatHistory) {
  if (!Array.isArray(chatHistory)) return [];
  const out = [];
  for (const ch of chatHistory) {
    const sc = ch?.memory?.screening;
    if (!sc || sc.index == null) continue;
    out.push({
      // Stable keys for React + detail lookup
      id: ch.id,
      caseTitle: ch.title || '',
      ref: sc.ref || '',
      date: sc.date || '',
      // pdi retained internally for sort tie-break + PDF backward compat;
      // it is NEVER displayed in the UI post-T13 pivot.
      pdi: Number(sc.index) || 0,
      coverage: Number(sc.coverage) || 0,
      signals: Array.isArray(sc.signals) ? sc.signals : [],
      tenant: ch.memory?.tenant || {},
      property: ch.memory?.property || {},
      // updatedAt drives the sort; fall back to the scan date if missing.
      _sortKey: ch.updatedAt || ch.createdAt || new Date(sc.date || 0).getTime() || 0,
    });
  }
  out.sort((a, b) => b._sortKey - a._sortKey);
  return out;
}

// ─── Tone per COVERAGE band — dossier pivot ───────────────────────────
// The accent now communicates "how complete is the evidence" not "how
// good is the tenant." Warm Navy Trust palette overlays stay the same.
// 4/4 = complete green · 3/4 = solid blue · 2/4 = partial amber ·
// 0-1/4 = sparse slate (no alarming red — coverage gaps aren't a verdict).
function toneForCoverage(c) {
  const v = Number(c);
  if (Number.isNaN(v)) return { band: 'slate', accent: '#3F4E6B', dot: '#9A9484' };
  if (v >= 4)          return { band: 'green', accent: '#2F6B3E', dot: '#4F9D5F' };
  if (v >= 3)          return { band: 'blue',  accent: '#1E3A8A', dot: '#5B7CC9' };
  if (v >= 2)          return { band: 'amber', accent: '#92400E', dot: '#D19845' };
  return                      { band: 'slate', accent: '#3F4E6B', dot: '#9A9484' };
}

// Human-readable coverage label — "4 of 4 signals on file" style.
function coverageLabel(t, c) {
  const v = Math.max(0, Math.min(4, Number(c) || 0));
  return ([t.coverage0, t.coverage1, t.coverage2, t.coverage3, t.coverage4])[v];
}

// Deterministic tilt per card index — -2°, +1.5°, -1°, +2°, -1.5°, +1°…
// Keeps the scatter feel without going random (random rerenders = nausea).
function tiltForIndex(i) {
  const pattern = [-2, 1.5, -1, 2, -1.5, 1, -2.2, 0.8];
  return pattern[i % pattern.length];
}

// ─── Signal label helper — mirrors pdfExport.js signalLabel ───────────
function signalLabel(t, key) {
  return ({
    electricity: t.signalElectricity,
    mobile: t.signalMobile,
    internet: t.signalInternet,
    wildcard: t.signalWildcard,
  })[key] || key;
}

// ─── Component ─────────────────────────────────────────────────────────
export default function ScansHistory({ open, lang = 'en', chatHistory, onClose }) {
  const t = UI[lang] || UI.en;
  const scans = useMemo(() => collectScans(chatHistory), [chatHistory]);
  const [selectedId, setSelectedId] = useState(null);

  if (!open) return null;

  const haptic = (p = 12) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(p); } catch (e) {}
    }
  };

  const selected = selectedId ? scans.find(s => s.id === selectedId) : null;

  // Re-export triggers the identical branded PDF the landlord got at capture
  // time. That way the downstream viral loop (WhatsApp share, QR verify)
  // points at the same case ref and renders identically. No second case ref.
  const handleReExport = (scan) => {
    haptic(12);
    const property = scan.property?.nickname || scan.property?.address || '';
    const payload = buildScreenReport({
      tenant: {
        name: scan.tenant?.name || '',
        icLast4: scan.tenant?.icLast4 || '',
        phone: scan.tenant?.phone || '',
        landlord: '',
      },
      index: { score: scan.pdi, coverage: scan.coverage },
      signals: scan.signals,
      flags: [],                 // flags weren't persisted — keep detail honest
      behaviour: null,           // behaviour psychology wasn't persisted either
      lang,
      caseRef: scan.ref,
      property,
    });
    exportReport(payload);
  };

  const openCard = (id) => { haptic(10); setSelectedId(id); };
  const closeCard = () => { haptic(6); setSelectedId(null); };

  const countLabel = scans.length === 1
    ? t.countOne
    : t.countMany.replace('{n}', String(scans.length));

  return (
    <div className="ts-root" role="dialog" aria-modal="true" aria-label={t.title}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Header bar — sticky so the Close button stays reachable on long grids. */}
      <div className="ts-head">
        <button type="button" className="ts-close" onClick={onClose} aria-label={t.close}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F1E3F" strokeWidth="2.2" strokeLinecap="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span>{t.back}</span>
        </button>
        <div className="ts-head-title">
          <div className="ts-head-brand">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flex: '0 0 auto' }}>
              <path d="M12 2 L20 5 V12 C20 17 16 20.5 12 22 C8 20.5 4 17 4 12 V5 Z" fill="#0F1E3F"/>
              <path d="M8.5 12 L11 14.5 L15.5 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span>{t.title}</span>
          </div>
          {scans.length > 0 && <div className="ts-head-sub">{countLabel}</div>}
        </div>
        <div style={{ width: 44 }} aria-hidden="true" />
      </div>

      {/* Body — either the scatter grid or the empty state. */}
      <div className="ts-body">
        {scans.length === 0 ? (
          <div className="ts-empty">
            <div className="ts-empty-ico" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F1E3F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="ts-empty-title">{t.empty}</div>
            <p className="ts-empty-sub">{t.emptySub}</p>
          </div>
        ) : (
          <>
            <p className="ts-intro">{t.sub}</p>
            <div className="ts-grid">
              {scans.map((s, i) => {
                const tone = toneForCoverage(s.coverage);
                const tilt = tiltForIndex(i);
                const name = (s.tenant?.name || '').trim() || t.noTenantName;
                const prop = (s.property?.nickname || s.property?.address || '').trim();
                const covLab = coverageLabel(t, s.coverage);
                // Vendor chips — first 3 signals on file so the card leads
                // with CONCRETE evidence not an abstract score.
                const chips = (s.signals || []).slice(0, 3);
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`ts-card ts-card-${tone.band}`}
                    style={{ '--ts-tilt': `${tilt}deg` }}
                    onClick={() => openCard(s.id)}
                    aria-label={`${t.openDetail}: ${name}, ${covLab}`}
                  >
                    {/* Top row — accent bar + band dot */}
                    <div className="ts-card-top">
                      <span className="ts-card-dot" style={{ background: tone.dot }} />
                      <span className="ts-card-date">{s.date || t.dash}</span>
                    </div>

                    {/* Tenant name + Track record eyebrow — the card now
                        leads with WHO + WHAT'S ON FILE, not a number. */}
                    <div className="ts-card-eyebrow">{t.trackRecord}</div>
                    <div className="ts-card-name">{name}</div>
                    {prop ? <div className="ts-card-prop">{prop}</div> : null}

                    {/* Coverage chip — the only tonal signal we surface. */}
                    <div className="ts-card-cov" style={{ color: tone.accent, borderColor: tone.accent + '33' }}>
                      <span className="ts-card-cov-num">{s.coverage}</span>
                      <span className="ts-card-cov-slash">/4</span>
                      <span className="ts-card-cov-lab">{t.onFile}</span>
                    </div>

                    {/* Evidence vendor chips — concrete, non-judgmental. */}
                    {chips.length > 0 && (
                      <div className="ts-card-chips">
                        {chips.map((sig, ci) => (
                          <span key={ci} className="ts-card-chip">
                            {sig.vendor || signalLabel(t, sig.key)}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="ts-card-foot">
                      {s.ref ? <div className="ts-card-ref">{s.ref}</div> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Detail overlay — inline (not a separate Portal) so unmounting is clean. */}
      {selected && (
        <div className="ts-detail-wrap" onClick={closeCard} role="dialog" aria-modal="true">
          <div className="ts-detail" onClick={(e) => e.stopPropagation()}>
            <div className="ts-detail-head">
              <button type="button" className="ts-close" onClick={closeCard} aria-label={t.close}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F1E3F" strokeWidth="2.2" strokeLinecap="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                <span>{t.back}</span>
              </button>
              <div className="ts-detail-title">{selected.tenant?.name || t.noTenantName}</div>
              <div style={{ width: 44 }} aria-hidden="true" />
            </div>

            <div className="ts-detail-body">
              {/* Dossier hero — name first, "Track record" label, coverage
                  statement. No 0-100 number anywhere in the UI. */}
              <div className={`ts-hero ts-card-${toneForCoverage(selected.coverage).band}`}>
                <div className="ts-hero-lab">{t.trackRecordFor}</div>
                <div className="ts-hero-name">{selected.tenant?.name || t.noTenantName}</div>
                <div
                  className="ts-hero-cov"
                  style={{ color: toneForCoverage(selected.coverage).accent }}
                >
                  {coverageLabel(t, selected.coverage)}
                </div>
              </div>

              {/* Meta rows */}
              <div className="ts-kv">
                <div className="ts-kv-row"><span>{t.ref}</span><strong>{selected.ref || t.dash}</strong></div>
                <div className="ts-kv-row"><span>{t.date}</span><strong>{selected.date || t.dash}</strong></div>
              </div>

              {/* Tenant */}
              <div className="ts-section">
                <div className="ts-section-h">{t.tenantHeading}</div>
                <div className="ts-kv">
                  <div className="ts-kv-row"><span>{t.tenantName}</span><strong>{selected.tenant?.name || t.dash}</strong></div>
                  <div className="ts-kv-row"><span>{t.tenantIC}</span><strong>{selected.tenant?.icLast4 ? '****' + selected.tenant.icLast4 : t.dash}</strong></div>
                  <div className="ts-kv-row"><span>{t.tenantPhone}</span><strong>{selected.tenant?.phone || t.dash}</strong></div>
                </div>
              </div>

              {/* Property */}
              <div className="ts-section">
                <div className="ts-section-h">{t.propertyHeading}</div>
                <div className="ts-kv">
                  <div className="ts-kv-row"><span>{t.propertyNickname}</span><strong>{selected.property?.nickname || t.dash}</strong></div>
                  <div className="ts-kv-row"><span>{t.propertyAddress}</span><strong>{selected.property?.address || t.dash}</strong></div>
                </div>
              </div>

              {/* Evidence on file — elevated from "captured signals" to the
                  primary dossier. This is what the tenant HAS, not what
                  they SCORE. */}
              {selected.signals.length > 0 && (
                <div className="ts-section">
                  <div className="ts-section-h">{t.evidenceHeading}</div>
                  <div className="ts-signals">
                    {selected.signals.map((s, i) => (
                      <div key={i} className="ts-signal">
                        <div className="ts-signal-top">
                          <span className="ts-signal-name">{signalLabel(t, s.key)}</span>
                          {s.vendor ? <span className="ts-signal-vendor">{s.vendor}</span> : null}
                        </div>
                        <div className="ts-signal-bits">
                          {/* typeof check — treating 0 as "valid zero" not as "missing". */}
                          <span>{t.onTime}: {typeof s.onTimeMonths === 'number' ? `${s.onTimeMonths}/12` : t.dash}</span>
                          <span>{t.tenure}: {s.tenure || t.dash}</span>
                          <span>
                            {t.arrears}: {s.hasArrears === true ? t.yes : s.hasArrears === false ? t.no : t.dash}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="ts-disclaimer">{t.disclaimer}</p>
            </div>

            <div className="ts-detail-foot">
              <button
                type="button"
                className="ts-reexport"
                onClick={() => handleReExport(selected)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
                </svg>
                {t.reexport}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Styles — scoped under .ts-root to stay out of the rest of the app. ─
// Warm Navy Trust palette, same as landing.js.
const styles = `
  .ts-root {
    position: fixed; inset: 0; z-index: 60;
    background: #FAF8F3;
    display: flex; flex-direction: column;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #0F1E3F;
    -webkit-font-smoothing: antialiased;
  }
  .ts-head {
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px;
    background: #FFFFFF;
    border-bottom: 1px solid #E7E1D2;
  }
  .ts-head-title { text-align: center; flex: 1; min-width: 0; }
  .ts-head-brand {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 14px; font-weight: 800; letter-spacing: -0.02em;
    color: #0F1E3F;
  }
  .ts-head-sub {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em;
    color: #9A9484; margin-top: 2px;
  }
  .ts-close {
    display: inline-flex; align-items: center; gap: 6px;
    background: #F3EFE4; border: none; cursor: pointer;
    padding: 8px 12px; border-radius: 999px;
    font-family: inherit; font-size: 12.5px; font-weight: 700;
    color: #0F1E3F;
    min-height: 32px;
    transition: background .15s ease, transform .1s ease;
  }
  .ts-close:hover { background: #E7E1D2; }
  .ts-close:active { transform: scale(0.97); }

  .ts-body {
    flex: 1; overflow-y: auto;
    padding: 20px 18px 40px;
    max-width: 640px; width: 100%; margin: 0 auto;
  }
  .ts-intro {
    font-size: 13.5px; color: #3F4E6B; line-height: 1.5;
    margin: 0 0 18px; padding: 0 2px;
  }

  /* Scatter grid — tilted cards, 2 cols on mobile, 3 on wider. */
  .ts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 6px 2px 12px;
  }
  @media (min-width: 560px) {
    .ts-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; }
  }

  .ts-card {
    --ts-tilt: 0deg;
    position: relative;
    background: #FFFFFF;
    border: 1.5px solid #E7E1D2;
    border-radius: 18px;
    padding: 14px 14px 16px;
    text-align: left;
    cursor: pointer;
    font-family: inherit; color: #0F1E3F;
    transform: rotate(var(--ts-tilt));
    transition: transform .22s cubic-bezier(0.2,0.7,0.2,1), box-shadow .22s ease, border-color .18s ease;
    box-shadow: 0 2px 6px -2px rgba(15,30,63,0.08);
    min-height: 188px;
    display: flex; flex-direction: column;
  }
  .ts-card:hover {
    transform: rotate(0deg) translateY(-3px);
    box-shadow: 0 14px 30px -12px rgba(15,30,63,0.22);
    border-color: #0F1E3F;
  }
  .ts-card:active { transform: rotate(0deg) scale(0.98); }
  .ts-card:focus-visible { outline: 3px solid #B8893A; outline-offset: 3px; }

  /* Tone-band accent bar along the top-left corner. Tone now driven by
     COVERAGE (evidence completeness), not by score. */
  .ts-card::before {
    content: ''; position: absolute; top: 0; left: 18px; right: 18px;
    height: 3px; border-radius: 0 0 6px 6px;
    background: currentColor; opacity: 0; transition: opacity .15s ease;
  }
  .ts-card-green::before { opacity: 1; color: #4F9D5F; }
  .ts-card-blue::before  { opacity: 1; color: #5B7CC9; }
  .ts-card-amber::before { opacity: 1; color: #D19845; }
  .ts-card-slate::before { opacity: 1; color: #9A9484; }

  .ts-card-top {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px;
  }
  .ts-card-dot {
    width: 8px; height: 8px; border-radius: 999px;
  }
  .ts-card-date {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.12em;
    color: #9A9484;
  }

  .ts-card-eyebrow {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9px; text-transform: uppercase; letter-spacing: 0.16em;
    color: #9A9484; margin-bottom: 4px;
  }
  .ts-card-name {
    font-size: 15px; font-weight: 800; color: #0F1E3F;
    letter-spacing: -0.02em; line-height: 1.2;
    overflow: hidden; text-overflow: ellipsis;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }
  .ts-card-prop {
    font-size: 11px; color: #3F4E6B; margin-top: 3px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .ts-card-cov {
    display: inline-flex; align-items: baseline; gap: 3px;
    margin-top: 12px; padding: 5px 9px 5px 10px;
    border: 1px solid; border-radius: 999px;
    background: rgba(255,255,255,0.5);
    font-weight: 800;
    align-self: flex-start;
  }
  .ts-card-cov-num {
    font-size: 16px; letter-spacing: -0.02em;
  }
  .ts-card-cov-slash {
    font-size: 11px; opacity: 0.55; margin-right: 3px;
  }
  .ts-card-cov-lab {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.1em;
    font-weight: 700; opacity: 0.85;
  }

  .ts-card-chips {
    display: flex; flex-wrap: wrap; gap: 4px;
    margin-top: 8px;
  }
  .ts-card-chip {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.08em;
    padding: 3px 7px;
    background: #F3EFE4;
    color: #3F4E6B;
    border-radius: 6px;
    font-weight: 700;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    max-width: 100%;
  }

  .ts-card-foot { margin-top: auto; padding-top: 10px; }
  .ts-card-ref {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9px; color: #B8893A; letter-spacing: 0.04em;
  }

  /* Empty state */
  .ts-empty {
    text-align: center; padding: 60px 24px 40px;
  }
  .ts-empty-ico {
    width: 64px; height: 64px; border-radius: 20px;
    background: #F3EFE4; margin: 0 auto 18px;
    display: flex; align-items: center; justify-content: center;
  }
  .ts-empty-title {
    font-size: 20px; font-weight: 800; letter-spacing: -0.02em;
    color: #0F1E3F;
  }
  .ts-empty-sub {
    font-size: 13.5px; color: #3F4E6B; line-height: 1.5;
    margin: 8px auto 0; max-width: 320px;
  }

  /* Detail overlay */
  .ts-detail-wrap {
    position: fixed; inset: 0; z-index: 70;
    background: rgba(15,30,63,0.38);
    display: flex; align-items: flex-end; justify-content: center;
    padding: 0;
  }
  @media (min-width: 640px) {
    .ts-detail-wrap { align-items: center; padding: 24px; }
  }
  .ts-detail {
    width: 100%; max-width: 560px;
    max-height: 92vh;
    background: #FAF8F3;
    border-radius: 24px 24px 0 0;
    display: flex; flex-direction: column;
    overflow: hidden;
    animation: tsRise .28s cubic-bezier(0.2,0.7,0.2,1) both;
  }
  @media (min-width: 640px) {
    .ts-detail { border-radius: 24px; max-height: 86vh; }
  }
  @keyframes tsRise { from { transform: translateY(16px); opacity: 0.7; } to { transform: translateY(0); opacity: 1; } }

  .ts-detail-head {
    flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; background: #FFFFFF; border-bottom: 1px solid #E7E1D2;
  }
  .ts-detail-title {
    flex: 1; text-align: center;
    font-size: 14.5px; font-weight: 800; letter-spacing: -0.02em; color: #0F1E3F;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    padding: 0 8px;
  }
  .ts-detail-body {
    flex: 1; overflow-y: auto; padding: 18px;
    display: flex; flex-direction: column; gap: 16px;
  }

  /* Dossier hero — no 0-100 number, just name + coverage statement. */
  .ts-hero {
    background: #FFFFFF; border: 1.5px solid #E7E1D2;
    border-radius: 18px; padding: 20px 22px 22px;
    position: relative;
  }
  .ts-hero::before {
    content: ''; position: absolute; top: 0; left: 24px; right: 24px;
    height: 4px; border-radius: 0 0 6px 6px;
    background: currentColor; opacity: 0;
  }
  .ts-hero.ts-card-green::before { opacity: 1; color: #4F9D5F; }
  .ts-hero.ts-card-blue::before  { opacity: 1; color: #5B7CC9; }
  .ts-hero.ts-card-amber::before { opacity: 1; color: #D19845; }
  .ts-hero.ts-card-slate::before { opacity: 1; color: #9A9484; }

  .ts-hero-lab {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em;
    color: #9A9484;
  }
  .ts-hero-name {
    font-size: 26px; font-weight: 900; line-height: 1.15;
    letter-spacing: -0.03em; margin-top: 4px;
    color: #0F1E3F;
  }
  .ts-hero-cov {
    font-size: 14px; font-weight: 700; margin-top: 10px;
    letter-spacing: -0.01em;
  }

  .ts-section { display: flex; flex-direction: column; gap: 8px; }
  .ts-section-h {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em;
    color: #9A9484; padding: 0 2px;
  }
  .ts-kv {
    background: #FFFFFF; border: 1px solid #E7E1D2; border-radius: 14px;
    padding: 6px 14px;
  }
  .ts-kv-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 0; border-bottom: 1px solid #F3EFE4;
    font-size: 12.5px;
  }
  .ts-kv-row:last-child { border-bottom: none; }
  .ts-kv-row span { color: #3F4E6B; }
  .ts-kv-row strong { color: #0F1E3F; font-weight: 700; text-align: right; }

  .ts-signals { display: flex; flex-direction: column; gap: 8px; }
  .ts-signal {
    background: #FFFFFF; border: 1px solid #E7E1D2; border-radius: 14px;
    padding: 10px 14px;
  }
  .ts-signal-top {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 4px;
  }
  .ts-signal-name { font-size: 13px; font-weight: 700; color: #0F1E3F; }
  .ts-signal-vendor {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; color: #B8893A; letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .ts-signal-bits {
    display: flex; flex-wrap: wrap; gap: 10px;
    font-size: 11px; color: #3F4E6B;
  }

  .ts-disclaimer {
    font-size: 11px; color: #9A9484; line-height: 1.55;
    margin: 4px 2px 0; padding: 10px 12px;
    background: #F3EFE4; border-radius: 12px;
  }

  .ts-detail-foot {
    flex-shrink: 0; padding: 14px 18px 22px;
    background: #FFFFFF; border-top: 1px solid #E7E1D2;
  }
  .ts-reexport {
    width: 100%; padding: 16px;
    border-radius: 16px; border: none; cursor: pointer;
    font-family: inherit; font-size: 15px; font-weight: 700;
    color: #FFFFFF; background: #0F1E3F;
    display: inline-flex; align-items: center; justify-content: center;
    box-shadow: 0 10px 22px -6px rgba(15,30,63,0.28);
    transition: transform .1s ease;
  }
  .ts-reexport:active { transform: scale(0.98); }
`;
