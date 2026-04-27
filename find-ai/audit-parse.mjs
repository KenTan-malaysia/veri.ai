import fs from 'fs';
import path from 'path';
import parser from './node_modules/next/dist/compiled/babel/parser.js';

const files = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|jsx)$/.test(e.name)) files.push(p);
  }
}
walk('src');

let ok = 0, fail = 0;
const fails = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  try {
    parser.parse(src, { sourceType: 'module', plugins: ['jsx'], errorRecovery: false });
    ok++;
  } catch (e) {
    fail++;
    fails.push({ f, msg: e.message });
  }
}
console.log(`PARSE: ${ok} OK · ${fail} FAIL · total ${files.length}`);
for (const x of fails) console.log(`  FAIL ${x.f}\n    ${x.msg}`);
