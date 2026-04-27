import fs from 'fs';
const src = fs.readFileSync('src/components/tools/labels.js', 'utf8');
// Extract L.en, L.bm, L.zh key sets
function extractKeys(lang) {
  // Find "  en: {" etc
  const start = src.indexOf(`  ${lang}: {`);
  if (start < 0) return [];
  let depth = 0, i = start + `  ${lang}: {`.length - 1;
  // find matching }
  while (i < src.length) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) break; }
    i++;
  }
  const body = src.slice(start + `  ${lang}: {`.length, i);
  // top-level keys
  const keys = new Set();
  let d = 0;
  const lines = body.split('\n');
  for (const ln of lines) {
    // skip comment-only
    const c = ln.replace(/\/\/.*$/, '');
    const m = c.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
    if (m && d === 0) keys.add(m[1]);
    for (const ch of c) { if (ch === '{') d++; else if (ch === '}') d--; }
  }
  return keys;
}

const en = extractKeys('en');
const bm = extractKeys('bm');
const zh = extractKeys('zh');
console.log(`en=${en.size}  bm=${bm.size}  zh=${zh.size}`);

const missingBm = [...en].filter(k => !bm.has(k));
const missingZh = [...en].filter(k => !zh.has(k));
const extraBm = [...bm].filter(k => !en.has(k));
const extraZh = [...zh].filter(k => !en.has(k));

console.log(`Missing in BM (${missingBm.length}):`, missingBm.slice(0, 50));
console.log(`Missing in ZH (${missingZh.length}):`, missingZh.slice(0, 50));
console.log(`Extra in BM (${extraBm.length}):`, extraBm.slice(0, 10));
console.log(`Extra in ZH (${extraZh.length}):`, extraZh.slice(0, 10));
