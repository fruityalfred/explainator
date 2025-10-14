# Explainator React - Remaining Implementation Plan

**Ziel:** Feature-Parität mit Explainator.html (454KB, ~10.000 Zeilen)

**Status:** Segment 1-3 abgeschlossen (Setup, Auth, Core Layout)
**Offen:** Drag & Drop, Canvas Mode, Slides, Export, Projects, Split Columns

---

## ✅ Bereits implementiert (Segment 1-3)

### Segment 1: Infrastruktur
- Frontend: Vite + React 18 + TypeScript
- Backend: Node + Express + Prisma + PostgreSQL
- Type Definitions, Constants

### Segment 2: Authentication
- JWT Auth (Register, Login, Refresh)
- User Management mit Subscriptions (free/pro/enterprise)
- Protected Routes

### Segment 3: Core Layout Engine
- Layout Store (Zustand): Columns, Sections, Boxes CRUD
- Category Store: 10 Farbkategorien
- Components: Box, Section, Column, LayoutContainer, Sidebar
- Features: Add/Edit/Delete, Resize Columns, Color Picker, Inline-Edit
- LocalStorage Persistence

---

## 🚧 Segment 4: Drag & Drop System (BEGONNEN)

**Status:** In Arbeit

### 4.1 @dnd-kit Integration ✅ (Teilweise)
- [x] DndWrapper Component erstellt
- [x] Box Component mit useSortable
- [ ] Section Component mit Sortable Container
- [ ] Column Component draggable
- [ ] LayoutContainer mit DndContext

### 4.2 Draggable Boxes
- [ ] Boxes innerhalb Section sortieren
- [ ] Boxes zwischen Sections verschieben
- [ ] Visual Feedback (Drag Overlay)
- [ ] Drop Zones Highlighting

### 4.3 Draggable Sections
- [ ] Sections zwischen Columns verschieben
- [ ] Section Reordering innerhalb Column

### 4.4 Draggable Columns
- [ ] Columns im Canvas neu ordnen
- [ ] Horizontal Drag Support

---

## 📋 Segment 5: Canvas Mode (TODO)

### 5.1 Canvas Toggle & Absolute Positioning
- [ ] Canvas Store (canvasMode: boolean, canvasSize, canvasX/Y)
- [ ] Toggle Canvas Mode Button in Sidebar
- [ ] Column absolute positioning (canvasX, canvasY)
- [ ] Draggable Columns in Canvas (free positioning)
- [ ] Canvas Presets (HD 720p, Full HD, 4K, Instagram, etc.)

### 5.2 Grid & Snap-to-Grid
- [ ] Grid Overlay Component (40px grid)
- [ ] Snap-to-Grid Logic
- [ ] Grid Toggle Button

### 5.3 Alignment Guides
- [ ] Detect column alignment (horizontal/vertical)
- [ ] Show pink alignment lines
- [ ] Snap to alignment

### 5.4 SVG Connectors System
- [ ] ConnectorLayer Component (SVG overlay)
- [ ] Connector Store (connectors[])
- [ ] 8-directional anchors per column (top, bottom, left, right, corners)
- [ ] Add Connector Mode (click column → click column)
- [ ] Bezier curve path calculation
- [ ] Auto-routing (chooseBestAnchors)
- [ ] Connector selection & deletion
- [ ] Connector color picker

---

## 🎬 Segment 6: Slides & Export (TODO)

### 6.1 Slides System (PowerPoint-like)
- [ ] Slides Store (slides[], currentSlide, presentationMode)
- [ ] Slide Panel Component (thumbnail list)
- [ ] Create Slide (capture current layout)
- [ ] Slide Navigation (prev/next buttons)
- [ ] Slide Reordering (drag & drop)
- [ ] Delete/Duplicate Slide
- [ ] Presentation Mode (fullscreen, hide UI)
- [ ] Keyboard navigation (Arrow keys, ESC)

### 6.2 Export System
- [ ] PNG Export (html2canvas integration)
  - Hide UI elements
  - Auto-crop to content
  - 2x resolution
- [ ] Excel Export (xlsx integration)
  - Extract text from boxes
  - Organize by columns/sections
- [ ] Standalone HTML Export
  - Embed CSS & minimal JS
  - Self-contained file (~100KB)
- [ ] JSON Template Export/Import
  - Serialize layout with categories
  - File upload & parse

---

## 📊 Segment 7: Projects & Advanced Features (TODO)

### 7.1 Project Manager (Kanban Board)
- [ ] Projects Store (projects[], files[])
- [ ] Kanban Board Component
  - Project cards with status (active/archived)
  - File attachments (HTML, JSON)
  - Description, metadata
- [ ] Create/Edit/Delete Projects
- [ ] Link current template to project
- [ ] Export/Import Projects

### 7.2 Split Columns (2-8 Teile)
- [ ] Split Counter UI in Column Header
- [ ] applySplit() function (2-8 vertical parts)
- [ ] Column-Part Component
- [ ] Sections in split parts
- [ ] Unsplit (Alt + Drop)

### 7.3 Weitere Features aus Original
- [ ] Notes Box Modal (multiline textarea)
- [ ] Batch Import (text → multiple boxes)
- [ ] Image Upload für Image Boxes
- [ ] Line Selector Modal (5 types)
- [ ] Phone Mockup (Instagram preview)
- [ ] Formatting Modal (Font, Size, Bold, Italic, Align)
- [ ] Zoom Controls (Ctrl+Plus/Minus/0)
- [ ] Column/Section Visibility Toggle
- [ ] Keyboard Shortcuts
- [ ] Help Modal (bilingual DE/EN)
- [ ] i18n Support (react-i18next)

---

## 🔧 Technische Schulden & Refactoring

### Performance
- [ ] React.memo für Components
- [ ] useMemo/useCallback für teure Berechnungen
- [ ] Lazy Loading für Modals
- [ ] Virtualized Lists für große Layouts

### Testing
- [ ] Unit Tests (Vitest)
- [ ] Component Tests (React Testing Library)
- [ ] E2E Tests (Playwright)

### Backend API Endpoints (noch fehlend)
- [ ] `POST /api/templates` - Save template
- [ ] `GET /api/templates` - List templates
- [ ] `GET /api/templates/:id` - Load template
- [ ] `DELETE /api/templates/:id` - Delete template
- [ ] `POST /api/projects` - Create project
- [ ] `GET /api/projects` - List projects
- [ ] `PUT /api/projects/:id` - Update project
- [ ] `DELETE /api/projects/:id` - Delete project

### Subscription Features (Stripe)
- [ ] Feature Gates in Frontend (useSubscription hook)
- [ ] Stripe Checkout Integration
- [ ] Subscription Management Page
- [ ] Webhook Handler für Stripe Events
- [ ] Upgrade/Downgrade Flow

---

## 📅 Geschätzter Aufwand

| Segment | Aufgabe | Aufwand | Status |
|---------|---------|---------|--------|
| 4 | Drag & Drop | 2-3 Tage | 🚧 Begonnen |
| 5.1-5.3 | Canvas Mode & Grid | 2 Tage | ⏳ Offen |
| 5.4 | SVG Connectors | 2-3 Tage | ⏳ Offen |
| 6.1 | Slides System | 2 Tage | ⏳ Offen |
| 6.2 | Export System | 2 Tage | ⏳ Offen |
| 7.1 | Kanban Projects | 1-2 Tage | ⏳ Offen |
| 7.2 | Split Columns | 1 Tag | ⏳ Offen |
| 7.3 | Weitere Features | 3-4 Tage | ⏳ Offen |
| Backend | Template/Project API | 1-2 Tage | ⏳ Offen |
| Subscription | Stripe Integration | 1-2 Tage | ⏳ Offen |
| **TOTAL** | | **17-24 Tage** | |

---

## 🎯 Nächste Schritte (Priorität)

1. **Drag & Drop abschließen** (Segment 4)
   - Section & Column draggable machen
   - LayoutContainer mit DndContext wrappen
   - Testen & Bugfixes

2. **Canvas Mode** (Segment 5.1-5.3)
   - Canvas Store erstellen
   - Absolute positioning implementieren
   - Grid & Snap

3. **Connectors** (Segment 5.4)
   - SVG Layer
   - Anchor System
   - Bezier Pfade

4. **Slides** (Segment 6.1)
   - Slides Store
   - Capture/Restore
   - Presentation Mode

5. **Export** (Segment 6.2)
   - PNG (html2canvas)
   - Excel (xlsx)
   - JSON

6. **Projects** (Segment 7.1)
   - Kanban Board
   - File Management

7. **Polish** (Segment 7.3)
   - Modals, i18n, Shortcuts
   - Help, Zoom, etc.

---

**Letzte Aktualisierung:** 2025-10-14
**Entwickler:** Claude Code
**Original:** Explainator.html (454KB)
