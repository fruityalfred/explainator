/**
 * Notes Modal
 * Quick notes/scratch pad for users
 */

import { useState, useEffect } from 'react';
import './ExportModal.css';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTES_STORAGE_KEY = 'explainator-notes';

export const NotesModal = ({ isOpen, onClose }: NotesModalProps) => {
  const [notes, setNotes] = useState('');

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  // Save notes to localStorage
  const handleSave = () => {
    localStorage.setItem(NOTES_STORAGE_KEY, notes);
    alert('Notes saved!');
    onClose();
  };

  const handleClear = () => {
    if (confirm('Clear all notes? This cannot be undone.')) {
      setNotes('');
      localStorage.removeItem(NOTES_STORAGE_KEY);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content export-modal" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2>Notes</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="notes-area">Your Notes:</label>
            <textarea
              id="notes-area"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes here..."
              style={{
                width: '100%',
                minHeight: '300px',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'monospace',
                resize: 'vertical',
                lineHeight: '1.6',
              }}
            />
          </div>

          <div className="export-info">
            <p>
              Notes are automatically saved to your browser's local storage. They persist across sessions.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-warning" onClick={handleClear}>
            Clear All
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};
