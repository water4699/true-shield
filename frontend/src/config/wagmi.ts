import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';

// Define localhost chain with correct chainId
const localhost = defineChain({
  id: 31337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
    public: { http: ['http://localhost:8545'] },
  },
});

const SEPOLIA_RPC_URL = 'https://1rpc.io/sepolia';
const MAINNET_RPC_URL = 'https://1rpc.io/eth';

// Mock chains configuration for FHEVM
export const initialMockChains = {
  31337: 'http://localhost:8545',
} as const;

// Configure chains for RainbowKit
export const config = getDefaultConfig({
  appName: 'TrueShield - Encrypted Game Survey',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // WalletConnect Project ID from env or fallback
  chains: [
    localhost,
    sepolia,
    ...(import.meta.env.DEV ? [mainnet] : []),
  ],
  transports: {
    [localhost.id]: http('http://localhost:8545'),
    [sepolia.id]: http(SEPOLIA_RPC_URL),
    [mainnet.id]: http(MAINNET_RPC_URL),
  },
  ssr: false,
});

