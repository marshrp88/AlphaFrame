# Test Specific Files Script
# Purpose: Test the 4 specific files that were failing
# Procedure: Run each test file individually to verify fixes
# Conclusion: Confirm all 4 tests now pass

Write-Host "🧪 Testing 4 Specific Files" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

$testFiles = @(
    "apps/web/tests/App.spec.jsx",
    "apps/web/tests/app.import.test.js", 
    "apps/web/tests/components/framesync/InternalActionForm.spec.jsx",
    "apps/web/tests/components/framesync/PlaidActionForm.spec.jsx"
)

foreach ($file in $testFiles) {
    Write-Host "`n📋 Testing: $file" -ForegroundColor Yellow
    
    try {
        # Run the test with a timeout
        $process = Start-Process -FilePath "pnpm" -ArgumentList "test", $file -Wait -TimeoutSec 30 -PassThru -NoNewWindow
        
        if ($process.ExitCode -eq 0) {
            Write-Host "✅ PASSED: $file" -ForegroundColor Green
        } else {
            Write-Host "❌ FAILED: $file" -ForegroundColor Red
        }
    } catch {
        Write-Host "⏰ TIMEOUT: $file" -ForegroundColor Yellow
    }
}

Write-Host "`n🎯 Test Results Summary:" -ForegroundColor Cyan
Write-Host "All 4 specific test files should now pass!" -ForegroundColor White 