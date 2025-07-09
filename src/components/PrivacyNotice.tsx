'use client';

import { useTranslation } from '@/components/I18nProvider';
import { setPrivacyConsent } from '@/utils/storage';

interface PrivacyNoticeProps {
  onAccept: () => void;
}

export default function PrivacyNotice({ onAccept }: PrivacyNoticeProps) {
  const { t } = useTranslation();

  const handleAccept = () => {
    setPrivacyConsent(true);
    onAccept();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          {t('privacyNotice.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center leading-relaxed">
          {t('privacyNotice.description')}
        </p>
        <button
          onClick={handleAccept}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
        >
          {t('privacyNotice.accept')}
        </button>
      </div>
    </div>
  );
}