/**
 * Layout Store (Zustand)
 * Manages the entire layout structure: columns, sections, boxes
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ColumnData, SectionData, BoxData } from '../types/layout.types';
import { v4 as uuidv4 } from 'uuid';

interface LayoutState {
  columns: ColumnData[];
  selectedBoxId: string | null;
  selectedSectionId: string | null;
  selectedColumnId: string | null;

  // Column Actions
  addColumn: (title?: string) => void;
  deleteColumn: (columnId: string) => void;
  updateColumn: (columnId: string, updates: Partial<ColumnData>) => void;
  moveColumn: (fromIndex: number, toIndex: number) => void;
  updateColumnCanvasPosition: (columnId: string, x: number, y: number) => void;
  splitColumn: (columnId: string, parts: number) => void;
  unsplitColumn: (columnId: string) => void;

  // Section Actions
  addSection: (columnId: string, title?: string) => void;
  deleteSection: (columnId: string, sectionId: string) => void;
  updateSection: (columnId: string, sectionId: string, updates: Partial<SectionData>) => void;
  moveSection: (fromColumnId: string, toColumnId: string, sectionId: string, toIndex?: number) => void;

  // Box Actions
  addBox: (columnId: string, sectionId: string, boxData: Partial<BoxData>) => void;
  deleteBox: (columnId: string, sectionId: string, boxId: string) => void;
  updateBox: (columnId: string, sectionId: string, boxId: string, updates: Partial<BoxData>) => void;
  moveBox: (fromColumnId: string, fromSectionId: string, toColumnId: string, toSectionId: string, boxId: string, toIndex?: number) => void;

  // Selection Actions
  selectBox: (boxId: string | null) => void;
  selectSection: (sectionId: string | null) => void;
  selectColumn: (columnId: string | null) => void;

  // Utility Actions
  clearLayout: () => void;
  loadLayout: (columns: ColumnData[]) => void;
}

const generateUuid = (): string => {
  // Fallback for environments without crypto
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      columns: [],
      selectedBoxId: null,
      selectedSectionId: null,
      selectedColumnId: null,

      /**
       * Add a new column
       */
      addColumn: (title = 'New Column') => {
        const newColumn: ColumnData = {
          id: generateUuid(),
          title,
          width: '400px',
          splitState: 'normal',
          splitParts: 1,
          sections: [],
        };

        set((state) => ({
          columns: [...state.columns, newColumn],
        }));
      },

      /**
       * Delete a column
       */
      deleteColumn: (columnId: string) => {
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== columnId),
          selectedColumnId: state.selectedColumnId === columnId ? null : state.selectedColumnId,
        }));
      },

      /**
       * Update column properties
       */
      updateColumn: (columnId: string, updates: Partial<ColumnData>) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId ? { ...col, ...updates } : col
          ),
        }));
      },

      /**
       * Move column to a different position
       */
      moveColumn: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newColumns = [...state.columns];
          const [movedColumn] = newColumns.splice(fromIndex, 1);
          newColumns.splice(toIndex, 0, movedColumn);
          return { columns: newColumns };
        });
      },

      /**
       * Update column canvas position (for canvas mode)
       */
      updateColumnCanvasPosition: (columnId: string, x: number, y: number) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId ? { ...col, canvasX: x, canvasY: y } : col
          ),
        }));
      },

      /**
       * Split column into multiple vertical parts (2-8)
       */
      splitColumn: (columnId: string, parts: number) => {
        set((state) => {
          const column = state.columns.find((col) => col.id === columnId);
          if (!column || parts < 2 || parts > 8) return state;

          // If already in normal mode with sections, distribute them across splits
          const currentSections = Array.isArray(column.sections[0])
            ? []
            : (column.sections as SectionData[]);

          // Create empty section arrays for each split part
          const splitSections: SectionData[][] = Array.from({ length: parts }, () => []);

          // Distribute existing sections evenly across splits
          currentSections.forEach((section, idx) => {
            const targetSplit = idx % parts;
            splitSections[targetSplit].push(section);
          });

          // If no sections exist, create default sections for each split
          if (currentSections.length === 0) {
            for (let i = 0; i < parts; i++) {
              splitSections[i] = [
                {
                  id: generateUuid(),
                  title: `Part ${i + 1}`,
                  boxes: [],
                },
              ];
            }
          }

          return {
            columns: state.columns.map((col) =>
              col.id === columnId
                ? {
                    ...col,
                    splitState: `split-${parts}` as any,
                    splitParts: parts,
                    sections: splitSections,
                  }
                : col
            ),
          };
        });
      },

      /**
       * Unsplit column back to normal mode
       */
      unsplitColumn: (columnId: string) => {
        set((state) => {
          const column = state.columns.find((col) => col.id === columnId);
          if (!column || column.splitState === 'normal') return state;

          // Merge all split sections into single array
          const mergedSections: SectionData[] = [];
          if (Array.isArray(column.sections[0])) {
            (column.sections as SectionData[][]).forEach((splitPart) => {
              mergedSections.push(...splitPart);
            });
          }

          return {
            columns: state.columns.map((col) =>
              col.id === columnId
                ? {
                    ...col,
                    splitState: 'normal',
                    splitParts: 1,
                    sections: mergedSections,
                  }
                : col
            ),
          };
        });
      },

      /**
       * Add a new section to a column
       */
      addSection: (columnId: string, title = 'New Section') => {
        const newSection: SectionData = {
          id: generateUuid(),
          title,
          boxes: [],
        };

        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  sections: Array.isArray(col.sections[0])
                    ? col.sections // Split mode - don't add
                    : [...(col.sections as SectionData[]), newSection],
                }
              : col
          ),
        }));
      },

      /**
       * Delete a section from a column
       */
      deleteSection: (columnId: string, sectionId: string) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  sections: Array.isArray(col.sections[0])
                    ? col.sections // Split mode - handle differently
                    : (col.sections as SectionData[]).filter((sec) => sec.id !== sectionId),
                }
              : col
          ),
          selectedSectionId: state.selectedSectionId === sectionId ? null : state.selectedSectionId,
        }));
      },

      /**
       * Update section properties
       */
      updateSection: (columnId: string, sectionId: string, updates: Partial<SectionData>) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  sections: Array.isArray(col.sections[0])
                    ? col.sections // Split mode - handle differently
                    : (col.sections as SectionData[]).map((sec) =>
                        sec.id === sectionId ? { ...sec, ...updates } : sec
                      ),
                }
              : col
          ),
        }));
      },

      /**
       * Move section between columns
       */
      moveSection: (fromColumnId: string, toColumnId: string, sectionId: string, toIndex?: number) => {
        set((state) => {
          const fromColumn = state.columns.find((col) => col.id === fromColumnId);
          const toColumn = state.columns.find((col) => col.id === toColumnId);

          if (!fromColumn || !toColumn) return state;
          if (Array.isArray(fromColumn.sections[0]) || Array.isArray(toColumn.sections[0])) {
            return state; // Don't move in split mode
          }

          const fromSections = fromColumn.sections as SectionData[];
          const section = fromSections.find((sec) => sec.id === sectionId);
          if (!section) return state;

          const newColumns = state.columns.map((col) => {
            if (col.id === fromColumnId) {
              return {
                ...col,
                sections: fromSections.filter((sec) => sec.id !== sectionId),
              };
            }
            if (col.id === toColumnId) {
              const toSections = [...(col.sections as SectionData[])];
              const insertIndex = toIndex !== undefined ? toIndex : toSections.length;
              toSections.splice(insertIndex, 0, section);
              return { ...col, sections: toSections };
            }
            return col;
          });

          return { columns: newColumns };
        });
      },

      /**
       * Add a new box to a section
       */
      addBox: (columnId: string, sectionId: string, boxData: Partial<BoxData>) => {
        const newBox: BoxData = {
          id: generateUuid(),
          text: boxData.text || 'New Box',
          type: boxData.type || 'blue',
          width: boxData.width || 'full-width',
          lines: boxData.lines || 1,
          baseLines: boxData.baseLines || 1,
          dynamic: boxData.dynamic ?? false,
          ...boxData,
        };

        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  sections: Array.isArray(col.sections[0])
                    ? col.sections // Split mode - handle differently
                    : (col.sections as SectionData[]).map((sec) =>
                        sec.id === sectionId
                          ? { ...sec, boxes: [...sec.boxes, newBox] }
                          : sec
                      ),
                }
              : col
          ),
        }));
      },

      /**
       * Delete a box from a section
       */
      deleteBox: (columnId: string, sectionId: string, boxId: string) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  sections: Array.isArray(col.sections[0])
                    ? col.sections
                    : (col.sections as SectionData[]).map((sec) =>
                        sec.id === sectionId
                          ? { ...sec, boxes: sec.boxes.filter((box) => box.id !== boxId) }
                          : sec
                      ),
                }
              : col
          ),
          selectedBoxId: state.selectedBoxId === boxId ? null : state.selectedBoxId,
        }));
      },

      /**
       * Update box properties
       */
      updateBox: (columnId: string, sectionId: string, boxId: string, updates: Partial<BoxData>) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  sections: Array.isArray(col.sections[0])
                    ? col.sections
                    : (col.sections as SectionData[]).map((sec) =>
                        sec.id === sectionId
                          ? {
                              ...sec,
                              boxes: sec.boxes.map((box) =>
                                box.id === boxId ? { ...box, ...updates } : box
                              ),
                            }
                          : sec
                      ),
                }
              : col
          ),
        }));
      },

      /**
       * Move box between sections
       */
      moveBox: (
        fromColumnId: string,
        fromSectionId: string,
        toColumnId: string,
        toSectionId: string,
        boxId: string,
        toIndex?: number
      ) => {
        set((state) => {
          const fromColumn = state.columns.find((col) => col.id === fromColumnId);
          const toColumn = state.columns.find((col) => col.id === toColumnId);

          if (!fromColumn || !toColumn) return state;
          if (Array.isArray(fromColumn.sections[0]) || Array.isArray(toColumn.sections[0])) {
            return state; // Don't move in split mode
          }

          const fromSection = (fromColumn.sections as SectionData[]).find(
            (sec) => sec.id === fromSectionId
          );
          const box = fromSection?.boxes.find((b) => b.id === boxId);

          if (!box) return state;

          const newColumns = state.columns.map((col) => {
            if (col.id === fromColumnId) {
              return {
                ...col,
                sections: (col.sections as SectionData[]).map((sec) =>
                  sec.id === fromSectionId
                    ? { ...sec, boxes: sec.boxes.filter((b) => b.id !== boxId) }
                    : sec
                ),
              };
            }
            if (col.id === toColumnId) {
              return {
                ...col,
                sections: (col.sections as SectionData[]).map((sec) => {
                  if (sec.id === toSectionId) {
                    const newBoxes = [...sec.boxes];
                    const insertIndex = toIndex !== undefined ? toIndex : newBoxes.length;
                    newBoxes.splice(insertIndex, 0, box);
                    return { ...sec, boxes: newBoxes };
                  }
                  return sec;
                }),
              };
            }
            return col;
          });

          return { columns: newColumns };
        });
      },

      /**
       * Selection actions
       */
      selectBox: (boxId: string | null) => set({ selectedBoxId: boxId }),
      selectSection: (sectionId: string | null) => set({ selectedSectionId: sectionId }),
      selectColumn: (columnId: string | null) => set({ selectedColumnId: columnId }),

      /**
       * Clear entire layout
       */
      clearLayout: () =>
        set({
          columns: [],
          selectedBoxId: null,
          selectedSectionId: null,
          selectedColumnId: null,
        }),

      /**
       * Load layout from data
       */
      loadLayout: (columns: ColumnData[]) => set({ columns }),
    }),
    {
      name: 'explainator-layout',
      partialize: (state) => ({
        columns: state.columns,
      }),
    }
  )
);
