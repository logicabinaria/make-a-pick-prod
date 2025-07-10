// Google AdSense Configuration
// Replace these values with your actual AdSense publisher ID and ad slot IDs

export const ADSENSE_CONFIG = {
  // Your Google AdSense Publisher ID (starts with ca-pub-)
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-6150853912343151',
  
  // Ad Slot ID for small banner ad in footer
  adSlots: {
    banner: process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT || '1234567890', // Replace with your actual Banner ad slot ID from AdSense
  },
  
  // AdSense script URL
  get scriptUrl() {
    return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.publisherId}`;
  },
  
  // Check if AdSense is properly configured
  get isConfigured() {
    return this.publisherId !== 'ca-pub-XXXXXXXXXXXXXXXXX' && 
           this.adSlots.banner !== '1234567890';
  }
};

// AdSense window interface
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// AdSense initialization helper
// Track if AdSense has been initialized to prevent duplicate calls
let adsenseInitialized = false;

export const initializeAdSense = () => {
  if (typeof window !== 'undefined' && ADSENSE_CONFIG.isConfigured && !adsenseInitialized) {
    try {
      // Ensure adsbygoogle array exists
      window.adsbygoogle = window.adsbygoogle || [];
      
      // Only push if there are unprocessed ads
      const unprocessedAds = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
      
      if (unprocessedAds.length > 0) {
        window.adsbygoogle.push({});
        adsenseInitialized = true;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('AdSense initialized for', unprocessedAds.length, 'ad units');
        }
      }
    } catch (error) {
      console.error('AdSense initialization error:', error);
    }
  }
};

// Function to reset initialization state (useful for ad refresh)
export const resetAdSenseInitialization = () => {
  adsenseInitialized = false;
};

// AdSense ad unit component props
export interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}