// Ad Refresh Utility for PWA and Web Applications
// Ensures ads refresh consistently across all environments

import { 
  getAdProviderInfo, 
  initializeAdSense, 
  initializeEzoic, 
  initializeMonetag, 
  initializeAdsterra,
  EZOIC_CONFIG
} from '@/config/ads';
import { 
  AdRefreshOptions, 
  AdRefreshResult, 
  AdRefreshError, 
  AdRefreshErrorType,
  AdProviderInfo 
} from '@/types/ads';
import { 
  getAdRefreshConfig, 
  AD_REFRESH_DELAYS, 
  AD_PROVIDER_TIMEOUTS 
} from '@/config/adRefresh';
import { recordAdRefresh } from '@/utils/adAnalytics';

// Global ad refresh manager
class AdRefreshManager {
  private refreshInProgress = false;
  private lastRefreshTime = 0;
  private readonly config = getAdRefreshConfig();

  /**
   * Force refresh all ads on the page with retry logic
   */
  async refreshAllAds(options: AdRefreshOptions = {}): Promise<AdRefreshResult> {
    const { 
      force = false, 
      delay = 0, 
      clearCache = true, 
      retryCount = 0 
    } = options;
    
    const startTime = Date.now();
    const adInfo = getAdProviderInfo();
    
    // Prevent too frequent refreshes unless forced
    const now = Date.now();
    if (!force && (now - this.lastRefreshTime) < this.config.minRefreshInterval) {
      const error = new AdRefreshError(
        AdRefreshErrorType.TIMEOUT_ERROR,
        'Ad refresh skipped - too frequent',
        adInfo.provider,
        false
      );
      const result: AdRefreshResult = {
        success: false,
        provider: adInfo.provider,
        duration: Date.now() - startTime,
        error,
        retryCount
      };
      recordAdRefresh(result);
      return result;
    }

    if (this.refreshInProgress && !force) {
      const error = new AdRefreshError(
        AdRefreshErrorType.PROVIDER_ERROR,
        'Ad refresh already in progress',
        adInfo.provider,
        true
      );
      const result: AdRefreshResult = {
        success: false,
        provider: adInfo.provider,
        duration: Date.now() - startTime,
        error,
        retryCount
      };
      recordAdRefresh(result);
      return result;
    }

    this.refreshInProgress = true;
    this.lastRefreshTime = now;

    try {
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      if (clearCache) {
        await this.clearAdCache();
      }

      // Refresh based on active provider with timeout
      await this.refreshProviderAds(adInfo);

      const result: AdRefreshResult = {
        success: true,
        provider: adInfo.provider,
        duration: Date.now() - startTime,
        retryCount
      };
      
      recordAdRefresh(result);
      console.log('Ad refresh completed for provider:', adInfo.provider);
      return result;
      
    } catch (error) {
      const adError = error instanceof AdRefreshError ? error : new AdRefreshError(
        AdRefreshErrorType.PROVIDER_ERROR,
        error instanceof Error ? error.message : 'Unknown error',
        adInfo.provider
      );
      
      const result: AdRefreshResult = {
        success: false,
        provider: adInfo.provider,
        duration: Date.now() - startTime,
        error: adError,
        retryCount
      };
      
      recordAdRefresh(result);
      
      // Retry logic
      if (adError.retryable && retryCount < this.config.maxRetryAttempts) {
        console.warn(`Ad refresh failed, retrying... (${retryCount + 1}/${this.config.maxRetryAttempts})`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.refreshAllAds({ ...options, retryCount: retryCount + 1 });
      }
      
      console.error('Ad refresh failed after all retries:', adError);
      return result;
    } finally {
      this.refreshInProgress = false;
    }
  }

  /**
   * Clear ad-related cache from browser
   */
  private async clearAdCache() {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(async (cacheName) => {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            
            // Delete ad-related cached requests
            const adRequests = requests.filter(request => 
              this.isAdRelatedRequest(request.url)
            );
            
            await Promise.all(
              adRequests.map(request => cache.delete(request))
            );
          })
        );
        console.log('Ad cache cleared');
      } catch (error) {
        console.warn('Failed to clear ad cache:', error);
      }
    }
  }

  /**
   * Check if a URL is ad-related
   */
  private isAdRelatedRequest(url: string): boolean {
    const adDomains = [
      'googlesyndication.com',
      'googletagservices.com',
      'doubleclick.net',
      'ezojs.com',
      'ezoic.com',
      'highperformanceformat.com',
      'adsterra.com',
      'monetag.com'
    ];
    
    return adDomains.some(domain => url.includes(domain));
  }

  /**
   * Refresh ads based on provider with timeout
   */
  private async refreshProviderAds(adInfo: AdProviderInfo): Promise<void> {
    const timeout = this.getProviderTimeout(adInfo.provider);
    
    const refreshPromise = (async () => {
      if (adInfo.isEzoic) {
        await this.refreshEzoicAds();
      } else if (adInfo.adsenseActive) {
        await this.refreshAdSenseAds();
      } else if (adInfo.monetagActive) {
        await this.refreshMonetagAds();
      } else if (adInfo.adsterraActive) {
        await this.refreshAdsterraAds();
      } else {
        throw new AdRefreshError(
          AdRefreshErrorType.PROVIDER_ERROR,
          'No active ad provider found',
          adInfo.provider,
          false
        );
      }
    })();
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new AdRefreshError(
          AdRefreshErrorType.TIMEOUT_ERROR,
          `Ad refresh timeout after ${timeout}ms`,
          adInfo.provider,
          true
        ));
      }, timeout);
    });
    
    await Promise.race([refreshPromise, timeoutPromise]);
  }
  
  /**
   * Get timeout for specific provider
   */
  private getProviderTimeout(provider: string): number {
    switch (provider.toLowerCase()) {
      case 'ezoic': return AD_PROVIDER_TIMEOUTS.EZOIC;
      case 'adsense': return AD_PROVIDER_TIMEOUTS.ADSENSE;
      case 'monetag': return AD_PROVIDER_TIMEOUTS.MONETAG;
      case 'adsterra': return AD_PROVIDER_TIMEOUTS.ADSTERRA;
      default: return AD_PROVIDER_TIMEOUTS.ADSENSE;
    }
  }

  /**
   * Refresh Ezoic ads
   */
  private async refreshEzoicAds(): Promise<void> {
    if (typeof window !== 'undefined' && window.ezstandalone) {
      try {
        // Clear existing Ezoic ad containers
        const ezoicContainers = document.querySelectorAll('[id^="ezoic-pub-ad-placeholder-"]');
        ezoicContainers.forEach(container => {
          container.innerHTML = '';
        });

        // Reinitialize Ezoic
        initializeEzoic();
        
        // Show ads for all placements
        const placements = Object.values(EZOIC_CONFIG.placements);
        window.ezstandalone.cmd.push(function() {
          if (window.ezstandalone.showAds) {
            window.ezstandalone.showAds(...placements);
          }
        });
        
        console.log('Ezoic ads refreshed');
      } catch (error) {
        throw new AdRefreshError(
          AdRefreshErrorType.SCRIPT_LOAD_ERROR,
          `Ezoic refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          'ezoic',
          true
        );
      }
    } else {
      throw new AdRefreshError(
        AdRefreshErrorType.PROVIDER_ERROR,
        'Ezoic not available',
        'ezoic',
        false
      );
    }
  }

  /**
   * Refresh AdSense ads
   */
  private async refreshAdSenseAds(): Promise<void> {
    try {
      // Clear existing AdSense ads
      const adsenseAds = document.querySelectorAll('.adsbygoogle');
      adsenseAds.forEach(ad => {
        if (ad.getAttribute('data-adsbygoogle-status')) {
          ad.removeAttribute('data-adsbygoogle-status');
          ad.innerHTML = '';
        }
      });

      // Reinitialize AdSense
      await new Promise(resolve => setTimeout(resolve, 100));
      initializeAdSense();
      
      console.log('AdSense ads refreshed');
    } catch (error) {
      throw new AdRefreshError(
        AdRefreshErrorType.SCRIPT_LOAD_ERROR,
        `AdSense refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'adsense',
        true
      );
    }
  }

  /**
   * Refresh Monetag ads
   */
  private async refreshMonetagAds(): Promise<void> {
    try {
      // Clear existing Monetag containers
      const monetagContainers = document.querySelectorAll('[id^="monetag-"]');
      monetagContainers.forEach(container => {
        container.innerHTML = '';
      });

      // Reinitialize Monetag
      initializeMonetag();
      
      console.log('Monetag ads refreshed');
    } catch (error) {
      throw new AdRefreshError(
        AdRefreshErrorType.SCRIPT_LOAD_ERROR,
        `Monetag refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'monetag',
        true
      );
    }
  }

  /**
   * Refresh Adsterra ads
   */
  private async refreshAdsterraAds(): Promise<void> {
    try {
      // Clear existing Adsterra containers
      const adsterraContainers = document.querySelectorAll('[id^="adsterra-"]');
      adsterraContainers.forEach(container => {
        const containerId = container.id;
        container.innerHTML = '';
        
        // Reinitialize for this specific container
        setTimeout(() => {
          initializeAdsterra(containerId);
        }, 100);
      });
      
      console.log('Adsterra ads refreshed');
    } catch (error) {
      throw new AdRefreshError(
        AdRefreshErrorType.SCRIPT_LOAD_ERROR,
        `Adsterra refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'adsterra',
        true
      );
    }
  }

  /**
   * Setup automatic ad refresh on app visibility changes
   */
  setupAutoRefresh() {
    if (typeof window === 'undefined') return;

    // Refresh when app becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.refreshAllAds({ delay: AD_REFRESH_DELAYS.ON_VISIBILITY_CHANGE });
      }
    });

    // Refresh when app gains focus
    window.addEventListener('focus', () => {
      this.refreshAllAds({ delay: AD_REFRESH_DELAYS.ON_FOCUS });
    });

    // Refresh when coming back from PWA background
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        // Page was restored from cache
        this.refreshAllAds({ force: true, delay: AD_REFRESH_DELAYS.ON_PAGE_SHOW });
      }
    });

    console.log('Auto ad refresh setup completed');
  }

  /**
   * Manual refresh trigger for user actions
   */
  async manualRefresh(): Promise<AdRefreshResult> {
    return this.refreshAllAds({ 
      force: true, 
      clearCache: true, 
      delay: AD_REFRESH_DELAYS.MANUAL_REFRESH 
    });
  }
}

// Export singleton instance
export const adRefreshManager = new AdRefreshManager();

// Convenience functions
export const refreshAds = (options?: AdRefreshOptions): Promise<AdRefreshResult> => 
  adRefreshManager.refreshAllAds(options);

export const setupAdAutoRefresh = (): void => 
  adRefreshManager.setupAutoRefresh();

export const manualAdRefresh = (): Promise<AdRefreshResult> => 
  adRefreshManager.manualRefresh();