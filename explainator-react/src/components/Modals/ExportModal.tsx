/**
 * Export Modal
 * UI for exporting layouts in different formats
 */

import { useState } from 'react';
import { useLayoutStore } from '../../store/layoutStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useCanvasStore } from '../../store/canvasStore';
import { exportToPNG, exportToExcel, exportToHTML, exportToJSON } from '../../utils/exportService';
import './ExportModal.css';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal = ({ isOpen, onClose }: ExportModalProps) => {
  const { columns } = useLayoutStore();
  const { categories } = useCategoryStore();
  const canvasStore = useCanvasStore();
  const [filename, setFilename] = useState('explainator-export');
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'excel' | 'html' | 'json'>('png');

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!filename.trim()) {
      alert('Please enter a filename');
      return;
    }

    setExporting(true);

    try {
      switch (exportFormat) {
        case 'png':
          await exportToPNG('main-container', `${filename}.png`);
          break;
        case 'excel':
          exportToExcel(columns, `${filename}.xlsx`);
          break;
        case 'html':
          exportToHTML(columns, `${filename}.html`);
          break;
        case 'json':
          exportToJSON(
            columns,
            categories,
            {
              canvasMode: canvasStore.canvasMode,
              canvasWidth: canvasStore.canvasWidth,
              canvasHeight: canvasStore.canvasHeight,
              showGrid: canvasStore.showGrid,
              snapToGrid: canvasStore.snapToGrid,
              gridSize: canvasStore.gridSize,
              connectors: canvasStore.connectors,
            },
            `${filename}.json`
          );
          break;
      }

      setTimeout(() => {
        setExporting(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setExporting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content export-modal">
        <div className="modal-header">
          <h2>Export Layout</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="filename">Filename:</label>
            <input
              type="text"
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename (without extension)"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Export Format:</label>
            <div className="export-format-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="format"
                  value="png"
                  checked={exportFormat === 'png'}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                />
                <div className="radio-label">
                  <strong>PNG Image</strong>
                  <span className="radio-description">Export as high-quality image</span>
                </div>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="format"
                  value="excel"
                  checked={exportFormat === 'excel'}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                />
                <div className="radio-label">
                  <strong>Excel Spreadsheet</strong>
                  <span className="radio-description">Export as .xlsx file with multiple sheets</span>
                </div>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="format"
                  value="html"
                  checked={exportFormat === 'html'}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                />
                <div className="radio-label">
                  <strong>HTML Page</strong>
                  <span className="radio-description">Export as standalone HTML file</span>
                </div>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                />
                <div className="radio-label">
                  <strong>JSON Data</strong>
                  <span className="radio-description">Export all data for re-importing</span>
                </div>
              </label>
            </div>
          </div>

          <div className="export-info">
            {exportFormat === 'png' && (
              <p>The current layout will be captured as a high-resolution PNG image.</p>
            )}
            {exportFormat === 'excel' && (
              <p>
                All columns and boxes will be exported to Excel with a main overview sheet and individual
                sheets per column.
              </p>
            )}
            {exportFormat === 'html' && (
              <p>The layout will be exported as a standalone HTML file that can be opened in any browser.</p>
            )}
            {exportFormat === 'json' && (
              <p>
                Complete data export including columns, categories, and canvas settings. Use this to backup or
                share your layout.
              </p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={exporting}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
};
