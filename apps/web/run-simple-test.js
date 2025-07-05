const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Running simple test to validate Vitest setup...');

try {
  // Run the simple test with minimal output
  const result = execSync('pnpm vitest run test/simple.test.js --reporter=basic --no-coverage', {
    cwd: __dirname,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ Test passed!');
  console.log(result);
  
} catch (error) {
  console.log('❌ Test failed:');
  console.log(error.stdout || error.message);
  
  if (error.stderr) {
    console.log('Error details:');
    console.log(error.stderr);
  }
} 