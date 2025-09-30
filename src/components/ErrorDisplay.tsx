import { AlertTriangle } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <p className="text-destructive font-medium mb-2">Something went wrong</p>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
