/**
 * Layout Container
 * Main canvas area containing all columns
 */

import { Column } from './Column';
import { useLayoutStore } from '../../store/layoutStore';
import './LayoutContainer.css';

export const LayoutContainer = () => {
  const { columns, addColumn } = useLayoutStore();

  const handleAddColumn = () => {
    addColumn(`Column ${columns.length + 1}`);
  };

  return (
    <div className="layout-container">
      <div className="main-container">
        {columns.map((column, index) => (
          <Column key={column.id} data={column} index={index} />
        ))}

        <div className="add-column" onClick={handleAddColumn}>
          <div className="add-column-content">
            <span className="add-column-icon">+</span>
            <span className="add-column-text">Add Column</span>
          </div>
        </div>
      </div>
    </div>
  );
};
