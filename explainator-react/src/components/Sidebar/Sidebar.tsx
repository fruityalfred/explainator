/**
 * Sidebar Navigation - Rebuilt to match original Explainator.html
 * Clean structure with collapsible sections
 */

import { useState } from 'react';
import { useLayoutStore } from '../../store/layoutStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useCanvasStore } from '../../store/canvasStore';
import { ExportModal } from '../Modals/ExportModal';
import { ImportModal } from '../Modals/ImportModal';
import { NotesModal } from '../Modals/NotesModal';
import { BatchImportModal } from '../Modals/BatchImportModal';
import { ImageUploadModal } from '../Modals/ImageUploadModal';
import { LineSelectorModal } from '../Modals/LineSelectorModal';
import { SlidesModal } from '../Modals/SlidesModal';
import { ProjectsModal } from '../Modals/ProjectsModal';
import { CANVAS_PRESETS } from '../../constants';
import './Sidebar.css';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showLineSelectorModal, setShowLineSelectorModal] = useState(false);
  const [showBatchImportModal, setShowBatchImportModal] = useState(false);
  const [showSlidesModal, setShowSlidesModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);

  // Section collapse states
  const [contentCollapsed, setContentCollapsed] = useState(false);
  const [stylingCollapsed, setStylingCollapsed] = useState(false);
  const [canvasCollapsed, setCanvasCollapsed] = useState(false);
  const [slidesCollapsed, setSlidesCollapsed] = useState(true);
  const [dataCollapsed, setDataCollapsed] = useState(true);

  const { addColumn, clearLayout } = useLayoutStore();
  const { resetCategories } = useCategoryStore();
  const {
    canvasMode,
    toggleCanvasMode,
    setCanvasSize,
    canvasWidth,
    canvasHeight,
  } = useCanvasStore();

  const handleAddColumn = () => {
    addColumn('New Column');
  };

  const handleClearLayout = () => {
    if (confirm('Clear entire layout? This cannot be undone!')) {
      clearLayout();
    }
  };

  const handleResetCategories = () => {
    if (confirm('Reset all categories to default colors?')) {
      resetCategories();
    }
  };

  const handleCanvasSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [width, height] = e.target.value.split('x').map(Number);
    setCanvasSize(width, height);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)} title="Toggle Sidebar">
          <span className="hamburger">☰</span>
        </button>
        <span className="sidebar-brand">Explainator</span>
        <span className="sidebar-subtitle">Layout Builder</span>
      </div>

      <nav className="sidebar-nav">
        {/* CONTENT SECTION */}
        <div className={`nav-section ${contentCollapsed ? 'collapsed' : ''}`}>
          <div className="nav-section-title" onClick={() => setContentCollapsed(!contentCollapsed)}>
            Content
          </div>
          <button className="nav-item" onClick={handleAddColumn} title="New Column">
            <span className="icon">➕</span>
            <span className="label">New Column</span>
          </button>
          <button className="nav-item" onClick={() => setShowNotesModal(true)} title="Notes Box">
            <span className="icon">📝</span>
            <span className="label">Notizbox</span>
          </button>
          <button className="nav-item" onClick={() => setShowLineSelectorModal(true)} title="Add Line">
            <span className="icon">📏</span>
            <span className="label">Lines</span>
          </button>
          <button className="nav-item" onClick={() => setShowBatchImportModal(true)} title="Batch Import">
            <span className="icon">📋</span>
            <span className="label">Batch Import</span>
          </button>
          <button className="nav-item" onClick={() => setShowImageUploadModal(true)} title="Upload Image">
            <span className="icon">🖼️</span>
            <span className="label">Image Upload</span>
          </button>
        </div>

        {/* STYLING SECTION */}
        <div className={`nav-section ${stylingCollapsed ? 'collapsed' : ''}`}>
          <div className="nav-section-title" onClick={() => setStylingCollapsed(!stylingCollapsed)}>
            Styling
          </div>
          <button className="nav-item" onClick={handleResetCategories} title="Manage Categories">
            <span className="icon">🏷️</span>
            <span className="label">Reset Categories</span>
          </button>
        </div>

        {/* CANVAS SECTION */}
        <div className={`nav-section ${canvasCollapsed ? 'collapsed' : ''}`}>
          <div className="nav-section-title" onClick={() => setCanvasCollapsed(!canvasCollapsed)}>
            Canvas
          </div>
          <button
            className={`nav-item ${canvasMode ? 'is-active' : ''}`}
            onClick={toggleCanvasMode}
            title="Toggle Canvas Mode"
          >
            <span className="icon">🖼️</span>
            <span className="label">Canvas Mode</span>
          </button>
          <div className="nav-item-select">
            <span className="icon">📐</span>
            <select
              title="Canvas Resolution"
              value={`${canvasWidth}x${canvasHeight}`}
              onChange={handleCanvasSizeChange}
            >
              {CANVAS_PRESETS.map((preset) => (
                <option key={preset.id} value={`${preset.width}x${preset.height}`}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SLIDES SECTION */}
        <div className={`nav-section ${slidesCollapsed ? 'collapsed' : ''}`}>
          <div className="nav-section-title" onClick={() => setSlidesCollapsed(!slidesCollapsed)}>
            Slides
          </div>
          <button className="nav-item" onClick={() => setShowSlidesModal(true)} title="Slides Manager">
            <span className="icon">📽️</span>
            <span className="label">Slides Mode</span>
          </button>
        </div>

        {/* DATA SECTION */}
        <div className={`nav-section ${dataCollapsed ? 'collapsed' : ''}`}>
          <div className="nav-section-title" onClick={() => setDataCollapsed(!dataCollapsed)}>
            Data
          </div>
          <button className="nav-item" onClick={() => setShowProjectsModal(true)} title="Save/Load Projects">
            <span className="icon">💾</span>
            <span className="label">Projects</span>
          </button>
          <button className="nav-item" onClick={() => setShowExportModal(true)} title="Export">
            <span className="icon">⬇️</span>
            <span className="label">Export</span>
          </button>
          <button className="nav-item" onClick={() => setShowImportModal(true)} title="Import">
            <span className="icon">⬆️</span>
            <span className="label">Import</span>
          </button>
          <button className="nav-item" onClick={handleClearLayout} title="Clear Layout">
            <span className="icon">🗑️</span>
            <span className="label">Clear All</span>
          </button>
        </div>
      </nav>

      {/* MODALS */}
      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
      <NotesModal isOpen={showNotesModal} onClose={() => setShowNotesModal(false)} />
      <BatchImportModal isOpen={showBatchImportModal} onClose={() => setShowBatchImportModal(false)} />
      <ImageUploadModal isOpen={showImageUploadModal} onClose={() => setShowImageUploadModal(false)} />
      <LineSelectorModal isOpen={showLineSelectorModal} onClose={() => setShowLineSelectorModal(false)} />
      <SlidesModal isOpen={showSlidesModal} onClose={() => setShowSlidesModal(false)} />
      <ProjectsModal isOpen={showProjectsModal} onClose={() => setShowProjectsModal(false)} />
    </aside>
  );
};
