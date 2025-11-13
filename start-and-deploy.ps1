# TrueShield - Complete Local Setup
Write-Host "================================" -ForegroundColor Cyan
Write-Host " TrueShield - Local Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "Step 1: Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    exit 1
}

# Step 2: Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "Step 2: Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}

if (!(Test-Path "frontend/node_modules")) {
    Write-Host ""
    Write-Host "Step 3: Installing frontend dependencies..." -ForegroundColor Yellow
    cd frontend
    npm install
    cd ..
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host " Starting Services" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will:" -ForegroundColor Yellow
Write-Host "1. Start Hardhat local node in background" -ForegroundColor White
Write-Host "2. Deploy contracts to local network" -ForegroundColor White
Write-Host "3. Show you the contract address" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "Starting Hardhat node..." -ForegroundColor Yellow

# Start Hardhat node in background
$hardhatJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npx hardhat node
}

Write-Host "Waiting for node to start (10 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Deploying contracts to local network..." -ForegroundColor Yellow
npx hardhat deploy --network anvil

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host " Setup Complete!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update contract address in frontend/src/config/contracts.ts" -ForegroundColor White
    Write-Host "2. Run: npm run dev:frontend" -ForegroundColor White
    Write-Host "3. Configure MetaMask to localhost network (Chain ID: 31337)" -ForegroundColor White
    Write-Host ""
    Write-Host "To stop the local node, run: Get-Job | Stop-Job" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Hardhat node is running in background (Job ID: $($hardhatJob.Id))" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "✗ Deployment failed!" -ForegroundColor Red
    Get-Job | Stop-Job
    Get-Job | Remove-Job
}

