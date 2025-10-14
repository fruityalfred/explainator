/**
 * AddBoxModal - Add a new box to a section
 * Exact replica of showAddBoxModal from original Explainator.html
 */

import { useState, useEffect } from 'react';
import { useLayoutStore } from '../../store/layoutStore';
import { useCategoryStore } from '../../store/categoryStore';
import './Modal.css';

interface AddBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBoxModal = ({ isOpen, onClose }: AddBoxModalProps) => {
  const [boxName, setBoxName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('default');
  const [lines, setLines] = useState(1);
  const [textColor, setTextColor] = useState('#ffffff');
  const [isImage, setIsImage] = useState(false);

  const { addBox } = useLayoutStore();
  const { categories } = useCategoryStore();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setBoxName('');
      setSelectedCategory('default');
      setLines(1);
      setIsImage(false);

      // Set text color from category
      const cat = categories[selectedCategory];
      if (cat) {
        const isLight = isLightColor(cat.color1);
        setTextColor(cat.textColor || (isLight ? '#1a1a1a' : '#ffffff'));
      }

      setTimeout(() => {
        document.getElementById('boxNameInput')?.focus();
      }, 100);
    }
  }, [isOpen, categories, selectedCategory]);

  // Update text color when category changes
  useEffect(() => {
    const cat = categories[selectedCategory];
    if (cat) {
      const isLight = isLightColor(cat.color1);
      setTextColor(cat.textColor || (isLight ? '#1a1a1a' : '#ffffff'));
    }
  }, [selectedCategory, categories]);

  const isLightColor = (hex: string): boolean => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    return luma > 186;
  };

  const handleAdd = () => {
    if (!boxName.trim()) {
      alert('Bitte Box Name eingeben!');
      return;
    }

    // Find first column and first section to add the box
    const columns = useLayoutStore.getState().columns;
    if (columns.length === 0) {
      alert('Keine Spalte gefunden! Bitte erst eine Spalte erstellen.');
      return;
    }

    const firstColumn = columns[0];
    const sections = Array.isArray(firstColumn.sections[0])
      ? (firstColumn.sections as any[][])[0]
      : (firstColumn.sections as any[]);

    if (sections.length === 0) {
      alert('Keine Section gefunden! Bitte erst eine Section erstellen.');
      return;
    }

    const firstSection = sections[0];

    // Add box to the first section
    addBox(firstColumn.id, firstSection.id, {
      text: boxName,
      type: selectedCategory,
      lines: lines as 1 | 2 | 3,
      textColor,
      isImage,
    });

    setBoxName('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">📦 Neue Box</div>
        <div className="modal-body">
          <input
            id="boxNameInput"
            type="text"
            value={boxName}
            onChange={(e) => setBoxName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Box Name"
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />

          {!isImage && (
            <div id="textOptions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ minWidth: '100px' }}>Kategorie:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ flex: 1, padding: '6px' }}
                >
                  {Object.keys(categories).map((catKey) => (
                    <option key={catKey} value={catKey}>
                      {categories[catKey].name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ minWidth: '100px' }}>Zeilen:</label>
                <select
                  value={lines}
                  onChange={(e) => setLines(Number(e.target.value))}
                  style={{ flex: 1, padding: '6px' }}
                >
                  <option value={1}>1 Zeile</option>
                  <option value={2}>2 Zeilen</option>
                  <option value={3}>3 Zeilen</option>
                  <option value={5}>5 Zeilen (Multiline)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ minWidth: '100px' }}>Textfarbe:</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ flex: 1, padding: '6px', height: '36px' }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleAdd}>
              Hinzufügen
            </button>
            <button className="btn btn-danger" onClick={onClose}>
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
