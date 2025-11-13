import { Clock, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';

interface SurveyCardProps {
  surveyId: number;
  title: string;
  description: string;
  deadline: number;
  active: boolean;
  totalResponses: number;
  hasResponded: boolean;
  onVote: () => void;
  onViewResults: () => void;
}

export const SurveyCard = ({
  surveyId,
  title,
  description,
  deadline,
  active,
  totalResponses,
  hasResponded,
  onVote,
  onViewResults,
}: SurveyCardProps) => {
  const deadlineDate = new Date(deadline * 1000);
  const isExpired = deadlineDate < new Date();
  const timeRemaining = !isExpired ? formatDistanceToNow(deadlineDate, { addSuffix: true }) : 'Expired';

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant={active && !isExpired ? 'default' : 'secondary'}>
            {active && !isExpired ? 'Active' : 'Closed'}
          </Badge>
          {hasResponded && (
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Responded
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{timeRemaining}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{totalResponses} responses</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {active && !isExpired && !hasResponded && (
            <Button onClick={onVote} className="flex-1">
              Vote Now
            </Button>
          )}
          <Button onClick={onViewResults} variant="outline" className="flex-1">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
