// v3.5.4 — TOOL 2 v1.5: file-upload-aware audit. Accepts text OR PDF base64.
//
// POST /api/audit
// Body: ONE of:
//   { agreementText: string, lang?: 'en'|'bm'|'zh' }              — paste flow
//   { agreementPdfBase64: string, lang?: 'en'|'bm'|'zh' }          — PDF upload
//
// PDFs are forwarded to Claude as a `document` content block (Anthropic's
// native PDF support — no client-side PDF parsing library needed). Claude
// reads the PDF text + visual structure directly. Smaller payload, more
// accurate clause detection on visually-formatted agreements.
//
// DOCX is parsed client-side via `mammoth` (browser build) → arrives here as
// agreementText. TXT is read client-side via FileReader → also agreementText.
//
// Response 200:
//   {
//     ok: true,
//     facts: {
//       monthlyRent:        number | null,    // RM per month
//       leaseTermMonths:    number | null,    // total months (e.g. 24 for "2 years")
//       propertyAddress:    string | null,
//       landlordName:       string | null,
//       tenantName:         string | null,
//       executionDate:      string | null,    // ISO date if found
//     },
//     clauses: {
//       latePay:          { present: boolean, evidence: string, confidence: 'high'|'medium'|'low' },
//       deposit:          { present, evidence, confidence },
//       maintenance:      { ... },
//       sublet:           { ... },
//       earlyTermination: { ... },
//       inventory:        { ... },
//       utility:          { ... },
//       stampDuty:        { ... },
//       renewal:          { ... },
//       dispute:          { ... },
//     },
//     warnings: Array<{ severity: 'red'|'amber', title: string, detail: string }>
//   }
// Response 200 with degraded mode (when Anthropic key/credits unavailable):
//   { ok: false, error: 'analysis_unavailable', degradedMode: true, message: '...' }
//   Frontend falls back to manual checklist (v0 behaviour).
// Response 4xx/5xx: { ok: false, error: '...' }
//
// Why this is degraded-mode-tolerant: if Ken hasn't topped up Anthropic credits
// (the standing v3.4.16 reminder), the audit page should still work — just
// without the auto-detection magic. Manual checklist UX from v0 is preserved
// as the fallback.

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 10-clause Malaysian tenancy library — must match the keys in
// src/components/tools/labels.js so the frontend can map results back.
const CLAUSE_KEYS = [
  'latePay',
  'deposit',
  'maintenance',
  'sublet',
  'earlyTermination',
  'inventory',
  'utility',
  'stampDuty',
  'renewal',
  'dispute',
];

const CLAUSE_DESCRIPTIONS = {
  latePay: 'Late payment penalty / interest clause (e.g. "10% p.a. on overdue rent after 14 days")',
  deposit: 'Security deposit amount specified (commonly 2 months rent + 0.5 month utility deposit, "2+1")',
  maintenance: 'Maintenance responsibility split between landlord (structural/major systems) and tenant (wear-and-tear)',
  sublet: 'Subletting / assignment prohibition without written landlord consent',
  earlyTermination: 'Early termination clause with notice period and consequences (e.g. forfeiture of deposit)',
  inventory: 'Check-in / check-out inventory checklist with photos, signed by both parties',
  utility: 'Utility transfer to tenant name + final bill settlement before deposit refund',
  stampDuty: 'Stamp duty responsibility stated (typically tenant pays under SDSAS 2026)',
  renewal: 'Renewal terms — first right of renewal, notice period, revised rent terms',
  dispute: 'Dispute resolution method — mediation, arbitration, or court jurisdiction',
};

function buildSystemPrompt(lang) {
  const langLabel = lang === 'bm' ? 'Bahasa Malaysia' : lang === 'zh' ? 'Mandarin Chinese (Simplified)' : 'English';
  return `You are Veri — Veri.ai's Malaysian property compliance specialist. Your job is to audit a tenancy agreement before signing.

You will receive the FULL TEXT of a Malaysian tenancy agreement (English, Bahasa Malaysia, or 中文 — possibly mixed). The user reads ${langLabel} as their primary language.

Your output must be STRICT JSON matching this schema EXACTLY — no markdown, no commentary, no code fences:

{
  "facts": {
    "monthlyRent": number or null,
    "leaseTermMonths": number or null,
    "propertyAddress": string or null,
    "landlordName": string or null,
    "tenantName": string or null,
    "executionDate": string (ISO YYYY-MM-DD) or null
  },
  "clauses": {
    "latePay":          { "present": boolean, "evidence": string, "confidence": "high"|"medium"|"low" },
    "deposit":          { "present": boolean, "evidence": string, "confidence": "high"|"medium"|"low" },
    "maintenance":      { "present": boolean, "evidence": string, "confidence": "high"|"medium"|"low" },
    "sublet":           { "present": boolean, "evidence": string, "confidence": "high"|"medium"|"low" },
    "earlyTermination": { "present": boolean, "evidence": string, "confidence": "high"|"medium"|"low" },
    "inventory":        { "present": boolean, "evidence": string, "confidence": "high"|"medium"|"low" },
    "utility":          { "present": boolean, "evidence": string, "confidence": "high"|"medium"|"low" },
    "stampDuty":        { "present": boolean, "evidence": string, "confidence": "high"|"medium"|"low" },
    "renewal":          { "present": boolean, "evidence": string, "confidence": "high"|"medium"|"low" },
    "dispute":          { "present": boolean, "evidence": string, "confidence": "high"|"medium"|"low" }
  },
  "warnings": [
    { "severity": "red"|"amber", "title": string, "detail": string }
  ]
}

CLAUSE KEYS — check for each of these 10 clauses:
${CLAUSE_KEYS.map((k) => `  "${k}" — ${CLAUSE_DESCRIPTIONS[k]}`).join('\n')}

RULES FOR EACH CLAUSE:
- "present": true ONLY if the agreement actually contains language addressing this clause. A bare mention is enough; full coverage isn't required.
- "evidence": a short quote (max 120 chars) from the agreement text supporting your call. Use ellipsis if truncating. If absent, leave evidence as empty string "".
- "confidence": "high" if the clause is unambiguously present/absent. "medium" if there's vague language. "low" if you're guessing.

RULES FOR FACTS:
- Extract monthlyRent as a NUMBER (RM per month) — strip currency symbols and commas. Convert annual rent / 12 if only annual stated.
- Extract leaseTermMonths as a NUMBER (total months) — convert "2 years" to 24, "18 months" to 18.
- propertyAddress: include unit number, street, city. Trim to ~100 chars.
- landlordName, tenantName: full legal names if listed, else null.
- executionDate: only if a specific signing date is in the document. ISO format.

RULES FOR WARNINGS — flag predatory or non-Malaysia-compliant clauses:
- "red" severity: clauses that are illegal under Malaysian law (e.g. self-help eviction, deposit forfeiture without due process, automatic rent escalation > 7%, indemnification of landlord for landlord's own negligence)
- "amber" severity: clauses that are legal but heavily one-sided (e.g. tenant pays all repairs including structural, no notice required for landlord entry, unlimited liability, mandatory arbitration in landlord's choice of forum)
- Cite the legal basis when relevant: "Contracts Act 1950 s.74", "Distress Act 1951", "Stamp Act 1949 s.62", "Specific Relief Act 1950 s.7", "PDPA 2010"
- Empty array if no warnings.

OUTPUT ONLY THE JSON. No other text. No markdown. No code fences.`;
}

// Max base64 PDF payload — Anthropic doc input cap is ~32MB raw.
// Base64 inflates by ~33%, so 32MB raw ≈ 43MB base64. We cap at 25MB raw
// (≈33MB base64) to stay safely under, and to keep Vercel function payload
// reasonable (Vercel hard cap on function body is 4.5MB on hobby tier — but
// since we're sending base64 strings, the JSON request body counts. So
// realistic cap is ~3MB raw / ~4MB base64. Most tenancy PDFs are <1MB.)
const MAX_PDF_BASE64_BYTES = 4 * 1024 * 1024; // 4MB base64 ≈ 3MB raw

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const agreementText = (body.agreementText || '').toString().trim();
  const agreementPdfBase64 = (body.agreementPdfBase64 || '').toString();
  const lang = ['en', 'bm', 'zh'].includes(body.lang) ? body.lang : 'en';

  // Decide input mode
  const isPdfMode = agreementPdfBase64.length > 0;
  const isTextMode = agreementText.length > 0;

  if (!isPdfMode && !isTextMode) {
    return jsonResponse({
      ok: false,
      error: 'no_input',
      message: 'Provide either agreementText or agreementPdfBase64.',
    }, 400);
  }

  if (isPdfMode && isTextMode) {
    return jsonResponse({
      ok: false,
      error: 'conflicting_input',
      message: 'Provide ONE of agreementText or agreementPdfBase64, not both.',
    }, 400);
  }

  if (isTextMode) {
    if (agreementText.length < 100) {
      return jsonResponse({
        ok: false,
        error: 'text_too_short',
        message: 'Paste at least 100 characters of agreement text for meaningful analysis.',
      }, 400);
    }
    if (agreementText.length > 50000) {
      return jsonResponse({
        ok: false,
        error: 'text_too_long',
        message: 'Agreement text exceeds 50,000 characters. Trim to the most relevant sections.',
      }, 400);
    }
  }

  if (isPdfMode) {
    if (agreementPdfBase64.length > MAX_PDF_BASE64_BYTES) {
      return jsonResponse({
        ok: false,
        error: 'pdf_too_large',
        message: `PDF exceeds the ${Math.round(MAX_PDF_BASE64_BYTES / 1024 / 1024)}MB upload cap. Save as a smaller PDF or split into sections.`,
      }, 400);
    }
    // Quick sanity check — base64 should not contain whitespace or non-base64 chars
    if (!/^[A-Za-z0-9+/=]+$/.test(agreementPdfBase64.replace(/\s/g, ''))) {
      return jsonResponse({
        ok: false,
        error: 'invalid_base64',
        message: 'PDF data was not valid base64. Try uploading again.',
      }, 400);
    }
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonResponse({
      ok: false,
      error: 'analysis_unavailable',
      degradedMode: true,
      message: 'AI analysis temporarily unavailable. Use the manual checklist below.',
    }, 200);
  }

  try {
    // Build the message content blocks per input mode
    const userContent = isPdfMode
      ? [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: agreementPdfBase64.replace(/\s/g, ''),
            },
          },
          {
            type: 'text',
            text: `Audit this tenancy agreement PDF. Return STRICT JSON per the schema in your system instructions. No markdown, no commentary.`,
          },
        ]
      : [
          {
            type: 'text',
            text: `Audit this tenancy agreement and return JSON per the schema:\n\n---BEGIN AGREEMENT---\n${agreementText}\n---END AGREEMENT---`,
          },
        ];

    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2400,
      system: buildSystemPrompt(lang),
      messages: [
        {
          role: 'user',
          content: userContent,
        },
      ],
    });

    const raw = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    // Strip code fences if Claude wrapped them despite instructions
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('=== AUDIT JSON PARSE ERROR ===');
      console.error('raw response:', raw.slice(0, 500));
      return jsonResponse({
        ok: false,
        error: 'parse_failed',
        message: 'AI returned malformed JSON. Use the manual checklist as a fallback.',
        degradedMode: true,
      }, 200);
    }

    const validated = validateShape(parsed);
    if (!validated.ok) {
      return jsonResponse({
        ok: false,
        error: 'invalid_shape',
        message: validated.message,
        degradedMode: true,
      }, 200);
    }

    return jsonResponse({
      ok: true,
      ...validated.data,
    }, 200);
  } catch (err) {
    console.error('=== AUDIT API ERROR ===');
    console.error('status:', err?.status);
    console.error('message:', err?.message);
    console.error('error body:', JSON.stringify(err?.error || {}));

    const status = err?.status || err?.statusCode || 500;

    // Anthropic billing / credit issues (400/401/402) → graceful degraded mode
    if (status === 400 || status === 401 || status === 402 || status === 429) {
      return jsonResponse({
        ok: false,
        error: 'analysis_unavailable',
        degradedMode: true,
        message:
          'AI analysis temporarily unavailable (likely API credit issue). Use the manual checklist below — your audit still works.',
      }, 200);
    }

    return jsonResponse({
      ok: false,
      error: 'server_error',
      message: 'Audit service hit an unexpected error. Try again, or use the manual checklist.',
      degradedMode: true,
    }, 500);
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Verify the Claude response matches the expected schema. Forgiving — fills
// in defaults for missing keys so the frontend always has something to render.
function validateShape(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, message: 'Response was not an object.' };
  }

  const facts = parsed.facts && typeof parsed.facts === 'object' ? parsed.facts : {};
  const factsOut = {
    monthlyRent: numOrNull(facts.monthlyRent),
    leaseTermMonths: numOrNull(facts.leaseTermMonths),
    propertyAddress: strOrNull(facts.propertyAddress),
    landlordName: strOrNull(facts.landlordName),
    tenantName: strOrNull(facts.tenantName),
    executionDate: strOrNull(facts.executionDate),
  };

  const clausesIn = parsed.clauses && typeof parsed.clauses === 'object' ? parsed.clauses : {};
  const clausesOut = {};
  for (const k of CLAUSE_KEYS) {
    const c = clausesIn[k] && typeof clausesIn[k] === 'object' ? clausesIn[k] : {};
    clausesOut[k] = {
      present: c.present === true,
      evidence: strOrEmpty(c.evidence),
      confidence: ['high', 'medium', 'low'].includes(c.confidence) ? c.confidence : 'low',
    };
  }

  const warnings = Array.isArray(parsed.warnings)
    ? parsed.warnings
        .filter((w) => w && typeof w === 'object')
        .map((w) => ({
          severity: w.severity === 'red' ? 'red' : 'amber',
          title: strOrEmpty(w.title).slice(0, 120),
          detail: strOrEmpty(w.detail).slice(0, 400),
        }))
        .filter((w) => w.title.length > 0)
        .slice(0, 8)
    : [];

  return {
    ok: true,
    data: {
      facts: factsOut,
      clauses: clausesOut,
      warnings,
    },
  };
}

function numOrNull(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function strOrNull(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length === 0 ? null : s.slice(0, 200);
}

function strOrEmpty(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim().slice(0, 240);
}
