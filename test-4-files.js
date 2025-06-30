// Test 4 Specific Files Script
// Purpose: Test the 4 specific files that were failing
// Procedure: Run each test file individually to verify fixes
// Conclusion: Confirm all 4 tests now pass

const { execSync } = require('child_process');
const path = require('path');

const testFiles = [
  'apps/web/tests/App.spec.jsx',
  'apps/web/tests/app.import.test.js',
  'apps/web/tests/components/framesync/InternalActionForm.spec.jsx',
  'apps/web/tests/components/framesync/PlaidActionForm.spec.jsx'
];

console.log('🧪 Testing 4 Specific Files');
console.log('=========================');

let passed = 0;
let failed = 0;

testFiles.forEach((file, index) => {
  console.log(`\n📋 Testing ${index + 1}/4: ${file}`);
  
  try {
    // Change to web directory and run test
    const result = execSync(`cd apps/web && pnpm test ${path.relative('apps/web', file)}`, {
      encoding: 'utf8',
      timeout: 30000,
      stdio: 'pipe'
    });
    
    if (result.includes('FAIL') || result.includes('Error:')) {
      console.log(`❌ FAILED: ${file}`);
      failed++;
    } else {
      console.log(`✅ PASSED: ${file}`);
      passed++;
    }
  } catch (error) {
    console.log(`❌ FAILED: ${file}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
});

console.log(`\n🎯 Test Results Summary:`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);

if (failed === 0) {
  console.log('\n🎉 All 4 tests are now passing!');
} else {
  console.log(`\n⚠️  ${failed} tests still failing`);
} 