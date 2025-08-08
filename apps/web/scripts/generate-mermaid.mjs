#!/usr/bin/env node
/*
  generate-mermaid.mjs (ESM)
  Purpose: Convert docs/scan.json into Mermaid diagrams:
    - docs/routes.mmd
    - docs/stores.mmd
    - docs/services.mmd
  Notes: Keep shapes simple and readable. If SVG rendering fails later, the .mmd files are still useful.
*/
import fs from 'node:fs';
import path from 'node:path';

const appRoot = process.cwd();
const docsDir = path.join(appRoot, 'docs');
const scanPath = path.join(docsDir, 'scan.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

function writeRoutes(routes, outFile) {
  // Simple flat list of route nodes with labels including file ref
  const lines = [];
  lines.push('graph TD');
  const seen = new Set();
  let idx = 0;
  for (const r of routes) {
    const id = `R${idx++}`;
    const label = (r.path || '/') + '\n' + r.file.replace(/^src\//, '');
    // Deduplicate by path+file
    const key = `${r.path}|${r.file}`;
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(`  ${id}(["${label.replace(/"/g, '\\"')}"])`);
  }
  fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
}

function writeStores(stores, outFile) {
  // One subgraph per store file; list state keys and actions
  const lines = [];
  lines.push('graph LR');
  let g = 0;
  for (const s of stores) {
    const fileShort = s.file.replace(/^src\//, '');
    const clusterId = `subgraph_${g++}`;
    lines.push(`  subgraph "${fileShort.replace(/"/g, '\\"')}"`);
    const state = (s.stateKeys || []).slice(0, 20);
    const actions = (s.actions || []).slice(0, 20);
    if (state.length === 0 && actions.length === 0) {
      lines.push('    note0["(no keys/actions detected)"]');
    } else {
      if (state.length) {
        lines.push('    state["state: ' + state.join(', ').replace(/"/g, '\\"') + '"]');
      }
      if (actions.length) {
        lines.push('    actions["actions: ' + actions.join(', ').replace(/"/g, '\\"') + '"]');
      }
    }
    lines.push('  end');
  }
  fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
}

function writeServices(services, outFile) {
  // Nodes for each service file; edges to other services they import (heuristic: import path contains '/services/')
  const lines = [];
  lines.push('graph LR');
  const nodeIds = new Map();
  let i = 0;
  function nodeFor(file) {
    if (!nodeIds.has(file)) nodeIds.set(file, `S${i++}`);
    return nodeIds.get(file);
  }
  // Nodes
  for (const s of services) {
    const id = nodeFor(s.file);
    const label = s.file.replace(/^src\//, '');
    lines.push(`  ${id}(["${label.replace(/"/g, '\\"')}"])`);
  }
  // Edges
  for (const s of services) {
    const from = nodeFor(s.file);
    const imports = s.imports || [];
    for (const imp of imports) {
      if (typeof imp === 'string' && imp.includes('/services/')) {
        // Resolve to a readable target label (keep as raw import path)
        const toLabel = imp;
        const toId = nodeFor(`import:${imp}`);
        lines.push(`  ${toId}(["${toLabel.replace(/"/g, '\\"')}"])`);
        lines.push(`  ${from}-->${toId}`);
      }
    }
  }
  fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
}

function main() {
  ensureDir(docsDir);
  if (!fs.existsSync(scanPath)) {
    console.error('docs/scan.json not found. Run scripts/scan-repo.mjs first.');
    process.exit(1);
  }
  const scan = readJson(scanPath);
  writeRoutes(scan.routes || [], path.join(docsDir, 'routes.mmd'));
  writeStores(scan.stores || [], path.join(docsDir, 'stores.mmd'));
  writeServices(scan.services || [], path.join(docsDir, 'services.mmd'));
  console.log('Wrote docs/routes.mmd, docs/stores.mmd, docs/services.mmd');
}

main();
