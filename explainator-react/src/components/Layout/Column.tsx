/**
 * Column Component
 * Main vertical container with sections
 */

import { useState, useRef, useEffect } from 'react';
import { ColumnData, SectionData } from '../../types';
import { Section } from './Section';
import { useLayoutStore } from '../../store/layoutStore';
import { useCanvasStore } from '../../store/canvasStore';
import { DEFAULT_COLORS } from '../../constants';
import './Column.css';

interface ColumnProps {
  data: ColumnData;
  index: number;
}

export const Column = ({ data, index }: ColumnProps) => {
  const { updateColumn, updateColumnCanvasPosition, deleteColumn, addSection } = useLayoutStore();
  const { canvasMode, snapToGrid, gridSize } = useCanvasStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(data.title);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const columnRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragStartPosXRef = useRef(0);
  const dragStartPosYRef = useRef(0);

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

  // Canvas drag handling
  const handleCanvasDragStart = (e: React.MouseEvent) => {
    if (!canvasMode) return;
    e.stopPropagation();
    setIsDraggingCanvas(true);
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartPosXRef.current = data.canvasX || 0;
    dragStartPosYRef.current = data.canvasY || 0;

    document.addEventListener('mousemove', handleCanvasDragMove);
    document.addEventListener('mouseup', handleCanvasDragEnd);
  };

  const snapToGridValue = (value: number): number => {
    if (snapToGrid) {
      return Math.round(value / gridSize) * gridSize;
    }
    return value;
  };

  const handleCanvasDragMove = (e: MouseEvent) => {
    if (!isDraggingCanvas) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const deltaY = e.clientY - dragStartYRef.current;
    const newX = snapToGridValue(dragStartPosXRef.current + deltaX);
    const newY = snapToGridValue(dragStartPosYRef.current + deltaY);

    if (columnRef.current) {
      columnRef.current.style.left = `${newX}px`;
      columnRef.current.style.top = `${newY}px`;
    }
  };

  const handleCanvasDragEnd = () => {
    setIsDraggingCanvas(false);
    if (columnRef.current) {
      const finalX = parseInt(columnRef.current.style.left) || 0;
      const finalY = parseInt(columnRef.current.style.top) || 0;
      updateColumnCanvasPosition(data.id, finalX, finalY);
    }
    document.removeEventListener('mousemove', handleCanvasDragMove);
    document.removeEventListener('mouseup', handleCanvasDragEnd);
  };

  // Initialize canvas position on mount
  useEffect(() => {
    if (canvasMode && data.canvasX === undefined && data.canvasY === undefined) {
      // Set initial position for new columns in canvas mode
      const initialX = 50 + index * 50;
      const initialY = 50 + index * 30;
      updateColumnCanvasPosition(data.id, initialX, initialY);
    }
  }, [canvasMode, data.canvasX, data.canvasY, data.id, index, updateColumnCanvasPosition]);

  const sections = Array.isArray(data.sections[0])
    ? [] // Split mode - not implemented yet
    : (data.sections as SectionData[]);

  const columnStyle = canvasMode
    ? {
        position: 'absolute' as const,
        left: `${data.canvasX || 0}px`,
        top: `${data.canvasY || 0}px`,
        width: data.width,
        cursor: isDraggingCanvas ? 'grabbing' : 'grab',
      }
    : { width: data.width };

  return (
    <div
      ref={columnRef}
      className="column"
      style={columnStyle}
      data-column-id={data.id}
      onMouseDown={canvasMode ? handleCanvasDragStart : undefined}
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
        {sections.map((section, idx) => (
          <Section key={section.id} data={section} columnId={data.id} index={idx} />
        ))}

        <button className="add-section-btn" onClick={handleAddSection}>
          + Add Section
        </button>
      </div>

      <div className="resize-handle" onMouseDown={handleResizeStart} />
    </div>
  );
};
