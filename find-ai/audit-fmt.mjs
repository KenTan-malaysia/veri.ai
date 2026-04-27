import { fmt } from './src/lib/chatFormat.js';

// 10 edge cases covering all callout icons + mixed languages
const tests = [
  { name: '✅ green multi-step (ZH blank-line)', input: '✅ **现在该做什么**\n\n1. 联系CCRIS\n2. 准备合约\n3. 盖章', must: ['1. 联系CCRIS','2. 准备合约'], mustNot: [] },
  { name: '🚫 warning multi-bullet (ZH)', input: '🚫 **常见错误**\n- 口头约定不算数\n- 滞纳金超过10%', must: ['warning-card','2 flags'], mustNot: [] },
  { name: '💰 cost (EN)', input: '💰 **Stamp duty** RM120 total<br/>- 2-year lease<br/>- RM2,000/mo', must: ['💰','RM120'], mustNot: [] },
  { name: '⚖️ law', input: '⚖️ Contracts Act 1950, s.71', must: ['law-card','Contracts Act'], mustNot: [] },
  { name: '📋 clause', input: '📋 **Deposit clause** should cap at 2 months rent', must: ['Deposit clause'], mustNot: [] },
  { name: '🔒 verified', input: '🔒 **Verified** CCRIS clear', must: ['Verified'], mustNot: [] },
  { name: '⚠️ guidance', input: '⚠️ Check the agreement first', must: ['Check the agreement'], mustNot: [] },
  { name: '🔴 consult lawyer', input: '🔴 **Consult a lawyer** before signing', must: ['Consult a lawyer'], mustNot: [] },
  { name: 'BM warning', input: '🚫 **Kesilapan biasa**\n- Perjanjian lisan tidak sah\n- Denda lewat melebihi 10%', must: ['warning-card','2 flags','Perjanjian lisan'], mustNot: [] },
  { name: 'mixed EN+ZH inline bold', input: '**Landlord** 业主 needs to stamp within 30 days.', must: ['<strong>Landlord</strong>','30 days'], mustNot: [] },
  { name: 'standalone paragraph (no callout)', input: 'Just a plain sentence about rent.', must: ['Just a plain sentence'], mustNot: ['rich-card','law-card','warning-card'] },
  { name: 'divider ---', input: 'Above\n---\nBelow', must: ['<hr'], mustNot: [] },
];

let pass = 0, fail = 0;
for (const t of tests) {
  const out = fmt(t.input);
  const okMust = t.must.every(m => out.includes(m));
  const okNot = t.mustNot.every(m => !out.includes(m));
  if (okMust && okNot) { pass++; console.log('OK  ' + t.name); }
  else { fail++; console.log('FAIL ' + t.name); console.log('  missing:', t.must.filter(m=>!out.includes(m))); console.log('  leaked:', t.mustNot.filter(m=>out.includes(m))); console.log('  out(400):', out.slice(0,400)); }
}
console.log(`\nFMT: ${pass}/${tests.length}`);
