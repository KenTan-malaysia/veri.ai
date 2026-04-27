import fs from 'fs';
const files = ['src/app/page.js', 'src/components/PeekChat.js', 'src/app/landing.js'];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const lines = src.split('\n');
  // Find .map((x, i) => ( and check the next 4 lines for key=
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/\.map\s*\(\s*\(?(\w+)(?:\s*,\s*(\w+))?\)?\s*=>\s*[\(\{]/);
    if (!m) continue;
    // Look in next 6 lines for key= in JSX
    const block = lines.slice(i, i + 8).join(' ');
    // Very rough: look for a JSX tag near the start; if it has key=, pass
    const firstJsx = block.match(/<(\w+)\b([^>]*)>/);
    if (!firstJsx) continue;
    if (!/\bkey\s*=/.test(block.slice(0, block.indexOf('>') + 1 + 200))) {
      console.log(`${f}:${i+1}  ${lines[i].trim().slice(0, 100)}`);
    }
  }
}
