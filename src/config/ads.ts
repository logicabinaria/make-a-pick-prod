// Flexible Ad Configuration - Supports Ezoic and Google AdSense
// Switch between ad providers by changing the AD_PROVIDER constant

export type AdProvider = 'ezoic' | 'adsense' | 'monetag' | 'none';

// Change this to switch between ad providers
// Note: Change this value to switch between providers
const AD_PROVIDER_SETTING: AdProvider = 'monetag'; // Options: 'ezoic', 'adsense', 'monetag', 'none'
export const AD_PROVIDER = AD_PROVIDER_SETTING;

// Ezoic Configuration
export const EZOIC_CONFIG = {
  // Ezoic privacy scripts (required for GDPR compliance)
  privacyScripts: [
    'https://cmp.gatekeeperconsent.com/min.js',
    'https://the.gatekeeperconsent.com/cmp.min.js'
  ],
  
  // Main Ezoic header script
  headerScript: '//www.ezojs.com/ezoic/sa.min.js',
  
  // Ezoic ad placement IDs (configure these in your Ezoic dashboard)
  placements: {
    banner: 101,        // Main banner placement
    sidebar: 102,       // Sidebar placement
    footer: 103,        // Footer placement
    inContent: 104      // In-content placement
  },
  
  // Ezoic configuration options
  options: {
    limitCookies: true,           // Enable GDPR compliance
    anchorAdPosition: 'bottom'    // Anchor ad position: 'top' or 'bottom'
  },
  
  // Check if Ezoic is the selected provider
  get isActive() {
    return (AD_PROVIDER as string) === 'ezoic';
  }
};

// Google AdSense Configuration (keeping existing setup)
export const ADSENSE_CONFIG = {
  // Your Google AdSense Publisher ID (starts with ca-pub-)
  publisherId: 'ca-pub-6150853912343151',
  
  // Ad Slot ID for small banner ad in footer
  adSlots: {
    banner: '1234567890', // Replace with your actual Banner ad slot ID from AdSense
  },
  
  // AdSense script URL
  get scriptUrl() {
    return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.publisherId}`;
  },
  
  // Check if AdSense is properly configured and selected
  get isActive() {
    return (AD_PROVIDER as string) === 'adsense' && 
           this.publisherId !== 'ca-pub-XXXXXXXXXXXXXXXXX' && 
           this.adSlots.banner !== '1234567890';
  },
  
  // Legacy compatibility
  get isConfigured() {
    return this.publisherId !== 'ca-pub-XXXXXXXXXXXXXXXXX' && 
           this.adSlots.banner !== '1234567890';
  }
};

// Monetag Configuration
export const MONETAG_CONFIG = {
  // Monetag verification meta tag content
  metaContent: '4d9ab32e84c95f6a2550e62a49385baf',
  
  // Monetag ad placement configurations
  placements: {
    banner: {
      id: 'monetag-banner',
      type: 'banner'
    },
    sidebar: {
      id: 'monetag-sidebar', 
      type: 'sidebar'
    },
    footer: {
      id: 'monetag-footer',
      type: 'footer'
    },
    inContent: {
      id: 'monetag-content',
      type: 'in-content'
    }
  },
  
  // Check if Monetag is the selected provider
  get isActive() {
    return (AD_PROVIDER as string) === 'monetag';
  }
};

// Ezoic window interface
declare global {
  interface Window {
    ezstandalone: {
      cmd: Array<() => void>;
      config?: (options: Record<string, unknown>) => void;
      showAds?: (...placementIds: number[]) => void;
      setEzoicAnchorAd?: (enabled: boolean) => void;
      hasAnchorAdBeenClosed?: () => boolean;
      isEzoicUser?: (percentage: number) => boolean;
    };
    adsbygoogle: unknown[];
  }
}

// Ezoic initialization helper
export const initializeEzoic = () => {
  if (typeof window !== 'undefined' && EZOIC_CONFIG.isActive) {
    try {
      window.ezstandalone = window.ezstandalone || {};
      window.ezstandalone.cmd = window.ezstandalone.cmd || [];
      
      // Configure Ezoic options
      window.ezstandalone.cmd.push(function() {
        if (window.ezstandalone.config) {
          window.ezstandalone.config(EZOIC_CONFIG.options);
        }
      });
    } catch (error) {
      console.error('Ezoic initialization error:', error);
    }
  }
};

// AdSense initialization helper (keeping existing)
export const initializeAdSense = () => {
  if (typeof window !== 'undefined' && ADSENSE_CONFIG.isActive) {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense initialization error:', error);
    }
  }
};

// Monetag initialization helper
export const initializeMonetag = () => {
  if (typeof window !== 'undefined' && MONETAG_CONFIG.isActive) {
    try {
      // Monetag initialization logic will be added here
      // Currently just a placeholder for future implementation
      console.log('Monetag initialized');
    } catch (error) {
      console.error('Monetag initialization error:', error);
    }
  }
};

// Generic ad unit component props
export interface AdUnitProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
  ezoicId?: string; // For Ezoic ad placements
}

// Helper to get current ad provider info
export const getAdProviderInfo = () => {
  return {
    provider: AD_PROVIDER,
    isEzoic: (AD_PROVIDER as string) === 'ezoic',
    isAdSense: (AD_PROVIDER as string) === 'adsense',
    isMonetag: (AD_PROVIDER as string) === 'monetag',
    isActive: (AD_PROVIDER as string) !== 'none',
    ezoicActive: EZOIC_CONFIG.isActive,
    adsenseActive: ADSENSE_CONFIG.isActive,
    monetagActive: MONETAG_CONFIG.isActive
  };
};