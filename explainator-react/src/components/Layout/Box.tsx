/**
 * Box Component
 * Individual content box (Text, Image, or Line)
 */

import { useState, useRef, useEffect } from 'react';
import { BoxData } from '../../types';
import { useCategoryStore } from '../../store/categoryStore';
import './Box.css';

interface BoxProps {
  data: BoxData;
  columnId: string;
  sectionId: string;
  onUpdate: (updates: Partial<BoxData>) => void;
  onDelete: () => void;
}

export const Box = ({ data, columnId, sectionId, onUpdate, onDelete }: BoxProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.text);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getCategoryGradient, getCategoryTextColor } = useCategoryStore();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!data.isLine && !data.isImage) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editText !== data.text) {
      onUpdate({ text: editText });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditText(data.text);
      setIsEditing(false);
    }
  };

  const toggleWidth = () => {
    onUpdate({
      width: data.width === 'full-width' ? 'half-width' : 'full-width',
    });
  };

  // Render Line
  if (data.isLine) {
    return (
      <div className={`app-box box-line ${data.width}`} data-box-id={data.id}>
        <div
          className={`line ${data.lineClass || 'line-medium'}`}
          style={{
            background: getCategoryGradient(data.type),
          }}
        />
        <button className="delete-btn" onClick={onDelete} title="Delete">
          ×
        </button>
      </div>
    );
  }

  // Render Image
  if (data.isImage && data.imageSrc) {
    return (
      <div className={`app-box box-image ${data.width}`} data-box-id={data.id}>
        <img src={data.imageSrc} alt={data.text || 'Box image'} className="box-image-img" />
        <button className="delete-btn" onClick={onDelete} title="Delete">
          ×
        </button>
        <button className="resize-btn" onClick={toggleWidth} title="Toggle width">
          ⇄
        </button>
      </div>
    );
  }

  // Render Text Box
  return (
    <div
      className={`app-box box-text ${data.width} lines-${data.lines}`}
      data-box-id={data.id}
      style={{
        background: getCategoryGradient(data.type),
        color: data.textColor || getCategoryTextColor(data.type),
        textAlign: data.textAlign || 'center',
        minHeight: data.heightPx ? `${data.heightPx}px` : undefined,
      }}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="box-edit-input"
          style={{
            color: data.textColor || getCategoryTextColor(data.type),
          }}
        />
      ) : (
        <span className="box-text-content">{data.text}</span>
      )}

      <button className="delete-btn" onClick={onDelete} title="Delete">
        ×
      </button>
      <button className="resize-btn" onClick={toggleWidth} title="Toggle width">
        ⇄
      </button>
    </div>
  );
};
