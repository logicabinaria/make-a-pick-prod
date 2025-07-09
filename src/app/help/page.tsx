'use client';

import Link from 'next/link';
import { useTranslation } from '@/components/I18nProvider';
import HeaderLanguageSelector from '@/components/HeaderLanguageSelector';

export default function HelpPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="w-full bg-gradient-to-r from-green-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 shadow-sm border-b border-green-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium">{t('help.backToApp')}</span>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('help.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('help.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('help.howItWorks.title')}
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>{t('help.howItWorks.step1')}</li>
                  <li>{t('help.howItWorks.step2')}</li>
                  <li>{t('help.howItWorks.step3')}</li>
                  <li>{t('help.howItWorks.step4')}</li>
                </ol>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('help.quickTips.title')}
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">Enter</kbd> {t('help.quickTips.tip1')}</li>
                  <li>{t('help.quickTips.tip2')}</li>
                  <li>{t('help.quickTips.tip3')}</li>
                  <li>{t('help.quickTips.tip4')}</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('help.privacy.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {t('help.privacy.description')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>{t('help.privacy.point1')}</li>
                  <li>{t('help.privacy.point2')}</li>
                  <li>{t('help.privacy.point3')}</li>
                  <li>{t('help.privacy.point4')}</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('help.perfectFor.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">{t('help.perfectFor.daily.title')}</h3>
                    <p className="text-green-700 dark:text-green-400 text-sm">{t('help.perfectFor.daily.description')}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">{t('help.perfectFor.team.title')}</h3>
                    <p className="text-blue-700 dark:text-blue-400 text-sm">{t('help.perfectFor.team.description')}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">{t('help.perfectFor.creative.title')}</h3>
                    <p className="text-purple-700 dark:text-purple-400 text-sm">{t('help.perfectFor.creative.description')}</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">{t('help.perfectFor.fun.title')}</h3>
                    <p className="text-orange-700 dark:text-orange-400 text-sm">{t('help.perfectFor.fun.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-orange-50 dark:from-green-900/20 dark:to-orange-900/20 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('help.cta.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('help.cta.description')}
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors duration-200"
            >
              {t('help.cta.button')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}