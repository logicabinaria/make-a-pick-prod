/**
 * Make A Pick - Configuration Management
 * Centralized configuration for environment variables and app settings
 * Provides type-safe access to all configuration values
 */

import { EnvironmentConfig, AppConfig, Theme, AnimationConfig, Breakpoints } from '@/types';

// =====================================================
// ENVIRONMENT CONFIGURATION
// =====================================================

/**
 * Get environment variable with fallback
 */
const getEnvVar = (key: string, fallback: string = ''): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use Next.js public env vars
    return process.env[`NEXT_PUBLIC_${key}`] || fallback;
  }
  // Server-side: use regular env vars
  return process.env[key] || process.env[`NEXT_PUBLIC_${key}`] || fallback;
};

/**
 * Get boolean environment variable
 */
const getBooleanEnvVar = (key: string, fallback: boolean = false): boolean => {
  const value = getEnvVar(key, fallback.toString());
  return value.toLowerCase() === 'true';
};

/**
 * Get number environment variable
 */
const getNumberEnvVar = (key: string, fallback: number = 0): number => {
  const value = getEnvVar(key, fallback.toString());
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Environment configuration
 */
export const environmentConfig: EnvironmentConfig = {
  googleAdSenseId: getEnvVar('GOOGLE_ADSENSE_ID'),
  environment: (getEnvVar('NODE_ENV', 'development') as 'development' | 'staging' | 'production'),
  enableAnalytics: getBooleanEnvVar('ENABLE_ANALYTICS', true)
};

// =====================================================
// APPLICATION CONFIGURATION
// =====================================================

/**
 * Default application configuration
 */
export const defaultAppConfig: AppConfig = {
  rateLimitEnabled: getBooleanEnvVar('RATE_LIMIT_ENABLED', false),
  maxDecisionsPerDay: getNumberEnvVar('MAX_DECISIONS_PER_DAY', 10),
  maintenanceMode: getBooleanEnvVar('MAINTENANCE_MODE', false),
  statsDisplayEnabled: getBooleanEnvVar('STATS_DISPLAY_ENABLED', true),
  confettiAnimationEnabled: getBooleanEnvVar('CONFETTI_ANIMATION_ENABLED', true),
  adDisplayEnabled: getBooleanEnvVar('AD_DISPLAY_ENABLED', false),
  pwaInstallPromptEnabled: getBooleanEnvVar('PWA_INSTALL_PROMPT_ENABLED', true)
};

// =====================================================
// THEME CONFIGURATION
// =====================================================

/**
 * Brand colors from documentation
 */
export const brandColors = {
  primary: '#4CAF50',    // Green
  secondary: '#FF9800',  // Orange
  accent: '#2196F3',     // Blue
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3'
} as const;

/**
 * Light theme configuration
 */
export const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    accent: brandColors.accent,
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#212121',
    textSecondary: '#757575',
    success: brandColors.success,
    warning: brandColors.warning,
    error: brandColors.error
  }
};

/**
 * Dark theme configuration
 */
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    accent: brandColors.accent,
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    success: brandColors.success,
    warning: brandColors.warning,
    error: brandColors.error
  }
};

/**
 * Available themes
 */
export const themes = {
  light: lightTheme,
  dark: darkTheme
} as const;

export type ThemeName = keyof typeof themes;

// =====================================================
// ANIMATION CONFIGURATION
// =====================================================

/**
 * Animation settings
 */
export const animationConfig: AnimationConfig = {
  confettiEnabled: defaultAppConfig.confettiAnimationEnabled,
  transitionDuration: 300,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)' // Material Design easing
};

/**
 * Confetti configuration
 */
export const confettiConfig = {
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: [brandColors.primary, brandColors.secondary, brandColors.accent],
  duration: 3000,
  gravity: 0.8,
  drift: 0,
  ticks: 200
} as const;

// =====================================================
// RESPONSIVE BREAKPOINTS
// =====================================================

/**
 * Responsive breakpoints (in pixels)
 */
export const breakpoints: Breakpoints = {
  mobile: 320,   // Minimum mobile width from documentation
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

/**
 * Media queries for responsive design
 */
export const mediaQueries = {
  mobile: `(min-width: ${breakpoints.mobile}px)`,
  tablet: `(min-width: ${breakpoints.tablet}px)`,
  desktop: `(min-width: ${breakpoints.desktop}px)`,
  wide: `(min-width: ${breakpoints.wide}px)`,
  
  // Max width queries
  maxMobile: `(max-width: ${breakpoints.tablet - 1}px)`,
  maxTablet: `(max-width: ${breakpoints.desktop - 1}px)`,
  maxDesktop: `(max-width: ${breakpoints.wide - 1}px)`,
  
  // Touch devices
  touch: '(hover: none) and (pointer: coarse)',
  hover: '(hover: hover) and (pointer: fine)',
  
  // Orientation
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  
  // Reduced motion
  reducedMotion: '(prefers-reduced-motion: reduce)'
} as const;

// =====================================================
// API CONFIGURATION
// =====================================================

/**
 * API endpoints
 */
export const apiEndpoints = {
  pick: '/api/pick',
  stats: '/api/stats',
  config: '/api/config',
  health: '/api/health'
} as const;

/**
 * API configuration
 */
export const apiConfig = {
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  headers: {
    'Content-Type': 'application/json'
  }
} as const;

// =====================================================
// PWA CONFIGURATION
// =====================================================

/**
 * PWA manifest configuration
 */
export const pwaConfig = {
  name: 'Make A Pick',
  shortName: 'Make A Pick',
  description: 'Decide in a Snap! Quick decision-making tool.',
  themeColor: brandColors.primary,
  backgroundColor: lightTheme.colors.background,
  display: 'standalone',
  orientation: 'portrait-primary',
  scope: '/',
  startUrl: '/',
  icons: [
    {
      src: '/icons/icon-72x72.png',
      sizes: '72x72',
      type: 'image/png'
    },
    {
      src: '/icons/icon-96x96.png',
      sizes: '96x96',
      type: 'image/png'
    },
    {
      src: '/icons/icon-128x128.png',
      sizes: '128x128',
      type: 'image/png'
    },
    {
      src: '/icons/icon-144x144.png',
      sizes: '144x144',
      type: 'image/png'
    },
    {
      src: '/icons/icon-152x152.png',
      sizes: '152x152',
      type: 'image/png'
    },
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png'
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ]
} as const;

// =====================================================
// ANALYTICS CONFIGURATION
// =====================================================

/**
 * Analytics events
 */
export const analyticsEvents = {
  DECISION_MADE: 'decision_made',
  OPTION_ADDED: 'option_added',
  OPTION_REMOVED: 'option_removed',
  LANGUAGE_CHANGED: 'language_changed',
  PWA_INSTALLED: 'pwa_installed',
  PWA_PROMPT_SHOWN: 'pwa_prompt_shown',
  AD_CLICKED: 'ad_clicked',
  ERROR_OCCURRED: 'error_occurred'
} as const;

// =====================================================
// VALIDATION CONFIGURATION
// =====================================================

/**
 * Validation rules
 */
export const validationRules = {
  option: {
    minLength: 1,
    maxLength: 100,
    pattern: /^[\s\S]*$/ // Allow any characters including emojis
  },
  options: {
    minCount: 2,
    maxCount: 50
  },
  session: {
    timeout: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  }
} as const;

// =====================================================
// PERFORMANCE CONFIGURATION
// =====================================================

/**
 * Performance thresholds
 */
export const performanceConfig = {
  // Core Web Vitals targets
  lcp: 2500,     // Largest Contentful Paint (ms)
  fid: 100,      // First Input Delay (ms)
  cls: 0.1,      // Cumulative Layout Shift
  
  // Custom metrics
  loadTimeout: 5000,    // Page load timeout (ms)
  apiTimeout: 10000,    // API request timeout (ms)
  renderTimeout: 1000,  // Component render timeout (ms)
  
  // Bundle size limits
  maxBundleSize: 500 * 1024, // 500KB
  maxChunkSize: 200 * 1024   // 200KB
} as const;

// =====================================================
// FEATURE FLAGS
// =====================================================

/**
 * Feature flags for gradual rollout
 */
export const featureFlags = {
  enableConfetti: getBooleanEnvVar('FEATURE_CONFETTI', true),
  enablePWA: getBooleanEnvVar('FEATURE_PWA', true),
  enableAds: getBooleanEnvVar('FEATURE_ADS', false),
  enableAnalytics: getBooleanEnvVar('FEATURE_ANALYTICS', true),
  enableRateLimit: getBooleanEnvVar('FEATURE_RATE_LIMIT', false),
  enableWeightedOptions: getBooleanEnvVar('FEATURE_WEIGHTED_OPTIONS', false),
  enableThemes: getBooleanEnvVar('FEATURE_THEMES', false),
  enableSharing: getBooleanEnvVar('FEATURE_SHARING', false)
} as const;

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Check if we're in development mode
 */
export const isDevelopment = (): boolean => {
  return environmentConfig.environment === 'development';
};

/**
 * Check if we're in production mode
 */
export const isProduction = (): boolean => {
  return environmentConfig.environment === 'production';
};

/**
 * Check if we're running on the client side
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Check if we're running on the server side
 */
export const isServer = (): boolean => {
  return typeof window === 'undefined';
};

/**
 * Get the current theme based on system preference
 */
export const getSystemTheme = (): ThemeName => {
  if (!isClient()) return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Check if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  if (!isClient()) return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get viewport size category
 */
export const getViewportCategory = (): 'mobile' | 'tablet' | 'desktop' | 'wide' => {
  if (!isClient()) return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < breakpoints.tablet) return 'mobile';
  if (width < breakpoints.desktop) return 'tablet';
  if (width < breakpoints.wide) return 'desktop';
  return 'wide';
};

/**
 * Check if device supports touch
 */
export const isTouchDevice = (): boolean => {
  if (!isClient()) return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Validate configuration on startup
 */
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate numeric values
  if (defaultAppConfig.maxDecisionsPerDay < 1) {
    errors.push('MAX_DECISIONS_PER_DAY must be greater than 0');
  }
  
  // Validate theme colors
  const colorRegex = /^#[0-9A-F]{6}$/i;
  Object.entries(brandColors).forEach(([key, color]) => {
    if (!colorRegex.test(color)) {
      errors.push(`Invalid color format for ${key}: ${color}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

const defaultConfig = {
  env: environmentConfig,
  app: defaultAppConfig,
  theme: lightTheme,
  animation: animationConfig,
  breakpoints,
  api: apiConfig,
  pwa: pwaConfig,
  features: featureFlags
};

export default defaultConfig;