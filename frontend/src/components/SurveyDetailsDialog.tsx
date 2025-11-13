import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Users, Calendar, Eye, Download } from "lucide-react";

interface Survey {
  title: string;
  description: string;
  responses: number;
  status: "active" | "draft" | "closed";
  date: string;
  color: "blue" | "teal" | "amber";
}

interface SurveyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  survey: Survey | null;
}

const statusColors = {
  active: "bg-secondary text-secondary-foreground",
  draft: "bg-muted text-muted-foreground",
  closed: "bg-destructive/10 text-destructive",
};

export const SurveyDetailsDialog = ({
  open,
  onOpenChange,
  survey,
}: SurveyDetailsDialogProps) => {
  if (!survey) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-accent" />
            <Badge variant="secondary" className={statusColors[survey.status]}>
              {survey.status}
            </Badge>
          </div>
          <DialogTitle className="text-2xl">{survey.title}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {survey.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Responses</p>
                <p className="text-xl font-semibold text-foreground">
                  {survey.responses}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-lg font-semibold text-foreground">
                  {survey.date}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Encryption Status
            </h4>
            <p className="text-sm text-muted-foreground">
              All responses are individually encrypted with zero-knowledge
              architecture. Only authorized participants can decrypt their own
              submissions.
            </p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 gap-2">
              <Eye className="w-4 h-4" />
              View Responses
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
