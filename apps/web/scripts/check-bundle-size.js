/**
 * Bundle Budget Check
 *
 * Purpose (10th grade): Make sure our built JavaScript files are not too big
 * so the app loads fast for users.
 *
 * Procedure:
 * 1) Look in `dist/assets` for built files
 * 2) Find the main `index-*.js` file and the `vendor-*.js` file
 * 3) Fail the build if they are larger than our simple limits
 *
 * Conclusion: Prevents accidentally shipping a huge bundle.
 */

import fs from 'fs';
import path from 'path';

const DIST_DIR = path.join(new URL('.', import.meta.url).pathname, '..', 'dist', 'assets');
const ENTRY_LIMIT_BYTES = 1_200_000; // ~1.2MB minified (gzipped target is < 300KB)
const VENDOR_LIMIT_BYTES = 300_000; // ~300KB minified

function findFile(globStartsWith) {
  const files = fs.readdirSync(DIST_DIR);
  const match = files.find((f) => f.startsWith(globStartsWith) && f.endsWith('.js'));
  return match ? path.join(DIST_DIR, match) : null;
}

function check(filePath, limit, label) {
  if (!filePath) {
    console.log(`[bundle-check] Skipping ${label}: file not found`);
    return true;
  }
  const { size } = fs.statSync(filePath);
  const ok = size <= limit;
  const pretty = (n) => `${(n / 1024).toFixed(1)} KB`;
  console.log(`[bundle-check] ${label}: ${pretty(size)} (limit ${pretty(limit)}) → ${ok ? 'OK' : 'FAIL'}`);
  return ok;
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('[bundle-check] dist/assets not found. Run build first.');
    process.exit(1);
  }
  const indexFile = findFile('index-');
  const vendorFile = findFile('vendor-');
  const okEntry = check(indexFile, ENTRY_LIMIT_BYTES, 'entry (index-*.js)');
  const okVendor = check(vendorFile, VENDOR_LIMIT_BYTES, 'vendor (vendor-*.js)');
  if (!okEntry || !okVendor) {
    console.error('[bundle-check] Bundle size exceeds limits.');
    process.exit(1);
  }
  console.log('[bundle-check] Bundle sizes within limits.');
}

main();


