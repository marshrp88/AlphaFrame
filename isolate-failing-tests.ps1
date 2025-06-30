# AlphaFrame Test Isolation Script
# Purpose: Isolate the exact 4 failing tests
# Procedure: Run tests with specific patterns to identify failures
# Conclusion: Get precise failure details for targeted fixes

Write-Host "🔍 Isolating 4 Failing Tests" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan

# Step 1: Run only unit tests
Write-Host "`n📋 Step 1: Running unit tests..." -ForegroundColor Yellow
try {
    $unitTests = pnpm test --run apps/web/tests/unit/ 2>&1
    Write-Host "Unit tests completed" -ForegroundColor Green
} catch {
    Write-Host "Unit tests failed" -ForegroundColor Red
}

# Step 2: Run only store tests
Write-Host "`n📋 Step 2: Running store tests..." -ForegroundColor Yellow
try {
    $storeTests = pnpm test --run apps/web/tests/store/ 2>&1
    Write-Host "Store tests completed" -ForegroundColor Green
} catch {
    Write-Host "Store tests failed" -ForegroundColor Red
}

# Step 3: Run only component tests
Write-Host "`n📋 Step 3: Running component tests..." -ForegroundColor Yellow
try {
    $componentTests = pnpm test --run apps/web/tests/components/ 2>&1
    Write-Host "Component tests completed" -ForegroundColor Green
} catch {
    Write-Host "Component tests failed" -ForegroundColor Red
}

# Step 4: Run only integration tests
Write-Host "`n📋 Step 4: Running integration tests..." -ForegroundColor Yellow
try {
    $integrationTests = pnpm test --run apps/web/tests/integration/ 2>&1
    Write-Host "Integration tests completed" -ForegroundColor Green
} catch {
    Write-Host "Integration tests failed" -ForegroundColor Red
}

Write-Host "`n🎯 Test isolation complete!" -ForegroundColor Green
Write-Host "Check the output above for specific failure details" -ForegroundColor White 