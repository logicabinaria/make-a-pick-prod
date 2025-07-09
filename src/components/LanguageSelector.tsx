'use client';

import { useTranslation } from '@/components/I18nProvider';
import { setLanguagePreference } from '@/utils/storage';

interface LanguageSelectorProps {
  onLanguageSelected: (language: string) => void;
}

export default function LanguageSelector({ onLanguageSelected }: LanguageSelectorProps) {
  const { changeLanguage } = useTranslation();

  const handleLanguageSelect = async (language: string) => {
    setLanguagePreference(language);
    await changeLanguage(language);
    onLanguageSelected(language);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Choose Your Language / আপনার ভাষা বেছে নিন
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Please select your preferred language to continue. / অগ্রসর হতে আপনার পছন্দের ভাষা নির্বাচন করুন।
        </p>
        <div className="space-y-3">
          <button
            onClick={() => handleLanguageSelect('en')}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            English
          </button>
          <button
            onClick={() => handleLanguageSelect('bn')}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            বাংলা (Bangla)
          </button>
        </div>
      </div>
    </div>
  );
}