'use client';

import { useState, useEffect } from 'react';
import { I18nProvider } from '@/components/I18nProvider';
import Header from '@/components/Header';
import LanguageSelector from '@/components/LanguageSelector';
import PrivacyNotice from '@/components/PrivacyNotice';
import Picker from '@/components/Picker';
import StatsDisplay from '@/components/StatsDisplay';
import FooterAd from '@/components/FooterAd';
import { getLanguagePreference, getPrivacyConsent } from '@/utils/storage';

function AppContent() {
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
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-6">
          <Picker />
          <StatsDisplay />
          <FooterAd />
        </main>

      {showLanguageSelector && (
        <LanguageSelector onLanguageSelected={handleLanguageSelected} />
      )}

      {showPrivacyNotice && (
        <PrivacyNotice onAccept={handlePrivacyAccepted} />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
