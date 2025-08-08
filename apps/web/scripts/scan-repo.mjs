#!/usr/bin/env node
/*
  scan-repo.mjs (ESM)
  Goal: Parse src/ to extract:
    - routes: from react-router-dom usage (Routes/Route elements, createBrowserRouter configs)
    - stores: Zustand create(...) shape with action-like keys
    - services: exported functions/classes and their imports
  Output: docs/scan.json with { routes: [], stores: [], services: [] }
*/
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
const traverse = traverseModule.default || traverseModule;

const appRoot = process.cwd();
const srcDir = path.join(appRoot, 'src');
const docsDir = path.join(appRoot, 'docs');

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }
function read(file) { try { return fs.readFileSync(file, 'utf8'); } catch { return ''; } }
function listFiles(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    let entries = [];
    try { entries = fs.readdirSync(cur, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      const p = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile()) out.push(p);
    }
  }
  return out;
}

function parseAst(code, filename) {
  try {
    return parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'importAttributes', 'classProperties'],
      sourceFilename: filename,
    });
  } catch { return null; }
}

function extractRoutes(ast) {
  const routes = [];
  let importsRRD = false;
  traverse(ast, {
    ImportDeclaration(p) {
      if (p.node.source.value === 'react-router-dom') importsRRD = true;
    },
  });
  if (!importsRRD) return routes;
  traverse(ast, {
    JSXElement(p) {
      const { openingElement } = p.node;
      if (!openingElement || !openingElement.name) return;
      const name = openingElement.name.name;
      if (name === 'Route') {
        const attrs = openingElement.attributes || [];
        const attrMap = new Map();
        for (const a of attrs) {
          if (a.type === 'JSXAttribute' && a.name && a.name.name) {
            let val = null;
            if (a.value) {
              if (a.value.type === 'StringLiteral') val = a.value.value;
              else if (a.value.type === 'JSXExpressionContainer' && a.value.expression.type === 'StringLiteral') val = a.value.expression.value;
            }
            attrMap.set(a.name.name, val);
          }
        }
        if (attrMap.has('path')) {
          routes.push({ path: String(attrMap.get('path') || ''), file: '' });
        }
      }
    },
    CallExpression(p) {
      const callee = p.node.callee;
      if (callee && callee.name === 'createBrowserRouter') {
        routes.push({ path: '(router-config)', file: '' });
      }
    },
  });
  return routes;
}

function extractStores(ast) {
  const stores = [];
  traverse(ast, {
    CallExpression(p) {
      const callee = p.node.callee;
      if (callee && callee.name === 'create') {
        const firstArg = p.node.arguments && p.node.arguments[0];
        if (firstArg && (firstArg.type === 'ObjectExpression' || firstArg.type === 'ArrowFunctionExpression')) {
          const actions = new Set();
          const stateKeys = new Set();
          let obj = null;
          if (firstArg.type === 'ObjectExpression') obj = firstArg;
          if (firstArg.type === 'ArrowFunctionExpression' && firstArg.body.type === 'ObjectExpression') obj = firstArg.body;
          if (obj) {
            for (const prop of obj.properties) {
              if (prop.type === 'ObjectProperty' && prop.key && prop.key.name) {
                const key = prop.key.name;
                if (prop.value && (prop.value.type === 'ArrowFunctionExpression' || prop.value.type === 'FunctionExpression')) {
                  actions.add(key);
                } else {
                  stateKeys.add(key);
                }
              }
            }
          }
          stores.push({ stateKeys: Array.from(stateKeys), actions: Array.from(actions) });
        }
      }
    },
  });
  return stores;
}

function extractServices(ast) {
  const exports = new Set();
  const imports = new Set();
  traverse(ast, {
    ImportDeclaration(p) { imports.add(p.node.source.value); },
    ExportNamedDeclaration(p) {
      if (p.node.declaration && p.node.declaration.declarations) {
        for (const d of p.node.declaration.declarations) {
          if (d.id && d.id.name) exports.add(d.id.name);
        }
      }
      if (p.node.specifiers) {
        for (const s of p.node.specifiers) {
          if (s.exported && s.exported.name) exports.add(s.exported.name);
        }
      }
    },
    ExportDefaultDeclaration() { exports.add('default'); },
    FunctionDeclaration(p) { if (p.node.id && p.node.id.name) exports.add(p.node.id.name); },
    ClassDeclaration(p) { if (p.node.id && p.node.id.name) exports.add(p.node.id.name); },
  });
  return { exports: Array.from(exports), imports: Array.from(imports) };
}

function run() {
  ensureDir(docsDir);
  const files = listFiles(srcDir).filter((f) => /\.(js|jsx)$/.test(f));
  const result = { routes: [], stores: [], services: [] };

  for (const abs of files) {
    const rel = path.relative(appRoot, abs).replace(/\\/g, '/');
    const code = read(abs);
    const ast = parseAst(code, rel);
    if (!ast) continue;

    const routes = extractRoutes(ast).map((r) => ({ ...r, file: rel }));
    if (routes.length) result.routes.push(...routes);

    if (/\/store\//.test(rel)) {
      const stores = extractStores(ast).map((s) => ({ file: rel, ...s }));
      if (stores.length) result.stores.push(...stores);
    }

    if (/\/services\//.test(rel)) {
      const svc = extractServices(ast);
      result.services.push({ file: rel, ...svc });
    }
  }

  fs.writeFileSync(path.join(docsDir, 'scan.json'), JSON.stringify(result, null, 2), 'utf8');
  console.log('Wrote docs/scan.json');
}

run();
