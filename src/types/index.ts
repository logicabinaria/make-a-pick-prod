/**
 * Make A Pick - Type Definitions
 * Central type definitions for the entire application
 * Ensures type safety and consistency across all modules
 */

// =====================================================
// CORE APPLICATION TYPES
// =====================================================

/**
 * Represents a single option in the picker
 */
export interface PickerOption {
  id: string;
  value: string;
  weight?: number; // For future weighted selection feature
}

/**
 * Result of a pick operation
 */
export interface PickResult {
  selectedOption: PickerOption;
  allOptions: PickerOption[];
  timestamp: Date;
  sessionId: string;
}

/**
 * Picker state management
 */
export interface PickerState {
  options: PickerOption[];
  result: PickResult | null;
  isLoading: boolean;
  error: string | null;
}

// =====================================================
// STATISTICS & ANALYTICS TYPES
// =====================================================

/**
 * Usage statistics for tracking decisions
 */
export interface UsageStats {
  id: string;
  createdAt: Date;
  userIpHash: string;
  sessionId: string;
  optionsCount: number;
  pickedOptionHash?: string;
  userAgentHash?: string;
  languagePreference: string;
  responseTimeMs?: number;
}

/**
 * Daily aggregated statistics
 */
export interface DailyStats {
  date: string; // YYYY-MM-DD format
  totalDecisions: number;
  uniqueUsers: number;
  uniqueSessions: number;
  averageOptions: number;
  mostCommonOptionCount: number;
  averageResponseTimeMs: number;
  englishUsers: number;
  bengaliUsers: number;
  otherLanguageUsers: number;
}

/**
 * Rate limiting information
 */
export interface RateLimit {
  userIpHash: string;
  date: string;
  decisionCount: number;
  lastDecisionAt: Date;
  isLimited: boolean;
  remainingDecisions: number;
}

// =====================================================
// CONFIGURATION TYPES
// =====================================================

/**
 * Application configuration settings
 */
export interface AppConfig {
  rateLimitEnabled: boolean;
  maxDecisionsPerDay: number;
  maintenanceMode: boolean;
  statsDisplayEnabled: boolean;
  confettiAnimationEnabled: boolean;
  adDisplayEnabled: boolean;
  pwaInstallPromptEnabled: boolean;
}

/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  googleAdSenseId?: string;
  environment: 'development' | 'staging' | 'production';
  enableAnalytics: boolean;
}

// =====================================================
// UI/UX TYPES
// =====================================================

/**
 * Theme configuration
 */
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
  };
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  confettiEnabled: boolean;
  transitionDuration: number;
  easing: string;
}

/**
 * Responsive breakpoints
 */
export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

// =====================================================
// INTERNATIONALIZATION TYPES
// =====================================================

/**
 * Supported languages
 */
export type SupportedLanguage = 'en' | 'bn';

/**
 * Translation keys structure
 */
export interface TranslationKeys {
  appName: string;
  tagline: string;
  addOption: string;
  makeAPick: string;
  pickNow: string;
  enterOption: string;
  result: string;
  yourPick: string;
  tryAgain: string;
  newDecision: string;
  addMoreOptions: string;
  decisionsToday: string;
  languageSelector: {
    title: string;
    description: string;
    english: string;
    bangla: string;
    continue: string;
  };
  privacyNotice: {
    title: string;
    description: string;
    accept: string;
  };
  errors: {
    generic: string;
    noOptions: string;
    rateLimited: string;
    networkError: string;
    maintenanceMode: string;
  };
  pwa: {
    installPrompt: string;
    installButton: string;
    installSuccess: string;
  };
  ads: {
    fallbackMessage: string;
  };
}

// =====================================================
// API TYPES
// =====================================================

/**
 * API request for making a pick
 */
export interface PickRequest {
  options: string[];
  sessionId?: string;
  languagePreference?: SupportedLanguage;
}

/**
 * API response for pick operation
 */
export interface PickResponse {
  pick: string;
  sessionId: string;
  timestamp: string;
  rateLimitInfo?: {
    remaining: number;
    resetTime: string;
  };
}

/**
 * API response for statistics
 */
export interface StatsResponse {
  todayStats: {
    totalDecisions: number;
    message: string;
  };
  isRateLimited: boolean;
  config: Partial<AppConfig>;
}

/**
 * Generic API error response
 */
export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// =====================================================
// PWA TYPES
// =====================================================

/**
 * PWA BeforeInstallPromptEvent interface
 */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * PWA installation state
 */
export interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  installPromptEvent: BeforeInstallPromptEvent | null;
  showInstallPrompt: boolean;
}

/**
 * Service worker state
 */
export interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
}

// =====================================================
// UTILITY TYPES
// =====================================================

/**
 * Generic loading state
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Generic async operation result
 */
export type AsyncResult<T> = {
  data: T | null;
  error: string | null;
  isLoading: boolean;
};

/**
 * Event handler types
 */
export type EventHandler<T = void> = (data: T) => void;
export type AsyncEventHandler<T = void> = (data: T) => Promise<void>;

/**
 * Component props with children
 */
export interface WithChildren {
  children: React.ReactNode;
}

/**
 * Component props with className
 */
export interface WithClassName {
  className?: string;
}

/**
 * Component props with optional styling
 */
export interface WithStyling extends WithClassName {
  style?: React.CSSProperties;
}

// =====================================================
// FORM TYPES
// =====================================================

/**
 * Form validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Form field state
 */
export interface FieldState {
  value: string;
  error: string | null;
  touched: boolean;
}

// =====================================================
// STORAGE TYPES
// =====================================================

/**
 * Local storage keys
 */
export enum StorageKeys {
  LANGUAGE_PREFERENCE = 'language',
  PRIVACY_CONSENT = 'privacyConsent',
  SESSION_ID = 'sessionId',
  INSTALL_PROMPT_DISMISSED = 'installPromptDismissed',
  THEME_PREFERENCE = 'themePreference',
  LAST_VISIT = 'lastVisit'
}

/**
 * Cookie configuration
 */
export interface CookieConfig {
  expires: number; // days
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
}

// =====================================================
// ANALYTICS TYPES
// =====================================================

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  bundleSize: number;
}

// =====================================================
// TYPE GUARDS
// =====================================================

/**
 * Type guard for PickerOption
 */
export const isPickerOption = (obj: unknown): obj is PickerOption => {
  return obj !== null && typeof obj === 'object' && 
    'id' in obj && 'value' in obj &&
    typeof (obj as PickerOption).id === 'string' && 
    typeof (obj as PickerOption).value === 'string';
};

/**
 * Type guard for PickResult
 */
export const isPickResult = (obj: unknown): obj is PickResult => {
  return obj !== null && typeof obj === 'object' &&
    'selectedOption' in obj && 'allOptions' in obj && 
    'timestamp' in obj && 'sessionId' in obj &&
    isPickerOption((obj as PickResult).selectedOption) && 
    Array.isArray((obj as PickResult).allOptions) && 
    (obj as PickResult).allOptions.every(isPickerOption) &&
    (obj as PickResult).timestamp instanceof Date &&
    typeof (obj as PickResult).sessionId === 'string';
};

/**
 * Type guard for SupportedLanguage
 */
export const isSupportedLanguage = (lang: string): lang is SupportedLanguage => {
  return ['en', 'bn'].includes(lang);
};

// =====================================================
// DEFAULT VALUES
// =====================================================

/**
 * Default theme configuration
 */
export const DEFAULT_THEME: Theme = {
  name: 'default',
  colors: {
    primary: '#4CAF50',    // Green from documentation
    secondary: '#FF9800',  // Orange from documentation
    accent: '#2196F3',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336'
  }
};

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  confettiEnabled: true,
  transitionDuration: 300,
  easing: 'ease-in-out'
};

/**
 * Default breakpoints configuration
 */
export const DEFAULT_BREAKPOINTS: Breakpoints = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};