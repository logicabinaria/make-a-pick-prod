'use client';

import Image from 'next/image';
import { useTranslation } from './I18nProvider';

interface HeaderProps {
  onHomeClick?: () => void;
}

export default function Header({ onHomeClick }: HeaderProps) {
  const { t } = useTranslation();
  
  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Image
              src="/logosvg.svg"
              alt="Make A Pick - Random Decision Maker"
              width={100}
              height={35}
              className="h-8 w-auto"
              priority
            />
          </div>
          
          {/* Right: Navigation Icons */}
          <div className="flex items-center space-x-3">
            {/* Home Icon */}
            <button
              onClick={handleHomeClick}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
              title={t('navigation.home') || 'Home'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
            
          </div>
        </div>
      </div>
    </header>
  );
}