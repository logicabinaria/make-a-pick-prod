'use client';

import { useTranslation } from '@/components/I18nProvider';
import { useState } from 'react';
import HelpModal from './HelpModal';
import PrivacyModal from './PrivacyModal';
import ShareModal from './ShareModal';

export default function MobileFooter() {
  const { t } = useTranslation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center space-x-6 text-sm">
            <button
              onClick={() => setIsShareOpen(true)}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </button>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t('help.title')}
            </button>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t('privacy.title')}
            </button>
          </div>
          <div className="text-center text-xs text-gray-500 dark:text-gray-500 mt-2">
            © 2024 {t('appName')}. {t('disclaimer')}
          </div>
        </div>
      </footer>

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  );
}