// v3.4.31 — Short URL redirect: find.ai/r/{reportId} → /trust/{reportId}
//
// Why a separate short URL? WhatsApp shares are length-sensitive. A short URL
// like find.ai/r/TC-7841 is friendlier than /trust/TC-2026-04-12345. The
// rich-link preview (OG meta) follows the redirect so previews still work.
//
// Per WEB_UX_PATTERNS.md viral mechanic + ARCH_REVEAL_TIERS.md Trust Card
// visual implications.

import { redirect } from 'next/navigation';

export async function GET(request, { params }) {
  const { reportId } = await params;
  redirect(`/trust/${reportId}`);
}
