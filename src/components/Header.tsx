'use client';

import HeaderLanguageSelector from '@/components/HeaderLanguageSelector';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {

  return (
    <header className="w-full bg-gradient-to-r from-green-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 shadow-sm border-b border-green-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logosvg.svg"
              alt="Make A Pick - Random Decision Maker"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>
          
          {/* PWA Install, Language Selector and Help Icon */}
          <div className="flex items-center space-x-2">
            <PWAInstallPrompt 
              variant="button" 
              className="hidden sm:inline-flex text-xs px-3 py-1.5"
            />
            <HeaderLanguageSelector />
            <Link 
              href="/help"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              title="Help & About"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-current"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}