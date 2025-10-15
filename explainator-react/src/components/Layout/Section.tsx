/**
 * Section Component
 * Container for boxes within a column
 */

import { useState } from 'react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { SectionData } from '../../types';
import { Box } from './Box';
import { useLayoutStore } from '../../store/layoutStore';
import './Section.css';

interface SectionProps {
  data: SectionData;
  columnId: string;
  index: number;
}

export const Section = ({ data, columnId, index }: SectionProps) => {
  const { updateSection, deleteSection, updateBox, deleteBox, addBox, cloneSection } = useLayoutStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(data.title);

  const { setNodeRef, isOver } = useDroppable({
    id: `section-${data.id}`,
    data: {
      type: 'section',
      columnId,
      sectionId: data.id,
      index,
    },
  });

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

  const handleCloneSection = () => {
    cloneSection(columnId, data.id);
  };

  return (
    <div
      className={`section-group ${isOver ? 'drag-over' : ''}`}
      data-section-id={data.id}
    >
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

        <button className="section-clone" onClick={handleCloneSection} title="Clone section">
          📋
        </button>
        <button className="section-delete" onClick={handleDeleteSection} title="Delete section">
          ×
        </button>
      </div>

      <div ref={setNodeRef} className="box-container">
        <SortableContext items={data.boxes.map((b) => b.id)} strategy={rectSortingStrategy}>
          {data.boxes.map((box, idx) => (
            <Box
              key={box.id}
              data={box}
              columnId={columnId}
              sectionId={data.id}
              index={idx}
              onUpdate={(updates) => updateBox(columnId, data.id, box.id, updates)}
              onDelete={() => deleteBox(columnId, data.id, box.id)}
            />
          ))}
        </SortableContext>
      </div>

      <button className="add-box-btn" onClick={handleAddBox}>
        + Add Box
      </button>
    </div>
  );
};
