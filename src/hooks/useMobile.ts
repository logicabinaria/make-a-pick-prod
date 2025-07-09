'use client';

import { useState, useEffect } from 'react';

export interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  screenSize: 'small' | 'medium' | 'large';
}

export function useMobile(): MobileDetection {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    isIOS: false,
    isAndroid: false,
    screenSize: 'large'
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;
      
      // Touch device detection
      const hasTouch = 'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        ((navigator as Navigator & { msMaxTouchPoints?: number }).msMaxTouchPoints || 0) > 0;
      
      // Platform detection
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isAndroid = /android/.test(userAgent);
      
      // Screen size detection
      const isMobile = width <= 768;
      const isTablet = width > 768 && width <= 1024;
      const isDesktop = width > 1024;
      
      let screenSize: 'small' | 'medium' | 'large' = 'large';
      if (width <= 480) {
        screenSize = 'small';
      } else if (width <= 768) {
        screenSize = 'medium';
      }
      
      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice: hasTouch,
        isIOS,
        isAndroid,
        screenSize
      });
    };

    // Initial detection
    detectDevice();

    // Listen for resize events
    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  return detection;
}

// Hook for handling mobile-specific touch interactions
export function useTouchFeedback() {
  const addTouchFeedback = (element: HTMLElement) => {
    if (!element) return;

    const handleTouchStart = () => {
      element.style.transform = 'scale(0.98)';
      element.style.transition = 'transform 0.1s ease';
    };

    const handleTouchEnd = () => {
      element.style.transform = 'scale(1)';
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  };

  return { addTouchFeedback };
}

// Hook for preventing mobile scroll issues
export function usePreventMobileScroll(isActive: boolean = false) {
  useEffect(() => {
    if (!isActive || typeof window === 'undefined') {
      return;
    }

    const preventDefault = (e: TouchEvent) => {
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventDefault);
    };
  }, [isActive]);
}