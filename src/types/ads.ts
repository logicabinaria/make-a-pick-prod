// Ad-related TypeScript types for better type safety

// Ad provider types
export type AdProviderType = 'ezoic' | 'adsense' | 'monetag' | 'adsterra';

// Base ad configuration interface
export interface BaseAdConfig {
  isActive: boolean;
  scriptUrl?: string;
}

// Ezoic specific configuration
export interface EzoicConfig {
  publisherId?: string;
  isActive: boolean;
  privacyScripts?: string[];
  headerScripts?: string[];
  headerScript?: string;
  placements?: Record<string, number>;
  options?: {
    limitCookies?: boolean;
    anchorAdPosition?: string;
    [key: string]: unknown;
  };
}

// AdSense specific configuration
export interface AdSenseConfig extends BaseAdConfig {
  publisherId: string;
  isConfigured?: boolean;
  adSlots?: {
    banner?: string;
    [key: string]: string | undefined;
  };
}

// Monetag specific configuration
export interface MonetagConfig extends BaseAdConfig {
  publisherId?: string;
  metaContent?: string;
  adUrl?: string;
  placements?: Record<string, { id: string; type: string }>;
}

// Adsterra specific configuration
export interface AdsterraConfig extends BaseAdConfig {
  publisherId?: string;
  placements?: Record<string, { id: string; type: string }>;
  height?: number;
  width?: number;
  key?: string;
  format?: string;
}

export interface AdProvider {
  name: string;
  isActive: boolean;
  isConfigured: boolean;
}

export interface AdProviderInfo {
  name: AdProviderType;
  provider: string;
  isActive: boolean;
  ezoicActive: boolean;
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

// Window interface extensions for ad scripts
declare global {
  interface Window {
    ezstandalone?: {
      cmd?: Array<() => void>;
      define?: (slots: unknown[]) => void;
      display?: (slotId: string) => void;
      refresh?: () => void;
      showAds?: (...placementIds: number[]) => void;
      config?: (options: Record<string, unknown>) => void;
      setEzoicAnchorAd?: (enabled: boolean) => void;
      hasAnchorAdBeenClosed?: () => boolean;
      isEzoicUser?: (percentage: number) => boolean;
    };
    adsbygoogle?: unknown[];
    monetag?: {
      cmd?: {
        push: (fn: () => void) => void;
      };
    };
    adsterra?: {
      cmd?: {
        push: (fn: () => void) => void;
      };
    };
    atOptions?: {
       key?: string;
       format?: string;
       height?: number;
       width?: number;
       params?: Record<string, unknown>;
     };
  }
}

export {};