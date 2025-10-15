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
import { useRef, useState } from 'react';
import { useLayoutStore } from '../../store/layoutStore';

interface DndWrapperProps {
  children: ReactNode;
}

export const DndWrapper = ({ children }: DndWrapperProps) => {
  const { moveBox, moveSection, moveColumn, columns, cloneBoxTo, cloneSectionTo, splitColumn } = useLayoutStore() as any;
  const [activeId, setActiveId] = useState<string | null>(null);
  const cloneOnDragRef = useRef(false);
  const altPressedRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    // Detect Ctrl at drag start to mirror HTML clone-on-drag
    const anyEvt = event.activatorEvent as any;
    cloneOnDragRef.current = !!(anyEvt && (anyEvt.ctrlKey || anyEvt.metaKey));
    altPressedRef.current = !!(anyEvt && anyEvt.altKey);
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
      if (cloneOnDragRef.current) {
        // If multiple boxes are selected and include the active one, clone all selected in order
        const selectedEls = Array.from(document.querySelectorAll('.app-box.selected')) as HTMLElement[];
        const containsActive = selectedEls.some((el) => el.getAttribute('data-box-id') === activeId);
        if (containsActive && selectedEls.length > 1) {
          // helper to locate a box in state
          const findBoxLoc = (id: string): { col: string; sec: string } | null => {
            for (const col of columns as any[]) {
              if (Array.isArray(col.sections[0])) continue;
              for (const sec of col.sections as any[]) {
                if (sec.boxes.some((b: any) => b.id === id)) {
                  return { col: col.id, sec: sec.id };
                }
              }
            }
            return null;
          };
          let insertAt = toIndex;
          selectedEls.forEach((el) => {
            const id = el.getAttribute('data-box-id') || '';
            const loc = findBoxLoc(id);
            if (loc) {
              cloneBoxTo(loc.col, loc.sec, id, toColumnId, toSectionId, insertAt);
              if (insertAt !== undefined) insertAt += 1;
            }
          });
        } else {
          cloneBoxTo(fromColumnId, fromSectionId, activeId, toColumnId, toSectionId, toIndex);
        }
      } else {
        // Group move when multiple selected and includes active
        const selectedEls = Array.from(document.querySelectorAll('.app-box.selected')) as HTMLElement[];
        const containsActive = selectedEls.some((el) => el.getAttribute('data-box-id') === activeId);
        if (containsActive && selectedEls.length > 1) {
          // helper to locate a box in state
          const findBoxLoc = (id: string): { col: string; sec: string } | null => {
            for (const col of columns as any[]) {
              if (Array.isArray(col.sections[0])) continue;
              for (const sec of col.sections as any[]) {
                if (sec.boxes.some((b: any) => b.id === id)) {
                  return { col: col.id, sec: sec.id };
                }
              }
            }
            return null;
          };
          let insertAt = toIndex;
          selectedEls.forEach((el) => {
            const id = el.getAttribute('data-box-id') || '';
            const loc = findBoxLoc(id);
            if (loc) {
              moveBox(loc.col, loc.sec, toColumnId, toSectionId, id, insertAt);
              if (insertAt !== undefined) insertAt += 1;
            }
          });
        } else {
          moveBox(fromColumnId, fromSectionId, toColumnId, toSectionId, activeId, toIndex);
        }
      }
    }

    // Section drag
    else if (activeData?.type === 'section' && (overData?.type === 'section' || overData?.type === 'split-part' || overData?.type === 'column')) {
      const { columnId: fromColumnId, splitPartIndex: fromPart } = activeData as any;
      const overType = overData?.type as string;
      const toColumnId = (overData as any).columnId;
      const toIndex = (overData as any).index as number | undefined;
      const toPart = (overData as any).partIndex as number | undefined;

      // Decide target mode: if dropping into normal column but source was split and Alt NOT pressed, convert target to split and insert into part
      const fromIsSplit = typeof fromPart === 'number';
      const targetIsSplit = overType === 'split-part' || (columns.find((c: any) => c.id === toColumnId)?.sections?.[0] && Array.isArray((columns.find((c: any) => c.id === toColumnId) as any).sections[0]));

      const preserveSplit = fromIsSplit && !altPressedRef.current;

      if (cloneOnDragRef.current) {
        if (overType === 'split-part') {
          // clone into split part at end or at toIndex if provided
          (cloneSectionTo as any)(fromColumnId, activeId, toColumnId, { partIndex: toPart, index: toIndex });
        } else if (preserveSplit && !targetIsSplit) {
          // convert target to split with same parts as source (fallback 2)
          const srcCol = (columns as any[]).find((c: any) => c.id === fromColumnId);
          const parts = (srcCol && (srcCol.splitParts || (Array.isArray(srcCol.sections?.[0]) ? (srcCol.sections as any[]).length : 2))) || 2;
          (splitColumn as any)(toColumnId, parts);
          (cloneSectionTo as any)(fromColumnId, activeId, toColumnId, { partIndex: 0 });
        } else {
          cloneSectionTo(fromColumnId, activeId, toColumnId, toIndex);
        }
      } else {
        if (overType === 'split-part') {
          (moveSection as any)(fromColumnId, toColumnId, activeId, { partIndex: toPart, index: toIndex });
        } else if (preserveSplit && !targetIsSplit) {
          const srcCol = (columns as any[]).find((c: any) => c.id === fromColumnId);
          const parts = (srcCol && (srcCol.splitParts || (Array.isArray(srcCol.sections?.[0]) ? (srcCol.sections as any[]).length : 2))) || 2;
          (splitColumn as any)(toColumnId, parts);
          (moveSection as any)(fromColumnId, toColumnId, activeId, { partIndex: 0 });
        } else {
          moveSection(fromColumnId, toColumnId, activeId, toIndex);
        }
      }
    }

    // Column drag
    else if (activeData?.type === 'column' && overData?.type === 'column') {
      const fromIndex = columns.findIndex((col) => col.id === activeId);
      const toIndex = columns.findIndex((col) => col.id === overId);

      if (fromIndex !== -1 && toIndex !== -1) {
        moveColumn(fromIndex, toIndex);
      }
    }
    // reset clone flag
    cloneOnDragRef.current = false;
  };

  // Track Alt key state during DnD similar to original
  // eslint-disable-next-line react-hooks/rules-of-hooks
  (function useAltTracking(){
    const add = () => {
      const down = (e: KeyboardEvent) => { if (e.key === 'Alt') altPressedRef.current = true; };
      const up = (e: KeyboardEvent) => { if (e.key === 'Alt') altPressedRef.current = false; };
      window.addEventListener('keydown', down);
      window.addEventListener('keyup', up);
      return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
    };
    // Best-effort: attach once
    // @ts-ignore
    if (!(window as any).__altTrack) { (window as any).__altTrack = true; add(); }
  })();

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
