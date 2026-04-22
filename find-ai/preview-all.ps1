# =====================================================================
# Find.ai — Phase 1 UI Preview Launcher
# Opens all 3 bento design directions + live dev app side-by-side
# Run from the find-ai project root:  .\preview-all.ps1
# =====================================================================

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  Find.ai  -  Phase 1 Bento  -  3-way Preview" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Sanity check
if (-not (Test-Path ".\package.json")) {
    Write-Host "[X] Not in project root. cd into the find-ai folder first." -ForegroundColor Red
    exit 1
}

# Check all 3 preview files exist
$previews = @(
    "ui-preview-index.html",
    "ui-preview-v2.html",
    "ui-preview-v3-dark.html",
    "ui-preview-v4-swiss.html"
)

Write-Host "Verifying preview files..." -ForegroundColor Yellow
foreach ($file in $previews) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "  [X] MISSING: $file" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  DESIGN DIRECTIONS" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  v2  Warm Editorial   Cream + Navy  (approachable · bank-trust)"    -ForegroundColor White
Write-Host "  v3  Dark Editorial   Ink + Gold    (luxury · legal gravitas)"      -ForegroundColor Yellow
Write-Host "  v4  Swiss Minimal    Black + White (modern · Linear/Vercel feel)"  -ForegroundColor Gray
Write-Host ""
Write-Host "  INDEX  Comparison hub with side-by-side + recommendation" -ForegroundColor Cyan
Write-Host ""

# Opening preview index in default browser
Write-Host "Opening comparison hub..." -ForegroundColor Yellow
Start-Process ".\ui-preview-index.html"

Start-Sleep -Seconds 1

# Optional: ask if user wants to also launch dev server
Write-Host ""
Write-Host "Also launch the live Next.js dev app? (shows current page.js)" -ForegroundColor Cyan
$launchDev = Read-Host "[Y] Yes  [N] No  (default N)"

if ($launchDev -eq "Y" -or $launchDev -eq "y") {
    Write-Host ""
    Write-Host "Starting dev server on port 3000..." -ForegroundColor Yellow

    if (-not (Test-Path ".\node_modules")) {
        Write-Host "Installing deps (first run only)..." -ForegroundColor Gray
        npm install
    }

    Start-Job -ScriptBlock {
        Start-Sleep -Seconds 5
        Start-Process "http://localhost:3000"
    } | Out-Null

    Write-Host "Press Ctrl+C to stop the dev server." -ForegroundColor Gray
    npm run dev
} else {
    Write-Host ""
    Write-Host "=====================================================" -ForegroundColor Green
    Write-Host "  Previews opened. Pick your winner and tell Zeus." -ForegroundColor Green
    Write-Host "=====================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step:" -ForegroundColor Yellow
    Write-Host "  Say 'ship v2' (or v3 or v4) and Zeus will port it"  -ForegroundColor White
    Write-Host "  into src\app\page.js + src\app\landing.js."         -ForegroundColor White
    Write-Host ""
}
