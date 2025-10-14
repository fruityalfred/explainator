/**
 * Layout Container
 * Main canvas area containing all columns
 */

import { Column } from './Column';
import { DndWrapper } from './DndWrapper';
import { GridOverlay } from '../Canvas/GridOverlay';
import { ConnectorLayer } from '../Canvas/ConnectorLayer';
import { useLayoutStore } from '../../store/layoutStore';
import { useCanvasStore } from '../../store/canvasStore';
import './LayoutContainer.css';

export const LayoutContainer = () => {
  const { columns, addColumn } = useLayoutStore();
  const { canvasMode, canvasWidth, canvasHeight, showGrid } = useCanvasStore();

  const handleAddColumn = () => {
    addColumn(`Column ${columns.length + 1}`);
  };

  return (
    <div className="layout-container">
      <DndWrapper>
        <div
          className={`main-container ${canvasMode ? 'canvas-mode' : ''}`}
          style={
            canvasMode
              ? {
                  width: `${canvasWidth}px`,
                  height: `${canvasHeight}px`,
                  position: 'relative',
                  background: '#ffffff',
                  margin: '20px auto',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }
              : {}
          }
        >
          {canvasMode && showGrid && <GridOverlay />}

          {columns.map((column, index) => (
            <Column key={column.id} data={column} index={index} />
          ))}

          {!canvasMode && (
            <div className="add-column" onClick={handleAddColumn}>
              <div className="add-column-content">
                <span className="add-column-icon">+</span>
                <span className="add-column-text">Add Column</span>
              </div>
            </div>
          )}

          {canvasMode && <ConnectorLayer />}
        </div>

        {canvasMode && (
          <div className="canvas-toolbar">
            <button className="canvas-btn" onClick={handleAddColumn}>
              + Add Column
            </button>
          </div>
        )}
      </DndWrapper>
    </div>
  );
};
