import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Shield, CheckCircle } from "lucide-react";

export const EncryptionStatus = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-foreground">
              {progress < 100 ? "Encrypting Responses..." : "All Responses Secured"}
            </span>
          </div>
          
          {progress === 100 && (
            <CheckCircle className="w-5 h-5 text-secondary" />
          )}
        </div>
        
        <div className="relative">
          <Progress value={progress} className="h-2" />
          <div 
            className="absolute inset-0 rounded-full opacity-50"
            style={{
              background: 'linear-gradient(90deg, hsl(188, 65%, 55%), hsl(221, 83%, 35%), hsl(38, 92%, 50%))',
              width: `${progress}%`,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          End-to-end encryption ensures complete privacy and data integrity
        </p>
      </div>
    </footer>
  );
};
