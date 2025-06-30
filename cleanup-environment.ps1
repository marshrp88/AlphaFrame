# AlphaFrame Environment Cleanup Script
# Purpose: Safely clean up corrupted dependencies and locked files
# Procedure: Kill processes, remove node_modules, reinstall dependencies
# Conclusion: Restore working development environment

Write-Host "🧹 AlphaFrame Environment Cleanup Script" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Step 1: Kill any running Node.js processes
Write-Host "`n📋 Step 1: Stopping Node.js processes..." -ForegroundColor Yellow
try {
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        Write-Host "Found $($nodeProcesses.Count) Node.js processes. Stopping them..." -ForegroundColor Yellow
        $nodeProcesses | Stop-Process -Force
        Start-Sleep -Seconds 2
        Write-Host "✅ Node.js processes stopped" -ForegroundColor Green
    } else {
        Write-Host "✅ No Node.js processes found" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Warning: Could not stop all Node.js processes" -ForegroundColor Yellow
}

# Step 2: Remove node_modules directories
Write-Host "`n📋 Step 2: Removing node_modules directories..." -ForegroundColor Yellow
$directoriesToRemove = @(
    "node_modules",
    "apps/web/node_modules"
)

foreach ($dir in $directoriesToRemove) {
    if (Test-Path $dir) {
        Write-Host "Removing $dir..." -ForegroundColor Yellow
        try {
            Remove-Item -Path $dir -Recurse -Force -ErrorAction Stop
            Write-Host "✅ Removed $dir" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to remove $dir. You may need to manually delete it." -ForegroundColor Red
        }
    } else {
        Write-Host "✅ $dir not found (already removed)" -ForegroundColor Green
    }
}

# Step 3: Remove lock files
Write-Host "`n📋 Step 3: Removing lock files..." -ForegroundColor Yellow
$lockFiles = @(
    "pnpm-lock.yaml",
    "package-lock.json",
    "yarn.lock"
)

foreach ($file in $lockFiles) {
    if (Test-Path $file) {
        try {
            Remove-Item -Path $file -Force -ErrorAction Stop
            Write-Host "✅ Removed $file" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to remove $file" -ForegroundColor Red
        }
    }
}

# Step 4: Clear pnpm cache
Write-Host "`n📋 Step 4: Clearing pnpm cache..." -ForegroundColor Yellow
try {
    pnpm store prune
    Write-Host "✅ pnpm cache cleared" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: Could not clear pnpm cache" -ForegroundColor Yellow
}

# Step 5: Reinstall dependencies
Write-Host "`n📋 Step 5: Reinstalling dependencies..." -ForegroundColor Yellow
try {
    Write-Host "Installing root dependencies..." -ForegroundColor Yellow
    pnpm install
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Write-Host "Please run 'pnpm install' manually" -ForegroundColor Yellow
}

Write-Host "`n🎉 Environment cleanup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run 'pnpm dev' to start the development server" -ForegroundColor White
Write-Host "2. Run 'pnpm test' to verify the test suite" -ForegroundColor White
Write-Host "3. If any issues persist, check the error messages above" -ForegroundColor White 