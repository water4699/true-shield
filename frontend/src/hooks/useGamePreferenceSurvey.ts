import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Contract, getBytes, hexlify } from 'ethers';
import { CONTRACTS, GAME_PREFERENCE_SURVEY_ABI } from '../config/contracts';
import { FhevmInstance } from '../fhevm/fhevmTypes';
import { GenericStringStorage } from '../fhevm/GenericStringStorage';
import { useWagmiEthers } from './useWagmiEthers';
import { FhevmDecryptionSignature } from '../fhevm/FhevmDecryptionSignature';

export interface Survey {
  title: string;
  description: string;
  deadline: bigint;
  active: boolean;
  totalResponses: bigint;
}

export function useGamePreferenceSurvey({
  instance,
  fhevmDecryptionSignatureStorage,
}: {
  instance: FhevmInstance | undefined;
  fhevmDecryptionSignatureStorage?: GenericStringStorage;
}) {
  const { address, chain } = useAccount();
  const chainId = chain?.id || 31337;
  const { ethersSigner } = useWagmiEthers();

  const contractAddress = useMemo(() => {
    const addr = CONTRACTS[chainId as keyof typeof CONTRACTS]?.GamePreferenceSurvey;
    return addr as `0x${string}` | undefined;
  }, [chainId]);

  const [isDeployed, setIsDeployed] = useState<boolean | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState<string>('');

  // Create contract instance
  const contract = useMemo(() => {
    if (!contractAddress || !ethersSigner) return null;
    return new Contract(contractAddress, GAME_PREFERENCE_SURVEY_ABI, ethersSigner);
  }, [contractAddress, ethersSigner]);

  // Check if contract is deployed
  useEffect(() => {
    if (!contractAddress) {
      setIsDeployed(false);
      return;
    }
    setIsDeployed(true);
  }, [contractAddress]);

  // Get survey count
  const { data: surveyCountData } = useReadContract({
    address: contractAddress,
    abi: GAME_PREFERENCE_SURVEY_ABI,
    functionName: 'getSurveyCount',
  });

  const surveyCount = useMemo(() => {
    return surveyCountData ? Number(surveyCountData) : 0;
  }, [surveyCountData]);

  // Get admin address
  const { data: adminAddress } = useReadContract({
    address: contractAddress,
    abi: GAME_PREFERENCE_SURVEY_ABI,
    functionName: 'getAdmin',
  });

  // Check if current user is admin
  useEffect(() => {
    if (adminAddress && address) {
      setIsAdmin(adminAddress.toLowerCase() === address.toLowerCase());
    } else {
      setIsAdmin(false);
    }
  }, [adminAddress, address]);

  // Create survey
  const createSurvey = useCallback(
    async (title: string, description: string, durationInSeconds: number) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      try {
        setStatus('Creating survey...');
        const tx = await contract.createSurvey(title, description, durationInSeconds, {
          gasLimit: 1000000, // ✅ Explicit gas limit
        });
        setStatus('Waiting for confirmation...');
        await tx.wait();
        setStatus('Survey created successfully!');
        setTimeout(() => setStatus(''), 3000);
        return tx;
      } catch (error) {
        console.error('Error creating survey:', error);
        setStatus('Failed to create survey');
        setTimeout(() => setStatus(''), 3000);
        throw error;
      }
    },
    [contract]
  );

  // Submit response (with FHE encryption)
  const submitResponse = useCallback(
    async (surveyId: number, pvp: boolean, pve: boolean, economic: boolean, others: boolean) => {
      if (!contract || !instance || !contractAddress || !ethersSigner) {
        throw new Error('Contract, FHEVM instance, or signer not initialized');
      }

      try {
        setStatus('Encrypting your votes...');

        const playerAddress = await ethersSigner.getAddress();

        const encryptedInput = instance
          .createEncryptedInput(contractAddress as `0x${string}`, playerAddress as `0x${string}`)
          .add8(pvp ? 1 : 0)
          .add8(pve ? 1 : 0)
          .add8(economic ? 1 : 0)
          .add8(others ? 1 : 0);

        const encrypted = await encryptedInput.encrypt();
        const handles = encrypted.handles.map((handle, index) => {
          const hexValue = hexlify(handle);
          console.log('[FHE] handle', index, 'rawLength', handle.length, 'value', hexValue);
          return handle;
        });
        const proof = encrypted.inputProof;
        const proofHex = hexlify(proof);
        console.log('[FHE] proof length', proof.length, proofHex);

        setStatus('Submitting encrypted votes...');

        if (handles.length < 4) {
          throw new Error('Encryption failed to produce all vote handles');
        }

        const tx = await contract.submitResponse(
          surveyId,
          handles[0],
          handles[1],
          handles[2],
          handles[3],
          proof,
          proof,
          proof,
          proof,
          {
            gasLimit: 5000000, // ✅ Explicit gas limit
          }
        );

        setStatus('Waiting for confirmation...');
        await tx.wait();
        setStatus('Vote submitted successfully!');
        setTimeout(() => setStatus(''), 3000);
        return tx;
      } catch (error) {
        console.error('Error submitting response:', error);
        setStatus('Failed to submit vote');
        setTimeout(() => setStatus(''), 3000);
        throw error;
      }
    },
    [contract, instance, contractAddress, ethersSigner]
  );

  // Get survey details
  const getSurvey = useCallback(
    async (surveyId: number): Promise<Survey | null> => {
      if (!contract) return null;

      try {
        const result = await contract.getSurvey(surveyId);
        return {
          title: result[0],
          description: result[1],
          deadline: result[2],
          active: result[3],
          totalResponses: result[4],
        };
      } catch (error) {
        console.error('Error getting survey:', error);
        return null;
      }
    },
    [contract]
  );

  // Check if user has responded
  const hasResponded = useCallback(
    async (surveyId: number, userAddress: string): Promise<boolean> => {
      if (!contract) return false;

      try {
        return await contract.hasResponded(surveyId, userAddress);
      } catch (error) {
        console.error('Error checking response status:', error);
        return false;
      }
    },
    [contract]
  );

  // Close survey
  const closeSurvey = useCallback(
    async (surveyId: number) => {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      try {
        setStatus('Closing survey...');
        const tx = await contract.closeSurvey(surveyId, {
          gasLimit: 500000, // ✅ Explicit gas limit
        });
        setStatus('Waiting for confirmation...');
        await tx.wait();
        setStatus('Survey closed successfully!');
        setTimeout(() => setStatus(''), 3000);
        return tx;
      } catch (error) {
        console.error('Error closing survey:', error);
        setStatus('Failed to close survey');
        setTimeout(() => setStatus(''), 3000);
        throw error;
      }
    },
    [contract]
  );

  // Decrypt vote totals (anyone can call after requesting access)
  const decryptVoteTotals = useCallback(
    async (surveyId: number) => {
      if (!contract || !instance || !ethersSigner || !contractAddress || !fhevmDecryptionSignatureStorage) {
        throw new Error('Contract, FHEVM instance, or signer not initialized');
      }

      try {
        setStatus('Requesting decryption access...');
        
        // First, request decryption access for this survey
        const accessTx = await contract.requestDecryptionAccess(surveyId, {
          gasLimit: 500000, // ✅ Explicit gas limit
        });
        await accessTx.wait();

        setStatus('Fetching encrypted totals...');
        const result = await contract.getEncryptedTotals(surveyId);
        console.log('[Decrypt] raw handles from contract', result);
        console.log('[Decrypt] result type:', typeof result);
        console.log('[Decrypt] result length:', Array.isArray(result) ? result.length : 'not array');

        setStatus('Preparing decryption signature...');
        
        // Get or create decryption signature
        const signature = await FhevmDecryptionSignature.loadOrSign(
          instance,
          [contractAddress],
          ethersSigner,
          fhevmDecryptionSignatureStorage
        );

        if (!signature) {
          throw new Error('Unable to obtain FHEVM decryption signature');
        }

        setStatus('Decrypting results...');
        
        // Decrypt each total using userDecrypt
        const [pvpHandle, pveHandle, economicHandle, othersHandle] = result;
        console.log('[Decrypt] individual handles:', { pvpHandle, pveHandle, economicHandle, othersHandle });

        const normalizeHandle = (handle: unknown) => {
          console.log('[Decrypt] normalizing handle:', handle, 'type:', typeof handle);
          if (typeof handle === 'string') {
            const bytes = getBytes(handle as `0x${string}`);
            console.log('[Decrypt] converted string to bytes:', bytes);
            return bytes;
          }
          if (handle instanceof Uint8Array) {
            console.log('[Decrypt] handle is already Uint8Array:', handle);
            return handle;
          }
          if (typeof handle === 'bigint') {
            // Convert bigint to bytes - this is the actual FHE encrypted data
            const hexString = '0x' + handle.toString(16).padStart(64, '0'); // 32 bytes = 64 hex chars
            const bytes = getBytes(hexString as `0x${string}`);
            console.log('[Decrypt] converted bigint to bytes:', bytes, 'from hex:', hexString);
            return bytes;
          }
          if (handle && typeof handle === 'object') {
            if ('_hex' in (handle as { _hex?: string }) && typeof (handle as { _hex: string })._hex === 'string') {
              const bytes = getBytes((handle as { _hex: string })._hex as `0x${string}`);
              console.log('[Decrypt] converted _hex to bytes:', bytes);
              return bytes;
            }
            if ('toString' in handle && typeof (handle as { toString: () => string }).toString === 'function') {
              const hexString = (handle as { toString: () => string }).toString();
              if (hexString.startsWith('0x')) {
                const bytes = getBytes(hexString as `0x${string}`);
                console.log('[Decrypt] converted toString to bytes:', bytes);
                return bytes;
              }
            }
          }
          console.error('[Decrypt] Unsupported handle format:', handle);
          throw new Error(`Unsupported handle format received from contract: ${typeof handle}`);
        };

        const handlePairs = [
          { handle: normalizeHandle(pvpHandle), contractAddress: contractAddress as `0x${string}` },
          { handle: normalizeHandle(pveHandle), contractAddress: contractAddress as `0x${string}` },
          { handle: normalizeHandle(economicHandle), contractAddress: contractAddress as `0x${string}` },
          { handle: normalizeHandle(othersHandle), contractAddress: contractAddress as `0x${string}` },
        ];
        console.log('[Decrypt] constructed handlePairs:', handlePairs);

        const decryptResult = await instance.userDecrypt(
          handlePairs,
          signature.privateKey,
          signature.publicKey,
          signature.signature,
          signature.contractAddresses, // Use contract addresses array as in signature
          signature.userAddress,
          signature.startTimestamp,
          signature.durationDays
        );

        console.log('[Decrypt] decryptResult:', decryptResult);
        console.log('[Decrypt] decryptResult type:', typeof decryptResult);
        console.log('[Decrypt] decryptResult isArray:', Array.isArray(decryptResult));
        console.log('[Decrypt] decryptResult keys:', decryptResult ? Object.keys(decryptResult) : 'undefined');

        // decryptResult may be an object where keys correspond to handles
        // or it may be an array. Let's handle both cases.
        let pvp: number, pve: number, economic: number, others: number;

        if (Array.isArray(decryptResult)) {
          console.log('[Decrypt] treating as array');
          pvp = Number(BigInt(decryptResult[0]));
          pve = Number(BigInt(decryptResult[1]));
          economic = Number(BigInt(decryptResult[2]));
          others = Number(BigInt(decryptResult[3]));
        } else if (decryptResult && typeof decryptResult === 'object') {
          console.log('[Decrypt] treating as object');
          // The keys in decryptResult are already the hex representations
          const resultKeys = Object.keys(decryptResult);
          console.log('[Decrypt] available keys in decryptResult:', resultKeys);

          // Map the results directly by index since handlePairs order matches decryptResult keys order
          const values = resultKeys.map(key => decryptResult[key]);
          console.log('[Decrypt] extracted values:', values);

          pvp = Number(BigInt(values[0]));
          pve = Number(BigInt(values[1]));
          economic = Number(BigInt(values[2]));
          others = Number(BigInt(values[3]));
        } else {
          throw new Error(`Unexpected decryptResult format: ${typeof decryptResult}`);
        }

        setStatus('Decryption complete!');
        setTimeout(() => setStatus(''), 3000);

        return { pvp, pve, economic, others };
      } catch (error) {
        console.error('Error decrypting totals:', error);
        setStatus('Failed to decrypt results. Please make sure you have granted decryption permission.');
        setTimeout(() => setStatus(''), 3000);
        throw error;
      }
    },
    [contract, instance, ethersSigner, contractAddress, fhevmDecryptionSignatureStorage]
  );

  return {
    contract,
    contractAddress,
    isDeployed,
    isAdmin,
    status,
    surveyCount,
    createSurvey,
    submitResponse,
    getSurvey,
    hasResponded,
    closeSurvey,
    decryptVoteTotals,
  };
}

