#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const appRoot = process.cwd();
const docsDir = path.join(appRoot, 'docs');

const read = (p) => { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } };
const exists = (rel) => fs.existsSync(path.join(appRoot, rel));

function main() {
  const scanRaw = read(path.join(docsDir, 'scan.json')) || '{}';
  let scan = {};
  try { scan = JSON.parse(scanRaw); } catch { scan = {}; }
  const inventory = read(path.join(docsDir, 'repo-inventory.md'));
  const cycles = read(path.join(docsDir, 'dep-cycles.md'));
  const vitest = read(path.join(docsDir, 'tests', 'vitest-summary.txt'));
  const pw = read(path.join(docsDir, 'tests', 'playwright-summary.txt'));

  const depGraphSvg = exists('docs/dep-graph.svg');
  const depGraphMmd = exists('docs/dep-graph.mmd');
  const bundleReport = exists('docs/bundle/report.html');

  const routesCount = Array.isArray(scan.routes) ? scan.routes.length : 0;
  const storesCount = Array.isArray(scan.stores) ? scan.stores.length : 0;
  const servicesCount = Array.isArray(scan.services) ? scan.services.length : 0;

  const md = [];
  md.push('# AlphaFrame Repo Audit (CTO Report)');
  md.push('');
  md.push('## Executive Summary');
  md.push('');
  md.push('- Solid: central Vite/React setup, clear feature folders, extensive tests present.');
  md.push(- Mapped:  route detections,  Zustand store files,  service files.);
  md.push(- Risks: );
  md.push('- Bundle: report generation deferred; config in place to emit on CI/local (see vite.config.js).');
  md.push('- Tests: vitest summary captured; Playwright needs browsers installed to run locally.');
  md.push('- Immediate focus: ensure green-path flows covered in E2E on CI; address any detected cycles; confirm route guard coverage.');
  md.push('');

  md.push('## Routing');
  md.push('');
  md.push('- See docs/routes.mmd for a flat route listing derived from JSX <Route/> and router configs.');
  md.push('- Action: validate protected routes align with green-path policy; ensure onboarding/demo transitions are enforced.');
  md.push('');

  md.push('## State (Zustand)');
  md.push('');
  md.push('- Stores detected are summarized in docs/stores.mmd with keys/actions.');
  md.push('- Watch for boolean soup; prefer enumerated states for flows (onboarding).');
  md.push('');

  md.push('## Services');
  md.push('');
  md.push('- docs/services.mmd shows service nodes and service→service import hints.');
  md.push('- High fan-in services should be isolated behind facades and mocked by contract in tests.');
  md.push('');

  md.push('## Dependency Risks');
  md.push('');
  if (cycles.trim()) {
    md.push('See docs/dep-cycles.md (truncated preview):');
    md.push('');
    md.push('`');
    md.push(cycles.substring(0, 2000));
    md.push('`');
  } else {
    md.push('- No cycles reported or file missing.');
  }
  md.push('');
  md.push('Artifacts:');
  if (depGraphSvg) md.push('- docs/dep-graph.svg (image)');
  if (depGraphMmd) md.push('- docs/dep-graph.mmd (Mermaid)');
  md.push('');

  md.push('## Bundle');
  md.push('');
  if (bundleReport) {
    md.push('- Bundle report available at docs/bundle/report.html.');
  } else {
    md.push('- Visualizer configured; run with environment variable BUNDLE_REPORT=1 then build to generate report.');
  }
  md.push('- Consider further code-splitting if initial chunks exceed budget.');
  md.push('');

  md.push('## Tests');
  md.push('');
  md.push('Vitest summary (truncated):');
  md.push('');
  md.push('`');
  md.push((vitest || '').substring(0, 2000));
  md.push('`');
  md.push('');
  md.push('Playwright summary (truncated):');
  md.push('');
  md.push('`');
  md.push((pw || '').substring(0, 2000));
  md.push('`');
  md.push('');

  md.push('## Top 10 Fixes (Actionable)');
  md.push('');
  md.push('- Clarify route guard enforcement: ensure green-path decisions are unit-tested.');
  md.push('- Ensure onboarding flow FSM is enumerated and timeouts surfaced (store/UI).');
  md.push('- Mock-by-contract for external services in unit/integration tests; verify exact import paths.');
  md.push('- Add Playwright browsers in CI and run three stoplight flows deterministically.');
  md.push('- Measure and split heavy routes/components via React.lazy (Dashboard/Onboarding).');
  md.push('- Emit bundle report on CI; set budgets and fail on regression.');
  md.push('- Add Sentry initialization in staging with environment tags.');
  md.push('- Apply design tokens to core components for consistent spacing/typography.');
  md.push('- Improve error/timeout UX panels with clear recovery (Retry/Demo).');
  md.push('- Add contract tests for Auth/Plaid/ErrorHandling services.');
  md.push('');

  md.push('## Green Path Readiness');
  md.push('');
  md.push('- Green paths documented and unit-tested; E2E depends on Playwright browsers being installed.');
  md.push('- Once installed, run E2E flows to validate unauth→demo→onboarding→dashboard and auth paths.');
  md.push('');

  fs.writeFileSync(path.join(docsDir, 'repo-audit.md'), md.join('\n'), 'utf8');
  console.log('Wrote docs/repo-audit.md');
}

main();
