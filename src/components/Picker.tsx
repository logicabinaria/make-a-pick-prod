'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import confetti from 'canvas-confetti';
import { pickRandomOption } from '@/utils/clientPicker';
import { useMobile } from '@/hooks/useMobile';

const getInspiringQuotes = (t: (key: string) => string) => [
  t('inspiringQuotes.quote1'),
  t('inspiringQuotes.quote2'),
  t('inspiringQuotes.quote3'),
  t('inspiringQuotes.quote4'),
  t('inspiringQuotes.quote5'),
  t('inspiringQuotes.quote6'),
  t('inspiringQuotes.quote7'),
  t('inspiringQuotes.quote8'),
  t('inspiringQuotes.quote9'),
  t('inspiringQuotes.quote10')
];

export default function Picker() {
  const { t } = useTranslation();
  const mobile = useMobile();
  const [options, setOptions] = useState<string[]>(['']);
  const [result, setResult] = useState<string | null>(null);
  const [previousPick, setPreviousPick] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inspiringText, setInspiringText] = useState<string>('');
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
      
      // Set a random inspiring quote
      const quotes = getInspiringQuotes(t);
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setInspiringText(randomQuote);
      
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
    setInspiringText('');
    // Keep the same options and previous pick for better UX
  }, []);

  const newDecision = useCallback(() => {
    setOptions(['', '']);
    setResult(null);
    setError(null);
    setPreviousPick(null);
    setInspiringText('');
  }, []);


  


  if (result) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center relative overflow-hidden">
          {/* Neon border animation */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-75 blur-sm animate-pulse"></div>
          <div className="absolute inset-[2px] rounded-lg bg-white dark:bg-gray-800"></div>
          
          <div className="relative z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('result')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('yourPick')}
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              {result}
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={tryAgain}
              className="w-full py-4 px-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg font-medium transition-all duration-150 min-h-[56px] touch-manipulation tap-highlight-none shadow-md text-base"
            >
              🔄 {t('tryAgain')}
            </button>
            <button
              onClick={newDecision}
              className="w-full py-4 px-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-lg font-medium transition-all duration-150 min-h-[56px] touch-manipulation tap-highlight-none shadow-md text-base"
            >
              ✨ {t('newDecision')}
            </button>
          </div>
          </div>
        </div>
        
        {/* Inspiring Text - Only shown after making a decision */}
        {inspiringText && (
          <div className="bg-gradient-to-r from-green-50 to-orange-50 dark:from-green-900/20 dark:to-orange-900/20 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-200 font-medium">
              {inspiringText}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg relative overflow-hidden">
      {/* Neon border animation */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-sm animate-pulse"></div>
      <div className="absolute inset-[2px] rounded-lg bg-white dark:bg-gray-800"></div>
      
      <div className="relative z-10">
        {!result ? (
          <div className="space-y-4">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                placeholder={t('enterOption')}
                className="flex-1 px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white touch-manipulation tap-highlight-none min-h-[48px]"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />
              {options.length > 1 && (
                <button
                  onClick={() => removeOption(index)}
                  className="px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 min-w-[48px] min-h-[48px] touch-manipulation tap-highlight-none transition-all duration-150 text-lg font-bold"
                  aria-label={t('removeOption')}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          <button
            onClick={addOption}
            className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[52px] touch-manipulation tap-highlight-none transition-all duration-150 font-medium text-base"
          >
            + {t('addOption')}
          </button>
          
          <button
            onClick={makeAPick}
            disabled={isLoading || options.filter(opt => opt.trim()).length < 2}
            className="w-full px-4 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold text-lg min-h-[60px] touch-manipulation tap-highlight-none transition-all duration-150 shadow-lg"
          >
            {isLoading ? t('picking') : `🎯 ${t('makeAPick')}`}
          </button>
          
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md">
              {error}
            </div>
          )}
          
          {options.filter(opt => opt.trim()).length < 2 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {t('addMoreOptions')}
            </p>
          )}
          </div>
        ) : null}
      </div>
    </div>
  );
}