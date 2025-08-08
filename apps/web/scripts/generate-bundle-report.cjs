#!/usr/bin/env node
/*
  generate-bundle-report.cjs
  Fallback bundle report: lists dist/assets files and sizes in a simple HTML table.
  Use when rollup visualizer or sourcemaps are unavailable.
*/
const fs = require('fs');
const path = require('path');

const appRoot = process.cwd();
const distDir = path.join(appRoot, 'dist', 'assets');
const docsDir = path.join(appRoot, 'docs', 'bundle');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  ensureDir(docsDir);
  const rows = [];
  if (fs.existsSync(distDir)) {
    const files = fs
      .readdirSync(distDir)
      .filter((f) => f.endsWith('.js') || f.endsWith('.css'));
    for (const filename of files) {
      const filePath = path.join(distDir, filename);
      try {
        const stat = fs.statSync(filePath);
        rows.push({ file: 'dist/assets/' + filename, bytes: stat.size });
      } catch (_) {
        // ignore
      }
    }
  }
  rows.sort((a, b) => b.bytes - a.bytes);

  const html = [
    '<!doctype html><html><head><meta charset="utf-8"/>',
    '<title>AlphaFrame Bundle Report (Fallback)</title>',
    '<style>body{font-family:system-ui,Arial,sans-serif;padding:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:6px;text-align:left}</style>',
    '</head><body>',
    '<h1>AlphaFrame Bundle Report (Fallback)</h1>',
    '<p>This is a simple listing of built assets and sizes. For a treemap, run with the rollup visualizer on CI or locally with env BUNDLE_REPORT=1.</p>',
    '<table><thead><tr><th>File</th><th>Size (bytes)</th></tr></thead><tbody>',
    rows.map((r) => `<tr><td>${r.file}</td><td>${r.bytes}</td></tr>`).join(''),
    '</tbody></table>',
    '</body></html>',
  ].join('\n');

  const outPath = path.join(docsDir, 'report.html');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log('Wrote', path.relative(appRoot, outPath));
}

main();
