import { fmt } from './src/lib/chatFormat.js';

const t1 = '🚫 **常见错误**\n- 口头约定不算数。工业租约一定要书面、盖章、签署。\n- 滞纳金超过年租金10%——法院会推翻，你拿不到。\n- 没有明确维修责任——到时候维修费谁付会吵很久。\n- 没有保险条款——租客出事（火灾、伤害），你可能要赔。\n\n下一段内容不应该在红色框里。';

const r1 = fmt(t1);
console.log('=== TEST 1: Multi-bullet warning (Chinese) ===');
console.log('Has warning-card class:', r1.includes('warning-card') ? 'YES OK' : 'NO FAIL');
console.log('Contains 口头约定:', r1.includes('口头约定') ? 'YES OK' : 'NO FAIL');
console.log('Contains 滞纳金:', r1.includes('滞纳金') ? 'YES OK' : 'NO FAIL');
console.log('Contains 维修责任:', r1.includes('维修责任') ? 'YES OK' : 'NO FAIL');
console.log('Contains 保险条款:', r1.includes('保险条款') ? 'YES OK' : 'NO FAIL');
console.log('Shows "4 flags":', r1.includes('4 flags') ? 'YES OK' : 'NO FAIL');

const warningCardEndIdx = r1.lastIndexOf('</div></div>');
const nextParaIdx = r1.indexOf('下一段内容');
console.log('Next paragraph outside red card:', nextParaIdx > warningCardEndIdx ? 'YES OK' : 'NO FAIL');

console.log('\n--- HTML OUTPUT (first 1200 chars) ---');
console.log(r1.slice(0, 1200));

console.log('\n=== TEST 2: Single-line warning (backwards compat) ===');
const t2 = '🚫 **不要这样做** 千万不要口头约定租金。';
const r2 = fmt(t2);
console.log('Has warning-card class (should NOT):', r2.includes('warning-card') ? 'YES FAIL' : 'NO OK');
console.log('Contains text:', r2.includes('口头约定租金') ? 'YES OK' : 'NO FAIL');

console.log('\n=== TEST 3: English multi-bullet warning ===');
const t3 = '🚫 **Common mistakes**\n- Verbal agreements do not count.\n- Late fees over 10% get struck down.\n- No repair clause means disputes.';
const r3 = fmt(t3);
console.log('Has warning-card class:', r3.includes('warning-card') ? 'YES OK' : 'NO FAIL');
console.log('Shows "3 flags":', r3.includes('3 flags') ? 'YES OK' : 'NO FAIL');

console.log('\n=== TEST 4: Warning followed by another callout ===');
const t4 = '🚫 **Red flags**\n- Missing deposit clause\n- No notice period\n\n✅ **Fix these** 修正这些问题。';
const r4 = fmt(t4);
console.log('Warning has 2 flags:', r4.includes('2 flags') ? 'YES OK' : 'NO FAIL');
console.log('Action card also renders:', r4.includes('✅') ? 'YES OK' : 'NO FAIL');
