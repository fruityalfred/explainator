/**
 * FormattingModal - Typography and font settings
 * Exact replica of formattingModal from original Explainator.html
 */

import { useState, useEffect } from 'react';
import './ExportModal.css';

interface FormattingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FontTarget = 'columns' | 'sections' | 'boxes';

interface FontSettings {
  family: string;
  size: string;
  bold: boolean;
  italic: boolean;
}

const DEFAULT_FONT_SETTINGS: Record<FontTarget, FontSettings> = {
  columns: { family: 'Arial', size: '14px', bold: true, italic: false },
  sections: { family: 'Arial', size: '13px', bold: true, italic: false },
  boxes: { family: 'Segoe UI', size: '14px', bold: false, italic: false },
};

export const FormattingModal = ({ isOpen, onClose }: FormattingModalProps) => {
  const [target, setTarget] = useState<FontTarget>('columns');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('14px');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

  // Load settings for current target
  useEffect(() => {
    if (isOpen) {
      loadSettings(target);
    }
  }, [isOpen, target]);

  const loadSettings = (t: FontTarget) => {
    // Try to load from localStorage or use defaults
    const storageKey = `fontSettings_${t}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      const settings: FontSettings = JSON.parse(saved);
      setFontFamily(settings.family);
      setFontSize(settings.size);
      setBold(settings.bold);
      setItalic(settings.italic);
    } else {
      const defaults = DEFAULT_FONT_SETTINGS[t];
      setFontFamily(defaults.family);
      setFontSize(defaults.size);
      setBold(defaults.bold);
      setItalic(defaults.italic);
    }
  };

  const handleApply = () => {
    const settings: FontSettings = {
      family: fontFamily,
      size: fontSize,
      bold,
      italic,
    };

    // Save to localStorage
    localStorage.setItem(`fontSettings_${target}`, JSON.stringify(settings));

    // Apply CSS variables based on target
    const root = document.documentElement;
    const prefix = target === 'columns' ? 'column' : target === 'sections' ? 'section' : 'box';

    root.style.setProperty(`--${prefix}-font-family`, fontFamily);
    root.style.setProperty(`--${prefix}-font-size`, fontSize);
    root.style.setProperty(`--${prefix}-font-weight`, bold ? '700' : '400');
    root.style.setProperty(`--${prefix}-font-style`, italic ? 'italic' : 'normal');

    alert('Formatierung angewendet!');
    onClose();
  };

  const switchTarget = (newTarget: FontTarget) => {
    setTarget(newTarget);
  };

  if (!isOpen) return null;

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">🔠 Adjust Typography</div>
        <div className="modal-body">
          {/* Target Selector */}
          <div className="formatting-target-selector" style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
            <button
              className={`btn ${target === 'columns' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => switchTarget('columns')}
            >
              Columns
            </button>
            <button
              className={`btn ${target === 'sections' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => switchTarget('sections')}
            >
              Sections
            </button>
            <button
              className={`btn ${target === 'boxes' ? 'btn-primary active' : 'btn-secondary'}`}
              onClick={() => switchTarget('boxes')}
            >
              Boxes
            </button>
          </div>

          {/* Font Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{ minWidth: '120px' }}>Font Family:</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                style={{ flex: 1, padding: '6px' }}
              >
                <option value="Arial">Arial</option>
                <option value="Segoe UI">Segoe UI</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{ minWidth: '120px' }}>Font Size:</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                style={{ flex: 1, padding: '6px' }}
              >
                <option value="10px">10px</option>
                <option value="11px">11px</option>
                <option value="12px">12px</option>
                <option value="13px">13px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <label style={{ minWidth: '120px' }}>Style:</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="checkbox" checked={bold} onChange={(e) => setBold(e.target.checked)} />
                <strong>Bold</strong>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="checkbox" checked={italic} onChange={(e) => setItalic(e.target.checked)} />
                <em>Italic</em>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontFamily,
              fontSize,
              fontWeight: bold ? 700 : 400,
              fontStyle: italic ? 'italic' : 'normal',
            }}
          >
            Preview: The quick brown fox jumps over the lazy dog
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleApply}>
              Apply & Close
            </button>
            <button className="btn btn-danger" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
