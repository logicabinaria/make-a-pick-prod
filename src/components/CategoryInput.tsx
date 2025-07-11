'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import { Category } from '@/config/categories';
import { pickRandomOption } from '@/utils/clientPicker';
import { useMobile } from '@/hooks/useMobile';
import confetti from 'canvas-confetti';

interface CategoryInputProps {
  category: Category;
  onResult: (result: string, options: string[]) => void;
  onBackToCategories: () => void;
}

export default function CategoryInput({ category, onResult, onBackToCategories }: CategoryInputProps) {
  const { t } = useTranslation();
  const mobile = useMobile();
  const [options, setOptions] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getCategoryName = (cat: Category) => {
    return t(`categories.${cat.id}.name`) || cat.name;
  };

  const getCategoryPlaceholder = (cat: Category) => {
    return t(`categories.${cat.id}.placeholder`) || cat.placeholder;
  };

  const getCategorySuggestions = (cat: Category) => {
    return cat.suggestions.map(suggestion => 
      t(`categories.${cat.id}.suggestions.${suggestion.toLowerCase().replace(/\s+/g, '')}`) || suggestion
    );
  };

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

  const addSuggestion = (suggestion: string) => {
    if (!options.includes(suggestion)) {
      const newOptions = [...options];
      const emptyIndex = newOptions.findIndex(opt => opt.trim() === '');
      if (emptyIndex !== -1) {
        newOptions[emptyIndex] = suggestion;
      } else {
        newOptions.push(suggestion);
      }
      setOptions(newOptions);
    }
  };

  const makeAPick = useCallback(async () => {
    const validOptions = options.filter(option => option.trim().length > 0);
    
    if (validOptions.length < 2) {
      setError(t('errors.noOptions'));
      return;
    }

    setIsLoading(true);
    setError(null);

    const pickResult = pickRandomOption({
      options: validOptions,
      excludePrevious: false
    });

    try {
      // Trigger confetti animation
      const particleCount = mobile.isMobile ? 50 : 100;
      const spread = mobile.isMobile ? 50 : 70;
      
      confetti({
        particleCount,
        spread,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#FF9800', '#2196F3', '#FF5722']
      });
      
      onResult(pickResult.pick, validOptions);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.pickFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [options, t, mobile.isMobile, onResult]);

  const suggestions = getCategorySuggestions(category);

  return (
    <div className="max-w-md mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        {/* Category Header */}
        <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 text-white p-6 rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
          <div className="relative z-10 space-y-2">
            <div className="text-4xl">{category.emoji}</div>
            <h1 className="text-xl font-bold">{getCategoryName(category)}</h1>
            <p className="text-sm opacity-90">{t(`categories.${category.id}.description`) || category.description}</p>
          </div>
        </div>
      </div>

      {/* Options Input */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">{t('categories.input.addOptions')}</h2>
        
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
                placeholder={getCategoryPlaceholder(category)}
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
        </div>
      </div>

      {/* Quick Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-300">{t('categories.input.quickSuggestions')}</h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => addSuggestion(suggestion)}
                disabled={options.includes(suggestion)}
                className="px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
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
              {t('categories.input.decideButton')}
            </>
          )}
        </button>

        <button
          onClick={onBackToCategories}
          className="group w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('categories.input.backButton')}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl shadow-md flex items-center gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Hint Message */}
      {options.filter(opt => opt.trim()).length < 2 && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl shadow-md flex items-center gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium text-center flex-1">{t('categories.input.minOptionsHint')}</span>
        </div>
      )}
    </div>
  );
}