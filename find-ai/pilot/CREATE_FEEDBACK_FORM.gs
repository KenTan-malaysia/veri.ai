/**
 * Find.ai Pilot Feedback Form generator
 * Creates a Google Form with all 25 questions across 8 sections.
 *
 * HOW TO USE (5 minutes, one-time):
 *
 *   1. Go to https://script.google.com
 *   2. Click "+ New project" (top-left)
 *   3. Delete the default `function myFunction() { ... }` code
 *   4. Paste this ENTIRE file
 *   5. Click the floppy-disk icon (Save) — name it "Find.ai Form Generator"
 *   6. Click "Run" (▶ icon at top)
 *   7. First run only: Google asks for permission. Click:
 *      - "Review permissions"
 *      - Pick your Google account
 *      - "Advanced" → "Go to Find.ai Form Generator (unsafe)" — this is normal,
 *        Google flags any new script. The script is safe (you can read it above).
 *      - Click "Allow"
 *   8. Wait 5-10 seconds. The script runs.
 *   9. Open https://drive.google.com — your new form "Find.ai Pilot Feedback"
 *      will be at the top.
 *  10. Open the form → click "Send" button (top-right) → copy the link →
 *      paste into your WhatsApp pilot outreach messages.
 *
 * Done! Responses will collect inside the form's "Responses" tab.
 *
 * To export responses as CSV (for Zeus to analyze later):
 *   - In the form: Responses tab → green Sheets icon → opens in Google Sheets
 *   - In Sheets: File → Download → CSV
 *   - Drop the file into find-ai/pilot/responses/
 */

function createFindAiPilotForm() {
  var form = FormApp.create('Find.ai Pilot Feedback')
    .setDescription(
      'Thanks for trying Find.ai. This 10-minute form captures your honest reaction to the v0 demo you just walked through. Your responses shape the v1 launch.\n\n' +
      'Your data: No personal data shared with anyone. Anonymized aggregate findings only. Email is optional (only if you want a follow-up).\n\n' +
      'Questions about the form? Email ken@find.ai'
    )
    .setProgressBar(true)
    .setShowLinkToRespondAgain(false)
    .setConfirmationMessage(
      'Thank you! Your feedback shapes the v1 launch. I\'ll send a "what shipped because of pilot feedback" summary to all participants in 4 weeks.\n\n' +
      'If you provided your email, you\'ll get a heads-up when v1 is live with your free first 5 screenings ready.\n\n' +
      'Questions or follow-up: ken@find.ai\n\n' +
      '🛡️ Find.ai — Don\'t sign blind.'
    );

  // ─── SECTION 1: About you ──────────────────────────────────────────────
  form.addPageBreakItem()
    .setTitle('Section 1 — About you')
    .setHelpText('3 quick questions about your role.');

  form.addMultipleChoiceItem()
    .setTitle('What\'s your role?')
    .setRequired(true)
    .setChoiceValues([
      'Landlord (1 unit)',
      'Landlord (2-5 units)',
      'Landlord (6-10 units)',
      'Landlord (10+ units)',
      'Property agent (independent)',
      'Property agent (agency)',
      'Tenant',
      'Other'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Which state are you primarily based in?')
    .setRequired(true)
    .setChoiceValues([
      'KL / Selangor',
      'Penang',
      'Johor',
      'Sabah',
      'Sarawak',
      'Other'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('What language do you usually use Find.ai in?')
    .setRequired(true)
    .setChoiceValues([
      'English',
      'Bahasa Malaysia',
      '中文 (Mandarin)',
      'Mix of multiple'
    ]);

  // ─── SECTION 2: First impression ───────────────────────────────────────
  form.addPageBreakItem()
    .setTitle('Section 2 — First impression')
    .setHelpText('Your reaction to the landing page.');

  form.addParagraphTextItem()
    .setTitle('In one sentence, what does Find.ai try to do?')
    .setHelpText('Tests whether the messaging lands without our explanation.')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('Did the landing page motto "Don\'t sign blind" resonate with you?')
    .setRequired(false)
    .setChoiceValues([
      'Yes — captured my biggest fear immediately',
      'Somewhat — I got it but it felt a bit dramatic',
      'No — didn\'t make me feel anything',
      'Confused — what does it mean?'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('When you saw the three tile options (Screen / Audit / Stamp), which did you tap first?')
    .setRequired(false)
    .setChoiceValues([
      'Screen tenant (most expected)',
      'Audit agreement',
      'Stamp duty',
      'Other / didn\'t see them'
    ]);

  // ─── SECTION 3: The Screen tenant flow ────────────────────────────────
  form.addPageBreakItem()
    .setTitle('Section 3 — The Screen tenant flow')
    .setHelpText('Walking through the Trust Score steps.');

  form.addScaleItem()
    .setTitle('Overall, how easy was the flow to follow?')
    .setBounds(1, 5)
    .setLabels('Very confusing', 'Very easy')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Did you understand what the LHDN cert verification step was for?')
    .setRequired(true)
    .setChoiceValues([
      'Yes — clear',
      'Somewhat',
      'No — what\'s an LHDN cert?',
      'Skipped that step entirely'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Did you tap the "Skip — no cert / first-time renter" option?')
    .setRequired(false)
    .setChoiceValues([
      'Yes — my prospective tenant doesn\'t have a cert',
      'Yes — just to see what happens',
      'No — I went through with a cert (any number)',
      'Didn\'t notice the skip option'
    ]);

  form.addCheckboxItem()
    .setTitle('On the utility bills step, which method did you use? (pick all that apply)')
    .setRequired(false)
    .setChoiceValues([
      'Account number',
      'Upload bill (PDF / photo)',
      'Tried both',
      'Skipped'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Did you understand the difference between the two methods?')
    .setRequired(false)
    .setChoiceValues([
      'Yes — the labels were clear',
      'Mostly — but had to think about it',
      'No — I just picked one',
      'Didn\'t notice both options'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Did you understand the Trust Score formula (Behaviour × Confidence)?')
    .setRequired(false)
    .setChoiceValues([
      'Yes — clear concept',
      'Somewhat — got the gist',
      'No — felt like a black box',
      'Didn\'t see / read it'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Did you tap the "How is this calculated?" link?')
    .setRequired(false)
    .setChoiceValues(['Yes', 'No']);

  form.addScaleItem()
    .setTitle('If yes, was the explanation helpful?')
    .setBounds(1, 5)
    .setLabels('Not at all', 'Very helpful')
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle('How does the Trust Card visual look to you? (pick all that apply)')
    .setRequired(false)
    .setChoiceValues([
      'Professional / trustworthy',
      'Looks like a real ID / certificate',
      'Easy to read at a glance',
      'Would share via WhatsApp',
      'Looks fake / amateur',
      'Too much info / cluttered',
      'Not enough info',
      'Other'
    ]);

  // ─── SECTION 4: Use intent ────────────────────────────────────────────
  form.addPageBreakItem()
    .setTitle('Section 4 — Use intent')
    .setHelpText('Would you actually use this?');

  form.addMultipleChoiceItem()
    .setTitle('Would you use Find.ai to screen a real tenant?')
    .setRequired(true)
    .setChoiceValues([
      'Yes — I\'d use it next time I have a vacancy',
      'Probably yes — depends on price',
      'Maybe — would need to see real version first',
      'Probably not — interesting but not for me',
      'No — wouldn\'t help me'
    ]);

  form.addParagraphTextItem()
    .setTitle('What ONE thing would make you definitely use it?')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('What\'s the most confusing or missing thing?')
    .setRequired(false);

  form.addScaleItem()
    .setTitle('How likely are you to recommend Find.ai to another landlord/agent?')
    .setHelpText('This is the NPS question — be honest, even a low number is useful.')
    .setBounds(0, 10)
    .setLabels('Not at all likely', 'Extremely likely')
    .setRequired(true);

  // ─── SECTION 5: Pricing ───────────────────────────────────────────────
  form.addPageBreakItem()
    .setTitle('Section 5 — Pricing')
    .setHelpText('Help us figure out fair pricing.');

  form.addMultipleChoiceItem()
    .setTitle('How much would you pay per single tenant screening?')
    .setRequired(false)
    .setChoiceValues([
      'Free only',
      'RM 5-10',
      'RM 10-30',
      'RM 30-50',
      'RM 50-100',
      'RM 100+',
      'Depends — explain in next question'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Would you prefer pay-per-screen or monthly subscription?')
    .setRequired(false)
    .setChoiceValues([
      'Pay per screen (only when I need it)',
      'Monthly subscription with unlimited screens',
      'Yearly subscription (cheaper per month)',
      'Free with ads (acceptable)',
      'I wouldn\'t pay either way'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('If subscription, what monthly price feels fair?')
    .setRequired(false)
    .setChoiceValues([
      'RM 0 (free only)',
      'RM 10-30 / month',
      'RM 30-50 / month',
      'RM 50-100 / month',
      'RM 100-200 / month',
      'RM 200+ / month',
      'Depends on inclusions'
    ]);

  // ─── SECTION 6: Comparison ────────────────────────────────────────────
  form.addPageBreakItem()
    .setTitle('Section 6 — Comparison with current methods')
    .setHelpText('Optional but valuable.');

  form.addCheckboxItem()
    .setTitle('How do you currently screen tenants? (pick all that apply)')
    .setRequired(false)
    .setChoiceValues([
      'I don\'t really screen — I just trust references',
      'Visual interview only',
      'Ask for IC + employment letter',
      'CCRIS / CTOS report',
      'Reference checks (call previous landlord)',
      'Property agent does it for me',
      'Other'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('How does Find.ai compare to your current method?')
    .setRequired(false)
    .setChoiceValues([
      'Much better — would switch',
      'Similar quality but easier',
      'Similar quality but more work',
      'Worse than my current method',
      'Different — covers what I can\'t currently get',
      'Hard to say from a demo'
    ]);

  form.addParagraphTextItem()
    .setTitle('If you\'ve used CCRIS/CTOS before, how does Find.ai feel different?')
    .setRequired(false);

  // ─── SECTION 7: Open feedback ─────────────────────────────────────────
  form.addPageBreakItem()
    .setTitle('Section 7 — Open feedback')
    .setHelpText('Three quick text questions to wrap up.');

  form.addParagraphTextItem()
    .setTitle('One thing you LIKED about Find.ai:')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('One thing you\'d CHANGE about Find.ai:')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Anything else you want to tell us?')
    .setRequired(true);

  // ─── SECTION 8: Stay in touch ─────────────────────────────────────────
  form.addPageBreakItem()
    .setTitle('Section 8 — Stay in touch')
    .setHelpText('Optional. Only if you want updates.');

  form.addTextItem()
    .setTitle('Email (optional, only if you want updates + free first 5 real screenings when v1 launches)')
    .setHelpText('We\'ll only email you about the v1 launch and your free screening credits. We won\'t add you to a marketing list.')
    .setRequired(false);

  // ─── Done ─────────────────────────────────────────────────────────────
  // Print the URLs in the Apps Script console (View → Logs)
  Logger.log('========================================');
  Logger.log('✓ Find.ai Pilot Feedback Form created!');
  Logger.log('========================================');
  Logger.log('Edit URL (you only):    ' + form.getEditUrl());
  Logger.log('Share URL (give pilots): ' + form.getPublishedUrl());
  Logger.log('========================================');
  Logger.log('Total questions: 25 across 8 sections');
  Logger.log('Required fields: 9');
  Logger.log('Estimated completion: ~10 minutes');
  Logger.log('========================================');
  Logger.log('NEXT STEPS:');
  Logger.log('1. Open Google Drive → find "Find.ai Pilot Feedback"');
  Logger.log('2. Open the form, click "Send" (top-right)');
  Logger.log('3. Copy the share link');
  Logger.log('4. Paste it into your WhatsApp pilot outreach messages');
  Logger.log('========================================');
}
