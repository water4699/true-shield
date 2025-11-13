import { useState } from 'react';
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
import { toast } from 'sonner';
import { Gamepad2, Swords, Coins, MoreHorizontal } from 'lucide-react';

interface VoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surveyId: number;
  title: string;
  onSubmit: (preferences: { pvp: boolean; pve: boolean; economic: boolean; others: boolean }) => Promise<void>;
}

export const VoteDialog = ({ open, onOpenChange, surveyId, title, onSubmit }: VoteDialogProps) => {
  const [preferences, setPreferences] = useState({
    pvp: false,
    pve: false,
    economic: false,
    others: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if at least one preference is selected
    if (!Object.values(preferences).some(v => v)) {
      toast.error('Please select at least one preference');
      return;
    }

    setSubmitting(true);
    
    try {
      await onSubmit(preferences);
      
      toast.success('Your vote has been submitted successfully! 🎉');
      onOpenChange(false);
      
      // Reset form
      setPreferences({
        pvp: false,
        pve: false,
        economic: false,
        others: false,
      });
    } catch (error) {
      toast.error('Failed to submit vote. Please try again.');
      console.error(error);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Vote on Survey</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>
        
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
                    <p className="text-xs text-muted-foreground">
                      {mechanism.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-xs font-medium">🔒 Privacy Guarantee</p>
            <p className="text-xs text-muted-foreground">
              Your vote will be encrypted using Fully Homomorphic Encryption (FHE). 
              Only the aggregated results will be visible, not individual votes.
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Encrypting & Submitting...' : 'Submit Vote'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

