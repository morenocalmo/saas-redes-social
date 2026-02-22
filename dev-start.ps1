# dev-start.ps1
# Starts cloudflared tunnel + Next.js dev server
# Auto-updates .env with the new tunnel URL

$envFile = ".env"
$logFile = "cf_tunnel.log"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   ExclusiveLink - Dev Startup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# --- Step 0: Kill existing Node processes (free port 3000) ---
Write-Host "[0/3] Freeing port 3000..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1
Write-Host "[OK] Port 3000 is free" -ForegroundColor Green
Write-Host ""

# --- Step 1: Start cloudflared in background and capture URL ---
Write-Host "[1/3] Starting Cloudflare Tunnel..." -ForegroundColor Yellow

# Remove old log
if (Test-Path $logFile) { Remove-Item $logFile }

# Start tunnel as background job writing to log
$job = Start-Job -ScriptBlock {
    param($log)
    cloudflared tunnel --url http://localhost:3000 2>&1 | Tee-Object -FilePath $log
} -ArgumentList (Join-Path $PSScriptRoot $logFile)

# Wait for URL to appear in log (up to 20s)
$tunnelUrl = $null
$tries = 0
while (-not $tunnelUrl -and $tries -lt 40) {
    Start-Sleep -Milliseconds 500
    $tries++
    if (Test-Path $logFile) {
        $logContent = Get-Content $logFile -Raw -Encoding ASCII 2>$null
        if ($logContent) {
            # Join lines and search for URL (cloudflared may split URL across lines)
            $joined = ($logContent -replace "`r`n", "" -replace "`n", "")
            $match = [regex]::Match($joined, 'https://[a-z0-9\-]+\.trycloudflare\.com')
            if ($match.Success) {
                $tunnelUrl = $match.Value
            }
        }
    }
}

if (-not $tunnelUrl) {
    Write-Host "[ERROR] Could not get Cloudflare URL. Check cloudflared is installed." -ForegroundColor Red
    Write-Host "        Run: npm install -g cloudflared" -ForegroundColor Red
    Stop-Job $job -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "[OK] Tunnel active: $tunnelUrl" -ForegroundColor Green

# --- Step 2: Auto-update .env ---
Write-Host ""
Write-Host "[2/3] Updating .env with new tunnel URL..." -ForegroundColor Yellow

$callbackUrl = "$tunnelUrl/api/instagram/callback"
$envContent = Get-Content $envFile -Raw

# Replace INSTAGRAM_REDIRECT_URI value
$newEnv = $envContent -replace 'INSTAGRAM_REDIRECT_URI="[^"]*"', "INSTAGRAM_REDIRECT_URI=`"$callbackUrl`""

Set-Content $envFile -Value $newEnv -NoNewline

Write-Host "[OK] INSTAGRAM_REDIRECT_URI updated to:" -ForegroundColor Green
Write-Host "     $callbackUrl" -ForegroundColor White

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Remember to update Meta portal:" -ForegroundColor Yellow
Write-Host "  OAuth URI: $callbackUrl" -ForegroundColor White
Write-Host "  App Domain: $($tunnelUrl -replace 'https://', '')" -ForegroundColor White
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# --- Step 3: Start Next.js dev server ---
Write-Host "[3/3] Starting Next.js dev server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Local:   http://localhost:3000" -ForegroundColor Green
Write-Host "  Public:  $tunnelUrl" -ForegroundColor Green
Write-Host ""

npm run dev
