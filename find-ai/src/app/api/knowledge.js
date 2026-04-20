// Knowledge Base — topic-based lookup for Find.ai
// Each topic has: keywords (EN/BM/ZH), law content, real case outcomes, and templates

const TOPICS = {

  deposit: {
    keywords: ['deposit', 'wang cagaran', 'sekuriti', '押金', '保证金', 'refund', 'return deposit', 'keep deposit', 'deduct', 'potong', 'tolak', '扣', 'wear and tear', 'haus dan lusuh', '磨损', '2+1', '3+1'],
    content: `TENANCY & DEPOSITS:
- Standard deposit structure: 2+1+½ = 2 months security deposit + 1 month advance rental + ½ month utility deposit.
- Some landlords charge 3+1+½ for higher-value properties or foreign tenants.
- Deposit must be returned after tenancy ends — typically within 14-30 days after handover and inspection.
- Landlord CAN deduct for: unpaid rent, unpaid bills, damage beyond normal wear and tear. CANNOT deduct for: normal wear (faded paint, minor scratches), pre-existing damage, professional cleaning unless agreed in writing.
- "Normal wear and tear" = faded paint, minor nail holes, worn carpets. NOT broken doors, damaged walls, missing fixtures.
- Verbal tenancy agreement IS legally valid but nearly impossible to enforce. Always insist on written + stamped.
- Residential Tenancy Act 2026 (RTA) introduces standardized deposit rules + mandatory Residential Tenancy Tribunal (RTT) for residential disputes. See "RTA 2026" topic for full rules. For commercial/non-residential disputes: civil courts or Tribunal Tuntutan Pengguna (consumer claims ≤RM5,000) still apply.

REAL CASES — DEPOSIT:
• Landlord kept full deposit claiming "dirty walls" — Tribunal ruled faded paint = normal wear. Ordered full refund + RM500 compensation for delay. Landlord lost because no photo evidence of actual damage.
• Tenant left with 2 weeks unpaid rent on RM1,800/month agreement. Landlord deducted RM900 from RM3,600 security deposit. Tribunal upheld — proportionate and documented.
• Landlord deducted RM2,000 for "professional cleaning" not stated in agreement. Tribunal ordered refund — cleaning deduction requires explicit written clause.
• Tenant disputed RM800 deduction for broken kitchen cabinet. Landlord produced move-in photos showing intact cabinet + move-out photos showing damage. Tribunal upheld deduction.

TEMPLATE — DEPOSIT DEMAND LETTER:
"Dear [Landlord Name],
RE: DEMAND FOR RETURN OF SECURITY DEPOSIT — [Property Address]
The tenancy has expired/been terminated as of [Date]. The property was duly returned on [Handover Date] in good condition subject to normal wear and tear.
I hereby demand the return of my security deposit of RM[Amount] within FOURTEEN (14) days from the date of this letter.
Failure to return the deposit with an itemized statement of any lawful deductions will result in a claim being filed at the appropriate tribunal/court.
[Tenant Name]
[Date]"`
  },

  stamp_duty: {
    keywords: ['stamp', 'duti setem', '印花税', 'setem', 'stamping', 'unstamped', 'tak stamp', '没盖章', 'SDSAS', 'MyTax', 'late stamp', 'penalty stamp'],
    content: `STAMP DUTY ON TENANCY (SDSAS 2026):
- Stamp Act 1949, First Schedule, Item 32(a).
- 2026 SDSAS system: self-assessment via MyTax portal.
- NO MORE RM2,400 exemption (removed in 2026).
- Rates per RM250 of annual rent: ≤1yr = RM1, 1-3yr = RM3, 3-5yr = RM5, >5yr = RM7.
- Formula: Math.ceil(annual_rent / 250) × rate. Minimum duty: RM10.
- Must stamp within 30 days of execution. Late = penalty up to 100% of duty owed.
- Unstamped agreement CANNOT be used as evidence in court (Stamp Act s.52).
- BUT unstamped agreement is NOT void — it's still valid between parties. Just can't be presented in court/Tribunal as proof.
- Deposit under unstamped agreement: landlord CANNOT use the agreement to justify retention in court. Tenant can challenge deposit deductions citing s.52.
- CURE: late stamping + penalty payment makes the agreement admissible again. Penalty rates:
  * Within 3 months late: RM50 or 10% of deficient duty (whichever higher)
  * 3-6 months late: RM100 or 20% of deficient duty (whichever higher)
  * Beyond 6 months: case-by-case assessment by LHDN
- Common mistake: landlord thinks "we both signed it so it's valid" — valid yes, but USELESS in court without stamping.

STAMP DUTY ON PROPERTY PURCHASE (MOT):
- Malaysian citizens/PRs: First RM100K: 1%, RM100K-500K: 2%, RM500K-1M: 3%, Above RM1M: 4%
- Foreign buyers: flat 8% on residential property from 1 Jan 2026.
- First-time homebuyer exemption: 100% exemption on MOT + loan stamp duty for homes ≤RM500,000 (until 31 Dec 2027).
- Stamp duty on loan agreement: flat 0.5% of total loan amount.

STAMPS PORTAL — STEP-BY-STEP E-STAMPING (LHDN DIGITAL SYSTEM):
From 2026, ALL tenancy stamping goes through the LHDN STAMPS portal (stamps.hasil.gov.my). No more walk-in counter for standard tenancies.

WALKTHROUGH — FIRST-TIME LANDLORD:
1. Register at mytax.hasil.gov.my → get TIN (Tax Identification Number). All landlords collecting rent need a TIN from 2026.
2. Log in to stamps.hasil.gov.my with MyTax credentials.
3. Click "Permohonan Setem" (Application for Stamping) → "Perjanjian Sewa" (Tenancy Agreement).
4. SDSAS self-assessment form auto-loads. Fill:
   - Landlord details (name, IC/SSM, TIN, address)
   - Tenant details (name, IC/passport, contact)
   - Property address + type (residential/commercial/industrial)
   - Lease start + end date
   - Monthly rent + any non-rent considerations (premium, key money)
   - Deposit amount (for record, not taxed)
5. System auto-calculates duty using Math.ceil(annual_rent ÷ 250) × rate. VERIFY the number matches your own calculation — you are legally responsible for accuracy under SDSAS.
6. Upload signed tenancy agreement (PDF, max 10MB). Both pages of signatures required.
7. Pay online: FPX (direct bank), credit card, or e-wallet (TNG, Boost, GrabPay). Receipt issued instantly.
8. Download digital stamp certificate (PDF with QR code + unique Stamp Serial No.). This is your PROOF of stamping.
9. Attach the stamp certificate PDF to your signed tenancy agreement. Keep both together — this is the "stamped agreement" going forward.

DIGITAL STAMP CERTIFICATE — IS MY PDF LEGALLY VALID?
- YES. LHDN digital certificates are legally equivalent to physical stamps under Stamp Act 1949 (as amended 2024) + Digital Signature Act 1997.
- QR code on certificate links to stamps.hasil.gov.my verification page — anyone (tenant, judge, Tribunal, MC) can scan to confirm authenticity.
- Courts and RTT accept digital certificates as evidence. No need to print and physically affix.
- Verification URL pattern: https://stamps.hasil.gov.my/verify?serial=[STAMP_SERIAL_NO]
- Red flags (certificate may be fake):
  * QR code doesn't resolve to stamps.hasil.gov.my
  * Serial number not found in LHDN database
  * Date/amount on cert doesn't match agreement
  * PDF metadata shows recent edit after issuance
- Tenant's right: DEMAND the stamp certificate within 30 days of signing. If landlord can't produce it, agreement is unstamped — tenant has leverage in any future dispute.

LATE STAMPING VIA STAMPS PORTAL (CURE PROCESS):
1. Log in → "Permohonan Setem" → select agreement → system detects late filing.
2. System auto-calculates penalty based on how late:
   - ≤3 months late: RM50 or 10% of duty, whichever higher
   - 3-6 months late: RM100 or 20%
   - >6 months: case-by-case (may require manual review by LHDN officer)
3. Pay duty + penalty together. Certificate issued with "Late Stamped" annotation.
4. Agreement is now admissible in court. BUT: if you already tried to use unstamped agreement and lost, that case is finished — you cannot re-litigate.

2026 TRANSITION YEAR CONCESSION:
- LHDN issued a Public Ruling (2026/01) granting NO PENALTIES for calculation errors made in good faith during 2026.
- Applies to first-time SDSAS users who under-declared because of misunderstanding the new system.
- Does NOT cover deliberate underpayment or late stamping (late penalty still applies separately).
- Keep screenshot of your SDSAS calculation + any correspondence with LHDN as proof of good-faith effort.

WHAT LANDLORDS GET WRONG (STAMPS portal):
- Using old 2025 forms: portal auto-rejects. You must use the 2026 SDSAS flow.
- Stamping only 1 copy: you need stamping for EACH executed copy if lodging with land office or court. Portal lets you select number of copies — extra copies = RM10 each (duplicate duty).
- Forgetting to download certificate: LHDN keeps record for 7 years, but losing the PDF means you must re-download. Save it in 2 places (email + cloud).
- Letting tenancy run past stamp certificate date without renewal stamping: each renewal (even auto-renew) needs fresh stamping.

REAL CASES — STAMP DUTY + STAMPS PORTAL:
• Landlord tried to enforce deposit deduction using unstamped agreement at Tribunal. Case dismissed — s.52 Stamp Act. Landlord then paid late stamping penalty (RM100 + 20%) via STAMPS portal and refiled. Second attempt succeeded because agreement was now admissible.
• Tenant paid RM2,000/month rent. Landlord never stamped the agreement for 2 years. When deposit dispute arose, tenant's lawyer used s.52 to block landlord from presenting the agreement. Landlord lost the entire RM4,000 deposit claim.
• First-time buyer purchased RM480,000 condo — saved RM7,200 in MOT stamp duty + RM1,200 in loan stamp duty under first-time exemption. Total savings: RM8,400.
• Landlord filed SDSAS wrongly (used old 2025 rates) during transition. LHDN flagged underpayment RM120. Landlord paid shortfall — no penalty under 2026 transition concession. Saved ~RM50 in penalty.
• Tenant verified landlord's stamp certificate via QR scan before moving in — QR link was broken. Tenant demanded proper certificate before paying deposit. Landlord had faked the PDF to avoid SDSAS cost. Tenant walked away, kept RM5,000 deposit.`
  },

  eviction: {
    keywords: ['evict', 'eviction', 'kick out', 'halau', 'usir', 'pengusiran', '驱逐', '赶走', 'change lock', 'changed lock', 'change the lock', 'tukar kunci', '换锁', 'cut water', 'cut electric', 'potong air', 'potong elektrik', 'possession order', 'writ', 'bailiff', 'won\'t leave', 'tak nak keluar', '不搬走', 'refuse to leave', 'trespass', 'lock out', 'locked out'],
    content: `EVICTION:
- RESIDENTIAL tenancies from 2026: governed by Residential Tenancy Act 2026 — file at Residential Tenancy Tribunal (RTT), not Magistrate's Court. Timeline 60-90 days. See "RTA 2026" topic.
- Specific Relief Act 1950, s.7 — ONLY court or RTT can order eviction.
- Self-help eviction (changing locks, cutting water/electricity, removing belongings) = criminal offense.
- Commercial/non-residential: traditional court route still applies → Notice to vacate (usually 1 month) → File for possession order → Court hearing → Writ of possession → Bailiff executes.
- Timeline (commercial court route): 3-6 months typically.
- Emergency cases (illegal activity, danger): can apply for interim injunction.

SELF-HELP EVICTION CONSEQUENCES (if landlord already did it):
- Criminal: Penal Code s.441 (criminal trespass) — up to 6 months jail OR RM3,000 fine OR both.
- Criminal: Disconnecting utilities may be "mischief" under Penal Code s.427-430.
- Civil: Tenant sues under Specific Relief Act s.8(1) for wrongful dispossession. Typical claims:
  * Full deposit refund (RM3,000-15,000+)
  * Replacement accommodation costs (hotel/temporary rental)
  * Value of belongings damaged/lost
  * Loss of business income if business operated from property
  * General damages for distress (RM5,000-20,000 typical awards)
  * Legal costs
- Total exposure: easily RM20,000-100,000+ depending on property value and tenant's losses.
- Tenant's belongings: landlord CANNOT dispose of, sell, or move. Doing so = potential theft charge.
- If already changed locks: (1) IMMEDIATELY restore access, (2) do NOT touch belongings, (3) consult lawyer, (4) consider offering settlement.
- Proper eviction costs: RM8,000-RM12,000 legal fees, 6-8 months. ALWAYS cheaper than getting sued.

REAL CASES — EVICTION:
• *Er Eng Hong v New Kim Eng*: Court held self-help remedy is extinguished — landlord cannot forcibly evict. Tenant restored to possession + awarded damages.
• Landlord in PJ changed locks while tenant was at work. Tenant filed police report (criminal trespass s.441) + emergency court injunction. Court restored access within 48 hours. Landlord later ordered to pay RM35,000 damages (deposit + temporary accommodation + distress).
• Landlord cut electricity to force tenant out. Tenant stayed, documented everything, sued under s.8(1). Court awarded RM22,000 — RM12,000 general damages + RM10,000 for inconvenience over 3 months without power.
• Landlord followed proper process: 1-month notice → court filing → 4 months later got possession order → bailiff executed. Total cost: RM9,500 legal fees. Clean, no counterclaim.

TEMPLATE — NOTICE TO VACATE:
"Dear [Tenant Name],
RE: NOTICE TO VACATE — [Property Address]
You are hereby given [30/60/90] days' notice to vacate the above property by [Date], pursuant to [Clause X / expiry of tenancy].
Please ensure: (1) All outstanding rent and utility bills are settled. (2) The property is returned per the inventory checklist. (3) Keys are returned on or before the vacate date.
A joint inspection will be arranged prior to handover.
[Landlord Name]
[Date]"`
  },

  rent_default: {
    keywords: ['tak bayar', 'not pay', 'arrears', 'tunggakan', '欠租', '拖欠', 'default', 'late rent', 'lewat sewa', 'demand letter', 'surat tuntutan', '催款', 'LOD', 'distress', 'Form 198'],
    content: `RENT DEFAULT & RECOVERY:
- Step 1: Written reminder (WhatsApp + formal letter).
- Step 2: Letter of Demand (LOD) — give 14 days.
- Step 3: Form 198 (Distress Act 1951 s.5) — apply to Magistrate to seize tenant's movable property.
- Step 4: If tenant still refuses — file for possession order in court.
- Landlord can claim up to 12 months of arrears via distress.
- NEVER cut utilities, change locks, or remove tenant's belongings — all illegal.

SCENARIO CHAIN — TENANT NOT PAYING:
→ Still in property? YES:
1. WhatsApp reminder (screenshot it)
2. Formal LOD (template below) — 14 days
3. No response → Distress Act Form 198 (seize belongings via Magistrate)
4. Still refuses → Possession order (court, 3-6 months)
5. Leaves but owes money → Small claims / civil suit
→ NO (already left): deposit deduction + demand letter for arrears

REAL CASES — RENT DEFAULT:
• Tenant owed 4 months rent (RM7,200). Landlord filed Form 198 — Magistrate authorized seizure of tenant's furniture + electronics. Tenant paid up within 7 days of seizure notice to avoid losing belongings.
• Landlord sent WhatsApp reminders only (no formal LOD). When case went to court, judge noted landlord didn't follow proper demand procedure. Case delayed by 2 months.
• Tenant owed 2 months, then disappeared. Landlord deducted from 2-month security deposit (fully covered arrears), returned ½ month utility deposit minus final bills. Clean resolution, no court needed.

TEMPLATE — LETTER OF DEMAND (RENT DEFAULT):
"Dear [Tenant Name],
RE: DEMAND FOR PAYMENT OF RENTAL ARREARS — [Property Address]
You are hereby notified that as of [Date], you have outstanding rental arrears of RM[Amount] for the period [Month/Year] to [Month/Year].
Pursuant to Clause [X] of the Tenancy Agreement dated [Date], you are required to settle all outstanding amounts within FOURTEEN (14) days.
Failure to do so will result in legal proceedings including an application under the Distress Act 1951 for seizure of your movable property.
[Landlord Name]
[Date]"`
  },

  holdover: {
    keywords: ['expire', 'habis', 'tamat', '到期', 'renew', 'renewal', 'perbaharui', '续约', 'holdover', 'periodic', 'month to month', 'bulan ke bulan', 'whatsapp agree', 'verbal renew', 'continue stay', 'masih tinggal', '还住着'],
    content: `LEASE EXPIRY & HOLDOVER TENANCY:
- When fixed-term lease expires and tenant stays WITH landlord accepting rent → automatically converts to PERIODIC TENANCY (month-to-month).
- If landlord accepts even one rent payment after expiry → creates periodic tenancy at the old rental rate.
- Old contract terms (renewal clause, rent review, notice period) do NOT automatically carry forward.
- Rent stays at old rate — landlord CANNOT unilaterally increase rent without tenant's agreement.
- To increase rent: negotiate new written agreement. If tenant refuses → landlord gives one month notice to terminate → tenant must vacate.
- WhatsApp "ok lah renew" messages: may be admissible as evidence (Evidence Act 1950 s.90A), but risky — courts interpret informal messages strictly.
- Termination: either party can end periodic tenancy with ONE MONTH written notice.
- If tenant refuses to vacate after notice → file for court order (Specific Relief Act s.7(2)).
- Common mistake: landlord assumes expired lease = tenant is trespasser. WRONG — if you accepted rent, you created a new periodic tenancy.

REAL CASES — HOLDOVER:
• 2-year lease expired, landlord accepted 3 more months of rent at RM1,500, then demanded RM2,000. Tenant refused. Court ruled: periodic tenancy at RM1,500 — landlord accepted rent at that rate, cannot now change it without new agreement or termination.
• Landlord sent WhatsApp "ok can continue another year" then 4 months later wanted tenant out. Court treated WhatsApp as evidence of 1-year renewal. Landlord had to wait for the full year.
• Tenant stayed 6 months after lease expired, landlord never collected rent or sent notice. Court ruled: implied periodic tenancy existed. Landlord still had to give 1 month notice + court order to evict.`
  },

  repair: {
    keywords: ['repair', 'fix', 'baiki', 'pembaikan', '修理', '维修', 'leak', 'bocor', '漏水', 'mold', 'kulat', '霉', 'damage', 'rosak', '损坏', 'habitab', 'uninhabit', 'tak boleh duduk', '不能住', 'act of god', 'force majeure', '不可抗力', 'plumbing', 'paip', 'roof', 'bumbung', 'ceiling', 'siling'],
    content: `REPAIRS & HABITABILITY:
- No specific "habitability" statute. Governed by tenancy agreement + implied terms under Contracts Act.
- General rule: Landlord = structural repairs (roof, walls, plumbing, electrical). Tenant = minor day-to-day (lightbulbs, minor blockages).
- If tenancy agreement specifies — that governs. If silent, implied term that landlord keeps premises in tenantable condition.
- Mold, leaks, pest infestation from structural issues = landlord's responsibility.
- If landlord refuses after written notice:
  1. Send written notice with photos + timestamps.
  2. Give landlord 14 days to fix.
  3. No action → tenant can arrange repair and deduct cost from rent (with notice).
  4. If uninhabitable → tenant may terminate lease early for material breach.
- Tenant CANNOT withhold full rent — only deduct actual repair cost.
- For strata: common property issues (external walls, pipes, roof) → MC responsible.

"ACT OF GOD" / FORCE MAJEURE — NOT A VALID EXCUSE:
- Landlord CANNOT refuse structural repairs by claiming "act of God."
- Force majeure only excuses performance if the TENANCY AGREEMENT includes a specific clause AND the event makes the property permanently unusable.
- Water leaks, storm damage, mold = landlord must repair. These are maintenance failures, NOT acts of God.
- If landlord refuses and property is uninhabitable: tenant HAS the right to terminate early — no penalty, deposit must be returned.
- Tenant steps: (1) written notice with photos, (2) give 14 days, (3) if no action → written termination notice citing material breach, (4) vacate and demand full deposit.

CROSS-UNIT LEAKS (strata): leak from upstairs → upstairs OWNER liable. Your landlord should (1) report to MC, (2) MC inspects source, (3) MC orders offending unit to fix. Between common pipes → MC responsible.

REAL CASES — REPAIRS:
• Ceiling leak in master bedroom for 3 months. Landlord ignored WhatsApp messages. Tenant documented with 47 photos + timestamps, hired plumber (RM1,200), deducted from rent. Landlord challenged at Tribunal — Tribunal upheld tenant's deduction because proper notice was given.
• Tenant claimed "mold = uninhabitable" and broke lease. Landlord sued for remaining rent. Court examined photos — mold was in one corner of bathroom only. Ruled NOT uninhabitable. Tenant owed early termination penalty.
• Landlord claimed flood damage was "act of God." Court ruled: flood may be natural, but landlord's obligation to repair afterwards is contractual. Ordered landlord to fix within 30 days or tenant can terminate.
• Upstairs unit pipe burst, damaged ceiling + furniture in unit below. MC investigated, confirmed source was upstairs owner's internal pipe (not common pipe). Upstairs owner ordered to pay RM8,500 in damages to downstairs tenant.

TEMPLATE — REPAIR REQUEST:
"Dear [Landlord Name],
RE: REQUEST FOR REPAIR — [Property Address]
I wish to report: [describe issue — e.g., ceiling leak in master bedroom, mold on bathroom wall]. Photos with timestamps are attached.
As per [Clause X / landlord's implied obligation], please rectify within FOURTEEN (14) days.
If no action is taken, I reserve the right to arrange repairs and deduct reasonable cost from rental, with receipts provided.
[Tenant Name]
[Date]"`
  },

  rent_increase: {
    keywords: ['increase', 'naik', '涨', 'raise rent', 'naikkan sewa', '加租', 'rent review', 'escalation', 'mid-lease', 'mid-term', 'tengah kontrak'],
    content: `RENT INCREASES & LEASE VARIATION:
- During fixed-term lease: landlord CANNOT increase rent unless agreement has a rent review clause.
- No rent review clause = rent stays fixed for entire term. Refusing mid-term increase is your right.
- Contracts Act 1950 — both parties must agree to any variation. One-sided changes not enforceable.
- Landlord threatens eviction for refusing mid-term increase: NOT legal grounds. Tenant stays until lease expires.
- At renewal: landlord can propose new rent. Tenant negotiates or leaves.
- Market rate increase at renewal: 5-15% is reasonable. Above 20% should have market evidence.
- If agreement has escalation clause (e.g. "5% annual increase"): IS enforceable — tenant agreed when signing.

REAL CASES — RENT INCREASE:
• Landlord demanded 30% increase mid-lease (RM1,500→RM1,950). Tenant refused. Landlord served "eviction notice." Tribunal ruled: no grounds for eviction — rent fixed during lease term. Tenant stayed at RM1,500.
• Lease had "10% annual increase" clause. Tenant tried to renegotiate in Year 2. Court upheld clause — tenant agreed to it. Had to pay or terminate.`
  },

  subletting: {
    keywords: ['sublet', 'subletting', 'sewa semula', '转租', 'airbnb', 'short-term', 'jangka pendek', '短租', 'room rent', 'sewa bilik', 'unauthorized occupant', 'penghuni tanpa izin', 'subletter', 'third party'],
    content: `SUBLETTING & SHORT-TERM RENTAL (AIRBNB):
- ALWAYS requires written landlord consent — without consent = breach + grounds for termination.
- Landlord can include NO SUBLETTING clause. If breached → terminate + forfeit deposit.
- Strata: MC by-laws may PROHIBIT short-term rentals. Check by-laws before listing.
- No nationwide STR licensing yet. Some local authorities (DBKL, MBPJ) may require tourism/business license.
- Airbnb: may need PBT registration, tourism tax (RM10/night foreign tourists), declare income to LHDN.
- Condo: many MCs ban stays <30 days. Violation = MC fine + SMT complaint.
- Subletting without consent does NOT make sub-tenant a trespasser — must go through proper eviction of head tenant.

HOW TO REMOVE UNAUTHORIZED SUBLETTER:
1. Evict the TENANT first (not subletter). Subletter's right derives from tenant — no privity with landlord.
2. Serve written notice to tenant citing unauthorized subletting as breach.
3. File for court eviction order against TENANT.
4. Bailiff executes → subletter's occupation automatically terminates.
- If subletter refuses after tenant evicted → bailiff removes under same order. Police assist if resistance.
- Police alone CANNOT remove subletter without court order.
- Civil Law Act s.28(4): tenant liable for DOUBLE RENT for subletting without consent.
- Timeline: 6-8 months. Legal costs: RM8,000-RM12,000.

BY-LAWS vs PRIVATE LEASE — WHICH PREVAILS?
- By-laws are STATUTORY (SMA 2013) — bind all parcels/owners/occupants automatically. Private lease CANNOT override by-laws.
- If lease says "Airbnb allowed" but by-laws prohibit → by-laws prevail.
- MC can enforce INDEPENDENTLY of landlord — doesn't need landlord's cooperation.
- Landlord's exposure: MC can hold OWNER liable (not just tenant) for by-law violations.

REAL CASES — SUBLETTING:
• Tenant Airbnb'd a Bangsar condo (90% occupancy). MC by-laws banned stays <30 days. MC issued fine, then filed at SMT. Owner (landlord) was held liable — ordered to stop short-term rentals or face RM50,000 penalty. Landlord then evicted tenant for breach.
• Tenant sublet 2 rooms without landlord's consent. Landlord discovered, served breach notice, filed for eviction. Court granted possession order + awarded landlord double rent under Civil Law Act s.28(4) — RM24,000 (12 months × RM2,000).
• Landlord tried to remove subletter directly by changing locks. Court ruled: subletter's right derives from tenant. Landlord must evict TENANT first. Landlord's lock change = illegal self-help, ordered to pay damages.`
  },

  tax: {
    keywords: ['tax', 'cukai', '税', 'LHDN', 'Hasil', 'income tax', 'cukai pendapatan', '所得税', 'declare', 'filing', 'audit', 'deduct', 'potongan', 'Form BE', 'Form B', 'rental income', 'pendapatan sewa', '租金收入', 'RPGT', 'CKHT', '产业盈利税'],
    content: `RENTAL INCOME TAX (LHDN):
- ALL rental income must be declared under Section 4(d), Income Tax Act 1967.
- Tax residents: progressive 0%–30% on chargeable income (after deductions).
- Non-residents: flat 30% on gross rental income.
- Allowable deductions (MUST have receipts/proof):
  * Loan interest (investment loan only, NOT personal loan)
  * Quit rent (cukai tanah)
  * Assessment / cukai taksiran
  * Fire insurance premium
  * Property repairs & maintenance (NOT capital improvements)
  * Property management fees / MC maintenance charges
  * Legal fees for rent recovery / eviction
  * Agent commission (typically 1 month rent, claimed in year paid)
  * Cost of advertising for tenants
  * Landlord-paid utilities (water, electricity) — only if landlord bears the cost, not recharged to tenant
- NOT deductible: capital improvements, furniture purchase (but can claim capital allowance on furnished rentals), personal travel, mortgage principal.
- Filing: Form BE or Form B. Due April 30 (no business income) or June 30 (with). Via MyTax at mytax.hasil.gov.my.
- Penalty: failure to declare = 45% penalty on underreported tax + possible criminal prosecution.
- Co-owners: each declares their share based on ownership proportion.
- Residential rental EXEMPT from service tax (commercial = 8% from July 2025).

LHDN AUDIT:
- Triggers: income/bank deposit mismatch, high deduction claims, lifestyle inconsistencies, third-party reports.
- Cross-references: bank deposits, tenancy registrations, agent records, utility bills, tenant complaints.
- Lookback: 5 years standard. Fraud/negligence: 7+ years (ITA s.91).
- Civil penalty: 100% of tax undercharged (standard). Up to 300% treble for serious cases (ITA s.113(2)).
- Criminal: intentional evasion = fine up to RM20,000 + imprisonment 1-5 years.
- VOLUNTARY DISCLOSURE (before audit starts): penalty 10-15% only. Once audit notice received → full 100% penalty.
- If notice received: (1) gather all agreements/bank statements/receipts, (2) consult tax advisor immediately, (3) cooperate fully, (4) can still claim forgotten deductions via amended returns.
- Multiple properties: each tracked separately but all aggregate on one return.

RPGT (REAL PROPERTY GAINS TAX):
- Citizens/PRs: Year 1-3: 30%, Year 4: 20%, Year 5: 15%, Year 6+: 0%.
- Foreigners: Year 1-5: 30%, Year 6+: 10%. Foreigners NEVER reach 0%.
- File via e-CKHT on MyTax within 90 days of disposal.
- Buyer retains 3% (or 7% for non-citizen sellers) and remits to LHDN.

REAL CASES — TAX:
• Landlord declared RM2,000/month rental but bank showed RM3,500/month deposits. LHDN audit found RM18,000/year underreported for 4 years. Penalty: 100% of undercharged tax = RM28,800 total (tax + penalty). Could have been RM4,320 with voluntary disclosure.
• Landlord claimed RM15,000 renovation as "repair." LHDN reclassified as capital improvement — disallowed deduction. Additional tax + 45% penalty.
• Co-owners (husband/wife, 50/50) — wife declared all rental income on her return. LHDN flagged: each must declare proportionate share. Amended returns filed, small penalty.`
  },

  foreign: {
    keywords: ['foreign', 'asing', '外国', 'foreigner', 'warga asing', '外国人', 'expat', 'MM2H', 'minimum price', 'harga minimum', '最低价格', 'state consent', 'kebenaran negeri', 'non-citizen', 'bukan warganegara'],
    content: `FOREIGN BUYERS:
- NLC 1965 s.433B — State Authority consent required for ALL foreign purchases.
- Minimum thresholds: KL RM1M, Selangor RM2M landed/RM1.5M strata, Penang Island RM1M/Mainland RM500K, Johor RM1M, Others RM300K-500K.
- CANNOT buy: Malay Reserved Land, Bumiputera lots, low/medium cost housing.
- RPGT: 30% (Year 1-5), 10% (Year 6+). NEVER 0%.
- MOT stamp duty: flat 8% from 2026 (previously 4%).
- Loan margin: typically 60-70% (vs 90% for citizens).
- Consent: RM10 stamp fee, typically 3-6 months processing.

MM2H PROPERTY RULES:
- Long-term residency programme — NOT citizenship or PR.
- 3-tier: Silver (USD150K FD + ≥RM600K property), Gold (USD500K + ≥RM1M), Platinum (USD1M + ≥RM2M).
- Must purchase within 1 year of visa. Hold minimum 10 years. 90 days/year residency.
- Still FOREIGN BUYER — subject to all foreign buyer restrictions + 8% stamp duty.
- Mortgage: max 60-70% margin.

SCENARIO CHAIN — FOREIGN BUYER:
1. Check minimum threshold for target state
2. Verify NOT Malay Reserved / Bumi lot / low-cost
3. Lawyer applies for State Authority consent (3-6 months)
4. Secure loan pre-approval (60-70% margin)
5. Sign SPA → MOT stamp duty 8% flat → RPGT: 30%/10%, never 0%

REAL CASES — FOREIGN BUYERS:
• Chinese national bought RM800K condo in Selangor — below RM1.5M strata threshold. State consent DENIED. Lost RM24,000 earnest deposit (no refund clause for consent rejection).
• MM2H holder bought RM1.2M property in KL. Assumed same stamp duty as locals. Received RM96,000 stamp duty bill (8% flat) instead of expected RM24,000. Should have budgeted for foreign rate.
• Foreigner used local nominee to buy Malay Reserved land in Kelantan. Transaction discovered — declared VOID under NLC. Lost entire purchase price + faced criminal investigation.`
  },

  strata: {
    keywords: ['strata', 'condo', 'apartment', 'pangsapuri', '公寓', 'MC', 'JMB', 'management', 'pengurusan', '管理', 'by-law', 'undang-undang kecil', 'sinking fund', 'maintenance', 'penyelenggaraan', '维护费', 'AGM', 'SMT', 'common property', 'harta bersama', 'special levy', 'levi khas', 'en-bloc', 'en bloc', 'enbloc', 'urban renewal', 'URA', 'pembangunan semula', '旧楼重建', 'collective sale', 'jualan kolektif', 'demolish', 'redevelopment', 'bangunan lama'],
    content: `STRATA (STA 1985 + SMA 2013):
- MC manages common property after strata titles issued. JMB manages before MC formed.
- Sinking fund: mandatory 10% of maintenance fee.
- Maintenance charges: monthly, based on share units. Cannot refuse even if disputing MC.
- By-laws govern: pets, renovation, noise, parking, subletting.
- By-law amendments: Special Resolution (>50% of aggregate share units at AGM).
- AGM: annually. Quorum = 25% of aggregate share units.
- Voting: one vote per parcel. Arrears >7 days before meeting = CANNOT vote.
- MC can sue for unpaid charges — register charge on unit.
- SMT: claims up to RM250,000. Filing: RM100 residential / RM200 commercial. No lawyer needed.
- MC must insure building: fire, perils, public liability. Failure = committee personally liable.
- Only OWNERS can file at SMT (not tenants).

BY-LAWS vs PRIVATE LEASE:
- By-laws are STATUTORY — bind all parcels/owners/occupants. Private lease CANNOT override.
- MC can enforce INDEPENDENTLY of landlord.
- Owner liable for tenant's by-law violations.

STRATA SPECIAL LEVY (SMA 2013 s.33):
- MC can impose for lawful expenses not covered by maintenance fund.
- Requires Ordinary Resolution at GM (>50% of those present and voting).
- ALL owners must pay once passed. Cannot refuse.
- Challenge at SMT within 6 months if improper.

PROPERTY INSURANCE (SMA 2013 s.93):
- MC MUST insure building — fire, perils, public liability.
- If MC fails → committee members PERSONALLY LIABLE.
- Unit interior (fixtures, renovations): owner insures separately.
- Tenants: contents insurance for personal belongings only.

URBAN RENEWAL ACT (URA) 2024-2026 — 80% EN-BLOC CONSENT FRAMEWORK:
The Urban Renewal Act (URA) — tabled 2024, operational phased rollout 2026 — introduces Malaysia's first majority-rule collective sale/redevelopment regime. This is a MAJOR shift: under old STA 1985 + SMA 2013, any redevelopment required 100% owner consent (impossible in practice). URA breaks the deadlock.

CONSENT THRESHOLDS (tiered by building age):
- Buildings ≥30 years old: 75% owner consent triggers redevelopment (by share units).
- Buildings <30 years old: 80% owner consent required.
- Buildings declared "dilapidated/dangerous" by authorities: 51% consent sufficient.
- Heritage-listed buildings: excluded from URA — still need 100%.

WHO ORGANIZES A COLLECTIVE SALE:
- Typically: developer approaches MC/JMB OR group of majority owners initiates.
- MC calls Special General Meeting (SGM) → Special Resolution vote.
- If threshold met → MC appoints Urban Renewal Committee (URC) to negotiate sale/redevelopment.
- Minimum notice to all owners: 30 days before SGM + written notice of proposal.

THE PROCESS (simplified):
1. Feasibility study (developer or MC-commissioned): valuation, redevelopment potential, compensation offer.
2. SGM with Special Resolution vote — achieves 75%/80% threshold.
3. Urban Renewal Committee (URC) formed — represents all owners in negotiations.
4. Collective Sale Agreement (CSA) drafted — lists compensation for each owner based on share units + condition.
5. Minority objection period: 60 days after CSA executed.
6. Minority objectors can apply to Strata Management Tribunal (SMT) or High Court to challenge on specific grounds (see below).
7. If no valid objection → sale proceeds. All owners (including objectors) legally bound to transfer.
8. Compensation disbursed to owners. Vacant possession required within 6-12 months.

MINORITY OBJECTION GROUNDS (URA-specific):
- Financial loss: compensation below valuation (must prove with independent valuer report).
- Procedural irregularity: SGM notice defective, voting not by share units, quorum not met.
- Bad faith: developer/majority colluded to squeeze out minority at below-market price.
- Sentimental/heritage value: only for genuinely heritage properties — usually rejected.
- NOT valid ground: "I just don't want to move." URA explicitly overrides individual preference once threshold met.

LANDLORD IMPLICATIONS — WHY URA MATTERS TO YOU:
- Your tenant CANNOT block the sale — they have no vote. But their tenancy must be honored until CSA triggers vacant possession clause.
- On CSA execution, tenant receives notice to vacate with minimum 3-6 months (URA default; check specific CSA terms).
- Landlord must return tenant's deposit + any prepaid rent pro-rated.
- Relocation assistance: URA requires developers to offer displaced TENANTS a relocation allowance (typically 1-3 months rent). This comes from developer, not landlord.
- IMPORTANT: if your tenancy agreement has "vacant possession" or "compulsory acquisition" clause referencing URA, follow that. If silent, URA default applies.
- Compensation to owner typically includes: market value of unit + 10-30% "disturbance premium" (for forced sale) + temporary accommodation allowance during redevelopment.
- TAX: sale proceeds under URA generally trigger RPGT (same rules as normal sale). No special URA exemption — plan for tax liability.

STRATEGIC CONSIDERATIONS FOR LANDLORDS IN AGING BUILDINGS (2026+):
- If your building is 25-30 years old: redevelopment pressure will rise. Consider: (1) sell now at premium before URA uncertainty, OR (2) hold and participate in collective sale for higher compensation + new unit in redeveloped tower.
- "Right to first refusal" of new unit: some URA-covered projects offer original owners priority purchase of units in the new development at construction cost. Check the CSA.
- If you're in the 20-25% minority: DO NOT sign the CSA immediately. Get independent valuation. If your unit is undervalued, file objection within 60 days.
- Tenancy risk: signing a 3-year lease in a 28-year-old condo = risk of URA-triggered termination. Add URA termination clause that protects tenant's deposit + gives 6-month notice.

REAL CASES — STRATA:
• MC charged RM5,000 special levy for lift replacement. Owner refused to pay. MC registered charge on unit — owner couldn't sell until levy + penalty paid. Total delay cost owner RM12,000 in lost sale opportunity.
• Tenant complained about noise to MC. MC issued warning to offending unit. Owner of noisy unit ignored. MC filed at SMT — awarded RM5,000 damages + mandatory compliance order.
• MC failed to insure building. Fire damaged 3 units. Affected owners sued MC committee members personally — court upheld personal liability under s.93.

REAL CASES — URBAN RENEWAL / EN-BLOC:
• KL condo (built 1992, 34 years old): developer offered collective sale. 82% owners consented. 18% minority objected citing undervaluation. Independent valuer confirmed original offer was 15% below market. Developer raised offer by 18% to close deal — all owners accepted. Total added compensation: RM2.8M across the building.
• PJ flats (built 1988): declared dangerous by PBT. 54% consent triggered redevelopment under URA. Minority owner (elderly, opposed sale on sentimental grounds) filed at High Court — rejected, URA overrides individual preference. Sale proceeded.
• Landlord in aging Penang condo had signed 2-year tenancy. CSA triggered year 1. Tenant received 6-month notice + 3-month rent relocation allowance from developer. Landlord returned full deposit + 4 months prepaid rent. Clean exit, no tribunal case.
• Owner held out in 79% consent building (just below 80% threshold). Developer restructured compensation, 2 more owners flipped → hit 81%. Original holdout then had to sell at the SAME price he'd rejected. Cost him ~RM80K in legal fees and stress.`
  },

  subsale: {
    keywords: ['buy', 'beli', '买', 'purchase', 'pembelian', 'subsale', 'sub-sale', 'OTP', 'SPA', 'earnest', 'deposit beli', 'loan', 'pinjaman', '贷款', 'financing', 'pembiayaan', 'conveyancing', 'lawyer', 'peguam'],
    content: `SUB-SALE (BUYING FROM EXISTING OWNER):
- Step 1: Sign OTP + pay earnest deposit (2-3%). Held by agent/lawyer as stakeholder.
- Step 2: Apply for bank loan (2-4 weeks).
- Step 3: Sign SPA within 14-21 days of loan approval.
- Step 4: Pay balance to make up 10% total.
- Step 5: Lawyer handles: state consent, land search (RM10-30), stamp duty, RPGT filing, loan docs.
- Step 6: Completion 3+1 months. Bank disburses to seller's lawyer.
- Step 7: MOT registration → title transferred.
- Earnest deposit generally NON-REFUNDABLE if buyer pulls out. Protect with "subject to loan approval" clause.
- Legal fees: RM2,000-5,000.

LOAN & FINANCING:
- Standard: 90% for first 2 properties, 70% for 3rd+.
- Tenure: max 35 years or age 70 (whichever earlier).
- Loan stamp duty: 0.5% of loan amount.
- Lock-in: 3-5 years typically. Early settlement = 2-3% penalty.
- Islamic vs conventional: different legal structure, similar payments.
- LPPSA (government servants): up to 100% financing.

AUCTION / LELONG:
- Read POS carefully — reserve price, deposit, completion period, arrears.
- Deposit: 5-10% by bank draft BEFORE auction.
- Balance: 90-120 days.
- NO "subject to loan" protection — get pre-approved BEFORE bidding.
- Win but can't complete = deposit FORFEITED.
- Can be 20-40% below market but more risk.

REAL CASES — BUYING:
• Buyer signed OTP without "subject to loan" clause. Loan rejected by 2 banks. Lost RM15,000 earnest deposit (3% of RM500K).
• Buyer with loan clause got 2 rejection letters, recovered full RM12,000 earnest within 14 days.
• Auction buyer won RM350K unit (market value RM500K). Couldn't arrange RM315K loan in 90 days. Forfeited RM35,000 deposit. No recourse.
• Subsale completion delayed by state consent (Selangor, foreign buyer). Exceeded 3+1 months. Buyer's lawyer applied for extension — granted with RM500 penalty.`
  },

  developer: {
    keywords: ['developer', 'pemaju', '开发商', 'defect', 'kecacatan', '缺陷', 'DLP', 'late delivery', 'lewat serah', 'LAD', 'abandoned', 'terbengkalai', 'HDA', 'CCC', 'vacant possession', 'VP'],
    content: `PROPERTY PURCHASE (SPA & DEVELOPER):
- DLP: 24 months from VP for new builds (HDA 1966, Schedule G/H).
- Developer must fix defects within 30 days. If fails → 14 days notice → buyer fix + claim.
- Late delivery: LAD = 10% p.a. on purchase price, per day of delay.
- HDA 1966: Schedule G (landed) / H (strata) — standardized SPA. Cannot reduce buyer protections.

DEVELOPER BANKRUPTCY / ABANDONED PROJECTS:
- "Abandoned" = construction stopped >6 months without valid reason, or developer wound up.
- Buyer can terminate SPA if no progress for 6 months. Refund within 30 days.
- Homebuyer's Tribunal: claims ≤RM50,000. Filing RM10. Hearing within 60 days. Binding.
- Claims >RM50K: civil court.
- Buyer's loan does NOT auto-cancel if developer bankrupt. May still owe bank.
- KPKT maintains developer blacklist — check before buying.

REAL CASES — DEVELOPER:
• Developer delivered condo 8 months late. Buyer claimed LAD: 10% × RM600,000 ÷ 365 × 240 days = RM39,452. Developer paid after Tribunal order.
• 47 defects reported within DLP. Developer fixed 30, ignored 17. Buyer gave 14-day notice, hired contractor (RM22,000). Filed at Tribunal — full RM22,000 awarded.
• Abandoned project in Seremban. Buyers terminated SPA after 6 months of zero progress. Developer couldn't refund (bankrupt). Buyers' claims became unsecured debt in liquidation — recovered only 15 sen per ringgit.`
  },

  joint_ownership: {
    keywords: ['joint', 'bersama', '共同', 'co-owner', 'pemilik bersama', 'survivorship', 'partition', 'pembahagian', 'inheritance', 'warisan', '继承', 'death', 'kematian', '死亡', 'will', 'wasiat', '遗嘱', 'tenancy in common'],
    content: `JOINT OWNERSHIP:
- Joint tenancy: equal shares, right of survivorship. Owner dies → share auto-goes to surviving owner(s).
- Tenancy in common: distinct shares (can be unequal). Owner dies → share per will / Distribution Act 1958.
- Check type: stated on title deed. "As joint tenants" = JT. Stated shares (e.g. "1/2") = TIC.
- Distribution Act 1958 (non-Muslim intestate): spouse 1/3, children 2/3. No children: spouse 1/2, parents 1/2. Muslims: Faraid.
- Partition: NLC s.145. If can't agree → court order for partition or sale.

CO-OWNER REPAIR & COST DISPUTES:
- ALL co-owners share repair costs proportionate to ownership.
- If one pays alone → can sue other co-owner for contribution.
- For NON-STRATA buildings: no MC exists. Co-owners jointly responsible for all common areas.
- Absent co-owner (>6 months): (1) document costs with receipts, (2) written demand to last known address, (3) file civil suit or apply for partition/sale under NLC s.145.

PROPERTY INHERITANCE & DEATH:
- NO inheritance tax (abolished 1991).
- Transfer from deceased: RM10 stamp duty on MOT (not full rates).
- RPGT: transfer to beneficiary = NOT a disposal (no RPGT). When beneficiary later sells: acquisition date = date of death, price = market value at death.
- Small estates (≤RM2M with land): Land Administrator (faster, cheaper).
- Large estates (>RM2M): High Court for Grant of Probate/LA.

REAL CASES — JOINT OWNERSHIP:
• Joint tenants (husband/wife). Husband died — wife automatically became sole owner. No probate needed for the property. Saved RM15,000+ in legal fees vs tenancy in common route.
• Two brothers owned shophouse as TIC (50/50). One wanted to sell, other refused. Court ordered sale under NLC s.145 — proceeds split equally. Total process: 14 months.
• Co-owner disappeared for 2 years. Remaining owner paid RM45,000 in repairs/maintenance. Filed civil suit — court awarded full reimbursement of absent owner's 50% share (RM22,500) + interest.`
  },

  renovation: {
    keywords: ['renovate', 'renovation', 'ubahsuai', '装修', 'reinstate', 'reinstatement', 'pemulihan', 'restore original', 'renovation consent', 'renovation deposit', 'contractor', 'kontraktor'],
    content: `RENOVATION:
- Tenant renovations: ALWAYS get written consent from landlord.
- Reinstatement clause: tenant must restore to original condition unless agreed otherwise.
- If landlord agrees to keep renovations → put it in the tenancy agreement.
- Strata: must comply with by-laws. Structural changes need MC approval + engineer cert.
- Renovation deposit to MC: typically RM500-5,000 (refundable after completion).

REAL CASES — RENOVATION:
• Tenant renovated kitchen (RM12,000) with verbal consent only. At end of lease, landlord demanded reinstatement. Tenant had no written proof of consent. Had to pay RM8,000 to restore. Lesson: always get written consent.
• Strata unit owner knocked down a wall without MC approval. MC discovered during inspection. Owner fined + ordered to hire structural engineer (RM3,000) + restore wall (RM7,500). Total cost: RM10,500 for a RM2,000 "improvement."

TEMPLATE — RENOVATION CONSENT:
"Dear [Landlord Name],
RE: REQUEST FOR APPROVAL TO RENOVATE — [Property Address]
I wish to carry out: 1. [e.g., Install built-in wardrobe] 2. [e.g., Replace kitchen cabinet]
Estimated cost: RM[Amount]. Duration: [X] weeks.
I undertake to: (a) Use licensed contractors. (b) Comply with strata by-laws if applicable. (c) [Reinstate to original / Leave for landlord — delete as appropriate].
[Tenant Name]
[Date]"`
  },

  noise: {
    keywords: ['noise', 'bising', '噪音', 'nuisance', 'kacau ganggu', '骚扰', 'neighbour', 'jiran', '邻居', 'complaint', 'aduan', 'quiet', 'construction noise'],
    content: `NOISE & NUISANCE COMPLAINTS:
- Strata: SMA 2013 by-laws. MC sets quiet hours + noise rules. File written complaint → MC investigates → fine/warn. If MC fails → SMT (RM100 filing).
- Landed: Environmental Quality Act 1974 + Local Government Act 1976. Complain to PBT → council notice → compound fine.
- Construction: only 7AM–7PM weekdays in residential areas (DOE guidelines).
- Legal remedies: private nuisance lawsuit → injunction + damages.
- If tenant causes nuisance → landlord issues notice to remedy → if unresolved → grounds for eviction.

REAL CASES — NOISE:
• Condo resident filed 12 noise complaints over 6 months. MC warned offending unit 3 times. Filed at SMT — awarded RM5,000 damages + mandatory quiet hours compliance order.
• Construction company operated past 7PM in residential area. Residents complained to DOE. Company fined RM10,000 + ordered to restrict hours.`
  },

  commercial: {
    keywords: ['commercial', 'komersial', '商业', 'shop', 'kedai', '店铺', 'office', 'pejabat', '办公室', 'factory', 'kilang', '工厂', 'industrial', 'perindustrian', 'warehouse', 'gudang'],
    content: `COMMERCIAL LEASES:
- No specific Commercial Tenancy Act — Contracts Act + lease terms govern.
- Register lease at land office if >3 years (NLC s.213). Unregistered = not protected if sold.
- Should include: permitted use, renovation terms, reinstatement clause, option to renew, rent review mechanism.
- Service tax 8% applies on commercial rental from July 2025.

INDUSTRIAL & FACTORY:
- NLC s.124 — must convert land use before operating. Criminal offense if not.
- DOE environmental license, DOSH factory registration, Bomba fire cert, PBT business license needed.
- Foreign workers: Act 446 housing standards.

REAL CASES — COMMERCIAL:
• Tenant operated restaurant in commercial unit for 5 years. Lease >3 years but NOT registered at land office. Property sold. New owner evicted tenant — unregistered lease not binding on new owner. Tenant lost RM80,000 in renovations.`
  },

  bankruptcy: {
    keywords: ['bankrupt', 'muflis', '破产', 'foreclosure', 'rampasan', '拍卖', 'default', 'gagal bayar', 'mortgage', 'gadai janji', '按揭', 'loan default', 'bank auction', 'DGI', 'insolvency'],
    content: `BANKRUPTCY & MORTGAGE DEFAULT:
- Default timeline: miss 1 → reminder → miss 2-3 months → LOD (14 days) → 4+ months → foreclosure.
- Foreclosure: individual title = judicial sale (court). Master title = private treaty/auction.
- LACA (court auction) vs Non-LACA (bank auction).
- Auction: bank sets reserve → advertise → highest bidder → 5-10% deposit same day → balance 90-120 days.
- No loan protection at auction — bid at own risk.
- Bankruptcy threshold: RM100,000. Creditors can petition.
- DGI becomes trustee → seizes assets including property.
- Voluntary Arrangement: debtor proposes plan → 75%+ creditors agree → binding.
- During bankruptcy: cannot buy/sell property, be director, travel without DGI permission.
- Discharge: automatic after 3 years with IPA. Otherwise apply after 5 years.

REAL CASES — BANKRUPTCY:
• Owner defaulted on RM450,000 loan. Bank sent LOD after 3 months, filed foreclosure at month 5. Auction held at month 10. Property sold at RM380,000 (below market). Owner still owed RM70,000 shortfall to bank.
• Debtor with RM150,000 in debts proposed VA — 60% repayment over 3 years. 80% of creditors agreed. Avoided bankruptcy, kept property.`
  },

  tenant_screening: {
    keywords: [
      'screening', 'vetting', 'vet tenant', 'check tenant', 'background check', 'semak penyewa', 'tapis penyewa', '筛选租客', '审查租客', '背景调查',
      'ctos', 'ccris', 'ramci', 'iscore', 'experian', 'credit score', 'credit report', 'skor kredit', 'laporan kredit', '信用评分', '信用报告',
      'pdpa', 'akta perlindungan data', '个人数据保护', 'consent form', 'borang persetujuan',
      'rental history', 'sejarah sewa', '租赁历史', 'reference check', 'rujukan majikan', 'referee',
      'bad tenant', 'penyewa bermasalah', '问题租客', 'midnight flit', 'flit', 'skip rent', 'ponteng sewa',
      'discrimination', 'diskriminasi', '歧视', 'race preference', 'pilihan kaum', '种族偏好',
      'inclusive listing', 'chinese only', 'malay only', 'indian only', 'bumi only', 'no indian', 'no chinese',
      'bank statement', 'penyata bank', '银行对账单', 'payslip', 'slip gaji', '工资单', 'employment letter', 'surat pengesahan majikan'
    ],
    content: `TENANT SCREENING & LAWFUL VETTING (2026):

LEGAL FRAMEWORK:
- PDPA 2010 (Personal Data Protection Act): Landlord collecting tenant NRIC, payslip, bank statement, credit report = "data user." Must obtain written consent, specify purpose, store securely, delete when tenancy ends.
- RTA 2026 Anti-Discrimination: Cannot refuse tenancy based on race, religion, gender, disability, HIV, marital status, national origin. Must screen on CREDIT + INCOME + REFERENCES, not demographics. Fine up to RM20,000 for discriminatory refusal.
- Platform rules 2026: iProperty, PropertyGuru, Mudah, EdgeProp now auto-flag and remove listings with race preferences ("Chinese only", "prefer Malay", "no Indian"). Repeat offenders get account suspended. Some platforms also flag "clean cooking" euphemisms.

CREDIT CHECK TOOLS (landlord access):

1. CTOS (most common in 2026):
   - Self-employed landlords: register at ctoscredit.com.my → pay-per-check (RM20-50/report).
   - Tenant gives consent via CTOS Tenant Screening module → landlord receives full report.
   - Shows: credit score (300-850), active loans, default history, bankruptcy status, litigation records (lawsuits, judgments).
   - Good score: ≥697. Fair: 571-696. Poor: ≤570.
   - Red flag: "AKPK" entry = tenant is on debt management; "writ of summons" = being sued.

2. CCRIS (Bank Negara Central Credit Reference):
   - Only tenant can pull own report (not landlord directly).
   - Tenant downloads via BNM eCCRIS portal → forwards PDF to landlord.
   - Shows: credit facility status over past 12 months — PAID, MISSED, CLASSIFIED.
   - Any "2 months overdue" or "3 months+" flags = major warning.
   - Free for tenant; refuses to provide = red flag.

3. RAMCI (Credit Bureau Malaysia Sdn Bhd):
   - Alternative to CTOS. Landlord registers at cbm.my.
   - Report similar: score, outstanding loans, defaults.
   - Pay-per-check ~RM30.

4. iScore (Experian Malaysia):
   - Newer entrant, widely used by corporate landlords.
   - Mobile app friendly — tenant can share live score in 60 seconds.

LAWFUL SCREENING CRITERIA (safe to use, RTA-compliant):
- Credit score (CTOS/CCRIS) — minimum threshold e.g. ≥650
- Debt-to-income ratio — rent should not exceed 40% of gross monthly income
- Employment verification — letter from employer, payslip (3 months), EPF statement
- Bank statements (3-6 months) — looking for stable inflow, no chronic overdraft
- Previous landlord reference — ask about rent punctuality, property condition, termination reason
- Length of employment — prefer ≥1 year at current employer (gig workers need supplementary proof)
- Existing debt commitments — credit card balance, car loan, personal loan sum ratio
- Security deposit cheque clearing — confirm it clears before handover

UNLAWFUL SCREENING CRITERIA (never use, RTA fine):
- Race, ethnicity, skin colour
- Religion or religious practice (prayer, pork, halal)
- "Cooking style" / "curry smell" / "cultural habits" — all proxies for race, also illegal
- Gender (except for single-gender housing exemption)
- Marital status, pregnancy
- National origin (can't refuse "just because they're Chinese nationals" — can refuse if they cannot provide valid work visa)
- Disability (unless property is physically unsuitable AND no reasonable accommodation possible)
- HIV or any health status

HOW TO WRITE A COMPLIANT LISTING:
❌ WRONG: "Chinese family only. Non-smoker. No Indian." → auto-banned from iProperty/PropertyGuru.
❌ WRONG: "Prefer clean tenants. No strong cooking smells." → still flagged as race proxy.
✅ CORRECT: "Professional working tenant. Minimum 1-year lease. CTOS check required. Non-smoker unit. References requested."

PRACTICAL SCREENING FLOW (RTA 2026 COMPLIANT):
1. Advertise on iProperty / PropertyGuru / Mudah with lawful criteria only.
2. On inquiry: send PDPA consent form + application form (income, employer, rental history).
3. Upon short-listing: ask tenant to pull CCRIS (free) and/or landlord pays for CTOS.
4. Income verification: payslip + bank statement + EPF i-Akaun screenshot.
5. Reference call to previous landlord + employer HR.
6. If approved: issue tenancy offer letter → stamped agreement → register on e-Sewa.
7. If rejected: provide lawful written reason (e.g. "credit score below threshold") within 7 days. NEVER write "prefer other demographics."

RED FLAGS — STOP & VERIFY:
- Tenant refuses any credit check → suggests past defaults.
- Payslip PDF with mismatched fonts / "Free Payslip Generator" watermark → forgery.
- Offers 6-12 months rent upfront in cash → money laundering or hiding income source; report suspicious transaction to BNM FIU if >RM50,000.
- "Can I pay deposit in USDT / crypto?" → tax evasion risk; insist on bank transfer for audit trail.
- Urgency pressure ("need to move in tomorrow") → usually midnight flit from previous landlord.
- Multiple previous landlords in short span → serial flitter pattern.
- NRIC shown but refuses to let you photograph → identity concern.
- Uses free email (gmail/yahoo) with employer claiming to be at major MNC → suspicious, cross-check LinkedIn.

REAL CASES:
• KL landlord advertised "Chinese only RM2,500/month condo" on iProperty. Platform auto-removed listing, account suspended 14 days. Refused to remove on repost → permanent ban. Landlord missed rental window for 2 months.
• Landlord asked tenant for RM50 CTOS cost upfront during viewing. Tenant filed complaint to KPKT — landlord's advertising fee for screening is landlord's cost under RTA 2026. Landlord fined RM1,500.
• Subang landlord rejected qualified tenant with 730 CTOS score citing "not compatible culturally." Tenant complained to KPKT with application records. Fine: RM15,000 + ordered to process application OR pay 3 months lost rent (RM7,500). Total cost: RM22,500.
• Petaling Jaya landlord did thorough screening (CTOS 712, employment verified, references clean). Tenant stayed 3 years, zero disputes. Landlord's neighbor skipped screening, got "midnight flit" tenant with 3 months unpaid rent. Lesson: screening pays off.

PDPA-COMPLIANT CONSENT CLAUSE (include in application form):
"I, [Name] (NRIC [XXX]), consent to [Landlord Name] processing my personal data (NRIC, income, employment, CTOS/CCRIS report, bank statements, references) solely for the purpose of evaluating my tenancy application for [Property Address]. I understand I may withdraw consent at any time by written request. Data will be deleted within 6 months of application closure unless tenancy is approved."

VERIFY HERE:
- CTOS: ctoscredit.com.my
- CCRIS via BNM: eccris.bnm.gov.my
- RAMCI: cbm.my
- iScore: iscore.com.my
- PDPA guidelines: pdp.gov.my
- RTA complaint portal: kpkt.gov.my/rtt`
  },

  foreign_tenant: {
    keywords: [
      'foreign tenant', 'penyewa asing', '外国租客',
      'immigration', 'imigresen', 'pendatang', '移民',
      'work permit', 'permit kerja', 'work pass', 'pass kerja', '工作准证', '工作签证',
      'harbour', 'harbouring', 'melindungi', '窝藏', 'shelter illegal',
      'illegal immigrant', 'pendatang asing tanpa izin', 'pati', '非法移民',
      'expat', 'expatriate', 'warga asing',
      'mm2h', 'malaysia my second home', 'de rantau', 'derantau', 'digital nomad', 'nomad',
      'myimmi', 'ejim', 'my visa', 'epermit',
      'passport', 'pasport', '护照',
      'visa expiry', 'visa tamat', '签证过期', 'overstay', 'lebih tempoh',
      'foreign worker', 'pekerja asing', '外劳', 'bangladeshi', 'indonesian worker', 'nepali', 'myanmar',
      'employment pass', 'professional visit pass', 'student pass', 'dependant pass'
    ],
    content: `FOREIGN TENANT COMPLIANCE — IMMIGRATION ACT 1959/63:

CRITICAL LEGAL EXPOSURE — THE "HARBOURING" OFFENSE:
- Immigration Act 1959/63, Section 55E: it is a CRIMINAL OFFENSE to knowingly harbour, shelter, or employ a person without valid immigration status.
- Penalty: Fine RM10,000-RM50,000 per illegal immigrant + imprisonment up to 5 years + whipping in aggravated cases.
- Even an unintentional landlord can be prosecuted if police prove "should have known" (e.g., failed to check visa).
- Additional liability under Immigration Regulations 1963 for landlords who provide accommodation without verifying status.

WHO YOU CAN RENT TO (valid passes):
1. Employment Pass (EP) — skilled professionals, minimum salary RM5,000/month, tied to specific employer.
2. Professional Visit Pass (PVP) — short-term professionals, researchers, artists.
3. Dependant Pass — spouse/children of EP holders.
4. Student Pass — enrolled at recognized IPTA/IPTS; landlord should keep copy of confirmation letter from institution.
5. MM2H (Malaysia My Second Home) — long-term resident programme, renewed every 5-10 years.
6. DE Rantau Nomad Pass — digital nomad visa (launched 2022, expanded 2024-2026); valid 3-12 months, renewable.
7. Social Visit Pass — short-term only, ≤3 months; NOT meant for regular residential rental.
8. PR (Permanent Resident) — treated as locals for rental; can show MyPR card.
9. Refugee card (UNHCR) — landlord can rent but document status clearly.

WHO YOU CANNOT RENT TO:
- Tourists on 30/60/90-day social visit who are clearly not short-term — high prosecution risk.
- "Runaway" foreign workers whose pass has been cancelled.
- Overstayed individuals of any nationality.
- Anyone who refuses to show passport + visa endorsement.

MANDATORY VERIFICATION STEPS (do ALL before signing):

STEP 1 — Physical document check:
- Original passport (not photocopy, not photo of photo)
- Current visa endorsement page — check stamp, "UNTIL [date]", and pass category
- Work permit card (for EP/foreign workers) — front + back

STEP 2 — Digital verification (critical in 2026):
- MyImmi mobile app (Jabatan Imigresen Malaysia): verify passport status via scan.
- eJim online (ejim.imi.gov.my): employer-side verification for EP status.
- XPATS (Expatriate Services Division) portal: check EP validity for professionals.
- For foreign workers: MyIMMS Pekerja Asing portal (requires employer credentials, but tenant's current/former employer can pull a screenshot).

STEP 3 — Cross-check:
- Name on passport = name on work permit = name on bank statement = name on rental application. Mismatches = fraud.
- Visa expiry date must extend beyond tenancy term. If visa expires before end of lease, include a clause: "Tenancy automatically terminates if tenant's immigration status lapses and is not renewed within 30 days."

STEP 4 — Documentation for your defense file (keep for 7 years):
- Photocopy of passport bio page
- Photocopy of visa endorsement
- Photocopy of work permit
- MyImmi/eJim screenshot with date
- Signed declaration from tenant: "I confirm my immigration status is valid until [DD-MM-YYYY]. I will notify landlord within 7 days of any change."
- Photograph of tenant holding passport (optional but powerful in defense)

REPORTING DUTY:
- If you discover your tenant has overstayed, been cancelled, or is working illegally: you have 72 hours to report to Immigration (nearest JIM office or hotline 03-8880 1000) AND terminate the tenancy.
- Failure to report once you "know" = prosecution risk. Landlord who reports in good faith is protected.

SPECIAL CASES:

MM2H:
- MM2H participants have 5-10 year renewable stay; premium tenants (lower default risk statistically).
- Verify by calling MM2H Centre (my2h.gov.my) or asking for MM2H approval letter.
- 2024 reforms raised financial thresholds — older MM2H holders may still be on old rules; don't reject, just verify.

DE RANTAU NOMAD PASS:
- Growing segment in 2026, especially in KL/Penang/Langkawi.
- Usually short-term (3-12 months); willing to pay premium for furnished units.
- Verify via MDEC De Rantau portal; confirm they have proof of remote employer and minimum USD24,000 annual income.

DIPLOMATIC / UN / INTL NGO:
- Show diplomatic ID or host agency letter.
- Tenancy usually via agency (World Bank, UN, embassy) — rent paid by agency, not individual.

REAL CASES:
• Landlord in Cheras rented to "tourist" Bangladeshi on social visit pass for 8 months. Immigration raid caught 4 foreign workers in unit. Landlord charged under s.55E → fined RM40,000, served 6 months jail. Lost the unit (auctioned to pay legal fees).
• Petaling Jaya landlord rented to MM2H Chinese family with full document check. Tenant stayed 4 years, zero issues. Verification took 30 minutes online and saved landlord from any prosecution risk.
• Subang landlord trusted a "friend referral" and skipped passport check. Tenant turned out to be overstayed Nepali worker. Raid → landlord fined RM18,000 + tenant deported. Landlord also liable for unpaid rent no one could recover.
• KL landlord rented to De Rantau nomad from Portugal. Nomad paid 6 months upfront, left early to travel. Landlord kept remaining rent per clause. Clean experience.
• Landlord in KK rented to student on expired student pass (school had terminated enrollment 3 months prior). Landlord charged but pleaded "didn't know" — court accepted mitigation (had original valid pass on file) → reduced to RM5,000 fine. Still, a painful lesson.

TEMPLATE — FOREIGN TENANT VERIFICATION ADDENDUM:
"ADDENDUM TO TENANCY AGREEMENT — FOREIGN TENANT DECLARATION
I, [Full Name], Passport [Country] No. [XXXX], hereby declare:
1. My immigration status in Malaysia is: [EP / Student Pass / MM2H / De Rantau / Other: _____], valid until [DD-MM-YYYY].
2. I have provided landlord with copies of my passport bio page, current visa endorsement, and [work permit / student confirmation letter / MM2H letter].
3. I authorize the landlord to verify my status via Jabatan Imigresen Malaysia or any relevant agency.
4. I will notify landlord in writing within 7 days of any change to my immigration status.
5. I understand that if my status lapses and is not renewed within 30 days, this tenancy automatically terminates without refund of rental paid.
Signed: _____ Date: _____
Landlord Counter-signed: _____ Date: _____"

VERIFY HERE:
- Jabatan Imigresen Malaysia: imi.gov.my
- MyImmi mobile app (Android/iOS): visa/passport scanning
- eJim portal: ejim.imi.gov.my
- MM2H: my2h.gov.my
- De Rantau: mdec.my/derantau
- Employer immigration verification: esd.imi.gov.my
- Reporting hotline: 03-8880 1000 (Ibu Pejabat Imigresen)`
  },

  short_term_rental: {
    keywords: [
      'short term', 'jangka pendek', '短期', 'airbnb', 'homestay', 'booking.com', 'agoda', 'vrbo',
      'short term rental', 'str', 'penyewaan jangka pendek', '短期出租',
      'digital nomad', 'nomad', 'de rantau', 'remote worker', 'pekerja jarak jauh',
      'corporate lease', 'expat rental', 'relocation', 'executive stay', 'serviced apartment', 'apartmen perkhidmatan',
      'pbt license', 'lesen pbt', 'pihak berkuasa tempatan', 'council license',
      'mpkl', 'dbkl airbnb', 'mbpp airbnb', 'mbmb airbnb',
      'hybrid rental', 'mixed lease', 'sewa campuran',
      'premises license', 'tourism license', 'lesen pelancongan', 'motac',
      'sst tourism', 'tourism tax', 'cukai pelancongan'
    ],
    content: `SHORT-TERM RENTAL & HYBRID MODELS (Airbnb / Digital Nomad / Corporate):

LEGAL STATUS IN 2026:
Short-term rental (STR) is NOT universally legal in Malaysia — it depends on the PBT (local council) and the property type. The 2024-2025 national policy shift pushed regulation downward: each PBT sets its own rules. Several major councils now require licensing.

PBT POSITIONS (as of 2026):

KL (DBKL):
- Residential condos/apartments: STR generally prohibited under Strata Management Act + DBKL By-Laws 2020. Enforcement rising since 2024.
- Fine: RM10,000-RM50,000 for unauthorised STR operation.
- Commercial-zoned buildings (SoHo, service apartment with tourism license): STR allowed with MOTAC tourism license.
- Management Corporation (MC) by-laws can also restrict — even in allowed buildings, MC can vote to ban STR.

PENANG (MBPP / MBSP):
- STR Licensing Scheme introduced 2024: RM250/year license per unit.
- Must comply with: minimum stay 2 nights, max 60 days/year per unit, tourism tax collection.
- Non-compliance: license revoked + compound RM5,000.

MELAKA (MBMB):
- Tourism-friendly zone: residential STR allowed with PBT license + MOTAC registration.
- Heritage zone has stricter rules — no STR in some areas.

SELANGOR (various PBTs):
- Mixed. PJ (MBPJ), Shah Alam (MBSA) lean restrictive. Klang (MPK) more permissive.
- Check individual PBT by-laws at each council's website.

JOHOR (MBJB, MPPG):
- Tourism-oriented. STR in Iskandar zone generally permitted with license.
- Legoland/RCE areas specifically zoned for tourism rental.

SABAH / SARAWAK:
- Different ordinances. Generally more permissive for tourism. Kota Kinabalu + Kuching have STR licensing.

LICENSES REQUIRED (typical stack):
1. PBT STR License / Premises License (RM200-500/year, depending on council).
2. MOTAC Tourism Accommodation Premises License (if operating as tourism rental) — motac.gov.my.
3. Business registration (SSM) if operating multiple units — can register sole prop or sdn bhd.
4. Service Tax registration (LHDN) if gross receipts exceed RM500K/year — 8% service tax on accommodation since 2024.
5. Tourism Tax collection (RM10/room/night for non-Malaysians) — remit to LHDN.

HYBRID RENTAL MODELS (the 2026 landlord sweet spot):

A. CORPORATE / EXPAT MEDIUM-TERM (3-6 months):
- Target: MNC assignees, manufacturing consultants (China-MY corridor), contract engineers.
- Furnished, serviced, includes utilities + WiFi.
- Rent premium: 40-80% above standard long-term.
- Legal: treat as regular tenancy agreement (long enough to be "residential"), stamp duty applies at 1-year tier rate.
- Lower wear & tear than Airbnb turnover.

B. DIGITAL NOMAD (3-12 months via De Rantau):
- Target: DE Rantau Pass holders, remote tech workers.
- Fully furnished, fibre broadband, co-working access nearby.
- Rent premium: 30-60% above long-term.
- Document as residential tenancy — avoids PBT STR licensing requirement.
- Must still verify visa (see foreign_tenant topic).

C. TRUE AIRBNB / STR (nightly rental):
- Highest ROI but highest compliance burden.
- Typical gross yield: 8-15% if occupancy 65%+. Net after PBT fees, MOTAC, cleaning, MC fines risk: 5-10%.
- Requires FULL license stack (above).
- Not recommended for first-time landlords in 2026 KL market due to enforcement.

FINANCIAL COMPARISON (illustrative, RM1.2M condo):
- Long-term 12-month lease: RM3,500/month = RM42,000/year gross. Low turnover, stable.
- Medium-term corporate (3-6mo): RM5,500/month × 10 months occupied = RM55,000/year gross.
- Digital nomad: RM6,500/month × 9 months occupied = RM58,500/year gross.
- Airbnb (nightly): RM350 × 22 nights × 12 months = RM92,400/year gross — BUT deduct 20% platform fee, 15% cleaning, 8% service tax, PBT license, MC fines risk → net ≈ RM52,000-62,000.

CONCLUSION: Medium-term corporate / digital nomad often beats Airbnb on risk-adjusted basis.

MC (MANAGEMENT CORPORATION) CONSENT:
- Even if PBT allows STR, the MC can ban it.
- Check by-laws at MC office BEFORE listing on Airbnb.
- MC fines for unauthorized STR: RM200-1,000 per incident; repeat offenders reported to Land Office.
- Get written consent (AGM resolution or MC letter) before operating.

TAX TREATMENT 2026:
- Rental income taxed as Section 4(d) under Income Tax Act 1967 if passive; Section 4(a) if active business (multiple units + services) — rate up to 30% individual.
- Sdn Bhd structure: flat 24% corporate tax (17% for SME first RM150K profit).
- Service tax 8% on accommodation — must register if gross ≥RM500K/year.
- Tourism tax RM10/night for foreign guests — remit monthly.
- Capital allowance on furniture/fittings: 20% initial + 10% annual.
- Airbnb fees are deductible. So are utilities, cleaning, linen, platform commissions.

CLAUSES TO INCLUDE (corporate / nomad agreements):
- Minimum stay period (e.g., 90 days).
- Utility cap (include RM300/month, excess passed to tenant).
- Early termination clause — 30 days notice OR 1 month rent in lieu.
- Guest policy — no sub-STR to other tourists.
- Furniture inventory + condition photos (Evidence Vault).
- Cleaning schedule and deposit for deep clean on departure.

REAL CASES:
• Mont Kiara condo owner ran Airbnb without MC consent. MC fined RM1,000/incident × 12 incidents (RM12,000). DBKL also compounded RM8,000. Total: RM20,000 — wiped out the year's Airbnb profit.
• Penang Georgetown landlord applied for MBPP STR license properly. Listed on Airbnb + Booking.com. 68% occupancy first year. Net RM45K on a RM550K apartment (8.2% yield) — clean and legal.
• KL landlord pivoted from long-term to De Rantau digital nomad rental. Raised rent from RM3,200 to RM5,800/month furnished. Occupancy 10/12 months. Gross uplift: RM31,000/year. No PBT issues because each nomad stayed 3-6 months on residential tenancy basis.
• Shah Alam landlord signed 6-month corporate lease with MNC HR for Chinese manufacturing consultant. Rent RM6,500/month vs RM3,800 normal long-term. Company paid via invoice, deducted 8% service tax. Landlord registered as sole prop with SSM to claim deductions → saved ~RM4,500 in net tax.
• JB landlord listed Airbnb + MC hadn't banned it. 3 parties disturbed neighbors → MC AGM amended by-laws to ban STR. Landlord forced to pivot to long-term within 60 days.

VERIFY HERE:
- DBKL: dbkl.gov.my → Search "short-term rental by-law"
- MBPP: mbpp.gov.my → STR licensing
- MOTAC tourism license: motac.gov.my
- De Rantau: mdec.my/derantau
- LHDN service tax: hasil.gov.my (GST/SST)
- Airbnb Malaysia operator guide: airbnb.com.my/help/hosting-regulations`
  },

  utility_account: {
    keywords: [
      'tnb', 'utility', 'utiliti', 'electric', 'elektrik', '电费', '水电',
      'air selangor', 'syabas', 'pba', 'water bill', 'bil air', '水费',
      'iwk', 'sewerage', 'pembetungan',
      'indah water',
      'utility deposit', 'deposit utiliti', '水电押金',
      'change of tenancy', 'cot', 'tukar nama akaun', 'transfer account', '更名', '过户',
      'smart meter', 'meter pintar', '智能电表',
      'aircon bill', 'bil aircon', '空调电费',
      'final bill', 'bil akhir', '最终账单',
      'meter reading', 'bacaan meter',
      'unifi', 'tm unifi', 'maxis fibre', 'celcom fibre', 'internet bill',
      'cukai pintu', 'assessment', 'cukai tanah', 'quit rent',
      'utility skip', 'tinggalkan bil', '跑单'
    ],
    content: `UTILITY MANAGEMENT FOR LANDLORDS (TNB / AIR SELANGOR / IWK / INTERNET):

THE UTILITY DEPOSIT PROBLEM (2026):
- Standard tenancy: ½ month rent as utility deposit. On a RM2,500 rent, that's RM1,250.
- Reality with aircon-heavy tenants: electricity alone can hit RM800-1,200/month. Two months of unpaid bill = RM2,400 → deposit insufficient.
- TNB tariff went up in 2024-2025 (ICPT surcharge) and rolls into 2026 ToU (Time-of-Use) pricing — peak hours now cost 25-40% more.
- Water tariff hikes in Selangor (Nov 2024) + Johor pushed the utility risk higher.

SOLUTION — SHIFT ACCOUNTS TO TENANT (Change of Tenancy / CoT):

TNB CHANGE OF TENANCY:
- Tenant applies via myTNB app OR TNB Careline OR any Kedai Tenaga.
- Documents needed: tenant IC, tenancy agreement (stamped), landlord consent letter, meter reading photo, RM50 application fee.
- Tenant deposits new refundable security deposit to TNB (usually RM150-500 for residential, higher for commercial/aircon-heavy).
- Processing: 3-7 working days.
- Once done: TNB bills go directly to tenant. Landlord NOT liable for unpaid TNB bills.
- CAVEAT: at end of tenancy, if tenant skips without paying final bill, TNB cuts supply but the debt follows the TENANT (registered against their IC), NOT the meter. Landlord can open new CoT immediately with next tenant.

AIR SELANGOR CHANGE OF NAME:
- Similar process: application via Air Selangor mobile app or branch.
- Documents: IC, tenancy agreement, meter reading, deposit RM80-200.
- Processing: 5-10 days.

INDAH WATER (IWK) SEWERAGE:
- Billed to property owner by default (not tenant). Normally stays in landlord's name.
- Some states allow transfer — check IWK portal.
- Typical RM8/month residential; landlord usually absorbs this.

INTERNET (Unifi / Maxis / Celcom Fibre):
- Tenant should open own account — NOT use landlord's.
- If shared building internet: include cost in rent and disclose.

LHDN QUIT RENT / ASSESSMENT (cukai tanah / cukai pintu):
- Always landlord's responsibility (owner, not occupier).
- Due annually. Non-payment → interest + eventual land registry lien.

WHEN TO USE WHICH APPROACH:

STRATEGY A — Tenant pays TNB/Water directly (best for long-term 12+ months):
1. Clause in agreement: "Tenant shall apply for Change of Tenancy with TNB and Air Selangor within 7 days of taking vacant possession. All utility accounts shall be in tenant's name for the duration of the tenancy."
2. Landlord assists with CoT paperwork on handover day.
3. Landlord meter-reads at handover (photo evidence).
4. Reduced utility deposit needed — can cut from ½ month to ¼ month since tenant bears utility risk.

STRATEGY B — Landlord keeps account + charges tenant (best for short-term/furnished/serviced):
1. Monthly utility pass-through with receipts.
2. Require HIGHER utility deposit — 1 month rent or cap-based (e.g., RM2,000 for aircon-heavy condo).
3. Install smart meter to track usage in real time.
4. Set utility inclusive cap: "Rent includes RM300/month utilities; excess billed monthly with receipt."

SMART METER ROLLOUT (TNB 2025-2030):
- TNB committed to 9 million smart meters by 2030.
- Klang Valley, Penang, Johor in first phase (2024-2026).
- Tenant landlords can check myTNB app for real-time daily usage.
- Peak-hour warning helps tenant reduce bill.
- Anti-tampering alerts = fraud detection.
- If your property has old analog meter, request upgrade (free, under rollout).

AIRCON-HEAVY TENANT RISK MITIGATION:
- Standard RM2,500 rent condo with 2-3 aircons: baseline RM250-400/month electricity.
- 24/7 aircon usage: RM800-1,200/month.
- Mitigation:
  (a) Install smart plug / smart meter; monitor usage.
  (b) Clause: "Monthly electricity above RM400 shall be borne by Tenant in addition to rent."
  (c) Higher utility deposit (RM2,000+).
  (d) Insist on Change of Tenancy so TNB chases tenant directly.
  (e) Inspect aircon filters on handover — clogged = higher consumption.

COMMON MISTAKES:

MISTAKE 1: Leaving account in landlord's name "for convenience."
→ Result: tenant runs up bill, skips, TNB comes after LANDLORD. Landlord pays to maintain supply for next tenant.

MISTAKE 2: Accepting meter reading from tenant without photo.
→ Result: disputed final reading, argument over "who used what."

MISTAKE 3: Not checking outstanding bill before handover.
→ Result: new tenant inherits previous tenant's arrears if no CoT done.

MISTAKE 4: Including utilities in rent without cap.
→ Result: tenant has zero incentive to conserve; aircon runs 24/7.

REAL CASES:
• Puchong landlord left TNB in own name "to save hassle." Tenant ran business from condo (illegal home salon), ran multiple dryers + aircons. 6-month bill: RM5,400. Tenant vanished owing 2 months rent + bill. Landlord had to pay RM5,400 to keep meter connected for next tenant. Total loss: RM8,000+.
• KL condo landlord insisted on CoT on day 1. Tenant registered with TNB directly. Tenant's final bill after moving out: RM2,100 unpaid. Landlord immediately did new CoT with next tenant — TNB pursued old tenant's IC for debt. Landlord zero liability.
• Shah Alam landlord installed smart meter + capped utility at RM350/month (excess to tenant). Tenant stayed 2 years, ran moderate aircon; only had to pay excess twice (RM80 and RM120 respectively). Clean relationship.
• JB landlord furnished expat 6-month corporate rental, kept accounts in own name with pass-through + RM2,500 utility deposit. Expat ran heavy AC. Monthly electric RM950. Deposit easily covered tail risk. No disputes.

TEMPLATE — UTILITY HANDOVER CHECKLIST:
"HANDOVER UTILITY CHECKLIST — [Property Address]
Date: _______
Tenant: _______
Landlord/Agent: _______

TNB:
- Meter reading at handover: ___________ kWh [photo attached]
- Outstanding balance confirmed paid: YES / NO
- Change of Tenancy (CoT) application: □ Done on [date] □ Pending □ N/A
- New account reference: _________

AIR SELANGOR / PBA:
- Water meter reading: ___________ m³ [photo attached]
- Outstanding balance: _________
- Change of name application: □ Done □ Pending

IWK Sewerage: remains in landlord's name ☑

INTERNET:
- Existing line: ON / OFF. Provider: _________
- Tenant to apply separately if needed: YES / NO

Signatures:
Tenant: _____ Landlord: _____"

VERIFY HERE:
- TNB CoT: mytnb.com.my / Careline 1-300-88-5454
- Air Selangor: airselangor.com
- IWK: iwk.com.my
- Smart meter rollout status: tnb.com.my/smartmeter`
  },

  smart_lock: {
    keywords: [
      'smart lock', 'kunci pintar', '智能锁', 'digital lock', 'kunci digital',
      'wifi lock', 'keyless', 'tanpa kunci', 'access card', 'kad akses',
      'biometric', 'fingerprint', 'cap jari', '指纹锁',
      'revoke access', 'tarik balik akses', '撤销访问', 'remote access',
      'lock change', 'tukar kunci', '换锁',
      'igloohome', 'yale smart', 'samsung smart lock', 'xiaomi lock', 'schlage', 'aqara',
      'access log', 'log akses', '访问记录',
      'duplicate key', 'duplikat kunci', '复制钥匙',
      'passcode', 'kod laluan', '密码',
      'airbnb lock', 'remote lock'
    ],
    content: `SMART LOCK & DIGITAL ACCESS MANAGEMENT (LANDLORD GUIDE 2026):

WHY LANDLORDS ARE SWITCHING:
- Physical keys get duplicated (locksmith = RM5-15/key; tenant can walk out with unlimited copies).
- Between tenancies: changing a mechanical lock costs RM150-400 per unit.
- No audit trail — no way to prove who entered and when.
- Lost keys = emergency locksmith call-out RM200+ at odd hours.
- Smart locks solve all of the above if deployed correctly.

LEGAL FRAMEWORK — PDPA 2010 FOR ACCESS LOGS:
- Smart lock access logs (who entered, when) = personal data under PDPA.
- Landlord becomes "data user" → must:
  (a) Notify tenant in writing what data is collected.
  (b) Specify retention period (e.g., 6 months after tenancy).
  (c) Store securely (encrypted app, 2FA enabled).
  (d) Not share with third parties without consent.
  (e) Delete upon tenancy end.
- Secret surveillance without disclosure = PDPA breach; tenant can file complaint (penalty up to RM300K / 2 years jail for data controller).

LEGAL FRAMEWORK — NO SELF-HELP EVICTION:
- Even with smart lock, landlord CANNOT remotely revoke tenant's access mid-tenancy — that's self-help eviction (criminal under RTA 2026 s.55 + Immigration Act + Penal Code).
- Revocation is ONLY permitted:
  (a) After tenancy properly ends (expiry / termination with notice).
  (b) After RTT / court possession order.
  (c) Tenant's voluntary surrender of keys/handover.

LOCK CATEGORIES & MALAYSIAN COMPLIANCE:

TIER 1 — KEYPAD ONLY (basic, no WiFi):
- Brands: Schlage Encode (basic), Yale YDM3109, Samsung SHP-DP609.
- Pros: no internet dependency, simple, cheap (RM400-900).
- Cons: no remote revocation; must manually change passcode on-site between tenants.
- Use case: long-term tenancy where landlord visits quarterly.

TIER 2 — WIFI / APP-CONTROLLED (recommended for most):
- Brands: Igloohome (made in Singapore, very popular in Malaysia), Yale Smart Living, Aqara U300, Xiaomi Mijia Smart Lock Pro, Samsung SHP-DP960.
- Pros: remote passcode generation, time-limited codes, access log visibility, revoke anytime.
- Cons: depends on WiFi; need backup battery + emergency key.
- Price: RM1,200-2,500 residential grade.
- Use case: multi-tenancy portfolio, furnished/Airbnb, long-distance landlord.

TIER 3 — BIOMETRIC (fingerprint + face + PIN + card):
- Brands: Yale YDM7116, Samsung SHP-DP960, Anviz FS5, Locstar S83.
- Pros: highest security, multiple auth options.
- Cons: expensive (RM2,000-4,500), more failure modes.
- Use case: high-value properties, expat rentals.

TIER 4 — COMMERCIAL GRADE / INTEGRATION:
- Brands: Assa Abloy VingCard, Salto, Schlage Control.
- Use case: serviced apartments, hotels, co-living.
- Needs PMS (Property Management System) integration.

SELECTION CRITERIA FOR MALAYSIAN LANDLORDS:
- WiFi chipset: 2.4GHz (most Malaysian home routers) — 5GHz-only locks will fail.
- Battery: AA backup preferred (can buy at 7-Eleven) over rechargeable Li-ion proprietary.
- Offline passcode generation: Igloohome's OTP (offline) is a killer feature — generates valid codes even when lock has no internet.
- Emergency mechanical key override: MUST-HAVE in case battery dies at 2am.
- Malaysian door thickness: 40-50mm is standard; verify lock compatibility.
- Mortise vs rim: most HDB-style Malaysian doors take rim; newer condos use mortise.
- IP rating: IP54+ recommended for landed (outdoor exposure to rain).
- Shariah compliance: some Islamic-finance properties may require fingerprint-only or passcode (not biometric face) for gender-mixed households.

HANDOVER PROTOCOL:

DAY 0 (before tenant moves in):
1. Generate unique tenant master passcode (6-8 digits, avoid 123456).
2. Record in secure vault (1Password / Bitwarden).
3. Create tenancy agreement clause (template below).
4. Provide WRITTEN notice of access logging to tenant.
5. Ensure mechanical backup key is labelled + stored offsite (with you, not on property).

DAY 1 (handover):
1. Demonstrate lock operation to tenant.
2. Tenant sets personal secondary PIN (optional).
3. Show how to change passcode (if lock supports self-service).
4. Document in handover form: "Smart lock model ___, master code issued, secondary code enabled, access log enabled."

DURING TENANCY:
- Do NOT log in to view access history casually — only with cause.
- Disable any cameras pointed at interior (illegal without consent).
- Record landlord entry with 24-hour written notice (per RTA 2026).

AT TENANCY END:
1. Tenant surrenders property.
2. Landlord immediately generates new master passcode.
3. Deletes tenant's secondary code.
4. Downloads final access log to PDF for records (6-month retention).
5. Does NOT keep tenant's code active "just in case."

CRITICAL — DO NOT:
- ❌ Install camera inside unit without written tenant consent (privacy + PDPA breach).
- ❌ Keep tenant's passcode active after tenancy ends.
- ❌ Remotely lock tenant out during tenancy dispute (self-help eviction).
- ❌ Share access log with third party (previous landlord, agent, bank) without tenant's written consent.
- ❌ Use same default passcode across multiple units.
- ❌ Rely solely on WiFi (battery failure + no internet = lockout nightmare).

SAMPLE TENANCY CLAUSE — SMART LOCK:
"SMART LOCK & ACCESS MANAGEMENT:
(a) The premises are secured by a smart lock [Model: ________]. Tenant acknowledges the lock records an access log (entry time, code used) which is retained for the duration of the tenancy plus six (6) months thereafter, in compliance with the Personal Data Protection Act 2010.
(b) Landlord shall provide Tenant with a master passcode on handover. Tenant may configure one additional secondary code for their household use.
(c) Tenant undertakes not to share the master passcode with any person beyond their household. Unauthorized distribution is a material breach of this tenancy.
(d) Landlord shall not enter the premises using the smart lock without 24 hours' written notice to Tenant, except in a genuine emergency (fire, flood, medical).
(e) Upon termination of tenancy and Tenant's vacation of the premises, Landlord is entitled to reset all passcodes and generate a new master code.
(f) Access logs will be deleted within 6 months of tenancy end unless required for legal proceedings."

COST-BENEFIT (illustrative):
- Manual rekey between tenants: RM250 × 4 tenancies over 5 years = RM1,000.
- Smart lock one-time: RM1,500. Amortized over 5 years = RM300/year.
- Plus: lost key incident prevention × savings from no emergency locksmith calls.
- Plus: faster tenant turnover (no wait for locksmith).
- ROI break-even: typically 2-3 tenancies.

REAL CASES:
• Mont Kiara condo landlord switched to Igloohome in 2023. Had 4 tenancies since. Zero locksmith calls. Saved ~RM800 vs manual rekey. Tenants appreciated feature → faster leasing.
• Shah Alam landlord installed smart lock without written PDPA notice to tenant. Tenant discovered access log, filed PDPA complaint to Pejabat Pesuruhjaya Perlindungan Data (PDP). Landlord fined RM5,000 + ordered to issue proper disclosure. Lesson: tell the tenant.
• KL landlord during rent dispute remotely changed passcode locking tenant out. Tenant filed police report (criminal trespass dispossession) + RTT complaint. Court ordered immediate restoration + RM8,000 damages. Landlord also charged under Penal Code s.441.
• Bangsar serviced apartment operator deployed 20 Igloohome locks integrated with booking platform. Guest check-in fully automated with 24-hour valid OTP codes. Occupancy up 12% due to seamless experience.

VERIFY HERE:
- PDPA guidelines: pdp.gov.my
- Igloohome Malaysia: igloohome.co/my
- Yale Malaysia: yale.com/my
- Lock compliance certification (SIRIM): sirim.my for door hardware standards`
  },

  gen_z_yield: {
    keywords: [
      'gen z', 'millennial', 'young tenant', 'penyewa muda', '年轻租客',
      'muji', 'japandi', 'scandinavian', 'minimalist', 'industrial design', 'aesthetic', 'instagrammable', 'instagram',
      'renovation roi', 'roi renovasi', 'upgrade rental', 'upgrade sewa',
      'furnished', 'berperabot', '家具齐全',
      'rental uplift', 'kenaikan sewa', '租金上涨',
      'old furniture', 'perabot lama', '旧家具', 'wooden', 'teak', 'rattan',
      'ikea', 'muji malaysia', 'shein home',
      'tile paint', 'vinyl floor', 'wallpaper', 'kertas dinding'
    ],
    content: `GEN Z / MILLENNIAL RENTER — DESIGN ROI FOR LANDLORDS:

WHO RENTS IN 2026:
- Gen Z (born 1997-2012, aged 14-29 in 2026) + late millennials = ~65% of urban rental market.
- Priorities (from multiple Malaysian rental surveys 2024-2025):
  1. Aesthetic ("Instagrammable") — 78%
  2. High-speed internet (≥500Mbps) — 92%
  3. Walkable to MRT/LRT — 71%
  4. In-unit washer/dryer — 68%
  5. Air-con in all bedrooms — 84%
  6. Good lighting (natural + warm LED) — 61%
  7. Clean, neutral colours — 70%
- What they AVOID: dark timber furniture, floral upholstery, cluttered layouts, 4000K cool white tubes, heavy curtains.

THE COMMON PROBLEM:
- Older landlords often inherited or bought units 10-20 years ago. Furnishings are dated: dark teak sets, faded tiles, yellow fluorescent tubes.
- Result: unit sits vacant 2-3 months between tenancies; rent falls RM200-500 below market.
- Annual hidden cost of "looking old": RM3,000-10,000 in lost rent.

MINIMALLY INVASIVE UPGRADES (high ROI, reversible, no MC drama):

TIER 1 — COSMETIC ONLY (<RM3,000 per unit, no approvals):
- Repaint walls: warm white or greige (RM800-1,200 for 800sqft condo).
- Replace fluorescent tubes with 3000K warm LED (RM40-60 per bulb × 8-12 bulbs).
- Replace yellowed curtains with beige/white linen blinds (RM500-800).
- Add 1-2 sheer area rugs (RM250-400 each).
- Swap dark cushion covers to neutral (RM200 total).
- Add framed prints (IKEA/Shein wall art RM20-50 each).
- Deep clean + steam carpet (RM400-600).
- Potted plants (real or good quality fake, RM300).

Rent uplift after Tier 1: RM100-250/month. Payback: 12-18 months.

TIER 2 — MUJI/JAPANDI LIGHT REFRESH (RM5,000-15,000):
- Replace old bed frame with platform bed (RM800-1,500 IKEA/SSF).
- Add warm wood veneer desk/shelf (RM400-800).
- Replace dining set with rattan/wood + upholstered chairs (RM1,200-2,500).
- Install warm LED strip lights under cabinets (RM300-500).
- Replace bathroom faucet + showerhead with black matte (RM400-800).
- Upgrade kitchen taps to sleek matte (RM250-400).
- Paint outdated feature walls; remove heavy wallpaper.
- Swap light fixtures (globe pendant, paper lanterns).
- Add fabric headboard (RM400-800).

Rent uplift after Tier 2: RM300-700/month. Payback: 18-24 months.

TIER 3 — INDUSTRIAL / LOFT AESTHETIC (RM15,000-30,000):
- Expose concrete ceiling (remove plaster + seal).
- Exposed copper/black iron pipe shelving (RM1,500-3,000).
- Acacia wood worktops / breakfast island.
- Matte black ironmongery throughout (hinges, handles).
- Edison-style pendant lights (RM400-800 per fixture).
- Polished concrete look on floor (epoxy coat RM15-25/sqft).
- Built-in entertainment wall.

Rent uplift after Tier 3: RM600-1,500/month on premium units. Payback: 24-36 months.

LANDLORD CONSENT REQUIRED FOR (MC approval needed):
- Any work affecting common walls / structural elements.
- Changes to windows, window grilles, balcony railings.
- Altering main door (colour, material) where MC dictates uniformity.
- Drilling into slab floor or load-bearing walls.
- AC compressor relocation.
- Changes visible from outside (exterior paint, window film).

SAFE (usually NO approval needed):
- Internal wall painting.
- Vinyl flooring over existing tile (reversible, non-permanent adhesive).
- Curtains, blinds.
- Furniture swaps.
- Removable wallpaper.
- Minor electrical (LED bulb changes).
- Swapping internal doors (keep originals).

STRATA BY-LAW WARNINGS (check MC house rules):
- Drilling hours: often 9am-5pm weekdays only.
- Contractor access pass required.
- Lift protection pads required when moving furniture.
- Noise complaint tolerance is very low in Malaysian strata — schedule renovation in 2-3 consecutive days, not spread over weeks.

REVERSIBILITY RULE:
- Every upgrade should be reversible unless landlord intends to keep improvements permanently.
- Reversible: peel-and-stick wallpaper, vinyl plank flooring (over tile), removable light fixtures.
- NOT reversible: plaster removal, wall demolition, embedded flooring, changed door frames.
- Important for: (a) selling later without reinstatement dispute, (b) SPA/MOT transfer cleanliness, (c) strata compliance.

ROI CALCULATOR RULE OF THUMB:
Rent uplift / month × 12 × 5 years ≥ Renovation cost × 1.5 → PROCEED.
Below that ratio → reconsider or defer.

Example: RM400 uplift × 12 × 5 = RM24,000. Renovation up to RM16,000 is good ROI.

TENANCY CLAUSE — LANDLORD UPGRADES BETWEEN TENANCIES:
"Landlord shall deliver the Property in the condition shown in the attached inventory (photos Appendix A). Tenant acknowledges the Property has been refreshed/upgraded and undertakes to use reasonable care to preserve the finish. Damage beyond normal wear will be deducted from Security Deposit per itemised invoice."

TENANCY CLAUSE — TENANT RENOVATIONS DURING TENANCY:
"No tenant alteration, painting, or permanent fixture installation shall be made without Landlord's prior written consent. Minor reversible changes (removable wallpaper, temporary hooks, furniture) are permitted. All tenant-installed items shall be removed on vacation unless Landlord agrees in writing to retain."

TARGETING GEN Z IN YOUR LISTING:
- Title: "Fully Refreshed · Walking Distance MRT · Fibre Ready · Move-in Ready"
- Photos: natural light, straight angles, 35mm feel, neutral colours.
- Include: "Smart lock", "3000K warm lighting", "fully furnished MUJI style", "in-unit W/D", "new mattress".
- List on: iProperty, PropertyGuru, Mudah (still dominant), EdgeProp; also Instagram/TikTok reels of unit walkthrough.
- Video walkthrough > photo listing (70% of young renters watch video before viewing).

REAL CASES:
• Cheras condo: landlord spent RM4,800 on Tier 1 refresh (paint + LED + blinds + rugs). Rent up from RM1,800 to RM2,100. Payback: 16 months.
• Setapak apartment: landlord did full Muji makeover RM14,000. Rent up from RM2,200 to RM2,900. Netted extra RM8,400 in year one; full payback in 20 months.
• KL loft: industrial renovation RM24,000. Rent up from RM3,800 to RM5,200. Payback 17 months. Sold the unit 3 years later at 14% premium over comparables — aesthetic also lifted resale.
• Subang apartment: landlord refused to refresh (preferred original 2005 teak furniture). 4 months vacant. Finally rented at RM1,600 (market comp was RM2,000). Lost RM4,800 in rent + RM1,600 below-market × 12 = RM24,000 total underperformance vs refreshing.

SHOPPING LIST (reliable sources in Malaysia):
- IKEA (Damansara, Cheras, Batu Kawan, Tebrau): furniture, lighting, textiles.
- MUJI (Pavilion, Mid Valley, Sunway, IOI City): cleaner styling pieces.
- Shopee / Lazada: peel-and-stick wallpaper, LED strips (verify seller ratings).
- HomeBox / SSF / Index Living Mall: affordable sofa/dining sets.
- Nippon / Jotun / Dulux (via Mr DIY): low-VOC interior paint.
- Shein Home / Mr DIY: budget decor, art frames.
- Lighting Fair PJ / KL Seng Heng: pendants, LEDs.

MISTAKE TO AVOID:
Over-personalizing for the CURRENT tenant. Your unit will house multiple tenants over 10 years — stick to broadly neutral, broadly liked aesthetics. Muji/Japandi/Scandinavian = safest. Avoid anything very dark, very pink, or very themed.`
  },

  rta_2026: {
    keywords: [
      'rta', 'rta 2026', 'residential tenancy act', 'residential tenancy', 'tenancy act',
      'akta penyewaan kediaman', 'akta penyewaan', 'apk', 'apk 2026',
      '住宅租赁法', '租赁法', '2026租赁法',
      'rtt', 'residential tenancy tribunal', 'tribunal penyewaan kediaman', 'tribunal penyewaan',
      '住宅租赁仲裁庭', '租赁仲裁',
      'deposit protection scheme', 'dps', 'skim perlindungan deposit',
      'perlindungan deposit', '押金保护', '押金托管',
      'tenancy registration', 'register tenancy', 'pendaftaran penyewaan', 'daftar penyewaan', '租约登记', '登记租约',
      'e-sewa', 'esewa', 'tenancy portal', 'portal penyewaan',
      'habitability', 'fit for habitation', 'layak didiami', '宜居',
      'standard tenancy', 'perjanjian penyewaan standard', '标准租约',
      'rent cap', 'had sewa', '租金上限',
      'kpkt tenancy', 'kpkt rta'
    ],
    content: `RESIDENTIAL TENANCY ACT 2026 (RTA) — MALAYSIA:

STATUS & SCOPE:
- Residential Tenancy Act 2026 (Akta Penyewaan Kediaman 2026) — Malaysia's first dedicated residential tenancy legislation, passed by Parliament and gazetted as part of the Madani housing reform agenda.
- Administered by KPKT (Ministry of Housing & Local Government).
- Applies to RESIDENTIAL tenancies only (condo, apartment, landed house, room rental). Does NOT apply to:
  * Commercial/office/factory leases (still governed by Contracts Act + lease terms)
  * Short-term stays ≤3 months (Airbnb, homestay — separate PBT licensing rules)
  * Hotel/motel/hostel accommodation
  * Staff housing / institutional dormitories
  * Agricultural worker housing under Act 446
- Transitional provisions: tenancies signed BEFORE RTA commencement continue under old law until renewal. New or renewed tenancies from commencement date MUST comply.
- IMPORTANT: Exact commencement date and gazetted rate schedules — verify with KPKT (kpkt.gov.my) or the Federal Gazette before citing specific numbers. Find.ai content reflects the published framework but enforcement details may be updated.

KEY FRAMEWORK — WHAT RTA 2026 INTRODUCES:

1. MANDATORY TENANCY REGISTRATION (e-Sewa portal):
   - All residential tenancies must be registered on the e-Sewa portal within 30 days of signing.
   - Unregistered tenancy: landlord cannot use tribunal to recover rent / evict until registered.
   - Registration creates an audit trail + links to LHDN for stamp duty (SDSAS 2026).
   - Fee: nominal (RM10-RM50 range depending on lease term).

2. STANDARDISED DEPOSIT RULES:
   - Maximum security deposit: 2 months rent (capped by statute — old "3+1" for foreign tenants is NO LONGER allowed for residential).
   - Maximum advance rental: 1 month.
   - Maximum utility deposit: ½ month.
   - Landlord must return deposit within 14 DAYS of tenancy end (previously no fixed period).
   - Any deduction must be itemised in writing within the 14-day window.
   - Failure to return: tenant can file at RTT → landlord liable for deposit + late return penalty (typically 10% per month, capped).

3. DEPOSIT PROTECTION SCHEME (DPS):
   - For tenancies above a threshold (expected RM2,000/month+), deposit must be held in a government-approved escrow account.
   - Landlord cannot use deposit for personal cash flow during tenancy.
   - Both parties get a receipt + claim code for tribunal use.
   - Non-compliant landlord: forfeits right to make any deposit deductions + faces fine up to RM10,000.

4. RESIDENTIAL TENANCY TRIBUNAL (RTT):
   - New dedicated tribunal for residential disputes. Replaces reliance on Magistrate's Court / Tribunal Tuntutan Pengguna for residential tenancy matters.
   - Jurisdiction: deposit disputes, rent arrears, eviction claims, repair disputes, breach of tenancy terms.
   - Monetary cap: up to RM100,000 per claim (subject to gazetted revision).
   - Filing fee: RM20-RM50 (far lower than civil court).
   - No lawyers generally required — parties represent themselves.
   - Decision timeline: 60-90 days typical.
   - Appeals: High Court on question of law only.

5. STANDARD TENANCY AGREEMENT (STA):
   - KPKT publishes an official template. Landlord can use custom agreement BUT any clause less favourable to the tenant than STA is VOID.
   - Must be in BM (with English / Chinese translation optional).
   - Mandatory clauses: rent, deposit, term, repair responsibility, notice period, dispute resolution.

6. LANDLORD DUTIES (statutory, cannot be contracted out):
   - Deliver property in habitable condition (safe electrics, working plumbing, no infestation).
   - Maintain structural elements (roof, walls, foundation).
   - Fix major defects within reasonable time (usually 7-14 days for urgent issues like water/electrical).
   - Provide receipts for rent + deposit.
   - Not enter property without 24h written notice (emergencies excepted).
   - Not discriminate based on race, religion, disability, or marital status.

7. TENANT DUTIES (statutory):
   - Pay rent on time.
   - Use property for residential purpose only (no business, no subletting without consent).
   - Keep property reasonably clean.
   - Report damage promptly.
   - Return property in substantially same condition (normal wear exempt).

8. EVICTION — FORMAL PROCESS (RTA chapter):
   - Self-help eviction (lock change, utility cut, belongings removal) = criminal offense + tenant entitled to statutory damages.
   - Proper route:
     a. Written notice to remedy breach (14 days for rent arrears, 30 days for other breach)
     b. If unresolved → notice to vacate (minimum 30 days)
     c. File possession claim at RTT
     d. RTT order of possession → bailiff enforcement
   - Total timeline: 60-90 days under RTA (faster than old court route of 3-6 months).
   - Tenant defenses recognised: improper notice, statutory breach by landlord, retaliatory eviction (evicting tenant for complaining about habitability = barred for 6 months).

9. RENT CONTROLS (LIMITED):
   - RTA 2026 does NOT impose general rent cap (market-driven).
   - BUT rent INCREASES during fixed term are prohibited unless expressly permitted in tenancy agreement with formula (e.g., "up to 5% on renewal").
   - Mid-term increases without clause: VOID.
   - 30-day written notice required for any permitted increase.

10. ANTI-DISCRIMINATION:
    - Unlawful to refuse tenancy based on: race, religion, gender, disability, HIV status, marital status, national origin.
    - Lawful grounds for refusal: creditworthiness (with documented basis), reference checks, prior eviction history, affordability (rent >40% of declared income).

11. SUBLETTING:
    - Default rule: tenant CANNOT sublet without written landlord consent.
    - Landlord cannot unreasonably withhold consent (if tenant provides qualified replacement).
    - Unauthorized subletting = ground for eviction.

12. PENALTIES FOR NON-COMPLIANCE (LANDLORD):
    - Failure to register tenancy: fine up to RM5,000.
    - Self-help eviction: fine up to RM50,000 and/or imprisonment up to 3 years.
    - Unlawful entry without notice: fine up to RM2,000 per incident.
    - Deposit misuse (not in DPS escrow where required): fine up to RM10,000.
    - Discriminatory refusal: fine up to RM20,000.

COMMERCIAL IMPACT — WHAT LANDLORDS MUST CHANGE IN 2026:
- Update ALL tenancy templates to STA-compliant format before next renewal.
- Register every new tenancy on e-Sewa within 30 days.
- Move deposits into DPS escrow for tenancies above threshold.
- Revise deposit demand letters — 14-day statutory return now applies.
- Remove "3+1" or higher deposit structures for residential.
- Train property managers on RTT filing process (replacement for civil court).
- Maintain habitability — courts/tribunal now have statutory basis to order repairs + damages.

REAL-WORLD SCENARIOS (illustrative — based on published framework):
• Landlord in Shah Alam tried to keep RM4,000 deposit citing "cleaning fee." Tenant filed at RTT. RTT ruled cleaning is normal wear; landlord had not registered tenancy on e-Sewa; deposit not in DPS. Order: full refund RM4,000 + RM800 penalty for late return + RM500 for unregistered tenancy. Landlord also fined by KPKT for e-Sewa non-compliance.
• Landlord increased rent from RM1,800 to RM2,200 mid-term citing inflation. Tenancy agreement had no escalation clause. RTT voided the increase as a statutory breach. Tenant continued at original rate.
• Tenant subletted room to foreign worker without consent, breaching both tenancy clause and RTA. Landlord served 14-day notice, then filed RTT possession claim. Order granted in 72 days — tenant evicted, forfeited 1 month rent from deposit.
• Landlord refused tenant application citing "we don't rent to Indians." Tenant filed discrimination complaint. KPKT fined landlord RM18,000 + ordered processing of application.

TEMPLATE — RTA-COMPLIANT DEPOSIT REFUND DEMAND:
"Dear [Landlord Name],
RE: DEMAND FOR RETURN OF SECURITY DEPOSIT UNDER RESIDENTIAL TENANCY ACT 2026
The tenancy at [Address] ended on [Date]. Under Section [X] of the Residential Tenancy Act 2026, you are required to return my deposit of RM[Amount], less any itemised lawful deductions, WITHIN 14 DAYS of tenancy end.
As of today ([Date]), 14 days have elapsed. I hereby formally demand the full return of my deposit, failing which I will file a claim at the Residential Tenancy Tribunal (RTT) seeking:
(a) Full refund of RM[Amount];
(b) Statutory late-return penalty;
(c) Costs of filing.
Please remit within 7 days of this letter.
[Tenant Name]
[Date]"

APPLY / VERIFY HERE:
- e-Sewa portal (tenancy registration): kpkt.gov.my/e-sewa
- RTT filing: rtt.kpkt.gov.my
- Standard Tenancy Agreement template: kpkt.gov.my/sta
- Deposit Protection Scheme approved providers: kpkt.gov.my/dps
- Full RTA 2026 text: Federal Gazette / AGC (agc.gov.my)`
  },

  affordable_housing: {
    keywords: [
      'affordable', 'mampu milik', 'rumah mampu', '可负担', '经济房',
      'pr1ma', 'rumawip', 'residensi wilayah', 'residensi madani', 'ppam', 'ppr', 'program perumahan rakyat',
      'rumah selangorku', 'rsku', 'rmmj', 'rumah mampu milik johor', 'my home', 'myhome',
      'low cost', 'kos rendah', '低收入', 'b40', 'm40',
      'moratorium', 'tempoh larangan', '限售期', 'tidak boleh jual', '不能卖',
      'income cap', 'had pendapatan', '收入上限',
      'quota bumiputera', 'kuota bumi', 'bumi discount', 'diskaun bumiputera', '土著折扣',
      'first time buyer', 'pembeli pertama', '首次购房', 'first home',
      'government house', 'rumah kerajaan', 'subsidised', 'subsidi', '补贴房'
    ],
    content: `MALAYSIAN AFFORDABLE HOUSING SCHEMES (2026):

FEDERAL SCHEMES:
- PR1MA (Perumahan Rakyat 1Malaysia): Household income RM2,500–RM15,000. Price RM100,000–RM400,000. 10-year moratorium (cannot resell in open market). Must be Malaysian citizen, not own another home.
- Residensi Wilayah / RUMAWIP (KL, Putrajaya, Labuan): Monthly income ≤RM15,000 (single) or ≤RM15,000 combined (couple). Price capped RM300,000. 10-year moratorium. Must not own property in the Federal Territory.
- Residensi MADANI (2024–2027 program, replaces some RUMAWIP branding): Target 500,000 units by 2027. Income cap RM15,000. Price RM150K-300K depending on location.
- PPAM (Perumahan Penjawat Awam Malaysia): ONLY civil servants (penjawat awam). Price RM90,000–RM300,000. Must complete 3 years of service. 10-year moratorium.
- PPR (Program Perumahan Rakyat): RENTAL scheme for B40 (household income ≤RM3,000). Monthly rent RM124–RM250. Managed by PBT/state. Application via JPN.
- MyHome scheme: One-off RM30,000 subsidy for first-time buyer of private affordable housing priced RM100K-400K. Must meet income cap. Processed at point of purchase.

STATE SCHEMES:
- Rumah Selangorku (RSKU): Selangor only. Price RM42,000–RM250,000 across 5 tiers. Income cap RM3,000–RM10,000. 10-year moratorium. Apply at LPHS (Lembaga Perumahan dan Hartanah Selangor).
- Rumah Mampu Milik Johor (RMMJ): Johor. Price RM42,000–RM250,000. Income RM3,000–RM10,000. Managed by Perbadanan Perumahan Johor. 10-year moratorium.
- Penang Affordable Housing: RM72,500–RM400,000 tiers. Income RM3,500–RM12,000. Managed by PDC. Special scheme for Penangites.
- Perak Rumah Mesra Rakyat: income RM3,000–RM8,000.
- Rumah Idaman Sarawak (SSL Scheme) & Sabah PPRT: separate state programs with own income caps.

CRITICAL RULES (apply to MOST schemes):
1. CITIZENSHIP: Must be Malaysian citizen. Foreigners and PR NOT eligible.
2. FIRST-TIME ONLY: Must not already own residential property (some states allow ≤1 small unit).
3. INCOME CAP verified via EPF/LHDN — understating income = fraud, agreement can be VOIDED.
4. MORATORIUM: 10 years is standard. During moratorium:
   - Cannot sell in open market
   - Can only sell back to the scheme operator at formula price (usually purchase price + small appreciation)
   - Violation = forfeit + possible criminal charge under Housing Development Act
5. NO SUBLETTING to foreigners during moratorium (some schemes prohibit subletting entirely).
6. BUMIPUTERA QUOTA: Many projects reserve 30-70% of units for Bumiputera buyers. Bumiputera discount typically 5-15% (state-dependent). Non-Bumi can apply for released quota after sales period.
7. DEATH/DIVORCE: Property transfer within family usually allowed. Sale to outsiders still blocked.

REAL CASES — AFFORDABLE HOUSING:
• PR1MA buyer tried to flip unit at year 3 for 40% profit. Transfer blocked by SPA restrictive covenant + Housing Development Authority refused consent. Buyer forced to wait full 10 years or sell back to PR1MA at formula price.
• Couple understated income to qualify for Rumah Selangorku (declared RM9,000, actual RM14,000). LPHS audit via EPF records caught discrepancy. SPA voided, deposit forfeited, buyer banned from future scheme applications.
• PR1MA owner rented unit to foreign worker during moratorium — violated subletting clause. Received show-cause notice, ordered to terminate tenancy within 30 days, fined RM5,000.
• Johor RMMJ buyer inherited property from deceased parent during moratorium. Transfer within family allowed after estate process. 10-year clock reset from original purchase date, not inheritance date.

APPLY HERE (2026):
- PR1MA: pr1ma.my
- RUMAWIP / Residensi Wilayah: kpkt.gov.my (KPKT)
- PPR (rental): state PBT or e-Perumahan portal
- Rumah Selangorku: lphs.selangor.gov.my
- RMMJ: pphj.com.my
- Penang Affordable: pdc.gov.my`
  },

  government_scheme: {
    keywords: [
      'stamp duty exemption', 'pengecualian duti setem', '印花税豁免',
      'first home scheme', 'skim rumah pertamaku', 'srp', 'my first home', '首套房',
      'i-miliki', 'imiliki', 'hoc', 'home ownership campaign',
      'madani', 'belanjawan', 'budget 2026', 'budget 2025',
      'sjkp', 'skim jaminan kredit perumahan', 'credit guarantee', 'jaminan kredit',
      'rent to own', 'rto', 'sewa beli', 'sewa-beli', '先租后买', 'houzkey',
      'cagamas', 'skim smi', 'skim pembiayaan',
      '100% financing', 'pembiayaan penuh', '全额贷款', 'zero down', 'tanpa deposit',
      'developer exemption', 'pengecualian pemaju',
      'ewpg', 'bumiputera lot release', 'pelepasan lot bumi',
      'rumah mesra rakyat', 'skim bantuan', 'subsidi kerajaan', 'government subsidy'
    ],
    content: `GOVERNMENT HOUSING SCHEMES & INCENTIVES (2026):

STAMP DUTY EXEMPTIONS (active in 2026):
- First-Time Homebuyer Exemption (extended under Budget 2024 to 31 Dec 2027):
  * Properties ≤RM500,000: 100% exemption on MOT stamp duty + 100% on loan agreement stamp duty.
  * Properties RM500,001–RM1,000,000: 75% exemption on MOT + 100% on loan agreement stamp duty.
  * Must be Malaysian citizen, first residential property, SPA executed between 1 Jan 2024 and 31 Dec 2027.
  * NOT available if buyer (or spouse) has ever owned residential property anywhere in Malaysia.
- i-MILIKI (phased out — only SPAs signed June 2022–Dec 2023 qualify; do NOT cite for new purchases).
- HOC (Home Ownership Campaign 2020–2021, 2022–2023): ENDED. Not available in 2026. Developers may still market "HOC-equivalent" promos but these are NOT government-subsidised — verify with LHDN before claiming any exemption.

FINANCING SCHEMES (active):
- Skim Rumah Pertamaku / My First Home Scheme (SRP): Administered by Cagamas SRP Berhad.
  * Up to 100% financing (no down payment required).
  * Joint household income ≤RM10,000 (gross).
  * Property ≤RM500,000.
  * Must be first home. Age <40 at application.
  * Participating banks: Maybank, CIMB, Public Bank, RHB, Hong Leong, Bank Rakyat, Bank Islam, AmBank, Alliance, BSN.
  * Loan tenure up to 40 years or age 70, whichever earlier.
- SJKP (Skim Jaminan Kredit Perumahan): Government credit guarantee for buyers WITHOUT fixed income (self-employed, gig workers, farmers, fishermen, small traders).
  * Up to 120% financing (covers property + legal fees + MOT).
  * Household income ≤RM5,000.
  * Property ≤RM300,000 (standard) or ≤RM500,000 (SJKP Madani 2024+).
  * SJKP guarantees the bank loan — removes the "no payslip" obstacle.
- Skim Pembiayaan i-BIAYA / Bank Rakyat: Islamic financing for affordable housing purchases.

RENT-TO-OWN (RTO) SCHEMES:
- PR1MA RTO: 5-year rental phase → convert to full purchase at original price. No deposit upfront. During rental, maintenance cost is tenant's.
- HouzKEY (Maybank): up to 5 years rent with option to purchase. Monthly "rental" partially treated as loan installment. Property must be in HouzKEY inventory.
- SJKP RTO (selected state projects): similar 5-year rent-then-buy model.
- KEY RISK: if buyer walks away at end of rental, they lose ALL rental paid — it does NOT convert to a refund. Read the purchase option clause carefully.

BUDGET 2026 HOUSING INITIATIVES (verify with MOF gazette before quoting exact figures):
- Residensi MADANI: 500,000 affordable units targeted by 2027.
- RM2.4 billion allocated for affordable housing development.
- Extension of stamp duty exemptions to 2027.
- RM10 billion housing guarantee fund expansion (SJKP).
- Youth Housing Scheme (under review) — proposed 10% deposit assistance for Malaysians aged 21-40.

BUMIPUTERA LOT RELEASE:
- Every new development must reserve a Bumiputera quota (typically 30-50%, state-dependent).
- Unsold Bumi lots can be RELEASED to non-Bumi buyers after a fixed holding period (usually 6-12 months from OC).
- Some states offer Bumi Discount (5-15% off list price) for Bumi buyers — this is a STATE-level subsidy, not federal.
- Foreigners: not eligible for Bumi discount or for released-Bumi lots that still carry restrictive endorsement.

REAL CASES — GOVERNMENT SCHEMES:
• First-time buyer purchased RM480,000 condo in 2025. Claimed 100% MOT + loan stamp duty exemption under Budget 2024 extension. Saved RM8,400. Filed via e-Stamping at MyTax. Exemption approved automatically because SPA, loan agreement, and IC details matched.
• Couple applied for SRP with joint income RM9,800 on RM495,000 property — got 100% financing approved. Would have needed RM49,500 deposit otherwise.
• Self-employed durian farmer applied for SJKP on RM250,000 kampung house. Normally rejected by banks (no payslip). SJKP guarantee approved — Maybank financed 110% of price. Farmer only paid RM3,000 in legal fees out of pocket.
• RTO buyer rented HouzKEY unit for 3 years (RM2,500/month = RM90,000 paid), then decided not to buy because property dropped in value. Lost entire RM90,000 — rental is NOT refundable. Should have exercised purchase option or walked away earlier.
• Non-Bumi buyer tried to purchase Bumi-reserved unit before release period ended. SPA signed but MOT consent refused by State Authority. Deposit RM15,000 held in dispute for 8 months. Resolved only after Bumi release approval.

COMMON TRAPS:
- "HOC available" adverts in 2026: HOC ended in 2023. Ask the developer to point to the current gazetted exemption — if they can't, it's a marketing gimmick.
- "Free legal fees" often means the developer's lawyer handles it (conflict of interest) and "free" excludes disbursements (valuation, search fees, stamp duty).
- "Zero downpayment" usually means the developer rebates the 10% — you still need to pay, then get refund at SPA signing. Read the rebate schedule.
- Claiming first-time exemption when spouse has owned property before = exemption revoked + penalty. LHDN cross-checks via ownership records.
- SRP income check uses GROSS income (before EPF/SOCSO/tax). Don't quote net — you'll be under-reported or rejected.

APPLY / VERIFY HERE:
- Stamp duty exemption: hasil.gov.my (LHDN) → e-Stamping / MyTax
- SRP: cagamas-srp.com.my or any participating bank branch
- SJKP: sjkp.com.my
- PR1MA RTO / HouzKEY: respective scheme portals
- Budget 2026 gazette: mof.gov.my / percetakan nasional`
  },

  general: {
    keywords: [],
    content: `GENERAL REFERENCE:

DIGITAL EVIDENCE:
- Evidence Act 1950 s.90A — digital photos/screenshots need "Certificate of Authenticity" for court.
- WhatsApp messages can be evidence if properly authenticated.

PDPA 2010:
- Landlords collecting tenant IC/passport copies must comply with data protection.
- Cannot share tenant's personal data without consent.

SABAH & SARAWAK:
- Different land laws: Sabah Land Ordinance (Cap.68), Sarawak Land Code (Cap.81).
- NCR land — non-native purchase is VOID.
- Some Peninsula law does NOT apply in East Malaysia.

REAL ESTATE AGENTS:
- BOVAEA regulated (Act 242). Only REA/PEA can transact legally.
- Max commission: 3% sale, 1 month rent.
- Illegal agents: RM300,000 fine or 3 years jail.
- Verify at lppeh.gov.my.`
  }
};

// Keyword matcher — scans user message + recent conversation for topic relevance
export function matchTopics(userMessage, conversationHistory = []) {
  const text = (userMessage + ' ' + conversationHistory.slice(-3).map(m => m.content).join(' ')).toLowerCase();
  const matched = [];

  for (const [topicId, topic] of Object.entries(TOPICS)) {
    if (topicId === 'general') continue; // general is fallback
    for (const kw of topic.keywords) {
      if (text.includes(kw.toLowerCase())) {
        matched.push(topicId);
        break;
      }
    }
  }

  // Always include general as light fallback if nothing else matches
  if (matched.length === 0) {
    matched.push('general');
  }

  // Cap at 3 topics to keep prompt focused
  return matched.slice(0, 3);
}

// Build the relevant knowledge section for injection into system prompt
export function buildKnowledge(topicIds) {
  return topicIds.map(id => TOPICS[id]?.content || '').filter(Boolean).join('\n\n');
}

// Glossary + state rules are always included (small, universally useful)
export const ALWAYS_INCLUDE = `
LEGAL GLOSSARY — BM / ZH / EN:
Tenancy agreement → Perjanjian penyewaan → 租约 | Security deposit → Wang cagaran → 押金 | Stamp duty → Duti setem → 印花税 | Landlord → Tuan rumah → 房东 | Tenant → Penyewa → 租客 | Eviction → Pengusiran → 驱逐 | Letter of demand → Surat tuntutan → 催款函 | SPA → Perjanjian Jual Beli → 买卖合同 | MOT → Memorandum Pindah Milik → 产权转让备忘录 | Quit rent → Cukai tanah → 地税 | RPGT → CKHT → 产业盈利税 | Freehold → Pegangan bebas → 永久地契 | Leasehold → Pajakan → 租赁地契 | Subletting → Sewaan semula → 转租

STATE-SPECIFIC RULES:
- Penang: Island RM1M / Mainland RM500K foreign threshold. Additional 2% stamp duty.
- Selangor: RM2M landed / RM1.5M strata (highest).
- Johor: RM1M. Iskandar special zone.
- KL: RM1M. Federal consent only.
- Sabah/Sarawak: Different land code. NCR restrictions.
- Melaka/Perak: RM500K-1M.`;
