'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  ADSENSE_CONFIG, 
  EZOIC_CONFIG,
  MONETAG_CONFIG,
  ADSTERRA_CONFIG,
  getAdProviderInfo, 
  initializeAdSense, 
  initializeEzoic,
  initializeMonetag,
  initializeAdsterra 
} from '@/config/ads';
import AdErrorBoundary from './AdErrorBoundary';
import { refreshAds } from '@/utils/adRefresh';
import { AD_REFRESH_DELAYS } from '@/config/adRefresh';

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
  const finalPlacementId = ezoicPlacementId || EZOIC_CONFIG.placements?.[placementType];
  const [adLoaded, setAdLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adInfo = getAdProviderInfo();
  
  // Initialize ads and handle refresh
  const initializeAds = useCallback(async () => {
    setAdLoaded(false);
    
    // Clear any existing ad content
    if (adContainerRef.current) {
      const adElements = adContainerRef.current.querySelectorAll('ins, iframe, script');
      adElements.forEach(el => el.remove());
    }
    
    // Initialize based on active provider
    if (adInfo.ezoicActive) {
      initializeEzoic();
      
      // Show Ezoic ads using the proper API
      if (typeof window !== 'undefined' && window.ezstandalone) {
        const ezstandalone = window.ezstandalone;
        ezstandalone.cmd = ezstandalone.cmd || [];
        ezstandalone.cmd.push(function() {
          if (ezstandalone.showAds && finalPlacementId) {
            ezstandalone.showAds(Number(finalPlacementId));
          }
        });
      }
    } else if (adInfo.adsenseActive) {
      // Only initialize if there are unprocessed AdSense ads
      const unprocessedAds = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
      if (unprocessedAds.length > 0) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          initializeAdSense();
        }, 100);
      }
    } else if (adInfo.monetagActive) {
      initializeMonetag();
    } else if (adInfo.adsterraActive) {
      const containerId = ADSTERRA_CONFIG.placements?.[placementType]?.id;
      if (containerId) {
        initializeAdsterra(containerId);
      }
    }
    
    setAdLoaded(true);
  }, [adInfo.ezoicActive, adInfo.adsenseActive, adInfo.monetagActive, adInfo.adsterraActive, finalPlacementId, placementType]);
  
  // Force ad refresh function for external calls
  const refreshAdBanner = useCallback(async () => {
    setRefreshKey(prev => prev + 1);
    
    try {
      // Use the global refresh utility with force flag to bypass rate limiting
      const result = await refreshAds({ 
        force: true,
        delay: AD_REFRESH_DELAYS.COMPONENT_MOUNT, 
        clearCache: false 
      });
      
      if (!result.success) {
        console.warn('Ad refresh failed in banner component:', result.error?.message);
      }
    } catch (error) {
      console.error('Ad banner refresh error:', error);
    }
  }, []);
  
  // Initialize ads on mount and handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // App became visible, refresh ads after a short delay
        setTimeout(refreshAdBanner, 1000);
      }
    };
    
    const handleFocus = () => {
      // App gained focus, refresh ads
      setTimeout(refreshAdBanner, 500);
    };
    
    // Listen for visibility and focus changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    // Initial ad initialization on mount
    initializeAds();
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [initializeAds, refreshAdBanner]);

  // Re-initialize ads when refreshKey changes (for forced refreshes)
  useEffect(() => {
    if (refreshKey > 0) {
      const timer = setTimeout(() => {
        initializeAds();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [refreshKey, initializeAds]);

  // Don't render anything if no ad provider is active
  if (!adInfo.isActive) {
    return null;
  }

  return (
    <AdErrorBoundary>
      <div ref={adContainerRef} key={refreshKey} className={`w-full max-w-md mx-auto mt-6 ${className}`}>
        {/* Only show "Advertisement" label when ads are actually active */}
        {(adInfo.ezoicActive || adInfo.adsenseActive || adInfo.monetagActive || adInfo.adsterraActive) && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
            Advertisement
          </div>
        )}
      
      {/* Ezoic Ad */}
      {adInfo.ezoicActive && (
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
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={ADSENSE_CONFIG.publisherId}
            data-ad-slot={ADSENSE_CONFIG.adSlots?.banner}
            data-ad-format="fluid"
            data-ad-layout-key="-ef+6k-30-ac+ty"
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
      
      {/* Monetag Ad */}
      {adInfo.monetagActive && (
        <>
          <div 
            id={MONETAG_CONFIG.placements?.[placementType]?.id}
            className="min-h-[90px] w-full flex items-center justify-center"
            style={{ minHeight: '90px' }}
          >
            {/* Monetag ads will be automatically injected here by their script */}
            {!adLoaded && (
              <div className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center animate-pulse">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Loading Monetag ad...
                </p>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Adsterra Ad */}
      {adInfo.adsterraActive && (
        <div 
          id={ADSTERRA_CONFIG.placements?.[placementType]?.id}
          className="w-full flex items-center justify-center"
          style={{ 
            minHeight: `${ADSTERRA_CONFIG.height}px`, 
            width: `${ADSTERRA_CONFIG.width}px`, 
            maxWidth: '100%', 
            margin: '0 auto',
            backgroundColor: 'transparent'
          }}
        >
          {/* Adsterra ads will be automatically injected here by their script */}
        </div>
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
      
      {/* Debug info in development - only show when ads are active */}
      {process.env.NODE_ENV === 'development' && (adInfo.ezoicActive || adInfo.adsenseActive || adInfo.monetagActive || adInfo.adsterraActive) && (
        <div className="mt-2 p-2 rounded text-xs bg-blue-50 dark:bg-blue-900/20">
          <strong>Ad Debug:</strong> Provider: {adInfo.provider} | 
          Ezoic: {adInfo.ezoicActive ? '✅' : '❌'} | 
          AdSense: {adInfo.adsenseActive ? '✅' : '❌'} | 
          Monetag: {adInfo.monetagActive ? '✅' : '❌'} |
          Adsterra: {adInfo.adsterraActive ? '✅' : '❌'} |
          {adInfo.ezoicActive && ` Placement: ${finalPlacementId} (${placementType})`}
          {adInfo.monetagActive && ` Placement: ${MONETAG_CONFIG.placements?.[placementType]?.id} (${placementType})`}
          {adInfo.adsterraActive && ` Placement: ${ADSTERRA_CONFIG.placements?.[placementType]?.id} (${placementType}) | Key: ${ADSTERRA_CONFIG.key}`}
        </div>
      )}
      </div>
    </AdErrorBoundary>
  );
}