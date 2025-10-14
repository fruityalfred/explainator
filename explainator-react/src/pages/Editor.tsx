/**
 * Editor Page (Main Application)
 * Full layout editor with sidebar and canvas - Client-side only
 */

import { Sidebar } from '../components/Sidebar/Sidebar';
import { LayoutContainer } from '../components/Layout';
import { ModalManager } from '../components/ModalManager';
import './Editor.css';

export const Editor = () => {
  return (
    <div className="editor-container">
      <Sidebar />

      <div className="editor-main">
        <header className="editor-header">
          <h1 className="editor-title">🏢 Explainator - Ultimate Edition</h1>
          <div className="editor-user-info">
            <span className="user-name">Client Mode</span>
            <span className="user-tier">FULL ACCESS</span>
          </div>
        </header>

        <LayoutContainer />
      </div>

      {/* Render all modals at root level for proper overlay */}
      <ModalManager />
    </div>
  );
};
