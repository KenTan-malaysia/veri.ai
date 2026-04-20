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
    keywords: ['stamp', 'duti setem', '印花税', 'setem', 'stamping', 'unstamped', 'tak stamp', '没盖章', 'SDSAS', 'MyTax', 'late stamp', 'penalty stamp', 'e-duti', 'e-duti setem', 'eDuti', 'eDuti Setem', 'duti elektronik', 'electronic stamp', 'digital stamp', '电子印花', 'stamps portal', 'self-assessment stamp'],
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

STAMPS PORTAL / e-Duti Setem — STEP-BY-STEP E-STAMPING (LHDN DIGITAL SYSTEM):
From 2026, ALL tenancy stamping goes through the LHDN e-Duti Setem (STAMPS) portal (stamps.hasil.gov.my). No more walk-in counter for standard tenancies. "e-Duti Setem" and "STAMPS portal" are the same system — LHDN uses both names.

SDSAS PENALTY EXPOSURE — READ THIS BEFORE FILING:
- Under-declaration / wilful incorrect self-assessment: RM10,000 fine (Stamp Act 1949 s.62 as amended 2024-2026) PLUS shortfall duty PLUS up to 100% penalty (s.36A).
- Genuine good-faith calculation error during 2026 transition year: LHDN Public Ruling 2026/01 grants NO PENALTY concession (see below).
- Late stamping (missed 30-day window): tiered penalties (see CURE section below).
- The RM10,000 fine is the BIGGEST risk — it's per agreement, not per error. A landlord with 5 incorrectly assessed tenancies could face RM50,000 in fines.

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
    keywords: [
      'evict', 'eviction', 'kick out', 'halau', 'usir', 'pengusiran', '驱逐', '赶走',
      'change lock', 'changed lock', 'change the lock', 'tukar kunci', '换锁',
      'cut water', 'cut electric', 'potong air', 'potong elektrik',
      'possession order', 'writ of possession', 'writ', 'bailiff',
      "won't leave", 'tak nak keluar', '不搬走', 'refuse to leave', 'refuses to leave', 'tenant refuse', 'tenant refuses',
      'trespass', 'trespasser', 'trespassing', 'pencerobohan', '擅自占地',
      'lock out', 'locked out',
      'squatter', 'squatters', 'squatting', 'setinggan', '擅居者', '非法占用',
      'changed the locks themselves', 'changed locks themselves', 'occupy without rent', 'occupying without paying',
      'adverse possession', 'pemilikan secara merugikan', '逆权占有',
      'empty shoplot', 'empty unit', 'vacant shoplot', 'vacant unit', 'occupied without my permission', 'broke in and stayed',
      'non-tenant', 'not my tenant', 'never rented', 'no tenancy', 'no agreement',
      'holdover eviction', 'overstayed',
      'restraining order', 'protection order', 'dva', 'domestic violence act', 'remove from lease', 'remove from agreement', 'remove co-tenant', 'remove cotenant', 'abusive husband', 'abusive wife', 'abusive spouse', 'abusive partner',
      'industrial eviction', 'factory tenant eviction', 'warehouse eviction', 'commercial eviction',
      'self-help eviction', 'penyingkiran sendiri', 'forcibly evict'
    ],
    content: `EVICTION (deep reference — residential, commercial, squatters, co-tenants):

═══════════════════════════════════════════════════════════════════════════════
PART 1 — LEGAL FRAMEWORK (who has the right to order removal?)
═══════════════════════════════════════════════════════════════════════════════
- Specific Relief Act 1950, s.7 — ONLY a court or statutory tribunal can order eviction. Period.
- Residential Tenancy Act 2026 (RTA 2026) — covers RESIDENTIAL tenancies only. Dispute → Residential Tenancy Tribunal (RTT). Timeline 60-90 days. Jurisdictional cap generally RM100k per claim (monitor gazette).
- Distress Act 1951 — lets landlord RECOVER RENT by seizing tenant's goods (Form D/Warrant of Distress). This is NOT an eviction tool — it does NOT end the tenancy. Many landlords confuse the two.
- Commercial, industrial, agricultural tenancies → traditional court route (Magistrate / Sessions / High Court depending on claim value).
- Contracts Act 1950, s.71 — quantum meruit / mesne profits claim for continued occupation after tenancy ends.
- Penal Code s.441 & s.427-430 — criminalise self-help.

═══════════════════════════════════════════════════════════════════════════════
PART 2 — SELF-HELP IS A CRIME (the #1 landlord mistake)
═══════════════════════════════════════════════════════════════════════════════
Prohibited acts (ALL criminal, ALL expose landlord to civil damages):
- Changing locks while tenant is away ⟶ s.441 trespass. 6 months jail / RM3,000 fine.
- Cutting water/electricity ⟶ Penal Code s.427 "mischief". Up to 2 years jail + fine.
- Removing tenant's belongings / disposing of goods ⟶ theft charge + conversion claim.
- Threatening / physically removing tenant ⟶ criminal intimidation s.506 + assault charges.
- Hiring "enforcement" / gangsters ⟶ abetment of all of the above + AMLA exposure if paid in cash.
- Posting "eviction notice" on door then bolt-cutting lock ⟶ still illegal. The notice has no force.

Civil exposure under Specific Relief Act s.8(1) for wrongful dispossession — tenant typically recovers:
- Full deposit refund
- Replacement accommodation (hotel + movers) for months until reinstated
- Value of damaged / lost belongings (itemised)
- Loss of business income (commercial tenants often claim RM50k-500k+ here)
- General damages for distress (RM5,000-RM30,000 typical)
- Aggravated / exemplary damages if conduct egregious
- Full legal costs on indemnity basis

If you ALREADY did self-help: (1) restore access TODAY, (2) do NOT touch belongings, (3) written apology NOT recommended without lawyer, (4) offer settlement before tenant files, (5) expect RM20k-100k+ settlement range.

═══════════════════════════════════════════════════════════════════════════════
PART 3 — RESIDENTIAL EVICTION (post-RTA 2026)
═══════════════════════════════════════════════════════════════════════════════
Grounds (must be one of these; lease-expiry alone may NOT suffice):
- Rent arrears ≥ 2 months (most common)
- Material breach (illegal use, nuisance, unauthorised sub-let, damage)
- Landlord genuine own-occupation or sale (must prove)
- Property uninhabitable (flood, fire) — see natural_disaster topic

Procedure:
1. Written notice specifying breach + cure period (typically 14-30 days).
2. If no cure: file RTT-01 at Residential Tenancy Tribunal. Fee ~RM100-300.
3. Mediation first (mandatory). 60-80% settle here.
4. If no settlement: tribunal hearing (no lawyers required, saves cost).
5. RTT issues Order of Possession. Tenant 14-30 days to vacate.
6. Non-compliance → warrant executed by bailiff.

Timeline: 60-120 days total. Cost: RM500-RM3,000 if self-represented.
Advantages over old Magistrate route: faster, cheaper, specialised adjudicators, clearer rules on deposit, notice, and rent cap.

═══════════════════════════════════════════════════════════════════════════════
PART 4 — COMMERCIAL / INDUSTRIAL EVICTION (unchanged by RTA 2026)
═══════════════════════════════════════════════════════════════════════════════
Shops, factories, warehouses, offices, agricultural land → traditional civil courts.

Standard procedure:
1. Notice to Quit — typically 1 month (monthly tenancy) or per contract. Must comply strictly with notice formalities (served on correct party, correct expiry date, exact property description).
2. Letter of Demand for arrears + vacant possession.
3. File Writ of Summons + Statement of Claim → Magistrate (≤RM100k) / Sessions (≤RM1m) / High Court (>RM1m).
4. Tenant has 14 days to enter Memorandum of Appearance, then 14 days for defence.
5. Case Management, then trial. Many settle or go to Summary Judgment (O.14) if no defence.
6. Judgment for possession + arrears + mesne profits.
7. Writ of Possession → sheriff / bailiff executes.

Timeline: 4-8 months uncontested, 12-24 months if defended. Cost: RM12,000-RM40,000 legal fees.

Strategic tools:
- Interim injunction if tenant causing ongoing damage / illegal use.
- Summary Judgment (O.14 RC 2012) if tenant has "no arguable defence".
- Joinder of guarantors / parent company (common for SME tenants).
- Recovery of rent via Distress Warrant runs IN PARALLEL — tenancy continues but goods seized.

═══════════════════════════════════════════════════════════════════════════════
PART 5 — DISTRESS WARRANT vs POSSESSION ORDER (commonly confused)
═══════════════════════════════════════════════════════════════════════════════
Distress (rent recovery — TENANT STAYS):
- Governed by Distress Act 1951. Apply to Sessions Court for Warrant of Distress.
- Bailiff seizes tenant's moveable goods at the property. Goods held 7 days, then auctioned.
- Cannot seize: tools of trade up to RM150, clothing, bedding, goods of third parties.
- Does NOT terminate the tenancy — tenant can cure arrears and stay.
- Useful when tenant has valuable goods (equipment, stock, vehicles).

Possession Order (eviction — TENANT LEAVES):
- Ends the tenancy. Issued by court or RTT.
- Tenant must deliver vacant possession by deadline or bailiff enters + removes.
- Used to recover the physical property.

Most landlords only need Possession Order. Distress is useful when arrears are large and tenant has seizable assets but little cash.

═══════════════════════════════════════════════════════════════════════════════
PART 6 — SQUATTERS, TRESPASSERS, NON-TENANTS (no lease exists)
═══════════════════════════════════════════════════════════════════════════════
Scenarios:
- Stranger moved into empty shoplot, changed locks.
- Ex-tenant's relative refusing to leave after tenant already moved out.
- Person claims to have "bought" the property from a fraudster.

Legal position:
- They are TRESPASSERS. Landlord (registered proprietor) has immediate right to possession.
- National Land Code 1965 — registered title is INDEFEASIBLE (s.340). Only fraud / forgery / prior claim defeats it.
- Adverse possession does NOT exist in Peninsular Malaysia or Sabah for Torrens titles. See Sidek v Government of Perak. (Sarawak has limited NCR exceptions — separate issue, see malay_reserved_land topic.)
- No amount of occupation creates a right. Even 20 years of squatting gives NO title.

What to do (correct sequence):
1. DO NOT confront alone. Do NOT change locks back yourself — even though they changed them without right, you are still NOT allowed to self-help when physical occupation exists.
2. Lodge POLICE REPORT for criminal trespass (s.441). Keep the report number.
3. If squatter claims ownership: demand to see title. Conduct land search at PTG (RM50). Confirm you are registered proprietor.
4. Apply for Order of Possession — originating summons (expedited procedure) under O.89 Rules of Court 2012 (Summary Procedure Against Persons in Occupation Without Licence or Consent of Owner).
5. O.89 can give an order in 4-8 weeks — much faster than full writ. Court may order personal service OR service by affixing notice on the property if occupier's identity unknown.
6. Writ of Possession → bailiff enters, removes persons + belongings (stored or disposed per court direction).
7. Re-secure property with new locks + alarm + CCTV.

Costs: RM5,000-RM12,000 legal fees for O.89. Timeline: 6-12 weeks typically.

If police refuse to act ("civil matter"): do NOT give up. O.89 does not require police cooperation. Lawyer files directly.

If squatter produces a "purchase contract": that contract is between squatter and the fraudster. Squatter's remedy is against the fraudster, NOT against you. Still a trespasser as against the registered proprietor. (Bahadun Haji Hassan v Ujan Teh & Ors principle.)

═══════════════════════════════════════════════════════════════════════════════
PART 7 — HOLDOVER TENANT (lease ended, tenant still inside)
═══════════════════════════════════════════════════════════════════════════════
- Once tenancy expires and landlord does NOT accept further rent, tenant becomes "tenant at sufferance" — lowest category, just above trespasser.
- Landlord entitled to mesne profits (market rent rate, not old rent) from day 1 after expiry.
- DO NOT accept rent payments after expiry if you want to enforce — acceptance may create implied new periodic tenancy. If you must accept, mark payment as "for use and occupation only, without prejudice" in receipt.
- Procedure: Notice to deliver vacant possession → file for possession → same as commercial route.

═══════════════════════════════════════════════════════════════════════════════
PART 8 — REMOVING AN ABUSIVE CO-TENANT (Domestic Violence Act 1994)
═══════════════════════════════════════════════════════════════════════════════
Scenario: both spouses on the lease. Victim obtains Protection Order / Interim Protection Order against abuser.

The Protection Order can:
- Restrain abuser from entering the shared residence (s.6 DVA 1994, as amended 2017).
- Grant victim EXCLUSIVE OCCUPATION of the residence.
- Order abuser to continue paying rent despite being excluded (s.6(2)(a) DVA).

Landlord's position:
- You are BOUND by a Protection Order granting exclusive occupation to the victim, even if both are on the lease.
- Do NOT let the abuser back in. If you do, you may be aiding breach of the order.
- Do NOT unilaterally remove the abuser from the lease — a Protection Order does not automatically end the abuser's contractual liability. Require victim's lawyer to apply for lease variation OR obtain court order for lease re-assignment.
- Victim should also consider applying to Syariah / Civil court (depending on marriage type) for occupation order under the Law Reform (Marriage & Divorce) Act 1976 s.77 (property division) if divorcing.
- If abuser refuses to leave despite Order: police enforce DVA s.19 (breach = arrestable offence, 1 year jail / RM2,000 fine).

Practical steps for landlord:
1. Ask victim for certified copy of the Protection Order.
2. Ring-fence rent payments: continue receiving, do NOT interact with abuser.
3. Document every communication.
4. If abuser attempts entry: call police immediately, cite the Order.
5. At lease renewal: offer new single-name lease to victim only (with co-signer if affordability is an issue).
6. Deposit: held jointly until lease ends. Refund per court direction or joint written instruction.

Related: if tenant is the victim and abuser is NOT on lease but has "moved in", that's an unauthorised occupant. Landlord can serve notice to vacate on the unauthorised occupant directly.

═══════════════════════════════════════════════════════════════════════════════
PART 9 — EMERGENCY / INJUNCTIVE RELIEF
═══════════════════════════════════════════════════════════════════════════════
When standard timeline is too slow:
- Ex parte injunction if tenant destroying property / operating illegal business / harbouring fugitives.
- Anton Piller order (rare) — to preserve evidence before hearing.
- Mareva injunction — freeze tenant's assets if flight risk.
- Criminal complaint (drug activity → see criminal_activity topic) may trigger police entry independent of civil process.

═══════════════════════════════════════════════════════════════════════════════
PART 10 — REAL CASES
═══════════════════════════════════════════════════════════════════════════════
• Er Eng Hong v New Kim Eng — self-help extinguished; tenant restored + damages.
• Sidek bin Haji Muhamad v Government of Perak [1982] — adverse possession does not apply to Torrens title land in Peninsular Malaysia. Still leading authority in 2026.
• PJ landlord changed locks while tenant at work → police report s.441 + emergency injunction → access restored in 48 hours → RM35,000 damages.
• KL landlord cut electricity for 3 months → RM22,000 damages (general + inconvenience).
• Ipoh squatter case 2024: shoplot owner used O.89 procedure, possession order in 9 weeks, RM8,400 legal fees, bailiff cleared premises cleanly.
• KL DVA case 2023: husband on joint lease, Interim Protection Order excluded him, landlord mistakenly let him back for "to collect belongings" — victim sued landlord for negligent breach; settled RM15,000. Lesson: enforce the Order strictly.

═══════════════════════════════════════════════════════════════════════════════
PART 11 — NOTICE TEMPLATES
═══════════════════════════════════════════════════════════════════════════════
NOTICE TO VACATE (residential or commercial holdover):
"Dear [Tenant Name],
RE: NOTICE TO VACATE — [Property Address]
You are hereby given [30/60/90] days' notice to vacate the above property by [Date], pursuant to [Clause X / expiry of tenancy / material breach of Clause Y].
Please ensure: (1) All outstanding rent and utility bills are settled by the vacate date. (2) The property is returned in the condition set out in the inventory checklist. (3) Keys are returned on or before the vacate date.
A joint inspection will be conducted on [Date/Time]. Failure to deliver vacant possession will result in legal proceedings for possession, mesne profits at market rate, and costs on an indemnity basis.
Yours faithfully,
[Landlord Name] | [Date]"

NOTICE TO TRESPASSER (no tenancy exists):
"TO: The Occupier — [Property Address]
I, [Landlord Name], NRIC [xxx], am the registered proprietor of the above property (title: [GRN/HSM/PN xxx]).
You are occupying the property WITHOUT my consent, licence, or any tenancy agreement. You have NO legal right to remain on the premises.
You are hereby required to vacate the property within SEVEN (7) DAYS of this notice, failing which I shall apply under Order 89 of the Rules of Court 2012 for an Order of Possession, with costs sought against you on an indemnity basis. A police report for criminal trespass under s.441 of the Penal Code has been / will be lodged.
[Affixed to property on: Date] | [Also served by AR Registered Post where address known]
[Landlord Name] | NRIC | Date"`
  },

  rent_default: {
    keywords: ['tak bayar', 'not pay', 'arrears', 'tunggakan', '欠租', '拖欠', 'default', 'late rent', 'lewat sewa', 'demand letter', 'surat tuntutan', '催款', 'LOD', 'distress', 'Form 198', 'mco', 'mco rent', 'mco reduced', 'mco-reduced', 'covid rent', 'covid-19 rent', 'moratorium rent', 'rental relief covid', 'covid reduced rent', 'sewa covid', 'pengurangan sewa covid', '疫情减租', '冠病减租', 'pkp rent', 'pkp sewa', 'temporary measures act', 'akta langkah-langkah sementara', 'covid-19 act 2020', 'pandemic rent reduction', 'reset rent', 'resume full rent', 'rent reduction expired'],
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
[Date]"

COVID / MCO LEGACY RENT REDUCTION — HOW TO RESET:
- Temporary Measures for Reducing the Impact of COVID-19 Act 2020 (Act 829) EXPIRED on 31 December 2022. Its moratorium protections are no longer in force.
- No statutory obligation to continue reduced rent in 2023+. Any continued reduction is purely contractual (what you agreed in writing in 2020-2021).
- If tenant is still paying MCO-reduced rent in 2026:
  1. Find the original variation letter / email / WhatsApp agreeing to the reduction. Check its expiry or trigger-based terms (e.g., "until MCO lifted" / "until PKP ends").
  2. If the agreed trigger has passed (MCO officially ended 2 May 2022 per MKN): send written notice that full contractual rent resumes from [next rent cycle] — give 30 days' notice for transition fairness.
  3. If no written agreement — tenant has been paying reduced rent by "silent consent" / "estoppel by convention": you can still reset but give reasonable notice (60-90 days recommended) to rebut estoppel argument.
  4. If tenant refuses to resume full rent: standard rent default procedure applies (LOD → Distress Act → possession). Send LOD for the SHORTFALL (difference between original tenancy rent and what they paid).

COMMERCIAL TENANCIES WITH "COVID CLAUSE" HANGOVER:
- Many commercial tenancies 2020-2022 had formal rent reduction MOUs with specific end dates.
- If MOU ended but tenant keeps paying reduced rent: follow notice-to-resume steps above.
- If MOU was silent on end date: 30-day written notice + reference to business conditions normalization.
- If tenant's business is still struggling: consider stepped increase (50% gap in month 1, 75% in month 2, 100% in month 3) rather than cliff-edge — legally not required but reduces default risk.

RENT VARIATION RECORD-KEEPING:
- Every rent change (reduction, increase, step-up) should be documented in a side letter or addendum and kept for 7 years (LHDN requirement for rental income records).
- If original tenancy was stamped, addendums usually do NOT need re-stamping unless fundamentally changing the lease (new term, new parties).

COMMON TRAPS:
- Assuming MCO protections still apply — they expired end of 2022. Tenant cannot invoke Act 829 today.
- Cliff-edge rent reset without notice → tenant disputes and pays only reduced amount → you have to litigate for shortfall (time + cost).
- Losing the original 2020 variation letter → weak evidence. Always keep digital copies.
- Not tracking the accumulated shortfall → hard to compute years later.`
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
    keywords: [
      'repair', 'fix', 'baiki', 'pembaikan', '修理', '维修',
      'leak', 'bocor', '漏水',
      'mold', 'kulat', '霉',
      'damage', 'rosak', '损坏',
      'habitab', 'uninhabit', 'tak boleh duduk', '不能住',
      'plumbing', 'paip', 'roof', 'bumbung', 'ceiling', 'siling',
      'occupier liability', 'occupiers liability', 'occupier\'s liability', 'liabiliti penghuni',
      'falling object', 'falling aircon', 'aircond fell', 'aircon fell', 'aircon fall', 'aircond fall', 'ac unit fell', 'objek jatuh', 'benda jatuh', '物品坠落', 'barang jatuh', 'falling ac',
      'window ledge', 'window sill', '窗台',
      'injured below', 'injured someone', 'cedera', 'person injured',
      'who pays injury', 'tenant installed without telling', 'tenant installed aircon',
      'common area injury', 'ground floor slip', 'stairs fall', 'jatuh tangga',
      'landlord liability injury', 'landlord sued', 'personal injury tenant',
      'contractor injured', 'pekerja cedera'
    ],
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
[Date]"

═══════════════════════════════════════════════════════════════════════════════
OCCUPIER'S LIABILITY & FALLING OBJECTS (aircon falls off 18th floor, tiles dropping, etc.)
═══════════════════════════════════════════════════════════════════════════════
LEGAL FRAMEWORK:
- No standalone Occupiers' Liability Act in Malaysia. Liability flows from common law (Indermaur v Dames line as adopted) and tortious negligence principles.
- Strata Titles Act 1985 s.72 / Strata Management Act 2013 — owner's duty regarding building structure and common property.
- Civil Law Act 1956 s.7 (Fatal Accidents) + s.8 (Survival of Actions) — claim routes if injury or death caused.
- Building & Common Property (Maintenance & Management) Act 2007 (partially superseded by SMA 2013).

WHO PAYS WHEN AN AIRCON FALLS OFF THE 18th-FLOOR WINDOW LEDGE AND INJURES SOMEONE?
Exposure chain (any or all may be sued — tenant's installation does NOT shield landlord):
1. THE INSTALLER (tenant's contractor, if ID'd) — primary negligence. Check for CIDB registration / contractor insurance. Often insolvent / uninsurable.
2. THE TENANT (who installed without landlord consent) — breach of tenancy clause + negligent installation. Check tenant's contents/liability insurance.
3. THE LANDLORD (registered owner of the unit) — occupier's liability if in CONTROL of structure. Courts use a control test. Tenant in possession usually = tenant in control; BUT the FACADE / EXTERIOR / window ledge is often treated as part of structure → landlord retained duty.
4. THE MANAGEMENT CORPORATION / JMB (if strata) — duty over common property including external facade under SMA s.59(1)(b). Compressors hanging on facade are often in the grey zone.
5. THE DEVELOPER (if building still in DLP period) — defective design / no retention clip mandate.

KEY JUDICIAL REASONING:
- "Res ipsa loquitur" — an aircon does not fall unless someone was negligent. Burden shifts to defendants to prove they were not.
- Landlord cannot rely solely on "tenant installed it without telling me" — the landlord's inspection duty (every 6-12 months) is standard practice. Failure to inspect = breach.
- Leases often have clauses requiring tenant consent for fixtures — but this is a CONTRACTUAL right between landlord and tenant; it does NOT bind the injured third party below.

VICTIM'S CLAIM:
- Personal injury damages (medical, loss of earnings, pain & suffering, future care). Typical range RM50,000-RM2,000,000 depending on severity.
- If death: Fatal Accidents dependency claim under Civil Law Act s.7 — RM100,000-RM1.5m range.
- Claimant usually sues everyone ("shotgun pleading") → defendants fight between themselves.
- Limitation: 6 years general; 3 years for fatal accidents claim.

LANDLORD'S DEFENCE STRATEGY (after the fact):
1. Joinder / third-party notice against tenant and installer.
2. Rely on tenant's indemnity clause (most leases have one — enforce it).
3. Claim against MC if facade negligence arguable.
4. Notify building insurance (liability rider) immediately — within 48 hours typically.
5. Preserve evidence: photograph remaining bracket, seek CCTV from MC, interview witnesses.
6. Engage forensic engineer — often shifts liability to installer.

LANDLORD'S DEFENCE (preventive — do this NOW):
- Lease clause: "Tenant shall not install, affix, or attach any external fixture without landlord's prior written consent, and shall indemnify landlord against all claims arising from such installations."
- Annual inspection right + exercise it (document photos).
- Require contractor certification for any aircon installation + keep copy.
- Require tenant to obtain Public Liability insurance (RM1m min) with landlord named as additional insured.
- Confirm MC maintenance schedule for external facade includes bracket inspection.

CLAIM OUTCOME MATRIX (typical apportionment):
- Tenant 40% + Installer 30% + Landlord 20% + MC 10% = common split for unauthorised installation with facade factor.
- If landlord inspected + documented: landlord share drops to 0-10%.
- If installation pre-dates current landlord's ownership: still liable as current occupier but can chase previous owner.

INSURANCE INTERACTION:
- Landlord's Public Liability rider (usually RM500k-RM2m) covers third-party injury from the property.
- Tenant's contents/liability insurance usually has RM100k-RM500k PL rider.
- MC's master policy covers common property only — will deny if damage traced to individual unit install.
- Subrogation: insurer pays victim then sues the most negligent party for recovery. See insurance topic.

COMMON-AREA SLIPS, STAIRS, LIFT ACCIDENTS:
- Landlord not generally liable for common-area injuries inside strata — MC's remit.
- Exception: if landlord's tenant caused it (spilled oil, blocked fire escape with goods) → landlord may face claim via tenant control.

CONTRACTOR INJURIES ON-SITE:
- If landlord hires a repair contractor and worker falls: Workmen's Compensation Act 1952 / Social Security Act 1969 (SOCSO) routes. Register as employer (even for small jobs) or confirm contractor has SOCSO + insurance BEFORE hire.
- Employers' Liability under common law if contractor was truly employed (control test).

BEST-PRACTICE ACTION CHECKLIST AFTER AN INJURY INCIDENT:
☐ Victim welfare first — call 999; do NOT admit liability.
☐ Report to police + get report number.
☐ Photograph scene + broken fixture + any brackets/screws.
☐ Obtain CCTV within 24h (MCs often auto-wipe after 72h).
☐ Notify landlord's insurer within 48 hours.
☐ Notify MC (written) if strata.
☐ Do NOT pay victim directly; coordinate via insurer.
☐ Engage defence counsel before responding to any demand letter.
☐ Keep a dedicated incident file for 7 years.`
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
    keywords: ['sublet', 'subletting', 'sewa semula', '转租', 'airbnb', 'short-term', 'jangka pendek', '短租', 'room rent', 'sewa bilik', 'unauthorized occupant', 'penghuni tanpa izin', 'subletter', 'third party', 'boyfriend moved in', 'girlfriend moved in', 'partner moved in', 'moved in without', 'extra occupant', 'penghuni tambahan', 'extra people in unit', 'more people', 'overcrowding', 'lebih penghuni', 'unauthorized guest', 'tetamu tanpa izin', 'permanent guest', 'guest stays', 'stayed too long', 'co-habiting', 'cohabit'],
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
- Residential rental EXEMPT from service tax. Commercial/non-residential rental = 8% from July 2025, REDUCED TO 6% under Budget 2026 effective 1 Jan 2026.

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
    keywords: ['strata', 'condo', 'apartment', 'pangsapuri', '公寓', 'MC', 'JMB', 'management', 'pengurusan', '管理', 'by-law', 'undang-undang kecil', 'sinking fund', 'maintenance', 'penyelenggaraan', '维护费', 'AGM', 'SMT', 'common property', 'harta bersama', 'special levy', 'levi khas', 'en-bloc', 'en bloc', 'enbloc', 'urban renewal', 'URA', 'pembangunan semula', '旧楼重建', 'collective sale', 'jualan kolektif', 'demolish', 'redevelopment', 'bangunan lama', 'new by-law', 'undang-undang kecil baru', '新公寓条例', 'retrospective by-law', 'mid-lease by-law', 'by-law change', 'change by-law', 'sma s.32', 'sta s.70', 'mc ban rental', 'mc banned rental', 'mc larang sewa', '管委会禁止出租', 'smt appeal', 'smt tribunal', 'tribunal strata'],
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
• Owner held out in 79% consent building (just below 80% threshold). Developer restructured compensation, 2 more owners flipped → hit 81%. Original holdout then had to sell at the SAME price he'd rejected. Cost him ~RM80K in legal fees and stress.

RETROSPECTIVE BY-LAW APPLICATION (new by-law mid-lease):
- Legal framework: Strata Titles Act 1985 s.70 + Strata Management Act 2013 s.32 — MC/JMB may make additional by-laws by Special Resolution (>75% of aggregate share units voting in favour at a duly convened General Meeting).
- Statutory by-laws (Third Schedule of SMA 2013) — some are baseline and cannot be contracted out of (e.g., no hazard to common property, no nuisance, parking).
- Additional by-laws — typically registered with the Commissioner of Buildings (COB) within 30 days of passage. Take effect from registration date going forward.

CAN A NEW BY-LAW OVERRIDE MY EXISTING TENANCY?
- General rule: by-laws are STATUTORY and bind all parcels/owners/occupants from registration. A private tenancy cannot contract out of the by-law.
- BUT: by-laws do not generally have RETROSPECTIVE effect on contracts completed before registration. A lease signed before a new by-law remains valid for its term; however, the OWNER is bound to ensure the USE going forward complies with the by-law.
- Conflict example: MC passes a new by-law banning tenancies <1 year. Your 18-month tenancy signed before registration remains valid. You do not need to evict your tenant mid-lease. But if at expiry the tenant wants to renew month-to-month, the new by-law applies — renewal would breach it.
- Conflict example: MC passes "no short-term rental" by-law. Your existing 6-month corporate lease continues, but future short-term bookings are banned.
- If by-law is draconian (e.g., bans ALL subletting outright), owners can challenge at Strata Management Tribunal (SMT) within 6 months of registration on grounds of unreasonableness, ultra vires, or breach of SMA.

OWNER REMEDIES WHEN A NEW BY-LAW HURTS YOUR TENANCY:
1. Attend the SGM where the by-law is proposed. Vote against. Have your written objection minuted.
2. If by-law passes over your objection: file at SMT within 6 months to set aside under SMA s.142 (invalid by-law).
3. Grounds: (i) ultra vires — exceeds MC's power under SMA; (ii) discriminatory — targets specific owner group; (iii) unreasonable — disproportionate restriction; (iv) procedural defect — SGM notice too short, quorum not met, voting irregular.
4. Interim remedy: if imminent harm (lease renewal pending), apply for interim stay at SMT.
5. Civil suit: for damages if by-law caused financial loss (rarely pursued; SMT is usually adequate).

TENANT REMEDIES (existing tenant affected by new by-law):
- Tenancy continues for its term. Tenant is not directly subject to challenge at SMT (only OWNERS have standing).
- Tenant's remedy is against LANDLORD for breach of quiet enjoyment if MC enforcement interferes.
- Landlord then faces downstream liability → so landlord has incentive to contest the by-law at SMT.

TYPICAL RESTRICTIVE BY-LAWS (2024-2026 trend):
- "No short-term rental" (Airbnb ban) — common in KL, Penang, JB.
- "Minimum 6/12-month tenancy" — to push Airbnb out.
- "Maximum 4 occupants per 2-bedroom unit" — anti-co-living.
- "Tenant must be vetted + approved by MC" — very restrictive, challengeable.
- "No foreign tenant without MC clearance" — discrimination, likely invalid.
- "Renovation levy for any work" — often upheld if amount reasonable.

STRATEGIC ADVICE FOR LANDLORDS:
- Monitor MC circulars + AGM notices — don't miss the vote.
- Attend SGM or appoint proxy (proxy form must be in writing, lodged 48hr before).
- Keep digital copy of ALL by-laws current + historical versions for your building.
- Include in future tenancies: "Tenant subject to prevailing strata by-laws as may be amended from time to time" — passes the risk to tenant.
- Include exit clause: "If strata by-law change makes tenancy unlawful, either party may terminate with 30 days' notice + pro-rated refund."`
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
    keywords: ['joint owner', 'joint tenancy', 'bersama', '共同', 'co-owner', 'co-owns', 'coowner', 'pemilik bersama', 'survivorship', 'partition', 'pembahagian', 'inheritance', 'warisan', '继承', 'death', 'kematian', '死亡', 'will', 'wasiat', '遗嘱', 'tenancy in common', 'co-owner refuse', 'pemilik bersama enggan', 'sister refuse sign', 'brother refuse sign', 'one owner block', 'pemilik halang', 'single owner let', 'seorang pemilik sewa', 'partition action', 'tindakan pembahagian', 'nlc 145', 'nlc 140', 'deadlock co-owner', 'pemilik tidak setuju', 'sister own', 'brother own', 'sibling own', 'my share', 'share ownership', '50% share', 'half owner', 'jointly own'],
    content: `JOINT OWNERSHIP:
- Joint tenancy: equal shares, right of survivorship. Owner dies → share auto-goes to surviving owner(s).
- Tenancy in common: distinct shares (can be unequal). Owner dies → share per will / Distribution Act 1958.
- Check type: stated on title deed. "As joint tenants" = JT. Stated shares (e.g. "1/2") = TIC.
- Distribution Act 1958 (non-Muslim intestate): spouse 1/3, children 2/3. No children: spouse 1/2, parents 1/2. Muslims: Faraid.
- Partition: NLC s.145. If can't agree → court order for partition or sale.

CAN ONE CO-OWNER LET THE PROPERTY ALONE?
- Short answer: technically yes, but with limits. A co-owner may deal only with their own share, not the whole property.
- Practical rule: a tenancy of the WHOLE property signed by only one co-owner is voidable at the instance of the non-signing co-owner. If the other co-owner objects, they can (i) apply for injunction, (ii) demand their share of rent, (iii) revoke consent and eject the tenant.
- Safer path: all co-owners sign as joint landlords. If one refuses, the dissenting co-owner's legal remedy is partition, not veto — so you have leverage.
- Rental income from joint property: divided per ownership share. Filing with LHDN: each co-owner declares their share in Form BE/B.
- If one co-owner collects all rent: must account to the others. Refusal = breach of fiduciary duty (co-owner relationship) → civil claim + interest.

DEADLOCK + PARTITION ACTION (NLC s.140 / s.145):
- NLC s.140: Partition by consent — all owners agree, Land Office processes.
- NLC s.145 (Peninsular Malaysia): Partition by court order — any co-owner can apply when consent cannot be obtained.
- Sabah: Land Ordinance (Cap.68) Part V has parallel partition provisions.
- Sarawak: Land Code (Cap.81) also provides partition procedure.
- Court options at partition: (a) physical partition (rare, rarely practical for strata/single building); (b) sale by public auction, proceeds divided per share; (c) one owner buys out the other(s) at a valuer's fair price.
- Timeline: 8-18 months from filing to final order. Legal cost RM15K-60K depending on dispute.
- Court considers: ownership shares, contributions (who paid down payment, who maintained it), occupancy history, availability of alternative accommodation, hardship.

PROPERTY INHERITANCE & DEATH:
- NO inheritance tax (abolished 1991).
- Transfer from deceased: RM10 stamp duty on MOT (not full rates).
- RPGT: transfer to beneficiary = NOT a disposal (no RPGT). When beneficiary later sells: acquisition date = date of death, price = market value at death.
- Small estates (≤RM5M per amended 2022 Act): Land Administrator (faster, cheaper).
- Large estates (>RM5M) or mostly movable: High Court for Grant of Probate/LA.

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
    keywords: [
      'renovate', 'renovation', 'ubahsuai', '装修',
      'reinstate', 'reinstatement', 'pemulihan', 'restore original',
      'renovation consent', 'renovation deposit', 'contractor', 'kontraktor',
      'heritage', 'warisan', '遗产建筑', 'conservation zone', 'kawasan pemuliharaan', 'zon warisan',
      'unesco', 'unesco zone', 'unesco world heritage', '联合国教科文组织', 'world heritage',
      'george town', 'georgetown', 'george-town', 'penang heritage', 'lebuh armenian', 'heritage shophouse',
      'melaka heritage', 'malacca heritage', 'jonker street', 'jonker walk',
      'gpohi', 'george town world heritage incorporated', 'perzim', 'perbadanan muzium melaka',
      'national heritage act', 'akta warisan kebangsaan', 'heritage act 2005', 'act 645',
      'facade', 'fasad', '立面', 'facade approval', 'aircon facade', 'external fixture approval',
      'heritage renovation', 'shophouse renovation', '老店屋装修',
      'category i heritage', 'category ii heritage', 'category 1 heritage', 'category 2 heritage'
    ],
    content: `RENOVATION — general + heritage / conservation zones:

═══════════════════════════════════════════════════════════════════════════════
PART 1 — GENERAL RENOVATION RULES
═══════════════════════════════════════════════════════════════════════════════
- Tenant renovations: ALWAYS get written consent from landlord.
- Reinstatement clause: tenant must restore to original condition unless agreed otherwise.
- If landlord agrees to keep renovations → put it in the tenancy agreement.
- Strata: must comply with by-laws. Structural changes need MC approval + engineer cert.
- Renovation deposit to MC: typically RM500-5,000 (refundable after completion).
- PBT approval (borang A): required for structural changes, new wet area, change of use. Minor cosmetic = no need.
- UBBL 1984 compliance for plumbing, electrical, drainage, fire egress.

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
[Date]"

═══════════════════════════════════════════════════════════════════════════════
PART 2 — HERITAGE / CONSERVATION ZONES (George Town, Melaka, KL Heritage)
═══════════════════════════════════════════════════════════════════════════════
LEGAL FRAMEWORK:
- National Heritage Act 2005 (Act 645) — Commissioner of Heritage has national authority.
- Town and Country Planning Act 1976 (Act 172) — Special Area Plan (SAP) for heritage zones.
- Penang Heritage (Conservation) Enactment + George Town Conservation Guidelines (GTWHI).
- Melaka: Perbadanan Muzium Melaka (PERZIM) + state Heritage Enactment.
- UNESCO Operational Guidelines — binding on Malaysia via World Heritage Convention ratification.

UNESCO CORE & BUFFER ZONES (George Town + Melaka):
- Core Zone: highest protection. Every external change needs permit.
- Buffer Zone: moderate protection. Setback, height, facade rules.
- Outside Zone: normal PBT rules apply.

CATEGORY I vs CATEGORY II BUILDINGS (George Town):
- Cat I (≈2,000 buildings): outstanding universal value. Highest protection. ANY change to facade, roof, signage, colour, height, aircon placement = needs approval. Interior changes also regulated if original features.
- Cat II (≈2,700 buildings): contributing value. External changes regulated; internal changes typically allowed with notice.
- Non-listed: standard PBT rules, still subject to zone-wide height/setback.

WHAT REQUIRES APPROVAL (typical heritage shophouse):
- Facade aircon units, pipes, cables visible externally.
- Signage (material, size, lighting, bilingual format).
- Roof tiles (must match traditional material — often specific supplier).
- Windows and doors (original timber; uPVC usually rejected).
- Colour scheme (heritage palette).
- Partition walls exceeding 40% of original clear span.
- Ceiling height reductions.
- Adding mezzanine.
- Ground-floor trading activity change.
- Even "temporary" scaffolding needs notice.

WHAT IS GENERALLY ALLOWED WITHOUT APPROVAL:
- Like-for-like repairs to non-original elements.
- Internal furnishings / paint that doesn't affect original features.
- Pest treatment.
- Services upgrade that remains concealed behind existing elements.

APPLICATION PROCESS (George Town example):
1. Preliminary consultation with GTWHI / MBPP Heritage Unit (free, recommended).
2. Formal submission: Heritage Impact Assessment (HIA) by a gazetted conservation architect. RM5,000-RM30,000 depending on scope.
3. Drawings: existing + proposed + materials + conservation methodology.
4. MBPP Heritage Committee review — monthly meeting.
5. Outcome: Approve / Approve with Conditions / Reject / Further-Information.
6. Permit fee: RM100-RM5,000 depending on scale.
7. Timeline: 2-6 months typical.

APPEAL ROUTE IF REJECTED:
- Written appeal to State Heritage Committee within 30 days.
- Escalation to Heritage Appeals Tribunal (federal) under Act 645.
- Judicial review for procedural unfairness.

COMMON ENFORCEMENT ACTIONS:
- Stop Work Order (Notis Berhenti Kerja).
- Compound fine RM500-RM50,000 per offence.
- Mandatory restoration at owner's cost (often exceeds original works).
- Criminal prosecution under Act 645 s.114-115: up to RM50,000 / 1 year / both.
- Severe cases: Ministerial demolition order of unapproved works.

REAL CASES — HERITAGE:
• George Town 2019: shophouse owner installed 5 facade aircons without permit. MBPP issued compound RM10,000 + mandatory removal. Owner appealed; settled at RM6,000 + relocate compressors to internal air well.
• Melaka 2022: Jonker Walk cafe replaced original timber shopfront with glazed panel for AC efficiency. PERZIM ordered full restoration (RM32,000) — original pigeonhole grille had to be custom-made.
• Penang 2024: owner converted heritage shophouse into boutique hotel with mezzanine + rooftop deck. Secured approval through proper HIA process, 8-month timeline, RM18,000 fees. Property value post-conversion rose 140% — illustrates that heritage compliance is an asset, not a liability.

PRACTICAL TIPS FOR OWNERS/TENANTS:
1. Before signing any heritage shophouse lease, check category + zone via MBPP One-Stop heritage counter.
2. If you need aircon: consider split-unit with compressors in internal air-well (approved precedent). Visible facade compressors rarely approved.
3. Use a gazetted conservation architect from day 1 — they know which materials/suppliers pass.
4. Keep all heritage approvals with your deed — adds resale value.
5. Insurance: get a Heritage/Restoration rider — sum insured should reflect bespoke reconstruction cost (2-4x modern build cost).
6. Tax: Adaptive Reuse incentive (see tax topic) often applies to heritage restoration + conversion — can offset 60-70% of renovation cost over 5 years.

APPLY / VERIFY HERE:
- George Town World Heritage Inc (GTWHI): gtwhi.com.my | +60 4-261 6606
- MBPP Heritage: mbpp.gov.my → Heritage Conservation
- PERZIM Melaka: perzim.gov.my
- National Heritage Dept (JWN): heritage.gov.my
- Malaysian Institute of Architects (PAM) heritage chapter: pam.org.my`
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
- Service tax on commercial/non-residential rental: 8% from July 2025, REDUCED TO 6% from 1 Jan 2026 under Budget 2026. Applies to offices, retail, warehouses, factories, industrial premises. Residential rental remains EXEMPT.

SST TRANSITIONAL INVOICES (Budget 2026 rate change):
- Invoice issued BEFORE 1 Jan 2026 at 8%, payment received AFTER 1 Jan 2026 → still 8% (rate locked to invoice date under SST Regulations 2018).
- Invoice issued AFTER 1 Jan 2026 → 6% regardless of service period.
- Rental billed in ADVANCE for multiple months spanning the rate change: issue credit note for the post-Jan-2026 portion at 8% and reissue at 6%. Net refund = 2% × post-change rent.
- Example: Annual rent RM120,000 billed Dec 2025 at 8% = RM9,600 SST. 11 months fall in 2026 (RM110,000 @ 2% diff = RM2,200 credit note to tenant).
- Tenants on full-year prepaid leases are OWED the 2% refund. Landlord who pockets it = non-compliance with Royal Malaysian Customs (RMCD) risk.
- Fix procedure: (1) issue credit note citing "Rate adjustment — Budget 2026 s.11 Service Tax Act 2018", (2) refund to tenant OR offset next invoice, (3) amend SST-02 return for the affected period, (4) keep paper trail (tenant's signed acknowledgment of rate change).
- RMCD grace period: 3 months from 1 Jan 2026 to reissue corrected invoices without penalty. After 31 Mar 2026, mis-application of rate = RM500-RM50,000 fine per invoice.

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
      'employment pass', 'professional visit pass', 'student pass', 'dependant pass',
      'unhcr', 'refugee', 'pelarian', '难民', 'rohingya', 'asylum', 'asylum seeker', 'pencari suaka', 'stateless', 'tanpa kewarganegaraan', 'refugee card', 'kad unhcr'
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

UNHCR REFUGEES / ASYLUM-SEEKERS (Rohingya, Myanmar, Somali, etc.):
- Malaysia is NOT a signatory to the 1951 Refugee Convention or its 1967 Protocol. Technically, under Immigration Act 1959/63, UNHCR cardholders are still "undocumented" in domestic law.
- BUT: MOHA (Ministry of Home Affairs) operates a de facto tolerance policy. Since the 2019 MOHA circular and subsequent enforcement guidelines, UNHCR cardholders are generally not subject to immediate detention for mere presence, though they lack formal work permits.
- As of 2026: no law SPECIFICALLY authorises landlords to rent to UNHCR cardholders, and no law specifically prohibits it. Grey zone.

PRACTICAL LANDLORD POSITION (renting to UNHCR cardholders):
- You can rent, but you accept elevated risk. Prosecution under s.55E (harbouring) is theoretically possible though rare for UNHCR cardholders.
- DO: verify UNHCR card (look for holographic seal, QR code, expiry date; call UNHCR MY office: +603-2118 4800 to verify if in doubt).
- DO: document the tenant's status clearly (photocopy of card + declaration that "tenant holds UNHCR cardholder status pending formal resettlement").
- DO: include a termination clause tied to any change in Malaysian government policy.
- DO: charge market rent, take deposit, issue stamped tenancy agreement — same as any other tenant.
- DON'T: cluster-house (5+ cardholders in one unit) — attracts raid risk + fire safety red flag.
- DON'T: take cash-only off-books — looks like exploitation + breaks AMLA trail.
- DON'T: rent units that lack basic safety (no smoke detector, unauthorised sub-divided rooms) — UBBL + Bomba exposure compounds.

SUBLETTING TO UNHCR CARDHOLDERS (where tenant sublets to refugees):
- This is YOUR risk escalated: you are the registered owner, so summons/raids involve you.
- Standard tenancy has "no subletting without consent" — enforce it strictly.
- If your tenant sublets to 5+ UNHCR cardholders secretly (HMO-style co-living), you face: (i) breach of your tenancy clause, (ii) PBT change-of-use summons (residential to boarding house), (iii) Bomba fire safety compound, (iv) s.55E harbouring by association.
- Remedy: immediate breach notice, serve termination, involve PBT for inspection if unsure, coordinate with UNHCR MY (they may help rehouse cardholders) to avoid humanitarian crisis.

LANDLORD EMPATHY + LEGAL FLOOR:
- Many UNHCR cardholders are families fleeing persecution. Courts and media are sympathetic to landlords who handled transitions humanely.
- If you discover refugees subletting and it's otherwise orderly → formalise the arrangement (bring it into your direct tenancy, inspect, stamp) rather than evicting abruptly.
- If arrangement is chaotic/unsafe → document everything, terminate the tenant who broke the clause, coordinate with refugee welfare NGOs (e.g., Tenaganita, Suaram, UNHCR MY) to transition residents safely.

STAY-INFORMED CHECKPOINTS:
- UNHCR Malaysia: unhcr.org/en/where-we-work/asia-and-pacific/malaysia
- MOHA refugee policy updates: moha.gov.my
- Parliamentary bills watch: parlimen.gov.my for any Refugee Act (discussed 2024-2025 but not yet tabled).

VERIFY HERE:
- Jabatan Imigresen Malaysia: imi.gov.my
- MyImmi mobile app (Android/iOS): visa/passport scanning
- eJim portal: ejim.imi.gov.my
- MM2H: my2h.gov.my
- De Rantau: mdec.my/derantau
- Employer immigration verification: esd.imi.gov.my
- Reporting hotline: 03-8880 1000 (Ibu Pejabat Imigresen)
- UNHCR Malaysia: unhcr.org/en/where-we-work/asia-and-pacific/malaysia | +603-2118 4800`
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
      'sst tourism', 'tourism tax', 'cukai pelancongan',
      'mco airbnb', 'pkp airbnb', 'lockdown airbnb', 'mco str', 'pkp str',
      'airbnb fine', 'pbt fine airbnb', 'pbt compound airbnb', 'kompaun airbnb', 'airbnb denda', '爱彼迎罚款',
      'airbnb retrospective', 'appeal airbnb fine', 'rayuan kompaun', 'appeal compound', 'old airbnb fine',
      'hosting during mco', 'hosted during mco', 'mco 2021 fine', 'airbnb 2021 fine'
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
4. Service Tax registration (LHDN) if gross receipts exceed RM500K/year — 8% service tax on accommodation since 2024 (Group A, Service Tax Act 2018). Note: Budget 2026's 8%→6% cut applies to Group I NON-RESIDENTIAL LEASING (offices, warehouses). Accommodation/STR stays at 8% unless further RMCD notice — verify before pricing.
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
- Service tax 8% on accommodation (Group A) — must register if gross ≥RM500K/year. Budget 2026's rate cut to 6% does NOT apply to accommodation; only non-residential leasing (Group I).
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
• Shah Alam landlord signed 6-month corporate lease with MNC HR for Chinese manufacturing consultant. Rent RM6,500/month vs RM3,800 normal long-term. Company paid via invoice with 6% service tax (Budget 2026 rate, Group I leasing). Landlord registered as sole prop with SSM to claim deductions → saved ~RM4,500 in net tax.
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

  einvoice: {
    keywords: [
      'e-invoice', 'einvoice', 'e invoice', 'e-invoicing', 'einvoicing',
      'myinvois', 'my invois', 'invois', 'lhdn invoice', 'validated invoice',
      'e-invois', 'e invois', 'invois elektronik',
      '电子发票', '发票系统', '税务发票', 'lhdn e-invoice',
      'consolidated invoice', 'self-billed', 'self billed', 'tin invoice',
      'peppol', 'api invoice', 'rental invoice', 'invoice tenant', 'invoice penyewa',
      'tax invoice', 'cukai invois', 'invoice deduction', 'tenant tax deduction',
      'july 2026', 'july 1 2026', '1 july 2026', 'mandatory e-invoice'
    ],
    content: `E-INVOICING (LHDN MyInvois) — LANDLORD COMPLIANCE 2026:
Malaysia's mandatory e-invoicing rollout under Income Tax Act 1967 s.82C. All rental income invoices must eventually be submitted through MyInvois for LHDN validation.

PHASED ROLLOUT TIMELINE:
- Phase 1 (1 Aug 2024): Businesses turnover >RM100M/year
- Phase 2 (1 Jan 2025): Turnover RM25M–RM100M
- Phase 3 (1 Jul 2025): Turnover RM500K–RM25M
- Phase 4 (1 Jul 2026): ALL remaining businesses including turnover <RM1M ← LANDLORDS LAND HERE
- Micro-businesses <RM150K annual rental may get temporary exemption (confirm with LHDN public ruling; not final as of drafting).

WHEN RENTAL INCOME TRIGGERS E-INVOICE OBLIGATION:
- S4(a) business income (active management of multiple units, services provided): FULL e-invoice obligation from 1 Jul 2026.
- S4(d) passive rental (1-2 units, arms-length tenancy): still required to issue e-invoice when tenant demands it (e.g., corporate tenant needing tax deduction).
- Sdn Bhd structure: e-invoicing already applies based on turnover tier — not postponable.
- Sole proprietor landlord with SSM registration: follows turnover tier same as any business.
- Accidental landlords (individual owns 1 residential unit, no SSM): tenant can submit a SELF-BILLED e-invoice on landlord's behalf if landlord refuses/unable. Landlord still needs a TIN.

WHAT'S IN A VALID E-INVOICE (key fields, ~55 total):
1. Supplier (landlord): Name, TIN, SSM/IC No, Address, Contact, SST No (if registered)
2. Buyer (tenant): Name, TIN, IC/SSM, Address
3. Invoice: Unique Invoice No, Date, Reference Period
4. Line Item: "Rental of [property address], period [MM/YYYY]", Classification Code (023 = Rental Services), Unit Price, Quantity, Subtotal
5. Tax: SST rate (0% residential, 6% non-residential from Jan 2026), Tax Amount, Total Payable (with/without tax)
6. Currency: MYR (default) or foreign if cross-border
7. Digital signature: generated on LHDN validation → Unique Identifier Number (UIN) + QR Code returned
8. PDF or XML output: both acceptable; XML required for API submission

3 WAYS TO SUBMIT:
A. MyInvois Portal (manual): login to mytax.hasil.gov.my → MyInvois tab → fill form → validate → download. Free. Suitable for <20 invoices/month.
B. API Integration: direct integration to MyInvois API. Requires middleware (Peppol AP, SAP, Xero, QuickBooks with MyInvois plugin). Suitable for landlords with accounting software.
C. Third-party e-invoice provider: Bukku, Financio, AutoCount, etc. Monthly fee ~RM30-150. Handles validation + archiving.

CONSOLIDATED vs INDIVIDUAL E-INVOICES:
- For B2C (tenant = individual, not demanding invoice): landlord may issue ONE consolidated e-invoice per month summarizing all B2C rentals. Submitted by 7th of following month.
- For B2B (tenant = company needing tax deduction): MUST issue individual e-invoice per transaction, within 72 hours of payment received.
- Corporate tenants will REFUSE to pay until valid e-invoice received — it's the only way they claim the rent as a business expense.

TENANT PRESSURE IS REAL:
- MNCs, factories, offices: their auditors reject any non-e-invoice expense claim from 1 Jul 2026.
- Landlord who can't issue e-invoice = tenant loses tax deduction = tenant demands rent reduction OR switches to compliant landlord.
- Chinese tenants especially: Chinese companies with MY branches need Malaysian-side e-invoice to reconcile with PRC transfer pricing rules.

SELF-BILLED E-INVOICE (tenant-issued, landlord lazy):
- If landlord has TIN but won't set up MyInvois: tenant can issue e-invoice ON BEHALF OF landlord, flagged as "Self-Billed."
- LHDN still treats it as landlord's income — landlord reports in annual tax filing.
- Landlord loses control over invoice content. Usually tenant dictates SST rate, description, amount.
- Risk: tenant may misclassify or under-report — landlord legally responsible either way.

PENALTIES (Income Tax Act s.120(1)(g) + MyInvois Guidelines):
- Failure to issue e-invoice on time: RM200–RM20,000 fine OR imprisonment up to 6 months OR both.
- Per invoice violation. A landlord with 20 non-compliant monthly rent invoices = 20 separate offenses.
- LHDN has discretion to compound — typically RM500-RM2,000 first offense if voluntary disclosure.
- Soft-landing grace period for Phase 4: 6 months from 1 Jul 2026 to 31 Dec 2026 — late/missing invoices logged but not penalized if corrected.

SST + E-INVOICE INTEGRATION:
- Non-residential commercial lease invoices: SST line item at 6% (Budget 2026) must appear on the e-invoice with correct Tax Type Code (01 for Service Tax).
- Residential: SST line shows "0% — Exempt Services (Residential Accommodation)".
- Mis-declaring SST on e-invoice = double hit (SST penalty + e-invoice violation).

REAL CASES — MyInvois:
• KL office landlord with 6 tenants (all B2B) migrated to AutoCount + MyInvois plug-in in April 2026 ahead of July deadline. RM90/month subscription. Now issues e-invoice in 30 seconds per tenant. Tenants all renewed leases — landlord is "audit-ready," major selling point.
• Individual landlord in Penang refused to set up MyInvois for her one commercial shophouse (RM3,500/month rent). Corporate tenant (a logistics SME) switched to a compliant landlord next door at lease expiry. Vacancy: 4 months. Lost rent: RM14,000.
• SME landlord missed July 2026 deadline entirely. LHDN audit Q3 2026 found 9 non-compliant invoices. Compounded RM1,200/invoice = RM10,800. Had to back-issue via MyInvois + pay fines.
• Shah Alam factory landlord had tenant auto-generate self-billed e-invoices. Tenant under-reported SST (declared residential rate by error). LHDN back-assessed landlord RM18,000 in under-collected SST + 100% penalty. Landlord's appeal failed — you own the reporting either way.

QUICK-START CHECKLIST (landlords, 2026):
□ 1. Get TIN from LHDN (mytax.hasil.gov.my) if you don't have one
□ 2. Decide submission method: Portal (free, manual) or API/3rd-party (paid, automated)
□ 3. Collect tenant TINs — tenants MUST provide (corporate tenants have theirs; individuals register via MyTax)
□ 4. Template your invoice: property address, SST rate, classification code (023 rental services)
□ 5. Test one invoice through MyInvois before go-live — validation takes 2-72 hours
□ 6. Archive all validated e-invoices for 7 years (LHDN audit requirement)
□ 7. If multiple properties: label each with Unique Property Reference — easier for tax filing

VERIFY HERE:
- MyInvois portal: mytax.hasil.gov.my → MyInvois
- e-invoice guidelines: hasil.gov.my/en/e-invoice/
- Classification codes: LHDN e-invoice classification list (023 Rental Services)
- Service provider directory: myinvois.hasil.gov.my/resources`
  },

  adaptive_reuse: {
    keywords: [
      'adaptive reuse', 'adaptive-reuse', 'reuse tax', 'renovation tax deduction', 'renovation incentive',
      'guna semula', 'penyesuaian semula', 'pengubahsuaian',
      '适应性改造', '旧楼改造', '改造税务减免', '翻新税收优惠',
      'budget 2026 renovation', 'belanjawan renovation', 'tax break renovation',
      'warehouse conversion', 'office conversion', 'factory conversion', 'data centre conversion',
      'mixed use conversion', 'tech hub', 'logistics hub', 'co-living conversion',
      'capital allowance renovation', 'capital allowance 10%', 'rm10 million cap',
      'underutilized space', 'ruang tidak digunakan', 'empty floor', 'dead floor'
    ],
    content: `ADAPTIVE REUSE TAX INCENTIVE (Budget 2026):

THE INCENTIVE:
- 10% tax deduction on qualifying adaptive reuse expenditure, capped at RM10 million per project.
- Claimed against rental/business income derived from the redeveloped space.
- Introduced in Budget 2026 to unlock dead commercial/industrial stock.
- Legal basis: Budget 2026 Finance Act amendments (gazette pending — verify exact section before claim).
- Available for qualifying spend between 1 Jan 2026 and 31 Dec 2030 (5-year window).

QUALIFYING CATEGORIES (per Budget 2026 announcement):
1. Warehouse → tech hub / data centre / co-working
2. Office floor → co-living / serviced apartment / education centre
3. Retail floor → F&B incubator / community space
4. Factory → logistics hub / cold chain / fulfilment centre
5. Heritage shophouse → boutique hotel / retail + residential mixed-use
6. Abandoned mall / strata retail → mixed-use residential conversion
(Pure like-for-like refurbishment = NOT eligible. Must change use class or significantly upgrade utility.)

QUALIFYING EXPENDITURE:
- Structural alteration (wall removal, load-bearing changes, floor reinforcement)
- M&E upgrade (HVAC for cold storage, power density increase for data centre, added sanitary capacity for co-living)
- Fire safety + Bomba compliance upgrade required by new use
- Accessibility (ramps, lifts, universal design)
- Architect + QS professional fees (up to 5% of construction value)
- NOT qualifying: land purchase, refinancing costs, standard maintenance, furniture, branding/marketing, soft furnishings.

HOW TO CLAIM:
1. Project planning phase:
   - Engage architect to certify project as "adaptive reuse" (change of use class per Uniform Building By-Laws 1984 or equivalent state-level by-laws)
   - Obtain PBT approval for change of use (plans submission, CFO amendment)
   - Get pre-claim ruling from LHDN if project >RM5M — reduces audit risk later
2. During construction:
   - Maintain separate cost code for qualifying vs non-qualifying spend
   - Keep all contractor invoices, bank transfers, QS progress certificates
   - Quarterly QS cost report — LHDN expects contemporaneous documentation
3. Year of claim:
   - File via Form C (Sdn Bhd) or Form B (individual with business income)
   - Attach: architect's adaptive-reuse certification, QS final account, PBT change-of-use approval, itemized expenditure schedule
   - 10% deduction applied against taxable income from the redeveloped property
   - Unused deduction can be carried forward to subsequent YAs (subject to standard carry-forward rules under ITA s.44(5))

STACKING WITH OTHER INCENTIVES:
- Capital allowance (20% initial + 10% annual on plant/machinery): CAN stack — apply CA on qualifying equipment, adaptive-reuse deduction on the building works. Do not double-claim the same cost.
- Industrial Building Allowance (IBA, 10% initial + 3% annual): CAN stack for IBA-qualifying buildings.
- MIDA pioneer status / investment tax allowance: if project qualifies for MIDA incentive, adaptive-reuse deduction may be ADDITIONAL — claim both. MIDA application should be made BEFORE construction starts.
- Green Building Index (GBI) / LEED: if project achieves GBI certification, additional Green Investment Tax Allowance may apply.

EXAMPLE MATH:
Landlord converts RM8M industrial warehouse in Shah Alam to mini data-centre / logistics hub. Qualifying spend: RM6M (structural + M&E + QS fees).
- Adaptive-reuse deduction: 10% × RM6M = RM600,000 deduction against YA2027 rental income.
- Rental uplift: RM25K/month → RM55K/month (RM360K/year uplift).
- Additional tax saving (at 24% corporate rate): RM600,000 × 24% = RM144,000.
- Payback on the deduction alone: RM144K tax saved against the deduction structure. Plus the rent uplift compounds.

WARNINGS (TAX TOPIC CORRECTION):
- Our standard 'tax' topic rule that "capital improvements = NOT deductible" applies to PURE CAPITAL IMPROVEMENT on standing assets.
- Adaptive reuse projects from 2026 onward get a SPECIAL 10% deduction — this is ADDITIONAL to and does NOT replace capital allowances on qualifying plant/equipment.
- Don't tell a client "not deductible" if their spend might fall within adaptive reuse — ALWAYS check the use-class change test first.

COMMON TRAPS:
- Calling "cosmetic renovation" adaptive reuse. LHDN + PBT require genuine change of use class (e.g., B1 industrial → B3 data centre). Refurbishing the same office = not eligible.
- Claiming on land or purchase cost. The incentive is on construction/alteration expenditure only.
- Missing the PBT change-of-use approval. Without it, LHDN disallows the deduction as "unapproved conversion."
- Not keeping QS progress certificates. LHDN audit = you produce contemporaneous evidence or lose the claim.
- Exceeding RM10M cap on one project. Split into phases — each phase with own approval + certification — may unlock multiple caps (technical, verify with tax advisor).

REAL CASES:
• Klang warehouse owner converted 12,000 sqft warehouse to mini data centre for a Singapore tech tenant. Qualifying spend RM4.2M. Claimed 10% = RM420K deduction. Rental up from RM38K to RM92K/month.
• Ipoh shophouse landlord converted upper floors to boutique stay (6 rooms). Total spend RM950K. Claimed 10% = RM95K deduction plus accommodation SST registration. Occupancy 70% in year 1.
• PJ landlord tried to claim "painting + new pantry" as adaptive reuse. LHDN rejected — no use-class change. Claim reversed, paid back RM15K in over-claimed deductions.
• Penang heritage owner restored 3 pre-war shophouses into mixed retail + loft-residential. Qualifying spend RM3.2M across 3 units. Got GBI silver + state heritage grant STACKED with adaptive-reuse deduction. Total tax+grant benefit: RM760K+.

STRATEGIC QUESTIONS TO ASK:
- Is my property currently UNDERUTILIZED (occupancy <60%, rental below area benchmark)?
- Would change of use unlock higher-yielding tenants (data centre, co-living, cold storage)?
- Do I have capital (or access to financing) to fund RM500K–RM10M project?
- Can I get PBT change-of-use approval (zoning, density, parking)?
- Is the 5-year window enough time for payback? (Usually yes if rental uplift >40%.)

VERIFY HERE:
- Budget 2026 gazette: mof.gov.my (look for Finance Act 2026, Capital Allowance / Special Deduction sections)
- LHDN public ruling on adaptive reuse: hasil.gov.my (check for 2026/2027 PR series)
- MIDA incentive overlay: mida.gov.my (for pioneer status / ITA application)
- PBT change-of-use process: your local council's planning department`
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

  tenant_death: {
    keywords: [
      'tenant died', 'tenant death', 'penyewa meninggal', 'penyewa mati', '租客死亡', '租客过世',
      'died in', 'meninggal dalam', '死在', 'found dead', 'dijumpai mati',
      'body found', 'mayat', '尸体', 'deceased tenant', 'penyewa yang telah meninggal',
      'biohazard', 'cleaning blood', 'pembersihan mayat', '生物危害清理',
      'next of kin', 'waris', '亲属', 'estate claim', 'tuntutan pusaka',
      'amanah raya', 'arb', 'harta pusaka kecil', 'small estate',
      'probate tenant', 'death cert tenant', 'sijil kematian penyewa',
      'suicide in rental', 'unattended death', 'kematian tanpa saksi'
    ],
    content: `TENANT DEATH IN PROPERTY (life event — high legal + emotional stakes):

IMMEDIATE ACTIONS (first 24-48 hours):
1. Do NOT enter the unit alone. Call police (999) if you discover the body or suspect a death. Police Act 1967 s.29 requires sudden-death investigation by PDRM.
2. Preserve the scene until police release it (can be 6 hours to 3 days). Take nothing.
3. Note date/time you called, the IO (investigating officer) name, and get the police report number — you will need it for insurance, deposit, estate, and Bomba if there was fire/decomposition.
4. Do NOT clean. Biohazard cleaning is a regulated activity — appoint a licensed biohazard/trauma cleaner (Department of Environment DOE schedule waste if body was decomposed >48 hours). Typical cost: RM3,000 – RM15,000 depending on condition. Keep receipts — claimable against deposit or insurance.
5. Take dated photos of the unit before and after cleaning for Section 90A digital evidence (court-admissible).

TENANCY STATUS AFTER DEATH:
- Tenancy does NOT automatically terminate. Under Contracts Act 1950, the tenant's obligations pass to their estate (the deceased's legal heirs).
- Estate becomes the tenant. Rent continues to accrue until tenancy is lawfully terminated.
- BUT — if tenancy agreement has a "death of tenant" clause (rare in MY standard tenancies), follow that clause.
- Practical: serve a 14-day notice to next-of-kin (if known) giving them the option to surrender or continue. If they surrender, do a formal handover with inventory.

WHO DO YOU DEAL WITH (estate hierarchy):
1. If deceased left a WILL → executor named in will applies for Grant of Probate (High Court if estate > RM5M, Small Estates Distribution Unit at Land Office if ≤ RM5M).
2. If NO WILL (intestate) → next-of-kin applies for Letters of Administration under Probate & Administration Act 1959 / Distribution Act 1958.
3. If estate < RM5M AND mostly immovable property → Small Estates (Distribution) Act 1955 (amended 2022 to raise ceiling to RM5M) → Land Office has jurisdiction. Faster + cheaper than High Court.
4. If no one comes forward → Amanah Raya Berhad (ARB, 1-300-88-6863, amanahraya.com.my) can be appointed administrator. ARB may also handle small estates at landlord's request.
5. Muslim estates → Faraid distribution applies. Syariah Court may be involved for probate (Sijil Faraid issued).

DEPOSIT RETURN:
- Deposit belongs to the estate (not family unless properly probated). Don't pay to "whoever shows up."
- Valid recipients: executor (with Grant of Probate), administrator (with Letters of Administration), or Amanah Raya with Letter of Administration.
- If estate is tiny (deposit < RM10K, no grant obtained), practical path: get the spouse/children to sign a declaration (surat akuan berkanun) confirming they are next-of-kin and releasing you from further claim. Not legally airtight but industry practice.
- Deduct: unpaid rent up to surrender date, biohazard cleaning, any damage proved with photos.
- HOLD any residual deposit for at least 6 months before disbursing if estate is unclear — someone else may come forward with probate.

BELONGINGS INSIDE UNIT:
- Do NOT throw away. Belongings are part of the estate and disposing of them = tort of conversion (you pay damages).
- Serve formal 14-day notice under Distress Act 1951 to estate/next-of-kin demanding collection.
- If no collection after notice → inventory with witness (ideally bailiff via court), photograph each item, store for another 30 days, then dispose/auction per Distress Act procedure.
- If the deceased was a hoarder or had sentimental items, over-communicate with family before disposal. Courts take a dim view of brutal efficiency here.

INSURANCE IMPLICATIONS:
- Landlord building/fire policy usually EXCLUDES death-in-property (suicide, unattended death). Check "suicide clause" + "biohazard cleanup" endorsement.
- Some policies cover biohazard cleaning up to RM10K-20K. Submit claim within 7 days.
- Tenant's life/contents insurance (if any) may pay family — not your concern.
- If tenant was murdered or death was violent, your insurer may subrogate against the perpetrator.

RE-LETTING / VALUE IMPACT:
- No statutory disclosure obligation in Malaysia (unlike California's "death in home" rule) — but Section 17 Sale of Goods Act 1957 fair-dealing applies. Agents advise disclosure to next tenant to avoid post-contract complaints.
- "Stigmatized property" — Asian markets often see 10-30% rental discount for 6-18 months after reported death. Feng shui blessing / religious ceremony (tahlil, puja, 超渡) is commonly done before re-letting.
- Photograph the full cleaned-out unit and get a certificate from the biohazard cleaner stating property is decontaminated.

EMOTIONAL + PRACTICAL NOTES:
- Be human to the family. They're grieving. Don't demand rent the day after the funeral.
- Keep a log of every call, message, and payment for the estate proceeding — Small Estates hearings can drag 12-18 months.
- Consider waiving last month's rent as goodwill; it often buys peace and protects reputation.

COMMON TRAPS:
- Throwing belongings out = tort of conversion. Courts have awarded RM20K+ damages.
- Paying deposit to "spouse" who turns out not to be legally married / not next-of-kin → you pay twice.
- Re-letting before biohazard certificate = future tenant's illness claim could stick to you (occupier's liability).
- Using personal cleaners for decomposed body = DOE scheduled waste violation (RM500K fine max) + health risk.

TEMPLATES TO PREPARE:
- Notice to Next-of-Kin (14-day collection / tenancy decision)
- Deposit Release + Indemnity Letter (for family signing in estate < RM10K)
- Letter to Amanah Raya requesting administration (estate mostly unclaimed)
- Disclosure addendum for next tenant (optional but recommended)

APPLY / VERIFY HERE:
- Amanah Raya Berhad: amanahraya.com.my or 1-300-88-6863
- Small Estates Distribution Unit: your State Land Office (Pejabat Tanah Daerah)
- Probate Registrar: High Court Civil Division
- Biohazard cleaners (DOE-licensed): google "trauma cleaning Malaysia" or ask your insurer`
  },

  criminal_activity: {
    keywords: [
      'drugs', 'dadah', '毒品', 'drug raid', 'serbuan', '扫毒',
      'pdrm raid', 'police raid', 'serbuan polis', '警察突击',
      'illegal business', 'perniagaan haram', '非法生意',
      'massage parlor', 'rumah urut', '按摩院', 'brothel', 'prostitution', 'pelacuran',
      'gambling den', 'sarang judi', '赌场', 'illegal gambling',
      'ddа', 'dangerous drugs', 'akta dadah berbahaya', 'forfeiture', 'rampasan harta',
      'section 39b', 's.39b', 's39b', 'seksyen 39b',
      'criminal tenant', 'tenant arrested', 'penyewa ditahan', '租客被捕',
      'crime scene', 'tempat kejadian', '犯罪现场', 'unlawful activity'
    ],
    content: `CRIMINAL ACTIVITY IN YOUR RENTAL (drugs, illegal business, police raid):

IMMEDIATE ACTIONS ON POLICE RAID / ARREST:
1. Cooperate fully. Provide tenancy agreement, tenant's IC/passport copy, deposit receipt, any screening records.
2. Get the police report number + IO contact. You may be called as witness (saksi) — not suspect (tertuduh) — if you had no knowledge.
3. Photograph everything BEFORE police remove items (Section 90A evidence — may be needed if forfeiture is later contested).
4. Consult a criminal lawyer WITHIN 48 HOURS if drugs are involved. Even as witness, your statement binds you under Evidence Act s.18.
5. Do NOT re-let immediately. Police may retain premises as "scheduled crime scene" — ask for written release.

DANGEROUS DRUGS ACT 1952 (DDA) — PROPERTY FORFEITURE RISK:
- DDA s.39B: trafficking (possession above threshold quantities = death penalty pre-2023, now life imprisonment + whipping).
- DDA s.2 + s.39C: ANY premises used for drug activity can be forfeited to the State — including your property — even if the landlord is not charged.
- This is a PROPERTY forfeiture, not a personal criminal charge. Standard of proof = balance of probabilities (civil standard), NOT beyond reasonable doubt.
- Attorney General applies via High Court for forfeiture order. Public Prosecutor's office.

LANDLORD DEFENCE — DDA s.40A "INNOCENT OWNER" DEFENCE:
To save your property from forfeiture, you must prove ALL of the following:
1. You had NO KNOWLEDGE that the property was used for drug activity.
2. You exercised REASONABLE DILIGENCE in selecting and supervising the tenant.
3. You did not consent to or connive in the activity.

Evidence that builds your "reasonable diligence":
- Tenant screening records (IC verification, employment letter, CTOS/CCRIS with consent, referee checks).
- Written tenancy agreement with "no illegal activity" clause + right-to-enter-with-notice clause.
- Periodic inspection records (quarterly walk-through, dated photos, signed inspection receipts).
- Prompt response to any neighbour complaint or red flag (documented).
- Use of licensed real estate agent (REN/PEA) — shifts some duty.

WARNING: Section 40A cases have gone BOTH ways. Landlords who screened properly + inspected periodically + responded to red flags have saved their property. Landlords who "just collected rent" have lost properties worth RM1M+.

ILLEGAL BUSINESS IN YOUR RENTAL (massage parlor, gambling, prostitution, illegal factory):
- Your tenancy agreement's "lawful purpose" clause is breached the moment you discover illegal use. Breach is fundamental — you can re-enter (serve notice) and re-let.
- BUT: do not self-help evict (change lock) even then — use the Distress Act / Specific Relief Act 1950 procedure. Courts grant expedited possession for illegal use.
- Penal Code s.102: abetting = accessory liability. Once you KNOW and do nothing, you lose the "innocent landlord" shield.
- Licensed trades check (tenant running a "business" in residential unit):
  * Massage: PBT premise license + signboard license + (for TCM/reflexology) MOH registration. NO such license = illegal regardless of content.
  * F&B / eatery: PBT premise + food handler + halal (if claimed) + signboard + Bomba CFO.
  * Retail/online store: SSM registration. Check at ssm.com.my. Residential-zoned unit cannot host customer walk-in.
  * Worship centre / tuition centre: PBT change-of-use + neighbour consent often required.
- Running business in residential unit without PBT change-of-use = landlord also fineable (up to RM50K under Local Government Act 1976).

STEPS WHEN YOU SUSPECT ILLEGAL ACTIVITY:
1. Document the red flags: unusual foot traffic, late-night visitors, locked doors during inspection, request for "no CCTV in corridor," cash-only rent, sudden smell of chemicals or burning, refusal of landlord inspection.
2. Send written inspection notice (7-14 days under most standard tenancies). Inspect with witness. Photograph.
3. If you confirm illegal activity → file police report immediately. Get report number. This is your "innocent landlord" evidence trail.
4. Breach notice + immediate termination per tenancy's illegal-use clause.
5. Initiate possession proceedings at Sessions Court (if rent < RM1M) or High Court.
6. Do NOT accept further rent after discovering the breach — accepting rent is "waiver of breach" and weakens your case.

PENAL CODE / OTHER STATUTES TO KNOW:
- Penal Code s.102: abetment.
- AMLATFPUAA 2001 (Anti-Money Laundering Act): rent paid from crime proceeds can be frozen/recovered. If tenant pays rent via unusual channels (foreign wire, crypto, third-party), keep records.
- Common Gaming Houses Act 1953: premises used for gambling → forfeitable + landlord liability if knowing.
- Prevention of Crime Act 1959 (PoCA): syndicate activity tagged premises.
- Immigration Act 1959/63 s.55E: harbouring illegal immigrants = up to RM30K fine + 5 years jail. Applies if tenant sub-houses overstayers.

WHEN LANDLORD MAY BE CHARGED (not just witness):
- You knew and did nothing (written complaints from neighbours on file; you ignored).
- You took "extra rent" in cash off-books — looks like profit-sharing.
- Your agent / family member was involved — landlord has vicarious exposure.
- You impeded the investigation (refused police entry without warrant despite their request).

WHAT IF PROPERTY IS SEIZED BUT YOU'RE INNOCENT:
- Within 30 days of forfeiture notice, file objection at High Court.
- Attach all your screening + inspection records.
- Affidavit of innocent owner + reasonable diligence.
- If property has mortgage, bank will often join proceedings (bank has first charge; they also want property back).
- Engage criminal lawyer with forfeiture experience — typical legal cost RM20K-80K; cheaper than losing the property.

COMMON TRAPS:
- Accepting rent after knowing the tenant's illegal use = waiver of right to terminate. Stop the auto-debit immediately.
- Agreeing to "cash only, no receipt" arrangement — courts see it as collusion.
- No tenant screening records at all — you fail the "reasonable diligence" test automatically.
- Never inspecting the unit — courts treat this as willful blindness.
- Failing to file police report — you look complicit, not innocent.

TEMPLATE STEPS:
- Notice of Inspection (7-14 days)
- Breach Notice (illegal use) + termination
- Police Report narrative (chronology of red flags + discovery)
- Affidavit of Innocent Owner (for forfeiture objection)

APPLY / VERIFY HERE:
- AGC (Attorney General's Chambers): agc.gov.my (forfeiture case lookup)
- PDRM Narcotics Crime Investigation Department: rmp.gov.my
- Criminal lawyer directory: malaysianbar.org.my (find "Criminal Law" practitioners)
- Bar Council Legal Aid Centre (if you can't afford): malaysianbar.org.my/LAC`
  },

  fire_safety: {
    keywords: [
      'fire safety', 'keselamatan kebakaran', '消防安全',
      'bomba', 'fire brigade', 'pasukan bomba', '消防局',
      'fire extinguisher', 'alat pemadam api', '灭火器',
      'smoke detector', 'pengesan asap', '烟雾报警器',
      'fire alarm', 'penggera kebakaran', '火警报警器',
      'sprinkler', 'percikan air', '喷淋系统',
      'cfo', 'certificate of fitness', 'sijil kelayakan', 'fire certificate',
      'ubbl', 'uniform building by-law', 'undang-undang kecil bangunan',
      'fire services act', 'akta perkhidmatan bomba', 'fsa 1988',
      'fire summons', 'saman bomba', '消防传票',
      'fire escape', 'tangga kecemasan', '逃生通道',
      'fire drill', 'latihan kebakaran', '消防演习',
      'fire code', 'kod kebakaran', '防火规范'
    ],
    content: `FIRE SAFETY & BOMBA COMPLIANCE (landlord liability, UBBL, FSA):

LEGAL FRAMEWORK:
- Fire Services Act 1988 (FSA 1988) — main statute.
- Uniform Building By-Laws 1984 (UBBL) — fire safety in Part VII + Part VIII.
- Local Government Act 1976 — PBT enforcement authority.
- Strata Titles Act 1985 + Strata Management Act 2013 — shared responsibilities in strata.
- Street, Drainage & Building Act 1974 — access for fire appliances.
- Penalty exposure: FSA s.28 = up to RM50,000 fine or 10 years jail (or both) for failure to maintain fire safety installations. FSA s.33 = obstruction of fire services = RM10K + 6 months jail.

LANDLORD'S CORE OBLIGATIONS (even for residential strata):
1. Install and maintain smoke detectors (UBBL 225 — required in sleeping areas + escape routes).
2. Provide a functional fire extinguisher (UBBL 227 — minimum 2kg ABC dry powder per unit in many PBTs).
3. Do NOT obstruct fire escape, staircase, or emergency exit — in strata, a stored bicycle/shoe rack in fire-rated corridor is a chargeable offence (RM1K-5K per incident).
4. Do NOT alter fire-rated walls, doors, or ceilings during renovation without Bomba + PBT approval (UBBL 236-248 + Bomba plan approval for renovations involving fire-rated elements).
5. For buildings >5 storeys or >18m height: maintain Certificate of Fitness for Occupation (CFO) with current Fire Certificate endorsement (renewed annually for hi-rise commercial; 3-yearly for most residential strata via MC).

FIRE CERTIFICATE (FC) & BOMBA CFO — DOES IT APPLY TO ME?
- FC required for "designated premises" under FSA s.28 (FSA Order 1988):
  * Hotels, hospitals, schools, factories, shopping complexes, office buildings, cinemas, theatres, strata buildings >5 storeys or >1,000 sqm GFA.
- For individual strata lots (your single condo unit): landlord is NOT the FC holder — the Management Corporation (MC/JMB) is. But you share the obligation to not compromise the building's fire rating.
- For whole landed property converted to commercial use (shop, office, factory): YOU are the FC applicant.
- Renewal: annual inspection by Bomba. Fees from RM200 (small shop) to RM50,000+ (high-rise).

WHAT TRIGGERS A FIRE SAFETY SUMMONS TO LANDLORD:
1. Bomba routine inspection finds missing/expired smoke detector or extinguisher in your rented unit.
2. Tenant removed fire alarm, painted over sprinkler head, blocked escape route — but you are the registered owner → summons lands on YOU, not tenant (unless tenant has FC in their name).
3. Post-fire investigation identifies landlord renovation that compromised fire rating (common: demolishing fire-rated wall for "open kitchen" without re-certification).
4. Neighbour complaint of hoarding in common area traced to your tenant.
5. Strata building loses FC → MC may individually surcharge lots found non-compliant.

WHAT TO DO IF YOU RECEIVE A FIRE SAFETY SUMMONS:
1. Do NOT ignore. Typical summons: compound RM500 – RM5,000. Court appearance escalates to RM50K + jail.
2. Fix the non-compliance within the compound period (usually 14-30 days). Get dated photos + Bomba-authorised contractor's invoice.
3. Reply to Bomba with proof of rectification before the hearing date.
4. Pay compound (if allowed) or attend court. Bring rectification evidence — often magistrate reduces fine substantially.
5. Serve notice to tenant for reimbursement if tenant caused the breach (with your tenancy's "fire safety compliance" clause). Deduct from deposit at end of lease if needed.

LANDLORD RENOVATION + FIRE SAFETY:
- Any renovation touching fire-rated elements (walls, doors, ceilings, ducts, lobby) needs Bomba plan approval (PBB) via MySubmission (bomba.gov.my). Fee from RM300. Takes 4-8 weeks.
- Common non-compliant renovations that trigger summons later:
  * Removing fire-rated door between unit and corridor (replaced with glass/decorative door).
  * Cutting hole in fire-rated ceiling for chandelier / air-con ducting without re-sealing.
  * Installing wooden parquet in escape corridor (fire load exceeded).
  * Blocking sprinkler coverage with overhead structures (gypsum ceiling covering sprinkler head).
- If you bought a unit with existing non-compliant renovations from previous owner, you INHERIT the liability. Do a pre-purchase Bomba audit on older units.

STRATA BUILDING LANDLORD (MC as FC holder):
- MC is the FC holder. MC conducts the annual fire drill, maintains sprinkler system, pump room, hose reels.
- Your obligation as parcel owner: (i) don't renovate in ways that compromise FR; (ii) don't store combustibles on common property; (iii) pay sinking fund contribution (sinking fund often used for major fire system upgrades).
- If your tenant blocks the escape corridor, MC issues a notice to YOU as registered parcel proprietor. Forward to tenant with reimbursement demand.
- Fire drill attendance: not mandatory for individual residents but highly recommended to be tenant-briefed. Tenancy clause can require tenant to participate.

COMMERCIAL LANDLORD (YOU are FC holder):
- You maintain the FC annually.
- Your tenant's use must match the FC category (e.g., FC was issued for "office" — tenant can't run a restaurant without FC upgrade).
- Tenant change-of-use → you must re-apply for FC with updated occupancy classification. Typically 6-12 weeks.
- If tenant's activity (welding, cooking, chemical storage) exceeds FC fire load rating, you can be charged as "permitting non-conforming use."

INSURANCE IMPLICATIONS:
- Building fire insurance voidable if material non-compliance existed at time of fire (undeclared renovation, expired FC).
- Loss of rent cover — triggers only if building fire-certified. If FC lapsed, claim likely denied.
- Landlord public liability — essential. Covers claims from tenant or tenant's visitors for injury from fire-related hazard.
- See 'insurance' topic for claim mechanics.

COMMON TRAPS:
- "My tenant removed the smoke detector, not me" — landlord is still the registered owner on Bomba's radar. Summons goes to you.
- Hiring a non-Bomba-registered contractor for renovation involving FR walls — work disallowed at certification, redo cost 2-3x.
- "FC lapsed by 2 weeks, no biggie" — tenant accident during that 2 weeks = insurance void + personal liability.
- Buying a converted shophouse / warehouse without checking Bomba compliance — RM50K-300K rectification bill is common.
- Treating strata MC's fire drill notice as "MC problem" — tenant's refusal to participate can be traced back to your tenancy clause (or lack thereof).

HIGH-RISK PROPERTY TYPES FOR FIRE LIABILITY:
- Pre-1985 buildings (built before UBBL) — many grandfathered but every renovation triggers current UBBL compliance.
- Shoplots with residential upper floors (common mixed-use) — dual-use complicates FC.
- Pre-war shophouses with wooden structures — extreme fire risk, higher premium, often require MANDATORY sprinkler retrofit for rent >RM50K/month.
- Old industrial factories converted to logistics / co-working — change-of-use + fire load upgrade mandatory.
- Rural/kampung wooden houses — UBBL may be softer but FSA still applies.

TEMPLATES TO PREPARE:
- Tenancy clause: "Fire Safety Compliance" — tenant cannot tamper with fire safety equipment, must report any defect within 7 days, reimburses reinstallation cost.
- Pre-tenancy fire equipment checklist (signed by tenant at move-in).
- Annual fire safety inspection log (landlord's record, signed by tenant each year).

APPLY / VERIFY HERE:
- Bomba plan approval + FC application: bomba.gov.my (MySubmission portal)
- Bomba general hotline: 994 (emergency) / 03-8892 7000 (enquiry)
- UBBL 1984 full text: agc.gov.my
- PBT premise license (commercial): your local council (DBKL, MPSJ, MBPJ etc.)`
  },

  agent_dispute: {
    keywords: [
      'agent dispute', 'pertikaian ejen', '代理纠纷',
      'estate agent', 'ejen hartanah', '地产代理',
      'property agent', 'ejen harta',
      'real estate negotiator', 'perunding hartanah',
      'probationary estate agent',
      'boveaea', 'bovaea', 'lembaga penilai', 'board of valuers',
      'miea', 'malaysian institute of estate agents', 'institut ejen hartanah',
      'agent commission', 'komisen ejen', '佣金',
      'agent missing', 'ejen hilang', 'ejen lari', '代理跑路',
      'agent fraud', 'penipuan ejen', '代理诈骗',
      'agent complaint', 'aduan ejen',
      'deposit kept by agent', 'deposit dipegang ejen',
      'unregistered agent', 'ejen tidak berdaftar', '黑中介',
      'vaeapma', 'akta penilai', 'lppeh',
      'agent laptop', 'agent lost ic', 'agent lost passport', 'agent leaked', 'agent data breach', 'agent pdpa', 'pdpa breach', 'pdpa data breach', 'tenant ic leaked', 'tenant passport leaked', 'personal data compromise', 'data pelanggan bocor', '客户资料泄露', 'kebocoran data peribadi',
      'scam agent', 'scammer agent', 'scammer called', 'fake agent', 'impersonation', 'impersonating agent', 'ejen tipu', 'ejen palsu', 'agent pretending', 'someone pretending to be agent', 'fraudster agent', '冒充中介', '假中介',
      'phishing', 'fake account', 'fake bank account', 'deposit transferred to scammer', 'scam deposit', 'scam rm8000', 'scam transferred', 'pemalsuan', 'akaun palsu',
      'agent refused to show', 'refused to show unit', 'agent refused tenant', 'discrimination by agent', 'discrimination tenancy', 'transgender tenant', 'lgbt tenant', 'gender discrimination', 'racial discrimination', 'religious discrimination', 'agama diskriminasi', '歧视租客',
      'agent negligence', 'agent liability', 'vicarious liability agent'
    ],
    content: `AGENT DISPUTES — MIEA, BOVEAEA, COMMISSION, MISCONDUCT:

KEY DISTINCTION — REGULATOR vs INDUSTRY BODY:
- BOVEAEA (Board of Valuers, Appraisers, Estate Agents and Property Managers) = GOVERNMENT REGULATOR. Only body that can license, fine, or strike off agents. Website: lppeh.gov.my.
- MIEA (Malaysian Institute of Estate Agents) = INDUSTRY BODY (trade association). Has ethics committee but cannot enforce statutory penalties. Website: miea.com.my.
- Complaints with legal bite go to BOVEAEA, not MIEA. MIEA can arbitrate member-to-member disputes and refer serious matters to BOVEAEA.

LEGAL FRAMEWORK:
- Valuers, Appraisers, Estate Agents and Property Managers Act 1981 (VAEAPMA / Act 242).
- Malaysian Estate Agency Standards (MEAS) — practice rules under VAEAPMA.
- VAEAPMA s.22D — client account rule: all client money (deposit, booking, earnest) must go into a designated client account, NOT agent's personal/firm operating account.
- VAEAPMA s.30 — unregistered person practising = RM300,000 fine + 3 years jail.
- Max commission caps (MEAS Schedule):
  * Sale: 3% of sale price (negotiable).
  * Rental: 1 month rent for 1-2 year tenancy (for residential/commercial).
  * For longer leases (3yr+): pro-rated, capped at 1.25 months.

WHO CAN LEGALLY PRACTISE:
1. REA (Registered Estate Agent) — fully licensed, holds E number.
2. PEA (Probationary Estate Agent) — passed Part I/II, in 2-year probation under REA.
3. REN (Real Estate Negotiator) — junior, MUST work under REA/PEA, holds tag number.
- Check at lppeh.gov.my (search by name or E/REN tag number).
- No tag / fake tag / "I'm an agent" with no registration = illegal. Do NOT engage.

AGENT KEPT YOUR MONEY (deposit, booking, commission kickback):
Step 1 — VERIFY registration first. Go to lppeh.gov.my search. If unregistered:
  * Immediate police report (fraud, criminal breach of trust under Penal Code s.406-410).
  * Separate civil claim at Sessions/Magistrate Court.
  * Amount < RM5,000 → Tribunal for Consumer Claims (TTPM) — fast, no lawyer needed.
  * Amount > RM5K: Magistrate Court (≤RM100K) or Sessions Court (≤RM1M).

Step 2 — If agent IS registered:
  * File BOVEAEA complaint: lppeh.gov.my → Complaints → Download Form → submit with evidence + statutory declaration.
  * Complaint triggers investigation by Disciplinary Committee (VAEAPMA Part V).
  * Penalties: reprimand, fine up to RM25,000, suspension, or strike off (deregistration).
  * BOVEAEA has a Compensation Fund (MEAS Rule) — up to RM50K per claim if agent is bankrupt/disappeared.
  * File in PARALLEL: police report (CBT if money misappropriated), civil suit for recovery.

Step 3 — Evidence bundle you need:
  * Signed listing/agency agreement.
  * WhatsApp / email records showing money flow instructions.
  * Bank-in slips, transfer receipts.
  * Client account details (demand from agent in writing — refusal is itself misconduct).
  * Any offer letter, earnest receipt, tenancy draft.

AGENT ABANDONED THE DEAL / SWITCHED SIDES:
- Dual agency (representing both landlord and tenant) is allowed only with FULL written disclosure + consent from both. Without disclosure = conflict of interest = BOVEAEA complaint grounds.
- Agent pushed you to a "preferred lawyer" or "preferred financier" who turned out to be kickback recipient = breach of fiduciary duty. Grounds for commission forfeiture + complaint.

COMMISSION DISPUTE MECHANICS:
- Commission payable only upon "effective cause of sale/lease" (i.e., agent introduced the tenant/buyer who actually transacted).
- If you engaged multiple agents and signed with tenant introduced by Agent A but Agent B had earlier appointment → industry norm = first-introducer wins unless their mandate expired.
- If agent claims commission on a deal you closed directly after their showing → 30-day "protection clause" in agency agreement usually applies. Beyond that, commission may be forfeit.
- If agent did NOT deliver a signed tenancy (you signed it direct) but showed the tenant: agent typically still entitled (effective cause). If tenant drove the deal through other channels, disputable.

TENANT SIDE — WHEN YOUR "AGENT" ASKS FOR CASH:
- Any agent who asks for deposit/earnest in cash or personal account = RED FLAG.
- All client money must go to agency's CLIENT ACCOUNT (VAEAPMA s.22D). Demand the client account bank details on agency letterhead.
- If agent refuses or says "faster this way" → walk away + report to BOVEAEA.

ESCAPE ROUTE IF YOU ALREADY PAID A ROGUE AGENT:
1. Lodge police report (CBT / s.420 cheating) — get report number same day.
2. File civil suit for recovery + damages. Small Claims (<RM5K) fast; Magistrate if larger.
3. BOVEAEA complaint if registered — may get partial recovery via Compensation Fund.
4. Bank freeze application (Anti-Money Laundering Act) if funds traceable — needs lawyer.
5. CTOS/CCRIS report against individual agent — makes future fraud harder for them.

UNREGISTERED AGENT (BLACK AGENT / BROKER LIAR):
- VAEAPMA s.30: illegal to hold out as agent or negotiate property transaction without registration.
- Penalty: RM300K fine / 3 years jail.
- Report: BOVEAEA (enforcement arm will raid) + police.
- You lose BOVEAEA Compensation Fund protection for unregistered persons — civil suit only.

LANDLORD — CHECKLIST BEFORE SIGNING WITH AN AGENT:
1. Verify REA/PEA/REN tag on lppeh.gov.my.
2. Demand firm name (E registration number) — should appear on business card + agency agreement.
3. Signed exclusive/non-exclusive agency agreement clarifying: term, commission rate, protection period, client account for deposits.
4. Never pay "marketing fee" upfront to an agent for unit they haven't secured tenant for — commission is success-fee only.
5. Never pass deposits/earnest to individual's personal account.

COMPETITION / DUAL LISTING:
- Exclusive agency: one agent only for the term — better service but locks you in.
- Non-exclusive: multiple agents, first effective cause wins — faster but risk of commission dispute.
- Dual listing is industry norm; state in writing how "introduction" is defined to avoid disputes.

COMMON TRAPS:
- Assuming MIEA can recover your money — they cannot. Only BOVEAEA has statutory teeth.
- Paying agent via DuitNow to personal account "for speed" — now it's an AML issue + no recovery path.
- Signing agency agreement without reading the "protection period" clause — you can owe commission months after relationship ended.
- Believing "no commission if no deal" — you may owe partial marketing fees if the agreement says so.

TEMPLATES TO PREPARE:
- Agency Agreement (use MIEA/BOVEAEA standard, fill exclusive/non-exclusive, commission, protection period).
- BOVEAEA Complaint Form (download from lppeh.gov.my).
- Letter of Demand to agent / agency (commission / deposit return).
- Police report narrative (chronology + evidence list).

═══════════════════════════════════════════════════════════════════════════════
AGENT DATA BREACH — TENANT PII LEAKED / STOLEN LAPTOP (PDPA 2010)
═══════════════════════════════════════════════════════════════════════════════
LEGAL FRAMEWORK:
- Personal Data Protection Act 2010 (PDPA). Agencies collecting IC/passport/bank statements are "data users" under PDPA.
- PDPA 2024 amendments (in force): personal DATA BREACH NOTIFICATION now MANDATORY. Notify PDP Commissioner within 72 hours + notify affected individuals without undue delay.
- Data users must appoint a Data Protection Officer (DPO) once thresholds met.
- Penalties: up to RM1m / 3 years jail for s.5 breach (processing without consent). Failure to notify breach: up to RM250,000 / 2 years.

LIABILITY WHEN AGENT LOSES TENANT'S IC COPY:
1. Agent firm is liable as data user — personal responsibility of the directors.
2. The individual agent (REN/PEA/REA) also personally liable; may face BOVEAEA conduct action.
3. Landlord MAY be a joint data user if they directed collection — typically shared liability.
4. Tenant's civil claim: damages for distress + identity theft mitigation costs (subscription to fraud monitoring, cost of replacement IC/passport, lost income dealing with fraud).
5. Criminal route: if agent sold/disclosed data — Penal Code s.420 cheating, s.424 dishonest concealment.

RESPONSE PROTOCOL (first 72 hours):
1. Contain — disable remote access to any cloud account, change all agency passwords, wipe stolen device if possible (MDM).
2. Assess — list all data types lost (IC, passport, bank, signature).
3. Notify the tenants affected — clear, plain-language, state what, how, when, next steps.
4. Notify PDP Commissioner via online portal (pdp.gov.my).
5. Advise tenant to: file police report, subscribe to CTOS / iMoney fraud alerts, replace IC/passport if feasible, flag Lembaga Hasil + banks.
6. Preserve evidence — any logs / forensic record. Do NOT format the device pre-forensic.
7. Consider offering compensation proactively — often cheaper than PDP proceedings + civil suit.

COMPENSATION RANGES (post-2024):
- Low-harm cases (data leaked, no actual misuse yet): RM500-RM3,000 per tenant.
- Identity theft documented: RM5,000-RM30,000.
- Class-action / large agency: RM50,000-RM500,000 + enforcement fine.

PREVENTIVE MEASURES (every agency/landlord should have):
- Encrypted laptop / phone (hardware encryption on).
- Cloud-only storage, no local copies after deal.
- Zero-retention policy: delete tenant PII 7 years post-lease end (tax record period).
- DPO appointed + training logs.
- Access log on any "IC folder".

═══════════════════════════════════════════════════════════════════════════════
AGENT IMPERSONATION SCAMS — "SCAMMER PRETENDED TO BE MY AGENT"
═══════════════════════════════════════════════════════════════════════════════
COMMON PATTERN:
1. Scammer scrapes listings + agent contact from property portals.
2. Spoofs agent's WhatsApp/phone number (number porting or mask app).
3. Contacts tenant directly, claims "my client needs faster transfer to secure unit".
4. Sends "client account" details (actually mule account).
5. Tenant transfers RM3,000-RM20,000. Money gone within minutes.
6. Scammer vanishes. Real agent unaware.

PARTIES' EXPOSURE:
- The scammer — criminal prosecution under Penal Code s.420 (cheating) + Communications and Multimedia Act 1998 s.233 (impersonation online). In practice, rarely caught.
- The tenant — primary victim; bears financial loss unless recovered from bank.
- The real agent / agency — may face vicarious / apparent-authority claim if they failed to warn or their security practices let the spoof happen. Also possible BOVEAEA complaint for failing to safeguard client communication.
- The landlord — generally NOT liable unless landlord was complicit or directed cash to private account.

RECOVERY STEPS FOR VICTIM TENANT (first 24 hours):
1. Call bank fraud hotline IMMEDIATELY — "Recall Fund" request if same-bank, "Rentas/DuitNow trace" if inter-bank. Success rate drops to <10% after 24 hours.
2. Police report at nearest station — criminal breach + fraud. Get IPR number.
3. File with National Scam Response Centre (NSRC) 997 — freezes suspect accounts across banks.
4. Notify real agent + landlord in writing.
5. If agent had weak security (WhatsApp with no 2FA, unverified contact info) → civil claim against agent for negligence.

PREVENTION (for landlords and agents to publish):
- ALWAYS request the agency's letterhead with client account. Verify client account on lppeh.gov.my or by calling agency's landline.
- Cross-check instructions via a DIFFERENT channel (email + phone call).
- Never transfer to a named individual's personal account.
- Agencies should publish their client account details on their website + letterhead and explicitly warn against any other account.
- WhatsApp number changes mid-deal → STOP, verify in person.

VICARIOUS LIABILITY TEST (courts apply):
- Did the real agency create the appearance of authority? (e.g., brochure listed agent's phone as sole contact).
- Did they have adequate security? (2FA, client account controls, insurance).
- Did they fail to warn clients about known scam patterns?
- Multiple "YES" answers → agency may be on the hook for partial / full refund.

═══════════════════════════════════════════════════════════════════════════════
DISCRIMINATION BY AGENT (transgender, race, religion, nationality)
═══════════════════════════════════════════════════════════════════════════════
LEGAL POSITION:
- Malaysia has NO comprehensive anti-discrimination statute for private housing. Federal Constitution Art 8 binds State, not private parties.
- Exceptions where discrimination IS actionable:
  (a) Persons with Disabilities Act 2008 — reasonable accommodation duty.
  (b) Housing Development Act 1966 — developer cannot refuse sale arbitrarily to Bumi quota applicants.
  (c) Agency code of ethics (MEAS) — agent must not "bring the profession into disrepute". BOVEAEA has disciplined agents for public discriminatory statements.
- BOVEAEA complaint route remains open for any conduct that breaches professional standards even if no specific statute.

CLAIM PATHWAYS:
- BOVEAEA disciplinary complaint — agent may be fined / suspended. Slower but on-record.
- Social media / public complaint + boycott — strongest real-world pressure.
- Civil suit for breach of implied contract if there was a services agreement + dignitary tort (limited).
- Human rights body (SUHAKAM) — advisory, no enforcement power, but publishes reports that shape practice.
- If refusal is by developer or housing cooperative (as distinct from agent), PDRM / MOHA may be relevant depending on the context.

PRACTICAL REALITY (2026): discrimination cases rarely win monetary damages in MY courts, BUT:
- Public exposure via BOVEAEA + media routinely costs the agency the mandate + reputation.
- Ken's platform positioning (Find.ai = "pre-verified" trust marketplace) can reduce reliance on discriminatory filtering by surfacing compliance-based trust signals.

APPLY / VERIFY HERE:
- BOVEAEA: lppeh.gov.my | 03-2287 9888 | verify REA/PEA/REN tag
- MIEA: miea.com.my | 03-7960 2120 (ethics referral)
- PDP Commissioner: pdp.gov.my (data breach notification)
- National Scam Response Centre (NSRC): 997
- Tribunal Tuntutan Pengguna Malaysia (TTPM): ttpm.gov.my (claims ≤RM5K, no lawyer needed)
- Criminal lawyer directory: malaysianbar.org.my`
  },

  insurance: {
    keywords: [
      'insurance', 'insurans', 'insuran', '保险',
      'fire insurance', 'insurans kebakaran', '火险',
      'building insurance', 'insurans bangunan', '建筑保险',
      'contents insurance', 'insurans kandungan', 'insurans harta',
      'public liability', 'liabiliti awam', '公共责任保险',
      'landlord insurance', 'insurans tuan rumah',
      'claim denied', 'tuntutan ditolak', '理赔被拒',
      'insurance claim', 'tuntutan insurans', '保险索赔',
      'subrogation', 'subrogasi', '代位求偿',
      'policy renewal', 'pembaharuan polisi',
      'flood insurance', 'insurans banjir', '洪水保险',
      'piam', 'persatuan insurans', 'insurance ombudsman',
      'ofs', 'ombudsman financial services', 'ombudsmen perkhidmatan kewangan',
      'loss of rent', 'kerugian sewa', '租金损失保险'
    ],
    content: `LANDLORD INSURANCE — BUILDING, CONTENTS, PUBLIC LIABILITY, CLAIMS:

LEGAL FRAMEWORK:
- Financial Services Act 2013 (FSA 2013) — regulates licensed insurers.
- Insurance Act 1996 (repealed by FSA 2013) — superseded but older policies may still reference it.
- Common law doctrines: indemnity, subrogation, utmost good faith (uberrimae fidei), insurable interest.
- Ombudsman for Financial Services (OFS — formerly FMB): independent dispute resolution for consumer insurance complaints, free for claims ≤ RM250K personal / ≤ RM500K SME.

TYPES OF LANDLORD POLICIES (typical Malaysian market):
1. FIRE / HOUSEOWNER (HOPO): covers building structure only. Standard fire perils = fire, lightning, explosion. Add-ons needed for flood, storm, burst pipe, landslide, riot.
2. HOUSEHOLDER / CONTENTS: covers contents inside the property — furniture, appliances, etc. For unfurnished tenancies = tenant's responsibility. For furnished = landlord's policy.
3. PUBLIC LIABILITY (PL): covers injury to third parties (tenant's visitor slips, balcony collapse, falling tile) and property damage to third parties. Typical cover RM500K – RM5M. ESSENTIAL for landlords — tenant or visitor lawsuit can exceed annual rent.
4. LOSS OF RENT: pays out rent for reconstruction period (usually 12 months max). Kicks in after an insured peril makes unit uninhabitable. Premium ~5-10% of annual rent.
5. LANDLORD-SPECIFIC COMBO: integrated policy bundling (1)+(3)+(5) + legal expenses + malicious damage by tenant + rent default cover. Growing segment. PLT/Allianz/Etiqa/Zurich/Tokio Marine lead.

FOR STRATA PARCELS:
- MC holds the master policy for common property + building structure. Check the MC's policy wording annually — know what's covered for your unit's walls.
- You (parcel owner) buy CONTENTS + PL separately for inside the unit.
- Some MC master policies are "insured walls out" (covers up to and including your unit's internal partition walls). Others are "bare walls" (only external structure). Read it.

WHAT A STANDARD FIRE POLICY EXCLUDES (common gotchas):
- Flood (needs "special perils" add-on — ~0.1% of sum insured extra).
- Malicious damage by tenant (specific tenant-caused vandalism rider).
- Tenant negligence cooking fire (may be covered but insurer will subrogate against tenant — see next section).
- Unoccupied property >30 days (cover suspends automatically — must notify insurer).
- Electrical rewiring / plumbing "gradual deterioration."
- Terrorism (unless Malaysia Terrorism Risk Pool add-on).
- War, nuclear, pandemic (global exclusion).

SUBROGATION — WHY INSURER MAY LATER SUE YOUR TENANT:
- After paying your fire claim, insurer "steps into your shoes" and may recover from the party who caused the loss (usually the tenant).
- Common: tenant cooking oil fire → insurer pays you → insurer sues tenant for the amount.
- You have a DUTY to cooperate with subrogation: preserve evidence, name the tenant, provide tenancy agreement.
- This is why your tenancy should require tenant to hold their own contents + liability insurance — otherwise you're the only deep pocket.

TENANT OBLIGATIONS (write into tenancy):
1. Tenant shall obtain and maintain contents insurance for their own belongings (landlord not liable for theft/damage to tenant goods unless negligent).
2. Tenant shall obtain third-party liability coverage for their acts (minimum RM250K).
3. Tenant shall not do anything that increases the fire risk or premium of the landlord's policy (e.g., running a business, storing combustibles).
4. Tenant to notify landlord immediately of any incident that may give rise to claim (fire, flood, break-in).
5. Indemnity clause: tenant indemnifies landlord for loss caused by tenant's breach.

CLAIM PROCESS — STEP BY STEP:
1. IMMEDIATE (day 1-3):
   * Call emergency services if needed (999 for Bomba, 994 for police).
   * Make the property safe (plug leaks, board up windows — not doing so can void coverage for "consequential loss").
   * Photograph everything — date-stamped, multiple angles.
   * Keep receipts for emergency mitigation (these are claimable).

2. NOTIFICATION (within 7 days usually, check policy):
   * Call insurer hotline → get claim reference number.
   * Submit written notification with photos, police/Bomba report, estimated loss.

3. ASSESSMENT (week 2-4):
   * Insurer appoints loss adjuster. They inspect, request documents, may depreciate.
   * Landlord appoints own assessor/QS (recommended for claims >RM50K) to negotiate the settlement.
   * Provide tenancy agreement, purchase invoices for items, prior valuations.

4. SETTLEMENT (week 4-12):
   * Offer letter from insurer — you sign "discharge voucher."
   * Disputes: OFS complaint (free) within 6 months of final offer.
   * Court suit: FSA 2013 limitation period is 6 years from breach of policy.

CLAIM DENIAL — YOUR APPEAL PATH:
1. Request written denial reason from insurer.
2. Cross-check against policy wording. Common denial bases:
   * Material non-disclosure at policy inception (tenant type, renovation, prior claims).
   * Breach of warranty (e.g., unoccupancy, fire safety lapses).
   * Exclusion applies (flood without add-on, wear & tear).
   * Late notification (often 7-14 day clock).
3. Appeal internally to insurer's Customer Service Manager within 14 days.
4. If unresolved after 60 days: escalate to Ombudsman for Financial Services (OFS) — ofs.org.my.
5. OFS decision is binding on insurer up to RM250K (personal)/RM500K (SME) if you accept. Above limits → Civil Court.

TENANT NEGLIGENCE → YOUR CLAIM → YOUR CIVIL SUIT AGAINST TENANT:
- Tenant left stove on, fire damaged unit RM150K. Your insurer pays (assuming peril covered) → subrogates against tenant.
- Alternative if insurer denies (e.g., tenant commercial use violated policy): you sue tenant in tort (negligence, breach of contract).
- Evidence: police/Bomba report, loss adjuster report, repair invoices, original tenancy agreement.
- Limitation: 6 years (contract) / 6 years (tort) from incident date.
- Enforcement: if tenant has no asset, judgment is paper win. Consider CTOS listing + bankruptcy if debt exceeds RM100K threshold.

FLOOD SPECIFIC (Ganu, KL flash, Kelantan):
- Fire policy by default EXCLUDES flood. You need "Special Perils" endorsement: ~0.1% of sum insured annual premium (RM500K cover ≈ RM500/year extra).
- Post-2021 floods, some insurers declined renewal for high-risk addresses. Alternatives: MyFloodInsurance (PIAM pool), National Flood Insurance Scheme (being developed under Budget 2026).
- Claim documentation: dated photos, drone footage if possible, municipal flood declaration letter, receipts for emergency repairs.
- Loss of rent rider crucial — flood reconstruction typically 3-6 months; lost rent can exceed RM30K easily.

LOSS OF RENT — HOW IT WORKS:
- Pays "fair market rent" for reconstruction period, capped at policy limit (typically 12 months).
- Trigger: insured peril (fire/flood etc.) renders unit uninhabitable.
- Calculation: use last tenancy's actual rent OR current market rate per valuer's letter (whichever is lower typically).
- NOT triggered by: tenant breach (rent default), voluntary vacancy, non-insured peril.

RENT GUARANTEE / TENANT DEFAULT INSURANCE (emerging product):
- Pays landlord's rent if tenant defaults (typically up to 6-12 months arrears).
- Premium: 2-4% of annual rent.
- Screening required — insurer approves tenant before bind.
- Claim trigger: tenant >60 days in arrears + Notice to Quit served + eviction process commenced.
- Good for: high-value units (>RM10K/month rent), first-time landlords, absentee landlords.

PUBLIC LIABILITY CLAIM SCENARIOS (why it's essential):
- Balcony railing failed, tenant's child fell — RM500K injury claim.
- Stair-rail pulled out from wall, tenant's guest broke leg — RM150K claim.
- Leaking pipe damaged neighbour's unit below — neighbour claims RM80K.
- Gas leak caused tenant's hospitalization — RM300K claim.
- Without PL: landlord pays from personal assets. With PL: insurer defends and pays.

COMMON TRAPS:
- Fire policy only covers building, not PL — many landlords think "I have insurance" but it's just structural.
- Not declaring tenant type (expat vs local, commercial use) → material non-disclosure → claim denied at time of loss.
- Buying cheapest quote without reading exclusions → flood/theft/malicious damage excluded.
- Not keeping receipts for appliances / renovation → depreciation applied, payout halved.
- Policy cancelled for non-payment of premium and you don't realize → zero cover at time of loss.
- Unoccupied >30 days (between tenants) without notifying insurer → cover void.

LANDLORD-INSURANCE CHECKLIST:
☐ Building/fire policy with current sum insured matching rebuild cost (not market value).
☐ Special perils rider: flood, storm, burst pipe, landslide.
☐ Public liability: minimum RM1M cover.
☐ Loss of rent rider.
☐ Tenant default rider (optional but good for high-value units).
☐ Annual review after any renovation / tenant change.
☐ Copy of policy + schedule stored digitally (and in Evidence Vault if using Find.ai).
☐ Emergency contacts on fridge: insurer hotline, Bomba, plumber.

APPLY / VERIFY HERE:
- Ombudsman for Financial Services: ofs.org.my | 03-2272 2811
- PIAM (General Insurance Association): piam.org.my
- Bank Negara Malaysia Consumer Alert: bnm.gov.my/customer-alert
- Licensed insurers list: bnm.gov.my → Financial Institutions Directory
- Independent insurance brokers (better rates, wider market): MITBA (miba.com.my)`
  },

  inheritance: {
    keywords: [
      'inheritance', 'warisan', 'pusaka', '遗产',
      'probate', 'probet', 'grant of probate', 'geran probet',
      'letters of administration', 'surat kuasa mentadbir', 'loa',
      'intestate', 'tanpa wasiat', '无遗嘱',
      'death of landlord', 'tuan rumah meninggal', '房东死亡',
      'landlord died', 'pemilik meninggal', 'landlord dies',
      'father passed away', 'mother passed away', 'parent died', 'parents passed away',
      'bapa meninggal', 'ibu meninggal',
      'passed away', 'meninggal dunia', '去世',
      'amanah raya', 'balai harta', 'public trustee',
      'small estate', 'harta pusaka kecil', 'pesaka kecil',
      'distribution act', 'akta pembahagian', 'akta pesaka',
      'faraid', 'islamic estate', 'pusaka islam', '回教遗产',
      'inherited property', 'harta warisan', 'inherited', 'inherit', 'mewarisi',
      'executor', 'wasi', 'pemegang amanah',
      'estate administrator', 'estate claim', 'tuntutan harta'
    ],
    content: `INHERITED / PROBATE OF TENANTED PROPERTY:

LEGAL FRAMEWORK:
- Probate and Administration Act 1959 — main probate statute (Peninsular).
- Distribution Act 1958 — intestate succession (non-Muslim).
- Small Estates (Distribution) Act 1955 — amended 2022: ceiling raised to RM5M, Land Office jurisdiction (faster, cheaper than High Court).
- Public Trust Corporation Act 1995 — Amanah Raya Berhad (ARB) as public trustee.
- Muslim estates: Syariah Court issues Sijil Faraid; distribution per Islamic Law (Faraid).
- Sabah: Probate and Administration Ordinance (Cap.109).
- Sarawak: Probate and Administration Ordinance (Cap.80).

WHO INHERITS WHAT (non-Muslim, no will, per Distribution Act 1958):
- Spouse + parent + children: spouse 1/4, children 1/2 (divided equally), parent 1/4.
- Spouse + children (no parent): spouse 1/3, children 2/3.
- Spouse + parent (no children): spouse 1/2, parent 1/2.
- Spouse only: 100%.
- Children only: 100% equal shares.
- If no spouse/child/parent → siblings → nephews/nieces → grandparents → uncles/aunts → state (bona vacantia).

WHO INHERITS WHAT (Muslim, Faraid):
- Complex rules based on relationship (husband, wife, son, daughter, father, mother, brother, sister) + gender weighting (generally 2:1 male:female).
- Apply to Syariah Court for Sijil Faraid (computes each heir's share).
- Civil court issues grant; Syariah court determines distribution.
- 1/3 rule — deceased can only dispose of 1/3 via will (wasiat); 2/3 strictly per Faraid.

THREE PATHS TO GET THE PROPERTY TRANSFERRED:
1. GRANT OF PROBATE (with will, any estate size): Executor files at High Court. Takes 6-18 months. Legal fees RM5K-50K+ depending on complexity.
2. LETTERS OF ADMINISTRATION (no will, above RM5M or has significant movable assets): Administrator applies at High Court. Takes 12-24 months. Requires sureties or bond.
3. SMALL ESTATES DISTRIBUTION (no will, estate ≤ RM5M, mostly immovable/land): Apply at State Land Office / Pejabat Tanah Daerah. Fast — 3-6 months. Cost ~RM200 filing + minor. Best path for most family inherited properties.

TENANTED PROPERTY IN PROBATE — TENANCY CONTINUES:
- Death of landlord does NOT terminate the tenancy. Contracts Act 1950 — rights and obligations pass to estate.
- Tenant should continue paying rent. But to whom?
- BEFORE grant issued: rent goes to "estate of [deceased]". In practice, family often collects informally (risky — unauthorised administration = personal liability).
- Best practice during probate gap: family jointly opens an estate bank account (bank needs letter of authority from court), rent paid into that.
- Tenant's protection: pay rent via bank transfer with reference "Estate of [Deceased Name]" + keep receipts. If overpaid to wrong person, tenant protected by good faith doctrine.

TENANT SIDE — YOUR LANDLORD DIED:
1. Verify the death: ask family for death certificate copy (JPN-issued).
2. Pause electronic standing order if unsure of recipient — pay via bank transfer monthly instead, to same account but with clear "rent" memo.
3. Request that family formalise successor via probate within 3-6 months.
4. Upon grant/small-estate distribution issued: new landlord (executor/administrator/beneficiary) takes over. They should provide you a certified grant copy.
5. Existing tenancy agreement runs to original expiry. New landlord cannot change terms mid-lease.
6. If family delays >12 months and tenancy expires → apply to court for "Amanah Raya administration" or treat tenancy as ended (safer: pay into solicitor's stakeholder account).

LANDLORD SIDE — YOU INHERITED TENANTED PROPERTY:
1. Get certified copies of: grant of probate / LA / small-estate distribution order. Need multiple certified copies (banks, LHDN, land office each want one).
2. Introduce yourself formally to tenant: letter with grant copy, updated bank details, your ID.
3. Honour existing tenancy to expiry. You cannot hike rent, evict, or change terms before expiry unless tenancy allows.
4. Stamp the tenancy AGAIN only if you amend it (e.g., rent review on expiry, new agreement) — original stamp carries through.
5. Notify LHDN: rental income now taxable to you (or to estate, depending on whether property has been distributed yet).
6. Update utility accounts (TNB, SYABAS/IWK, Indah Water) — Change of Tenancy with grant.
7. Notify MC/JMB for strata → update parcel proprietor records.
8. Review landlord insurance — rename as new owner or buy fresh.

WHEN NO ONE CLAIMS THE ESTATE (abandoned estate):
- Under Public Trust Corporation Act 1995, Amanah Raya Berhad (ARB) can be appointed administrator.
- Landlord/tenant can petition ARB: amanahraya.com.my | 1-300-88-6863.
- ARB administers, collects rent, distributes per intestate rules. Takes fee (scale per estate value).
- Useful when: family is absent/abroad, family in dispute, no obvious next-of-kin.

AMANAH RAYA (ARB) vs LAND OFFICE vs HIGH COURT — WHICH PATH:
| Scenario | Recommended path |
|---|---|
| Has will, any estate size | High Court (Probate) |
| No will, estate ≤ RM5M, mostly immovable | Land Office (Small Estates) — fastest, cheapest |
| No will, estate > RM5M or complex movables | High Court (LA) |
| Family in dispute, no obvious administrator | ARB (public trustee) — impartial |
| Estate abandoned / heirs missing | ARB or State claim (bona vacantia) |

STAMP DUTY ON INHERITED PROPERTY:
- No stamp duty on transmission by death (Stamp Act 1949 s.15).
- But: nominal fee for transmission memorandum at Land Office (~RM10).
- Subsequent transfer to specific heir: may attract nominal duty (RM10) if per grant, OR full ad valorem if "family settlement" involves consideration.
- If beneficiaries sell inherited property: RPGT applies but uses deceased's acquisition date + value, NOT heirs' acquisition (favourable CGT treatment).

RPGT (CAPITAL GAINS TAX) POST-INHERITANCE:
- Real Property Gains Tax Act 1976: gain = sale price − acquisition price.
- For inherited property, "acquisition price" = market value at date of death (per Certificate of Probate).
- So if deceased bought at RM500K in 1990, died 2020 when market value was RM1.2M, you sell 2026 for RM1.5M:
  * Your taxable gain = RM1.5M − RM1.2M = RM300K (not RM1M).
  * RPGT rate: holding period since inheritance applies (6th year+ = 0% for citizen).
- Get a valuer to fix the market-value-at-death (JPPH or private registered valuer) — critical for RPGT.

DEATH WHILE MORTGAGED (MRTA kicks in):
- Most home loans require MRTA/MLTA (mortgage reducing/level term assurance).
- MRTA pays off loan balance on borrower's death → property passes to heirs free of mortgage.
- MLTA pays a lump sum to estate → family chooses whether to use it to pay off loan.
- Always verify: get MRTA/MLTA policy number, contact insurer within 90 days of death.

COMMON TRAPS:
- Family collecting rent informally for years without probate → they are "intermeddling executors" — personally liable for debts + tax of estate.
- Not using Small Estates path when eligible → wasted RM30K+ on High Court process.
- Selling inherited property without proper transmission → void transfer, buyer cannot get clean title.
- Muslim family ignoring Faraid — courts can override "gentleman's agreement" decades later.
- Not getting date-of-death valuation → locked out of RPGT base step-up, paying way more tax.

TEMPLATES TO PREPARE:
- Notice to Tenant (landlord deceased, rent interim arrangement).
- Letter to Amanah Raya (petition for administration).
- Letter to Bank (request executor's account / letter of authority).
- Letter to LHDN (notify estate TIN for rental income).
- Family Consent Deed (all heirs agreeing to one heir managing interim).

APPLY / VERIFY HERE:
- Amanah Raya Berhad: amanahraya.com.my | 1-300-88-6863
- State Land Office (Small Estates): jkptg.gov.my (find your state)
- High Court Probate Registry: kehakiman.gov.my
- Syariah Court (Muslim estate): jksm.gov.my (find state Syariah Court)
- Malaysian Bar probate specialist: malaysianbar.org.my`
  },

  divorce_matrimonial: {
    keywords: [
      'divorce', 'perceraian', 'bercerai', '离婚',
      'matrimonial', 'perkahwinan', 'pernikahan',
      'ex-wife', 'ex-husband', 'bekas isteri', 'bekas suami', '前妻', '前夫',
      'spouse block', 'pasangan halang', '配偶阻止',
      'joint name divorce', 'nama bersama cerai',
      'lra 1976', 'law reform marriage', 'akta membaharui undang-undang',
      'matrimonial asset', 'harta sepencarian', '婚姻财产',
      'matrimonial home', 'rumah matrimonial',
      'interim injunction', 'injunksi interim', '临时禁制令',
      'division of assets', 'pembahagian harta', '财产分割',
      'islamic divorce', 'talak', 'fasakh', 'khuluk',
      'syariah divorce', 'perceraian syariah',
      'domestic violence', 'keganasan rumah tangga', '家庭暴力', 'dva', 'dva 1994', 'domestic violence act', 'akta keganasan rumah tangga',
      'protection order', 'perintah perlindungan', 'interim protection order', 'ipo', 'perintah perlindungan interim',
      'restraining order', 'perintah menahan', '限制令', 'perintah sekatan',
      'abusive husband', 'abusive wife', 'abusive spouse', 'abusive partner', 'suami ganas', 'isteri ganas', '施暴丈夫',
      'remove from lease', 'remove spouse from lease', 'keluarkan dari kontrak', 'buang nama suami dari kontrak',
      'co-tenant removal', 'remove cotenant', 'remove co-tenant',
      'exclusive occupation', 'penghunian eksklusif', 'occupation order'
    ],
    content: `DIVORCE + TENANTED / MATRIMONIAL PROPERTY:

LEGAL FRAMEWORK:
- NON-MUSLIM: Law Reform (Marriage and Divorce) Act 1976 (LRA 1976). Civil High Court jurisdiction.
- MUSLIM: Islamic Family Law Enactment (state-specific, e.g., IFLE Selangor 2003, IFLE WP 1984). Syariah Court jurisdiction.
- NEVER cross-jurisdictional: convert to Islam mid-marriage does NOT dissolve civil marriage automatically; must still obtain civil decree.
- East Malaysia: Sabah/Sarawak have minor procedural variations.

KEY PROVISIONS FOR PROPERTY DIVISION:
- LRA 1976 s.76: Division of matrimonial assets.
  * Jointly acquired: default 50/50 (but adjusted for contributions — financial, non-financial, domestic).
  * Solely acquired by one party, other contributed (e.g., domestic work, childcare): court has discretion to award a share.
  * Acquired before marriage + not jointly maintained: usually stays with original owner.
- LRA 1976 s.77 — maintenance and division orders after decree.
- LRA 1976 s.103 — interim orders / injunctions.
- Islamic Family Law: harta sepencarian (jointly acquired matrimonial assets). Principles similar to LRA but applied via Syariah court with Islamic jurisprudential lens.

STANDARD POSITION WHILE DIVORCE IS PENDING:
- Property in joint names: NEITHER party can unilaterally sell, mortgage, or encumber without the other's consent (or court order).
- Existing tenancies: both parties share landlord rights — tenant can continue paying rent into joint account.
- Rent collected during pendency: often held in escrow / solicitor's stakeholder account pending final division.

"EX-WIFE BLOCKING TENANCY RENEWAL / SALE" — YOUR OPTIONS:
1. INTERIM INJUNCTION (LRA s.103): Apply to court for order allowing you to execute tenancy/sale in the interim. Court considers: (a) is the tenancy at market value? (b) is the proposed action in best interest of both parties? (c) is the objection reasonable or tactical?
2. COURT-APPROVED SALE: If sale will satisfy both parties' divorce settlement, apply for court-approved sale with proceeds held in escrow until division finalized.
3. PARTITION ACTION (NLC s.140): If one co-owner refuses to cooperate, apply to partition — court can order sale and division of proceeds. Available even outside divorce context.
4. NEGOTIATION + CONSENT ORDER: Mediation → agreed settlement → consent order filed in court. Faster, cheaper (RM5K-15K). Avoids trial (RM80K-200K).

MATRIMONIAL HOME vs INVESTMENT PROPERTY (different treatment):
- MATRIMONIAL HOME: primary residence. Court gives strong preference to non-earning / custodial spouse with children. Often awarded to that spouse outright or with deferred sale.
- INVESTMENT PROPERTY (rental units): treated as financial asset. Valued at market, divided based on contributions. Tenancies often kept running during proceedings.

RENTAL INCOME DURING PROCEEDINGS:
- Best practice: open stakeholder account, tenant pays rent into it, both parties (or their solicitors) jointly sign withdrawals.
- Common: solicitor's client account acts as neutral holder.
- Tenant's position: keep paying to existing account unless informed in writing by BOTH parties. If one party disputes, hold rent in trust (notify both).

TENANT SIDE — LANDLORD COUPLE DIVORCING:
- Keep paying rent as usual unless you receive joint written instruction to change.
- Do NOT be drawn into either side's conflict — neutral position only.
- If landlords dispute who is owner: pay into solicitor's stakeholder account (landlord must arrange) and document.
- Tenancy continues per original terms; divorce does not terminate tenancy.
- Deposit: remains held by whoever received it. At tenancy end, both spouses must jointly approve refund/deduction (or per court order).

ISLAMIC DIVORCE SPECIFICS:
- Talak (husband pronounces divorce), Khuluk (wife-initiated, with compensation), Fasakh (annulment via court), Ta'liq (conditional divorce triggered).
- Harta sepencarian: contributions considered by Syariah Court.
- Idah period (waiting period, ~3 months / menstrual cycles): husband typically provides maintenance + accommodation. Matrimonial home cannot be sold during idah without wife's consent.
- Mut'ah (consolation gift): discretionary award.
- Nafkah (maintenance): ongoing obligation where applicable.

CROSS-CUTTING: CHILD CUSTODY + MATRIMONIAL HOME:
- If there are young children, court tends to award use (not necessarily ownership) of matrimonial home to custodial parent until children reach age 18.
- Ownership may be divided 50/50 but "right to live" goes to custodial parent.
- Common outcome: "deferred sale" — property sold when youngest child turns 18 or custodial parent remarries.

COMMON TRAPS:
- Transferring property to a "friend" or LLC during divorce to dodge division = unlawful disposition, voidable; courts impose penal costs.
- Letting tenancy lapse as "leverage" — court can order the other spouse to manage the asset and dock your share if you caused rent loss.
- Renting property out suddenly during divorce without notice = unauthorised dealing; spouse can apply for injunction.
- Ignoring interim orders = contempt of court; fines + imprisonment possible.
- Taking "cash rent" off the books to hide income = tax evasion + distorts division share.

PRACTICAL TIMELINE:
- Pre-filing (mediation): 2-4 months (optional but often required first).
- Filing + Case Management: 2-3 months.
- Trial: 6-12 months (contested) / 1-2 months (uncontested, consent).
- Division enforcement: 3-6 months post-decree.
- Total typical: 12-24 months contested; 3-6 months amicable consent.

COSTS (indicative, 2026):
- Uncontested consent petition: RM5K-15K total legal fees.
- Contested divorce with property + custody: RM80K-300K each side.
- Syariah court (uncontested): RM3K-8K.
- Syariah court (contested harta sepencarian): RM25K-100K.

TEMPLATES TO PREPARE:
- Letter to Tenant (re: interim rent arrangement during divorce).
- Stakeholder account instruction (rent deposit holding).
- Consent Order draft (property division + rental income allocation).
- Application for Interim Injunction (LRA s.103 for urgent matters).

═══════════════════════════════════════════════════════════════════════════════
DOMESTIC VIOLENCE ACT 1994 — REMOVING ABUSIVE CO-TENANT FROM LEASE
═══════════════════════════════════════════════════════════════════════════════
LEGAL FRAMEWORK:
- Domestic Violence Act 1994 (Act 521), as amended by Act A1538 (2017) — significantly broadened Protection Orders.
- Applies to spouses (civil and Islamic marriages), former spouses, de facto partners, children, incapacitated adults within household.
- Enforceable by civil police force — breach of Protection Order is an ARRESTABLE offence.

ORDERS AVAILABLE:
1. INTERIM PROTECTION ORDER (IPO) — s.4. Issued pending criminal investigation. Effective up to end of investigation / for prescribed period.
2. PROTECTION ORDER (PO) — s.5. Post-investigation, issued by Magistrate. Up to 12 months, renewable.
3. RESIDENTIAL ORDER — can grant VICTIM EXCLUSIVE OCCUPATION of the shared residence, even if victim is NOT the owner or sole lessee.
4. EXCLUSION ORDER — prohibits abuser from entering the residence OR approaching within a specified distance.
5. ANCILLARY ORDERS — abuser to continue paying rent / utilities; compensation for injury; counselling; no contact.

LANDLORD'S LEGAL POSITION WHEN A PROTECTION ORDER EXISTS:
- You are bound to respect the Order even though you are not a party to the DVA proceedings.
- If Order gives victim exclusive occupation: do NOT readmit the abuser, do NOT hand over spare keys, do NOT allow "quick collection of belongings" without a police escort coordinated by victim / victim's lawyer.
- Do NOT unilaterally amend the lease (e.g., delete abuser's name) — a Protection Order does NOT automatically terminate the abuser's contractual tenancy; only a court lease-variation order or joint consent can do that.
- Continue to receive rent per existing lease. If Order requires abuser to keep paying but abuser defaults: pursue normal rent-default process against abuser while respecting victim's occupation rights.

STEP-BY-STEP FOR LANDLORD WHEN TENANT SERVES YOU WITH A PROTECTION ORDER:
1. Obtain certified copy of the Order. Read it carefully. Note: duration, exclusion distance, who pays rent, any landlord-specific direction.
2. Copy it into your tenant file + cloud backup.
3. Brief any on-site staff (guardhouse, condo security) — they must enforce the exclusion.
4. Change locks ONLY if (a) victim requests and (b) Order permits — typically yes. Tenant pays for change (unless Order says otherwise).
5. Document every contact the abuser attempts (date/time/channel). This evidence supports future enforcement.
6. If abuser tries to enter: do NOT physically intervene. Call 999. The Order makes it an arrestable offence.
7. At the end of the Order's term: consult with victim's lawyer before allowing any change. Extensions are common.

LEASE VARIATION — "REMOVE HUSBAND FROM LEASE" — HOW IT ACTUALLY HAPPENS:
Option A — MUTUAL CONSENT (rare post-abuse):
- Abuser signs formal deed of release from the lease.
- Victim executes new sole-name lease.
- Stamp the new lease.
- Re-calibrate deposit arrangement.

Option B — COURT-ORDERED LEASE ASSIGNMENT (more common):
- Victim's lawyer applies to High Court (Family Division) under LRA 1976 s.76 + s.103 for ancillary relief in divorce proceedings, OR under DVA framework for an ancillary property direction.
- Order directs landlord to execute new lease in victim's sole name.
- Landlord obliged to comply — refusal = contempt.
- Abuser's guarantor obligations may survive — carefully check.

Option C — LEASE ENDS, NEW LEASE STARTS:
- Allow existing lease to expire naturally.
- Refuse to renew with abuser. Offer new lease to victim only.
- Document reason (written Protection Order).
- Often cleanest route in short-term tenancies.

Option D — VICTIM RELOCATES:
- DVA framework provides emergency shelter referrals (WAO, All Women's Action Society, DV Unit JKM).
- Landlord may, with victim's instruction, terminate early without penalty on humanitarian grounds (many lease clauses now allow this).

LANDLORD RISK IF YOU MISHANDLE:
- Admitting abuser back = facilitating breach of Order = possible abetment charge s.511 Penal Code.
- Civil claim from victim for negligent breach of duty of care (recent cases suggest RM10,000-RM50,000 damages + costs).
- Reputational harm + agent's professional complaint.

WHEN ABUSER IS NOT ON THE LEASE (but moved in):
- Abuser is an UNAUTHORISED OCCUPANT with respect to the landlord.
- Landlord can serve direct notice to vacate on the abuser as unauthorised occupant (Specific Relief Act + tenancy terms).
- Victim's Protection Order gives further grounds.
- Coordinate with victim + police to minimise risk during removal.

DEPOSIT HANDLING IN DVA CASES:
- Default: held per original lease terms (both names).
- Recommended: hold in neutral stakeholder until clarity — both parties' written consent OR court order for release.
- At tenancy end, refund ONLY per joint instruction OR court order OR after proper notice/lodgment if one party can't be found.

STEP BY STEP FOR VICTIM (info for tenants who ask the chatbot):
1. Ensure safety first — leave if unsafe. Shelter via WAO (03-7956 3488) or local Women's Aid.
2. Lodge police report — ask for DVA Unit officer.
3. Visit Hospital Emergency for medical report (crucial evidence).
4. Apply for IPO at Magistrate's Court (DVA counter) within 7 days of report.
5. Engage legal aid (Yayasan Chow Kit, AWAM, WAO legal clinic) if can't afford lawyer.
6. Serve Order on landlord + keep acknowledgement.
7. Consider divorce + property division proceedings in parallel (LRA / Syariah).

SUPPORT CONTACTS (for Find.ai to surface in chatbot):
- WAO: 03-7956 3488 / Talian Kasih 15999
- Talian Nur (JKM DVA): 15999
- AWAM: 03-7877 0224
- Polis DV Unit: nearest police station + ask for PPM

APPLY / VERIFY HERE:
- Civil High Court Family Division: kehakiman.gov.my
- Syariah Court (state-specific): jksm.gov.my
- Legal Aid Department (can't afford lawyer): jbg.gov.my
- Bar Council Family Law Practitioners: malaysianbar.org.my
- Department of Social Welfare (JKM): jkm.gov.my`
  },

  abandonment: {
    keywords: [
      'abandoned', 'ditinggalkan', '弃置',
      'tenant disappeared', 'penyewa hilang', '租客失踪',
      'tenant ran away', 'penyewa lari',
      'abandoned property', 'harta ditinggalkan',
      'abandoned goods', 'barang ditinggalkan', '弃置财物',
      'left belongings', 'tinggalkan barang',
      'tenant skip', 'tenant skipped', 'kabur',
      'distress act', 'akta distres', 'akta menyita',
      're-let', 'sewa semula', '重新出租',
      'tenant no contact', 'penyewa tiada kontak',
      'empty unit tenant gone', 'unit kosong'
    ],
    content: `TENANT ABANDONMENT (disappeared, left belongings, re-letting):

LEGAL FRAMEWORK:
- Distress Act 1951 — landlord's right to seize goods for rent arrears + procedure for disposal.
- Contracts Act 1950 — tenancy contract obligations.
- Specific Relief Act 1950 — possession rights.
- Tort of Conversion (common law) — unauthorised disposal of tenant's goods → landlord liable for market value.
- Tort of Trespass to Goods — similar liability.

STAGE 1 — CONFIRM ABANDONMENT (not just tenant on holiday):
Classic abandonment indicators:
- Rent unpaid 2+ months, no contact.
- Utilities disconnected (TNB / IWK / Syabas — check with provider, they'll confirm).
- Unanswered calls/messages for 14+ days.
- Neighbours confirm tenant hasn't been seen.
- Unit shows signs of hasty departure (half-packed, food rotting, critical items missing).
- Mail piling up.

Do NOT assume abandonment from just:
- Dark windows (tenant may travel).
- 1-month rent default (tenant may be late).
- No reply to one message.

STAGE 2 — DOCUMENT AND SERVE NOTICE:
1. Physical inspection with witness (ideally MC security or a neighbour) — photograph everything, note state of utilities, food freshness, presence of belongings.
2. Serve "Notice to Quit / Notice of Presumed Abandonment":
   - Post one copy on the unit door (photograph it in situ with date/time).
   - Mail registered + AR to tenant's last known address (tenancy agreement address).
   - Email and WhatsApp to all contact numbers.
   - Notice to include: arrears owed, 14-day deadline to contact, warning that further steps will be taken.
3. Keep log: every message, phone call, visit — build the "reasonable diligence" trail.

STAGE 3 — RIGHT OF ENTRY + INVENTORY:
- After 14-day notice period expires + tenant still silent:
- Enter with at least 2 witnesses (MC rep, neighbour, your agent — never alone).
- Videotape the entry (continuous, no cuts) — this is evidence against accusations of theft.
- Inventory every item present: list + photo. Separate high-value (laptop, electronics, jewellery) from low-value (clothes, kitchenware).
- Note: landlord does NOT yet own tenant's goods. Distress Act procedure applies (see Stage 4).

STAGE 4 — DISTRESS ACT 1951 PROCEDURE (for goods worth anything):
- Apply for Warrant of Distress at Sessions Court in the district. Fee ~RM100-300. Sworn statement of rent arrears required.
- Court issues warrant → bailiff attends property, inventories goods, seizes them (or leaves impounded).
- Notice of Sale posted: goods auctioned after statutory period (typically 6 days for perishables, 14-30 days for other goods).
- Proceeds deducted for arrears + costs; any surplus held for tenant (6-year limitation for claim).
- Landlord PAID from sale proceeds. Any shortfall = civil claim against tenant.

STAGE 5 — LOW-VALUE OR PERISHABLE ITEMS (practical fast track):
- If goods appear to be worth less than cost of Distress Act procedure (e.g., old mattress, cheap clothes):
  1. Serve 30-day notice ("collect goods or they will be disposed").
  2. Send notice via multiple channels (post, email, WhatsApp).
  3. Publish notice in a local newspaper (optional but strong defence).
  4. After 30 days + no contact → dispose. Keep: inventory, photos, disposal receipts (donation centre, recycling), witness statement.
- Risk: tenant returns and sues for conversion. Your defence = reasonable notice + proportionate disposal + no personal benefit. Courts usually accept if trail is clean.

IF TENANT HAS LEFT VALUABLE ITEMS (laptop, car, jewelry):
- Do NOT dispose informally. High value = high conversion liability (full market value damages).
- Use full Distress Act procedure OR petition court for a "Disposal Order" in a summary application.
- Alternative: store professionally (self-storage unit, RM200-500/month) for 3-6 months. Charge storage cost to tenant account.
- Vehicle on premises: report to JPJ (may be stolen/unregistered), lodge police report — transfer legal responsibility before towing.

RE-LETTING — WHEN IS IT SAFE:
- Once possession is formally recovered (tenant surrendered OR Distress Act proceedings concluded OR court possession order), you can re-let.
- Before formal recovery, re-letting risks "constructive eviction" claim if tenant returns (even if tenant was the breach-maker).
- Document the "change of locks" with witness + notice to tenant's last contact.
- Deposit: after deductions (arrears, damage, disposal cost), residual returned to tenant's bank or held 6 months.

DEPOSIT APPLICATION:
- Deposit can be applied to: unpaid rent, damage costs, disposal/distress costs, utility arrears.
- Itemised list must be prepared (tenant may surface later and dispute).
- If deposit exceeds arrears → hold residual in client account for at least 6 months before disposing.

DANGER ZONES (DO NOT DO):
- Immediately throw out belongings = tort of conversion. Courts awarded RM20K-100K damages.
- Rent the unit again while tenant's goods are still inside — double exposure.
- Keep valuable tenant items for personal use = civil + criminal (Penal Code s.403-408 CBT).
- Change locks WITHOUT notice + witness + inventory — could be "self-help eviction" illegal under Specific Relief Act.

IF TENANT RESURFACES AFTER YOU RE-LET:
- Their remedy: damages if any, not possession (once you have re-let in good faith with proper notice).
- Your shield: the paper trail (notices, inventory, photos, witness statements, Distress Act warrant).
- Pay any residual deposit owed + itemised deduction — often ends the dispute.

TAX ON ABANDONED DEPOSIT RESIDUAL:
- Unclaimed deposit after 6 years → "forfeited" income to landlord. Declarable in Form BE / Form C year of forfeiture.
- Better practice: try to return via bank transfer (last known account). If bounces, hold in suspense ledger, declare only when definitively abandoned.

COMMON TRAPS:
- No written notice before entry → tenant sues for trespass even if they abandoned.
- Disposing of laptop/phone "because it was broken anyway" without inventory → conversion damages = cost of new device.
- Not photographing state of unit at entry → tenant claims "you stole my things" with no counter-evidence.
- Letting new tenant in before formally recovering possession → constructive eviction claim by original tenant.
- Not deducting disposal/storage cost from deposit → later hard to claim.

TEMPLATES TO PREPARE:
- Notice of Presumed Abandonment (14-day).
- Goods Collection Notice (30-day with disposal warning).
- Inventory + Photo Log (signed by witness).
- Warrant of Distress Application (Sessions Court).
- Re-letting Readiness Checklist.

APPLY / VERIFY HERE:
- Sessions Court (Distress Act warrant): kehakiman.gov.my → find Sessions Court by district.
- Malaysian Bar litigation practitioners: malaysianbar.org.my
- Self-storage facilities (for valuable items): Storhub, ExtraSpace, Space Valet
- Auction houses (distress sale): check with Sessions Court registry for approved bailiffs`
  },

  natural_disaster: {
    keywords: [
      'flood', 'banjir', '洪水',
      'flash flood', 'banjir kilat', '山洪',
      'natural disaster', 'bencana alam', '自然灾害',
      'force majeure', 'keadaan tak terelak', '不可抗力',
      'act of god', 'kehendak tuhan',
      'nadma', 'agensi pengurusan bencana',
      'disaster relief', 'bantuan bencana', '灾难救济',
      'landslide', 'tanah runtuh', '山体滑坡',
      'storm damage', 'kerosakan ribut', '风暴损害',
      'uninhabitable', 'tidak boleh diduduki', '不能居住',
      'rent abatement', 'pengurangan sewa', '减租',
      'rent suspension', 'penggantungan sewa',
      'contracts act s.57', 'frustration of contract',
      'earthquake', 'gempa', 'gempa bumi', '地震', 'aftershock', 'gegaran susulan',
      'ranau earthquake', 'ranau', '2015 earthquake', 'sabah earthquake', 'kundasang earthquake',
      'tsunami', 'tsunami 2004', 'gelombang tsunami',
      'haze', 'jerebu', '烟雾', 'open burning season',
      'volcanic', 'lahar',
      'act of god not covered', 'insurance denied flood', 'insurance denied earthquake'
    ],
    content: `NATURAL DISASTER (flood, storm, landslide) — tenancy, rent, insurance:

LEGAL FRAMEWORK:
- Contracts Act 1950 s.57 — frustration of contract (radical change in circumstances making performance impossible).
- Common law doctrine of force majeure (applies only if tenancy agreement has FM clause — not implied).
- National Disaster Management Agency Act 2011 (Act 805) — NADMA coordinates response.
- Insurance: FSA 2013 + specific policy terms (most fire policies EXCLUDE flood without rider).
- Local Government Act 1976 — PBT emergency powers.

DOCTRINE OF FRUSTRATION (Contracts Act s.57):
- When performance of contract becomes impossible through no party's fault, contract is discharged.
- Applied to tenancies when property destroyed (fire, earthquake, landslide) — tenant released from future rent, landlord released from provision of premises.
- NOT applied to temporary unavailability (e.g., 2-week flood clean-up) — partial performance still possible.
- Test: has the commercial purpose been fundamentally destroyed, or merely interrupted?

RENT ABATEMENT / SUSPENSION — WHEN:
- Property UNINHABITABLE (flood submerged ground floor, roof collapsed, fire gutted interior): rent may be abated or suspended.
- Most standard MY tenancy agreements have "damage clause": rent abates pro-rata if unit unusable, and tenant may terminate if repair >3-6 months.
- Without written clause: implied duty of quiet enjoyment + implied warranty of fitness (commercial tenancies) may allow abatement.
- Without clause AND not totally uninhabitable: rent continues. Tenant may sue for landlord's breach if landlord failed to repair.

FLOOD-SPECIFIC (Ganu, KL flash, Kelantan, Johor, 2021+ baseline):
- Flood plain zoning: check DID (Department of Irrigation & Drainage) map at did.gov.my — tenants and landlords should know risk level.
- If unit is in "frequent flood" zone (>1 major event per 5 years), disclose to tenant at inception (good practice, reduces disputes).
- Flash flood (urban drainage failure, not from river) — usually covered under "storm" peril + special perils rider.
- River flood (overflow) — strictly under flood rider.

INSURANCE TRIAGE — STEP BY STEP:
1. SAFETY FIRST: do not re-enter until fire/water/structural risk clears.
2. DOCUMENT: dated photos/videos (drone if possible), water marks on walls, damaged contents inventory with approximate values.
3. REPORT:
   - Insurer hotline (within 7 days, per most policies).
   - Police report (for contents loss / looting during evacuation).
   - PBT (for structural damage) — may trigger assessment + emergency order.
   - NADMA or MKN for official declaration (boosts insurance credibility + qualifies for federal aid).
4. MITIGATE: reasonable steps to prevent further damage — pump out water, board up windows, tarp roof, relocate salvageable items. KEEP RECEIPTS — claimable.
5. LOSS ADJUSTER: insurer sends one within 5-10 days. Do not sign discharge voucher until you've verified the settlement.

WHAT LANDLORD PAYS vs WHAT TENANT PAYS:
- LANDLORD: building structure, built-in fixtures (wardrobes, kitchen cabinets integral to unit), restoration of common areas in landed properties.
- TENANT: contents (their own furniture, electronics, clothes) — tenant's contents insurance handles this.
- GREY AREAS (clarify at tenancy inception):
  * Aircon — usually landlord's if installed; tenant's if tenant installed and can remove.
  * Curtains / blinds — usually tenant's if not built-in.
  * Washer/dryer — depends on who bought; typically landlord's if unfurnished lease.

FEDERAL / STATE DISASTER RELIEF:
- NADMA coordinated cash aid for affected households (Bantuan Korban Banjir RM1,000+ one-time for severely affected).
- MADANI / BMM (Bantuan Madani) supplements — amount varies per budget.
- State welfare: additional support in certain states (e.g., Kelantan "Bantuan Khas Rakyat" after major floods).
- Landlord relief: some banks offer mortgage deferment / hardship restructure (request via RCC — Rangkaian Credit Counselling or bank direct).
- Apply: nadma.gov.my | jkm.gov.my (Department of Social Welfare).

TENANT CAN TERMINATE — WHEN:
- If tenancy has "destruction" / "force majeure" clause → follow its terms (usually notice period + proportionate rent refund).
- If no clause + property is totally destroyed → Contracts Act s.57 frustration automatically discharges tenancy.
- If property is partially damaged + repair will take >3 months → tenant can typically serve termination notice (common clause).
- If repair is <3 months → tenant usually required to stay (with rent abatement during unusable period).

LANDLORD CAN TERMINATE / RELET — WHEN:
- If major damage = tenancy frustrated → landlord free to rebuild and re-let.
- If landlord elects NOT to rebuild (write-off): tenancy ends, tenant's deposit refunded pro-rata.
- If repair is being done + tenant has relocated: tenancy continues (rent abated during repair), tenant returns on completion.

RELIEF STEPS — LANDLORD CHECKLIST:
☐ Inspect property safely.
☐ Photo/video every damaged area before cleanup.
☐ Notify insurer within 7 days (even if no rider — open claim early).
☐ Pump water, salvage, mitigate — keep receipts.
☐ Notify tenant in writing of expected repair timeline.
☐ Offer rent abatement OR relocation OR termination per policy/law.
☐ Apply for disaster relief (NADMA, state welfare).
☐ Document all communications + expenses.
☐ Final settlement with insurer → negotiate for full restoration cost.

RELIEF STEPS — TENANT CHECKLIST:
☐ Evacuate safely, photograph damage to personal belongings.
☐ Activate contents insurance (if any).
☐ Seek landlord's position on abatement / termination.
☐ Apply for federal/state disaster aid.
☐ Keep receipts for emergency relocation (Airbnb, hotel, boxes).
☐ Document landlord's response timeline.

RENT ABATEMENT FORMULA (practical):
- Percentage abatement = % of unit unusable × days unusable / 30.
- Example: 60% of unit (ground floor) flooded, unusable 20 days. Abatement = 60% × 20/30 = 40% of month's rent deducted.
- If entire unit unusable: full rent suspension for affected period + deposit held in escrow.

INSURANCE DISPUTE — OFS PATH:
- If insurer denies flood claim citing "no rider" but policy schedule is ambiguous → appeal to Ombudsman for Financial Services (ofs.org.my). Free, binding on insurer up to RM250K personal / RM500K SME.
- Common denial grounds: late notification, insufficient mitigation, pre-existing damage.

PRACTICAL STRATEGIES:
- Install flood-resistant features (raised electrical sockets, aluminium doors on ground floor, drainage improvements) — premium discount available.
- Climate-change trend: consider periodic valuation + sum insured adjustment. Post-2021 reconstruction costs rose 25-40%.
- For commercial tenants in flood-prone zones: negotiate "flood day" clauses in tenancy (e.g., X free days/year when operations halted).

COMMON TRAPS:
- Assuming fire policy covers flood → it doesn't unless rider is specified.
- Failing to mitigate (not pumping water) → insurer reduces payout for "consequential loss."
- Starting repair before loss adjuster visits → claim may be disputed.
- No photo baseline of unit before tenancy → post-disaster disputes over "pre-existing" damage.
- Letting tenant handle insurance when unit is still landlord's → confused claims, delayed restoration.

TEMPLATES TO PREPARE:
- Damage & Mitigation Log (photo-stamped, dated).
- Rent Abatement Notice to Tenant (partial / full).
- Termination Notice (frustration / destruction trigger).
- Insurance Claim Bundle (photos, receipts, statement).
- Disaster Relief Application Checklist.

APPLY / VERIFY HERE:
- NADMA: nadma.gov.my | 03-8870 4800
- DID Flood Map: did.gov.my → Flood Risk Map
- Dept Social Welfare (JKM): jkm.gov.my | 15999
- MKN (National Security Council): mkn.gov.my
- OFS (insurance dispute): ofs.org.my`
  },

  malay_reserved_land: {
    keywords: [
      'malay reserved land', 'tanah rizab melayu', 'malay reservation', 'tanah simpanan melayu', 'mrl', '马来保留地', '马来保留区', '保留地', 'trm',
      'bumiputera lot', 'bumi lot', 'bumiputra lot', 'bumiputera quota', 'lot bumiputera', 'kuota bumiputera', '土著保留单位',
      'native customary rights', 'ncr', 'ncr land', 'tanah adat', 'tanah ncr', 'kampung native', 'native title', '原住民土地',
      'sabah native', 'sarawak native', 'sabah native land', 'sarawak ncr', 'orang asli land', 'aboriginal land', 'tanah orang asli',
      'malay reserve', 'reserved to malays', 'non-malay cannot buy', 'non-malay buyer', 'non malay buyer', 'chinese buyer reserved',
      'nlc s.17', 'nlc section 17', 'malay reservation enactment', 'sabah land ordinance', 'sarawak land code',
      'void transaction', 'transaksi batal', '交易无效',
      'state authority consent', 'kebenaran pihak berkuasa negeri', 'epcn', 'bumi discount', 'bumi release'
    ],
    content: `MALAY RESERVED LAND, NATIVE CUSTOMARY RIGHTS, BUMI LOTS — ownership and transfer restrictions:

═══════════════════════════════════════════════════════════════════════════════
LEGAL FRAMEWORK
═══════════════════════════════════════════════════════════════════════════════
- National Land Code 1965 s.17 — Malay Reserved Land (MRL / Tanah Rizab Melayu) is land reserved exclusively for Malays in Peninsular Malaysia.
- State-specific MRL Enactments override where they differ (e.g. Perak, Selangor, Johor each have their own Malay Reservations Enactment). Always check the enactment of the state where the land sits.
- Sabah: Native Title land under Sabah Land Ordinance (Cap. 68) — restricted to Natives of Sabah (as defined in s.65).
- Sarawak: Native Customary Rights (NCR) land under Sarawak Land Code (Cap. 81) — restricted to Natives of Sarawak. Native Area Land (NAL) and Interior Area Land (IAL) also restricted.
- Aboriginal Peoples Act 1954 — Orang Asli reserves.
- Bumiputera Quota Lots under Housing Development Act 1966 — state-specific % of units reserved at developer level (30-50% depending on state). Distinct from MRL — these are not "reserved land" per se; they are sales quota units.

═══════════════════════════════════════════════════════════════════════════════
WHO CAN OWN / RENT MRL?
═══════════════════════════════════════════════════════════════════════════════
- Own (register on title): only Malays (definition per relevant state enactment — ethnicity + religion Islam in most states).
- Lease / rent out: Malay owner CAN rent MRL to non-Malay tenants for residential or commercial use. Tenancy is permitted; transfer of title is not. Foreign tenant on MRL factory/shop is legal provided all other permits (business licence, work visa) are in order.
- Transfer to non-Malay: VOID. Any sale, assignment, gift, or charge to a non-Malay is null ab initio under NLC s.17(1). Money paid is recoverable but the title NEVER passes.
- Chargee/bank: cannot be non-Malay. Most banks route MRL financing through a special MRL-compliant lender or Bumi subsidiary.

═══════════════════════════════════════════════════════════════════════════════
KEY COMPLIANCE TRAPS FOR CN-MY CORRIDOR (and what Ken's platform must screen)
═══════════════════════════════════════════════════════════════════════════════
1. "Nominee arrangements" (Malay straw owner holding for Chinese buyer) are CRIMINALLY VOID. Sham trusts set aside; both parties at risk. No valid RPGT / stamp duty escape.
2. Selling MRL to a Chinese investor: agent commits an offence under some state enactments (e.g. Selangor MRE s.7 — up to 3 months jail).
3. Foreign investor wants to build a factory on MRL: only possible via long lease (≤99 years) from Malay owner, with State Authority consent, AND provided land use is already industrial. Foreign tenant does NOT need NLC s.433B consent for mere tenancy — only for TITLE acquisition.
4. Bumi quota lot being resold from a Malay seller to a non-Malay buyer: needs Bumi Release (pelepasan Bumi) from the State Authority. Process: file with state Land Office → committee review → fee (often 0.5%-2% of market value). Timeline 3-12 months.
5. Agent's duty: always check title (geran) BEFORE listing. If title says "Rizab Melayu" / "Malay Reservation" → flag immediately. Proceeding with a sale to non-Malay = negligence + regulatory breach (BOVAEA).
6. Sabah native title: requires buyer to be Native as defined. Company ownership must be >50% Native + managed by Natives. Nominee structures void. State Minister may grant exemption in rare cases.
7. Sarawak NCR: NCR cannot be sold to non-Natives. Can be leased for a term with State Authority consent in some cases. NCR status is being actively litigated — always verify current gazette.

═══════════════════════════════════════════════════════════════════════════════
HOW TO VERIFY LAND STATUS (before any transaction)
═══════════════════════════════════════════════════════════════════════════════
1. Conduct an official Land Search at the Pejabat Tanah dan Galian (PTG). RM50-RM100 per title.
2. Look for these endorsements on the geran:
   - "Rizab Melayu" / "Malay Reservation" / "Tanah Rizab" — MRL.
   - "Tanah Adat" / "Native Title" — Sabah native / Sarawak NCR.
   - "Syarat Nyata" (express condition) restricting transfer — must comply.
   - "Sekatan Kepentingan" (restriction in interest) — consent required.
3. Cross-check with state Land Office gazette for any reservation notification.
4. Obtain written confirmation from PTG before exchanging contracts.

═══════════════════════════════════════════════════════════════════════════════
WHAT IF YOU ALREADY BOUGHT MRL AS A NON-MALAY?
═══════════════════════════════════════════════════════════════════════════════
- Transfer is void. Title does NOT pass. The Malay vendor remains owner on paper.
- Buyer's remedy: recovery of purchase price under law of restitution + damages against vendor and agent.
- Limitation: 6 years from discovery of voidness (Limitation Act 1953).
- Report the agent to BOVAEA — if licensed, disciplinary action + restitution order possible.
- Criminal prosecution of the vendor / agent may proceed independently.
- SDSAS stamp duty already paid: claim refund from IRB via Form PDS 4 (adjudication reversal) within statutory timeline.

═══════════════════════════════════════════════════════════════════════════════
PRACTICAL DECISION TABLE (Ken's platform should display this)
═══════════════════════════════════════════════════════════════════════════════
+-----------------------------+--------------------+------------------+-----------------+
| Land type                   | Malay/Native buys  | Non-Malay buys   | Foreign buys    |
+-----------------------------+--------------------+------------------+-----------------+
| Normal freehold title       | OK                 | OK + stamp duty  | OK + consent    |
| Malay Reserved Land         | OK                 | VOID             | VOID            |
| Bumi quota lot (new dev)    | OK                 | Needs release    | Very difficult  |
| Bumi quota lot (sub-sale)   | OK                 | Needs release    | Very difficult  |
| Sabah Native Title          | Native OK          | VOID unless exempt| VOID           |
| Sarawak NCR                 | Native OK          | VOID mostly       | VOID           |
| Orang Asli reserve          | OA OK              | VOID              | VOID            |
+-----------------------------+--------------------+------------------+-----------------+

═══════════════════════════════════════════════════════════════════════════════
AGENT / LAWYER CHECKLIST
═══════════════════════════════════════════════════════════════════════════════
☐ Conduct PTG title search BEFORE listing.
☐ Flag any Malay / Bumi / Native endorsement in the listing description.
☐ Verify buyer's eligibility (ethnicity for MRL; Native status for Sabah/Sarawak).
☐ For Bumi quota resale: advise buyer on release process + timeline + fee.
☐ Keep written records — BOVAEA audit trail.
☐ Never accept "we'll use a nominee" arrangement — refuse the mandate.

APPLY / VERIFY HERE:
- PTG (state land office) | Search PTG of state of land
- BOVAEA / LPPEH (agent conduct): lppeh.gov.my
- State Land Office (e-Tanah portal for some states)
- National Legal Aid: jkm.gov.my`
  },

  money_laundering_amla: {
    keywords: [
      'amla', 'amlatfpua', 'anti money laundering', 'pencegahan pengubahan wang haram', '反洗钱',
      'cash deposit', 'large cash', 'rm50,000 cash', 'rm50000 cash', 'cash rent', 'prepaid rent', 'bulk rent', 'lump sum rent', '大额现金', 'prepay rent', 'rent prepay',
      'suspicious transaction', 'laporan urus niaga mencurigakan', 'str', 'ctr', 'cash threshold report',
      'bank flagged', 'bank compliance', 'aml flag', 'kyc check', 'edd', 'enhanced due diligence',
      'bnm aml', 'bnm guideline', 'bnm compliance',
      'source of funds', 'sumber dana', 'sumber kewangan', 'source of wealth', '资金来源',
      'tax evasion', 'elakkan cukai', '逃税',
      'pep', 'politically exposed person',
      'bank asked questions', 'bank wants source', 'bank freeze', 'account frozen'
    ],
    content: `ANTI-MONEY-LAUNDERING (AMLA) — large cash rent, suspicious deposits, bank queries:

═══════════════════════════════════════════════════════════════════════════════
LEGAL FRAMEWORK
═══════════════════════════════════════════════════════════════════════════════
- Anti-Money Laundering, Anti-Terrorism Financing and Proceeds of Unlawful Activities Act 2001 (AMLATFPUAA 2001, commonly "AMLA").
- BNM AML/CFT Guidelines (updated periodically).
- Reporting Institutions (RIs): banks, property developers, real estate agents (from 2014), lawyers, accountants — all bound to run KYC, EDD, and file Suspicious Transaction Reports (STR).
- Financial Intelligence Unit (FIU) at BNM receives STRs.
- Cash Threshold Reports (CTR): banks report all cash transactions ≥ RM50,000 (single or structured) as standard practice.
- Income Tax Act 1967 s.112-114 — interaction with tax evasion offences.

═══════════════════════════════════════════════════════════════════════════════
WHEN YOUR BANK CALLS (the "compliance is asking" scenario)
═══════════════════════════════════════════════════════════════════════════════
Scenario: tenant transfers RM50,000+ cash into your account as "prepaid rent". Bank's compliance department asks for explanation.

What you MUST do:
1. Respond promptly. Silence = account freeze.
2. Provide documented source: signed tenancy agreement showing rent schedule, invoice for prepayment, tenant's ID + company details.
3. If tenant is foreign / PEP / high-risk jurisdiction: attach tenant's own source-of-funds declaration.
4. Attach your last 2 years tax Form BE / C showing rental income declared.
5. Do NOT offer to "return the money" as a shortcut — that itself can be flagged as layering.

What bank may do:
- File STR to FIU regardless of your explanation (you won't be told).
- Place temporary hold on the specific tranche while verifying.
- Apply EDD — ongoing enhanced monitoring of your account for 12 months.
- If unsatisfied: file own STR + may offboard you (close account).

═══════════════════════════════════════════════════════════════════════════════
YOUR OWN REPORTING OBLIGATIONS AS A LANDLORD / AGENT
═══════════════════════════════════════════════════════════════════════════════
- If you are a real estate AGENT (REA/PEA/REN), you are a Reporting Institution under AMLA First Schedule. You MUST:
  * Conduct CDD / KYC on both parties to a sale or lease ≥ RM50,000 (practically every transaction).
  * Keep records for 6 years post-transaction.
  * File STR within a reasonable period when you suspect funds are proceeds of unlawful activity.
  * Designate a Compliance Officer (CO) if firm has ≥ 5 agents.
- If you are a PRIVATE LANDLORD (not in the business): not directly an RI, but you can still be prosecuted as a "party to" a money-laundering offence if you knowingly / with wilful blindness accept tainted funds.
- Penalty (s.4 AMLA): up to RM5 million fine OR 5 years jail OR both, per charge. Property forfeiture likely.

═══════════════════════════════════════════════════════════════════════════════
RED FLAGS TO WATCH
═══════════════════════════════════════════════════════════════════════════════
- Rent paid in cash or third-party cheque, tenant reluctant to show source.
- Tenant offers to "pay 2 years upfront" for a small property, no tax reason.
- Payments structured just below RM50,000 (e.g. 3 x RM16,000 transfers).
- Payer name differs from lease name and not explained.
- Foreign tenant from high-risk jurisdiction (FATF grey/black list) with no business rationale.
- Source named as "personal savings" by a young foreign tenant with no declared income.
- Company tenant's owner is a PEP (or family of one).

═══════════════════════════════════════════════════════════════════════════════
BEST-PRACTICE LANDLORD WORKFLOW
═══════════════════════════════════════════════════════════════════════════════
1. Insist on rent via bank transfer from TENANT's own named account. Add a clause to lease.
2. For prepayment > RM20,000: request written source-of-funds explanation + tax residency declaration.
3. For foreign tenant: verify USCC (CN) / equivalent + run through Find.ai CN-MY Trust Link.
4. Keep tenant's ID, lease, receipts for 7 years (AMLA 6 + ITA buffer).
5. If anything smells off: walk away BEFORE money moves. The moment funds are in your account, options narrow.
6. If already received questionable funds: consult lawyer immediately; consider voluntary STR via your bank.
7. Declare ALL rental income in Form BE / C regardless of source. Evasion + AMLA = compound exposure.

═══════════════════════════════════════════════════════════════════════════════
INTERACTION WITH STAMP DUTY / TAX
═══════════════════════════════════════════════════════════════════════════════
- Large prepaid rent: calculate stamp duty on FULL lease value. Underpayment + AMLA flag = regulator will find both.
- IRB LHDN and FIU share data for enforcement. What one sees, the other often sees.
- Undeclared cash rent + AMLA STR = almost always triggers IRB audit.

APPLY / VERIFY HERE:
- BNM FIU: bnm.gov.my → AML/CFT Guidelines
- Companies Commission (SSM) beneficial ownership search: ssm.com.my (for tenant company background)
- MySPRM integrity check: sprm.gov.my (for PEP risk)`
  },

  cross_border_enforcement: {
    keywords: [
      'cross-border', 'cross border', 'lintas sempadan', '跨境',
      'sue china court', 'sue in china', 'china court', 'mahkamah china', '中国法院',
      'foreign judgment', 'reciprocal enforcement', 'reciprocal judgment', 'rejaa', 'rejaa 1958', 'reciprocal enforcement of judgments act',
      'my-cn enforcement', 'cn-my enforcement', 'china malaysia lawsuit',
      'state immunity', 'soe immunity', 'sovereign immunity', 'state-owned', 'state owned enterprise', 'kekebalan negara', '主权豁免', 'soe tenant',
      'arbitration clause', 'klausa timbang tara', 'aiac', 'ciac', 'cietac', 'international arbitration', 'icc arbitration', 'singapore arbitration',
      'new york convention', 'convention foreign arbitral',
      'customs seized', 'customs seizure', 'kastam rampas', 'customs raid', 'smuggling tenant', 'tenant smuggling', 'seludup', '走私', 'kastam warehouse', 'customs warehouse',
      'landlord liable customs', 'tenant smuggled'
    ],
    content: `CROSS-BORDER ENFORCEMENT — suing foreign tenants, SOE immunity, customs exposure:

═══════════════════════════════════════════════════════════════════════════════
LEGAL FRAMEWORK
═══════════════════════════════════════════════════════════════════════════════
- Reciprocal Enforcement of Judgments Act 1958 (REJAA 1958) — recognises money judgments from "listed countries" in the First Schedule. Listed: UK, Singapore, HK, NZ, Brunei, Sri Lanka, India (with reservations). CHINA is NOT listed. There is NO bilateral treaty between Malaysia and the PRC for civil judgment enforcement.
- Arbitration Act 2005 — Malaysia is a signatory to the New York Convention 1958. Foreign arbitral awards enforceable in Malaysia with limited grounds to refuse.
- AIAC (formerly KLRCA) — regional arbitration hub in KL.
- Mutual Legal Assistance in Criminal Matters Act 2002 — for criminal enforcement only, not civil.
- State Immunity — common law doctrine as applied by Malaysian courts: absolute/restrictive depending on case. Increasingly restrictive (commercial acts = no immunity).
- Customs Act 1967 — landlord-related provisions on seizure, forfeiture, and knowledge.

═══════════════════════════════════════════════════════════════════════════════
PART 1 — CAN I SUE A CHINESE TENANT IN CHINA OR MALAYSIA?
═══════════════════════════════════════════════════════════════════════════════
Answer: SUE IN MALAYSIA (where the tenancy + breach occurred). Do NOT sue in China.

Why:
- Cause of action arose in Malaysia, Malaysian property, Malaysian law applies → Malaysia is proper forum (forum conveniens).
- If you obtain judgment in Malaysia and want to enforce it against assets IN CHINA: you'll face significant hurdle because MY-CN has no reciprocal enforcement treaty.
- Chinese courts will enforce foreign judgments only on de facto reciprocity basis. In recent years (post-2015 Supreme People's Court reforms) this has opened slightly, but success is case-by-case and slow.
- Practical enforcement options against CN assets of judgment debtor:
  (a) Hire Chinese counsel to re-litigate in PRC court using your MY judgment as evidence. 2-4 years timeline.
  (b) If tenant has assets in HK, Singapore, UK → much easier via REJAA-listed countries.
  (c) If tenant has operating subsidiaries in MY → enforce against MY assets first.

Why NOT to sue in China:
- No jurisdiction unless contract specifies, or defendant is domiciled in China.
- Chinese courts generally decline cases about foreign immovable property.
- You'll lose on forum non conveniens even if you try.

═══════════════════════════════════════════════════════════════════════════════
PART 2 — ARBITRATION IS THE BETTER CLAUSE FOR CN-MY CORRIDOR
═══════════════════════════════════════════════════════════════════════════════
If you have an AIAC / CIETAC / SIAC / ICC arbitration clause, awards are ENFORCEABLE in both MY and PRC under the New York Convention.

Suggested clause for industrial lease with Chinese tenant:
"Any dispute arising out of or in connection with this Lease shall be finally settled by arbitration administered by the Asian International Arbitration Centre (AIAC) in accordance with its Arbitration Rules then in force. Seat: Kuala Lumpur. Language: English. Number of arbitrators: 1 (disputes ≤ RM5m) or 3. Governing law: Malaysia."

Why AIAC over CIETAC for MY landlord:
- Neutral venue (neither party's home forum).
- Enforceable in China under NY Convention.
- English-language proceedings.
- Cost: RM30k-RM150k for small-mid claims; faster than court (6-12 months).

═══════════════════════════════════════════════════════════════════════════════
PART 3 — STATE-OWNED ENTERPRISE (SOE) IMMUNITY CLAIMS
═══════════════════════════════════════════════════════════════════════════════
Scenario: Chinese SOE tenant defaults, claims "as a state entity, you cannot sue us."

Legal reality:
- Malaysian courts follow the RESTRICTIVE immunity doctrine (see Village Holdings, Commonwealth of Australia v Midford Malaysia, and more recent lines). Commercial acts = no immunity.
- Renting a factory / paying rent = commercial (jure gestionis) act. Immunity does NOT apply.
- Exception: acts performed in exercise of sovereign authority (jure imperii) — e.g. diplomatic/consular premises, military use.
- SOE is a corporate entity distinct from the State — the SOE's state ownership alone does not confer immunity; only the nature of the act matters.
- Service of process on SOE: through their registered office in Malaysia (if any subsidiary) or via Hague Service Convention route through Chinese Central Authority.

Practical rebuttal: "Your tenancy is a commercial activity. Under restrictive immunity doctrine as applied by Malaysian courts (Village Holdings and subsequent authority), commercial acts do not attract state immunity. Our claim will proceed."

If SOE persists: make this a preliminary issue (striking out application). Typical resolution 3-6 months.

═══════════════════════════════════════════════════════════════════════════════
PART 4 — CUSTOMS SEIZURE AT TENANT'S WAREHOUSE
═══════════════════════════════════════════════════════════════════════════════
Scenario: Customs raids your warehouse tenant, finds smuggled / undeclared goods. Customs asks you for records.

Legal exposure:
- Customs Act 1967 ss.119-138 — officers may enter, search, seize.
- s.135 — offences: up to 20 years jail / fines up to 20x value of goods.
- s.127 — PROPERTY USED for smuggling can be FORFEITED — this includes the warehouse building if landlord "knew or ought to have known".
- Landlord's shield: documented due diligence (lease checks, business verification, no "look the other way" behaviour). Find.ai's CN-MY Trust Link screening is defensible evidence.

Your response protocol:
1. Cooperate fully. Obstructing customs = offence s.133.
2. Provide lease, KYC records, payment history, correspondence.
3. Do NOT destroy / move any records — obstruction = separate offence.
4. Engage Customs-experienced lawyer within 24 hours.
5. Preserve rent status: tenant's default trigger is separate, but don't self-help while raid is live.
6. If forfeiture proceedings start: file Notice of Claim under s.128 within 1 month. Prove innocent landlord status.

Innocent landlord defence requirements:
- No knowledge of illegal activity.
- No constructive knowledge (ought to have known).
- Took reasonable steps to prevent — KYC, site visits, clear use clause in lease.
- Cooperated with authorities immediately on discovery.

Rent recovery: continue to accrue contractually. If tenant is arrested / company wound up, prove in liquidation. If goods seized but rent paid — you may still enforce against other tenant assets.

═══════════════════════════════════════════════════════════════════════════════
PART 5 — PRACTICAL LEASE PROTECTIONS FOR CN-MY INDUSTRIAL LANDLORDS
═══════════════════════════════════════════════════════════════════════════════
Must-have clauses:
1. Use clause — narrow, specific (e.g. "manufacture of plastic injection components only"). Any other use = breach.
2. Compliance clause — tenant warrants compliance with Customs, DOE, DOSH, DOSH, Immigration, MIDA.
3. Right of entry — landlord may inspect on 48-hour notice.
4. AIAC arbitration clause (see Part 2).
5. Parent company guarantee — require PRC parent to guarantee MY subsidiary's rent.
6. Security deposit — 3-6 months rent + bank guarantee (irrevocable, MY bank, tenor = lease + 6 months).
7. Indemnity — tenant indemnifies landlord for all customs / regulatory / environmental liability.
8. Immediate termination for regulatory breach.

APPLY / VERIFY HERE:
- AIAC: aiac.world
- Malaysian Bar International Committee (practitioner referrals): malaysianbar.org.my
- Royal Malaysian Customs (RMCD): customs.gov.my`
  },

  coliving: {
    keywords: [
      'coliving', 'co-living', 'co living', 'rumah kongsi', '共居',
      'rooming house', 'rumah sewa', 'boarding house', 'lodging house', '寄宿',
      'multiple tenants one unit', 'six tenants one unit', '6 tenants one unit', 'individual contracts per tenant', 'per room rental', 'room rental license',
      'pbt raid', 'pbt said illegal', 'pbt compound', 'pbt fine', 'kompaun pbt', 'pbt license rental', 'dewan bandaraya', 'majlis perbandaran',
      'zoning residential commercial', 'residential zoning', 'zoning breach', 'penggunaan tanah',
      'ubbl room size', 'overcrowding limit', 'habitable room',
      'colive operator', 'coliv', 'coliving operator', 'coliving startup'
    ],
    content: `COLIVING / ROOMING HOUSES — legality, PBT compliance, zoning risk:

═══════════════════════════════════════════════════════════════════════════════
LEGAL FRAMEWORK
═══════════════════════════════════════════════════════════════════════════════
- Local Government Act 1976 s.107 — PBT (pihak berkuasa tempatan) licensing power.
- Street, Drainage and Building Act 1974 (Act 133) — enforcement of building use.
- Uniform Building By-Laws 1984 (UBBL) — minimum room sizes, habitable room count, ventilation, toilet ratios.
- Strata Management Act 2013 — house rules may restrict room-rental within strata.
- Residential Tenancy Act 2026 — each individual room rental IS a residential tenancy if per-room contract. You now have multiple regulated tenancies in one unit.
- National Land Code 1965 — land use condition on title ("untuk kediaman sahaja" = residential only).

═══════════════════════════════════════════════════════════════════════════════
IS COLIVING LEGAL IN MALAYSIA?
═══════════════════════════════════════════════════════════════════════════════
Short answer: it depends on HOW you structure it and WHICH PBT.

LEGAL configurations:
(a) Single lease to one tenant who subleases with your written consent — permitted if lease allows, but you must ensure tenant does not breach PBT rules or strata by-laws.
(b) Coliving building (purpose-built, zoned commercial/mixed) with proper rooming house licence — legal in some PBTs (DBKL now issues specific "rumah sewa" licences; PJ, Subang Jaya, Shah Alam have their own frameworks).
(c) Individual room rentals in a residential condo/terrace with ≤ n occupants per unit (where n = UBBL / house rule limit) — grey, generally tolerated if below threshold.

LIKELY ILLEGAL configurations:
(a) 6+ unrelated adults in a normal double-storey terrace, individual per-room contracts, no PBT rooming-house licence, residential zoning only → this is what triggered Ken's scenario. PBT can compound RM500-RM2,000 per occupant OR per day of breach.
(b) Strata unit with >4 individual tenants where by-law caps at 4 persons → strata MC can fine under s.34 SMA 2013 + seek injunction.
(c) Any unit in a "Kawasan Perumahan" zoned strictly for single-family use.

═══════════════════════════════════════════════════════════════════════════════
PBT COMPOUNDS — WHAT TO DO WHEN YOU'RE RAIDED
═══════════════════════════════════════════════════════════════════════════════
1. Demand written notice + officer's ID + citation of by-law breached.
2. DO NOT pay on the spot. Compound notice gives 14-30 days.
3. Options:
   (a) Pay compound → quick + closes matter + on record.
   (b) Negotiate down to ~50-70% within compliance period.
   (c) Contest: file objection under Local Government Act s.103 OR appeal to Minister / Court.
4. Root-cause fix: reduce occupancy to legal threshold OR apply for change-of-use / rooming house licence.

═══════════════════════════════════════════════════════════════════════════════
ROOMING HOUSE LICENCE APPLICATION (DBKL example)
═══════════════════════════════════════════════════════════════════════════════
Eligibility: residential property meeting UBBL standards + compliant with strata by-laws if strata + zoned appropriately.

Submissions:
- Form for Rumah Tumpangan licence (or jurisdiction equivalent).
- Floor plan showing room sizes (min 6.5 m² per single room, 11 m² double).
- Fire safety certificate (smoke detectors, extinguishers, two exits for 10+ occupants).
- Building inspection (DBKL officer visits).
- JMB/MC consent letter if strata.
- Health Dept clearance (food prep shared kitchen).

Fee: RM100-RM500 annual. Renewal yearly.

Timeline: 3-6 months.

═══════════════════════════════════════════════════════════════════════════════
STRATA COLIVING — EXTRA LAYER
═══════════════════════════════════════════════════════════════════════════════
- Check house rules: many MCs cap at 4 adult occupants or require MC consent for per-room rental.
- MC can invoke SMA s.70(1) for by-law breach; fines + injunction possible.
- Retrospective by-laws (post-2015 amendment) can apply — see strata topic.
- Condo access cards: limit per unit; MC may refuse to issue additional cards for 6+ tenants → practical control mechanism.

═══════════════════════════════════════════════════════════════════════════════
TAX + CONTRACTUAL IMPLICATIONS
═══════════════════════════════════════════════════════════════════════════════
- Each individual room lease is separately stampable under SDSAS 2026 if per-room contract.
- Income per tenant flows to landlord; must declare FULL gross rental in Form BE.
- Deductible expenses: prorated per UBBL area used.
- Insurance: normal HO policy may EXCLUDE multi-occupancy / rooming house use → get specific rider.

═══════════════════════════════════════════════════════════════════════════════
PRACTICAL CHECKLIST BEFORE YOU START COLIVING
═══════════════════════════════════════════════════════════════════════════════
☐ Check PBT zoning (PBT planning counter, RM30).
☐ Check strata by-laws if applicable.
☐ Apply for rooming house licence (or equivalent) proactively.
☐ Install fire safety per UBBL.
☐ Issue per-room RTA-compliant lease with individual deposits.
☐ Keep occupant register (names + IC + date-in/out).
☐ Get specific landlord insurance for multi-occupancy.
☐ Consider CCTV in common areas (note PDPA signage).

APPLY / VERIFY HERE:
- DBKL rooming licence: dbkl.gov.my
- Other PBTs: check respective council website
- UBBL text: agc.gov.my (Attorney General's Chambers)`
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

  // Cap at 5 topics to keep prompt focused while reducing slice-off of correct topics
  // (v2.5 raise from 3 → 5 after stress-test revealed later-defined topics getting truncated)
  return matched.slice(0, 5);
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
