/**
 * Grid Overlay Component
 * Shows grid pattern in canvas mode
 */

import { useCanvasStore } from '../../store/canvasStore';
import './GridOverlay.css';

export const GridOverlay = () => {
  const { gridSize, canvasWidth, canvasHeight } = useCanvasStore();

  return (
    <svg
      className="grid-overlay"
      width={canvasWidth}
      height={canvasHeight}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <defs>
        <pattern
          id="grid"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};
