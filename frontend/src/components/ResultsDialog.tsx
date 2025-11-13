import { useState, useMemo, useEffect } from 'react';
import { useAccount } from 'wagmi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Eye, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useFhevm } from '../fhevm/useFhevm';
import { useWagmiEthers } from '../hooks/useWagmiEthers';
import { useInMemoryStorage } from '../hooks/useInMemoryStorage';
import { useGamePreferenceSurvey } from '../hooks/useGamePreferenceSurvey';
import { initialMockChains } from '../config/wagmi';

interface ResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surveyId: number;
  title: string;
}

export const ResultsDialog = ({ open, onOpenChange, surveyId, title }: ResultsDialogProps) => {
  const { address, chain } = useAccount();
  const chainId = chain?.id || 31337;
  const { ethersProvider } = useWagmiEthers();
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();

  // FHEVM provider
  const fhevmProvider = useMemo(() => {
    if (chainId === 31337) {
      return 'http://127.0.0.1:8545';
    }

    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum;
    }

    if (ethersProvider) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const internalProvider = (ethersProvider as any)._getConnection?.()?.provider;
      if (internalProvider) {
        return internalProvider;
      }
    }

    return undefined;
  }, [chainId, ethersProvider]);

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider: fhevmProvider,
    chainId: chainId,
    enabled: !!fhevmProvider && !!chainId,
    initialMockChains,
  });

  const {
    decryptVoteTotals,
    closeSurvey,
    isAdmin,
    status,
  } = useGamePreferenceSurvey({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
  });

  const [decryptedResults, setDecryptedResults] = useState<{
    pvp: number;
    pve: number;
    economic: number;
    others: number;
  } | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setDecryptedResults(null);
      setError(null);
    }
  }, [open]);

  const handleDecrypt = async () => {
    setIsDecrypting(true);
    setError(null);
    try {
      const results = await decryptVoteTotals(surveyId);
      setDecryptedResults(results);
    } catch (err) {
      console.error('Failed to decrypt:', err);
      setError('Failed to decrypt results. Please make sure you have granted decryption permission.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleClose = async () => {
    if (!isAdmin) {
      setError('Only admin can close surveys');
      return;
    }

    setIsClosing(true);
    setError(null);
    try {
      await closeSurvey(surveyId);
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to close survey:', err);
      setError('Failed to close survey');
    } finally {
      setIsClosing(false);
    }
  };

  const totalVotes = decryptedResults
    ? decryptedResults.pvp + decryptedResults.pve + decryptedResults.economic + decryptedResults.others
    : 0;

  const getPercentage = (value: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((value / totalVotes) * 100);
  };

  const mechanisms = [
    {
      name: 'Player vs Player (PVP)',
      value: decryptedResults?.pvp || 0,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      textColor: 'text-purple-300',
    },
    {
      name: 'Player vs Environment (PVE)',
      value: decryptedResults?.pve || 0,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      textColor: 'text-blue-300',
    },
    {
      name: 'Economic System',
      value: decryptedResults?.economic || 0,
      color: 'bg-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-300',
    },
    {
      name: 'Other / Mixed',
      value: decryptedResults?.others || 0,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      textColor: 'text-orange-300',
    },
  ];

  if (fhevmStatus === 'loading') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-slate-900 text-white border-slate-700">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-purple-400 mb-4" />
            <p className="text-white text-lg">Initializing FHEVM...</p>
            <p className="text-slate-400 text-sm mt-2">Setting up encryption system...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (fhevmStatus === 'error') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-slate-900 text-white border-slate-700">
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-white">
              Failed to initialize FHEVM: {fhevmError?.message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-400">Survey Results</DialogTitle>
          <DialogDescription className="text-slate-400">
            Survey: <span className="font-semibold text-white">{title}</span>
          </DialogDescription>
        </DialogHeader>

        {status && (
          <Alert className="bg-purple-500/10 border-purple-500/20">
            <AlertDescription className="text-white">{status}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-white">{error}</AlertDescription>
          </Alert>
        )}

        {decryptedResults ? (
          <div className="space-y-4 mt-4">
            {mechanisms.map((mechanism) => (
              <div
                key={mechanism.name}
                className={`p-4 ${mechanism.bgColor} border ${mechanism.borderColor} rounded-lg`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`${mechanism.textColor} font-medium`}>{mechanism.name}</span>
                  <span className={`text-2xl font-bold ${mechanism.textColor}`}>{mechanism.value}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${mechanism.color}`}
                      style={{
                        width: `${getPercentage(mechanism.value)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-slate-400 w-12 text-right">
                    {getPercentage(mechanism.value)}%
                  </span>
                </div>
              </div>
            ))}

            <div className="text-center text-slate-300 pt-4 border-t border-slate-700">
              <p className="text-lg">
                Total Preferences Selected: <span className="font-bold text-white">{totalVotes}</span>
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Note: Players can select multiple preferences
              </p>
            </div>

            {isAdmin && (
              <Button
                onClick={handleClose}
                disabled={isClosing}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 mt-4"
              >
                {isClosing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Closing...
                  </>
                ) : (
                  'Close Survey'
                )}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-6">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-slate-300 mb-6">Results are encrypted. Anyone can decrypt them.</p>
            <Button
              onClick={handleDecrypt}
              disabled={isDecrypting}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isDecrypting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Decrypting...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Decrypt Results
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

