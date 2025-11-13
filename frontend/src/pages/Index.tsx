import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { SurveyCard } from '../components/SurveyCard';
import { CreateSurveyDialog } from '../components/CreateSurveyDialog';
import { VoteDialogWithFHEVM } from '../components/VoteDialogWithFHEVM';
import { ResultsDialog } from '../components/ResultsDialog';
import { Button } from '../components/ui/button';
import { useGetSurveyCount, useGetSurvey, useHasResponded, useGetAdmin } from '../hooks/useContract';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

const Index = () => {
  const { address, isConnected } = useAccount();
  const { data: surveyCount, isLoading: isLoadingSurveyCount, refetch: refetchSurveyCount } = useGetSurveyCount();
  const { data: adminAddress } = useGetAdmin();
  const [selectedSurvey, setSelectedSurvey] = useState<{ id: number; title: string } | null>(null);
  const [selectedResultsSurvey, setSelectedResultsSurvey] = useState<{ id: number; title: string } | null>(null);

  const isAdmin = address && adminAddress && address.toLowerCase() === adminAddress.toLowerCase();

  // Get array of survey IDs
  const surveyIds = surveyCount ? Array.from({ length: Number(surveyCount) }, (_, i) => i) : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <Hero />
        
        {/* Surveys Section */}
        <section id="surveys" className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Active Surveys</h2>
              <p className="text-muted-foreground">
                Vote on your favorite game mechanisms with complete privacy
              </p>
            </div>
            {isConnected && (
              <CreateSurveyDialog
                onSurveyCreated={() => {
                  // Refresh survey count so new surveys appear without reload
                  refetchSurveyCount?.();
                }}
              />
            )}
          </div>

          {!isConnected && (
            <Alert className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connect Your Wallet</AlertTitle>
              <AlertDescription>
                Please connect your wallet to view and participate in surveys.
              </AlertDescription>
            </Alert>
          )}

          {isConnected && isLoadingSurveyCount && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {isConnected && surveyCount === 0n && !isLoadingSurveyCount && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No surveys available yet.</p>
              <p className="text-sm text-muted-foreground">Be the first to create a survey!</p>
            </div>
          )}

          {isConnected && surveyIds.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {surveyIds.map((id) => (
                <SurveyItem
                  key={id}
                  surveyId={id}
                  userAddress={address}
                  onVote={(title) => setSelectedSurvey({ id, title })}
                  onViewResults={(title) => setSelectedResultsSurvey({ id, title })}
                />
              ))}
            </div>
          )}
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Connect Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your Web3 wallet using Rainbow Kit
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Select Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your favorite game mechanisms (PVP, PVE, etc.)
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Encrypted Vote</h3>
                <p className="text-sm text-muted-foreground">
                  Your vote is encrypted using FHE before submission
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-semibold mb-2">View Results</h3>
                <p className="text-sm text-muted-foreground">
                  See aggregated results while votes stay private
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">About TrueShield</h2>
            <p className="text-muted-foreground mb-6">
              TrueShield is a privacy-preserving survey platform built with Fully Homomorphic Encryption (FHE). 
              It enables game developers to collect player preferences without compromising individual privacy.
            </p>
            <p className="text-muted-foreground">
              Powered by Zama's FHEVM technology, TrueShield ensures that votes remain encrypted throughout 
              the entire process, with only aggregated results being decrypted by authorized administrators.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with ❤️ using FHEVM | © 2025 TrueShield</p>
        </div>
      </footer>

      {selectedSurvey && (
        <VoteDialogWithFHEVM
          open={!!selectedSurvey}
          onOpenChange={(open) => !open && setSelectedSurvey(null)}
          surveyId={selectedSurvey.id}
          title={selectedSurvey.title}
        />
      )}

      {selectedResultsSurvey && (
        <ResultsDialog
          open={!!selectedResultsSurvey}
          onOpenChange={(open) => !open && setSelectedResultsSurvey(null)}
          surveyId={selectedResultsSurvey.id}
          title={selectedResultsSurvey.title}
        />
      )}
    </div>
  );
};

// Helper component for individual survey items
const SurveyItem = ({ 
  surveyId, 
  userAddress, 
  onVote,
  onViewResults
}: { 
  surveyId: number; 
  userAddress: string | undefined;
  onVote: (title: string) => void;
  onViewResults: (title: string) => void;
}) => {
  const { data: survey, isLoading } = useGetSurvey(surveyId);
  const { data: hasResponded } = useHasResponded(surveyId, userAddress);

  if (isLoading) {
    return (
      <div className="border rounded-lg p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!survey) return null;

  const [title, description, deadline, active, totalResponses] = survey;

  return (
    <SurveyCard
      surveyId={surveyId}
      title={title}
      description={description}
      deadline={Number(deadline)}
      active={active}
      totalResponses={Number(totalResponses)}
      hasResponded={hasResponded || false}
      onVote={() => onVote(title)}
      onViewResults={() => onViewResults(title)}
    />
  );
};

export default Index;
