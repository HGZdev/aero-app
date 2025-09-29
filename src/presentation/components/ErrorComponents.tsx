// User-Friendly Error Components and Retry Mechanisms
import React, { useState } from "react";
import {
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  Shield,
  Bug,
} from "lucide-react";
import {
  ErrorHandler,
  type AppError,
  ErrorSeverity,
  ErrorCategory,
} from "../../domain/shared/errors";

// Error Display Props
interface ErrorDisplayProps {
  error: unknown;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
  className?: string;
}

// Main Error Display Component
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  showDetails = false,
  className = "",
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const wrappedError = ErrorHandler.wrapError(error);

  const getErrorIcon = (error: AppError) => {
    switch (error.category) {
      case ErrorCategory.NETWORK:
        return <WifiOff className="h-5 w-5" />;
      case ErrorCategory.RATE_LIMIT:
        return <Clock className="h-5 w-5" />;
      case ErrorCategory.VALIDATION:
        return <Shield className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getErrorColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.LOW:
        return "text-blue-600 bg-blue-50 border-blue-200";
      case ErrorSeverity.MEDIUM:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case ErrorSeverity.HIGH:
        return "text-orange-600 bg-orange-50 border-orange-200";
      case ErrorSeverity.CRITICAL:
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getUserFriendlyMessage = (error: AppError): string => {
    switch (error.code) {
      case "NETWORK_ERROR":
        return "Unable to connect to the server. Please check your internet connection.";

      case "TIMEOUT_ERROR":
        return "The request took too long to complete. Please try again.";

      case "RATE_LIMIT_ERROR":
        return "Too many requests. Please wait a moment before trying again.";

      case "VALIDATION_ERROR":
        return "There was an issue with the data provided. Please check your input.";

      case "NOT_FOUND_ERROR":
        return "The requested information could not be found.";

      case "CACHE_ERROR":
        return "There was an issue loading cached data. Fresh data will be fetched.";

      case "PARSING_ERROR":
        return "There was an issue processing the data. Please try refreshing.";

      case "INFRASTRUCTURE_ERROR":
        return "A service is temporarily unavailable. Please try again later.";

      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const getRetryMessage = (error: AppError): string => {
    if (!ErrorHandler.isRetryable(error)) {
      return "This error cannot be retried automatically.";
    }

    switch (error.code) {
      case "RATE_LIMIT_ERROR":
        return "Wait a moment before retrying to avoid rate limits.";
      case "NETWORK_ERROR":
        return "Check your internet connection and try again.";
      case "TIMEOUT_ERROR":
        return "The server might be slow. Try again in a moment.";
      default:
        return "Click retry to attempt the operation again.";
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 ${getErrorColor(
        wrappedError.severity
      )} ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">{getErrorIcon(wrappedError)}</div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium">
            {getUserFriendlyMessage(wrappedError)}
          </h3>

          {showDetails && (
            <p className="mt-1 text-sm opacity-75">
              {getRetryMessage(wrappedError)}
            </p>
          )}

          {showTechnicalDetails && (
            <div className="mt-3 p-3 bg-white bg-opacity-50 rounded border">
              <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                <Bug className="h-3 w-3" />
                Technical Details
              </h4>
              <div className="text-xs space-y-1">
                <div>
                  <strong>Error:</strong> {wrappedError.name}
                </div>
                <div>
                  <strong>Code:</strong> {wrappedError.code}
                </div>
                <div>
                  <strong>Severity:</strong> {wrappedError.severity}
                </div>
                <div>
                  <strong>Category:</strong> {wrappedError.category}
                </div>
                {wrappedError.context && (
                  <div>
                    <strong>Context:</strong>{" "}
                    {JSON.stringify(wrappedError.context, null, 2)}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            {onRetry && ErrorHandler.isRetryable(wrappedError) && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md bg-white bg-opacity-75 hover:bg-opacity-100 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            )}

            {showDetails && (
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md bg-white bg-opacity-75 hover:bg-opacity-100 transition-colors"
              >
                <Bug className="h-3 w-3" />
                {showTechnicalDetails ? "Hide" : "Show"} Details
              </button>
            )}

            {onDismiss && (
              <button
                onClick={onDismiss}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md bg-white bg-opacity-75 hover:bg-opacity-100 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Error Component
export const LoadingError: React.FC<{
  error: unknown;
  onRetry: () => void;
  isLoading?: boolean;
}> = ({ error, onRetry, isLoading = false }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to Load Data
      </h3>
      <ErrorDisplay
        error={error}
        onRetry={onRetry}
        showDetails={true}
        className="mb-4"
      />
      <button
        onClick={onRetry}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "Retrying..." : "Try Again"}
      </button>
    </div>
  );
};

// Network Status Component
export const NetworkStatus: React.FC<{
  isOnline: boolean;
  lastError?: unknown;
}> = ({ isOnline, lastError }) => {
  const [showError, setShowError] = useState(false);

  if (isOnline && !lastError) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {!isOnline ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg">
          <div className="flex items-center">
            <WifiOff className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm text-red-700">
              You're offline. Some features may not work.
            </span>
          </div>
        </div>
      ) : lastError ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wifi className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm text-yellow-700">
                Connection issues detected
              </span>
            </div>
            <button
              onClick={() => setShowError(!showError)}
              className="text-xs text-yellow-600 hover:text-yellow-800"
            >
              {showError ? "Hide" : "Details"}
            </button>
          </div>
          {showError && (
            <div className="mt-2">
              <ErrorDisplay
                error={lastError as Error}
                showDetails={true}
                className="text-xs"
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

// Error Toast Component
export const ErrorToast: React.FC<{
  error: unknown;
  onDismiss: () => void;
  autoHide?: boolean;
  duration?: number;
}> = ({ error, onDismiss, autoHide = true, duration = 5000 }) => {
  React.useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onDismiss]);

  const wrappedError = ErrorHandler.wrapError(error);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-red-700">{wrappedError.message}</p>
          </div>
          <button
            onClick={onDismiss}
            className="ml-2 text-red-400 hover:text-red-600 flex-shrink-0"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

// Retry Hook
export const useRetry = (maxRetries: number = 3) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = React.useCallback(
    async (operation: () => Promise<void>) => {
      if (retryCount >= maxRetries) {
        return;
      }

      setIsRetrying(true);
      try {
        await operation();
        setRetryCount(0); // Reset on success
      } catch (error) {
        setRetryCount((prev) => prev + 1);
        throw error;
      } finally {
        setIsRetrying(false);
      }
    },
    [retryCount, maxRetries]
  );

  const resetRetry = React.useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    retry,
    resetRetry,
    retryCount,
    isRetrying,
    canRetry: retryCount < maxRetries,
    remainingRetries: maxRetries - retryCount,
  };
};
