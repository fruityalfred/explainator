/**
 * Batch Import Modal
 * Import multiple boxes from CSV/TSV data
 */

import { useState } from 'react';
import { useLayoutStore } from '../../store/layoutStore';
import { useCategoryStore } from '../../store/categoryStore';
import './ExportModal.css';

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatchImportModal = ({ isOpen, onClose }: BatchImportModalProps) => {
  const { columns, addBox } = useLayoutStore();
  const { categories } = useCategoryStore();
  const [batchData, setBatchData] = useState('');
  const [delimiter, setDelimiter] = useState<'tab' | 'comma' | 'semicolon'>('tab');
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [defaultCategory, setDefaultCategory] = useState<string>('blue');

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const parseDelimiter = (delim: typeof delimiter): string => {
    switch (delim) {
      case 'tab':
        return '\t';
      case 'comma':
        return ',';
      case 'semicolon':
        return ';';
    }
  };

  const handleImport = () => {
    if (!batchData.trim()) {
      alert('Please enter data to import');
      return;
    }

    if (!selectedColumn || !selectedSection) {
      alert('Please select a column and section');
      return;
    }

    const delimiterChar = parseDelimiter(delimiter);
    const lines = batchData.trim().split('\n');
    let importCount = 0;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      const values = trimmedLine.split(delimiterChar);

      // First column is text, second column (optional) is category
      const text = values[0]?.trim();
      const category = values[1]?.trim() || defaultCategory;

      if (text) {
        addBox(selectedColumn, selectedSection, {
          text,
          type: category,
          width: 'full-width',
          lines: 1,
        });
        importCount++;
      }
    });

    alert(`Successfully imported ${importCount} boxes!`);
    setBatchData('');
    onClose();
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
      <div className="modal-content export-modal" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2>Batch Import</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="section-select">Import into Section:</label>
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

          <div className="form-group">
            <label htmlFor="delimiter-select">Delimiter:</label>
            <select
              id="delimiter-select"
              className="form-input"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as typeof delimiter)}
            >
              <option value="tab">Tab (TSV)</option>
              <option value="comma">Comma (CSV)</option>
              <option value="semicolon">Semicolon</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category-select">Default Category:</label>
            <select
              id="category-select"
              className="form-input"
              value={defaultCategory}
              onChange={(e) => setDefaultCategory(e.target.value)}
            >
              {Object.entries(categories).map(([key, cat]) => (
                <option key={key} value={key}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="batch-data">Batch Data:</label>
            <textarea
              id="batch-data"
              className="form-input"
              value={batchData}
              onChange={(e) => setBatchData(e.target.value)}
              placeholder={`Enter data in format:\nText${parseDelimiter(delimiter)}Category\nExample${parseDelimiter(delimiter)}blue\nAnother${parseDelimiter(delimiter)}green`}
              style={{
                minHeight: '200px',
                fontFamily: 'monospace',
                fontSize: '13px',
              }}
            />
          </div>

          <div className="import-info">
            <h4>Format Instructions:</h4>
            <ul>
              <li>One box per line</li>
              <li>
                <strong>Column 1:</strong> Box text (required)
              </li>
              <li>
                <strong>Column 2:</strong> Category/color (optional, uses default if omitted)
              </li>
              <li>Empty lines are ignored</li>
              <li>Example with Tab delimiter:</li>
            </ul>
            <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
              Introduction{'\t'}blue
              {'\n'}Main Point{'\t'}green
              {'\n'}Conclusion{'\t'}purple
            </pre>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleImport}
            disabled={!batchData.trim() || !selectedSection}
          >
            Import Boxes
          </button>
        </div>
      </div>
    </div>
  );
};
