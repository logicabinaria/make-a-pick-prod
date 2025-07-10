/**
 * PWA Installation Prompt Component
 * Provides a user-friendly interface for installing the app
 */

'use client';

import React, { useState } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

interface PWAInstallPromptProps {
  variant?: 'banner' | 'button' | 'card';
  className?: string;
}

/**
 * PWA Installation Prompt Component
 */
export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  variant = 'banner',
  className = ''
}) => {
  const { pwaState, installApp, dismissPrompt, isIOSDevice } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  // Don't render if PWA is already installed or not installable
  if (pwaState.isInstalled || (!pwaState.isInstallable && !isIOSDevice)) {
    return null;
  }

  // Don't render if install prompt should not be shown (for non-iOS devices)
  if (!isIOSDevice && !pwaState.showInstallPrompt) {
    return null;
  }

  const handleInstall = async () => {
    if (isIOSDevice) {
      setShowIOSModal(true);
      return;
    }

    setIsInstalling(true);
    try {
      await installApp();
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
  };

  // iOS Instructions Modal
  const IOSInstructionsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Install Make a Pick
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold">1.</span>
            <span>Tap the Share button <span className="inline-block w-4 h-4 bg-blue-500 rounded-sm">⬆️</span> at the bottom of your screen</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold">2.</span>
            <span>Scroll down and tap &quot;Add to Home Screen&quot; <span className="inline-block w-4 h-4 bg-green-500 rounded-sm">➕</span></span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 font-bold">3.</span>
            <span>Tap &quot;Add&quot; to install the app</span>
          </div>
        </div>
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setShowIOSModal(false)}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );

  // Banner variant
  if (variant === 'banner') {
    return (
      <>
        <div className={`bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 ${className}`}>
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex-1">
              <h3 className="font-semibold text-sm md:text-base">
                📱 Install Make a Pick
              </h3>
              <p className="text-xs md:text-sm opacity-90 mt-1">
                Get the full app experience with offline access
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInstalling ? 'Installing...' : 'Install'}
              </button>
              <button
                onClick={handleDismiss}
                className="text-white hover:text-gray-200 p-2 transition-colors"
                aria-label="Dismiss install prompt"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
        {showIOSModal && <IOSInstructionsModal />}
      </>
    );
  }

  // Button variant
  if (variant === 'button') {
    return (
      <>
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className={`inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          <span>📱</span>
          <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
        </button>
        {showIOSModal && <IOSInstructionsModal />}
      </>
    );
  }

  // Card variant
  if (variant === 'card') {
    return (
      <>
        <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm ${className}`}>
          <div className="flex items-start space-x-4">
            <div className="text-4xl">📱</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Install Make a Pick
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Install our app for a better experience with offline access, faster loading, and native feel.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInstalling ? 'Installing...' : 'Install Now'}
                </button>
                <button
                  onClick={handleDismiss}
                  className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
        {showIOSModal && <IOSInstructionsModal />}
      </>
    );
  }

  return null;
};

export default PWAInstallPrompt;