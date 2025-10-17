import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ message = "Loading...", fullScreen = false }: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative rounded-full bg-gradient-to-br from-primary to-accent p-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary-foreground" />
            </div>
          </div>
          <p className="text-lg font-medium text-foreground animate-pulse">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
};
