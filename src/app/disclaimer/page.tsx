'use client';

import Link from 'next/link';
import { useTranslation } from '@/components/I18nProvider';
import HeaderLanguageSelector from '@/components/HeaderLanguageSelector';

export default function DisclaimerPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="w-full bg-gradient-to-r from-green-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 shadow-sm border-b border-green-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium">{t('disclaimer.backToApp')}</span>
          </Link>
          <div className="flex items-center space-x-4">
            <HeaderLanguageSelector />
            <h1 className="text-xl font-bold">
              <span className="text-green-600 dark:text-green-400">Make</span>
              <span className="text-gray-600 dark:text-gray-300 font-light mx-1">A</span>
              <span className="text-orange-600 dark:text-orange-400">Pick</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('disclaimer.title')}
            </h1>
          </div>

          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                    {t('disclaimer.warningTitle')}
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-400">
                    {t('disclaimer.warningText')}
                  </p>
                </div>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {t('disclaimer.mainText')}
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">
                {t('disclaimer.doNotUseTitle')}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-400">
                <li>{t('disclaimer.doNotUse.health')}</li>
                <li>{t('disclaimer.doNotUse.relationships')}</li>
                <li>{t('disclaimer.doNotUse.financial')}</li>
                <li>{t('disclaimer.doNotUse.legal')}</li>
                <li>{t('disclaimer.doNotUse.critical')}</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
                {t('disclaimer.responsibilityTitle')}
              </h3>
              <p className="text-blue-700 dark:text-blue-400">
                {t('disclaimer.responsibilityText')}
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
                {t('disclaimer.enjoyTitle')}
              </h3>
              <p className="text-green-700 dark:text-green-400">
                {t('disclaimer.enjoyText')}
              </p>
            </div>
          </div>

          <div className="text-center pt-6">
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
            >
              {t('disclaimer.backToApp')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}