/**
 * Default color palette and categories
 */

import type { CategoryMap } from '../types';

export const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
  '#EF476F', '#FFD166', '#06FFA5', '#118AB2', '#073B4C',
  '#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557',
  '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51',
  '#8B4513', '#A0522D', '#D2691E'
];

export const DEFAULT_CATEGORIES: CategoryMap = {
  blue: {
    name: 'Blau',
    color1: '#3498db',
    color2: '#2980b9',
    textColor: '#ffffff'
  },
  green: {
    name: 'Grün',
    color1: '#2ecc71',
    color2: '#27ae60',
    textColor: '#ffffff'
  },
  red: {
    name: 'Rot',
    color1: '#e74c3c',
    color2: '#c0392b',
    textColor: '#ffffff'
  },
  yellow: {
    name: 'Gelb',
    color1: '#f1c40f',
    color2: '#f39c12',
    textColor: '#000000'
  },
  purple: {
    name: 'Lila',
    color1: '#9b59b6',
    color2: '#8e44ad',
    textColor: '#ffffff'
  },
  orange: {
    name: 'Orange',
    color1: '#e67e22',
    color2: '#d35400',
    textColor: '#ffffff'
  },
  gray: {
    name: 'Grau',
    color1: '#95a5a6',
    color2: '#7f8c8d',
    textColor: '#ffffff'
  },
  brown: {
    name: 'Braun',
    color1: '#8B4513',
    color2: '#A0522D',
    textColor: '#ffffff'
  },
  pink: {
    name: 'Rosa',
    color1: '#ff6b9d',
    color2: '#c44569',
    textColor: '#ffffff'
  },
  cyan: {
    name: 'Cyan',
    color1: '#00d2d3',
    color2: '#00a0a0',
    textColor: '#ffffff'
  }
};

export const HEADER_COLORS = DEFAULT_COLORS;

export const LINE_TYPES = [
  { id: 'line-thin', name: 'Dünn', height: '2px' },
  { id: 'line-medium', name: 'Medium', height: '4px' },
  { id: 'line-thick', name: 'Dick', height: '6px' },
  { id: 'line-dashed', name: 'Gestrichelt', style: 'dashed' },
  { id: 'line-dotted', name: 'Gepunktet', style: 'dotted' }
];
