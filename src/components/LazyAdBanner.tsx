'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy load the FlexibleAdBanner component
const FlexibleAdBanner = dynamic(() => import('./FlexibleAdBanner'), {
  loading: () => (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mb-2"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  ),
  ssr: false // Disable SSR for ads to prevent hydration issues
});

interface LazyAdBannerProps {
  className?: string;
}

const LazyAdBanner: React.FC<LazyAdBannerProps> = ({ className }) => {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md mx-auto mt-6">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mb-2"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <FlexibleAdBanner className={className} />
    </Suspense>
  );
};

export default LazyAdBanner;