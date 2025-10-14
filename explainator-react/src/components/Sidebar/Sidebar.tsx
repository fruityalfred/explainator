/**
 * Sidebar Navigation
 * Main navigation menu for the editor
 */

import { useState } from 'react';
import { useLayoutStore } from '../../store/layoutStore';
import { useCategoryStore } from '../../store/categoryStore';
import './Sidebar.css';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { addColumn, clearLayout, columns } = useLayoutStore();
  const { resetCategories } = useCategoryStore();

  const handleNewColumn = () => {
    addColumn(`Column ${columns.length + 1}`);
  };

  const handleClearAll = () => {
    if (confirm('Clear entire layout? This cannot be undone.')) {
      clearLayout();
    }
  };

  const handleResetCategories = () => {
    if (confirm('Reset categories to default?')) {
      resetCategories();
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? '▶' : '◀'}
      </button>

      {!isCollapsed && (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2>Explainator</h2>
            <p className="sidebar-subtitle">Layout Builder</p>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Content</h3>
            <button className="sidebar-btn btn-primary" onClick={handleNewColumn}>
              <span className="btn-icon">+</span>
              New Column
            </button>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Styling</h3>
            <button className="sidebar-btn btn-secondary" onClick={handleResetCategories}>
              <span className="btn-icon">🎨</span>
              Reset Colors
            </button>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-section-title">System</h3>
            <button className="sidebar-btn btn-warning" onClick={handleClearAll}>
              <span className="btn-icon">🗑️</span>
              Clear Layout
            </button>
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-stats">
              <div className="stat">
                <span className="stat-value">{columns.length}</span>
                <span className="stat-label">Columns</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {columns.reduce(
                    (sum, col) =>
                      sum +
                      (Array.isArray(col.sections[0])
                        ? 0
                        : (col.sections as any[]).length),
                    0
                  )}
                </span>
                <span className="stat-label">Sections</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
