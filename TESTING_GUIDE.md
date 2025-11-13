# TrueShield Testing Guide

**Purpose**: Complete testing checklist for voting and decryption functionality  
**Date**: 2025-11-12

---

## 🚀 Quick Start Testing

### Prerequisites
- ✅ Node.js v20+ installed
- ✅ MetaMask extension installed
- ✅ Test ETH on Sepolia (or local Hardhat node running)

---

## 📋 Testing Scenarios

### Scenario 1: Local Network Testing

#### Step 1: Start Local Network
```bash
cd E:\Spring\Zama\true-shield
npm run start:local
# Keep this terminal open
```

#### Step 2: Deploy Contract
```bash
# New terminal
cd E:\Spring\Zama\true-shield
npm run deploy:local
# Copy the deployed contract address
```

#### Step 3: Update Frontend Config
Edit `frontend/src/config/contracts.ts`:
```typescript
31337: {
  GamePreferenceSurvey: '0xYOUR_DEPLOYED_ADDRESS_HERE',
},
```

#### Step 4: Configure MetaMask
1. Open MetaMask → Settings → Networks
2. **Delete** any existing "Localhost" networks
3. Add new network:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`
4. Import a test account:
   - Use one of the private keys printed in the Hardhat node output (each has 10000 ETH on localhost)

#### Step 5: Start Frontend
```bash
cd E:\Spring\Zama\true-shield\frontend
npm run dev
```

#### Step 6: Test Voting Flow
1. ✅ Open `http://localhost:5173`
2. ✅ Connect wallet (should auto-connect to Hardhat Local)
3. ✅ You should see "Admin" badge (you're using the admin account)
4. ✅ Click "Create Survey" button
5. ✅ Fill in:
   - Title: `Game Mechanics Survey Q4 2025`
   - Description: `Help us understand which game features you prefer`
   - Duration: `3600` (1 hour)
6. ✅ Click "Create Survey"
7. ✅ Confirm transaction in MetaMask
8. ✅ Wait for "Survey created successfully!" message
9. ✅ Verify survey appears in list

#### Step 7: Test Voting
1. ✅ Click "Vote" button on the survey
2. ✅ Wait for "Initializing FHEVM..." to complete
3. ✅ Select preferences:
   - ☑ Player vs Player (PVP)
   - ☐ Player vs Environment (PVE)
   - ☑ Economic System
   - ☐ Other Mechanisms
4. ✅ Click "Submit Vote"
5. ✅ Verify status message: "Encrypting your votes..."
6. ✅ Confirm transaction in MetaMask
7. ✅ Wait for "Vote submitted successfully!" message
8. ✅ Verify survey shows "1 Response"

#### Step 8: Test Decryption
1. ✅ Click "View Results" on the survey
2. ✅ Wait for FHEVM initialization
3. ✅ Click "Decrypt Results" button
4. ✅ Verify status: "Requesting decryption access..."
5. ✅ Confirm first transaction (access request)
6. ✅ Verify status: "Preparing decryption signature..."
7. ✅ Sign EIP-712 message in MetaMask (no gas cost)
8. ✅ Verify status: "Decrypting results..."
9. ✅ Verify results display:
   - PVP: 1 (100%)
   - PVE: 0 (0%)
   - Economic: 1 (100%)
   - Others: 0 (0%)
   - Total: 2 preferences selected
10. ✅ Verify progress bars match percentages

#### Step 9: Test Multiple Votes
1. ✅ Import a second test account in MetaMask:
   - Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
2. ✅ Switch to this account
3. ✅ Vote on the same survey with different preferences:
   - ☐ PVP
   - ☑ PVE
   - ☐ Economic
   - ☑ Others
4. ✅ Submit vote and confirm
5. ✅ Switch back to admin account
6. ✅ View Results again
7. ✅ Decrypt and verify totals:
   - PVP: 1 (25%)
   - PVE: 1 (25%)
   - Economic: 1 (25%)
   - Others: 1 (25%)
   - Total: 4 preferences

---

### Scenario 2: Sepolia Testnet Testing

#### Step 1: Get Test ETH
Visit: https://sepoliafaucet.com/
- Connect your MetaMask
- Request test ETH

#### Step 2: Deploy to Sepolia (if needed)
```bash
# Set private key (if not already set)
npx hardhat vars set PRIVATE_KEY
# Paste your private key (starts with 0x)

# Deploy
npx hardhat deploy --network sepolia

# Verify the contract address matches frontend config
```

#### Step 3: Configure MetaMask
1. Switch to Sepolia network in MetaMask
2. Verify you have test ETH

#### Step 4: Test on Sepolia
Follow the same voting and decryption steps as local testing, but:
- ⚠️ Transactions will take longer (~15-30 seconds)
- ⚠️ Gas costs are real (though Sepolia ETH is free)
- ✅ You can verify transactions on Etherscan: https://sepolia.etherscan.io/

---

## 🐛 Common Issues & Solutions

### Issue: "Initializing FHEVM..." Stuck

**Solution**:
1. Open browser DevTools (F12) → Console
2. Check for errors
3. Verify network is correct (31337 or 11155111)
4. Try refreshing the page

### Issue: "missing revert data" Error

**Solution**:
1. Reset MetaMask account: Settings → Advanced → Reset Account
2. Verify contract is deployed: Check contract address in config
3. Verify you're on the correct network

### Issue: "insufficient funds" Error

**Solution**:
- **Localhost**: Import test account private keys
- **Sepolia**: Get test ETH from faucet

### Issue: MetaMask Shows Wrong Network

**Solution**:
1. Delete all "Localhost" networks in MetaMask
2. Add fresh network with correct settings:
   - Chain ID: **31337** (not 1337!)
   - RPC: `http://127.0.0.1:8545`

### Issue: Decryption Shows Wrong Numbers

**Check**:
1. Are you decrypting the correct survey?
2. Did you vote multiple times with same account? (Should be prevented)
3. Try voting with a fresh account and re-test

### Issue: Survey Doesn't Appear

**Solution**:
1. Refresh the page
2. Check browser console for errors
3. Verify `getSurveyCount()` returns correct value in DevTools

---

## ✅ Success Criteria

### Voting Flow
- [ ] Survey creation succeeds
- [ ] Vote dialog opens and initializes FHEVM
- [ ] Can select multiple preferences
- [ ] Vote submission succeeds with correct gas usage
- [ ] Survey shows correct response count
- [ ] Cannot vote twice with same account

### Decryption Flow
- [ ] Results dialog opens and initializes FHEVM
- [ ] Decryption access request succeeds
- [ ] EIP-712 signature requested (one-time)
- [ ] Decryption completes without errors
- [ ] Results display with correct values
- [ ] Progress bars match percentages
- [ ] Chart colors are distinct
- [ ] Total count is accurate

### Performance
- [ ] No 429 errors in console
- [ ] No excessive RPC requests
- [ ] Page loads quickly
- [ ] Smooth UI transitions
- [ ] MetaMask prompts are reasonable

### Error Handling
- [ ] Clear error messages
- [ ] Can recover from errors
- [ ] Validation works (e.g., must select at least one preference)
- [ ] Loading states are shown

---

## 📊 Test Results Template

```markdown
## Test Results - [Date]

**Tester**: [Your Name]
**Environment**: [Localhost/Sepolia]
**Browser**: [Chrome/Firefox/etc]

### Voting Flow
- Survey Creation: ✅ PASS / ❌ FAIL
- Vote Submission: ✅ PASS / ❌ FAIL
- Multiple Votes: ✅ PASS / ❌ FAIL

### Decryption Flow
- Access Request: ✅ PASS / ❌ FAIL
- Signature: ✅ PASS / ❌ FAIL
- Results Display: ✅ PASS / ❌ FAIL

### Issues Found
1. [Issue description]
2. [Issue description]

### Screenshots
[Attach screenshots if needed]
```

---

## 🎯 Final Checklist

Before marking as production-ready:

- [ ] Tested on localhost with multiple accounts
- [ ] Tested on Sepolia testnet
- [ ] All success criteria met
- [ ] No console errors
- [ ] Gas usage reasonable
- [ ] UI/UX smooth and responsive
- [ ] Error messages clear and helpful
- [ ] Documentation updated
- [ ] README has correct contract addresses

---

**Happy Testing! 🧪**

