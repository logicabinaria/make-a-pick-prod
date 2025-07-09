'use client';

import { useState, useEffect } from 'react';
import { I18nProvider, useTranslation } from '@/components/I18nProvider';
import Header from '@/components/Header';
import LanguageSelector from '@/components/LanguageSelector';
import PrivacyNotice from '@/components/PrivacyNotice';
import Picker from '@/components/Picker';
import StatsDisplay from '@/components/StatsDisplay';
import FlexibleAdBanner from '@/components/FlexibleAdBanner';

import MobileFooter from '@/components/MobileFooter';
import MobileOptimizer from '@/components/MobileOptimizer';
import { getLanguagePreference, getPrivacyConsent } from '@/utils/storage';

function AppContent() {
  const { t } = useTranslation();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">{t('loading')}</div>
      </div>
    );
  }

  return (
    <MobileOptimizer>
      <div className="min-h-screen bg-gray-900 pb-20 mobile-safe-area">
        <Header />
        
        <main className="container mx-auto px-4 py-4 space-y-6 max-w-lg">
            <Picker />
            <StatsDisplay />
            <FlexibleAdBanner />
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
