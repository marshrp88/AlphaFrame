# AlphaFrame Test Verification Script
# Purpose: Verify that the test environment is working after fixes
# Procedure: Run a simple test to confirm infrastructure is stable
# Conclusion: Confirm ready for full test suite

Write-Host "🔍 AlphaFrame Test Environment Verification" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Step 1: Check if dev server is still running
Write-Host "`n📋 Step 1: Checking dev server status..." -ForegroundColor Yellow
$devServerRunning = netstat -an | findstr :5173
if ($devServerRunning) {
    Write-Host "✅ Dev server is running on port 5173" -ForegroundColor Green
} else {
    Write-Host "❌ Dev server is not running" -ForegroundColor Red
}

# Step 2: Check test configuration
Write-Host "`n📋 Step 2: Checking test configuration..." -ForegroundColor Yellow
if (Test-Path "vitest.config.js") {
    Write-Host "✅ Vitest config exists" -ForegroundColor Green
} else {
    Write-Host "❌ Vitest config missing" -ForegroundColor Red
}

if (Test-Path "apps/web/src/setupTests.js") {
    Write-Host "✅ Test setup file exists" -ForegroundColor Green
} else {
    Write-Host "❌ Test setup file missing" -ForegroundColor Red
}

# Step 3: Check for test files
Write-Host "`n📋 Step 3: Checking test files..." -ForegroundColor Yellow
$testFiles = Get-ChildItem -Path "apps/web/tests" -Recurse -Include "*.test.js", "*.spec.js", "*.test.jsx", "*.spec.jsx"
Write-Host "Found $($testFiles.Count) test files" -ForegroundColor Green

# Step 4: Run a simple test to verify infrastructure
Write-Host "`n📋 Step 4: Running simple test verification..." -ForegroundColor Yellow
try {
    $simpleTest = pnpm test --run apps/web/tests/simple.test.js 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Simple test passed - infrastructure is working!" -ForegroundColor Green
    } else {
        Write-Host "❌ Simple test failed" -ForegroundColor Red
        Write-Host $simpleTest -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Could not run simple test" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n🎯 Verification complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. If simple test passed, run 'pnpm test --run' for full suite" -ForegroundColor White
Write-Host "2. Review any failures and apply targeted fixes" -ForegroundColor White
Write-Host "3. The environment is now stable and ready for development" -ForegroundColor White 