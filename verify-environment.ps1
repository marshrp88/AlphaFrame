# AlphaFrame Environment Verification Script
# Purpose: Verify that the environment is working correctly after cleanup
# Procedure: Test dev server, test suite, and key dependencies
# Conclusion: Confirm environment is ready for development

Write-Host "🔍 AlphaFrame Environment Verification" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if key dependencies are installed
Write-Host "`n📋 Step 1: Checking dependencies..." -ForegroundColor Yellow

$dependencies = @(
    "vite",
    "vitest",
    "react",
    "react-dom"
)

foreach ($dep in $dependencies) {
    try {
        $version = pnpm list $dep --depth=0 2>$null | Select-String $dep
        if ($version) {
            Write-Host "✅ $dep is installed" -ForegroundColor Green
        } else {
            Write-Host "❌ $dep is missing" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Could not check $dep" -ForegroundColor Red
    }
}

# Check if node_modules exists
Write-Host "`n📋 Step 2: Checking node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ Root node_modules exists" -ForegroundColor Green
} else {
    Write-Host "❌ Root node_modules missing" -ForegroundColor Red
}

if (Test-Path "apps/web/node_modules") {
    Write-Host "✅ Web app node_modules exists" -ForegroundColor Green
} else {
    Write-Host "❌ Web app node_modules missing" -ForegroundColor Red
}

# Test Vite configuration
Write-Host "`n📋 Step 3: Testing Vite configuration..." -ForegroundColor Yellow
try {
    $viteConfig = Get-Content "apps/web/vite.config.js" -ErrorAction Stop
    Write-Host "✅ Vite config file found" -ForegroundColor Green
} catch {
    Write-Host "❌ Vite config file missing" -ForegroundColor Red
}

# Test package.json scripts
Write-Host "`n📋 Step 4: Testing package.json scripts..." -ForegroundColor Yellow
try {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $scripts = $packageJson.scripts.PSObject.Properties.Name
    Write-Host "Available scripts: $($scripts -join ', ')" -ForegroundColor Green
} catch {
    Write-Host "❌ Could not read package.json" -ForegroundColor Red
}

Write-Host "`n🎯 Environment verification complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run 'pnpm dev' to test the development server" -ForegroundColor White
Write-Host "2. Run 'pnpm test' to test the test suite" -ForegroundColor White
Write-Host "3. If all tests pass, the environment is ready!" -ForegroundColor White 