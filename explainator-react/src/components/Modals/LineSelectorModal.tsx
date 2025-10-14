/**
 * Line Selector Modal
 * Select and insert divider lines into sections
 */

import { useState } from 'react';
import { useLayoutStore } from '../../store/layoutStore';
import './ExportModal.css';

interface LineSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LINE_STYLES = [
  { id: 'solid', name: 'Solid Line', preview: '────────────────────' },
  { id: 'dashed', name: 'Dashed Line', preview: '─ ─ ─ ─ ─ ─ ─ ─ ─ ─' },
  { id: 'dotted', name: 'Dotted Line', preview: '· · · · · · · · · · · ·' },
  { id: 'double', name: 'Double Line', preview: '════════════════════' },
  { id: 'thick', name: 'Thick Line', preview: '━━━━━━━━━━━━━━━━━━━━' },
  { id: 'wave', name: 'Wave Line', preview: '～～～～～～～～～～' },
  { id: 'zigzag', name: 'Zigzag Line', preview: '＾＾＾＾＾＾＾＾＾＾' },
];

export const LineSelectorModal = ({ isOpen, onClose }: LineSelectorModalProps) => {
  const { columns, addBox } = useLayoutStore();
  const [selectedLine, setSelectedLine] = useState('solid');
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');

  if (!isOpen) return null;

  const handleInsert = () => {
    if (!selectedColumn || !selectedSection) {
      alert('Please select a column and section');
      return;
    }

    // Add line box to selected section
    addBox(selectedColumn, selectedSection, {
      text: '',
      type: 'gray',
      isLine: true,
      lineClass: selectedLine,
      width: 'full-width',
      lines: 1,
    });

    alert('Line inserted successfully!');
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
      <div className="modal-content export-modal" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>Insert Divider Line</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Line Style:</label>
            <div className="line-styles-grid">
              {LINE_STYLES.map((style) => (
                <div
                  key={style.id}
                  className={`line-style-option ${selectedLine === style.id ? 'selected' : ''}`}
                  onClick={() => setSelectedLine(style.id)}
                >
                  <div className="line-style-name">{style.name}</div>
                  <div className="line-style-preview">{style.preview}</div>
                </div>
              ))}
            </div>
          </div>

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

          <div className="export-info">
            <p>
              Divider lines help separate content within sections. They are purely visual and do not contain text.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleInsert}
            disabled={!selectedSection}
          >
            Insert Line
          </button>
        </div>
      </div>

      <style>{`
        .line-styles-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          margin-top: 12px;
        }

        .line-style-option {
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .line-style-option:hover {
          border-color: #4A90E2;
          background: #f8fbff;
        }

        .line-style-option.selected {
          border-color: #4A90E2;
          background: #e3f2fd;
          box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
        }

        .line-style-name {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .line-style-preview {
          font-size: 16px;
          color: #666;
          font-family: monospace;
          letter-spacing: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};
