// v3.7.0 — TOOL 1 vision OCR backbone.
// v3.7.19 — Added 'utility_receipt' kind for myTNB / TNG payment receipts
// (separate from bills; receipts give us multi-month payment-date timing).
//
// POST /api/screen/extract
// Body: ONE of:
//   { kind: 'lhdn_cert',     imageBase64, mediaType?, lang? }
//   { kind: 'utility_bill',  imageBase64, vendor?, mediaType?, lang? }
//   { kind: 'utility_receipt', imageBase64, vendor?, mediaType?, lang? }   ← v3.7.19
//   { kind: 'auto',          imageBase64, mediaType?, lang? }              ← v3.7.19 — classifier picks
//
// Replaces TOOL 1's mock-only flow with real LLM-vision extraction. Same
// degraded-mode doctrine as /api/audit and /api/chat: when Anthropic credits
// are missing or the API errors, we return { ok: false, degradedMode: true }
// and the frontend falls back to the existing mock data so the demo still
// works for landlord walkthroughs.
//
// Anthropic vision support:
//   - Haiku 3.5 accepts image content blocks (jpeg/png/webp/gif) up to 5MB
//   - For PDFs, use the existing 'document' content block (works for LHDN
//     STAMPS PDF receipts which are text-based)
//
// Schemas returned:
//
// kind=lhdn_cert →
//   { ok: true, fields: {
//       certNumber:       string | null,    // LHDN cert / instrument number
//       executionDate:    YYYY-MM-DD | null,
//       stampedDate:      YYYY-MM-DD | null,
//       monthlyRent:      number | null,    // RM
//       leaseTermMonths:  number | null,
//       landlordName:     string | null,
//       tenantName:       string | null,
//       tenantICLast4:    string | null,    // last 4 digits only — privacy guardrail
//       propertyAddress:  string | null,
//       stampDuty:        number | null,    // RM
//       authentic:        'likely'|'uncertain'|'suspicious',
//       authenticReason:  string,
//   }}
//
// kind=utility_bill →
//   { ok: true, fields: {
//       vendor:           string | null,    // detected vendor if not provided
//       accountNumber:    string | null,
//       accountHolderName: string | null,
//       billDate:         YYYY-MM-DD | null,
//       dueDate:          YYYY-MM-DD | null,
//       paymentDate:      YYYY-MM-DD | null,    // when bill was paid (if shown)
//       amountDue:        number | null,    // RM
//       amountPaid:       number | null,    // RM
//       outstanding:      number | null,    // carry-over from prior period
//       propertyAddress:  string | null,
//       authentic:        'likely'|'uncertain'|'suspicious',
//       authenticReason:  string,
//   }}

import Anthropic from '@anthropic-ai/sdk';
import { checkRateLimit, rateLimitResponse } from '../../../../lib/rateLimit';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_IMAGE_BASE64_BYTES = 7 * 1024 * 1024;   // 7MB base64 ≈ 5MB raw — Anthropic image cap
const ALLOWED_MEDIA = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

const LHDN_SYSTEM_PROMPT = `You are Veri — Veri.ai's Malaysian property compliance specialist. You will receive an image (or PDF) of an LHDN stamp duty certificate (formally: a Malaysian tenancy agreement Section 32(a) instrument receipt from the LHDN STAMPS portal at stamps.hasil.gov.my, or a stamped agreement first page).

Extract the following fields and return STRICT JSON. No markdown. No commentary. No code fences.

{
  "fields": {
    "certNumber":       string or null,
    "executionDate":    string (ISO YYYY-MM-DD) or null,
    "stampedDate":      string (ISO YYYY-MM-DD) or null,
    "monthlyRent":      number or null,
    "leaseTermMonths":  number or null,
    "landlordName":     string or null,
    "tenantName":       string or null,
    "tenantICLast4":    string (4 chars) or null,
    "propertyAddress":  string or null,
    "stampDuty":        number or null,
    "authentic":        "likely" | "uncertain" | "suspicious",
    "authenticReason":  string
  }
}

RULES:
- monthlyRent: extract as NUMBER (RM/month). If only annual rent is shown, divide by 12.
- leaseTermMonths: convert "2 years" to 24, "18 months" to 18, "1 tahun" to 12.
- tenantICLast4: ONLY the last 4 digits of the tenant's IC. Never the full IC. If the cert shows full IC, return only the last 4. This is a privacy guardrail — Veri.ai never persists full IC except at signing.
- authentic: judge based on visible LHDN STAMPS letterhead, e-Duti Setem QR, certificate number format (typically 12-15 digits), stamp date sanity (within 30 days of execution), and overall visual consistency. Lean "uncertain" rather than "likely" when in doubt.
- authenticReason: 1-2 sentence justification for the authentic verdict, citing what you saw or didn't see.
- Use null for any field you cannot confidently extract — never hallucinate.

Output ONLY the JSON.`;

const UTILITY_SYSTEM_PROMPT = `You are Veri — Veri.ai's Malaysian property compliance specialist. You will receive an image (or PDF) of a Malaysian utility bill: TNB (electricity), SYABAS / Air Selangor (water), IWK (sewerage), or a postpaid mobile bill (Maxis, CelcomDigi, U Mobile, Yes).

Extract the following fields and return STRICT JSON. No markdown. No commentary. No code fences.

{
  "fields": {
    "vendor":            string or null,
    "accountNumber":     string or null,
    "accountHolderName": string or null,
    "billDate":          string (ISO YYYY-MM-DD) or null,
    "dueDate":           string (ISO YYYY-MM-DD) or null,
    "paymentDate":       string (ISO YYYY-MM-DD) or null,
    "amountDue":         number or null,
    "amountPaid":        number or null,
    "outstanding":       number or null,
    "propertyAddress":   string or null,
    "authentic":         "likely" | "uncertain" | "suspicious",
    "authenticReason":   string
  }
}

RULES:
- vendor: detect from logo / letterhead / branding. Standard short codes: "TNB", "SYABAS", "AirSelangor", "IWK", "Maxis", "CelcomDigi", "UMobile", "Yes". If unclear, return null.
- amountDue / amountPaid / outstanding: extract as NUMBERS (RM). Strip commas + currency symbols.
- billDate vs dueDate vs paymentDate: bills typically show "Tarikh Bayaran Akhir" (due date) and sometimes "Bayaran Diterima Pada" (date payment received). Distinguish carefully.
- authentic: judge by vendor letterhead, account-number format (TNB: 12-13 digits; SYABAS: 10 digits), date sanity, total-amount math consistency, and visible water-mark / barcode / QR. Lean "uncertain" when in doubt.
- authenticReason: 1-2 sentences citing visible features.
- Use null for any field you cannot confidently extract.

Output ONLY the JSON.`;

// v3.7.19 — Receipt prompt (myTNB payment receipts, TNG/FPX/JomPAY confirmations)
const RECEIPT_SYSTEM_PROMPT = `You are Veri — Veri.ai's Malaysian utility-payment receipt extractor. You will receive an image (or PDF) of a payment receipt for a Malaysian utility bill: typically a myTNB receipt, a Touch 'n Go eWallet bill-payment confirmation, a Maybank2u JomPAY screenshot, or similar.

Extract the following fields and return STRICT JSON. No markdown. No commentary. No code fences.

{
  "fields": {
    "vendor":            string or null,    // The UTILITY this paid (TNB / SYABAS / Maxis / etc) — NOT the payment app
    "accountNumber":     string or null,    // The utility account that was paid TO
    "accountHolderName": string or null,    // Name on the utility account (often landlord's)
    "paymentDate":       string (ISO YYYY-MM-DD) or null,
    "paymentTime":       string (HH:MM) or null,
    "paymentAmount":     number or null,
    "paymentMethod":     string or null,    // "TNG" / "FPX" / "Credit Card" / "JomPAY" / etc
    "transactionId":     string or null,
    "referenceNumber":   string or null,    // Vendor reference (MYTNXXXXXX etc)
    "authentic":         "likely" | "uncertain" | "suspicious",
    "authenticReason":   string
  }
}

RULES:
- vendor: detect the UTILITY paid TO from the receipt (e.g. "TNB"), not the payment channel ("TNG" goes in paymentMethod).
- referenceNumber: myTNB receipts show "MYTN" + date-encoded sequence (e.g. MYTN251121177922) — extract verbatim.
- paymentDate: parse defensively (M/D/YYYY vs D/M/YYYY varies). For myTNB receipts, the date encoded in the reference number is authoritative if it conflicts with the displayed date.
- paymentMethod: standardize to "TNG", "FPX", "JomPAY", "Credit Card", "Debit Card", "Cash", or "Other".
- authentic: judge by vendor letterhead/logo presence, reference-number format consistency, computed-date-vs-displayed-date sanity, structured layout vs free-form. Lean "uncertain" when in doubt.
- Use null for any field you cannot confidently extract — never hallucinate.

Output ONLY the JSON.`;

// v3.7.19 — Classifier prompt: when caller doesn't know the doc type
const CLASSIFIER_SYSTEM_PROMPT = `Classify this Malaysian property/utility document into ONE of three categories.

Return STRICT JSON. No markdown. No commentary.

{
  "kind": "lhdn_cert" | "utility_bill" | "utility_receipt" | "unknown",
  "vendor": string or null,
  "confidence": "high" | "medium" | "low",
  "reason": string
}

DEFINITIONS:
- lhdn_cert: a Malaysian Inland Revenue Board (LHDN) stamp duty certificate or stamped tenancy agreement first page. Visual cues: LHDN STAMPS letterhead, e-Duti Setem QR code, instrument number, executed-on date, stamp-duty amount.
- utility_bill: a monthly utility bill from TNB / Air Selangor / SYABAS / IWK / Maxis / CelcomDigi / U Mobile / Yes / Unifi / Time. Visual cues: vendor letterhead, bill date, due date ("Tarikh Bayaran Akhir"), current charges, account number, billing period.
- utility_receipt: a payment confirmation/receipt for a utility bill. Visual cues: words like "Payment Receipt" / "Successful" / "REFERENCE NUMBER" / "TRANSACTION DATE", a single payment amount, a payment method (TNG/FPX/Credit Card), no monthly billing detail.
- unknown: anything else.

Output ONLY the JSON.`;

export async function POST(request) {
  // v3.7.4 — Rate limit: 8 extractions per minute per IP.
  const rate = checkRateLimit(request, { key: 'extract', max: 8, windowMs: 60_000 });
  if (!rate.allowed) return rateLimitResponse(rate);

  // v3.7.4 — Hard 8MB body cap.
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  if (contentLength > 8 * 1024 * 1024) {
    return jsonResponse({ ok: false, error: 'body_too_large', message: 'Request body exceeds 8MB.' }, 413);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  const kind = body.kind;
  const imageBase64 = (body.imageBase64 || '').toString();
  const mediaType = ALLOWED_MEDIA.includes(body.mediaType) ? body.mediaType : 'image/jpeg';
  const vendor = body.vendor || null;

  const VALID_KINDS = ['lhdn_cert', 'utility_bill', 'utility_receipt', 'auto'];
  if (!VALID_KINDS.includes(kind)) {
    return jsonResponse({ ok: false, error: 'invalid_kind', message: `kind must be one of: ${VALID_KINDS.join(', ')}` }, 400);
  }

  if (imageBase64.length === 0) {
    return jsonResponse({ ok: false, error: 'no_image', message: 'imageBase64 is required' }, 400);
  }
  if (imageBase64.length > MAX_IMAGE_BASE64_BYTES) {
    return jsonResponse({
      ok: false,
      error: 'image_too_large',
      message: `Image exceeds the ${Math.round(MAX_IMAGE_BASE64_BYTES / 1024 / 1024)}MB upload cap.`,
    }, 400);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonResponse({
      ok: false,
      error: 'analysis_unavailable',
      degradedMode: true,
      message: 'OCR temporarily unavailable. Demo will use mock data.',
    }, 200);
  }

  // v3.7.19 — pick prompt based on kind
  let systemPrompt, userText;
  if (kind === 'lhdn_cert') {
    systemPrompt = LHDN_SYSTEM_PROMPT;
    userText = 'Extract the LHDN cert fields per the schema. Return JSON only.';
  } else if (kind === 'utility_bill') {
    systemPrompt = UTILITY_SYSTEM_PROMPT;
    userText = `Extract the utility bill fields per the schema.${vendor ? ` Hint: this is a ${vendor} bill.` : ''} Return JSON only.`;
  } else if (kind === 'utility_receipt') {
    systemPrompt = RECEIPT_SYSTEM_PROMPT;
    userText = `Extract the utility-receipt fields per the schema.${vendor ? ` Hint: this is a ${vendor} payment.` : ''} Return JSON only.`;
  } else {  // 'auto'
    systemPrompt = CLASSIFIER_SYSTEM_PROMPT;
    userText = 'Classify this document per the schema. Return JSON only.';
  }

  // Build content block — image vs document depending on mediaType
  let mediaBlock;
  if (mediaType === 'application/pdf') {
    mediaBlock = {
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data: imageBase64.replace(/\s/g, '') },
    };
  } else {
    mediaBlock = {
      type: 'image',
      source: { type: 'base64', media_type: mediaType, data: imageBase64.replace(/\s/g, '') },
    };
  }

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [
        { role: 'user', content: [mediaBlock, { type: 'text', text: userText }] },
      ],
    });

    const raw = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('=== EXTRACT JSON PARSE ERROR ===', raw.slice(0, 400));
      return jsonResponse({
        ok: false,
        error: 'parse_failed',
        message: 'OCR returned malformed JSON. Demo will use mock data.',
        degradedMode: true,
      }, 200);
    }

    const fields = (parsed && typeof parsed === 'object' && parsed.fields) ? parsed.fields : {};
    return jsonResponse({ ok: true, kind, fields }, 200);
  } catch (err) {
    console.error('=== EXTRACT API ERROR ===', err?.status, err?.message);
    const status = err?.status || 500;
    if (status === 400 || status === 401 || status === 402 || status === 429) {
      return jsonResponse({
        ok: false,
        error: 'analysis_unavailable',
        degradedMode: true,
        message: 'OCR temporarily unavailable (likely API credit issue). Demo will use mock data.',
      }, 200);
    }
    return jsonResponse({
      ok: false,
      error: 'server_error',
      message: 'OCR service hit an unexpected error. Demo will use mock data.',
      degradedMode: true,
    }, 500);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
