// Simplified Error Components
import React, { Component, type ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-red-400 text-xl font-semibold mb-4">
              Something went wrong
            </h2>
            <p className="text-aero-gray-light mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-aero-blue hover:bg-aero-dark text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface NetworkStatusProps {
  isOnline: boolean;
  lastError: unknown;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({
  isOnline,
  lastError,
}) => {
  if (!isOnline) {
    return (
      <div className="bg-red-600 text-white text-center py-2">
        <p>You are offline. Some features may not work properly.</p>
      </div>
    );
  }

  if (lastError) {
    return (
      <div className="bg-yellow-600 text-white text-center py-2">
        <p>Network error detected. Retrying...</p>
      </div>
    );
  }

  return null;
};
