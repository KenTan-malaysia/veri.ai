// ============================================================
// Resend email helper — plain fetch wrapper.
// No-ops gracefully when RESEND_API_KEY is unset.
// ============================================================

export function hasResend() {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Send a transactional email via Resend.
 * @param {object} args
 * @param {string|string[]} args.to        Single address or list.
 * @param {string} args.subject
 * @param {string} args.text               Plain-text body.
 * @param {string} [args.from]             Override sender. Defaults to env RESEND_FROM or a safe onboarding-friendly default.
 */
export async function sendEmail({ to, subject, text, html, from }) {
  if (!hasResend()) return { ok: false, skipped: true, reason: 'RESEND_API_KEY missing' };
  const sender = from || process.env.RESEND_FROM || 'Unbelievebe <onboarding@resend.dev>';
  const body = {
    from: sender,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
    ...(html ? { html } : {}),
  };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, status: res.status, error: data?.message || 'resend failed', data };
    return { ok: true, id: data?.id, data };
  } catch (err) {
    return { ok: false, error: err.message || 'network error' };
  }
}
