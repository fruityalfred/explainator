/**
 * CategoryModal - Manage color categories
 * Exact replica of categoryModal from original Explainator.html
 */

import { useState, useEffect } from 'react';
import { useCategoryStore } from '../../store/categoryStore';
import './ExportModal.css';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_PRESETS = [
  '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#FF9800', '#FFC107',
  '#FF5722', '#2196F3', '#1E88E5', '#64B5F6', '#00BCD4', '#009688',
  '#4CAF50', '#8BC34A', '#9C27B0', '#AB47BC', '#E91E63', '#F44336',
  '#607D8B', '#455A64', '#000000', '#333333', '#666666', '#999999',
  '#CCCCCC', '#FFFFFF',
];

export const CategoryModal = ({ isOpen, onClose }: CategoryModalProps) => {
  const { categories, updateCategory, addCategory, deleteCategory, resetCategories } =
    useCategoryStore();

  const [selectedCat, setSelectedCat] = useState('default');
  const [editName, setEditName] = useState('');
  const [editColor1, setEditColor1] = useState('#8B4513');
  const [editColor2, setEditColor2] = useState('#A0522D');
  const [editTextColor, setEditTextColor] = useState('#ffffff');

  useEffect(() => {
    if (isOpen && categories[selectedCat]) {
      const cat = categories[selectedCat];
      setEditName(cat.name);
      setEditColor1(cat.color1);
      setEditColor2(cat.color2);
      setEditTextColor(cat.textColor || '#ffffff');
    }
  }, [isOpen, selectedCat, categories]);

  const handleSelectCategory = (catKey: string) => {
    setSelectedCat(catKey);
    const cat = categories[catKey];
    if (cat) {
      setEditName(cat.name);
      setEditColor1(cat.color1);
      setEditColor2(cat.color2);
      setEditTextColor(cat.textColor || '#ffffff');
    }
  };

  const handleSave = () => {
    updateCategory(selectedCat, {
      name: editName,
      color1: editColor1,
      color2: editColor2,
      textColor: editTextColor,
    });
    alert('Kategorie gespeichert!');
  };

  const handleAdd = () => {
    const newKey = `custom_${Date.now()}`;
    addCategory(newKey, {
      name: 'Neue Kategorie',
      color1: '#8B4513',
      color2: '#A0522D',
      textColor: '#ffffff',
    });
    setSelectedCat(newKey);
  };

  const handleDelete = () => {
    if (selectedCat === 'default') {
      alert('Standard-Kategorie kann nicht gelöscht werden!');
      return;
    }
    if (confirm(`Kategorie "${editName}" wirklich löschen?`)) {
      deleteCategory(selectedCat);
      setSelectedCat('default');
    }
  };

  const handleReset = () => {
    if (confirm('Alle Kategorien auf Standard zurücksetzen?')) {
      resetCategories();
      setSelectedCat('default');
    }
  };

  const handleColorPresetClick = (color: string, target: 'color1' | 'color2') => {
    if (target === 'color1') {
      setEditColor1(color);
    } else {
      setEditColor2(color);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">🏷️ Manage Categories</div>
        <div className="modal-body">
          {/* Category List */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Kategorie wählen:
            </label>
            <select
              value={selectedCat}
              onChange={(e) => handleSelectCategory(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              {Object.keys(categories).map((catKey) => (
                <option key={catKey} value={catKey}>
                  {categories[catKey].name}
                </option>
              ))}
            </select>
          </div>

          {/* Edit Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Name:</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Farbe 1 (oben):</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={editColor1}
                  onChange={(e) => setEditColor1(e.target.value)}
                  style={{ width: '60px', height: '36px' }}
                />
                <input
                  type="text"
                  value={editColor1}
                  onChange={(e) => setEditColor1(e.target.value)}
                  style={{ flex: 1, padding: '8px' }}
                />
              </div>
              {/* Color Presets */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                {COLOR_PRESETS.map((color) => (
                  <div
                    key={color}
                    onClick={() => handleColorPresetClick(color, 'color1')}
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: color,
                      border: '2px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Farbe 2 (unten):</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={editColor2}
                  onChange={(e) => setEditColor2(e.target.value)}
                  style={{ width: '60px', height: '36px' }}
                />
                <input
                  type="text"
                  value={editColor2}
                  onChange={(e) => setEditColor2(e.target.value)}
                  style={{ flex: 1, padding: '8px' }}
                />
              </div>
              {/* Color Presets */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                {COLOR_PRESETS.map((color) => (
                  <div
                    key={color}
                    onClick={() => handleColorPresetClick(color, 'color2')}
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: color,
                      border: '2px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Textfarbe:</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={editTextColor}
                  onChange={(e) => setEditTextColor(e.target.value)}
                  style={{ width: '60px', height: '36px' }}
                />
                <input
                  type="text"
                  value={editTextColor}
                  onChange={(e) => setEditTextColor(e.target.value)}
                  style={{ flex: 1, padding: '8px' }}
                />
              </div>
            </div>

            {/* Preview */}
            <div
              style={{
                marginTop: '8px',
                padding: '16px',
                background: `linear-gradient(to bottom, ${editColor1}, ${editColor2})`,
                color: editTextColor,
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              {editName} Preview
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleSave}>
              Speichern
            </button>
            <button className="btn btn-success" onClick={handleAdd}>
              + Neu
            </button>
            {selectedCat !== 'default' && (
              <button className="btn btn-danger" onClick={handleDelete}>
                Löschen
              </button>
            )}
            <button className="btn btn-warning" onClick={handleReset}>
              Zurücksetzen
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
