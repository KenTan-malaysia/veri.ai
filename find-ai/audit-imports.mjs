import fs from 'fs';
import path from 'path';
import parser from './node_modules/next/dist/compiled/babel/parser.js';
import traverse from './node_modules/next/dist/compiled/babel/traverse.js';

const trav = traverse.default || traverse;

const files = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|jsx)$/.test(e.name)) files.push(p);
  }
}
walk('src');

const missing = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const ast = parser.parse(src, { sourceType: 'module', plugins: ['jsx'] });
  trav(ast, {
    ImportDeclaration(p) {
      const v = p.node.source.value;
      if (!v.startsWith('.')) return; // skip package imports
      const base = path.resolve(path.dirname(f), v);
      const candidates = [base, base + '.js', base + '.jsx', path.join(base, 'index.js'), path.join(base, 'index.jsx')];
      if (!candidates.some(c => { try { return fs.statSync(c).isFile(); } catch { return false; } })) {
        missing.push({ from: f, to: v });
      }
    }
  });
}
console.log(`MISSING IMPORTS: ${missing.length}`);
for (const m of missing) console.log(`  ${m.from} -> ${m.to}`);
