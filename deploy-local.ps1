# TrueShield - Deploy to Local Network
Write-Host "================================" -ForegroundColor Cyan
Write-Host " TrueShield - Local Deployment" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Deploying GamePreferenceSurvey contract..." -ForegroundColor Yellow
Write-Host ""

# Deploy to local network
npx hardhat deploy --network anvil

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host " Deployment Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the contract address from above" -ForegroundColor White
Write-Host "2. Update frontend/src/config/contracts.ts" -ForegroundColor White
Write-Host "3. Run: npm run dev:frontend" -ForegroundColor White
Write-Host ""

