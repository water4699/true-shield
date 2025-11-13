import { useMemo } from 'react';
import { useWalletClient } from 'wagmi';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

export function walletClientToSigner(walletClient: any) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

export function useWagmiEthers() {
  const { data: walletClient } = useWalletClient();

  const ethersProvider = useMemo(() => {
    if (!walletClient) return undefined;
    const { chain, transport } = walletClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    return new BrowserProvider(transport, network);
  }, [walletClient]);

  const ethersSigner = useMemo(() => {
    if (!walletClient) return undefined;
    return walletClientToSigner(walletClient);
  }, [walletClient]);

  return { ethersProvider, ethersSigner };
}

