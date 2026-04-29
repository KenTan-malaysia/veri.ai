# Tenant Matching

Load this file when: tenant match, enquiry, looking for unit, match leads.

---

## What Claude Needs

| File | Key Columns |
|---|---|
| Tenant enquiry Excel | Project · Area/State · Property Type · Enquiry Date · Move-in Date · Name · Contact · Budget · Furnished · Rooms · Remark |
| Leads Excel | Landlord Name · Contact · Project · Area · Property Type · Rooms · Furnished · Available Date · Rental Price · Selling Price · Remark |

## Required Fields (flag if blank before proceeding)

| Field | Why |
|---|---|
| Area / State | Postcode boundary rule — never guess state from project name |
| Furnished | Primary filter — fully / partially / unfurnished |
| Budget | Primary filter — must be confirmed |
| Move-in date | Exact date preferred. TBC = skip date filter + flag. "June/July" = ask for exact date |

---

## Priority Matching Order

| Priority | Factor | Rule |
|---|---|---|
| 1 | Area / Project / Surrounding area | Exact condo = best match, close fast. Exact area = strong. Surrounding = same state + same postcode zone only. Different state = never suggest. Hard boundary. |
| 2 | Property type | Exact type only. Exclude wrong type unless tenant has no preference. |
| 3 | Budget + Furnishing | Within budget + exact furnishing = perfect. Up to 10–15% over = flag clearly. Over 15% = exclude. Both off = exclude. |

## Postcode Zones

| State | Postcode range |
|---|---|
| Kuala Lumpur | 50000 – 60000 |
| Selangor | 40000 – 48000 |
| Penang | 10000 – 14400 |
| Perak | 30000 – 36810 |

## Surrounding Area Rule

| Match type | Action |
|---|---|
| Same postcode zone | Show |
| Same state, different zone | Show only if no match in same zone — flag clearly |
| Different state | Never suggest |

---

## Scoring System (out of 100)

| Criteria | Points | Rule |
|---|---|---|
| Area | 30 | Exact = 30. Same zone = 20. No match = 0. |
| Furnished | 25 | Exact = 25. Mismatch = 0. |
| Budget | 25 | Within budget = 25. Up to 10% over = 15. Up to 15% over = 8. Over 15% = 0. |
| Property type | 15 | Exact = 15. No match = 0. |
| Move-in date | 5 | On time = 5. Within 2 weeks late = 3. Over 2 weeks late = 0. |

## Score Labels

| Score | Label | Action |
|---|---|---|
| 90–100 | Perfect match | Pitch first |
| 70–89 | Strong match | Worth pitching |
| 50–69 | Partial match | Flag the gap to tenant |
| Below 50 | Weak match | Skip unless nothing better exists |

---

## Matching Steps

1. Ken uploads both Excel files.
2. Check all required fields — flag blanks before proceeding.
3. Filter leads for each tenant using priority order.
4. Score every matched listing out of 100.
5. Rank tenants by urgency — tightest move-in date + fewest matches = act first.
6. Deliver WhatsApp report (copy-paste ready) + Excel match report.
7. No match = report exactly why (no listings in area / budget too low / wrong type).

---

## WhatsApp Match Report Template

Tenant Match Report — [Date]

Priority Order (act on these first):
1. [Tenant Name] — [Condo/Area] — [Type] — RM[X] — [Furnishing] — [X] matches found
2. [Tenant Name] — [Condo/Area] — [Type] — RM[X] — [Furnishing] — no match found

---

[Tenant Name] | [Area] | [Type] | RM[X] | [Furnishing] | Move-in: [Date]

Match 1 — Score: 95/100 (Perfect match)
Landlord: [Name] | Contact: [Number]
Project: [Name] | Type: [Type] | Rent: RM[X] | [Furnishing] | Avail: [Date]
Remark: [Remark]

Match 2 — Score: 75/100 (Strong match — 8% above budget)
Landlord: [Name] | Contact: [Number]
Project: [Name] | Type: [Type] | Rent: RM[X] | [Furnishing] | Avail: [Date]
Remark: [Remark]

No match: [Tenant Name] — no [Type] listings in [Area] within budget.
