'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import confetti from 'canvas-confetti';
import { pickRandomOption } from '@/utils/clientPicker';
import { useMobile } from '@/hooks/useMobile';

// Inspiring quotes function - Disabled for now to save screen space
// const getInspiringQuotes = (t: (key: string) => string) => [
//   t('inspiringQuotes.quote1'),
//   t('inspiringQuotes.quote2'),
//   t('inspiringQuotes.quote3'),
//   t('inspiringQuotes.quote4'),
//   t('inspiringQuotes.quote5'),
//   t('inspiringQuotes.quote6'),
//   t('inspiringQuotes.quote7'),
//   t('inspiringQuotes.quote8'),
//   t('inspiringQuotes.quote9'),
//   t('inspiringQuotes.quote10')
// ];

export default function Picker() {
  const { t } = useTranslation();
  const mobile = useMobile();
  const [options, setOptions] = useState<string[]>(['']);
  const [result, setResult] = useState<string | null>(null);
  const [previousPick, setPreviousPick] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [inspiringText, setInspiringText] = useState<string>(''); // Disabled for now
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const addOption = () => {
    setOptions([...options, '']);
  };

  // Auto-focus on the new input field
  useEffect(() => {
    const lastIndex = options.length - 1;
    if (inputRefs.current[lastIndex] && options[lastIndex] === '') {
      inputRefs.current[lastIndex]?.focus();
    }
  }, [options]);

  const handleKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (options[index].trim() !== '') {
        addOption();
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const makeAPick = useCallback(async () => {
    // Filter out empty options
    const validOptions = options.filter(option => option.trim().length > 0);
    
    if (validOptions.length < 2) {
      setError(t('errors.noOptions'));
      return;
    }

    setIsLoading(true);
    setError(null);

    // Use client-side picker only
    const pickResult = pickRandomOption({
      options: validOptions,
      excludePrevious: validOptions.length > 2,
      previousPick: previousPick || undefined
    });

    try {
      setResult(pickResult.pick);
      setPreviousPick(pickResult.pick);
      
      // Set a random inspiring quote - Disabled for now to save screen space
      // const quotes = getInspiringQuotes(t);
      // const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      // setInspiringText(randomQuote);
      
      // Trigger confetti animation with mobile optimization
      try {
        const particleCount = mobile.isMobile ? 50 : 100;
        const spread = mobile.isMobile ? 50 : 70;
        
        confetti({
          particleCount,
          spread,
          origin: { y: 0.6 },
          colors: ['#4CAF50', '#FF9800', '#2196F3', '#FF5722']
        });
      } catch {
        // Confetti failure shouldn't break the app
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.pickFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [options, t, previousPick, mobile.isMobile]);

  const tryAgain = useCallback(() => {
    setResult(null);
    setError(null);
    // setInspiringText(''); // Disabled for now
    // Keep the same options and previous pick for better UX
  }, []);

  const newDecision = useCallback(() => {
    setOptions(['', '']);
    setResult(null);
    setError(null);
    setPreviousPick(null);
    // setInspiringText(''); // Disabled for now
  }, []);


  


  if (result) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center relative overflow-hidden">
          {/* Neon border animation */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-75 blur-sm animate-pulse"></div>
          <div className="absolute inset-[2px] rounded-lg bg-white dark:bg-gray-800"></div>
          
          <div className="relative z-10">
            <div className="text-center space-y-8">
              <div className="relative bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold mb-3">{t('result')}</h2>
                  <p className="text-lg mb-4 opacity-90">{t('yourPick')}</p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <p className="text-3xl font-bold text-white drop-shadow-lg">{result}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={tryAgain}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('tryAgain')}
                </button>
                <button
                  onClick={newDecision}
                  className="group px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {t('newDecision')}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Inspiring Text - Hidden for now to save screen space, can be re-enabled in the future */}
        {/* {inspiringText && (
          <div className="bg-gradient-to-r from-green-50 to-orange-50 dark:from-green-900/20 dark:to-orange-900/20 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-200 font-medium">
              {inspiringText}
            </p>
          </div>
        )} */}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg relative overflow-hidden">
      {/* Neon border animation */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-sm animate-pulse"></div>
      <div className="absolute inset-[2px] rounded-lg bg-white dark:bg-gray-800"></div>
      
      <div className="relative z-10">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('appName')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            {t('tagline')}
          </p>
        </div>
        {!result ? (
          <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="group flex gap-3 items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                {index + 1}
              </div>
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                placeholder={t('enterOption')}
                className="flex-1 px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white touch-manipulation tap-highlight-none min-h-[48px] transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 shadow-sm focus:shadow-md"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />
              {options.length > 1 && (
                <button
                  onClick={() => removeOption(index)}
                  className="flex-shrink-0 w-10 h-10 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 flex items-center justify-center group-hover:scale-110 shadow-sm hover:shadow-md"
                  aria-label={t('removeOption')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          
          <button
            onClick={addOption}
            className="group w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 min-h-[52px] touch-manipulation tap-highlight-none"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t('addOption')}
          </button>
          
          <button
            onClick={makeAPick}
            disabled={isLoading || options.filter(opt => opt.trim()).length < 2}
            className="group w-full px-6 py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none flex items-center justify-center gap-3 min-h-[64px] touch-manipulation tap-highlight-none"
          >
            {isLoading ? (
              <>
                <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('picking')}
              </>
            ) : (
              <>
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🎲</span>
                {t('makeAPick')}
              </>
            )}
          </button>
          
          {error && (
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl shadow-md flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}
          
          {options.filter(opt => opt.trim()).length < 2 && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl shadow-md flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-center flex-1">{t('addMoreOptions')}</span>
            </div>
          )}
          </div>
        ) : null}
      </div>
    </div>
  );
}