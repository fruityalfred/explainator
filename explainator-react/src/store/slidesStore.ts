/**
 * Slides Store
 * Manages presentation slides state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Slide {
  id: string;
  name: string;
  layoutSnapshot: string; // JSON string of layout state
  thumbnail?: string; // base64 image thumbnail (optional)
  order: number;
}

interface SlidesState {
  slides: Slide[];
  currentSlideId: string | null;
  presentationMode: boolean;

  // Slide management
  addSlide: (name: string, layoutSnapshot: string) => void;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
  deleteSlide: (id: string) => void;
  reorderSlides: (newOrder: Slide[]) => void;
  loadSlide: (id: string) => Slide | undefined;
  setCurrentSlide: (id: string | null) => void;

  // Presentation mode
  togglePresentationMode: () => void;
  nextSlide: () => void;
  previousSlide: () => void;
  goToSlide: (id: string) => void;

  // Clear all
  clearSlides: () => void;
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `slide_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const useSlidesStore = create<SlidesState>()(
  persist(
    (set, get) => ({
      slides: [],
      currentSlideId: null,
      presentationMode: false,

      addSlide: (name, layoutSnapshot) => {
        const newSlide: Slide = {
          id: generateId(),
          name,
          layoutSnapshot,
          order: get().slides.length,
        };
        set((state) => ({
          slides: [...state.slides, newSlide],
        }));
      },

      updateSlide: (id, updates) => {
        set((state) => ({
          slides: state.slides.map((slide) =>
            slide.id === id ? { ...slide, ...updates } : slide
          ),
        }));
      },

      deleteSlide: (id) => {
        set((state) => {
          const newSlides = state.slides.filter((slide) => slide.id !== id);
          // Reorder after deletion
          const reordered = newSlides.map((slide, idx) => ({ ...slide, order: idx }));
          return {
            slides: reordered,
            currentSlideId: state.currentSlideId === id ? null : state.currentSlideId,
          };
        });
      },

      reorderSlides: (newOrder) => {
        const reordered = newOrder.map((slide, idx) => ({ ...slide, order: idx }));
        set({ slides: reordered });
      },

      loadSlide: (id) => {
        return get().slides.find((slide) => slide.id === id);
      },

      setCurrentSlide: (id) => {
        set({ currentSlideId: id });
      },

      togglePresentationMode: () => {
        set((state) => ({
          presentationMode: !state.presentationMode,
        }));
      },

      nextSlide: () => {
        const { slides, currentSlideId } = get();
        const sortedSlides = [...slides].sort((a, b) => a.order - b.order);
        const currentIndex = sortedSlides.findIndex((s) => s.id === currentSlideId);

        if (currentIndex < sortedSlides.length - 1) {
          set({ currentSlideId: sortedSlides[currentIndex + 1].id });
        }
      },

      previousSlide: () => {
        const { slides, currentSlideId } = get();
        const sortedSlides = [...slides].sort((a, b) => a.order - b.order);
        const currentIndex = sortedSlides.findIndex((s) => s.id === currentSlideId);

        if (currentIndex > 0) {
          set({ currentSlideId: sortedSlides[currentIndex - 1].id });
        }
      },

      goToSlide: (id) => {
        set({ currentSlideId: id });
      },

      clearSlides: () => {
        set({
          slides: [],
          currentSlideId: null,
          presentationMode: false,
        });
      },
    }),
    {
      name: 'explainator-slides-storage',
    }
  )
);
