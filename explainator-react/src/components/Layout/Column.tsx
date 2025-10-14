/**
 * Column Component
 * Main vertical container with sections
 */

import { useState, useRef } from 'react';
import { ColumnData, SectionData } from '../../types';
import { Section } from './Section';
import { useLayoutStore } from '../../store/layoutStore';
import { DEFAULT_COLORS } from '../../constants';
import './Column.css';

interface ColumnProps {
  data: ColumnData;
  index: number;
}

export const Column = ({ data, index }: ColumnProps) => {
  const { updateColumn, deleteColumn, addSection } = useLayoutStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(data.title);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const columnRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleTitleDoubleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleText !== data.title) {
      updateColumn(data.id, { title: titleText });
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
    if (e.key === 'Escape') {
      setTitleText(data.title);
      setIsEditingTitle(false);
    }
  };

  const handleDeleteColumn = () => {
    if (confirm(`Delete column "${data.title}"?`)) {
      deleteColumn(data.id);
    }
  };

  const handleColorSelect = (color: string) => {
    updateColumn(data.id, { headerColor: color });
    setShowColorPicker(false);
  };

  const handleAddSection = () => {
    addSection(data.id, `Section ${(data.sections as SectionData[]).length + 1}`);
  };

  // Resize handling
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = columnRef.current?.offsetWidth || 400;

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.max(200, Math.min(800, startWidthRef.current + deltaX));
    if (columnRef.current) {
      columnRef.current.style.width = `${newWidth}px`;
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    if (columnRef.current) {
      const finalWidth = columnRef.current.offsetWidth;
      updateColumn(data.id, { width: `${finalWidth}px` });
    }
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  const sections = Array.isArray(data.sections[0])
    ? [] // Split mode - not implemented yet
    : (data.sections as SectionData[]);

  return (
    <div
      ref={columnRef}
      className="column"
      style={{ width: data.width }}
      data-column-id={data.id}
    >
      <div
        className="column-header"
        style={{
          background: data.headerColor || 'linear-gradient(to bottom, #8B4513, #A0522D)',
        }}
      >
        {isEditingTitle ? (
          <input
            type="text"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="column-title-input"
            autoFocus
          />
        ) : (
          <span onDoubleClick={handleTitleDoubleClick} className="column-title-text">
            {data.title}
          </span>
        )}

        <div className="column-header-actions">
          <button
            className="column-color-btn"
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Change color"
          >
            🎨
          </button>
          <button className="delete-column" onClick={handleDeleteColumn} title="Delete column">
            ×
          </button>
        </div>

        {showColorPicker && (
          <div className="color-picker-dropdown">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                className="color-option"
                style={{ background: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}
          </div>
        )}
      </div>

      <div className="column-content">
        {sections.map((section) => (
          <Section key={section.id} data={section} columnId={data.id} />
        ))}

        <button className="add-section-btn" onClick={handleAddSection}>
          + Add Section
        </button>
      </div>

      <div className="resize-handle" onMouseDown={handleResizeStart} />
    </div>
  );
};
