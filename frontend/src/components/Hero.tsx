import { Shield, Lock, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';

export const Hero = () => {
  const scrollToSurveys = () => {
    const surveysSection = document.getElementById('surveys');
    surveysSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center py-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-600/10 to-background" />
      
      {/* Animated circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Powered by FHEVM</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Encrypted Game Preference Survey
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Vote for your favorite game mechanisms with complete privacy. 
          Your preferences stay encrypted using Fully Homomorphic Encryption.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" onClick={scrollToSurveys} className="text-lg">
            View Surveys
          </Button>
          <Button size="lg" variant="outline" asChild className="text-lg">
            <a href="#how-it-works">Learn More</a>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
            <Lock className="w-10 h-10 text-primary mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Fully Private</h3>
            <p className="text-sm text-muted-foreground">
              Your votes are encrypted end-to-end using FHE technology
            </p>
          </div>
          
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
            <Shield className="w-10 h-10 text-primary mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Secure Aggregation</h3>
            <p className="text-sm text-muted-foreground">
              Results computed without revealing individual votes
            </p>
          </div>
          
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
            <TrendingUp className="w-10 h-10 text-primary mb-4 mx-auto" />
            <h3 className="font-semibold mb-2">Real Results</h3>
            <p className="text-sm text-muted-foreground">
              Get accurate insights while preserving player privacy
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
