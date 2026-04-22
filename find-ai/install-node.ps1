# =====================================================================
# Find.ai - Node.js LTS installer (winget path)
# Run from the find-ai project root:  .\install-node.ps1
# After it finishes: CLOSE this PowerShell window and open a NEW one
# then run:  .\preview-all.ps1
# =====================================================================

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  Find.ai  -  Node.js LTS Installer (via winget)" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# ---------- 1. Check if Node is already installed ----------
Write-Host "[1/4] Checking if Node.js is already installed..." -ForegroundColor Yellow
$existingNode = Get-Command node -ErrorAction SilentlyContinue
if ($existingNode) {
    $v = & node --version 2>$null
    Write-Host "  [OK] Node is already installed: $v" -ForegroundColor Green
    Write-Host "  [OK] Location: $($existingNode.Source)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Nothing to do. Run .\preview-all.ps1 to launch previews + dev server." -ForegroundColor Cyan
    exit 0
}
Write-Host "  [--] Not installed. Proceeding with winget..." -ForegroundColor Gray

# ---------- 2. Verify winget is available ----------
Write-Host ""
Write-Host "[2/4] Verifying winget..." -ForegroundColor Yellow
$winget = Get-Command winget -ErrorAction SilentlyContinue
if (-not $winget) {
    Write-Host "  [X] winget not found on this machine." -ForegroundColor Red
    Write-Host ""
    Write-Host "Fix: install 'App Installer' from the Microsoft Store, or" -ForegroundColor Yellow
    Write-Host "download the Node.js LTS .msi directly:" -ForegroundColor Yellow
    Write-Host "  https://nodejs.org/en/download" -ForegroundColor White
    exit 1
}
$wv = & winget --version 2>$null
Write-Host "  [OK] winget $wv" -ForegroundColor Green

# ---------- 3. Install Node.js LTS ----------
Write-Host ""
Write-Host "[3/4] Installing OpenJS.NodeJS.LTS (this takes 1-3 minutes)..." -ForegroundColor Yellow
Write-Host "  -> downloading + running the official .msi silently" -ForegroundColor Gray
Write-Host ""

& winget install --id OpenJS.NodeJS.LTS --exact --silent `
    --accept-source-agreements --accept-package-agreements

$exit = $LASTEXITCODE
Write-Host ""
if ($exit -ne 0 -and $exit -ne -1978335189) {
    # -1978335189 = already installed (not an error)
    Write-Host "  [X] winget returned exit code $exit" -ForegroundColor Red
    Write-Host ""
    Write-Host "Fallbacks:" -ForegroundColor Yellow
    Write-Host "  1. Try: winget install OpenJS.NodeJS.LTS  (without --silent)" -ForegroundColor White
    Write-Host "  2. Or download .msi directly: https://nodejs.org/en/download" -ForegroundColor White
    exit 1
}
Write-Host "  [OK] Installation completed." -ForegroundColor Green

# ---------- 4. Refresh PATH in this session (won't fully persist) ----------
Write-Host ""
Write-Host "[4/4] Refreshing PATH for this session..." -ForegroundColor Yellow
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path","User")

$newNode = Get-Command node -ErrorAction SilentlyContinue
if ($newNode) {
    $nv = & node --version 2>$null
    $npmv = & npm --version 2>$null
    Write-Host "  [OK] node $nv" -ForegroundColor Green
    Write-Host "  [OK] npm  $npmv" -ForegroundColor Green
} else {
    Write-Host "  [!!] Node installed but PATH not refreshed in this window." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "  DONE. Next steps:" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  1. CLOSE this PowerShell window." -ForegroundColor White
Write-Host "  2. Open a NEW PowerShell window." -ForegroundColor White
Write-Host "  3. cd back into the find-ai folder:" -ForegroundColor White
Write-Host "       cd `"C:\Users\Tan Ken Yap\Documents\data collection\OneDrive\Desktop\Claude\find-ai`"" -ForegroundColor Gray
Write-Host "  4. Verify:" -ForegroundColor White
Write-Host "       node --version     (should print v20.x.x or v22.x.x)" -ForegroundColor Gray
Write-Host "       npm  --version     (should print 10.x.x)" -ForegroundColor Gray
Write-Host "  5. Run the preview + dev server:" -ForegroundColor White
Write-Host "       .\preview-all.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "(A fresh window is required because winget updates PATH at the" -ForegroundColor DarkGray
Write-Host " machine level and existing shells don't pick it up automatically.)" -ForegroundColor DarkGray
Write-Host ""
