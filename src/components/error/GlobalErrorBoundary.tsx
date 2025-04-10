
import React, { Component, ErrorInfo } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { captureException } from '@/lib/monitoring/sentry';
import { logger } from '@/lib/monitoring/logger';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our monitoring service
    captureException(error);
    logger.error('Uncaught error in component', { 
      context: {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      }
    });
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 max-w-2xl mx-auto my-8">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              <p className="mt-2 text-sm">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <div className="mt-4">
                <Button onClick={this.handleRetry}>Try again</Button>
              </div>
            </AlertDescription>
          </Alert>

          {import.meta.env.DEV && this.state.error && (
            <div className="mt-6 p-4 bg-gray-100 rounded overflow-x-auto">
              <p className="font-mono text-xs whitespace-pre-wrap">
                {this.state.error.stack}
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
