/**
 * Comprehensive error handling utilities for robust user experience
 * Provides graceful fallbacks and user-friendly error messages
 */

export interface ErrorContext {
  component: string;
  action: string;
  timestamp: number;
  userAgent?: string;
}

export interface AppError {
  message: string;
  code: string;
  severity: 'low' | 'medium' | 'high';
  context: ErrorContext;
  originalError?: Error;
}

class ErrorHandler {
  private errorLog: AppError[] = [];
  private maxLogSize = 20;

  /**
   * Handle and log errors with appropriate user feedback
   */
  handleError(
    error: Error | string,
    context: ErrorContext,
    severity: 'low' | 'medium' | 'high' = 'medium'
  ): AppError {
    const appError: AppError = {
      message: this.getUserFriendlyMessage(error, context),
      code: this.generateErrorCode(error, context),
      severity,
      context: {
        ...context,
        timestamp: Date.now(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
      },
      originalError: error instanceof Error ? error : undefined
    };

    this.logError(appError);
    return appError;
  }

  /**
   * Convert technical errors to user-friendly messages
   */
  private getUserFriendlyMessage(error: Error | string, context: ErrorContext): string {
    const errorMessage = error instanceof Error ? error.message : error;
    
    // Network-related errors
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
      return 'Connection issue detected. The app will work offline using your device.';
    }
    
    // API-related errors
    if (context.action === 'api_pick' || errorMessage.includes('api')) {
      return 'Server temporarily unavailable. Using local picking instead.';
    }
    
    // Storage-related errors
    if (errorMessage.includes('localStorage') || errorMessage.includes('storage')) {
      return 'Storage access limited. The app will still work normally.';
    }
    
    // Rate limiting
    if (errorMessage.includes('rate') || errorMessage.includes('limit')) {
      return 'Please wait a moment before making another pick.';
    }
    
    // Validation errors
    if (errorMessage.includes('options') || errorMessage.includes('validation')) {
      return 'Please add at least 2 options to make a pick.';
    }
    
    // Generic fallback
    return 'Something went wrong, but the app should still work. Please try again.';
  }

  /**
   * Generate error codes for tracking
   */
  private generateErrorCode(error: Error | string, context: ErrorContext): string {
    const errorType = error instanceof Error ? error.constructor.name : 'StringError';
    const timestamp = Date.now().toString().slice(-6);
    return `${context.component}_${context.action}_${errorType}_${timestamp}`.toUpperCase();
  }

  /**
   * Log error for debugging (in development) and monitoring
   */
  private logError(appError: AppError): void {
    // Add to internal log
    this.errorLog.push(appError);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 App Error [${appError.severity.toUpperCase()}]`);
      console.log('Code:', appError.code);
      console.log('Message:', appError.message);
      console.log('Context:', appError.context);
      if (appError.originalError) {
        console.log('Original Error:', appError.originalError);
      }
      console.groupEnd();
    }
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(): AppError[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrors(): void {
    this.errorLog = [];
  }

  /**
   * Check if there are critical errors that might affect functionality
   */
  hasCriticalErrors(): boolean {
    const recentCritical = this.errorLog
      .filter(error => error.severity === 'high')
      .filter(error => Date.now() - error.context.timestamp < 60000); // Last minute
    
    return recentCritical.length > 2;
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

/**
 * Wrapper for async operations with automatic error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: ErrorContext,
  fallback?: () => T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const appError = errorHandler.handleError(error as Error, context);
    
    if (fallback) {
      return fallback();
    }
    
    throw appError;
  }
}

/**
 * Wrapper for sync operations with automatic error handling
 */
export function withSyncErrorHandling<T>(
  operation: () => T,
  context: ErrorContext,
  fallback?: () => T
): T {
  try {
    return operation();
  } catch (error) {
    const appError = errorHandler.handleError(error as Error, context);
    
    if (fallback) {
      return fallback();
    }
    
    throw appError;
  }
}

/**
 * Safe localStorage operations with error handling
 */
export const safeStorage = {
  getItem(key: string, defaultValue: string = ''): string {
    return withSyncErrorHandling(
      () => {
        if (typeof window === 'undefined') return defaultValue;
        return localStorage.getItem(key) || defaultValue;
      },
      { component: 'Storage', action: 'get_item', timestamp: Date.now() },
      () => defaultValue
    );
  },

  setItem(key: string, value: string): boolean {
    return withSyncErrorHandling(
      () => {
        if (typeof window === 'undefined') return false;
        localStorage.setItem(key, value);
        return true;
      },
      { component: 'Storage', action: 'set_item', timestamp: Date.now() },
      () => false
    );
  },

  removeItem(key: string): boolean {
    return withSyncErrorHandling(
      () => {
        if (typeof window === 'undefined') return false;
        localStorage.removeItem(key);
        return true;
      },
      { component: 'Storage', action: 'remove_item', timestamp: Date.now() },
      () => false
    );
  }
};

/**
 * Network request wrapper with retry logic
 */
export async function safeNetworkRequest<T>(
  requestFn: () => Promise<T>,
  context: ErrorContext,
  maxRetries: number = 2
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof Error && error.message.includes('4')) {
        break;
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw errorHandler.handleError(lastError!, context, 'medium');
}