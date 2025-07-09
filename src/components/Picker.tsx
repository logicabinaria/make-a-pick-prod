'use client';

import { useState, useCallback } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import confetti from 'canvas-confetti';
import { pickRandomOption, type PickResult } from '@/utils/clientPicker';
import { pickRateLimiter } from '@/utils/rateLimiter';
import { performanceMonitor, preloadCriticalResources } from '@/utils/performance';
import { withErrorHandling, safeNetworkRequest, errorHandler } from '@/utils/errorHandler';

export default function Picker() {
  const { t } = useTranslation();
  const [options, setOptions] = useState<string[]>(['']);
  const [result, setResult] = useState<string | null>(null);
  const [previousPick, setPreviousPick] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useServerFallback] = useState(false);

  // Preload resources for better performance
  useState(() => {
    preloadCriticalResources();
  });

  const addOption = () => {
    setOptions([...options, '']);
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

    const pickOperation = async (): Promise<PickResult> => {
      // Check rate limit and performance metrics for optimal picking method
      const rateLimitResult = pickRateLimiter.checkLimit();
      const shouldUseClientSide = !useServerFallback && rateLimitResult.allowed && performanceMonitor.shouldPreferClientSide();
      
      if (shouldUseClientSide) {
        // Use client-side picker with performance monitoring
        const clientPickOperation = () => pickRandomOption({
           options: validOptions,
           excludePrevious: validOptions.length > 2,
           previousPick: previousPick || undefined
         });
        
        const { result: clientResult } = await performanceMonitor.measurePickLatency(clientPickOperation);
        return clientResult;
      } else {
        // Use server API with network safety and retry logic
        const serverOperation = async () => {
          const response = await fetch('/api/pick', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ options: validOptions }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to make a pick');
          }

          return {
            pick: data.pick,
            index: validOptions.indexOf(data.pick),
            timestamp: Date.now()
          };
        };
        
        return await safeNetworkRequest(
          () => performanceMonitor.measurePickLatency(serverOperation).then(result => result.result),
          { component: 'Picker', action: 'api_pick', timestamp: Date.now() },
          2 // max retries
        );
      }
    };

    try {
      const pickResult = await withErrorHandling(
        pickOperation,
        { component: 'Picker', action: 'make_pick', timestamp: Date.now() },
        // Fallback to client-side picking if everything fails
        () => pickRandomOption({
          options: validOptions,
          excludePrevious: false
        })
      );

      setResult(pickResult.pick);
      setPreviousPick(pickResult.pick);
      
      // Trigger confetti animation with error handling
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4CAF50', '#FF9800', '#2196F3', '#FF5722']
        });
      } catch {
        // Confetti failure shouldn't break the app
      }
      
    } catch (err) {
      // Handle the error gracefully
      const appError = errorHandler.handleError(
        err as Error,
        { component: 'Picker', action: 'make_pick', timestamp: Date.now() },
        'medium'
      );
      
      setError(appError.message);
    } finally {
      setIsLoading(false);
    }
  }, [options, t, previousPick, useServerFallback]);

  const tryAgain = useCallback(() => {
    setResult(null);
    setError(null);
    // Keep the same options and previous pick for better UX
  }, []);

  const newDecision = useCallback(() => {
    setOptions(['', '']);
    setResult(null);
    setError(null);
    setPreviousPick(null);
  }, []);

  const resetPicker = useCallback(() => {
    setOptions(['']);
    setResult(null);
    setError(null);
    setPreviousPick(null);
  }, []);
  


  if (result) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
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
          <button
            onClick={resetPicker}
            className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {!result ? (
        <div className="space-y-4">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={t('enterOption')}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
              {options.length > 1 && (
                <button
                  onClick={() => removeOption(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 min-w-[48px] min-h-[48px]"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          <button
            onClick={addOption}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
          >
            + {t('addOption')}
          </button>
          
          <button
            onClick={makeAPick}
            disabled={isLoading || options.filter(opt => opt.trim()).length < 2}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold text-lg min-h-[56px]"
          >
            {isLoading ? 'Picking...' : `🎯 ${t('makeAPick')}`}
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
      ) : (
        <div className="text-center space-y-6">
          <div className="p-6 bg-gradient-to-r from-green-100 to-orange-100 dark:from-green-900 dark:to-orange-900 border-2 border-green-400 dark:border-green-600 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-200">🎉 {t('result')}</h3>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">{result}!</p>
            <p className="text-lg text-green-700 dark:text-green-300">{t('yourPick')}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={tryAgain}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold min-h-[48px]"
            >
              🔄 {t('tryAgain')}
            </button>
            
            <button
              onClick={newDecision}
              className="w-full px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold min-h-[48px]"
            >
              ✨ {t('newDecision')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}