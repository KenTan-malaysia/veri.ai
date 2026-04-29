// v3.6.0 — Persist completed audit reports to Supabase.
//
// POST /api/audit/save
// Body: {
//   caseRef:        string                 (FA-XXXX from makeCaseRef)
//   pct:            number 0-100
//   level:          'strong'|'moderate'|'weak'
//   presentCount:   number
//   totalCount:     number
//   facts:          { monthlyRent, leaseTermMonths, propertyAddress, landlordName, tenantName, executionDate }
//   clauses:        { latePay: {present, evidence, confidence}, ... }
//   warnings:       Array<{severity, title, detail}>
//   missingClauses: string[]                (clause IDs)
//   contentHash:    string                  (SHA-256 from PDF gen, optional)
// }
// Auth: optional. If user is signed in, audit_reports.user_id = auth.uid().
// Otherwise the row is owned by no one (anonymous audit) — RLS policy
// allows insert and the row is keyed by case_ref.
//
// Degraded mode: returns { ok: false, degradedMode: true } if Supabase
// not configured. Frontend doesn't need to do anything special — the
// page already works fully via localStorage / URL-encoded.

import { getServerClient, isSupabaseConfigured } from '../../../../lib/supabase';

const VALID_LEVELS = ['strong', 'moderate', 'weak'];

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  if (!isSupabaseConfigured()) {
    return jsonResponse({
      ok: false,
      degradedMode: true,
      message: 'Audit history sync not configured — saved locally only.',
    }, 200);
  }

  const supabase = getServerClient();
  if (!supabase) {
    return jsonResponse({
      ok: false,
      degradedMode: true,
      message: 'Audit history sync unavailable.',
    }, 200);
  }

  const caseRef = String(body.caseRef || '').trim();
  if (!caseRef) {
    return jsonResponse({ ok: false, error: 'missing_case_ref' }, 400);
  }

  // Auth — best-effort. Logged-in users own their reports; anonymous users
  // can still save (RLS policy allows insert with null user_id).
  const authHeader = request.headers.get('authorization');
  let userId = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    } catch (e) { /* token invalid */ }
  }

  const facts = body.facts || {};
  const row = {
    case_ref:           caseRef,
    user_id:            userId,
    pct:                numOrNull(body.pct),
    level:              VALID_LEVELS.includes(body.level) ? body.level : null,
    present_count:      numOrNull(body.presentCount),
    total_count:        numOrNull(body.totalCount) || 10,
    monthly_rent:       numOrNull(facts.monthlyRent),
    lease_term_months:  numOrNull(facts.leaseTermMonths),
    property_address:   strOrNull(facts.propertyAddress),
    landlord_name:      strOrNull(facts.landlordName),
    tenant_name:        strOrNull(facts.tenantName),
    execution_date:     dateOrNull(facts.executionDate),
    clauses:            body.clauses && typeof body.clauses === 'object' ? body.clauses : null,
    warnings:           Array.isArray(body.warnings) ? body.warnings : null,
    missing_clauses:    Array.isArray(body.missingClauses) ? body.missingClauses : null,
    content_hash:       strOrNull(body.contentHash),
    generated_at:       new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('audit_reports')
      .upsert(row, { onConflict: 'case_ref' })
      .select('id, case_ref, generated_at')
      .single();

    if (error) {
      console.error('=== AUDIT SAVE ERROR ===', error);
      return jsonResponse({
        ok: false,
        error: 'db_error',
        message: error.message || 'Could not save audit report.',
        degradedMode: true,
      }, 200);
    }

    return jsonResponse({
      ok: true,
      degradedMode: false,
      caseRef: data.case_ref,
      dbId: data.id,
      generatedAt: data.generated_at,
    }, 200);
  } catch (err) {
    console.error('=== UNEXPECTED ERROR ===', err);
    return jsonResponse({
      ok: false,
      error: 'unexpected',
      message: 'Unexpected server error.',
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

function dateOrNull(v) {
  if (!v) return null;
  const s = String(v).trim();
  // Accept YYYY-MM-DD; reject anything that doesn't parse
  if (!/^\d{4}-\d{2}-\d{2}/.test(s)) return null;
  const d = new Date(s);
  return Number.isFinite(d.getTime()) ? s.slice(0, 10) : null;
}
