'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLanguagePreference } from '@/utils/storage';

interface Translations {
  [key: string]: string | Translations;
}

interface I18nContextType {
  locale: string;
  t: (key: string) => string;
  changeLanguage: (locale: string) => void;
  translations: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

const getNestedValue = (obj: Translations, path: string): string => {
  const result = path.split('.').reduce((current: string | Translations | undefined, key) => {
    if (typeof current === 'object' && current !== null) {
      return current[key];
    }
    return current;
  }, obj as string | Translations | undefined);
  
  // If the result is an object, return the path as fallback
  // This prevents rendering objects as React children
  if (typeof result === 'object') {
    console.warn(`Translation key '${path}' resolved to an object instead of a string`);
    return path;
  }
  
  return result as string || path;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const loadTranslations = async (lang: string) => {
    try {
      const response = await fetch(`/locales/${lang}/common.json`);
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to English if loading fails
      if (lang !== 'en') {
        const fallbackResponse = await fetch('/locales/en/common.json');
        const fallbackData = await fallbackResponse.json();
        setTranslations(fallbackData);
      }
    }
  };

  useEffect(() => {
    const savedLanguage = getLanguagePreference();
    const initialLocale = savedLanguage || 'en';
    setLocale(initialLocale);
    loadTranslations(initialLocale).then(() => setIsLoaded(true));
  }, []);

  const changeLanguage = async (newLocale: string) => {
    setLocale(newLocale);
    await loadTranslations(newLocale);
  };

  const t = (key: string): string => {
    return getNestedValue(translations, key);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <I18nContext.Provider value={{ locale, t, changeLanguage, translations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}