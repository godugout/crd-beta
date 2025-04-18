
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';

interface ErrorAlertProps {
  error: string;
  onRetry: () => void;
  isLoading: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry, isLoading }) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error}
        <div className="mt-4">
          <Button onClick={onRetry} variant="outline" className="mr-2" disabled={isLoading}>
            {isLoading ? (
              <LoadingState size="sm" className="mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Try Again
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
