/**
 * Image Upload Modal
 * Upload images to use in boxes
 */

import { useState, useRef } from 'react';
import { useLayoutStore } from '../../store/layoutStore';
import './ExportModal.css';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageUploadModal = ({ isOpen, onClose }: ImageUploadModalProps) => {
  const { columns, addBox } = useLayoutStore();
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
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

  const handleInsert = () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }

    if (!selectedColumn || !selectedSection) {
      alert('Please select a column and section');
      return;
    }

    // Add image box to selected section
    addBox(selectedColumn, selectedSection, {
      text: 'Image',
      type: 'blue',
      isImage: true,
      imageSrc: selectedImage,
      width: 'full-width',
      lines: 1,
    });

    alert('Image added successfully!');
    setSelectedImage(null);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get all sections from all columns
  const allSections: Array<{ columnId: string; columnTitle: string; sectionId: string; sectionTitle: string }> = [];
  columns.forEach((column) => {
    if (!Array.isArray(column.sections[0])) {
      (column.sections as any[]).forEach((section) => {
        allSections.push({
          columnId: column.id,
          columnTitle: column.title,
          sectionId: section.id,
          sectionTitle: section.title,
        });
      });
    }
  });

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content export-modal" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>Upload Image</h2>
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
            style={{ marginBottom: '20px' }}
          >
            <div className="drop-zone-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="drop-zone-title">
                {dragActive ? 'Drop image here' : 'Drag & drop image here'}
              </p>
              <p className="drop-zone-subtitle">or click to browse</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />

          {selectedImage && (
            <div style={{ marginBottom: '20px', text-align: 'center' }}>
              <img
                src={selectedImage}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                }}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="section-select">Insert into Section:</label>
            <select
              id="section-select"
              className="form-input"
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                const section = allSections.find((s) => s.sectionId === e.target.value);
                if (section) {
                  setSelectedColumn(section.columnId);
                }
              }}
            >
              <option value="">Select a section...</option>
              {allSections.map((section) => (
                <option key={section.sectionId} value={section.sectionId}>
                  {section.columnTitle} → {section.sectionTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="import-info">
            <h4>Image Upload Information:</h4>
            <ul>
              <li>Supported formats: JPG, PNG, GIF, SVG, WebP</li>
              <li>Images are stored as base64 in your layout</li>
              <li>Large images may increase export file size</li>
              <li>Images will be scaled to fit box width</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleInsert}
            disabled={!selectedImage || !selectedSection}
          >
            Insert Image
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
          margin-top: 16px;
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
