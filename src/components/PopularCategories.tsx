'use client';

import { useTranslation } from '@/components/I18nProvider';
import { Category, CATEGORIES } from '@/config/categories';

interface PopularCategoriesProps {
  onCategorySelect: (category: Category) => void;
  onShowAllCategories?: () => void;
}

// Define popular categories (first 6 most commonly used)
const POPULAR_CATEGORIES = CATEGORIES.slice(0, 4);

export default function PopularCategories({ onCategorySelect, onShowAllCategories }: PopularCategoriesProps) {
  const { t } = useTranslation();

  const getCategoryName = (category: Category) => {
    return t(`categories.${category.id}.name`) || category.name;
  };

  const getCategoryDescription = (category: Category) => {
    return t(`categories.${category.id}.description`) || category.description;
  };

  const handleShowAll = () => {
    if (onShowAllCategories) {
      onShowAllCategories();
    }
  };

  const categoriesToShow = POPULAR_CATEGORIES;

  return (
    <div className="space-y-6">
      {/* Quick Start Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-white">
          {t('categories.quickStart') || '🚀 Quick Start'}
        </h2>
        <p className="text-sm text-gray-300">
          {t('categories.quickStartSubtitle') || 'Popular decision categories'}
        </p>
      </div>

      {/* Categories Grid */}
      <div className="flex flex-wrap justify-center gap-3">
        {categoriesToShow.map((category) => (
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

      {/* Show All Categories Button */}
      <div className="text-center">
        <button
          onClick={handleShowAll}
          className="group px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {t('categories.seeAllCategories') || 'See All Categories'}
        </button>
      </div>
    </div>
  );
}