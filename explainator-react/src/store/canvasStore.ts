/**
 * Canvas Store (Zustand)
 * Manages canvas mode, grid, connectors
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CANVAS_PRESETS } from '../constants';

export interface Connector {
  id: string;
  fromColumnId: string;
  toColumnId: string;
  fromAnchor: string; // 'top' | 'bottom' | 'left' | 'right' | 'top-left' | etc.
  toAnchor: string;
  color?: string;
  strokeWidth?: number;
}

interface CanvasState {
  canvasMode: boolean;
  canvasWidth: number;
  canvasHeight: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  connectors: Connector[];
  connectorMode: boolean;
  selectedConnectorId: string | null;
  pendingFromColumn: string | null; // First column selected in connector mode

  // Actions
  toggleCanvasMode: () => void;
  setCanvasSize: (preset: string) => void;
  setCustomCanvasSize: (width: number, height: number) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;

  // Connector actions
  addConnector: (connector: Omit<Connector, 'id'>) => void;
  updateConnector: (id: string, updates: Partial<Connector>) => void;
  deleteConnector: (id: string) => void;
  selectConnector: (id: string | null) => void;
  toggleConnectorMode: () => void;
  clearConnectors: () => void;
  setPendingFromColumn: (columnId: string | null) => void;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, _get) => ({
      canvasMode: false,
      canvasWidth: 1920,
      canvasHeight: 1080,
      showGrid: true,
      snapToGrid: true,
      gridSize: 40,
      connectors: [],
      connectorMode: false,
      selectedConnectorId: null,
      pendingFromColumn: null,

      toggleCanvasMode: () => {
        set((state) => ({ canvasMode: !state.canvasMode }));
      },

      setCanvasSize: (preset: string) => {
        const presetData = CANVAS_PRESETS[preset as keyof typeof CANVAS_PRESETS];
        if (presetData) {
          set({
            canvasWidth: presetData.width,
            canvasHeight: presetData.height,
          });
        }
      },

      setCustomCanvasSize: (width: number, height: number) => {
        set({ canvasWidth: width, canvasHeight: height });
      },

      toggleGrid: () => {
        set((state) => ({ showGrid: !state.showGrid }));
      },

      toggleSnapToGrid: () => {
        set((state) => ({ snapToGrid: !state.snapToGrid }));
      },

      addConnector: (connector) => {
        const newConnector: Connector = {
          ...connector,
          id: `connector-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        set((state) => ({
          connectors: [...state.connectors, newConnector],
        }));
      },

      updateConnector: (id: string, updates: Partial<Connector>) => {
        set((state) => ({
          connectors: state.connectors.map((conn) =>
            conn.id === id ? { ...conn, ...updates } : conn
          ),
        }));
      },

      deleteConnector: (id: string) => {
        set((state) => ({
          connectors: state.connectors.filter((conn) => conn.id !== id),
          selectedConnectorId: state.selectedConnectorId === id ? null : state.selectedConnectorId,
        }));
      },

      selectConnector: (id: string | null) => {
        set({ selectedConnectorId: id });
      },

      toggleConnectorMode: () => {
        set((state) => ({ connectorMode: !state.connectorMode, pendingFromColumn: null }));
      },

      clearConnectors: () => {
        set({ connectors: [], selectedConnectorId: null });
      },

      setPendingFromColumn: (columnId: string | null) => {
        set({ pendingFromColumn: columnId });
      },
    }),
    {
      name: 'explainator-canvas',
    }
  )
);
