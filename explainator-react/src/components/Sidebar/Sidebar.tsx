/**
 * Sidebar Navigation
 * Main navigation menu for the editor
 */

import { useState } from 'react';
import { useLayoutStore } from '../../store/layoutStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useCanvasStore } from '../../store/canvasStore';
import { ExportModal } from '../Modals/ExportModal';
import { ImportModal } from '../Modals/ImportModal';
import { NotesModal } from '../Modals/NotesModal';
import { ImageUploadModal } from '../Modals/ImageUploadModal';
import { LineSelectorModal } from '../Modals/LineSelectorModal';
import { BatchImportModal } from '../Modals/BatchImportModal';
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
  const { addColumn, clearLayout, columns } = useLayoutStore();
  const { resetCategories } = useCategoryStore();
  const {
    canvasMode,
    toggleCanvasMode,
    setCanvasSize,
    showGrid,
    toggleGrid,
    snapToGrid,
    toggleSnapToGrid,
    connectorMode,
    toggleConnectorMode,
    clearConnectors,
  } = useCanvasStore();

  const handleNewColumn = () => {
    addColumn(`Column ${columns.length + 1}`);
  };

  const handleClearAll = () => {
    if (confirm('Clear entire layout? This cannot be undone.')) {
      clearLayout();
    }
  };

  const handleResetCategories = () => {
    if (confirm('Reset categories to default?')) {
      resetCategories();
    }
  };

  const handleClearConnectors = () => {
    if (confirm('Clear all connectors?')) {
      clearConnectors();
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? '▶' : '◀'}
      </button>

      {!isCollapsed && (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2>Explainator</h2>
            <p className="sidebar-subtitle">Layout Builder</p>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Content</h3>
            <button className="sidebar-btn btn-primary" onClick={handleNewColumn}>
              <span className="btn-icon">+</span>
              New Column
            </button>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Canvas</h3>
            <button
              className={`sidebar-btn ${canvasMode ? 'btn-success' : 'btn-secondary'}`}
              onClick={toggleCanvasMode}
            >
              <span className="btn-icon">{canvasMode ? '✓' : '○'}</span>
              Canvas Mode
            </button>
            {canvasMode && (
              <>
                <select
                  className="sidebar-select"
                  onChange={(e) => setCanvasSize(e.target.value)}
                  defaultValue="full-hd"
                >
                  {Object.entries(CANVAS_PRESETS).map(([key, preset]) => (
                    <option key={key} value={key}>
                      {preset.name}
                    </option>
                  ))}
                </select>
                <button
                  className={`sidebar-btn btn-small ${showGrid ? 'btn-success' : 'btn-secondary'}`}
                  onClick={toggleGrid}
                >
                  <span className="btn-icon">{showGrid ? '✓' : '○'}</span>
                  Grid
                </button>
                <button
                  className={`sidebar-btn btn-small ${snapToGrid ? 'btn-success' : 'btn-secondary'}`}
                  onClick={toggleSnapToGrid}
                >
                  <span className="btn-icon">{snapToGrid ? '✓' : '○'}</span>
                  Snap
                </button>
                <button
                  className={`sidebar-btn ${connectorMode ? 'btn-success' : 'btn-secondary'}`}
                  onClick={toggleConnectorMode}
                >
                  <span className="btn-icon">{connectorMode ? '✓' : '○'}</span>
                  Connectors
                </button>
                <button className="sidebar-btn btn-warning btn-small" onClick={handleClearConnectors}>
                  <span className="btn-icon">🗑️</span>
                  Clear Connectors
                </button>
              </>
            )}
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Tools</h3>
            <button className="sidebar-btn btn-secondary" onClick={() => setShowNotesModal(true)}>
              <span className="btn-icon">📝</span>
              Notes
            </button>
            <button className="sidebar-btn btn-secondary" onClick={() => setShowBatchImportModal(true)}>
              <span className="btn-icon">📋</span>
              Batch Import
            </button>
            <button className="sidebar-btn btn-secondary" onClick={() => setShowImageUploadModal(true)}>
              <span className="btn-icon">🖼️</span>
              Upload Image
            </button>
            <button className="sidebar-btn btn-secondary" onClick={() => setShowLineSelectorModal(true)}>
              <span className="btn-icon">➖</span>
              Insert Line
            </button>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Projects</h3>
            <button className="sidebar-btn btn-primary" onClick={() => setShowProjectsModal(true)}>
              <span className="btn-icon">💼</span>
              Projects
            </button>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Presentation</h3>
            <button className="sidebar-btn btn-primary" onClick={() => setShowSlidesModal(true)}>
              <span className="btn-icon">🎬</span>
              Slides
            </button>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Styling</h3>
            <button className="sidebar-btn btn-secondary" onClick={handleResetCategories}>
              <span className="btn-icon">🎨</span>
              Reset Colors
            </button>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Import / Export</h3>
            <button className="sidebar-btn btn-primary" onClick={() => setShowExportModal(true)}>
              <span className="btn-icon">⬇️</span>
              Export
            </button>
            <button className="sidebar-btn btn-secondary" onClick={() => setShowImportModal(true)}>
              <span className="btn-icon">⬆️</span>
              Import
            </button>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">System</h3>
            <button className="sidebar-btn btn-warning" onClick={handleClearAll}>
              <span className="btn-icon">🗑️</span>
              Clear Layout
            </button>
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-stats">
              <div className="stat">
                <span className="stat-value">{columns.length}</span>
                <span className="stat-label">Columns</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {columns.reduce(
                    (sum, col) =>
                      sum +
                      (Array.isArray(col.sections[0])
                        ? 0
                        : (col.sections as any[]).length),
                    0
                  )}
                </span>
                <span className="stat-label">Sections</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
      <NotesModal isOpen={showNotesModal} onClose={() => setShowNotesModal(false)} />
      <BatchImportModal isOpen={showBatchImportModal} onClose={() => setShowBatchImportModal(false)} />
      <ImageUploadModal isOpen={showImageUploadModal} onClose={() => setShowImageUploadModal(false)} />
      <LineSelectorModal isOpen={showLineSelectorModal} onClose={() => setShowLineSelectorModal(false)} />
      <SlidesModal isOpen={showSlidesModal} onClose={() => setShowSlidesModal(false)} />
      <ProjectsModal isOpen={showProjectsModal} onClose={() => setShowProjectsModal(false)} />
    </div>
  );
};
