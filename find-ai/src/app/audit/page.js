'use client';

// v3.5.4 — TOOL 2 v1.5: file upload + paste flow.
//
// Major upgrade from v3.5.3 (paste-only):
//   - Drag-and-drop OR click-to-browse for PDF / TXT / DOCX files
//   - PDF → base64 → /api/audit (Anthropic native PDF parsing, zero deps)
//   - DOCX → mammoth (browser build, dynamic import) → text → /api/audit
//   - TXT → FileReader.readAsText() → text → /api/audit
//   - Paste flow preserved as a fallback / alternative
//   - All paths feed the same audit pipeline (clauses, facts, warnings, PDF)
//
// v3.5.3 backbone:
//   - POST /api/audit → Haiku 3.5 returns structured JSON
//   - Auto-checks the 10 clauses based on LLM detection
//   - Extracts key facts: monthlyRent, leaseTermMonths, parties, address
//   - Surfaces predatory/red-flag clauses as warnings (with legal citations)
//   - Branded PDF certificate via shared pdfExport.js (buildAuditReport)
//   - Hand-off to SDSAS calculator: rent + term saved to localStorage
//     so /stamp prefills automatically (the trust-spine cross-tool flow)
//   - Graceful degraded mode: if Anthropic credits unavailable, falls back
//     to v0 manual checklist UX without breaking the page
//
// Manual override is preserved — landlord/tenant can still toggle each clause
// regardless of LLM call. The LLM is an assistant, not the source of truth.

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { L } from '../../components/tools/labels';
import { exportReport, buildAuditReport, makeCaseRef } from '../../lib/pdfExport';

const LANGS = ['en', 'bm', 'zh'];
const SDSAS_HANDOFF_KEY = 'fa_sdsas_prefill_v1';

// File upload limits (per route.js MAX_PDF_BASE64_BYTES)
const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3MB raw — keeps base64 under 4MB
const ACCEPTED_TYPES = '.pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export default function AuditPage() {
  const [lang, setLang] = useState('en');
  const [agreementText, setAgreementText] = useState('');
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);  // {facts, clauses, warnings} or null
  const [degradedMode, setDegradedMode] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [caseRef] = useState(() => makeCaseRef());

  // File upload state (v3.5.4)
  const [uploadedFile, setUploadedFile] = useState(null);  // {name, size, type, kind: 'pdf'|'docx'|'txt'}
  const [pdfBase64, setPdfBase64] = useState('');           // base64-encoded PDF data, sent directly to API
  const [fileError, setFileError] = useState('');
  const [extracting, setExtracting] = useState(false);     // true while DOCX is being parsed client-side
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('fi_lang');
      if (stored && LANGS.includes(stored)) setLang(stored);
    } catch (e) { /* localStorage blocked */ }
  }, []);

  const t = L[lang] || L.en;

  const cycleLang = () => {
    const next = lang === 'en' ? 'bm' : lang === 'bm' ? 'zh' : 'en';
    setLang(next);
    try {
      window.localStorage.setItem('fi_lang', next);
      window.dispatchEvent(new Event('fi_lang_change'));
    } catch (e) {}
  };

  const toggle = (id) => {
    setAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
    setResult(null);
  };

  // ── File upload handlers (v3.5.4) ─────────────────────────────────────

  const detectFileKind = (file) => {
    const name = (file.name || '').toLowerCase();
    if (name.endsWith('.pdf') || file.type === 'application/pdf') return 'pdf';
    if (name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
    if (name.endsWith('.doc')) return 'doc-legacy';
    if (name.endsWith('.txt') || file.type === 'text/plain') return 'txt';
    return 'unknown';
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Strip the data URI prefix (e.g. "data:application/pdf;base64,")
        const result = String(reader.result || '');
        const idx = result.indexOf('base64,');
        resolve(idx >= 0 ? result.slice(idx + 7) : result);
      };
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });

  const fileToText = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsText(file);
    });

  const handleFile = async (file) => {
    if (!file) return;
    setFileError('');
    setUploadedFile(null);
    setPdfBase64('');

    // Size guard
    if (file.size > MAX_FILE_BYTES) {
      setFileError(`File is ${Math.round(file.size / 1024 / 1024 * 10) / 10}MB — limit is 3MB. Save as a smaller PDF or trim the document.`);
      return;
    }

    const kind = detectFileKind(file);

    if (kind === 'doc-legacy') {
      setFileError('Legacy .doc files are not supported. Save your file as .docx or .pdf in Word and re-upload.');
      return;
    }

    if (kind === 'unknown') {
      setFileError('Unsupported file type. Use PDF, Word (.docx), or plain text (.txt).');
      return;
    }

    setExtracting(true);
    try {
      if (kind === 'pdf') {
        // Base64-encode and stash; sent directly to API as document content block
        const b64 = await fileToBase64(file);
        setPdfBase64(b64);
        setAgreementText('');  // Clear paste-mode text so we don't double-send
        setUploadedFile({ name: file.name, size: file.size, kind });
      } else if (kind === 'txt') {
        const text = await fileToText(file);
        setAgreementText(text);
        setPdfBase64('');
        setUploadedFile({ name: file.name, size: file.size, kind });
      } else if (kind === 'docx') {
        // Dynamic import — only loads mammoth bundle when user actually picks a .docx
        let mammoth;
        try {
          // mammoth/mammoth.browser is the browser build with DOMParser/Image polyfills
          mammoth = await import('mammoth/mammoth.browser');
        } catch (e) {
          // mammoth not installed — graceful fallback
          setFileError('Word (.docx) support requires the mammoth dependency. Save the file as PDF and try again, or paste the text below.');
          setExtracting(false);
          return;
        }
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = (result.value || '').trim();
        if (text.length < 100) {
          setFileError('We could only extract a tiny amount of text from this Word file. The document may be image-based or empty. Save as PDF and try again.');
          setExtracting(false);
          return;
        }
        setAgreementText(text);
        setPdfBase64('');
        setUploadedFile({ name: file.name, size: file.size, kind });
      }
    } catch (err) {
      console.error('file processing error:', err);
      setFileError('Could not read this file. Try a different format or paste the text below.');
    } finally {
      setExtracting(false);
    }
  };

  const onFileInputChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleFile(file);
    // Reset input so re-uploading the same file fires onChange again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setPdfBase64('');
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // v1 — call the audit API to auto-detect clauses + extract facts
  const runAiAudit = async () => {
    const havePdf = pdfBase64.length > 0;
    const haveText = agreementText.trim().length >= 100;

    if (!havePdf && !haveText) {
      setAnalysisError('Upload a file (PDF / Word / TXT) or paste at least 100 characters of agreement text.');
      return;
    }

    setAnalyzing(true);
    setAnalysisError('');
    setDegradedMode(false);
    try {
      const requestBody = havePdf
        ? { agreementPdfBase64: pdfBase64, lang }
        : { agreementText: agreementText.trim(), lang };

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();

      if (!data.ok) {
        if (data.degradedMode) {
          setDegradedMode(true);
          setAnalysisError(data.message || 'AI analysis unavailable — use the manual checklist below.');
        } else {
          setAnalysisError(data.message || 'Could not analyze. Try again or use the manual checklist.');
        }
        return;
      }

      setAnalysis(data);

      // Auto-fill the checklist based on LLM clause detection
      const autoAnswers = {};
      Object.entries(data.clauses || {}).forEach(([k, v]) => {
        if (v.present) autoAnswers[k] = true;
      });
      setAnswers(autoAnswers);

      // Cross-tool hand-off: save rent + term to localStorage so SDSAS prefills
      if (data.facts?.monthlyRent || data.facts?.leaseTermMonths) {
        try {
          window.localStorage.setItem(SDSAS_HANDOFF_KEY, JSON.stringify({
            monthlyRent: data.facts.monthlyRent || null,
            leaseTermMonths: data.facts.leaseTermMonths || null,
            propertyAddress: data.facts.propertyAddress || null,
            landlordName: data.facts.landlordName || null,
            tenantName: data.facts.tenantName || null,
            ts: new Date().toISOString(),
          }));
        } catch (e) { /* localStorage blocked */ }
      }
    } catch (err) {
      console.error('audit fetch error:', err);
      setAnalysisError('Network error. Use the manual checklist below.');
      setDegradedMode(true);
    } finally {
      setAnalyzing(false);
    }
  };

  const check = () => {
    const total = t.clauses.length;
    const present = t.clauses.filter((c) => answers[c.id]).length;
    const missing = t.clauses.filter((c) => !answers[c.id]);
    const pct = Math.round((present / total) * 100);
    const level = pct >= 80 ? 'strong' : pct >= 50 ? 'moderate' : 'weak';
    setResult({ present, total, pct, level, missing });
    setTimeout(() => {
      const el = document.getElementById('audit-result');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const reset = () => {
    setAnswers({});
    setResult(null);
    setAgreementText('');
    setAnalysis(null);
    setAnalysisError('');
    setDegradedMode(false);
    clearUpload();
  };

  // ── PDF download (uses shared lib + buildAuditReport) ──────────────────
  const downloadPdf = () => {
    if (!result) return;
    const grade = result.level === 'strong' ? 'A' : result.level === 'moderate' ? 'C' : 'D';

    // Map LLM warnings → flags
    const flags = (analysis?.warnings || []).map((w) => ({
      severity: w.severity === 'red' ? 'red' : 'amber',
      title: w.title,
      detail: w.detail,
    }));

    // Append missing-clause flags (each missing clause is amber by default)
    const missingFlags = result.missing.map((c) => ({
      severity: 'amber',
      title: c.q,
      detail: t.clauseFix[c.id] || '',
    }));

    // Map missing-clause rewrites → list
    const rewrites = result.missing.map((c) => `${c.q} — ${t.clauseFix[c.id] || ''}`);

    const payload = buildAuditReport({
      lang,
      caseRef,
      parties: {
        landlord: analysis?.facts?.landlordName || '',
        tenant: analysis?.facts?.tenantName || '',
        rent: analysis?.facts?.monthlyRent || '',
        term: analysis?.facts?.leaseTermMonths || '',
      },
      property: analysis?.facts?.propertyAddress || '',
      score: {
        grade,
        label: `${result.pct}% — ${(t[result.level] || result.level).toString()}`,
        sub: `${result.present}/${result.total} ${t.present}`,
      },
      flags: [...flags, ...missingFlags],
      rewrites,
    });
    exportReport(payload);
  };

  const buildWaMessage = () => {
    if (!result) return '';
    const headline = `Veri.ai · Agreement Audit · ${result.pct}% — ${(t[result.level] || result.level).toString()}`;
    const presentLine = `${result.present}/${result.total} ${t.present}`;
    const missingLines = result.missing.length > 0
      ? '\n\nMissing clauses:\n' + result.missing.map((c) => `• ${c.q}`).join('\n')
      : '';
    const factsLine = analysis?.facts?.monthlyRent
      ? `\n\nMonthly rent: RM ${analysis.facts.monthlyRent} · Term: ${analysis.facts.leaseTermMonths || '—'} months`
      : '';
    return `${headline}\n${presentLine}${factsLine}${missingLines}\n\n— Veri.ai · Don't sign blind.`;
  };
  const waUrl = result
    ? `https://wa.me/?text=${encodeURIComponent(buildWaMessage())}`
    : null;

  const presentCount = Object.values(answers).filter(Boolean).length;
  const hasAnalysis = !!analysis;

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F3' }}>
      {/* Brand strip + lang toggle */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E7E1D2' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, textDecoration: 'none', color: '#0F1E3F' }}
            aria-label="Veri.ai home"
          >
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Veri</span>
            <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: '#B8893A' }}>.ai</span>
          </Link>
          <button
            onClick={cycleLang}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              background: '#F3EFE4',
              border: '1px solid #E7E1D2',
              color: '#0F1E3F',
              cursor: 'pointer',
            }}
          >
            {lang === 'en' ? 'BM' : lang === 'bm' ? '中文' : 'EN'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px 80px' }}>

        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#5A6780', textDecoration: 'none', marginBottom: 14 }}
        >
          ← Back home
        </Link>

        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12 }}>
          PRE-SIGNING · TOOL 2 OF 3 · v1 · AI-POWERED
        </div>

        <h1
          style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 56,
            fontWeight: 400,
            color: '#0F1E3F',
            letterSpacing: '-0.025em',
            lineHeight: 0.98,
            margin: '0 0 16px',
          }}
        >
          {t.healthTitle}
        </h1>

        <p style={{ fontSize: 16, lineHeight: 1.55, color: '#3F4E6B', margin: '0 0 28px', maxWidth: 600 }}>
          Upload your draft tenancy as PDF, Word, or paste it as text. Veri reads it,
          auto-checks {t.clauses.length} essential clauses, extracts the key facts (rent,
          term, parties), flags predatory wording, and gives you a branded PDF certificate.
          Free.
        </p>

        {/* ── File upload widget (v3.5.4) ───────────────────────────── */}
        <section
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
          onDrop={onDrop}
          style={{
            background: dragOver ? '#F1F6EF' : '#fff',
            border: `2px dashed ${dragOver ? '#2F6B3E' : '#C9C0A8'}`,
            borderRadius: 16,
            padding: '28px 22px',
            marginBottom: 14,
            transition: 'background .15s, border-color .15s',
            textAlign: 'center',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={onFileInputChange}
            style={{ display: 'none' }}
            aria-label="Upload tenancy agreement file"
          />

          {!uploadedFile && !extracting && (
            <>
              <div style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">📄</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#0F1E3F', marginBottom: 6, letterSpacing: '-0.01em' }}>
                Drop your agreement here
              </div>
              <div style={{ fontSize: 12.5, color: '#5A6780', marginBottom: 14, lineHeight: 1.55 }}>
                PDF, Word (.docx), or plain text (.txt) · up to 3MB · stays on your device until analysis
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '10px 18px',
                  borderRadius: 999,
                  background: '#0F1E3F',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(15,30,63,0.18)',
                }}
              >
                ⬆ Choose file
              </button>
              <div style={{ marginTop: 10, fontSize: 11, color: '#9A9484', fontStyle: 'italic' }}>
                or paste the text directly below
              </div>
            </>
          )}

          {extracting && (
            <div style={{ padding: '12px 0' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0F1E3F', marginBottom: 6 }}>
                <Spinner /> Reading file…
              </div>
              <div style={{ fontSize: 12, color: '#5A6780' }}>
                Extracting text — this stays on your device.
              </div>
            </div>
          )}

          {uploadedFile && !extracting && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', flex: 1, minWidth: 200 }}>
                <span style={{ fontSize: 28 }} aria-hidden="true">
                  {uploadedFile.kind === 'pdf' ? '📕' : uploadedFile.kind === 'docx' ? '📘' : '📄'}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0F1E3F', wordBreak: 'break-word', lineHeight: 1.4 }}>
                    {uploadedFile.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#5A6780', marginTop: 2 }}>
                    {uploadedFile.kind === 'pdf'
                      ? 'PDF · forwarded directly to Claude (no client-side parsing)'
                      : uploadedFile.kind === 'docx'
                      ? 'Word · text extracted into the box below'
                      : 'Text · loaded into the box below'}
                    {' · '}{Math.round(uploadedFile.size / 1024)} KB
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={clearUpload}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: '#5A6780',
                  border: '1px solid #C9C0A8',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Remove
              </button>
            </div>
          )}

          {fileError && (
            <div
              style={{
                marginTop: 12,
                padding: '10px 12px',
                background: '#FCEBEB',
                border: '1px solid #F7C1C1',
                borderRadius: 8,
                fontSize: 12,
                color: '#7A1F1F',
                lineHeight: 1.5,
                textAlign: 'left',
              }}
            >
              ✕ {fileError}
            </div>
          )}
        </section>

        {/* Paste area */}
        <section
          style={{
            background: '#fff',
            border: '1px solid #E7E1D2',
            borderRadius: 16,
            padding: '20px 22px',
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9A9484', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>
            {uploadedFile && uploadedFile.kind !== 'pdf'
              ? 'Extracted text · review before analyzing'
              : 'Or paste the text directly'}
          </div>
          <textarea
            value={agreementText}
            onChange={(e) => setAgreementText(e.target.value)}
            placeholder={
              uploadedFile && uploadedFile.kind === 'pdf'
                ? 'PDF will be analyzed directly — no need to paste text.'
                : uploadedFile && uploadedFile.kind === 'docx'
                ? 'Text extracted from your Word file. Edit if needed before analyzing.'
                : 'Paste the FULL TEXT of your tenancy agreement here, OR upload a file above. Veri analyzes every clause, extracts rent and term, flags risky language, and generates a PDF audit certificate.'
            }
            rows={8}
            disabled={analyzing || (uploadedFile && uploadedFile.kind === 'pdf')}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              fontSize: 13,
              lineHeight: 1.55,
              color: '#0F1E3F',
              background: uploadedFile && uploadedFile.kind === 'pdf' ? '#F3EFE4' : '#FAF8F3',
              border: '1.5px solid #E7E1D2',
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: 160,
              opacity: analyzing || (uploadedFile && uploadedFile.kind === 'pdf') ? 0.6 : 1,
            }}
            onFocus={(e) => (e.target.style.borderColor = '#0F1E3F')}
            onBlur={(e) => (e.target.style.borderColor = '#E7E1D2')}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 11, color: '#9A9484', fontStyle: 'italic' }}>
              {pdfBase64
                ? `PDF ready · ~${Math.round(pdfBase64.length / 1024)} KB encoded`
                : agreementText.length === 0
                ? 'Upload a file above OR paste min 100 characters · max 50,000'
                : `${agreementText.length.toLocaleString()} chars`}
            </div>
            <button
              type="button"
              onClick={runAiAudit}
              disabled={analyzing || (!pdfBase64 && agreementText.trim().length < 100)}
              style={{
                padding: '10px 18px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #0F1E3F 0%, #1E2D52 100%)',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: analyzing || (!pdfBase64 && agreementText.trim().length < 100) ? 'not-allowed' : 'pointer',
                opacity: analyzing || (!pdfBase64 && agreementText.trim().length < 100) ? 0.55 : 1,
                fontFamily: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(15,30,63,0.18)',
              }}
            >
              {analyzing ? (
                <>
                  <Spinner /> Analyzing…
                </>
              ) : (
                <>✦ Run AI audit</>
              )}
            </button>
          </div>
          {analysisError && (
            <div
              style={{
                marginTop: 10,
                padding: '10px 12px',
                background: degradedMode ? '#FEF3C7' : '#FCEBEB',
                border: `1px solid ${degradedMode ? '#FDE68A' : '#F7C1C1'}`,
                borderRadius: 8,
                fontSize: 12,
                color: degradedMode ? '#92400E' : '#7A1F1F',
                lineHeight: 1.5,
              }}
            >
              {degradedMode ? '⚠ ' : '✕ '}
              {analysisError}
            </div>
          )}
        </section>

        {/* "What we found" — extracted facts panel */}
        {hasAnalysis && (
          <section
            style={{
              background: 'linear-gradient(135deg, #F1F6EF 0%, #E5F0E0 100%)',
              border: '1px solid #CFE1C7',
              borderRadius: 16,
              padding: '18px 20px',
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2F6B3E', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>
              ✓ What Veri found
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 10,
              }}
            >
              <Fact label="Monthly rent" value={analysis.facts.monthlyRent ? `RM ${Number(analysis.facts.monthlyRent).toLocaleString()}` : '—'} />
              <Fact label="Lease term" value={analysis.facts.leaseTermMonths ? `${analysis.facts.leaseTermMonths} months` : '—'} />
              <Fact label="Landlord" value={analysis.facts.landlordName || '—'} />
              <Fact label="Tenant" value={analysis.facts.tenantName || '—'} />
              <Fact label="Property" value={analysis.facts.propertyAddress || '—'} fullWidth />
              <Fact label="Execution date" value={analysis.facts.executionDate || '—'} />
            </div>
            {(analysis.facts.monthlyRent || analysis.facts.leaseTermMonths) && (
              <div style={{ marginTop: 12, fontSize: 11.5, color: '#2F6B3E' }}>
                💡 Saved to your stamp duty calculator —{' '}
                <Link href="/stamp" style={{ color: '#0F1E3F', fontWeight: 600 }}>
                  jump to /stamp
                </Link>{' '}
                and these will pre-fill.
              </div>
            )}
          </section>
        )}

        {/* Warnings — predatory clauses flagged by LLM */}
        {hasAnalysis && analysis.warnings && analysis.warnings.length > 0 && (
          <section
            style={{
              background: '#FCEBEB',
              border: '1px solid #F7C1C1',
              borderRadius: 16,
              padding: '18px 20px',
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#A32D2D', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>
              ⚠ Predatory or risky clauses detected · {analysis.warnings.length}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {analysis.warnings.map((w, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        padding: '2px 7px',
                        borderRadius: 4,
                        background: w.severity === 'red' ? '#A32D2D' : '#854F0B',
                        color: '#fff',
                      }}
                    >
                      {w.severity === 'red' ? 'High risk' : 'Review'}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0F1E3F' }}>{w.title}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#7A1F1F', lineHeight: 1.5, paddingLeft: 4 }}>
                    {w.detail}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Clause checklist (auto-checked from LLM, manual override allowed) */}
        <section
          style={{
            background: '#fff',
            border: '1px solid #E7E1D2',
            borderRadius: 16,
            padding: '20px 22px',
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9A9484', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>
            Clause checklist · {presentCount}/{t.clauses.length} present
            {hasAnalysis && (
              <span style={{ marginLeft: 8, color: '#B8893A', textTransform: 'none', letterSpacing: 0, fontWeight: 500, fontStyle: 'italic' }}>
                · auto-detected · click to override
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {t.clauses.map((c) => {
              const active = !!answers[c.id];
              const llm = analysis?.clauses?.[c.id];
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(c.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: active ? '#F1F6EF' : '#FAF8F3',
                    border: `1.5px solid ${active ? '#CFE1C7' : '#E7E1D2'}`,
                    cursor: 'pointer',
                    transition: 'background .15s, border-color .15s',
                    fontFamily: 'inherit',
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: active ? '#2F6B3E' : '#fff',
                      border: `1.5px solid ${active ? '#2F6B3E' : '#C9C0A8'}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {active && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 13.5, color: '#0F1E3F', fontWeight: active ? 600 : 500, lineHeight: 1.5, display: 'block' }}>
                      {c.q}
                    </span>
                    {llm && llm.evidence && (
                      <span
                        style={{
                          display: 'block',
                          marginTop: 4,
                          fontSize: 11.5,
                          color: '#5A6780',
                          fontStyle: 'italic',
                          lineHeight: 1.4,
                        }}
                      >
                        “{llm.evidence}” <span style={{ fontStyle: 'normal', color: '#9A9484', fontSize: 10 }}>· {llm.confidence}</span>
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Check button */}
        {!result && (
          <button
            type="button"
            onClick={check}
            disabled={presentCount === 0}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 14,
              background: '#0F1E3F',
              color: '#fff',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: presentCount === 0 ? 'not-allowed' : 'pointer',
              opacity: presentCount === 0 ? 0.5 : 1,
              fontFamily: 'inherit',
              transition: 'opacity .15s',
            }}
          >
            {t.checkAgreement} →
          </button>
        )}

        {/* Result */}
        {result && (
          <section
            id="audit-result"
            style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}
          >
            {/* Score hero */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0F1E3F 0%, #1E2D52 100%)',
                color: '#fff',
                borderRadius: 20,
                padding: '28px 24px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9FB1D6', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>
                {t.score}
              </div>
              <div
                style={{
                  fontSize: 84,
                  fontWeight: 500,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.95,
                  color: result.level === 'strong' ? '#7FE0A2' : result.level === 'moderate' ? '#FFD27A' : '#F87171',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {result.pct}%
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: result.level === 'strong' ? '#7FE0A2' : result.level === 'moderate' ? '#FFD27A' : '#F87171',
                  marginTop: 6,
                  textTransform: 'capitalize',
                }}
              >
                {t[result.level]}
              </div>
              <div style={{ fontSize: 12, color: '#9FB1D6', marginTop: 4 }}>
                {result.present}/{result.total} {t.present}
              </div>
              <div
                style={{
                  width: '100%',
                  height: 6,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.12)',
                  overflow: 'hidden',
                  marginTop: 16,
                }}
              >
                <div
                  style={{
                    width: `${result.pct}%`,
                    height: '100%',
                    background: result.level === 'strong' ? '#7FE0A2' : result.level === 'moderate' ? '#FFD27A' : '#F87171',
                    transition: 'width 600ms ease',
                  }}
                />
              </div>
              <div style={{ marginTop: 10, fontSize: 10, color: '#9FB1D6', fontFamily: 'ui-monospace, monospace' }}>
                Case ref: {caseRef}
              </div>
            </div>

            {/* Missing clauses */}
            {result.missing.length > 0 && (
              <div
                style={{
                  background: '#FCEBEB',
                  border: '1px solid #F7C1C1',
                  borderRadius: 16,
                  padding: '18px 20px',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#A32D2D', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>
                  {t.missing} · {result.missing.length}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {result.missing.map((c) => (
                    <div key={c.id}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F1E3F', lineHeight: 1.4, marginBottom: 4 }}>
                        • {c.q}
                      </div>
                      <div style={{ fontSize: 12, color: '#7A1F1F', lineHeight: 1.5, paddingLeft: 14, fontStyle: 'italic' }}>
                        {t.clauseFix[c.id]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action row */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={downloadPdf}
                style={{
                  flex: '1 1 200px',
                  padding: '12px 16px',
                  borderRadius: 999,
                  background: '#0F1E3F',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                ⬇ Download PDF certificate
              </button>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: '1 1 200px',
                  padding: '12px 16px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(37,211,102,0.32)',
                }}
              >
                Share via WhatsApp
              </a>
              <button
                type="button"
                onClick={reset}
                style={{
                  flex: '1 1 160px',
                  padding: '12px 16px',
                  borderRadius: 999,
                  background: '#fff',
                  color: '#0F1E3F',
                  border: '1.5px solid #E7E1D2',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Audit another
              </button>
            </div>

            {/* Cross-tool hand-off */}
            <div
              style={{
                background: '#F3EFE4',
                border: '1px dashed #C9C0A8',
                borderRadius: 12,
                padding: '14px 16px',
                fontSize: 12.5,
                color: '#3F4E6B',
                lineHeight: 1.55,
              }}
            >
              <strong style={{ color: '#0F1E3F' }}>Next step:</strong>{' '}
              {hasAnalysis && analysis.facts.monthlyRent
                ? <>Rent and term saved. Calculate the SDSAS 2026 stamp duty (auto-prefills), or screen the tenant before viewing.</>
                : <>Once your agreement is healthy, calculate stamp duty under the SDSAS 2026 framework, or screen the tenant before viewing.</>
              }
              <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                <Link href="/stamp" style={{ color: '#B8893A', fontWeight: 600, textDecoration: 'none' }}>
                  → Calculate stamp duty
                </Link>
                <Link href="/screen/new" style={{ color: '#B8893A', fontWeight: 600, textDecoration: 'none' }}>
                  → Screen a tenant
                </Link>
              </div>
            </div>

            <div style={{ fontSize: 10, color: '#9A9484', fontStyle: 'italic', textAlign: 'center', marginTop: 4 }}>
              v1 demo · AI audit by Claude Haiku · Branded PDF via shared library · Real Word/PDF upload + Section 90A digital evidence wrapping ship in v2.
            </div>
          </section>
        )}

        <footer style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid #E7E1D2', textAlign: 'center', fontSize: 11, color: '#9A9484' }}>
          <div>
            Veri.ai · Don't sign blind. ·{' '}
            <Link href="/legal/privacy" style={{ color: '#9A9484', textDecoration: 'underline' }}>Privacy</Link>
          </div>
          <div style={{ marginTop: 6, fontStyle: 'italic' }}>
            Support tool only — not legal advice. Verify clauses with a Malaysian property lawyer before signing.
          </div>
        </footer>
      </div>
    </main>
  );
}

// ── Components ──────────────────────────────────────────────────────────

function Fact({ label, value, fullWidth }) {
  return (
    <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#5A6780', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#0F1E3F', lineHeight: 1.4, wordBreak: 'break-word' }}>
        {value}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        border: '1.5px solid #fff',
        borderTopColor: 'transparent',
        animation: 'audit-spin 0.7s linear infinite',
        display: 'inline-block',
      }}
      aria-hidden="true"
    >
      <style jsx>{`
        @keyframes audit-spin { to { transform: rotate(360deg); } }
      `}</style>
    </span>
  );
}
