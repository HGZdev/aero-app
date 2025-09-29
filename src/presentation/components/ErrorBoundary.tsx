// React Error Boundaries for Comprehensive Error Handling
import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import {
  ErrorHandler,
  errorLogger,
  type AppError,
} from "../../domain/shared/errors";

// Error Boundary State Interface
interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
  errorId: string;
  retryCount: number;
}

// Error Boundary Props Interface
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: AppError, retry: () => void) => ReactNode;
  onError?: (error: AppError, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  showDetails?: boolean;
}

// Main Error Boundary Component
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private retryTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: "",
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: unknown): Partial<ErrorBoundaryState> {
    const wrappedError = ErrorHandler.wrapError(error, {
      component: "ErrorBoundary",
      timestamp: new Date().toISOString(),
    });

    return {
      hasError: true,
      error: wrappedError,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(_error: unknown, errorInfo: React.ErrorInfo) {
    const wrappedError = ErrorHandler.wrapError(_error, {
      component: "ErrorBoundary",
      errorInfo,
      timestamp: new Date().toISOString(),
    });

    // Log the error
    errorLogger.log(wrappedError);

    // Call custom error handler if provided
    this.props.onError?.(wrappedError, errorInfo);

    // Update state with wrapped error
    this.setState({
      error: wrappedError,
    });
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      return;
    }

    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorId: "",
      retryCount: prevState.retryCount + 1,
    }));
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    const { hasError, error: errorState, retryCount } = this.state;
    const {
      children,
      fallback,
      maxRetries = 3,
      showDetails = false,
    } = this.props;

    if (hasError && errorState) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(errorState, this.handleRetry);
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-300 text-center mb-6">
              {this.getUserFriendlyMessage(errorState)}
            </p>

            {showDetails && (
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Technical Details
                </h3>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>
                    <strong>Error:</strong> {errorState.name}
                  </div>
                  <div>
                    <strong>Code:</strong> {errorState.code}
                  </div>
                  <div>
                    <strong>Severity:</strong> {errorState.severity}
                  </div>
                  <div>
                    <strong>Category:</strong> {errorState.category}
                  </div>
                  {errorState.context && (
                    <div>
                      <strong>Context:</strong>{" "}
                      {JSON.stringify(errorState.context, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {retryCount < maxRetries && (
                <button
                  onClick={this.handleRetry}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again ({maxRetries - retryCount} attempts left)
                </button>
              )}

              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Home className="h-4 w-4" />
                Go to Home
              </button>

              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Error ID: {this.state.errorId}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }

  private getUserFriendlyMessage(error: AppError): string {
    switch (error.code) {
      case "NETWORK_ERROR":
        return "Unable to connect to the server. Please check your internet connection and try again.";

      case "TIMEOUT_ERROR":
        return "The request took too long to complete. Please try again.";

      case "RATE_LIMIT_ERROR":
        return "Too many requests. Please wait a moment before trying again.";

      case "VALIDATION_ERROR":
        return "There was an issue with the data provided. Please check your input and try again.";

      case "NOT_FOUND_ERROR":
        return "The requested information could not be found.";

      case "CACHE_ERROR":
        return "There was an issue loading cached data. The application will try to fetch fresh data.";

      case "PARSING_ERROR":
        return "There was an issue processing the data. Please try refreshing the page.";

      case "INFRASTRUCTURE_ERROR":
        return "A service is temporarily unavailable. Please try again later.";

      default:
        return "An unexpected error occurred. Please try again or contact support if the problem persists.";
    }
  }
}

// Specialized Error Boundaries for Different Use Cases

// API Error Boundary - for API-related errors
export class ApiErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  render() {
    const { children, ...props } = this.props;

    return (
      <ErrorBoundary
        {...props}
        fallback={(_error, retry) => (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-red-800">API Error</h3>
            </div>
            <p className="text-red-700 mb-4">
              {_error.code === "RATE_LIMIT_ERROR"
                ? "Too many requests. Please wait a moment."
                : "Failed to load data from the server."}
            </p>
            <button
              onClick={retry}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}
      >
        {children}
      </ErrorBoundary>
    );
  }
}

// Chart Error Boundary - for chart/visualization errors
export class ChartErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  render() {
    const { children, ...props } = this.props;

    return (
      <ErrorBoundary
        {...props}
        fallback={(_error, retry) => (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">Chart Error</span>
            </div>
            <p className="text-yellow-700 text-sm mb-3">
              Unable to display the chart. This might be due to data formatting
              issues.
            </p>
            <button
              onClick={retry}
              className="text-sm px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      >
        {children}
      </ErrorBoundary>
    );
  }
}

// Map Error Boundary - for map/geolocation errors
export class MapErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  render() {
    const { children, ...props } = this.props;

    return (
      <ErrorBoundary
        {...props}
        fallback={(_error, retry) => (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">Map Error</span>
            </div>
            <p className="text-blue-700 text-sm mb-3">
              Unable to load the map. Please check your location permissions or
              try again.
            </p>
            <button
              onClick={retry}
              className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      >
        {children}
      </ErrorBoundary>
    );
  }
}

// Hook for Error Boundary State
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<AppError | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: unknown) => {
    const wrappedError = ErrorHandler.wrapError(error);
    setError(wrappedError);
    errorLogger.log(wrappedError);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

// Higher-Order Component for Error Boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};
