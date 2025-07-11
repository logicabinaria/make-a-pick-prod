'use client';

import { useTranslation } from '@/components/I18nProvider';

interface WelcomeScreenProps {
  onContinue: () => void;
  onSkipToCustom: () => void;
  onBackToHome?: () => void;
}

export default function WelcomeScreen({ onContinue, onSkipToCustom, onBackToHome }: WelcomeScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="text-center space-y-8">
      {/* Back to Home Button */}
      {onBackToHome && (
        <div className="text-left">
          <button
            onClick={onBackToHome}
            className="group px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 touch-manipulation tap-highlight-none"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToHome')}
          </button>
        </div>
      )}
      
      {/* Welcome Message */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">
          {t('welcomeTitle')}
        </h1>
        <p className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
          {t('welcomeSubtitle')}
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={onContinue}
          className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 touch-manipulation tap-highlight-none"
        >
          {t('exploreCategories')}
        </button>
        
        <button
          onClick={onSkipToCustom}
          className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 touch-manipulation tap-highlight-none"
        >
          {t('skipToCustom')}
        </button>
      </div>
    </div>
  );
}