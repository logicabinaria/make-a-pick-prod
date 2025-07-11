'use client';

import { useTranslation } from '@/components/I18nProvider';
import { CATEGORIES, Category } from '@/config/categories';

interface CategoryGridProps {
  onCategorySelect: (category: Category) => void;
  onBackToWelcome: () => void;
}

export default function CategoryGrid({ onCategorySelect, onBackToWelcome }: CategoryGridProps) {
  const { t } = useTranslation();

  const getCategoryName = (category: Category) => {
    return t(`categories.${category.id}.name`) || category.name;
  };

  const getCategoryDescription = (category: Category) => {
    return t(`categories.${category.id}.description`) || category.description;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{t('categories.title')}</h1>
        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">{t('categories.subtitle')}</p>
      </div>

      {/* Category Grid */}
      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category)}
            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border-2 border-gray-600 hover:border-gray-500 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 w-[calc(50%-0.375rem)] aspect-square"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 text-center flex flex-col justify-center h-full p-3 space-y-1">
              {/* Emoji */}
              <div className="group-hover:scale-110 transition-transform duration-300 text-2xl sm:text-3xl">
                {category.emoji}
              </div>
              
              {/* Category Name */}
              <h3 className="font-bold text-white leading-tight text-sm sm:text-base">
                {getCategoryName(category)}
              </h3>
              
              {/* Description */}
              <p className="text-gray-400 leading-tight text-xs px-1">
                {getCategoryDescription(category)}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Back Button */}
      <div className="text-center pt-4">
        <button
          onClick={onBackToWelcome}
          className="group px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('categories.backToWelcome')}
        </button>
      </div>
    </div>
  );
}