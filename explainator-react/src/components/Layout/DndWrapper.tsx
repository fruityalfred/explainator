/**
 * Drag & Drop Wrapper using @dnd-kit
 * Handles all drag and drop operations for boxes, sections, and columns
 */

import type { ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { useLayoutStore } from '../../store/layoutStore';

interface DndWrapperProps {
  children: ReactNode;
}

export const DndWrapper = ({ children }: DndWrapperProps) => {
  const { moveBox, moveSection, moveColumn, columns } = useLayoutStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine what type of item is being dragged
    const activeData = active.data.current;
    const overData = over.data.current;

    // Box drag
    if (activeData?.type === 'box' && overData?.type === 'box') {
      const { columnId: fromColumnId, sectionId: fromSectionId } = activeData;
      const { columnId: toColumnId, sectionId: toSectionId, index: toIndex } = overData;

      moveBox(fromColumnId, fromSectionId, toColumnId, toSectionId, activeId, toIndex);
    }

    // Section drag
    else if (activeData?.type === 'section' && overData?.type === 'section') {
      const { columnId: fromColumnId } = activeData;
      const { columnId: toColumnId, index: toIndex } = overData;

      moveSection(fromColumnId, toColumnId, activeId, toIndex);
    }

    // Column drag
    else if (activeData?.type === 'column' && overData?.type === 'column') {
      const fromIndex = columns.findIndex((col) => col.id === activeId);
      const toIndex = columns.findIndex((col) => col.id === overId);

      if (fromIndex !== -1 && toIndex !== -1) {
        moveColumn(fromIndex, toIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {activeId ? (
          <div
            style={{
              padding: '10px',
              background: 'white',
              borderRadius: '6px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              opacity: 0.9,
            }}
          >
            Dragging...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
