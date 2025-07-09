/**
 * PWA Installation Hook
 * Manages PWA installation state and provides installation functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { BeforeInstallPromptEvent, PWAState } from '@/types';
import { defaultAppConfig } from '@/config';

interface UsePWAInstallReturn {
  pwaState: PWAState;
  installApp: () => Promise<boolean>;
  dismissPrompt: () => void;
  resetPrompt: () => void;
  isIOSDevice: boolean;
}

/**
 * Custom hook for managing PWA installation
 */
export const usePWAInstall = (): UsePWAInstallReturn => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    installPromptEvent: null,
    showInstallPrompt: false
  });

  const [isIOSDevice, setIsIOSDevice] = useState(false);

  // Check if device is iOS
  useEffect(() => {
    const checkIOSDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as { standalone?: boolean }).standalone === true;
      
      setIsIOSDevice(isIOS);
      
      // Check if already installed on iOS
      if (isIOS && (isStandalone || isInWebAppiOS)) {
        setPwaState(prev => ({ ...prev, isInstalled: true }));
      }
    };

    checkIOSDevice();
  }, []);

  // Check if already installed (non-iOS)
  useEffect(() => {
    const checkInstallation = () => {
      // Check if running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebApp = (window.navigator as { standalone?: boolean }).standalone === true;
      
      if (isStandalone || isInWebApp) {
        setPwaState(prev => ({ ...prev, isInstalled: true }));
      }
    };

    checkInstallation();
  }, []);

  // Handle beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      const installEvent = e as BeforeInstallPromptEvent;
      
      setPwaState(prev => ({
        ...prev,
        isInstallable: true,
        installPromptEvent: installEvent,
        showInstallPrompt: shouldShowPrompt()
      }));
    };

    const handleAppInstalled = () => {
      setPwaState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPromptEvent: null,
        showInstallPrompt: false
      }));
      
      // Clear dismissed state from localStorage
      localStorage.removeItem('pwa-install-dismissed');
      
      // Track installation
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as { gtag: (command: string, eventName: string, parameters?: Record<string, unknown>) => void }).gtag;
      gtag('event', 'pwa_installed', {
        event_category: 'PWA',
        event_label: 'App Installed'
      });
    }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if we should show the install prompt
  const shouldShowPrompt = useCallback((): boolean => {
    if (!defaultAppConfig.pwaInstallPromptEnabled) return false;
    
    // Don't show if already dismissed recently
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return false; // Don't show for 7 days after dismissal
    }
    
    return true;
  }, []);

  // Install the app
  const installApp = useCallback(async (): Promise<boolean> => {
    if (!pwaState.installPromptEvent) return false;

    try {
      // Show the install prompt
      await pwaState.installPromptEvent.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await pwaState.installPromptEvent.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        // Track successful installation prompt
        if (typeof window !== 'undefined' && 'gtag' in window) {
          const gtag = (window as { gtag: (command: string, eventName: string, parameters?: Record<string, unknown>) => void }).gtag;
          gtag('event', 'pwa_install_accepted', {
            event_category: 'PWA',
            event_label: 'Install Prompt Accepted'
          });
        }
        
        setPwaState(prev => ({
          ...prev,
          showInstallPrompt: false,
          installPromptEvent: null
        }));
        
        return true;
      } else {
        // Track dismissed installation prompt
        if (typeof window !== 'undefined' && 'gtag' in window) {
          const gtag = (window as { gtag: (command: string, eventName: string, parameters?: Record<string, unknown>) => void }).gtag;
          gtag('event', 'pwa_install_dismissed', {
            event_category: 'PWA',
            event_label: 'Install Prompt Dismissed'
          });
        }
        
        dismissPrompt();
        return false;
      }
    } catch (error) {
      console.error('Error during app installation:', error);
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pwaState.installPromptEvent]);

  // Dismiss the install prompt
  const dismissPrompt = useCallback(() => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setPwaState(prev => ({ ...prev, showInstallPrompt: false }));
    
    // Track dismissal
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as { gtag: (command: string, eventName: string, parameters?: Record<string, unknown>) => void }).gtag;
      gtag('event', 'pwa_prompt_dismissed', {
        event_category: 'PWA',
        event_label: 'Install Prompt Manually Dismissed'
      });
    }
  }, []);

  // Reset prompt (for testing or manual trigger)
  const resetPrompt = useCallback(() => {
    localStorage.removeItem('pwa-install-dismissed');
    setPwaState(prev => ({
      ...prev,
      showInstallPrompt: prev.isInstallable && shouldShowPrompt()
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    pwaState,
    installApp,
    dismissPrompt,
    resetPrompt,
    isIOSDevice
  };
};



export default usePWAInstall;