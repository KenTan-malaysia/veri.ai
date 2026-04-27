# =====================================================================
# Find.ai — Path D Tenant Registration — Local Test Script (PowerShell)
# Run from the find-ai project root:  .\test-path-d.ps1
# =====================================================================

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  Find.ai  -  Path D  -  Tenant Pre-Registration Demo" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Sanity check: are we in the right folder?
if (-not (Test-Path ".\package.json")) {
    Write-Host "[X] package.json not found. Run this from the find-ai project root." -ForegroundColor Red
    exit 1
}

# 2. Check Node is installed
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "[X] Node.js not detected. Install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Node version: $nodeVersion" -ForegroundColor Green

# 3. Check the 4 Path D files exist
$pathDFiles = @(
    "src\lib\tenantProfile.js",
    "src\components\tools\TenantRegister.js",
    "src\components\tools\labels.js",
    "src\app\page.js"
)

Write-Host ""
Write-Host "Verifying Path D files..." -ForegroundColor Yellow
foreach ($file in $pathDFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        Write-Host "  [OK] $file  ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "  [X] MISSING: $file" -ForegroundColor Red
        exit 1
    }
}

# 4. Install dependencies if node_modules is missing
if (-not (Test-Path ".\node_modules")) {
    Write-Host ""
    Write-Host "Installing dependencies (first run only)..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[X] npm install failed." -ForegroundColor Red
        exit 1
    }
}

# 5. Clear any stale tenant profile from prior test runs
Write-Host ""
Write-Host "[i] Tip: to reset wizard progress, open browser DevTools and run:" -ForegroundColor Cyan
Write-Host "      localStorage.removeItem('fi_tenant_profile')" -ForegroundColor Gray
Write-Host "      localStorage.removeItem('fi_otp_state')" -ForegroundColor Gray
Write-Host "      localStorage.removeItem('fi_tenant_cache')" -ForegroundColor Gray

# 6. Print the test plan
Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  5-STEP WIZARD TEST PLAN" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Wait for 'ready - started server on localhost:3000'" -ForegroundColor White
Write-Host "  2. In browser: scroll to the 'For tenants / NEW' tile"   -ForegroundColor White
Write-Host "     (dark navy, below the 3-tool grid)"                   -ForegroundColor Gray
Write-Host "  3. Click the tile -> wizard opens from bottom"           -ForegroundColor White
Write-Host ""
Write-Host "  STEP 1  Phone + OTP"                                     -ForegroundColor Yellow
Write-Host "     Enter:  0123456789  (or +60123456789)"                -ForegroundColor Gray
Write-Host "     Click 'Send OTP'  -> 6-digit code shows on-screen"    -ForegroundColor Gray
Write-Host "     Enter the code  -> green 'Verified' pill"             -ForegroundColor Gray
Write-Host ""
Write-Host "  STEP 2  Identity"                                        -ForegroundColor Yellow
Write-Host "     Name:  Siti Nurhaliza Binti Taufik"                   -ForegroundColor Gray
Write-Host "     IC:    950801-14-5678  (any valid 12-digit format)"   -ForegroundColor Gray
Write-Host "     Selfie: optional, skip for speed"                     -ForegroundColor Gray
Write-Host ""
Write-Host "  STEP 3  TNB Account"                                     -ForegroundColor Yellow
Write-Host "     Account:   220012345678"                              -ForegroundColor Gray
Write-Host "     Upload any PDF/JPG as 'bill'  (mock OCR accepts all)" -ForegroundColor Gray
Write-Host "     Amount: 185.40 | Date: 2026-03 | Paid on time: Yes"   -ForegroundColor Gray
Write-Host ""
Write-Host "  STEP 4  Internet"                                        -ForegroundColor Yellow
Write-Host "     Provider: Unifi | Account: 60312345678"               -ForegroundColor Gray
Write-Host "     Same mock upload pattern"                             -ForegroundColor Gray
Write-Host ""
Write-Host "  STEP 5  Consents"                                        -ForegroundColor Yellow
Write-Host "     Tick PDPA registration (required)"                    -ForegroundColor Gray
Write-Host "     Tick monthly refresh (optional)"                      -ForegroundColor Gray
Write-Host "     Click 'Complete Registration'"                        -ForegroundColor Gray
Write-Host ""
Write-Host "  DONE: emerald celebration + grade card + share URL"      -ForegroundColor Green
Write-Host "        Copy / WhatsApp buttons functional"                -ForegroundColor Green
Write-Host ""
Write-Host "  RESUME TEST:"                                            -ForegroundColor Magenta
Write-Host "     Close the wizard mid-flow, refresh page, reopen."     -ForegroundColor Gray
Write-Host "     Wizard should auto-resume at the next unfinished step." -ForegroundColor Gray
Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# 7. Open browser after short delay
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 4
    Start-Process "http://localhost:3000"
} | Out-Null

# 8. Launch dev server (blocks until Ctrl+C)
Write-Host "Starting Next.js dev server..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host ""
npm run dev
