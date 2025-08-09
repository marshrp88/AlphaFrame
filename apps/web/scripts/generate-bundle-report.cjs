const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const outDir = path.resolve(__dirname, '../docs/bundle');
fs.mkdirSync(outDir, { recursive: true });

let items = [];
if (fs.existsSync(distDir)) {
  items = fs.readdirSync(distDir).map((name) => {
    const p = path.join(distDir, name);
    const s = fs.statSync(p);
    return { name, size: s.size };
  });
}

const html = `<!doctype html><meta charset="utf-8"><title>Bundle Report</title>
<h1>Bundle Assets</h1>
<ul>
${items.map(i => `<li>${i.name} — ${i.size} bytes</li>`).join('\n')}
</ul>`;

fs.writeFileSync(path.join(outDir, 'report.html'), html);
console.log('Bundle report written to docs/bundle/report.html');


