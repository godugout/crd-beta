
import React from 'react';
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';

interface ErrorAlertProps {
  error: string;
  onRetry: () => void;
  isLoading: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry, isLoading }) => {
  const isConnectionError = error.includes('fetch') || 
                           error.includes('network') || 
                           error.includes('connect') || 
                           error.includes('timeout');

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        <div className="mb-3">
          {error}
          
          {isConnectionError && (
            <div className="mt-2 text-sm opacity-90">
              This appears to be a connection issue. Please check your internet connection 
              and make sure the Supabase service is available.
            </div>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={onRetry} variant="outline" className="mr-2" disabled={isLoading}>
            {isLoading ? (
              <LoadingState size="sm" className="mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Try Again
          </Button>
          
          {isConnectionError && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs"
              onClick={() => window.open('https://status.supabase.com', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Check Supabase Status
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
