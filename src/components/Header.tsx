'use client';

import { useTranslation } from '@/components/I18nProvider';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="w-full bg-gradient-to-r from-green-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 shadow-sm border-b border-green-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <div className="space-y-2">
          {/* Logo and App Name */}
          <div className="flex items-center justify-center space-x-3">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-green-600 dark:text-green-400"
              role="img"
              aria-label={t('appName')}
            >
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="20" cy="20" r="10" fill="#4CAF50" />
              <circle cx="20" cy="20" r="5" fill="white" />
              <path d="M20 2 L22 10 L20 18 L18 10 Z" fill="#FF9800" />
              <path d="M38 20 L30 22 L22 20 L30 18 Z" fill="#FF9800" />
              <path d="M20 38 L18 30 L20 22 L22 30 Z" fill="#FF9800" />
              <path d="M2 20 L10 18 L18 20 L10 22 Z" fill="#FF9800" />
            </svg>
            
            <h1 className="text-3xl font-bold">
              <span className="text-green-600 dark:text-green-400">Make</span>
              <span className="text-gray-600 dark:text-gray-300 font-light mx-1">A</span>
              <span className="text-orange-600 dark:text-orange-400">Pick</span>
            </h1>
          </div>
          
          {/* Tagline */}
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
            {t('tagline')}
          </p>
        </div>
      </div>
    </header>
  );
}