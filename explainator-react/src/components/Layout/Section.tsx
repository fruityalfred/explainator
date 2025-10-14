/**
 * Section Component
 * Container for boxes within a column
 */

import { useState } from 'react';
import { SectionData } from '../../types';
import { Box } from './Box';
import { useLayoutStore } from '../../store/layoutStore';
import './Section.css';

interface SectionProps {
  data: SectionData;
  columnId: string;
}

export const Section = ({ data, columnId }: SectionProps) => {
  const { updateSection, deleteSection, updateBox, deleteBox, addBox } = useLayoutStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(data.title);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleText !== data.title) {
      updateSection(columnId, data.id, { title: titleText });
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

  const handleDeleteSection = () => {
    if (confirm(`Delete section "${data.title}"?`)) {
      deleteSection(columnId, data.id);
    }
  };

  const handleAddBox = () => {
    addBox(columnId, data.id, {
      text: 'New Box',
      type: 'blue',
    });
  };

  return (
    <div className="section-group" data-section-id={data.id}>
      <div
        className="section-title"
        style={{
          background: data.color || '#8B4513',
        }}
      >
        {isEditingTitle ? (
          <input
            type="text"
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="section-title-input"
            autoFocus
          />
        ) : (
          <span onClick={handleTitleClick}>{data.title}</span>
        )}

        <button className="section-delete" onClick={handleDeleteSection} title="Delete section">
          ×
        </button>
      </div>

      <div className="box-container">
        {data.boxes.map((box) => (
          <Box
            key={box.id}
            data={box}
            columnId={columnId}
            sectionId={data.id}
            onUpdate={(updates) => updateBox(columnId, data.id, box.id, updates)}
            onDelete={() => deleteBox(columnId, data.id, box.id)}
          />
        ))}
      </div>

      <button className="add-box-btn" onClick={handleAddBox}>
        + Add Box
      </button>
    </div>
  );
};
