import { fmt } from './src/lib/chatFormat.js';
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}
// Regression: after escape, do callouts still render?
const cases = [
  '✅ **做什么**\n1. 第一步\n2. 第二步',
  '🚫 **Warning**\n- Item 1\n- Item 2',
  '💰 Stamp duty: RM120',
  '⚖️ Contracts Act 1950 s.75',
  '<script>alert(1)</script> 正常内容', // XSS attempt
  '**Bold text** 混合 Mandarin & English & "quotes"',
];
let pass = 0;
for (const c of cases) {
  const out = fmt(escapeHtml(c));
  const hasScript = out.includes('<script>');
  const hasStrong = c.includes('**') ? out.includes('<strong>') : true;
  const hasCallout = /[✅🚫💰⚖️]/.test(c) ? /rich-card|law-card/.test(out) : true;
  const ok = !hasScript && hasStrong && hasCallout;
  console.log(ok?'OK  ':'FAIL', c.slice(0,40).replace(/\n/g,'·'));
  if (!ok) { console.log('  hasScript=',hasScript,'hasStrong=',hasStrong,'hasCallout=',hasCallout); console.log('  out(200):',out.slice(0,200)); }
  if (ok) pass++;
}
console.log(`${pass}/${cases.length}`);
