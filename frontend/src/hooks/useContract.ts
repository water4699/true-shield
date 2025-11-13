import { useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, GAME_PREFERENCE_SURVEY_ABI } from '../config/contracts';

export function useGamePreferenceSurvey() {
  const { chain } = useAccount();
  const chainId = chain?.id || 31337;

  const contractAddress = useMemo(() => {
    const address = CONTRACTS[chainId as keyof typeof CONTRACTS]?.GamePreferenceSurvey;
    return address as `0x${string}`;
  }, [chainId]);

  return {
    address: contractAddress,
    abi: GAME_PREFERENCE_SURVEY_ABI,
  };
}

export function useGetSurveyCount() {
  const contract = useGamePreferenceSurvey();
  
  return useReadContract({
    ...contract,
    functionName: 'getSurveyCount',
    query: {
      refetchInterval: false, // ✅ Disable auto-polling to prevent 429 errors
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  });
}

export function useGetSurvey(surveyId: number | undefined) {
  const contract = useGamePreferenceSurvey();
  
  return useReadContract({
    ...contract,
    functionName: 'getSurvey',
    args: surveyId !== undefined ? [BigInt(surveyId)] : undefined,
    query: {
      enabled: surveyId !== undefined,
      refetchInterval: false, // ✅ Disable auto-polling
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  });
}

export function useHasResponded(surveyId: number | undefined, address: string | undefined) {
  const contract = useGamePreferenceSurvey();
  
  return useReadContract({
    ...contract,
    functionName: 'hasResponded',
    args: surveyId !== undefined && address ? [BigInt(surveyId), address as `0x${string}`] : undefined,
    query: {
      enabled: surveyId !== undefined && !!address,
      refetchInterval: false, // ✅ Disable auto-polling
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  });
}

export function useGetAdmin() {
  const contract = useGamePreferenceSurvey();
  
  return useReadContract({
    ...contract,
    functionName: 'getAdmin',
    query: {
      refetchInterval: false, // ✅ Disable auto-polling
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  });
}

export function useCreateSurvey() {
  const contract = useGamePreferenceSurvey();
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createSurvey = (title: string, description: string, durationInSeconds: number) => {
    return writeContractAsync({
      ...contract,
      functionName: 'createSurvey',
      args: [title, description, BigInt(durationInSeconds)],
      gas: BigInt(1_000_000),
    });
  };

  return {
    createSurvey,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useCloseSurvey() {
  const contract = useGamePreferenceSurvey();
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const closeSurvey = (surveyId: number) => {
    return writeContractAsync({
      ...contract,
      functionName: 'closeSurvey',
      args: [BigInt(surveyId)],
      gas: BigInt(500_000),
    });
  };

  return {
    closeSurvey,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
}

