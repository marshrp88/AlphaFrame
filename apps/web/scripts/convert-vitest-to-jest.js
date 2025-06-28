#!/usr/bin/env node

/**
 * Safe Vitest to Jest Migration Script
 * 
 * Purpose: Convert all test files from Vitest to Jest syntax
 * 
 * Procedure:
 * 1. Find all test files with Vitest imports
 * 2. Replace Vitest syntax with Jest equivalents
 * 3. Ensure idempotent operation (safe to re-run)
 * 
 * Conclusion: All test files will use Jest syntax consistently
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all test files
const testFiles = glob.sync('**/*.{spec,test}.{js,jsx,ts,tsx}', {
  ignore: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**']
});

console.log(`Found ${testFiles.length} test files to process...`);

let convertedCount = 0;
let errorCount = 0;

testFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileChanged = false;

    // Replace Vitest imports with Jest imports
    if (content.includes("from 'vitest'") || content.includes('from "vitest"')) {
      content = content.replace(
        /import\s+\{([^}]+)\}\s+from\s+['"]vitest['"];?/g,
        'import {$1} from \'@jest/globals\';'
      );
      fileChanged = true;
    }

    // Replace vi.fn() with jest.fn()
    if (content.includes('vi.fn(')) {
      content = content.replace(/\bvi\.fn\(/g, 'jest.fn(');
      fileChanged = true;
    }

    // Replace vi.mock() with jest.mock()
    if (content.includes('vi.mock(')) {
      content = content.replace(/\bvi\.mock\(/g, 'jest.mock(');
      fileChanged = true;
    }

    // Replace vi.spyOn() with jest.spyOn()
    if (content.includes('vi.spyOn(')) {
      content = content.replace(/\bvi\.spyOn\(/g, 'jest.spyOn(');
      fileChanged = true;
    }

    // Replace vi.clearAllMocks() with jest.clearAllMocks()
    if (content.includes('vi.clearAllMocks(')) {
      content = content.replace(/\bvi\.clearAllMocks\(/g, 'jest.clearAllMocks(');
      fileChanged = true;
    }

    // Replace vi.restoreAllMocks() with jest.restoreAllMocks()
    if (content.includes('vi.restoreAllMocks(')) {
      content = content.replace(/\bvi\.restoreAllMocks\(/g, 'jest.restoreAllMocks(');
      fileChanged = true;
    }

    // Replace vi.resetAllMocks() with jest.resetAllMocks()
    if (content.includes('vi.resetAllMocks(')) {
      content = content.replace(/\bvi\.resetAllMocks\(/g, 'jest.resetAllMocks(');
      fileChanged = true;
    }

    // Replace vi.mocked() with jest.mocked()
    if (content.includes('vi.mocked(')) {
      content = content.replace(/\bvi\.mocked\(/g, 'jest.mocked(');
      fileChanged = true;
    }

    // Replace vi.hoisted() with jest.hoisted()
    if (content.includes('vi.hoisted(')) {
      content = content.replace(/\bvi\.hoisted\(/g, 'jest.hoisted(');
      fileChanged = true;
    }

    // Only write if content changed
    if (fileChanged) {
      fs.writeFileSync(filePath, content, 'utf8');
      convertedCount++;
      console.log(`✅ Converted: ${filePath}`);
    } else {
      console.log(`⏭️  Skipped (no changes needed): ${filePath}`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    errorCount++;
  }
});

console.log('\n=== Migration Summary ===');
console.log(`Total files processed: ${testFiles.length}`);
console.log(`Files converted: ${convertedCount}`);
console.log(`Errors: ${errorCount}`);
console.log('========================\n');

if (errorCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 Migration completed successfully!');
} 