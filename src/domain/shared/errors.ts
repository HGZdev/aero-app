// Comprehensive Error Types and Error Handling Utilities
import type { Result } from "./types";
import { Failure } from "./types";

// Base Error Types
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly severity: ErrorSeverity;
  abstract readonly category: ErrorCategory;
  abstract readonly retryable: boolean;

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = this.constructor.name;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      category: this.category,
      retryable: this.retryable,
      context: this.context,
      stack: this.stack,
      timestamp: new Date().toISOString(),
    };
  }
}

// Error Severity Levels
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Error Categories
export enum ErrorCategory {
  NETWORK = "network",
  VALIDATION = "validation",
  BUSINESS_LOGIC = "business_logic",
  INFRASTRUCTURE = "infrastructure",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  RATE_LIMIT = "rate_limit",
  CACHE = "cache",
  PARSING = "parsing",
  UNKNOWN = "unknown",
}

// Network Errors
export class NetworkError extends AppError {
  readonly code = "NETWORK_ERROR";
  readonly severity = ErrorSeverity.HIGH;
  readonly category = ErrorCategory.NETWORK;
  readonly retryable = true;

  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly url?: string,
    context?: Record<string, unknown>,
    originalError?: Error
  ) {
    super(message, context, originalError);
  }
}

export class TimeoutError extends AppError {
  readonly code = "TIMEOUT_ERROR";
  readonly severity = ErrorSeverity.MEDIUM;
  readonly category = ErrorCategory.NETWORK;
  readonly retryable = true;

  constructor(
    message: string = "Request timeout",
    public readonly timeoutMs?: number,
    context?: Record<string, unknown>,
    originalError?: Error
  ) {
    super(message, context, originalError);
  }
}

export class RateLimitError extends AppError {
  readonly code = "RATE_LIMIT_ERROR";
  readonly severity = ErrorSeverity.MEDIUM;
  readonly category = ErrorCategory.RATE_LIMIT;
  readonly retryable = true;

  constructor(
    message: string = "Rate limit exceeded",
    public readonly retryAfter?: number,
    context?: Record<string, unknown>,
    originalError?: Error
  ) {
    super(message, context, originalError);
  }
}

// Validation Errors
export class ValidationError extends AppError {
  readonly code = "VALIDATION_ERROR";
  readonly severity = ErrorSeverity.MEDIUM;
  readonly category = ErrorCategory.VALIDATION;
  readonly retryable = false;

  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: unknown,
    context?: Record<string, unknown>,
    originalError?: Error
  ) {
    super(message, context, originalError);
  }
}

// Business Logic Errors
export class BusinessLogicError extends AppError {
  readonly code = "BUSINESS_LOGIC_ERROR";
  readonly severity = ErrorSeverity.MEDIUM;
  readonly category = ErrorCategory.BUSINESS_LOGIC;
  readonly retryable = false;

  constructor(
    message: string,
    context?: Record<string, unknown>,
    originalError?: Error
  ) {
    super(message, context, originalError);
  }
}

export class NotFoundError extends AppError {
  readonly code = "NOT_FOUND_ERROR";
  readonly severity = ErrorSeverity.MEDIUM;
  readonly category = ErrorCategory.BUSINESS_LOGIC;
  readonly retryable = false;

  constructor(
    resource: string,
    identifier: string,
    context?: Record<string, unknown>,
    originalError?: Error
  ) {
    super(
      `${resource} with identifier '${identifier}' not found`,
      {
        resource,
        identifier,
        ...context,
      },
      originalError
    );
  }
}

// Infrastructure Errors
export class InfrastructureError extends AppError {
  readonly code = "INFRASTRUCTURE_ERROR";
  readonly severity = ErrorSeverity.HIGH;
  readonly category = ErrorCategory.INFRASTRUCTURE;
  readonly retryable = true;

  constructor(
    message: string,
    public readonly service?: string,
    context?: Record<string, unknown>,
    originalError?: Error
  ) {
    super(message, context, originalError);
  }
}

export class CacheError extends AppError {
  readonly code = "CACHE_ERROR";
  readonly category = ErrorCategory.CACHE;
  readonly severity = ErrorSeverity.LOW;
  readonly retryable = true;

  constructor(
    message: string,
    public readonly operation?: "get" | "set" | "delete" | "clear",
    context?: Record<string, unknown>,
    originalError?: Error
  ) {
    super(message, context, originalError);
  }
}

// Parsing Errors
export class ParsingError extends AppError {
  readonly code = "PARSING_ERROR";
  readonly severity = ErrorSeverity.MEDIUM;
  readonly category = ErrorCategory.PARSING;
  readonly retryable = false;

  constructor(
    message: string,
    public readonly data?: unknown,
    context?: Record<string, unknown>,
    originalError?: Error
  ) {
    super(message, context, originalError);
  }
}

// Unknown Error
export class UnknownError extends AppError {
  readonly code = "UNKNOWN_ERROR";
  readonly severity = ErrorSeverity.HIGH;
  readonly category = ErrorCategory.UNKNOWN;
  readonly retryable = true;

  constructor(
    message: string = "An unknown error occurred",
    context?: Record<string, unknown>,
    originalError?: Error
  ) {
    super(message, context, originalError);
  }
}

// Error Handler Utilities
export class ErrorHandler {
  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }

  static isRetryable(error: unknown): boolean {
    if (this.isAppError(error)) {
      return error.retryable;
    }
    return false;
  }

  static getSeverity(error: unknown): ErrorSeverity {
    if (this.isAppError(error)) {
      return error.severity;
    }
    return ErrorSeverity.MEDIUM;
  }

  static getCategory(error: unknown): ErrorCategory {
    if (this.isAppError(error)) {
      return error.category;
    }
    return ErrorCategory.UNKNOWN;
  }

  static wrapError(
    error: unknown,
    context?: Record<string, unknown>
  ): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    if (error instanceof Error) {
      // Try to classify common error types
      if (error.message.includes("fetch")) {
        return new NetworkError(
          "Network request failed",
          undefined,
          undefined,
          context,
          error
        );
      }

      if (error.message.includes("timeout")) {
        return new TimeoutError("Request timeout", undefined, context, error);
      }

      if (
        error.message.includes("rate limit") ||
        error.message.includes("429")
      ) {
        return new RateLimitError(
          "Rate limit exceeded",
          undefined,
          context,
          error
        );
      }

      return new UnknownError(error.message, context, error);
    }

    return new UnknownError("An unknown error occurred", context);
  }

  static createResult<T>(
    error: unknown,
    context?: Record<string, unknown>
  ): Result<T, AppError> {
    const wrappedError = this.wrapError(error, context);
    return new Failure(wrappedError);
  }
}

// Retry Configuration
export interface RetryConfig {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrors?: (error: unknown) => boolean;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  retryableErrors: (error: unknown) => ErrorHandler.isRetryable(error),
};

// Retry Utility
export class RetryUtil {
  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig = DEFAULT_RETRY_CONFIG
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Check if error is retryable
        if (!config.retryableErrors?.(error)) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === config.maxAttempts) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          config.baseDelayMs * Math.pow(config.backoffMultiplier, attempt - 1),
          config.maxDelayMs
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

// Error Logger Interface
export interface ErrorLogger {
  log(error: AppError): void;
  logError(error: unknown, context?: Record<string, unknown>): void;
}

// Console Error Logger Implementation
export class ConsoleErrorLogger implements ErrorLogger {
  log(error: AppError): void {
    const logLevel = this.getLogLevel(error.severity);
    const logMethod = console[logLevel] as typeof console.log;

    logMethod(`[${error.severity.toUpperCase()}] ${error.name}:`, {
      message: error.message,
      code: error.code,
      category: error.category,
      retryable: error.retryable,
      context: error.context,
      stack: error.stack,
    });
  }

  logError(error: unknown, context?: Record<string, unknown>): void {
    const wrappedError = ErrorHandler.wrapError(error, context);
    this.log(wrappedError);
  }

  private getLogLevel(severity: ErrorSeverity): keyof Console {
    switch (severity) {
      case ErrorSeverity.LOW:
        return "log";
      case ErrorSeverity.MEDIUM:
        return "warn";
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return "error";
      default:
        return "log";
    }
  }
}

// Global Error Logger Instance
export const errorLogger = new ConsoleErrorLogger();
