# TrueShield - Encrypted Game Preference Survey

A privacy-preserving game preference survey system built with FHEVM (Fully Homomorphic Encryption Virtual Machine). Players can anonymously vote for their favorite game mechanisms (PVP, PVE, Economic System, Others) while maintaining complete privacy.

## 🎮 Features

- **Encrypted Voting**: All preferences are encrypted using FHE, ensuring complete privacy
- **Homomorphic Aggregation**: Vote totals are computed without decryption
- **Multi-Choice Survey**: Support for multiple game mechanism preferences (PVP, PVE, Economic, Others)
- **Admin Controls**: Survey creation, closure, and result decryption
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Rainbow Wallet Integration**: Seamless wallet connection with RainbowKit

## 📋 Business Logic

### Game Preference Survey Flow

1. **Survey Creation**: Admin creates a survey with title, description, and duration
2. **Encrypted Submission**: Players submit encrypted preferences (multi-select vector [1,0,1,0])
3. **Homomorphic Addition**: Smart contract aggregates votes without decryption
4. **Result Decryption**: Admin can decrypt and view final results after survey closes

### Privacy Guarantees

- Individual votes remain encrypted on-chain
- Only aggregated results can be decrypted by admin
- No one can see individual player preferences
- Suitable for GameFi data collection and market research

## 🛠 Technology Stack

### Smart Contracts
- **Solidity 0.8.27**: Smart contract language
- **FHEVM 0.8.0**: Fully Homomorphic Encryption support
- **Hardhat 2.26.0**: Development environment

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **TailwindCSS**: Styling
- **RainbowKit 2.1.0**: Wallet connection
- **Wagmi 2.9.0**: Ethereum interactions
- **@zama-fhe/relayer-sdk 0.2.0**: FHE encryption (CDN loaded)
- **shadcn/ui**: Component library

### 🔐 FHE Integration

This project uses **@zama-fhe/relayer-sdk** loaded dynamically from CDN to avoid WASM bundling issues:

- **Dynamic Loading**: SDK loaded from `https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs`
- **No WASM Issues**: Avoids build-time WASM compilation problems
- **Auto-Detection**: Automatically detects local mock network vs. production
- **Efficient**: Only loads when needed in the browser

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MetaMask or another Web3 wallet

### Installation

```bash
# Clone the repository
cd true-shield

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## 📝 Running on Multiple Networks

The application supports both **Local Network** and **Sepolia Testnet**. You can switch between them in MetaMask.

### 🔧 Network Configuration

#### ✅ **Sepolia Testnet**
- **Chain ID**: 11155111
- **Status**: Ready for deployment

#### 🏠 **Local Network (For Development)**
- **Chain ID**: 31337
- **RPC**: http://localhost:8545

---

### 🚀 Option 1: Use Sepolia Testnet (Recommended for Testing)

The contract is already deployed and ready to use!

#### Step 1: Get Test ETH
Visit: https://sepoliafaucet.com/

#### Step 2: Configure MetaMask
Add Sepolia network (usually pre-configured):
- **Network Name**: Sepolia
- **RPC URL**: https://1rpc.io/sepolia
- **Chain ID**: 11155111
- **Currency Symbol**: ETH

#### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` and connect to Sepolia network in MetaMask!

---

### 🏠 Option 2: Use Local Network (For Development)

#### Step 1: Start Local Network

```bash
# Terminal 1: Start Hardhat node
npm run start:local
# or use PowerShell script
./start-local.ps1
```

#### Step 2: Deploy Contracts

```bash
# Terminal 2: Deploy to local network
npm run deploy:local
# or use PowerShell script
./deploy-local.ps1
```

Copy the deployed contract address and update `frontend/src/config/contracts.ts`:

```typescript
31337: { // Localhost
  GamePreferenceSurvey: '0xYOUR_DEPLOYED_ADDRESS_HERE',
}
```

#### Step 3: Configure MetaMask

Add Hardhat Local network:
- **Network Name**: Hardhat Local
- **RPC URL**: http://localhost:8545
- **Chain ID**: 31337
- **Currency Symbol**: ETH

Import test accounts from Hardhat node output.

#### Step 4: Start Frontend

```bash
# Terminal 3: Start frontend
npm run dev:frontend
```

Visit `http://localhost:5173`

---

### 🔄 Switching Between Networks

1. **In MetaMask**: Click network dropdown and select:
   - "Sepolia" for testnet
   - "Hardhat Local" for local network

2. **In the App**: Automatically detects your network and uses the correct contract address!

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with PowerShell script
./test-local.ps1

# Run specific test file
npx hardhat test test/GamePreferenceSurvey.ts

# Run integration tests (requires running local node)
npx hardhat test test/GamePreferenceSurveyLocal.ts --network anvil
```

## 🌐 Deployed Contracts

### Sepolia Testnet

- **Network**: Sepolia
- **Chain ID**: 11155111
- **Note**: Deploy contract using the provided scripts

## 📂 Project Structure

```
true-shield/
├── contracts/              # Smart contracts
│   └── GamePreferenceSurvey.sol
├── deploy/                 # Deployment scripts
│   └── 001_deploy_game_preference_survey.ts
├── test/                   # Test files
│   ├── GamePreferenceSurvey.ts
│   └── GamePreferenceSurveyLocal.ts
├── tasks/                  # Hardhat tasks
│   ├── accounts.ts
│   └── GamePreferenceSurvey.ts
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── config/        # Configuration files
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app
│   └── public/            # Static assets
├── types/                  # TypeChain generated types
├── hardhat.config.ts       # Hardhat configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## 📋 Smart Contract Functions

### Admin Functions

- `closeSurvey(surveyId)`: Close an active survey
- `transferAdmin(newAdmin)`: Transfer admin rights

### User Functions

- `createSurvey(title, description, duration)`: Any connected wallet can create a new survey
- `submitResponse(surveyId, pvp, pve, economic, others, proofs...)`: Submit encrypted preferences
- `getSurvey(surveyId)`: Get survey details
- `hasResponded(surveyId, address)`: Check if address has responded

### View Functions

- `getEncryptedTotals(surveyId)`: Get encrypted vote totals
- `getSurveyCount()`: Get total number of surveys
- `getAdmin()`: Get current admin address

## 🎨 Frontend Features

- **Survey Dashboard**: View all active surveys
- **Vote Interface**: Submit encrypted preferences with intuitive UI
- **Results View**: Admin can view decrypted results
- **Wallet Integration**: RainbowKit wallet connection
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Live survey data updates

## 🔧 Configuration

### Environment Variables

The project uses environment variables for configuration:

#### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
# WalletConnect Project ID for RainbowKit (optional)
# Get your project ID from https://cloud.walletconnect.com/
# If not set, the app will work with MetaMask direct connection
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

#### Backend Environment Variables

The project uses Hardhat vars for sensitive data:

```bash
# Set private key
npx hardhat vars set PRIVATE_KEY

# Set Infura API key
npx hardhat vars set INFURA_API_KEY

# Set Etherscan API key
npx hardhat vars set ETHERSCAN_API_KEY
```

### Network Configuration

Networks are configured in `hardhat.config.ts`:
- **Localhost**: Chain ID 31337 (Hardhat node)
- **Sepolia**: Chain ID 11155111 (Testnet)

## 🔒 Security Features

- All votes encrypted client-side using FHE
- Contract validates survey status and prevents duplicate votes
- Only admin can decrypt aggregated results
- Homomorphic computation ensures privacy throughout process

## 📊 Test Results

All tests passing:
- ✅ Deployment tests
- ✅ Survey creation tests
- ✅ Voting mechanism tests
- ✅ Admin permission tests
- ✅ View function tests

## 🚀 Deployment Instructions

### Deploy to Sepolia

```bash
# Set environment variables
npx hardhat vars set PRIVATE_KEY your_private_key
npx hardhat vars set INFURA_API_KEY your_infura_key

# Deploy
npm run deploy:sepolia
```

### Deploy Frontend

```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel, Netlify, or other hosting
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Zama](https://www.zama.ai/) for FHEVM technology
- [Hardhat](https://hardhat.org/) for development tools
- [RainbowKit](https://www.rainbow.me/) for wallet integration
- [shadcn/ui](https://ui.shadcn.com/) for UI components

## 📞 Support

For questions or issues, please open an issue on GitHub.

## 🔗 Links

- **Live Demo**: Coming soon
- **Contract (Sepolia)**: Deploy and verify on Etherscan
- **Documentation**: See this README

---

**Built with ❤️ using FHEVM**

**TrueShield Team © 2025**
