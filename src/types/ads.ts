// Ad-related TypeScript types for better type safety

export interface AdProvider {
  name: string;
  isActive: boolean;
  isConfigured: boolean;
}

export interface AdProviderInfo {
  provider: string;
  isActive: boolean;
  isEzoic: boolean;
  adsenseActive: boolean;
  monetagActive: boolean;
  adsterraActive: boolean;
}

export interface AdRefreshOptions {
  force?: boolean;
  delay?: number;
  clearCache?: boolean;
  retryCount?: number;
}

export interface AdRefreshConfig {
  minRefreshInterval: number;
  maxRetryAttempts: number;
  retryDelay: number;
  cacheTimeout: number;
  enableAnalytics: boolean;
}

export interface AdRefreshMetrics {
  totalRefreshes: number;
  successfulRefreshes: number;
  failedRefreshes: number;
  averageRefreshTime: number;
  lastRefreshTime: number;
}

export enum AdRefreshErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  SCRIPT_LOAD_ERROR = 'SCRIPT_LOAD_ERROR',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  CACHE_ERROR = 'CACHE_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

export class AdRefreshError extends Error {
  constructor(
    public type: AdRefreshErrorType,
    message: string,
    public provider?: string,
    public retryable: boolean = true
  ) {
    super(message);
    this.name = 'AdRefreshError';
  }
}

export interface AdRefreshResult {
  success: boolean;
  provider: string;
  duration: number;
  error?: AdRefreshError;
  retryCount?: number;
}