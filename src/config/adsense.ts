// Google AdSense Configuration
// Replace these values with your actual AdSense publisher ID and ad slot IDs

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
  
  // Check if AdSense is properly configured
  get isConfigured() {
    return this.publisherId !== 'ca-pub-XXXXXXXXXXXXXXXXX' && 
           this.adSlots.banner !== '1234567890';
  }
};

// AdSense window interface
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

// AdSense initialization helper
export const initializeAdSense = () => {
  if (typeof window !== 'undefined') {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense initialization error:', error);
    }
  }
};

// AdSense ad unit component props
export interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}