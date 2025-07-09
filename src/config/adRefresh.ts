// Ad Refresh Configuration
// Centralized settings for ad refresh behavior

import { AdRefreshConfig } from '@/types/ads';

// Environment-specific configurations
const developmentConfig: AdRefreshConfig = {
  minRefreshInterval: 2000, // 2 seconds for faster testing
  maxRetryAttempts: 2,
  retryDelay: 1000,
  cacheTimeout: 30000, // 30 seconds
  enableAnalytics: true
};

const productionConfig: AdRefreshConfig = {
  minRefreshInterval: 5000, // 5 seconds minimum between refreshes
  maxRetryAttempts: 3,
  retryDelay: 2000,
  cacheTimeout: 300000, // 5 minutes
  enableAnalytics: true
};

// Get configuration based on environment
export const getAdRefreshConfig = (): AdRefreshConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? developmentConfig : productionConfig;
};

// Ad refresh event delays
export const AD_REFRESH_DELAYS = {
  ON_VISIBILITY_CHANGE: 1000,
  ON_FOCUS: 500,
  ON_PAGE_SHOW: 1000,
  MANUAL_REFRESH: 0,
  COMPONENT_MOUNT: 100
} as const;

// Ad provider timeouts
export const AD_PROVIDER_TIMEOUTS = {
  EZOIC: 10000,
  ADSENSE: 8000,
  MONETAG: 6000,
  ADSTERRA: 6000
} as const;

// Cache-related settings
export const CACHE_SETTINGS = {
  AD_CACHE_NAME: 'ad-cache-v1',
  MAX_CACHE_AGE: 24 * 60 * 60 * 1000, // 24 hours
  CLEANUP_INTERVAL: 60 * 60 * 1000 // 1 hour
} as const;

// Analytics settings
export const ANALYTICS_SETTINGS = {
  BATCH_SIZE: 10,
  FLUSH_INTERVAL: 30000, // 30 seconds
  MAX_EVENTS: 100
} as const;