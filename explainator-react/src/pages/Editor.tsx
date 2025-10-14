/**
 * Editor Page (Main Application)
 * Full layout editor with sidebar and canvas
 */

import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { LayoutContainer } from '../components/Layout';
import './Editor.css';

export const Editor = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="editor-container">
      <header className="editor-header">
        <h1 className="editor-title">Explainator Editor</h1>
        <div className="editor-user-info">
          <span className="user-name">{user?.name || user?.email || 'User'}</span>
          <span className="user-tier">{user?.subscription?.tier?.toUpperCase() || 'FREE'}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="editor-main">
        <Sidebar />
        <LayoutContainer />
      </div>
    </div>
  );
};
