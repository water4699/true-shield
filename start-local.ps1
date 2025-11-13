# TrueShield - Start Local Development Environment
Write-Host "================================" -ForegroundColor Cyan
Write-Host " TrueShield Local Environment" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (!(Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}

if (!(Test-Path "frontend/node_modules")) {
    Write-Host ""
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    cd frontend
    npm install
    cd ..
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host " Starting Hardhat Local Node" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Network: http://localhost:8545" -ForegroundColor Yellow
Write-Host "Chain ID: 31337" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the node" -ForegroundColor Gray
Write-Host ""

# Start the local Hardhat node
npx hardhat node

