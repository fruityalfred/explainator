/**
 * ModalManager - Renders all modals at root level
 * This ensures modals appear as full-screen overlays, not inside the sidebar
 */

import { useModalStore } from '../store/modalStore';
import { AddBoxModal } from './Modals/AddBoxModal';
import { ExportModal } from './Modals/ExportModal';
import { ImportModal } from './Modals/ImportModal';
import { NotesModal } from './Modals/NotesModal';
import { BatchImportModal } from './Modals/BatchImportModal';
import { ImageUploadModal } from './Modals/ImageUploadModal';
import { LineSelectorModal } from './Modals/LineSelectorModal';
import { SlidesModal } from './Modals/SlidesModal';
import { ProjectsModal } from './Modals/ProjectsModal';
import { FormattingModal } from './Modals/FormattingModal';
import { CategoryModal } from './Modals/CategoryModal';

export const ModalManager = () => {
  const {
    showAddBoxModal,
    showExportModal,
    showImportModal,
    showNotesModal,
    showBatchImportModal,
    showImageUploadModal,
    showLineSelectorModal,
    showSlidesModal,
    showProjectsModal,
    showFormattingModal,
    showCategoryModal,
    closeModal,
  } = useModalStore();

  return (
    <>
      <AddBoxModal isOpen={showAddBoxModal} onClose={() => closeModal('showAddBoxModal')} />
      <ExportModal isOpen={showExportModal} onClose={() => closeModal('showExportModal')} />
      <ImportModal isOpen={showImportModal} onClose={() => closeModal('showImportModal')} />
      <NotesModal isOpen={showNotesModal} onClose={() => closeModal('showNotesModal')} />
      <BatchImportModal isOpen={showBatchImportModal} onClose={() => closeModal('showBatchImportModal')} />
      <ImageUploadModal isOpen={showImageUploadModal} onClose={() => closeModal('showImageUploadModal')} />
      <LineSelectorModal isOpen={showLineSelectorModal} onClose={() => closeModal('showLineSelectorModal')} />
      <SlidesModal isOpen={showSlidesModal} onClose={() => closeModal('showSlidesModal')} />
      <ProjectsModal isOpen={showProjectsModal} onClose={() => closeModal('showProjectsModal')} />
      <FormattingModal isOpen={showFormattingModal} onClose={() => closeModal('showFormattingModal')} />
      <CategoryModal isOpen={showCategoryModal} onClose={() => closeModal('showCategoryModal')} />
    </>
  );
};
