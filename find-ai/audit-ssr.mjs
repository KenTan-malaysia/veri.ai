import fs from 'fs';
import path from 'path';

const findings = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|jsx)$/.test(e.name)) {
      const src = fs.readFileSync(p, 'utf8');
      const lines = src.split('\n');
      lines.forEach((ln, i) => {
        // Top-level window/document/localStorage use without guards
        const trimmed = ln.trim();
        if (/^(window|document|localStorage|navigator)\./.test(trimmed) && !/typeof window/.test(trimmed) && !/^\s*\/\//.test(trimmed)) {
          findings.push({ f: p, line: i+1, code: trimmed.slice(0, 120) });
        }
      });
    }
  }
}
walk('src');
console.log('Top-level SSR-unsafe accesses:');
findings.slice(0, 40).forEach(x => console.log(`  ${x.f}:${x.line}  ${x.code}`));
console.log(`Total: ${findings.length}`);
