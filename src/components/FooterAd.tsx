'use client';

import { useEffect, useState } from 'react';
import { ADSENSE_CONFIG, initializeAdSense } from '@/config/adsense';

export default function FooterAd() {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Only initialize AdSense if properly configured
    if (ADSENSE_CONFIG.isConfigured) {
      const timer = setTimeout(() => {
        initializeAdSense();
        setAdLoaded(true);
      }, 1000); // Small delay to ensure DOM is ready

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
        Advertisement
      </div>
      
      {/* Show AdSense ad only if configured */}
      {ADSENSE_CONFIG.isConfigured ? (
        <>
          {/* Google AdSense Small Banner Ad */}
          <ins
            className="adsbygoogle block"
            style={{ display: 'block', minHeight: '90px', maxHeight: '120px' }}
            data-ad-client={ADSENSE_CONFIG.publisherId}
            data-ad-slot={ADSENSE_CONFIG.adSlots.banner}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          ></ins>
          
          {/* Loading placeholder for small banner */}
           {!adLoaded && (
             <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center animate-pulse">
               <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                 Loading small banner ad...
               </p>
             </div>
           )}
        </>
      ) : (
        /* Fallback content when AdSense is not configured */
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
          <div className="bg-gradient-to-r from-green-200 to-orange-200 dark:from-green-800 dark:to-orange-800 rounded p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              🎯 Love Make A Pick? Share it with friends!
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Help others make quick decisions too
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Configure AdSense in src/config/adsense.ts to show ads
          </p>
        </div>
      )}
    </div>
  );
}