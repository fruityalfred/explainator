/**
 * Editor Page (Main Application)
 * Placeholder for the layout editor
 */

import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const Editor = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Explainator Editor</h1>
        <div style={styles.userInfo}>
          <span style={styles.userName}>
            {user?.name || user?.email || 'User'}
          </span>
          <span style={styles.tier}>
            {user?.subscription?.tier?.toUpperCase() || 'FREE'}
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.placeholder}>
          <h2>Welcome to Explainator!</h2>
          <p>The editor will be implemented in Segment 3.</p>
          <div style={styles.status}>
            <h3>Your Account:</h3>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Name:</strong> {user?.name || 'Not set'}</p>
            <p><strong>Subscription:</strong> {user?.subscription?.tier}</p>
            <p><strong>Status:</strong> {user?.subscription?.status}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#f5f7fa',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userName: {
    fontSize: '14px',
  },
  tier: {
    background: 'rgba(255,255,255,0.2)',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background 0.3s',
  },
  main: {
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 100px)',
  },
  placeholder: {
    background: 'white',
    borderRadius: '12px',
    padding: '60px',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    maxWidth: '600px',
  },
  status: {
    marginTop: '30px',
    textAlign: 'left',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
};
