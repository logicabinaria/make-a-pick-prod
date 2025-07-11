'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import { Category } from '@/config/categories';
import { useMobile } from '@/hooks/useMobile';
import confetti from 'canvas-confetti';
import FlexibleAdBanner from '@/components/FlexibleAdBanner';

interface ResultScreenProps {
  result: string;
  options: string[];
  category?: Category;
  onTryAgain: () => void;
  onNewDecision: () => void;
  onBackToCategories: () => void;
}

export default function ResultScreen({ 
  result, 
  options, 
  category, 
  onTryAgain, 
  onNewDecision, 
  onBackToCategories 
}: ResultScreenProps) {
  const { t } = useTranslation();
  const mobile = useMobile();
  const [isAnimating, setIsAnimating] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const getCategoryName = (cat: Category) => {
    return t(`categories.${cat.id}.name`) || cat.name;
  };

  // Celebration effect on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);

    // Multiple confetti bursts
    const confettiInterval = setInterval(() => {
      const particleCount = mobile.isMobile ? 30 : 50;
      const spread = mobile.isMobile ? 45 : 60;
      
      confetti({
        particleCount,
        spread,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#FF9800', '#2196F3', '#FF5722', '#9C27B0']
      });
    }, 300);

    const stopConfetti = setTimeout(() => {
      clearInterval(confettiInterval);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearInterval(confettiInterval);
      clearTimeout(stopConfetti);
    };
  }, [mobile.isMobile]);

  const handleTryAgain = () => {
    // Trigger confetti for new pick
    const particleCount = mobile.isMobile ? 40 : 70;
    const spread = mobile.isMobile ? 50 : 70;
    
    confetti({
      particleCount,
      spread,
      origin: { y: 0.6 },
      colors: ['#4CAF50', '#FF9800', '#2196F3', '#FF5722']
    });
    
    onTryAgain();
  };

  const shareResult = () => {
    const categoryText = category ? ` for ${getCategoryName(category)}` : '';
    const shareText = `🎲 ${t('result.shareText') || 'I used Make A Pick to decide'}${categoryText}: "${result}"! Try it yourself at ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: t('app.name'),
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // Show a toast or feedback that text was copied
      setShowShareOptions(true);
      setTimeout(() => setShowShareOptions(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      {/* Ad Banner */}
      <FlexibleAdBanner />
      
      {/* Header */}
      <div className="text-center space-y-4">
        {/* Category Header (if applicable) */}
        {category && (
          <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 text-white p-4 rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
            <div className="relative z-10 space-y-1">
              <div className="text-2xl">{category.emoji}</div>
              <h2 className="text-lg font-bold">{getCategoryName(category)}</h2>
            </div>
          </div>
        )}
      </div>

      {/* Result Display */}
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white">{t('result.title')}</h1>
          <div className="text-6xl animate-bounce">
            {category?.emoji || '🎲'}
          </div>
        </div>
        
        {/* Main Result */}
        <div className={`relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white p-8 rounded-3xl shadow-2xl transform transition-all duration-1000 ${
          isAnimating ? 'scale-110 rotate-2' : 'scale-100 rotate-0'
        }`}>
          <div className="absolute inset-0 bg-white/20 rounded-3xl backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="text-4xl mb-4">🎉</div>
            <div className="text-2xl font-bold leading-tight break-words">
              {result}
            </div>
          </div>
          
          {/* Sparkle effects */}
          <div className="absolute -top-2 -right-2 text-yellow-300 text-2xl animate-pulse">✨</div>
          <div className="absolute -bottom-2 -left-2 text-yellow-300 text-2xl animate-pulse delay-500">✨</div>
        </div>
        
        {/* Celebration Message */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🎊</span>
            <span className="font-semibold text-center">{t('result.celebration')}</span>
            <span className="text-2xl">🎊</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Primary Actions */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleTryAgain}
            className="group w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3 min-h-[56px] touch-manipulation tap-highlight-none"
          >
            <span className="text-xl group-hover:rotate-180 transition-transform duration-300">🔄</span>
            {t('result.tryAgain')}
          </button>
          
          <button
            onClick={onNewDecision}
            className="group w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3 min-h-[56px] touch-manipulation tap-highlight-none"
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">✨</span>
            {t('result.newDecision')}
          </button>
        </div>
        
        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={shareResult}
            className="group px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 touch-manipulation tap-highlight-none"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            {t('result.share')}
          </button>
          
          <button
            onClick={onBackToCategories}
            className="group px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 touch-manipulation tap-highlight-none"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('result.backToCategories')}
          </button>
        </div>
      </div>

      {/* Share Feedback */}
      {showShareOptions && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('result.copiedToClipboard')}
          </div>
        </div>
      )}

      {/* Options Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-md">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
          {t('result.allOptions')} ({options.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {options.map((option, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                option === result
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md transform scale-105'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {option === result && '👑 '}{option}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}