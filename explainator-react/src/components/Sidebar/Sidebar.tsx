/**
 * Sidebar Navigation - EXACT replica of original Explainator.html
 * Complete structure with all 6 sections
 */

import { useState } from 'react';
import { useLayoutStore } from '../../store/layoutStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useCanvasStore } from '../../store/canvasStore';
import { useModalStore } from '../../store/modalStore';
import { CANVAS_PRESETS } from '../../constants';
import './Sidebar.css';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { openModal } = useModalStore();

  // Section collapse states (matching original)
  const [contentCollapsed, setContentCollapsed] = useState(false);
  const [stylingCollapsed, setStylingCollapsed] = useState(false);
  const [canvasCollapsed, setCanvasCollapsed] = useState(false);
  const [slidesCollapsed, setSlidesCollapsed] = useState(true);
  const [dataCollapsed, setDataCollapsed] = useState(true);
  const [systemCollapsed, setSystemCollapsed] = useState(true);

  // Canvas state
  const [showColumns, setShowColumns] = useState(true);
  const [showSections, setShowSections] = useState(true);
  const [zoom, setZoom] = useState(100);

  const { addColumn, clearLayout } = useLayoutStore();
  const { resetCategories } = useCategoryStore();
  const {
    canvasMode,
    toggleCanvasMode,
    setCanvasSize,
    setCustomCanvasSize,
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
    const val = e.target.value;
    if (val.includes('x')) {
      const [width, height] = val.split('x').map(Number);
      setCustomCanvasSize(width, height);
    } else {
      setCanvasSize(val);
    }
  };

  const handleZoomIn = () => setZoom(Math.min(200, zoom + 10));
  const handleZoomOut = () => setZoom(Math.max(50, zoom - 10));
  const handleZoomReset = () => setZoom(100);

  const toggleColumns = () => setShowColumns(!showColumns);
  const toggleSections = () => setShowSections(!showSections);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)} title="Toggle Sidebar">
          <span className="hamburger">☰</span>
        </button>
        <span className="sidebar-brand">Explainator</span>
      </div>

      <nav className="sidebar-nav">
        {/* CONTENT SECTION */}
        <div className={`nav-section ${contentCollapsed ? 'collapsed' : ''}`}>
          <div className="nav-section-title" onClick={() => setContentCollapsed(!contentCollapsed)}>
            Content
          </div>
          <button className="nav-item" onClick={handleAddColumn} title="Neue Spalte">
            <span className="icon">+</span>
            <span className="label">Neue Spalte</span>
          </button>
          <button className="nav-item" onClick={() => openModal('showAddBoxModal')} title="Neue Box">
            <span className="icon">📦</span>
            <span className="label">Neue Box</span>
          </button>
          <button className="nav-item" onClick={() => openModal('showNotesModal')} title="Notizbox hinzufügen">
            <span className="icon">📝</span>
            <span className="label">Notizbox</span>
          </button>
          <button className="nav-item" onClick={() => openModal('showLineSelectorModal')} title="Lines">
            <span className="icon">📏</span>
            <span className="label">Lines</span>
          </button>
          <button className="nav-item" onClick={() => openModal('showBatchImportModal')} title="Batch Import">
            <span className="icon">📋</span>
            <span className="label">Batch Import</span>
          </button>
        </div>

        {/* STYLING SECTION */}
        <div className={`nav-section ${stylingCollapsed ? 'collapsed' : ''}`}>
          <div className="nav-section-title" onClick={() => setStylingCollapsed(!stylingCollapsed)}>
            Styling
          </div>
          <button className="nav-item" onClick={() => openModal('showFormattingModal')} title="Formatting">
            <span className="icon">🎨</span>
            <span className="label">Formatting</span>
          </button>
          <button className="nav-item" onClick={() => openModal('showCategoryModal')} title="Manage Categories">
            <span className="icon">🏷️</span>
            <span className="label">Manage Categories</span>
          </button>
          <button className="nav-item" onClick={handleResetCategories} title="Kategorien zurücksetzen">
            <span className="icon">↺</span>
            <span className="label">Reset Kategorien</span>
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
            title="Canvas Mode"
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
              {Object.entries(CANVAS_PRESETS).map(([key, preset]) => (
                <option key={key} value={`${preset.width}x${preset.height}`}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>
          <button className="nav-item" title="Connections">
            <span className="icon">🔗</span>
            <span className="label">Connections</span>
          </button>
          <button
            className={`nav-item ${showColumns ? 'is-active' : ''}`}
            onClick={toggleColumns}
            title="Column Headers"
          >
            <span className="icon">📊</span>
            <span className="label">Columns: {showColumns ? 'On' : 'Off'}</span>
          </button>
          <button
            className={`nav-item ${showSections ? 'is-active' : ''}`}
            onClick={toggleSections}
            title="Section-Header"
          >
            <span className="icon">📑</span>
            <span className="label">Sections: {showSections ? 'An' : 'Aus'}</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px' }}>
            <button className="btn small-btn" onClick={handleZoomOut} title="Zoom Out (Ctrl -)">-</button>
            <span style={{ minWidth: '50px', textAlign: 'center', fontSize: '12px', color: '#666' }}>{zoom}%</span>
            <button className="btn small-btn" onClick={handleZoomIn} title="Zoom In (Ctrl +)">+</button>
            <button className="btn small-btn" onClick={handleZoomReset} title="Reset Zoom (Ctrl 0)">⟲</button>
          </div>
        </div>

        {/* SLIDES SECTION */}
        <div className={`nav-section ${slidesCollapsed ? 'collapsed' : ''}`}>
          <div className="nav-section-title" onClick={() => setSlidesCollapsed(!slidesCollapsed)}>
            Slides
          </div>
          <button className="nav-item" onClick={() => openModal('showSlidesModal')} title="Slides-Modus aktivieren/deaktivieren">
            <span className="icon">📽️</span>
            <span className="label">Slides Mode</span>
          </button>
          <button className="nav-item" title="Neue Folie erstellen">
            <span className="icon">➕</span>
            <span className="label">Neue Folie</span>
          </button>
          <button className="nav-item" title="Vorherige Folie">
            <span className="icon">⬅️</span>
            <span className="label">Zurück</span>
          </button>
          <button className="nav-item" title="Nächste Folie">
            <span className="icon">➡️</span>
            <span className="label">Weiter</span>
          </button>
          <div style={{ textAlign: 'center', padding: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
            <span>0 / 0</span>
          </div>
          <button className="nav-item" title="Präsentation starten">
            <span className="icon">🎬</span>
            <span className="label">Präsentation</span>
          </button>
          <button className="nav-item" title="Präsentation exportieren">
            <span className="icon">💾</span>
            <span className="label">Exportieren</span>
          </button>
          <button className="nav-item" title="Präsentation importieren">
            <span className="icon">📥</span>
            <span className="label">Importieren</span>
          </button>
        </div>

        {/* DATA SECTION */}
        <div className={`nav-section ${dataCollapsed ? 'collapsed' : ''}`}>
          <div className="nav-section-title" onClick={() => setDataCollapsed(!dataCollapsed)}>
            Data
          </div>
          <button className="nav-item" onClick={() => openModal('showProjectsModal')} title="Template speichern">
            <span className="icon">💾</span>
            <span className="label">Speichern</span>
          </button>
          <button className="nav-item" onClick={() => openModal('showProjectsModal')} title="Template laden">
            <span className="icon">📂</span>
            <span className="label">Laden</span>
          </button>
          <button className="nav-item" onClick={() => openModal('showExportModal')} title="Excel Export">
            <span className="icon">📊</span>
            <span className="label">Excel</span>
          </button>
          <button className="nav-item" onClick={() => openModal('showExportModal')} title="PNG Export">
            <span className="icon">🖼️</span>
            <span className="label">PNG Export</span>
          </button>
          <button className="nav-item" title="Präsentationsmodus">
            <span className="icon">🎭</span>
            <span className="label">Präsentation</span>
          </button>
          <button className="nav-item" onClick={() => openModal('showExportModal')} title="Standalone HTML Export">
            <span className="icon">📦</span>
            <span className="label">HTML Export</span>
          </button>
          <button className="nav-item" onClick={() => openModal('showProjectsModal')} title="Projektverwaltung">
            <span className="icon">📁</span>
            <span className="label">Projekte</span>
          </button>
        </div>

        {/* SYSTEM SECTION */}
        <div className={`nav-section ${systemCollapsed ? 'collapsed' : ''}`}>
          <div className="nav-section-title" onClick={() => setSystemCollapsed(!systemCollapsed)}>
            System
          </div>
          <button className="nav-item" onClick={handleClearLayout} title="Layout zurücksetzen">
            <span className="icon">🔄</span>
            <span className="label">Reset Layout</span>
          </button>
          <button className="nav-item" onClick={handleClearLayout} title="Alles löschen">
            <span className="icon">🗑️</span>
            <span className="label">Alles löschen</span>
          </button>
          <button className="nav-item" title="Hilfe">
            <span className="icon">❓</span>
            <span className="label">Hilfe</span>
          </button>
          <button className="nav-item" title="Sprache wechseln">
            <span className="icon">🌐</span>
            <span className="label">EN</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};
