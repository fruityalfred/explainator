/**
 * Category Store (Zustand)
 * Manages color categories for boxes
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CategoryMap, CategoryData } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

interface CategoryState {
  categories: CategoryMap;

  // Actions
  addCategory: (key: string, category: CategoryData) => void;
  updateCategory: (key: string, updates: Partial<CategoryData>) => void;
  deleteCategory: (key: string) => void;
  resetCategories: () => void;
  loadCategories: (categories: CategoryMap) => void;
  getCategoryGradient: (key: string) => string;
  getCategoryTextColor: (key: string) => string;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,

      /**
       * Add a new category
       */
      addCategory: (key: string, category: CategoryData) => {
        set((state) => ({
          categories: {
            ...state.categories,
            [key]: category,
          },
        }));
      },

      /**
       * Update an existing category
       */
      updateCategory: (key: string, updates: Partial<CategoryData>) => {
        set((state) => ({
          categories: {
            ...state.categories,
            [key]: {
              ...state.categories[key],
              ...updates,
            },
          },
        }));
      },

      /**
       * Delete a category
       */
      deleteCategory: (key: string) => {
        set((state) => {
          const newCategories = { ...state.categories };
          delete newCategories[key];
          return { categories: newCategories };
        });
      },

      /**
       * Reset categories to default
       */
      resetCategories: () => {
        set({ categories: DEFAULT_CATEGORIES });
      },

      /**
       * Load categories from imported data
       */
      loadCategories: (categories: CategoryMap) => {
        set({ categories });
      },

      /**
       * Get CSS gradient for a category
       */
      getCategoryGradient: (key: string): string => {
        const category = get().categories[key];
        if (!category) return 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
        return `linear-gradient(135deg, ${category.color1} 0%, ${category.color2} 100%)`;
      },

      /**
       * Get text color for a category
       */
      getCategoryTextColor: (key: string): string => {
        const category = get().categories[key];
        if (!category) return '#ffffff';
        return category.textColor;
      },
    }),
    {
      name: 'explainator-categories',
    }
  )
);
