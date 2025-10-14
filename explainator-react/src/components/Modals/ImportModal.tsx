/**
 * Import Modal
 * UI for importing layouts from JSON
 */

import { useState, useRef } from 'react';
import { useLayoutStore } from '../../store/layoutStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useCanvasStore } from '../../store/canvasStore';
import { importFromJSON } from '../../utils/exportService';
import './ExportModal.css';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportModal = ({ isOpen, onClose }: ImportModalProps) => {
  const { loadLayout } = useLayoutStore();
  const { loadCategories } = useCategoryStore();
  const canvasStore = useCanvasStore();
  const [importing, setImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      alert('Please select a JSON file');
      return;
    }

    setImporting(true);

    try {
      const data = await importFromJSON(file);

      // Validate data
      if (!data.columns || !Array.isArray(data.columns)) {
        throw new Error('Invalid JSON structure');
      }

      // Load data into stores
      loadLayout(data.columns);

      if (data.categories) {
        loadCategories(data.categories);
      }

      if (data.canvas) {
        // Load canvas config
        if (data.canvas.canvasMode !== undefined) {
          canvasStore.toggleCanvasMode();
        }
        if (data.canvas.canvasWidth && data.canvas.canvasHeight) {
          canvasStore.setCustomCanvasSize(data.canvas.canvasWidth, data.canvas.canvasHeight);
        }
        if (data.canvas.showGrid !== undefined && data.canvas.showGrid !== canvasStore.showGrid) {
          canvasStore.toggleGrid();
        }
        if (data.canvas.snapToGrid !== undefined && data.canvas.snapToGrid !== canvasStore.snapToGrid) {
          canvasStore.toggleSnapToGrid();
        }
      }

      alert('Layout imported successfully!');
      onClose();
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please check the file format.');
    } finally {
      setImporting(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
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
          <h2>Import Layout</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div
            className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="drop-zone-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="drop-zone-title">
                {dragActive ? 'Drop file here' : 'Drag & drop JSON file here'}
              </p>
              <p className="drop-zone-subtitle">or click to browse</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />

          <div className="import-info">
            <h4>Import Information:</h4>
            <ul>
              <li>Only JSON files exported from Explainator are supported</li>
              <li>This will replace your current layout</li>
              <li>Categories and canvas settings will also be imported</li>
              <li>Make sure to export your current work before importing</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={importing}>
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        .drop-zone {
          border: 2px dashed #ddd;
          border-radius: 12px;
          padding: 60px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          background: #fafafa;
        }

        .drop-zone:hover {
          border-color: #4A90E2;
          background: #f8fbff;
        }

        .drop-zone.drag-active {
          border-color: #4A90E2;
          background: #e3f2fd;
          transform: scale(1.02);
        }

        .drop-zone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .drop-zone-content svg {
          color: #4A90E2;
        }

        .drop-zone-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .drop-zone-subtitle {
          margin: 0;
          font-size: 14px;
          color: #666;
        }

        .import-info {
          margin-top: 24px;
          padding: 16px;
          background: #fff9e6;
          border-radius: 8px;
          border-left: 4px solid #F5A623;
        }

        .import-info h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #333;
        }

        .import-info ul {
          margin: 0;
          padding-left: 20px;
        }

        .import-info li {
          font-size: 13px;
          color: #555;
          line-height: 1.6;
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
};
