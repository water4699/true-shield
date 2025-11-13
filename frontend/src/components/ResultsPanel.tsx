import { useState } from 'react';
import { Button } from './ui/button';
import { Eye, Lock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface DecryptedResults {
  pvp: number;
  pve: number;
  economic: number;
  others: number;
}

interface ResultsPanelProps {
  surveyId: number;
  decryptVoteTotals: (surveyId: number) => Promise<DecryptedResults>;
  closeSurvey: (surveyId: number) => Promise<void>;
  isAdmin: boolean;
}

export function ResultsPanel({
  surveyId,
  decryptVoteTotals,
  closeSurvey,
  isAdmin,
}: ResultsPanelProps) {
  const [decryptedResults, setDecryptedResults] = useState<DecryptedResults | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDecrypt = async () => {
    setIsDecrypting(true);
    try {
      const results = await decryptVoteTotals(surveyId);
      setDecryptedResults(results);
    } catch (error) {
      console.error('Failed to decrypt:', error);
      alert('Failed to decrypt results. Please make sure you have granted decryption permission.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleClose = async () => {
    if (!isAdmin) {
      alert('Only admin can close surveys');
      return;
    }

    setIsClosing(true);
    try {
      await closeSurvey(surveyId);
    } catch (error) {
      console.error('Failed to close survey:', error);
      alert('Failed to close survey');
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
    { name: 'Player vs Player (PVP)', value: decryptedResults?.pvp || 0, color: 'bg-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20', textColor: 'text-purple-300' },
    { name: 'Player vs Environment (PVE)', value: decryptedResults?.pve || 0, color: 'bg-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20', textColor: 'text-blue-300' },
    { name: 'Economic System', value: decryptedResults?.economic || 0, color: 'bg-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20', textColor: 'text-green-300' },
    { name: 'Other / Mixed', value: decryptedResults?.others || 0, color: 'bg-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20', textColor: 'text-orange-300' },
  ];

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Survey Results</CardTitle>
      </CardHeader>
      <CardContent>
        {decryptedResults ? (
          <div className="space-y-4">
            {mechanisms.map((mechanism) => (
              <div key={mechanism.name} className={`p-4 ${mechanism.bgColor} border ${mechanism.borderColor} rounded-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`${mechanism.textColor} font-medium`}>{mechanism.name}</span>
                  <span className={`text-2xl font-bold ${mechanism.textColor}`}>
                    {mechanism.value}
                  </span>
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
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-6">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-slate-300 mb-6">
              Results are encrypted. Anyone can decrypt them.
            </p>
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

        {isAdmin && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <Button
              onClick={handleClose}
              disabled={isClosing}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}

