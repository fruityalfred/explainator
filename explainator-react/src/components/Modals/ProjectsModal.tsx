/**
 * Projects Modal
 * Save/Load/Download/Upload complete projects (client-side)
 */

import { useState } from 'react';
import { useLayoutStore } from '../../store/layoutStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useCanvasStore } from '../../store/canvasStore';
import { useSlidesStore } from '../../store/slidesStore';
import './ExportModal.css';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectData {
  name: string;
  description: string;
  timestamp: number;
  version: string;
  layout: any;
  categories: any;
  canvas: any;
  slides: any;
}

const PROJECT_VERSION = '1.0.0';
const PROJECTS_STORAGE_KEY = 'explainator-projects';

export const ProjectsModal = ({ isOpen, onClose }: ProjectsModalProps) => {
  const layoutStore = useLayoutStore();
  const categoryStore = useCategoryStore();
  const canvasStore = useCanvasStore();
  const slidesStore = useSlidesStore();

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [savedProjects, setSavedProjects] = useState<ProjectData[]>(() => {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const captureProjectData = (): Omit<ProjectData, 'name' | 'description'> => {
    return {
      timestamp: Date.now(),
      version: PROJECT_VERSION,
      layout: {
        columns: layoutStore.columns,
      },
      categories: categoryStore.categories,
      canvas: {
        canvasMode: canvasStore.canvasMode,
        width: canvasStore.canvasWidth,
        height: canvasStore.canvasHeight,
        showGrid: canvasStore.showGrid,
        snapToGrid: canvasStore.snapToGrid,
        gridSize: canvasStore.gridSize,
        connectors: canvasStore.connectors,
      },
      slides: {
        slides: slidesStore.slides,
        currentSlideId: slidesStore.currentSlideId,
      },
    };
  };

  const handleSaveProject = () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    const projectData: ProjectData = {
      name: projectName,
      description: projectDescription,
      ...captureProjectData(),
    };

    const updatedProjects = [...savedProjects, projectData];
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
    setSavedProjects(updatedProjects);

    setProjectName('');
    setProjectDescription('');
    alert(`Project "${projectName}" saved!`);
  };

  const handleLoadProject = (project: ProjectData) => {
    try {
      // Restore layout
      layoutStore.columns.forEach((col) => {
        layoutStore.deleteColumn(col.id);
      });
      project.layout.columns.forEach((col: any) => {
        layoutStore.addColumn(col.title);
        const addedCol = layoutStore.columns[layoutStore.columns.length - 1];
        if (addedCol) {
          col.sections.forEach((section: any) => {
            layoutStore.addSection(addedCol.id, section.title);
            const colData = layoutStore.columns.find((c) => c.id === addedCol.id);
            const addedSection = colData?.sections[(colData.sections as any[]).length - 1];
            if (addedSection && 'boxes' in addedSection) {
              section.boxes.forEach((box: any) => {
                layoutStore.addBox(addedCol.id, (addedSection as any).id, box);
              });
            }
          });
        }
      });

      // Restore categories (replace entirely if present)
      if (project.categories && typeof project.categories === 'object') {
        categoryStore.loadCategories(project.categories);
      }

      // Restore canvas
      if (project.canvas.canvasMode !== canvasStore.canvasMode) {
        canvasStore.toggleCanvasMode();
      }
      if (project.canvas) {
        if (project.canvas.width && project.canvas.height) {
          canvasStore.setCustomCanvasSize(project.canvas.width, project.canvas.height);
        }
        if (Array.isArray(project.canvas.connectors)) {
          canvasStore.clearConnectors();
          project.canvas.connectors.forEach((conn: any) => {
            if (conn && conn.fromColumnId && conn.toColumnId && conn.fromAnchor && conn.toAnchor) {
              const { id, ...rest } = conn;
              // addConnector expects Omit<Connector,'id'>
              canvasStore.addConnector(rest);
            }
          });
        }
      }

      // Restore slides
      slidesStore.clearSlides();
      project.slides.slides.forEach((slide: any) => {
        slidesStore.addSlide(slide.name, slide.layoutSnapshot);
      });
      if (project.slides.currentSlideId) {
        slidesStore.setCurrentSlide(project.slides.currentSlideId);
      }

      alert(`Project "${project.name}" loaded!`);
      onClose();
    } catch (error) {
      console.error('Failed to load project:', error);
      alert('Failed to load project. It may be corrupted or incompatible.');
    }
  };

  const handleDeleteProject = (projectName: string) => {
    if (showDeleteConfirm === projectName) {
      const updatedProjects = savedProjects.filter((p) => p.name !== projectName);
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
      setSavedProjects(updatedProjects);
      setShowDeleteConfirm(null);
      alert('Project deleted');
    } else {
      setShowDeleteConfirm(projectName);
    }
  };

  const handleDownloadProject = (project: ProjectData) => {
    const dataStr = JSON.stringify(project, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleUploadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const projectData: ProjectData = JSON.parse(event.target?.result as string);

        // Validate project structure
        if (!projectData.name || !projectData.version || !projectData.layout) {
          throw new Error('Invalid project file');
        }

        // Check if project already exists
        const existingIndex = savedProjects.findIndex((p) => p.name === projectData.name);
        let updatedProjects: ProjectData[];

        if (existingIndex >= 0) {
          if (!confirm(`Project "${projectData.name}" already exists. Overwrite?`)) {
            return;
          }
          updatedProjects = [...savedProjects];
          updatedProjects[existingIndex] = projectData;
        } else {
          updatedProjects = [...savedProjects, projectData];
        }

        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));
        setSavedProjects(updatedProjects);
        alert(`Project "${projectData.name}" uploaded successfully!`);
      } catch (error) {
        console.error('Failed to upload project:', error);
        alert('Failed to upload project. Invalid file format.');
      }
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = '';
  };

  const handleDownloadCurrentState = () => {
    const projectData: ProjectData = {
      name: projectName || 'Untitled Project',
      description: projectDescription || 'Exported project',
      ...captureProjectData(),
    };

    handleDownloadProject(projectData);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content export-modal" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2>Project Manager</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Save Project Section */}
          <div className="form-group">
            <h4>Save Current Project</h4>
            <label htmlFor="project-name">Project Name:</label>
            <input
              id="project-name"
              type="text"
              className="form-input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
            />

            <label htmlFor="project-description" style={{ marginTop: '12px' }}>
              Description (optional):
            </label>
            <textarea
              id="project-description"
              className="form-input"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Enter project description..."
              style={{ minHeight: '60px', resize: 'vertical' }}
            />

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="btn btn-primary" onClick={handleSaveProject}>
                💾 Save Project
              </button>
              <button className="btn btn-secondary" onClick={handleDownloadCurrentState}>
                ⬇️ Download Current State
              </button>
            </div>
          </div>

          <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />

          {/* Upload Project Section */}
          <div className="form-group">
            <h4>Upload Project File</h4>
            <input
              type="file"
              accept=".json"
              onChange={handleUploadProject}
              className="form-input"
              style={{ padding: '8px' }}
            />
          </div>

          <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #ddd' }} />

          {/* Saved Projects Section */}
          <div>
            <h4 style={{ marginBottom: '12px' }}>Saved Projects ({savedProjects.length})</h4>
            {savedProjects.length === 0 ? (
              <div
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#999',
                  background: '#f9f9f9',
                  borderRadius: '8px',
                }}
              >
                No saved projects yet. Save your first project to get started!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {savedProjects.map((project) => (
                  <div
                    key={project.name}
                    style={{
                      padding: '16px',
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                          {project.name}
                        </div>
                        {project.description && (
                          <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                            {project.description}
                          </div>
                        )}
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          Saved: {new Date(project.timestamp).toLocaleString()}
                          <span style={{ marginLeft: '12px' }}>Version: {project.version}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-small btn-primary"
                          onClick={() => handleLoadProject(project)}
                          title="Load this project"
                        >
                          Load
                        </button>
                        <button
                          className="btn btn-small btn-secondary"
                          onClick={() => handleDownloadProject(project)}
                          title="Download as JSON"
                        >
                          Download
                        </button>
                        <button
                          className="btn btn-small btn-warning"
                          onClick={() => handleDeleteProject(project.name)}
                          title={showDeleteConfirm === project.name ? 'Click again to confirm' : 'Delete project'}
                          style={{
                            background: showDeleteConfirm === project.name ? '#e74c3c' : undefined,
                          }}
                        >
                          {showDeleteConfirm === project.name ? 'Confirm?' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="import-info" style={{ marginTop: '24px' }}>
            <h4>Project Manager Features:</h4>
            <ul>
              <li>
                <strong>Save Project:</strong> Save entire workspace to browser localStorage
              </li>
              <li>
                <strong>Load Project:</strong> Restore a saved project instantly
              </li>
              <li>
                <strong>Download:</strong> Export project as JSON file for backup or sharing
              </li>
              <li>
                <strong>Upload:</strong> Import project JSON files from disk
              </li>
              <li>Projects include: Layout, Categories, Canvas, Slides, and all content</li>
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
