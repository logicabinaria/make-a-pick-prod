'use client';

import { useState } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import { setLanguagePreference } from '@/utils/storage';

export default function HeaderLanguageSelector() {
  const { locale, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (newLanguage: string) => {
    if (newLanguage !== locale) {
      setLanguagePreference(newLanguage);
      await changeLanguage(newLanguage);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-white hover:text-gray-200 transition-colors duration-200 rounded-lg hover:bg-white/10"
        aria-label="Change language"
      >
        <span className="text-sm font-medium">
          {locale === 'en' ? 'EN' : 'বাং'}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M7 10L12 15L17 10H7Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="py-1">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  locale === 'en'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🇺🇸</span>
                  <span>English</span>
                  {locale === 'en' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-auto">
                      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                    </svg>
                  )}
                </div>
              </button>
              <button
                onClick={() => handleLanguageChange('bn')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  locale === 'bn'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🇧🇩</span>
                  <span>বাংলা</span>
                  {locale === 'bn' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-auto">
                      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}