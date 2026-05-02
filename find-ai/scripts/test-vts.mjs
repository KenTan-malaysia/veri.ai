#!/usr/bin/env node
// scripts/test-vts.js
// ─────────────────────────────────────────────────────────────────────────────
// Veri Trust Score v1.3 — terminal smoke test.
//
//   node scripts/test-vts.js
//   node scripts/test-vts.js --verbose         # also print computation breakdown
//   node scripts/test-vts.js --case C-04       # run one case in detail
//
// 30 realistic Malaysian tenant cases. Exits non-zero if any case crashes
// or produces an obviously-broken output (NaN, undefined, score outside 0-100).
// ─────────────────────────────────────────────────────────────────────────────

// ESM import via dynamic import (works in Next.js project without changing .mjs)
async function main() {
  const { score, PARAMS } = await import("../src/lib/vts.js");

  const evenSpread = (utility, tiers) =>
    tiers.map((tier, i) => ({ utility, tier, months_ago: i }));

  const CASES = [
    {
      id: "C-01", name: "Aishah Rahman", profile: "KL pro, 10mo, near-perfect",
      events: [
        ...evenSpread("TNB",    ["Upfront","Upfront","Upfront","Upfront","Upfront","Upfront","Upfront","Upfront","OnTime","OnTime"]),
        ...evenSpread("Water",  ["Upfront","OnTime","Upfront","OnTime","Upfront","OnTime","OnTime","OnTime","OnTime","OnTime"]),
        ...evenSpread("Mobile", ["Upfront","OnTime","Upfront","OnTime","OnTime","OnTime","OnTime","OnTime","OnTime","OnTime"]),
      ],
    },
    {
      id: "C-02", name: "Kumar Suresh", profile: "KK teacher, 8mo, 1 old VeryLate",
      events: [
        ...evenSpread("TNB",    ["Upfront","Upfront","Upfront","Upfront","Upfront","OnTime","OnTime","Late"]),
        ...evenSpread("Water",  ["Upfront","Upfront","Upfront","OnTime","OnTime","VeryLate","OnTime","OnTime"]),
        ...evenSpread("Mobile", ["OnTime","OnTime","OnTime","OnTime","OnTime","OnTime","OnTime","OnTime"]),
      ],
    },
    {
      id: "C-03", name: "Mei Ling Tan", profile: "Penang fresh grad, 3mo perfect",
      events: [
        ...evenSpread("TNB", ["OnTime","OnTime","OnTime"]),
        ...evenSpread("Water", ["OnTime","OnTime","OnTime"]),
        ...evenSpread("Mobile", ["OnTime","OnTime","OnTime"]),
      ],
    },
    {
      id: "C-04", name: "Hafiz Ismail", profile: "KL gig worker, 14mo, 28% late on TNB",
      events: [
        ...evenSpread("TNB",    ["Upfront","OnTime","Upfront","Late","Upfront","OnTime","Late","Upfront","OnTime","Upfront","Late","OnTime","Upfront","Late"]),
        ...evenSpread("Water", Array(14).fill("OnTime")),
        ...evenSpread("Mobile", ["Upfront","Upfront","OnTime","Upfront","Late","OnTime","Upfront","OnTime","Upfront","OnTime","Upfront","Late","OnTime","OnTime"]),
      ],
    },
    {
      id: "C-05", name: "Lee Mun Choong", profile: "Ipoh retiree, 24mo perfect",
      events: [
        ...evenSpread("TNB",   Array(24).fill("Upfront")),
        ...evenSpread("Water", Array(24).fill("OnTime")),
        ...evenSpread("Mobile", Array(18).fill("Upfront").concat(Array(6).fill("OnTime"))),
      ],
    },
    {
      id: "C-06", name: "Nurul Amni", profile: "Recent default 1.5mo ago",
      events: [
        { utility: "TNB", tier: "OnTime",  months_ago: 0 },
        { utility: "TNB", tier: "Default", months_ago: 1.5 },
        { utility: "TNB", tier: "OnTime",  months_ago: 3 },
        { utility: "TNB", tier: "OnTime",  months_ago: 4 },
        { utility: "TNB", tier: "OnTime",  months_ago: 5 },
        { utility: "TNB", tier: "OnTime",  months_ago: 6 },
        { utility: "TNB", tier: "OnTime",  months_ago: 7 },
        ...evenSpread("Water",  Array(8).fill("OnTime")),
        ...evenSpread("Mobile", Array(8).fill("OnTime")),
      ],
    },
    {
      id: "C-07", name: "Ahmad Faisal", profile: "VeryLate 60d ago (disputed)",
      events: [
        { utility: "TNB", tier: "OnTime",   months_ago: 0 },
        { utility: "TNB", tier: "OnTime",   months_ago: 1 },
        { utility: "TNB", tier: "VeryLate", months_ago: 2 },
        { utility: "TNB", tier: "OnTime",   months_ago: 3 },
        { utility: "TNB", tier: "OnTime",   months_ago: 4 },
        { utility: "TNB", tier: "OnTime",   months_ago: 5 },
        { utility: "TNB", tier: "OnTime",   months_ago: 6 },
        { utility: "TNB", tier: "OnTime",   months_ago: 7 },
        { utility: "TNB", tier: "OnTime",   months_ago: 8 },
        { utility: "TNB", tier: "OnTime",   months_ago: 9 },
        ...evenSpread("Water",  Array(10).fill("OnTime")),
        ...evenSpread("Mobile", Array(10).fill("OnTime")),
      ],
    },
    {
      id: "C-08", name: "David Wong", profile: "PJ 2-utility tenant (no Mobile)",
      events: [
        ...evenSpread("TNB",   Array(12).fill("OnTime")),
        ...evenSpread("Water", Array(12).fill("OnTime")),
      ],
    },
    {
      id: "C-09", name: "Siti Nurhaliza", profile: "Foreign worker JB, 6mo, Silver",
      events: [
        ...evenSpread("TNB",    Array(6).fill("OnTime")),
        ...evenSpread("Water",  ["OnTime","OnTime","Late","OnTime","Late","OnTime"]),
        ...evenSpread("Mobile", Array(6).fill("OnTime")),
      ],
    },
    {
      id: "C-10", name: "Rajesh Kumar", profile: "GAMING — IC reused 4× in 5d",
      events: [
        ...evenSpread("TNB",   Array(12).fill("Upfront")),
        ...evenSpread("Water", Array(12).fill("Upfront")),
        ...evenSpread("Mobile", Array(12).fill("Upfront")),
      ],
      special: { ic_reuse_count: 4, ic_reuse_window_days: 5 },
    },
    { id: "C-11", name: "Faridah (snapshot)", profile: "1 TNB bill, last month only",
      events: [{ utility: "TNB", tier: "OnTime", months_ago: 0 }] },
    { id: "C-12", name: "Zainab (sparse)", profile: "3 bills across 8mo (gaps)",
      events: [
        { utility: "TNB",   tier: "OnTime", months_ago: 0 },
        { utility: "Water", tier: "OnTime", months_ago: 4 },
        { utility: "TNB",   tier: "OnTime", months_ago: 7 },
      ] },
    { id: "C-13", name: "Old-data Razak", profile: "Bills months 6-13, no recent",
      events: [
        ...Array.from({length: 8}, (_, i) => ({ utility: "TNB",    tier: "Upfront", months_ago: i + 6 })),
        ...Array.from({length: 8}, (_, i) => ({ utility: "Water",  tier: "OnTime",  months_ago: i + 6 })),
        ...Array.from({length: 8}, (_, i) => ({ utility: "Mobile", tier: "OnTime",  months_ago: i + 6 })),
      ] },
    { id: "C-14", name: "Kim Wei", profile: "2 bills only — TNB + Water",
      events: [
        { utility: "TNB",   tier: "OnTime", months_ago: 0 },
        { utility: "Water", tier: "OnTime", months_ago: 0 },
      ] },
    { id: "C-15", name: "Gap-Tenant Rosli", profile: "Bills months 0-2 then 10-12",
      events: [
        ...Array.from({length: 3}, (_, i) => ({ utility: "TNB",   tier: "OnTime", months_ago: i })),
        ...Array.from({length: 3}, (_, i) => ({ utility: "Water", tier: "OnTime", months_ago: i })),
        ...Array.from({length: 3}, (_, i) => ({ utility: "Mobile", tier: "OnTime", months_ago: i })),
        ...Array.from({length: 3}, (_, i) => ({ utility: "TNB",   tier: "OnTime", months_ago: i + 10 })),
        ...Array.from({length: 3}, (_, i) => ({ utility: "Water", tier: "OnTime", months_ago: i + 10 })),
        ...Array.from({length: 3}, (_, i) => ({ utility: "Mobile", tier: "OnTime", months_ago: i + 10 })),
      ] },
    { id: "C-16", name: "Newcomer Aida", profile: "JB foreign worker, 2mo",
      events: [
        { utility: "TNB",    tier: "OnTime", months_ago: 0 },
        { utility: "TNB",    tier: "OnTime", months_ago: 1 },
        { utility: "Water",  tier: "OnTime", months_ago: 0 },
        { utility: "Water",  tier: "OnTime", months_ago: 1 },
        { utility: "Mobile", tier: "OnTime", months_ago: 0 },
        { utility: "Mobile", tier: "OnTime", months_ago: 1 },
      ] },
    { id: "C-17", name: "Single-Mobile Zul", profile: "1 Mobile bill only",
      events: [{ utility: "Mobile", tier: "OnTime", months_ago: 0 }] },
    { id: "C-18", name: "Old-perfect Mahesh", profile: "24mo perfect, newest 6mo old",
      events: [
        ...Array.from({length: 24}, (_, i) => ({ utility: "TNB",    tier: "Upfront", months_ago: i + 6 })),
        ...Array.from({length: 24}, (_, i) => ({ utility: "Water",  tier: "OnTime",  months_ago: i + 6 })),
        ...Array.from({length: 24}, (_, i) => ({ utility: "Mobile", tier: "OnTime",  months_ago: i + 6 })),
      ] },
    { id: "C-19", name: "Recent-burst Pravin", profile: "6 bills in last 6 weeks",
      events: [
        { utility: "TNB",    tier: "OnTime", months_ago: 0 },
        { utility: "TNB",    tier: "OnTime", months_ago: 1 },
        { utility: "Water",  tier: "OnTime", months_ago: 0 },
        { utility: "Water",  tier: "OnTime", months_ago: 1 },
        { utility: "Mobile", tier: "OnTime", months_ago: 0 },
        { utility: "Mobile", tier: "OnTime", months_ago: 1 },
      ] },
    { id: "C-20", name: "TNB-only Tan", profile: "TNB only, 12mo perfect",
      events: evenSpread("TNB", Array(12).fill("Upfront")) },
    { id: "C-21", name: "Sabah Single-Mum", profile: "6mo, 3util, 2 lates",
      events: [
        ...evenSpread("TNB",    ["OnTime","OnTime","Late","OnTime","Late","OnTime"]),
        ...evenSpread("Water",  Array(6).fill("OnTime")),
        ...evenSpread("Mobile", Array(6).fill("OnTime")),
      ] },
    { id: "C-22", name: "Sarawak Landlord", profile: "36mo perfect, 3util",
      events: [
        ...evenSpread("TNB",   Array(36).fill("Upfront")),
        ...evenSpread("Water", Array(36).fill("Upfront")),
        ...evenSpread("Mobile", Array(36).fill("Upfront")),
      ] },
    { id: "C-23", name: "FW Yanti", profile: "JB FW 4mo, all OnTime",
      events: [
        ...evenSpread("TNB",    Array(4).fill("OnTime")),
        ...evenSpread("Water",  Array(4).fill("OnTime")),
        ...evenSpread("Mobile", Array(4).fill("OnTime")),
      ] },
    { id: "C-24", name: "Student Adam", profile: "5mo TNB only",
      events: evenSpread("TNB", Array(5).fill("OnTime")) },
    { id: "C-25", name: "Selangor FH", profile: "18mo, default 100d ago (just outside tail)",
      events: [
        ...Array.from({length: 18}, (_, i) => i === 3
          ? { utility: "TNB", tier: "Default", months_ago: 3.4 }
          : { utility: "TNB", tier: "OnTime", months_ago: i }),
        ...evenSpread("Water",  Array(18).fill("OnTime")),
        ...evenSpread("Mobile", Array(18).fill("OnTime")),
      ] },
    { id: "C-26", name: "Penang Nurse Lim", profile: "12mo, 1 default 6mo ago",
      events: [
        ...Array.from({length: 12}, (_, i) => i === 6
          ? { utility: "TNB", tier: "Default", months_ago: 6 }
          : { utility: "TNB", tier: "OnTime", months_ago: i }),
        ...evenSpread("Water",  Array(12).fill("OnTime")),
        ...evenSpread("Mobile", Array(12).fill("OnTime")),
      ] },
    { id: "C-27", name: "Kuching Engineer", profile: "15mo, all upfront",
      events: [
        ...evenSpread("TNB",   Array(15).fill("Upfront")),
        ...evenSpread("Water", Array(15).fill("Upfront")),
        ...evenSpread("Mobile", Array(15).fill("Upfront")),
      ] },
    { id: "C-28", name: "Ipoh SmallBiz", profile: "9mo, 3util, mixed",
      events: [
        ...evenSpread("TNB",    ["Upfront","OnTime","Late","OnTime","OnTime","Upfront","OnTime","Late","OnTime"]),
        ...evenSpread("Water",  ["OnTime","OnTime","OnTime","OnTime","Late","OnTime","OnTime","OnTime","OnTime"]),
        ...evenSpread("Mobile", Array(9).fill("OnTime")),
      ] },
    { id: "C-29", name: "Cyberjaya Couple", profile: "8mo, very strong",
      events: [
        ...evenSpread("TNB",    ["Upfront","Upfront","Upfront","Upfront","Upfront","OnTime","OnTime","OnTime"]),
        ...evenSpread("Water",  ["Upfront","Upfront","OnTime","OnTime","OnTime","OnTime","OnTime","OnTime"]),
        ...evenSpread("Mobile", Array(8).fill("Upfront")),
      ] },
    { id: "C-30", name: "Empty-Submit Halim", profile: "Tenant submitted nothing",
      events: [] },
  ];

  // CLI flags
  const verbose = process.argv.includes("--verbose");
  const caseFlagIdx = process.argv.indexOf("--case");
  const onlyCase = caseFlagIdx >= 0 ? process.argv[caseFlagIdx + 1] : null;

  // ── Single-case detail mode ─────────────────────────────────────────────
  if (onlyCase) {
    const c = CASES.find((x) => x.id === onlyCase);
    if (!c) { console.error(`No case ${onlyCase}`); process.exit(1); }
    const r = score(c);
    console.log(`\n${c.id}  ${c.name}\n${c.profile}\n${"─".repeat(70)}`);
    console.log(JSON.stringify(r, null, 2));
    return;
  }

  // ── Smoke-test mode ─────────────────────────────────────────────────────
  console.log(`\nVTS ${PARAMS.ENGINE_VERSION} smoke test  ·  ${CASES.length} cases\n`);
  console.log(
    `${"#".padEnd(6)}${"Tenant".padEnd(22)}${"Score".padEnd(7)}${"Tier".padEnd(10)}${"Badge".padEnd(18)}${"C".padEnd(7)}Notes`,
  );
  console.log("─".repeat(100));

  let failures = 0;
  let blocked = 0;
  let scored = 0;
  const tierCount = {};

  for (const c of CASES) {
    let r;
    try { r = score(c); }
    catch (e) {
      console.log(`${c.id.padEnd(6)}${c.name.padEnd(22)}CRASH: ${e.message}`);
      failures++;
      continue;
    }
    if (r.blocked) {
      console.log(`${c.id.padEnd(6)}${c.name.padEnd(22)}${"—".padEnd(7)}${"BLOCKED".padEnd(10)}${"—".padEnd(18)}${"—".padEnd(7)}${r.block_reason}`);
      blocked++;
      continue;
    }
    if (
      typeof r.score !== "number" || Number.isNaN(r.score) ||
      r.score < 0 || r.score > 100 ||
      !r.tier || !r.badge
    ) {
      console.log(`${c.id.padEnd(6)}${c.name.padEnd(22)}INVALID OUTPUT: score=${r.score} tier=${r.tier} badge=${r.badge}`);
      failures++;
      continue;
    }
    scored++;
    tierCount[r.tier] = (tierCount[r.tier] || 0) + 1;
    const notes = [];
    if (r.breakdown.floor_reason) notes.push("floor:" + r.breakdown.floor_reason);
    if (r.display_message) notes.push("msg");
    console.log(
      `${c.id.padEnd(6)}${c.name.padEnd(22)}${String(r.score).padEnd(7)}${r.tier.padEnd(10)}${r.badge.padEnd(18)}${r.confidence.toFixed(2).padEnd(7)}${notes.join("  ")}`,
    );
    if (verbose) {
      console.log(`        breakdown: ${JSON.stringify(r.breakdown)}`);
      console.log(`        reasons:   ${r.reasons.join(" | ")}`);
    }
  }

  console.log("─".repeat(100));
  console.log(
    `Result: ${scored} scored  ·  ${blocked} blocked  ·  ${failures} failure(s)  ·  Tiers: ${Object.entries(tierCount).map(([t,n])=>`${n}× ${t}`).join("  ·  ")}`,
  );

  if (failures > 0) { console.error(`\nFAIL — ${failures} case(s) produced invalid output.`); process.exit(1); }
  console.log(`\nPASS  ·  engine ${PARAMS.ENGINE_VERSION}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
