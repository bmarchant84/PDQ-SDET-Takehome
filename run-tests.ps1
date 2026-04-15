# run-tests.ps1
<#
.SYNOPSIS
    PDQ SDET Takehome - Test Runner & JSON Parser
.DESCRIPTION
    Runs Playwright tests, outputs results to JSON, and evaluates 
    the results to determine the final exit status.
#>

param(
    [switch]$ShowBrowser
)

# Stop script execution on internal PowerShell errors
$ErrorActionPreference = "Stop"

Write-Host "`n🚀 Initializing PDQ SDET Test Suite" -ForegroundColor Magenta
Write-Host "---------------------------------------" -ForegroundColor Magenta

# 1. Cleanup: Remove old results (handles both files and folders)
$jsonPath = "results.json"
if (Test-Path $jsonPath) { 
    Remove-Item $jsonPath -Recurse -Force 
}

# 2. Dependency Check
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️ node_modules missing. Running npm install..." -ForegroundColor Yellow
    npm install
}

# 3. Execution Logic
$mode = $ShowBrowser ? "--headed" : ""
Write-Host "🏃 Running Playwright tests..." -ForegroundColor Cyan

# Use environment variable to set the JSON filename and run the reporter
$env:PLAYWRIGHT_JSON_OUTPUT_NAME = $jsonPath
npx playwright test $mode --reporter=list,json

# 4. Read and Evaluate JSON Results
if (Test-Path $jsonPath) {
    # Convert the raw JSON text into a usable PowerShell Object
    $results = Get-Content $jsonPath -Raw | ConvertFrom-Json
    
    # Extract Statistics
    $passed   = $results.stats.expected
    $failed   = $results.stats.unexpected
    $flaky    = $results.stats.flaky
    
    # Extract Execution Errors (e.g., Browser launch failures like Webkit on Mac12)
    $errors = if ($results.errors) { $results.errors.Count } else { 0 }
    
    Write-Host "`n" + ("=" * 45)
    Write-Host " 📋 PDQ AUTOMATION SUMMARY" -ForegroundColor Cyan
    Write-Host "---------------------------------------------"
    Write-Host " ✅ Passed:  $passed" -ForegroundColor Green
    Write-Host " ❌ Failed:  $failed" -ForegroundColor ($failed -gt 0 ? "Red" : "Gray")
    Write-Host " ⚠️  Errors:  $errors" -ForegroundColor ($errors -gt 0 ? "Red" : "Gray")
    Write-Host ("=" * 45)

    # 5. Final Decision Gate
    # The script only returns success (0) if tests passed AND no environment errors occurred.
    if ($failed -eq 0 -and $errors -eq 0) {
        Write-Host "`n✨ SUCCESS: Suite execution completed perfectly." -ForegroundColor Green
        $exitCode = 0
    } else {
        Write-Host "`n🛑 FAILURE: Suite encountered $failed failures and $errors errors." -ForegroundColor Red
        # Note: $errors > 0 likely indicates the Webkit/macOS version mismatch.
        $exitCode = 1
    }
} else {
    Write-Host "`n❌ CRITICAL: results.json was not generated. Test execution failed." -ForegroundColor Red
    $exitCode = 1
}

# Pass the final exit code back to the system (vital for CI/CD)
exit $exitCode