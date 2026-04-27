import fs from 'fs';
const src = fs.readFileSync('src/components/tools/labels.js', 'utf8');
// Count keys per language export
const re = /export const (L_\w+)\s*=\s*\{([\s\S]*?)^\};/gm;
let m;
while ((m = re.exec(src))) {
  const name = m[1];
  const body = m[2];
  // Find top-level keys
  const keys = [];
  let depth = 0, cur = '';
  let i = 0;
  while (i < body.length) {
    const ch = body[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    cur += ch;
    i++;
  }
  // Use a simpler regex: top-level "key:" at start of non-nested line
  const topKeys = [];
  const lines = body.split('\n');
  let d = 0;
  for (const ln of lines) {
    const before = (ln.match(/^[\s]*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/) || [])[1];
    if (before && d === 0) topKeys.push(before);
    for (const c of ln) { if (c === '{') d++; else if (c === '}') d--; }
  }
  console.log(`${name}: ${topKeys.length} top keys`);
}
