/**
 * Fix Jest Imports Script
 * 
 * Purpose: Automatically convert Jest imports to Vitest imports across the codebase
 * Procedure: Replace @jest/globals imports with vitest imports and jest references with vi
 * Conclusion: Ensures all test files use Vitest instead of Jest
 */

const fs = require('fs');
const path = require('path');

// Files to fix based on the grep search results
const filesToFix = [
  'apps/web/tests/unit/components/DashboardPicker.test.jsx',
  'apps/web/tests/components/framesync/WebhookActionForm.spec.jsx',
  'apps/web/tests/components/framesync/PlaidActionForm.spec.jsx',
  'apps/web/tests/components/Button.test.jsx',
  'apps/web/tests/components/Button.spec.jsx',
  'apps/web/tests/App.spec.jsx',
  'apps/web/src/tests/components/framesync/PlaidActionForm.spec.jsx',
  'apps/web/src/tests/components/framesync/InternalActionForm.spec.jsx',
  'apps/web/src/features/pro/tests/DashboardModeManager.test.jsx',
  'apps/web/src/features/pro/tests/FeedbackModule.test.jsx',
  'apps/web/src/features/pro/tests/minimalRender.test.jsx',
  'apps/web/src/pages/RulesPage.test.jsx'
];

function fixJestImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace @jest/globals imports with vitest
    content = content.replace(
      /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@jest\/globals['"]/g,
      (match, imports) => {
        // Replace jest with vi in the imports
        const fixedImports = imports.replace(/\bjest\b/g, 'vi');
        return `import { ${fixedImports} } from 'vitest'`;
      }
    );
    
    // Replace standalone jest references with vi
    content = content.replace(/\bjest\./g, 'vi.');
    content = content.replace(/\bjest\b/g, 'vi');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Fix all files
filesToFix.forEach(fixJestImports);

console.log('🎉 Jest to Vitest conversion complete!'); 