
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto my-8">
          <h2 className="text-xl font-bold text-red-800 mb-4">Something went wrong</h2>
          <div className="mb-4">
            <p className="text-red-700">{this.state.error?.message}</p>
          </div>
          <div className="bg-white p-4 rounded overflow-auto max-h-96 text-xs font-mono">
            <pre>{this.state.error?.stack}</pre>
            {this.state.errorInfo && (
              <pre className="mt-4 pt-4 border-t border-red-100">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            >
              Try Again
            </button>
            <a
              href="/"
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
