/**
 * Modal Store - Global state for modal visibility
 * Allows modals to be rendered at root level while being controlled from anywhere
 */

import { create } from 'zustand';

interface ModalState {
  // Modal visibility states
  showAddBoxModal: boolean;
  showExportModal: boolean;
  showImportModal: boolean;
  showNotesModal: boolean;
  showBatchImportModal: boolean;
  showImageUploadModal: boolean;
  showLineSelectorModal: boolean;
  showSlidesModal: boolean;
  showProjectsModal: boolean;
  showFormattingModal: boolean;
  showCategoryModal: boolean;

  // Actions to open/close modals
  openModal: (modalName: keyof Omit<ModalState, 'openModal' | 'closeModal' | 'closeAllModals'>) => void;
  closeModal: (modalName: keyof Omit<ModalState, 'openModal' | 'closeModal' | 'closeAllModals'>) => void;
  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  // Initial state - all modals closed
  showAddBoxModal: false,
  showExportModal: false,
  showImportModal: false,
  showNotesModal: false,
  showBatchImportModal: false,
  showImageUploadModal: false,
  showLineSelectorModal: false,
  showSlidesModal: false,
  showProjectsModal: false,
  showFormattingModal: false,
  showCategoryModal: false,

  // Open a specific modal
  openModal: (modalName) => set({ [modalName]: true }),

  // Close a specific modal
  closeModal: (modalName) => set({ [modalName]: false }),

  // Close all modals
  closeAllModals: () =>
    set({
      showAddBoxModal: false,
      showExportModal: false,
      showImportModal: false,
      showNotesModal: false,
      showBatchImportModal: false,
      showImageUploadModal: false,
      showLineSelectorModal: false,
      showSlidesModal: false,
      showProjectsModal: false,
      showFormattingModal: false,
      showCategoryModal: false,
    }),
}));
