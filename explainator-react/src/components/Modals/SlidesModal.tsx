/**
 * Slides Modal
 * Manage presentation slides (create, load, delete, reorder)
 */

import { useState } from 'react';
import { useSlidesStore } from '../../store/slidesStore';
import { useLayoutStore } from '../../store/layoutStore';
import './ExportModal.css';

interface SlidesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SlidesModal = ({ isOpen, onClose }: SlidesModalProps) => {
  const { slides, addSlide, deleteSlide, loadSlide, setCurrentSlide, currentSlideId } = useSlidesStore();
  const layoutStore = useLayoutStore();
  const [slideName, setSlideName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCreateSlide = () => {
    if (!slideName.trim()) {
      alert('Please enter a slide name');
      return;
    }

    // Capture current layout state as JSON
    const layoutSnapshot = JSON.stringify({
      columns: layoutStore.columns,
      // You can add more state here if needed
    });

    addSlide(slideName, layoutSnapshot);
    setSlideName('');
    alert(`Slide "${slideName}" created!`);
  };

  const handleLoadSlide = (id: string) => {
    const slide = loadSlide(id);
    if (!slide) {
      alert('Slide not found');
      return;
    }

    try {
      const layoutData = JSON.parse(slide.layoutSnapshot);

      // Restore layout state
      layoutStore.columns.forEach((col) => {
        layoutStore.deleteColumn(col.id);
      });

      layoutData.columns.forEach((col: any) => {
        // Reconstruct the column
        layoutStore.addColumn(col.title);
        const addedCol = layoutStore.columns[layoutStore.columns.length - 1];

        // Update column properties
        if (addedCol) {
          col.sections.forEach((section: any) => {
            layoutStore.addSection(addedCol.id, section.title);
            const addedSection =
              layoutStore.columns.find((c) => c.id === addedCol.id)?.sections[
                (layoutStore.columns.find((c) => c.id === addedCol.id)?.sections as any[]).length - 1
              ];

            if (addedSection && 'boxes' in addedSection) {
              section.boxes.forEach((box: any) => {
                layoutStore.addBox(addedCol.id, (addedSection as any).id, box);
              });
            }
          });
        }
      });

      setCurrentSlide(id);
      alert(`Loaded slide: ${slide.name}`);
      onClose();
    } catch (error) {
      console.error('Failed to load slide:', error);
      alert('Failed to load slide');
    }
  };

  const handleDeleteSlide = (id: string) => {
    if (showDeleteConfirm === id) {
      deleteSlide(id);
      setShowDeleteConfirm(null);
      alert('Slide deleted');
    } else {
      setShowDeleteConfirm(id);
    }
  };

  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content export-modal" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2>Slides Manager</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="slide-name">Create New Slide:</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="slide-name"
                type="text"
                className="form-input"
                value={slideName}
                onChange={(e) => setSlideName(e.target.value)}
                placeholder="Enter slide name..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateSlide();
                  }
                }}
              />
              <button className="btn btn-primary" onClick={handleCreateSlide}>
                Create
              </button>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <h4 style={{ marginBottom: '12px' }}>Saved Slides ({slides.length})</h4>
            {sortedSlides.length === 0 ? (
              <div
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#999',
                  background: '#f9f9f9',
                  borderRadius: '8px',
                }}
              >
                No slides yet. Create your first slide to get started!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sortedSlides.map((slide) => (
                  <div
                    key={slide.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: currentSlideId === slide.id ? '#e3f2fd' : '#f5f5f5',
                      borderRadius: '8px',
                      border: currentSlideId === slide.id ? '2px solid #4A90E2' : '1px solid #ddd',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{slide.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Slide {slide.order + 1}
                        {currentSlideId === slide.id && (
                          <span style={{ marginLeft: '8px', color: '#4A90E2', fontWeight: 600 }}>
                            (Current)
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-small btn-primary"
                        onClick={() => handleLoadSlide(slide.id)}
                        title="Load this slide"
                      >
                        Load
                      </button>
                      <button
                        className="btn btn-small btn-warning"
                        onClick={() => handleDeleteSlide(slide.id)}
                        title={showDeleteConfirm === slide.id ? 'Click again to confirm' : 'Delete slide'}
                        style={{
                          background: showDeleteConfirm === slide.id ? '#e74c3c' : undefined,
                        }}
                      >
                        {showDeleteConfirm === slide.id ? 'Confirm?' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="import-info" style={{ marginTop: '24px' }}>
            <h4>Slides System:</h4>
            <ul>
              <li>Save the current layout as a slide</li>
              <li>Load any slide to restore its layout</li>
              <li>Create presentations by switching between slides</li>
              <li>Slides are saved locally in your browser</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
