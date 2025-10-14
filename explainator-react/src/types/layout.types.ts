/**
 * Type definitions for the Explainator layout system
 */

export interface BoxData {
  id: string;
  text: string;
  type: string; // Category key
  width: 'full-width' | 'half-width';
  lines: 1 | 2 | 3;
  baseLines: number;
  dynamic: boolean; // Auto-expand on overflow
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  isImage?: boolean;
  imageSrc?: string;
  isLine?: boolean;
  lineClass?: string;
  resized?: boolean;
  heightPx?: number;
}

export interface SectionData {
  id: string;
  title: string;
  color?: string;
  boxes: BoxData[];
}

export interface ColumnData {
  id: string;
  title: string;
  width: string; // e.g., "400px"
  splitState: 'normal' | 'split-2' | 'split-3' | 'split-4' | 'split-5' | 'split-6' | 'split-7' | 'split-8';
  splitParts: number;
  headerColor?: string;
  sections: SectionData[] | SectionData[][]; // Normal or split mode
  canvasX?: number; // Canvas mode position
  canvasY?: number;
  hideColumnHeader?: boolean;
  hideSectionHeaders?: boolean;
}

export interface CategoryData {
  name: string;
  color1: string; // Gradient start
  color2: string; // Gradient end
  textColor: string;
}

export interface CategoryMap {
  [key: string]: CategoryData;
}

export interface FontSettings {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
}

export interface ConnectorData {
  id: string;
  fromColumnId: string;
  toColumnId: string;
  fromAnchor: AnchorPosition;
  toAnchor: AnchorPosition;
  color?: string;
  strokeWidth?: number;
}

export type AnchorPosition = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface CanvasConfig {
  enabled: boolean;
  width: number;
  height: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  connectors: ConnectorData[];
}

export interface SlideData {
  id: string;
  timestamp: number;
  name: string;
  categories: CategoryMap;
  layout: LayoutData;
  fontSettings: FontSettings;
  canvas?: CanvasConfig;
}

export interface LayoutData {
  columns: ColumnData[];
  categories: CategoryMap;
  fontSettings: FontSettings;
  canvas?: CanvasConfig;
  slides?: SlideData[];
}

export interface ProjectData {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'archived';
  description?: string;
  files: ProjectFile[];
  createdAt: number;
  updatedAt: number;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'html' | 'json';
  data: string;
  createdAt: number;
}
