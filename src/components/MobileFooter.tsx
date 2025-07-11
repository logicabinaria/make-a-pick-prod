'use client';

import { useTranslation } from '@/components/I18nProvider';
import { useState } from 'react';
import HelpModal from './HelpModal';
import PrivacyModal from './PrivacyModal';
import ShareModal from './ShareModal';
import HeaderLanguageSelector from './HeaderLanguageSelector';

export default function MobileFooter() {
  const { t } = useTranslation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 border-t border-purple-500/30 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Share Block */}
            <div className="group relative">
              <button
                onClick={() => setIsShareOpen(true)}
                className="relative w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 backdrop-blur-sm border border-pink-400/30 flex items-center justify-center"
                title={t('share.title') || 'Share'}
              >
                <div className="absolute inset-0 bg-white/10 rounded-lg backdrop-blur-sm"></div>
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
              </button>
            </div>
            
            {/* Language Selector Block */}
            <div className="group relative">
              <div className="relative w-16 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 backdrop-blur-sm border border-emerald-400/30 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/10 rounded-lg backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <HeaderLanguageSelector />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
              </div>
            </div>
            
            {/* Help Block */}
            <div className="group relative">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 backdrop-blur-sm border border-blue-400/30 flex items-center justify-center"
                title={t('help.title')}
              >
                <div className="absolute inset-0 bg-white/10 rounded-lg backdrop-blur-sm"></div>
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
              </button>
            </div>
            
            {/* Privacy Block */}
            <div className="group relative">
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="relative w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 backdrop-blur-sm border border-violet-400/30 flex items-center justify-center"
                title={t('privacy.title')}
              >
                <div className="absolute inset-0 bg-white/10 rounded-lg backdrop-blur-sm"></div>
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
              </button>
            </div>
            
            {/* Disclaimer Block */}
            <div className="group relative">
              <a
                href="/disclaimer"
                className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 backdrop-blur-sm border border-orange-400/30 flex items-center justify-center"
                title={t('disclaimer.linkText')}
              >
                <div className="absolute inset-0 bg-white/10 rounded-lg backdrop-blur-sm"></div>
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  );
}