'use client';

import { useEffect } from 'react';
import { useMobile } from '@/hooks/useMobile';

interface MobileOptimizerProps {
  children: React.ReactNode;
}

export default function MobileOptimizer({ children }: MobileOptimizerProps) {
  const mobile = useMobile();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Prevent double-tap zoom on mobile
    if (mobile.isMobile) {
      let lastTouchEnd = 0;
      const preventDoubleTapZoom = (event: TouchEvent) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      };

      document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

      return () => {
        document.removeEventListener('touchend', preventDoubleTapZoom);
      };
    }
  }, [mobile.isMobile]);

  useEffect(() => {
    // Add mobile-specific CSS classes to body
    if (typeof window === 'undefined') {
      return;
    }

    const body = document.body;
    
    if (mobile.isMobile) {
      body.classList.add('mobile-device');
    } else {
      body.classList.remove('mobile-device');
    }

    if (mobile.isTouchDevice) {
      body.classList.add('touch-device');
    } else {
      body.classList.remove('touch-device');
    }

    if (mobile.isIOS) {
      body.classList.add('ios-device');
    } else {
      body.classList.remove('ios-device');
    }

    if (mobile.isAndroid) {
      body.classList.add('android-device');
    } else {
      body.classList.remove('android-device');
    }

    return () => {
      body.classList.remove('mobile-device', 'touch-device', 'ios-device', 'android-device');
    };
  }, [mobile.isMobile, mobile.isTouchDevice, mobile.isIOS, mobile.isAndroid]);

  useEffect(() => {
    // Handle orientation changes on mobile
    if (!mobile.isMobile || typeof window === 'undefined') {
      return;
    }

    const handleOrientationChange = () => {
      // Force a small delay to ensure proper viewport adjustment
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [mobile.isMobile]);

  useEffect(() => {
    // Improve mobile scrolling performance
    if (typeof window === 'undefined') {
      return;
    }

    const style = document.createElement('style');
    style.textContent = `
      .mobile-device {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }
      
      .touch-device button:active {
        background-color: rgba(0, 0, 0, 0.1);
      }
      
      .ios-device {
        -webkit-text-size-adjust: 100%;
      }
      
      .android-device {
        text-size-adjust: 100%;
      }
      
      @media (max-width: 768px) {
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        input, textarea, select {
          font-size: 16px !important;
        }
        
        button {
          min-height: 44px;
          min-width: 44px;
        }
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return <>{children}</>;
}