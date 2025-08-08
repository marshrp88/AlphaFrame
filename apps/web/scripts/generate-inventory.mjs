#!/usr/bin/env node
/*
  generate-inventory.mjs (ESM)
  Purpose: Scan `src/` and produce:
    - docs/repo-files.txt
    - docs/cloc.json
    - docs/repo-inventory.md
  Notes: ESM-friendly for projects with "type": "module".
*/

import fs from 'node:fs';
import path from 'node:path';

function safeReadFileSync(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return '';
  }
}

function walkDirectory(startDir) {
  const results = [];
  const stack = [startDir];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (err) {
      continue;
    }
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function main() {
  const appRoot = process.cwd();
  const srcDir = path.join(appRoot, 'src');
  const docsDir = path.join(appRoot, 'docs');
  ensureDir(docsDir);

  if (!fs.existsSync(srcDir)) {
    console.error('src/ directory not found. Run this from the app root (e.g., apps/web).');
    process.exit(1);
  }

  const allFilesAbs = walkDirectory(srcDir);
  const allFiles = allFilesAbs
    .filter((f) => !f.includes('/__snapshots__/') && !f.includes('\\__snapshots__\\'))
    .map((abs) => path.relative(appRoot, abs).replace(/\\/g, '/'))
    .sort();

  const filesListPath = path.join(docsDir, 'repo-files.txt');
  fs.writeFileSync(filesListPath, allFiles.join('\n'), 'utf8');

  const perFile = [];
  for (const rel of allFiles) {
    const abs = path.join(appRoot, rel);
    const content = safeReadFileSync(abs);
    const loc = content === '' ? 0 : content.split(/\n/).length;
    perFile.push({ file: rel, loc });
  }

  const totalLoc = perFile.reduce((sum, f) => sum + f.loc, 0);
  const clocJson = { summary: { files: perFile.length, lines: totalLoc }, files: perFile };
  const clocPath = path.join(docsDir, 'cloc.json');
  fs.writeFileSync(clocPath, JSON.stringify(clocJson, null, 2), 'utf8');

  const folderCounts = new Map();
  for (const rel of allFiles) {
    const parts = rel.split('/');
    const folder = parts[1] || 'src';
    folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
  }

  const top20 = [...perFile].sort((a, b) => b.loc - a.loc).slice(0, 20);
  const pages = allFiles.filter((p) => p.startsWith('src/pages/') || /OnboardingFlow\.(jsx|js)$/.test(p));
  const services = allFiles.filter((p) => /src\/.+\/services\/.+\.(js|jsx)$/.test(p));
  const storeCandidates = allFiles.filter((p) => /src\/.+\/store\/.+\.(js|jsx)$/.test(p));
  const storesDetailed = storeCandidates.map((rel) => {
    const abs = path.join(appRoot, rel);
    const content = safeReadFileSync(abs);
    const hasZustand = /from\s+['\"]zustand['\"]/m.test(content) || /require\(['\"]zustand['\"]\)/m.test(content);
    const actionMatches = [...content.matchAll(/(\w+)\s*:\s*\([\w\s,]*\)\s*=>/g)].map((m) => m[1]);
    const uniqueActions = Array.from(new Set(actionMatches)).slice(0, 20);
    return { file: rel, hasZustand, actionsSample: uniqueActions };
  });

  const hotspots = top20.slice(0, 10);
  const md = [];
  md.push('# Repository Inventory');
  md.push('');
  md.push('Auto-generated overview of files, sizes, pages, services, stores, and hotspots.');
  md.push('');
  md.push('## File Counts by src/ Subfolder');
  md.push('');
  for (const [folder, count] of [...folderCounts.entries()].sort()) {
    md.push(`- ${folder}: ${count}`);
  }
  md.push('');
  md.push('## Top 20 Largest Files (by LOC)');
  md.push('');
  for (const f of top20) md.push(`- ${f.file}: ${f.loc} lines`);
  md.push('');
  md.push('## Pages (by path)');
  md.push('');
  if (pages.length === 0) md.push('- (none detected under src/pages)');
  else for (const p of pages) md.push(`- ${p}`);
  md.push('');
  md.push('## Services');
  md.push('');
  if (services.length === 0) md.push('- (none found under src/**/services)');
  else for (const s of services) md.push(`- ${s}`);
  md.push('');
  md.push('## Zustand Stores (candidates)');
  md.push('');
  if (storesDetailed.length === 0) md.push('- (none found under src/**/store)');
  else for (const s of storesDetailed) {
    md.push(`- ${s.file} ${s.hasZustand ? '(zustand)' : ''}`);
    if (s.actionsSample.length > 0) md.push(`  - actions (sample): ${s.actionsSample.join(', ')}`);
  }
  md.push('');
  md.push('## Obvious Hotspots (by size)');
  md.push('');
  for (const h of hotspots) md.push(`- ${h.file}: ${h.loc} lines`);
  md.push('');
  md.push('## Totals');
  md.push('');
  md.push(`- Files: ${perFile.length}`);
  md.push(`- Total LOC (simple count): ${totalLoc}`);
  md.push('');

  const inventoryPath = path.join(docsDir, 'repo-inventory.md');
  fs.writeFileSync(inventoryPath, md.join('\n'), 'utf8');

  console.log('Generated:');
  console.log(`- ${path.relative(appRoot, filesListPath)}`);
  console.log(`- ${path.relative(appRoot, clocPath)}`);
  console.log(`- ${path.relative(appRoot, inventoryPath)}`);
}

main();
