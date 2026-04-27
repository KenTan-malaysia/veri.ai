import fs from 'fs';
import path from 'path';

// Collect all local imports actually referenced
const referenced = new Set();
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|jsx)$/.test(e.name)) {
      const src = fs.readFileSync(p, 'utf8');
      const re = /(?:from|import)\s+['"](\.[^'"]+)['"]/g;
      let m;
      while ((m = re.exec(src))) {
        const abs = path.resolve(path.dirname(p), m[1]);
        for (const ext of ['','.js','.jsx','/index.js','/index.jsx']) {
          const c = abs + ext;
          try { if (fs.statSync(c).isFile()) { referenced.add(path.relative('.', c).replace(/\\/g,'/')); break; } } catch {}
        }
      }
    }
  }
}
walk('src');

// entrypoints always kept
const kept = new Set([
  'src/app/page.js','src/app/layout.js','src/app/landing.js','src/app/globals.css',
  'src/app/api/chat/route.js','src/app/api/company-check/route.js','src/app/api/notify-me/route.js','src/app/api/trust-score/route.js',
]);

const allFiles = [];
function walkAll(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkAll(p);
    else if (/\.(js|jsx)$/.test(e.name)) allFiles.push(p.replace(/\\/g,'/'));
  }
}
walkAll('src');

const unused = allFiles.filter(f => !referenced.has(f) && !kept.has(f));
console.log('Potentially unused files:');
unused.forEach(f => console.log('  ' + f));
