// Flexible Ad Configuration - Supports Ezoic and Google AdSense
// Switch between ad providers by changing the AD_PROVIDER constant

export type AdProvider = 'ezoic' | 'adsense' | 'monetag' | 'adsterra' | 'none';

// Read ad provider from environment variables
// Set NEXT_PUBLIC_AD_PROVIDER in .env.local to switch between providers
// Options: 'ezoic', 'adsense', 'monetag', 'adsterra', 'none'
const AD_PROVIDER_SETTING: AdProvider = (process.env.NEXT_PUBLIC_AD_PROVIDER as AdProvider) || 'none';
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
  
  // Ezoic ad placement IDs (configure these in your Ezoic dashboard or .env.local)
  placements: {
    banner: parseInt(process.env.NEXT_PUBLIC_EZOIC_PLACEMENT_BANNER || '101'),
    sidebar: parseInt(process.env.NEXT_PUBLIC_EZOIC_PLACEMENT_SIDEBAR || '102'),
    footer: parseInt(process.env.NEXT_PUBLIC_EZOIC_PLACEMENT_FOOTER || '103'),
    inContent: parseInt(process.env.NEXT_PUBLIC_EZOIC_PLACEMENT_CONTENT || '104')
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

// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  // Your Google AdSense Publisher ID (configure in .env.local)
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-XXXXXXXXXXXXXXXXX',
  
  // Ad Slot ID for small banner ad in footer (configure in .env.local)
  adSlots: {
    banner: process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT || '1234567890',
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
  // Monetag verification meta tag content (configure in .env.local)
  metaContent: process.env.NEXT_PUBLIC_MONETAG_META_CONTENT || '',
  
  // Monetag ad URL (configure in .env.local)
  adUrl: process.env.NEXT_PUBLIC_MONETAG_AD_URL || '',
  
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

// Adsterra Configuration
export const ADSTERRA_CONFIG = {
  // Adsterra ad configuration (configure in .env.local)
  key: process.env.NEXT_PUBLIC_ADSTERRA_KEY || '88fb5a09f71069802bf883c6dc2a331e',
  
  // Ad format and dimensions
  format: 'iframe',
  height: 60,
  width: 468,
  
  // Script URL template
  get scriptUrl() {
    return `//www.highperformanceformat.com/${this.key}/invoke.js`;
  },
  
  // Ad placement configurations
  placements: {
    banner: {
      id: 'adsterra-banner',
      type: 'banner'
    },
    sidebar: {
      id: 'adsterra-sidebar',
      type: 'sidebar'
    },
    footer: {
      id: 'adsterra-footer',
      type: 'footer'
    },
    inContent: {
      id: 'adsterra-content',
      type: 'in-content'
    }
  },
  
  // Check if Adsterra is the selected provider
  get isActive() {
    return (AD_PROVIDER as string) === 'adsterra';
  }
};

// Global window interface
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
    atOptions: {
      key: string;
      format: string;
      height: number;
      width: number;
      params: Record<string, unknown>;
    };
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
      // Create and load Monetag script
      const script = document.createElement('script');
      script.src = MONETAG_CONFIG.adUrl;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      
      // Add script to document head
      document.head.appendChild(script);
      
      console.log('Monetag script loaded:', MONETAG_CONFIG.adUrl);
    } catch (error) {
      console.error('Monetag initialization error:', error);
    }
  }
};

// Adsterra initialization helper
export const initializeAdsterra = (containerId?: string) => {
  if (typeof window !== 'undefined' && ADSTERRA_CONFIG.isActive) {
    try {
      // Set Adsterra options
      window.atOptions = {
        key: ADSTERRA_CONFIG.key,
        format: ADSTERRA_CONFIG.format,
        height: ADSTERRA_CONFIG.height,
        width: ADSTERRA_CONFIG.width,
        params: {}
      };
      
      // Find the target container
      const container = containerId ? document.getElementById(containerId) : null;
      
      if (container) {
        // Create and load Adsterra script directly in the container
        const script = document.createElement('script');
        script.src = ADSTERRA_CONFIG.scriptUrl;
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        
        // Add script to the specific container
        container.appendChild(script);
        
        console.log('Adsterra script loaded in container:', containerId, ADSTERRA_CONFIG.scriptUrl);
      } else {
        // Fallback: Add script to document head
        const script = document.createElement('script');
        script.src = ADSTERRA_CONFIG.scriptUrl;
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        
        document.head.appendChild(script);
        
        console.log('Adsterra script loaded in head:', ADSTERRA_CONFIG.scriptUrl);
      }
    } catch (error) {
      console.error('Adsterra initialization error:', error);
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
    isAdsterra: (AD_PROVIDER as string) === 'adsterra',
    isActive: (AD_PROVIDER as string) !== 'none',
    ezoicActive: EZOIC_CONFIG.isActive,
    adsenseActive: ADSENSE_CONFIG.isActive,
    monetagActive: MONETAG_CONFIG.isActive,
    adsterraActive: ADSTERRA_CONFIG.isActive
  };
};