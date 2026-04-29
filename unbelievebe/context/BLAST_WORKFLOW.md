# BLAST WORKFLOW

This file defines the complete end-to-end blast workflow for Mr Ken's real estate lead generation. Claude follows this workflow every blast session without being asked.

---

## OVERVIEW — HOW THE BLAST SYSTEM WORKS

```
Master List Excel
      ↓
Claude filters contacts (new only, correct status)
      ↓
Claude generates personalised messages by property type
      ↓
Mr Ken approves messages
      ↓
WhatsApp API sends blasts (Morning 9AM + Evening 7PM)
      ↓
Replies come in → Claude extracts data → logs to Lead Capture Excel
      ↓
Master list status updated
      ↓
End of day report sent to Mr Ken
```

---

## STEP 1 — FILTER CONTACTS FROM MASTER LIST

Before every blast, Claude filters the master list and produces a clean blast-ready list.

### Filter rules

| Status | Action |
|---|---|
| Pending | Include — ready to blast |
| Sent | Exclude — already blasted, do not repeat |
| Replied | Exclude — already a lead, handle separately |
| No Reply | Exclude unless Mr Ken triggers follow-up |
| Duplicate | Exclude — never blast duplicates |
| Do Not Contact | Exclude — permanent exclusion |

### Property type detection
Claude reads the ADDRESS column in the master list to detect property type:
- Unit number starts with T, N, Level, Floor, #, or contains "Suite", "Residence", "Condominium" → Condo / Apartment
- Address contains "Jalan", "Lorong", "Taman", with house number → Landed
- Address contains "Lot", "Industrial", "Factory", "Warehouse", "Perindustrian" → Industrial
- Address contains "Kedai", "Shoplot", "Ground Floor commercial" → Commercial
- If unclear → flag to Mr Ken before blasting

### Output — blast-ready list per session

Claude produces a summary before every blast:

```
Blast Ready Report — [Date] [Morning/Evening]

Total in master list: [X]
Filtered out (already sent/replied/duplicate): [X]
Ready to blast today: [X]

Breakdown by property type:
- Condo / Apartment: [X] contacts
- Landed: [X] contacts
- Industrial: [X] contacts
- Commercial: [X] contacts
- Unclassified (needs review): [X] contacts

Messages prepared: [X]
Awaiting Mr Ken approval before sending.
```

---

## STEP 2 — PERSONALISED MESSAGES BY PROPERTY TYPE

Every blast message is personalised with:
- Landlord name (from master list NAME column)
- Unit number (from master list UNIT column)
- Property type specific content
- Always ends with Ken's sign-off

### Template A — Condo / Apartment (English)
```
Hi [Name], I am Ken from Gather Properties. I noticed you own a unit at [Unit / Project]. I currently have tenants actively looking for a condo or apartment in this area. If your unit is available for rent, I would love to help you find a good tenant quickly. Please share the details — rental price, furnishing, and available date. Thank you.

Ken Tan | Gather Properties | REN 31548 | 016-713 5601
```

### Template B — Landed Property (English)
```
Hi [Name], I am Ken from Gather Properties. I noticed you own a property at [Unit / Address]. I have tenants looking specifically for landed properties — terrace houses, semi-detached, or bungalows — in this area. If your property is available for rent, I can help connect you with a verified tenant fast. Please share the rental price, furnishing, and available date. Thank you.

Ken Tan | Gather Properties | REN 31548 | 016-713 5601
```

### Template C — Industrial (English)
```
Hi [Name], I am Ken from Gather Properties. I noticed you own an industrial unit at [Unit / Address]. I work with manufacturing companies and businesses actively looking for factory or warehouse space in this area. If your unit is available for rent or sale, I would be happy to assist. Please share the details — asking price or rental, size, and available date. Thank you.

Ken Tan | Gather Properties | REN 31548 | 016-713 5601
```

### Template D — Commercial / Shoplot (English)
```
Hi [Name], I am Ken from Gather Properties. I noticed you own a commercial unit at [Unit / Address]. I have business tenants looking for shoplot or office space in this area. If your unit is available for rent or sale, I can help find the right tenant or buyer quickly. Please share the details — asking price or rental and available date. Thank you.

Ken Tan | Gather Properties | REN 31548 | 016-713 5601
```

### Template E — Malay landlord (Malay — use when landlord name is Malay)
```
Hai [Name], saya Ken dari Gather Properties. Saya dapati anda memiliki unit di [Unit / Project]. Saya ada penyewa yang sedang mencari hartanah di kawasan ini. Jika unit anda ada untuk disewa, saya boleh bantu carikan penyewa yang baik dengan cepat. Boleh kongsikan maklumat — harga sewa, perabot, dan tarikh boleh masuk? Terima kasih.

Ken Tan | Gather Properties | REN 31548 | 016-713 5601
```

### Language detection rule
Claude detects landlord ethnicity from name:
- Malay names (Ahmad, Muhammad, Siti, Nur, Abdul, Mohd, Farah, Haziq etc.) → Template E (Malay)
- Chinese names (Tan, Lim, Lee, Wong, Chong, Ng, Khor, Chan etc.) → Template A/B/C/D (English)
- Indian names (Kumar, Raj, Muthu, Siva, Priya, Anbu etc.) → Template A/B/C/D (English)
- Unclear → Default to English

### Message rules — always apply
- Always personalise with landlord NAME and UNIT — never send a generic blast
- Never use repeated identical emojis
- Never mention "broadcast list", "WhatsApp list", or "add you to my list"
- No markdown symbols — no asterisks, hashtags, or dashes
- Always end with Ken's sign-off: Ken Tan | Gather Properties | REN 31548 | 016-713 5601
- Maximum 5 lines per message — keep it short and readable on mobile

---

## STEP 3 — APPROVAL GATE

Claude never sends without Mr Ken's approval. Every blast session:

1. Claude prepares all messages and presents the Blast Ready Report
2. Claude shows Mr Ken a sample of each template being used (one example per property type)
3. Mr Ken reviews and says "approved" or requests changes
4. Claude does not send a single message until approval is confirmed
5. If Mr Ken wants to edit a template — Claude updates and shows revised version before sending

### Approval message from Claude to Mr Ken
```
Blast ready for [Date] [Morning/Evening]

[X] messages prepared across [X] property types.
Sample messages for your review:

CONDO ([X] contacts):
"Hi Ahmad, I am Ken from Gather Properties..."

LANDED ([X] contacts):
"Hi Tan Wei Ming, I am Ken from Gather Properties..."

INDUSTRIAL ([X] contacts):
"Hi Siti, I am Ken from Gather Properties..."

Please reply APPROVED to send, or tell me what to change.
```

---

## STEP 4 — BLAST EXECUTION

After Mr Ken approves:

1. WhatsApp API sends messages to all contacts in the blast-ready list
2. Claude updates master list STATUS column:
   - Pending → Sent
   - Log date blasted in BLAST DATE column
   - Log which template was used in TEMPLATE column
3. Claude records in blast_performance_log.xlsx:
   - Date, session (morning/evening), project, template used, contacts blasted

### Master list columns updated after blast

| Column | Update |
|---|---|
| BLAST STATUS | Pending → Sent |
| BLAST DATE | Today's date |
| TEMPLATE USED | A / B / C / D / E |

---

## STEP 5 — REPLY CAPTURE

When a landlord replies to the blast:

### Immediate action — within minutes
1. Claude reads the reply
2. Detects keywords (see LEAD CAPTURE keyword list below)
3. Extracts all unit details
4. Logs into Lead Capture Excel — Sheet 1
5. Updates master list STATUS: Sent → Replied
6. Flags to Mr Ken if it is a HOT LEAD (see lead quality scoring below)

### Lead quality scoring — flag immediately

| Score | Criteria | Action |
|---|---|---|
| Hot | Replies with price + available date + furnishing | Flag to Mr Ken immediately — WhatsApp alert |
| Warm | Replies with some details but not complete | Log and include in end of day report |
| Cold | Replies with "not available" or "owner stay" | Update status to Dead Lead |
| Wrong number | Reply indicates wrong person | Update status to Do Not Contact |

### Hot lead alert to Mr Ken (immediate)
```
HOT LEAD — [Time]

Landlord: [Name] | [Contact]
Unit: [Unit] | [Project]
Rent: RM[X] | Sale: RM[X]
Furnished: [Condition]
Available: [Date]
Remark: [Any extra details]

Reply came in [X] minutes after blast. Act fast.
```

### Keyword detection list
Claude scans every reply for these keywords:

| Keyword detected | Maps to column |
|---|---|
| rent, rental, per month, RM, monthly | Rental Price |
| sell, sale, selling, asking | Selling Price |
| available, vacant, ready, from, move in | Available Date |
| furnished, partial, unfurnished, bare, aircond | Furnished |
| room, bedroom, br, bilik | Rooms |
| condo, apartment, terrace, semi-d, bungalow, factory, warehouse | Property Type |
| project name, located at, unit at | Project / Condo Name |
| not available, owner stay, already rented | Dead Lead — update status |
| wrong number, not me, who is this | Do Not Contact — update status |

---

## STEP 6 — END OF DAY REPORT

Sent every evening after the 7PM blast has gone out.

### WhatsApp report to Mr Ken
```
End of Day Report | [Date]

Morning Blast: [X] sent | [X] replied | [X] leads captured
Evening Blast: [X] sent | [X] replied | [X] leads captured
Total Today: [X] blasted | [X] replied | Reply rate: [X]%

HOT LEADS ([X]):
1. [Name] | [Unit] | [Project] | RM[X] | [Furnished] | Avail: [Date]
2. [Name] | [Unit] | [Project] | RM[X] | [Furnished] | Avail: [Date]

WARM LEADS ([X]):
1. [Name] | [Unit] | [Project] | Incomplete details — needs follow up

DEAD LEADS ([X]):
[X] contacts marked as owner stay / not available / wrong number

Master list and Lead Capture Excel updated.
Full details saved to blast_performance_log.xlsx.
```

### Excel updates after end of day
1. Lead Capture Excel — all new leads logged with full details
2. Master list — all status columns updated
3. blast_performance_log.xlsx — session logged with reply rate

---

## STEP 7 — FOLLOW-UP BLAST

Follow-up blasts are NEVER automatic. Only triggered when Mr Ken asks.

### Follow-up rules
| Rule | Detail |
|---|---|
| Trigger | Mr Ken says "follow up" or "send follow up to [X]" |
| Who gets it | Contacts with status = No Reply — as specified by Mr Ken |
| Message | Fresh message — never repeat the original blast |
| Approval | Always show draft to Mr Ken before sending |
| Tone | Warmer and softer than original blast |

### Follow-up template (English)
```
Hi [Name], just a gentle follow-up from my earlier message. I still have tenants actively looking for units in [area / project]. If you are open to listing your unit, I would be happy to help find the right tenant quickly. No obligation — feel free to reach out anytime.

Ken Tan | Gather Properties | REN 31548 | 016-713 5601
```

### Follow-up template (Malay)
```
Hai [Name], sekadar mengikuti mesej saya yang terdahulu. Saya masih ada penyewa yang sedang mencari unit di kawasan ini. Jika anda berminat untuk menyenaraikan unit anda, saya sedia membantu. Tiada sebarang obligasi — sila hubungi saya bila-bila masa.

Ken Tan | Gather Properties | REN 31548 | 016-713 5601
```

---

## BLAST RULES — NEVER BREAK THESE

1. Never blast without Mr Ken's approval — no exceptions
2. Never send duplicate contacts — check master list before every session
3. Never repeat the same message to the same contact within 30 days
4. Never mention "broadcast list", "WhatsApp list", or "add to list"
5. Never use repeated identical emojis
6. Always personalise with name and unit — never generic
7. Always update master list status after every session
8. Always log every session in blast_performance_log.xlsx
9. Hot leads flagged to Mr Ken immediately — not at end of day
10. Claude can ADD to Excel only — never edit or delete without Mr Ken's greenlight

---

## BLAST SESSION CHECKLIST — Claude runs this before every session

Before morning blast (9AM):
- [ ] Filter master list — identify pending contacts
- [ ] Detect property type for each contact
- [ ] Generate personalised messages by template
- [ ] Prepare Blast Ready Report
- [ ] Send report to Mr Ken for approval
- [ ] Wait for approval before sending

After blast:
- [ ] Update master list — Pending → Sent + blast date + template used
- [ ] Log session in blast_performance_log.xlsx
- [ ] Monitor for replies
- [ ] Flag hot leads immediately

After evening blast + replies:
- [ ] Capture all replies into Lead Capture Excel
- [ ] Update master list status for all replies
- [ ] Generate end of day report
- [ ] Send report to Mr Ken
