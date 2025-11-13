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
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, AlertCircle, Gamepad2, Swords, Coins, MoreHorizontal } from 'lucide-react';
import { useFhevm } from '../fhevm/useFhevm';
import { useWagmiEthers } from '../hooks/useWagmiEthers';
import { useInMemoryStorage } from '../hooks/useInMemoryStorage';
import { useGamePreferenceSurvey } from '../hooks/useGamePreferenceSurvey';
import { initialMockChains } from '../config/wagmi';

interface VoteDialogWithFHEVMProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surveyId: number;
  title: string;
}

export const VoteDialogWithFHEVM = ({ open, onOpenChange, surveyId, title }: VoteDialogWithFHEVMProps) => {
  const { chain } = useAccount();
  const chainId = chain?.id || 31337;
  const { ethersProvider } = useWagmiEthers();
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();

  const [preferences, setPreferences] = useState({
    pvp: false,
    pve: false,
    economic: false,
    others: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    refresh: refreshFhevm,
  } = useFhevm({
    provider: fhevmProvider,
    chainId: chainId,
    enabled: !!fhevmProvider && !!chainId,
    initialMockChains,
  });

  const {
    submitResponse,
    status,
  } = useGamePreferenceSurvey({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
  });

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setPreferences({
        pvp: false,
        pve: false,
        economic: false,
        others: false,
      });
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if at least one preference is selected
    if (!Object.values(preferences).some((v) => v)) {
      setError('Please select at least one preference');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitResponse(surveyId, preferences.pvp, preferences.pve, preferences.economic, preferences.others);
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to submit vote:', err);
      setError('Failed to submit vote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const mechanisms = [
    {
      id: 'pvp',
      label: 'Player vs Player (PVP)',
      description: 'Competitive gameplay against other players',
      icon: Swords,
    },
    {
      id: 'pve',
      label: 'Player vs Environment (PVE)',
      description: 'Cooperative or solo gameplay against AI',
      icon: Gamepad2,
    },
    {
      id: 'economic',
      label: 'Economic System',
      description: 'Trading, crafting, and market mechanics',
      icon: Coins,
    },
    {
      id: 'others',
      label: 'Other Mechanisms',
      description: 'Other game mechanics you enjoy',
      icon: MoreHorizontal,
    },
  ];

  if (fhevmStatus !== 'ready') {
    const isRetry = fhevmStatus === 'error';
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px]">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg">
              {isRetry ? 'Reconnecting secure encryption...' : 'Initializing secure encryption...'}
            </p>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {isRetry
                ? 'We could not reach the FHEVM relayer yet. Please wait a moment and try again.'
                : 'Setting up the FHE environment required for encrypted voting.'}
            </p>
            {isRetry && (
              <Button className="mt-6" onClick={refreshFhevm}>
                Retry
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Vote on Survey</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>

        {status && (
          <Alert className="bg-primary/10 border-primary/20">
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select your favorite game mechanisms. Your choices will be encrypted and remain private.
            </p>

            {mechanisms.map((mechanism) => {
              const Icon = mechanism.icon;
              return (
                <div
                  key={mechanism.id}
                  className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <Checkbox
                    id={mechanism.id}
                    checked={preferences[mechanism.id as keyof typeof preferences]}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({
                        ...prev,
                        [mechanism.id]: checked === true,
                      }))
                    }
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <Label
                        htmlFor={mechanism.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {mechanism.label}
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">{mechanism.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-xs font-medium">🔒 Privacy Guarantee</p>
            <p className="text-xs text-muted-foreground">
              Your vote will be encrypted using Fully Homomorphic Encryption (FHE). Only the aggregated
              results will be visible, not individual votes.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || fhevmStatus !== 'ready'}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Encrypting & Submitting...
                </>
              ) : (
                'Submit Vote'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

