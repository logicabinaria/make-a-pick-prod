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
  const finalPlacementId = ezoicPlacementId || EZOIC_CONFIG.placements[placementType];
  const [adLoaded, setAdLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adInfo = getAdProviderInfo();
  
  // Force ad refresh function
  const refreshAdBanner = useCallback(async () => {
    setAdLoaded(false);
    setRefreshKey(prev => prev + 1);
    
    // Clear any existing ad content
    if (adContainerRef.current) {
      const adElements = adContainerRef.current.querySelectorAll('ins, iframe, script');
      adElements.forEach(el => el.remove());
    }
    
    try {
      // Use the global refresh utility with component mount delay
      const result = await refreshAds({ 
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
  
  // Refresh ads when component mounts or when app becomes visible
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
    
    // Initial refresh on mount
    refreshAdBanner();
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshAdBanner]);

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
      // Initialize AdSense with refresh support
      const timer = setTimeout(() => {
        // Clear any existing AdSense ads first
        const existingAds = document.querySelectorAll('.adsbygoogle');
        existingAds.forEach(ad => {
          if (ad.getAttribute('data-adsbygoogle-status')) {
            ad.removeAttribute('data-adsbygoogle-status');
          }
        });
        
        initializeAdSense();
        setAdLoaded(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (adInfo.monetagActive) {
      // Initialize Monetag
      const timer = setTimeout(() => {
        initializeMonetag();
        setAdLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    } else if (adInfo.adsterraActive) {
      // Initialize Adsterra
      const timer = setTimeout(() => {
        const containerId = ADSTERRA_CONFIG.placements[placementType].id;
        initializeAdsterra(containerId);
        setAdLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [adInfo.isEzoic, adInfo.adsenseActive, adInfo.monetagActive, adInfo.adsterraActive, finalPlacementId, placementType, refreshKey]);

  // Don't render anything if no ad provider is active
  if (!adInfo.isActive) {
    return null;
  }

  return (
    <div ref={adContainerRef} key={refreshKey} className={`w-full max-w-md mx-auto mt-6 ${className}`}>
      {/* Only show "Advertisement" label when ads are actually active */}
      {(adInfo.ezoicActive || adInfo.adsenseActive || adInfo.monetagActive || adInfo.adsterraActive) && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
          Advertisement
        </div>
      )}
      
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
      
      {/* Monetag Ad */}
      {adInfo.monetagActive && (
        <>
          <div 
            id={MONETAG_CONFIG.placements[placementType].id}
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
          id={ADSTERRA_CONFIG.placements[placementType].id}
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
          {adInfo.isEzoic && ` Placement: ${finalPlacementId} (${placementType})`}
          {adInfo.isMonetag && ` Placement: ${MONETAG_CONFIG.placements[placementType].id} (${placementType})`}
          {adInfo.isAdsterra && ` Placement: ${ADSTERRA_CONFIG.placements[placementType].id} (${placementType}) | Key: ${ADSTERRA_CONFIG.key}`}
        </div>
      )}
    </div>
  );
}