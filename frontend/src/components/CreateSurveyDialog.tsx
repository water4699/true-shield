import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useCreateSurvey } from '../hooks/useContract';
import { toast } from 'sonner';

interface CreateSurveyDialogProps {
  onSurveyCreated?: () => void;
}

export const CreateSurveyDialog = ({ onSurveyCreated }: CreateSurveyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('7'); // Default 7 days
  
  const { createSurvey, isPending, isSuccess } = useCreateSurvey();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !duration) {
      toast.error('Please fill in all fields');
      return;
    }

    const durationInSeconds = parseInt(duration) * 24 * 60 * 60; // Convert days to seconds
    
    createSurvey(title, description, durationInSeconds)
      .then(() => {
        toast.success('Survey creation submitted! Please wait for confirmation...');
      })
      .catch((error) => {
        toast.error('Failed to create survey');
        console.error(error);
      });
  };

  // Reset form and close dialog on success
  if (isSuccess && open) {
    setOpen(false);
    setTitle('');
    setDescription('');
    setDuration('7');
    toast.success('Survey created successfully!');
    onSurveyCreated?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Survey
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Survey</DialogTitle>
          <DialogDescription>
            Create a new game preference survey. Players can vote anonymously for their favorite mechanisms.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Survey Title</Label>
            <Input
              id="title"
              placeholder="e.g., Q1 2025 Game Mechanisms Survey"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what players should vote for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="365"
              placeholder="7"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              How long should the survey remain open?
            </p>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Survey'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
