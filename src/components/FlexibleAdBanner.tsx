'use client';

import { useEffect, useState } from 'react';
import { 
  ADSENSE_CONFIG, 
  EZOIC_CONFIG,
  getAdProviderInfo, 
  initializeAdSense, 
  initializeEzoic 
} from '@/config/ads';

interface FlexibleAdBannerProps {
  ezoicPlacementId?: number; // Ezoic ad placement ID (numeric)
  placementType?: 'banner' | 'sidebar' | 'footer' | 'inContent'; // Predefined placement types
  className?: string;
}

export default function FlexibleAdBanner({ 
  ezoicPlacementId, 
  placementType = 'banner',
  className = '' 
}: FlexibleAdBannerProps) {
  // Use provided placement ID or get from config based on type
  const finalPlacementId = ezoicPlacementId || EZOIC_CONFIG.placements[placementType];
  const [adLoaded, setAdLoaded] = useState(false);
  const adInfo = getAdProviderInfo();

  useEffect(() => {
    if (adInfo.isEzoic) {
      // Initialize Ezoic and show ads
      const timer = setTimeout(() => {
        initializeEzoic();
        
        // Show Ezoic ads using the proper API
        if (typeof window !== 'undefined' && window.ezstandalone) {
          const ezstandalone = window.ezstandalone;
          ezstandalone.cmd = ezstandalone.cmd || [];
          ezstandalone.cmd.push(function() {
            if (ezstandalone.showAds) {
              ezstandalone.showAds(finalPlacementId);
            }
          });
        }
        
        setAdLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    } else if (adInfo.adsenseActive) {
      // Initialize AdSense
      const timer = setTimeout(() => {
        initializeAdSense();
        setAdLoaded(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [adInfo.isEzoic, adInfo.adsenseActive, finalPlacementId]);

  return (
    <div className={`w-full max-w-md mx-auto mt-6 ${className}`}>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
        Advertisement
      </div>
      
      {/* Ezoic Ad */}
      {adInfo.isEzoic && (
        <>
          {/* Ezoic placeholder div - DO NOT add styling as per Ezoic docs */}
          <div id={`ezoic-pub-ad-placeholder-${finalPlacementId}`}>
            {!adLoaded && (
              <div className="min-h-[90px] max-h-[120px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg animate-pulse">
                <div className="text-center p-4">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Loading Ezoic ad...
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Google AdSense Ad */}
      {adInfo.adsenseActive && (
        <>
          <ins
            className="adsbygoogle block"
            style={{ display: 'block', minHeight: '90px', maxHeight: '120px' }}
            data-ad-client={ADSENSE_CONFIG.publisherId}
            data-ad-slot={ADSENSE_CONFIG.adSlots.banner}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          ></ins>
          
          {!adLoaded && (
            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Loading AdSense banner...
              </p>
            </div>
          )}
        </>
      )}
      
      {/* Placeholder when no ad provider is active */}
      {!adInfo.isActive && (
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Ad provider not configured. Current: {adInfo.provider}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Configure in src/config/ads.ts
          </p>
        </div>
      )}
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
          <strong>Ad Debug:</strong> Provider: {adInfo.provider} | 
          Ezoic: {adInfo.ezoicActive ? '✅' : '❌'} | 
          AdSense: {adInfo.adsenseActive ? '✅' : '❌'} |
          {adInfo.isEzoic && ` Placement: ${finalPlacementId} (${placementType})`}
        </div>
      )}
    </div>
  );
}