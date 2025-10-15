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
  const lastPointerXRef = useRef<number | null>(null);
  const cueTargetRef = useRef<HTMLElement | null>(null);
  const placeholderRef = useRef<HTMLElement | null>(null);

  const clearCue = () => {
    try {
      cueTargetRef.current?.classList.remove('full-width-cue');
    } catch {}
    cueTargetRef.current = null;
  };

  const ensurePlaceholder = () => {
    if (!placeholderRef.current) {
      const el = document.createElement('div');
      el.className = 'section-placeholder';
      placeholderRef.current = el;
    }
    return placeholderRef.current!;
  };

  const clearPlaceholder = () => {
    try {
      const el = placeholderRef.current;
      if (el && el.parentElement) el.parentElement.removeChild(el);
    } catch {}
    placeholderRef.current = null;
  };

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

  const handleDragMove = (event: any) => {
    const { delta, activatorEvent } = event;
    if (activatorEvent && typeof (activatorEvent as any).clientX === 'number') {
      lastPointerXRef.current = (activatorEvent as any).clientX as number;
    } else if (event && event.over && event.over.rect) {
      // fallback not always present; keep last known
    }

    // Update visual Alt cue when hovering normal columns while dragging sections from split
    try {
      const activeData = event.active?.data?.current;
      const overData = event.over?.data?.current;
      if (!activeData || !overData) return;
      if (activeData.type !== 'section') { clearCue(); return; }
      const fromPart = (activeData as any).splitPartIndex;
      const fromIsSplit = typeof fromPart === 'number';
      const overType = overData.type as string;
      const toColumnId = (overData as any).columnId;
      const targetIsSplit = overType === 'split-part' || (columns.find((c: any) => c.id === toColumnId)?.sections?.[0] && Array.isArray((columns.find((c: any) => c.id === toColumnId) as any).sections[0]));
      const showCue = fromIsSplit && altPressedRef.current && (overType === 'column' || (overType === 'section' && !targetIsSplit));
      clearCue();
      if (showCue) {
        const colEl = document.querySelector(`[data-column-id="${toColumnId}"] .column-content`) as HTMLElement | null;
        if (colEl) {
          cueTargetRef.current = colEl;
          colEl.classList.add('full-width-cue');
        }
      }
    } catch {}

    // Place a ghost placeholder for section drops to show exact insert
    try {
      const activeData = event.active?.data?.current;
      const overData = event.over?.data?.current;
      if (!activeData || !overData || activeData.type !== 'section') { clearPlaceholder(); return; }
      const overType = overData.type as string;

      const ph = ensurePlaceholder();

      if (overType === 'section') {
        const overSectionId = (overData as any).sectionId as string;
        const overEl = document.querySelector(`[data-section-id="${overSectionId}"]`) as HTMLElement | null;
        if (overEl && overEl.parentElement && ph !== overEl) {
          overEl.parentElement.insertBefore(ph, overEl);
        }
      } else if (overType === 'split-part') {
        const toColumnId = (overData as any).columnId as string;
        const partIndex = (overData as any).partIndex as number;
        const partEl = document.querySelector(`[data-split-part="${toColumnId}:${partIndex}"]`) as HTMLElement | null;
        if (partEl && ph.parentElement !== partEl) {
          partEl.appendChild(ph);
        }
      } else if (overType === 'column') {
        const toColumnId = (overData as any).columnId as string;
        const colContent = document.querySelector(`[data-column-id="${toColumnId}"] .column-content`) as HTMLElement | null;
        if (colContent && ph.parentElement !== colContent) {
          colContent.appendChild(ph);
        }
      } else {
        clearPlaceholder();
      }
    } catch {}
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
          // keep selection after clone
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
          // clear selection after move
          document.querySelectorAll('.app-box.selected').forEach(el => el.classList.remove('selected'));
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
          // convert target to split with same parts as source (fallback 2) and choose part by mouse X
          const srcCol = (columns as any[]).find((c: any) => c.id === fromColumnId);
          const parts = (srcCol && (srcCol.splitParts || (Array.isArray(srcCol.sections?.[0]) ? (srcCol.sections as any[]).length : 2))) || 2;
          (splitColumn as any)(toColumnId, parts);
          let partIndex = 0;
          try {
            const colEl = document.querySelector(`[data-column-id="${toColumnId}"]`) as HTMLElement | null;
            if (colEl && lastPointerXRef.current != null) {
              const r = colEl.getBoundingClientRect();
              const rel = Math.max(0, Math.min(r.width - 1, lastPointerXRef.current - r.left));
              partIndex = Math.min(parts - 1, Math.max(0, Math.floor(rel / (r.width / parts))));
            }
          } catch {}
          (cloneSectionTo as any)(fromColumnId, activeId, toColumnId, { partIndex });
        } else {
          // overType === 'section' inside split or normal; prefer using over index if provided
          if (typeof (overData as any).splitPartIndex === 'number') {
            (cloneSectionTo as any)(fromColumnId, activeId, toColumnId, { partIndex: (overData as any).splitPartIndex, index: toIndex });
          } else {
            cloneSectionTo(fromColumnId, activeId, toColumnId, toIndex);
          }
        }
      } else {
        if (overType === 'split-part') {
          (moveSection as any)(fromColumnId, toColumnId, activeId, { partIndex: toPart, index: toIndex });
        } else if (preserveSplit && !targetIsSplit) {
          const srcCol = (columns as any[]).find((c: any) => c.id === fromColumnId);
          const parts = (srcCol && (srcCol.splitParts || (Array.isArray(srcCol.sections?.[0]) ? (srcCol.sections as any[]).length : 2))) || 2;
          (splitColumn as any)(toColumnId, parts);
          let partIndex = 0;
          try {
            const colEl = document.querySelector(`[data-column-id="${toColumnId}"]`) as HTMLElement | null;
            if (colEl && lastPointerXRef.current != null) {
              const r = colEl.getBoundingClientRect();
              const rel = Math.max(0, Math.min(r.width - 1, lastPointerXRef.current - r.left));
              partIndex = Math.min(parts - 1, Math.max(0, Math.floor(rel / (r.width / parts))));
            }
          } catch {}
          (moveSection as any)(fromColumnId, toColumnId, activeId, { partIndex });
        } else {
          if (typeof (overData as any).splitPartIndex === 'number') {
            (moveSection as any)(fromColumnId, toColumnId, activeId, { partIndex: (overData as any).splitPartIndex, index: toIndex });
          } else {
            moveSection(fromColumnId, toColumnId, activeId, toIndex);
          }
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
    // reset clone flag and remove cues/placeholders
    cloneOnDragRef.current = false;
    clearCue();
    clearPlaceholder();
  };

  // Track Alt key state during DnD similar to original
  // eslint-disable-next-line react-hooks/rules-of-hooks
  (function useAltTracking(){
    const add = () => {
      const down = (e: KeyboardEvent) => { if (e.key === 'Alt') altPressedRef.current = true; if (e.key === 'Escape') { document.querySelectorAll('.app-box.selected').forEach(el => el.classList.remove('selected')); } };
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
      onDragMove={handleDragMove}
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
