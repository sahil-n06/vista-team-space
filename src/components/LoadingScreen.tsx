import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
        </div>
        <p className="text-muted-foreground animate-pulse">Loading Portal 360...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
