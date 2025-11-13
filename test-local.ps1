# TrueShield - Run Local Tests
Write-Host "================================" -ForegroundColor Cyan
Write-Host " TrueShield - Testing Suite" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Running Unit Tests" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
npx hardhat test test/GamePreferenceSurvey.ts

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Unit tests failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Running Integration Tests" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Note: Make sure local node is running (npm run start:local)" -ForegroundColor Gray
Write-Host ""

npx hardhat test test/GamePreferenceSurveyLocal.ts --network anvil

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Integration tests failed!" -ForegroundColor Red
    Write-Host "Make sure the local Hardhat node is running." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host " ✓ All Tests Passed!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

