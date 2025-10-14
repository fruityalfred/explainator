/**
 * Canvas mode constants
 */

export const CANVAS_PRESETS = {
  'hd-720': { width: 1280, height: 720, name: 'HD 720p' },
  'full-hd': { width: 1920, height: 1080, name: 'Full HD 1080p' },
  '4k': { width: 3840, height: 2160, name: '4K UHD' },
  'instagram-post': { width: 1080, height: 1080, name: 'Instagram Post' },
  'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story' },
  'twitter-post': { width: 1200, height: 675, name: 'Twitter Post' },
  'linkedin-post': { width: 1200, height: 627, name: 'LinkedIn Post' },
  'a4-landscape': { width: 1754, height: 1240, name: 'A4 Querformat' },
  'a4-portrait': { width: 1240, height: 1754, name: 'A4 Hochformat' },
};

export const DEFAULT_CANVAS_SIZE = CANVAS_PRESETS['full-hd'];
export const GRID_SIZE = 40; // px
export const SNAP_THRESHOLD = 10; // px for alignment guides
export const MIN_COLUMN_WIDTH = 200; // px
export const MAX_COLUMN_WIDTH = 800; // px
