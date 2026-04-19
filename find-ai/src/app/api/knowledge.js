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
- Malaysia does NOT yet have a Residential Tenancy Act (RTA). Tenancy disputes handled via civil courts or Tribunal Tuntutan Pengguna (consumer claims ≤RM5,000).

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

REAL CASES — STAMP DUTY:
• Landlord tried to enforce deposit deduction using unstamped agreement at Tribunal. Case dismissed — s.52 Stamp Act. Landlord then paid late stamping penalty (RM100 + 20%) and refiled. Second attempt succeeded because agreement was now admissible.
• Tenant paid RM2,000/month rent. Landlord never stamped the agreement for 2 years. When deposit dispute arose, tenant's lawyer used s.52 to block landlord from presenting the agreement. Landlord lost the entire RM4,000 deposit claim.
• First-time buyer purchased RM480,000 condo — saved RM7,200 in MOT stamp duty + RM1,200 in loan stamp duty under first-time exemption. Total savings: RM8,400.`
  },

  eviction: {
    keywords: ['evict', 'eviction', 'kick out', 'halau', 'usir', 'pengusiran', '驱逐', '赶走', 'change lock', 'changed lock', 'change the lock', 'tukar kunci', '换锁', 'cut water', 'cut electric', 'potong air', 'potong elektrik', 'possession order', 'writ', 'bailiff', 'won\'t leave', 'tak nak keluar', '不搬走', 'refuse to leave', 'trespass', 'lock out', 'locked out'],
    content: `EVICTION:
- Specific Relief Act 1950, s.7 — ONLY court can order eviction.
- Self-help eviction (changing locks, cutting water/electricity, removing belongings) = criminal offense.
- Process: Notice to vacate (usually 1 month) → File for possession order if tenant refuses → Court hearing → Writ of possession → Bailiff executes.
- Timeline: 3-6 months typically.
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
    keywords: ['strata', 'condo', 'apartment', 'pangsapuri', '公寓', 'MC', 'JMB', 'management', 'pengurusan', '管理', 'by-law', 'undang-undang kecil', 'sinking fund', 'maintenance', 'penyelenggaraan', '维护费', 'AGM', 'SMT', 'common property', 'harta bersama', 'special levy', 'levi khas'],
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

REAL CASES — STRATA:
• MC charged RM5,000 special levy for lift replacement. Owner refused to pay. MC registered charge on unit — owner couldn't sell until levy + penalty paid. Total delay cost owner RM12,000 in lost sale opportunity.
• Tenant complained about noise to MC. MC issued warning to offending unit. Owner of noisy unit ignored. MC filed at SMT — awarded RM5,000 damages + mandatory compliance order.
• MC failed to insure building. Fire damaged 3 units. Affected owners sued MC committee members personally — court upheld personal liability under s.93.`
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
