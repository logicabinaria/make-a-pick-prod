'use client';

import { useState, useEffect } from 'react';
import { I18nProvider, useTranslation } from '@/components/I18nProvider';

import LanguageSelector from '@/components/LanguageSelector';
import PrivacyNotice from '@/components/PrivacyNotice';
import CategoryGrid from '@/components/CategoryGrid';
import CategoryInput from '@/components/CategoryInput';
import ResultScreen from '@/components/ResultScreen';
import Picker from '@/components/Picker';
import StatsDisplay from '@/components/StatsDisplay';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import Header from '@/components/Header';
import PopularCategories from '@/components/PopularCategories';
import { Category } from '@/config/categories';


import MobileFooter from '@/components/MobileFooter';
import MobileOptimizer from '@/components/MobileOptimizer';
import { getLanguagePreference, getPrivacyConsent } from '@/utils/storage';

type AppMode = 'home' | 'allCategories' | 'categoryInput' | 'result' | 'custom';

interface AppState {
  mode: AppMode;
  selectedCategory?: Category;
  result?: string;
  options?: string[];
}

function AppContent() {
  const { t } = useTranslation();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [appState, setAppState] = useState<AppState>({ mode: 'home' });

  useEffect(() => {
    const hasLanguagePreference = getLanguagePreference() !== null;
    const hasPrivacyConsent = getPrivacyConsent();

    if (!hasLanguagePreference) {
      setShowLanguageSelector(true);
    } else if (!hasPrivacyConsent) {
      setShowPrivacyNotice(true);
    }

    setIsInitialized(true);
  }, []);

  const handleLanguageSelected = () => {
    setShowLanguageSelector(false);
    const hasPrivacyConsent = getPrivacyConsent();
    if (!hasPrivacyConsent) {
      setShowPrivacyNotice(true);
    }
  };

  const handlePrivacyAccepted = () => {
    setShowPrivacyNotice(false);
  };

  const handleSkipToCustom = () => {
    setAppState({ mode: 'custom' });
  };

  const handleBackToHome = () => {
    setAppState({ mode: 'home' });
  };

  const handleShowAllCategories = () => {
    setAppState({ mode: 'allCategories' });
  };

  const handleCategorySelect = (category: Category) => {
    setAppState({ mode: 'categoryInput', selectedCategory: category });
  };

  const handleBackToCategories = () => {
    setAppState({ mode: 'allCategories' });
  };

  const handleResult = (result: string, options: string[]) => {
    setAppState(prev => ({ ...prev, mode: 'result', result, options }));
  };

  const handleTryAgain = () => {
    if (appState.selectedCategory) {
      setAppState(prev => ({ ...prev, mode: 'categoryInput' }));
    }
  };

  const handleNewDecision = () => {
    setAppState({ mode: 'allCategories' });
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">{t('loading')}</div>
      </div>
    );
  }

  return (
    <MobileOptimizer>
      <div className="min-h-screen bg-gray-900 mobile-safe-area">
        <Header onHomeClick={handleBackToHome} />
        
        <main className="container mx-auto px-4 pt-20 py-4 pb-32 space-y-6 max-w-lg">
            {/* Main Application Content */}
            {appState.mode === 'home' ? (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="text-center space-y-4">
                  {/* Welcome Message */}
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">
                      {t('welcome.title')}
                    </h1>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {t('welcome.subtitle')}
                    </p>
                  </div>
                </div>
                
                {/* Popular Categories */}
                <PopularCategories 
                  onCategorySelect={handleCategorySelect}
                  onShowAllCategories={handleShowAllCategories}
                />
                
                {/* Skip to Custom Button */}
                <div className="text-center">
                  <button
                    onClick={handleSkipToCustom}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 touch-manipulation tap-highlight-none"
                  >
                    {t('welcome.skipToCustom')}
                  </button>
                </div>
              </div>
            ) : appState.mode === 'allCategories' ? (
              <CategoryGrid 
                onCategorySelect={handleCategorySelect}
                onBackToWelcome={handleBackToHome}
              />
            ) : appState.mode === 'categoryInput' && appState.selectedCategory ? (
              <CategoryInput 
                category={appState.selectedCategory}
                onResult={handleResult}
                onBackToCategories={handleBackToCategories}
              />
            ) : appState.mode === 'result' && appState.result && appState.options ? (
              <ResultScreen 
                result={appState.result}
                options={appState.options}
                category={appState.selectedCategory}
                onTryAgain={handleTryAgain}
                onNewDecision={handleNewDecision}
                onBackToCategories={handleBackToCategories}
              />
            ) : (
              <div className="space-y-6">
                {/* Back to Home Button */}
                <div className="text-center">
                  <button
                    onClick={handleBackToHome}
                    className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto touch-manipulation tap-highlight-none"
                  >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t('backToHome')}
                  </button>
                </div>
                
                {/* Traditional Picker Component */}
                <Picker />
              </div>
            )}
            
            <StatsDisplay />
            <PWAInstallPrompt 
              variant="banner" 
              className="sm:hidden"
            />
            <PWAInstallPrompt 
              variant="card" 
              className="hidden sm:block"
            />
          </main>

        <MobileFooter />

        {showLanguageSelector && (
          <LanguageSelector onLanguageSelected={handleLanguageSelected} />
        )}

        {showPrivacyNotice && (
          <PrivacyNotice onAccept={handlePrivacyAccepted} />
        )}
      </div>
    </MobileOptimizer>
  );
}

export default function Home() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
