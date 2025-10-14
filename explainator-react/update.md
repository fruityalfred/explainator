# Explainator React Migration - Update Log

**Letztes Update:** 2025-10-14
**Aktueller Stand:** Segment 1 - Projekt-Setup & Infrastruktur

---

## 🎯 Projektziel

Migration von Explainator.html (454KB Single-File Vanilla JS App) nach React/TypeScript für Server-Hosting mit Benutzerverwaltung und Subscription-Modell.

---

## 📋 Gesamtübersicht - 7 Segmente

1. ✅ **Segment 1:** Projekt-Setup & Infrastruktur (Woche 1-2) - **IN ARBEIT**
2. ⏳ **Segment 2:** Authentication & User Management (Woche 3)
3. ⏳ **Segment 3:** Core Layout Engine (Woche 4-5)
4. ⏳ **Segment 4:** Drag & Drop System (Woche 6)
5. ⏳ **Segment 5:** Canvas Mode & Connectors (Woche 7)
6. ⏳ **Segment 6:** Export/Import System (Woche 8)
7. ⏳ **Segment 7:** Subscription System (Woche 9-10)

---

## ✅ Segment 1: Projekt-Setup & Infrastruktur

### 1.1 Frontend Setup (React + TypeScript + Vite)

**Status:** ✅ Abgeschlossen

**Erstellte Struktur:**
```
explainator-react/
├── src/
│   ├── components/
│   │   ├── Layout/      (Box, Column, Section Komponenten)
│   │   ├── Canvas/      (Canvas Mode & Connectors)
│   │   ├── Modals/      (Dialoge für Add Box, Categories etc.)
│   │   ├── Sidebar/     (Navigation)
│   │   ├── Slides/      (Präsentations-Slides)
│   │   ├── Projects/    (Kanban Board)
│   │   └── UI/          (Wiederverwendbare UI-Komponenten)
│   ├── hooks/           (Custom React Hooks)
│   ├── store/           (Zustand State Management)
│   ├── types/           (TypeScript Definitionen)
│   ├── utils/           (Helper-Funktionen)
│   ├── constants/       (Konstanten, Farben, Canvas-Presets)
│   └── pages/           (Seiten/Views)
```

**Installierte Dependencies:**
- ✅ React 18 + TypeScript
- ✅ Vite (Build-Tool)
- ✅ Zustand (State Management)
- ✅ @dnd-kit/* (Drag & Drop)
- ✅ react-color (Color Picker)
- ✅ html2canvas (PNG Export)
- ✅ xlsx (Excel Export)
- ✅ react-hotkeys-hook (Keyboard Shortcuts)
- ✅ i18next (Mehrsprachigkeit)
- ✅ axios + @tanstack/react-query (API Kommunikation)
- ✅ react-router-dom (Routing)

**Erstellte Type-Definitionen:**
- ✅ `types/layout.types.ts` - Layout-Strukturen (BoxData, ColumnData, SectionData, etc.)
- ✅ `types/user.types.ts` - User, Subscription, AuthResponse
- ✅ `constants/colors.ts` - DEFAULT_CATEGORIES, DEFAULT_COLORS, LINE_TYPES
- ✅ `constants/canvas.ts` - CANVAS_PRESETS (HD, 4K, Social Media Formate)

---

### 1.2 Backend Setup (Node + Express + TypeScript)

**Status:** ✅ Abgeschlossen

**Erstellte Struktur:**
```
backend/
├── src/
│   ├── controllers/     (Request Handler)
│   ├── routes/          (API Routes)
│   ├── middleware/      (Auth, Validation)
│   ├── services/        (Business Logic)
│   ├── utils/           (Helper-Funktionen)
│   └── types/           (TypeScript Interfaces)
├── prisma/
│   └── schema.prisma    (Datenbank-Schema)
├── tsconfig.json
├── package.json
├── .env.example
└── .gitignore
```

**Installierte Dependencies:**
- ✅ Express 5
- ✅ TypeScript + ts-node
- ✅ Prisma + @prisma/client (ORM)
- ✅ bcryptjs (Password Hashing)
- ✅ jsonwebtoken (JWT Auth)
- ✅ express-validator (Input Validation)
- ✅ cors, helmet (Security)
- ✅ stripe (Payment Processing)
- ✅ dotenv (Environment Variables)
- ✅ nodemon (Dev Server)

**Package.json Scripts:**
```json
{
  "dev": "nodemon --exec ts-node src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:studio": "prisma studio"
}
```

---

### 1.3 Datenbank-Schema (Prisma)

**Status:** ✅ Abgeschlossen

**Definierte Models:**

#### User
- `id` (UUID)
- `email` (unique)
- `password` (hashed)
- `name`
- Relations: subscription, templates[], projects[]

#### Subscription
- `id` (UUID)
- `userId` (unique, foreign key)
- `tier` (free/pro/enterprise)
- `status` (active/canceled/expired/trialing)
- `stripeId` (Stripe Customer ID)
- `expiresAt` (DateTime)

#### Template
- `id` (UUID)
- `userId` (foreign key)
- `name`
- `data` (Json - Layout JSON)
- `thumbnail` (Base64 oder URL)
- `isPublic` (Boolean)
- Indexes: userId, isPublic

#### Project
- `id` (UUID)
- `userId` (foreign key)
- `name`
- `status` (active/archived)
- `description`
- `data` (Json - Kanban Board Data)
- Indexes: userId, status

**Beziehungen:**
- User 1:1 Subscription
- User 1:N Templates
- User 1:N Projects
- Cascade Delete aktiviert (bei User-Löschung werden alle verknüpften Daten gelöscht)

---

## 🎬 Nächste Schritte

### Segment 2: Authentication & User Management

**Als Nächstes zu implementieren:**

1. **Backend API Endpoints:**
   - `POST /api/auth/register` - Benutzerregistrierung
   - `POST /api/auth/login` - Login (JWT Token)
   - `POST /api/auth/refresh` - Token Refresh
   - `GET /api/auth/me` - Current User
   - `POST /api/auth/logout` - Logout

2. **Middleware:**
   - JWT Validation Middleware
   - Role-based Access Control (free/pro/enterprise)
   - Rate Limiting

3. **Frontend Components:**
   - Login/Register Forms
   - Protected Routes
   - Auth Context/Store
   - User Profile Page

4. **Prisma Migration:**
   - Erste Migration erstellen (`npm run prisma:migrate`)
   - Datenbank initialisieren

---

## 📊 Feature-Übersicht aus Original (Explainator.html)

### Kern-Features identifiziert:
- ✅ **Spalten-System:** Drag & Drop, Resize, Split (2-8 Teile)
- ✅ **Sections:** Drag between Columns, Color Picker
- ✅ **Boxes:** Text/Image/Line, Full/Half-Width, Auto-Expand
- ✅ **Categories:** 10 Default-Kategorien mit Gradients
- ✅ **Canvas Mode:** Absolute Positioning, Grid, Alignment Guides
- ✅ **Connectors:** SVG Arrows zwischen Columns
- ✅ **Slides:** PowerPoint-like Presentation Mode
- ✅ **Export:** PNG, Excel, Standalone HTML, JSON
- ✅ **Kanban Board:** Project Management System
- ✅ **Mehrsprachig:** DE/EN

### Komplexität:
- ~10.000 Zeilen JavaScript
- ~1.900 Zeilen CSS
- 60+ React Components geplant
- 15+ Custom Hooks
- 5+ Zustand Stores

---

## ⚙️ Technologie-Stack

### Frontend:
- React 18 + TypeScript
- Vite (Build Tool)
- Zustand (State)
- @dnd-kit (Drag & Drop)
- TailwindCSS oder styled-components (TBD)

### Backend:
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL

### Deployment (geplant):
- VServer (Ubuntu 22.04)
- Nginx (Reverse Proxy)
- PM2 (Process Manager)
- Let's Encrypt (SSL)

---

## 🔐 Subscription-Modell (Feature Gates)

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Templates | 5 | 50 | ∞ |
| Projects | 2 | 20 | ∞ |
| Canvas Mode | ❌ | ✅ | ✅ |
| Export PNG | ✅ | ✅ | ✅ |
| Export Excel | ❌ | ✅ | ✅ |
| Standalone HTML | ❌ | ✅ | ✅ |
| Slides | ❌ | ✅ | ✅ |
| Connectors | ❌ | ✅ | ✅ |
| Collaboration | ❌ | ❌ | ✅ |

**Preise (geplant):**
- Free: 0€
- Pro: 9.99€/Monat
- Enterprise: 29.99€/Monat

---

## 📝 Notizen

### Wichtige Erkenntnisse aus Original-Code:
1. **Drag & Drop:** 4 draggable Typen (Boxes, Sections, Columns, Slides)
2. **Split Columns:** Dynamisch 2-8 vertikale Unterteilungen
3. **Canvas Positioning:** Toggle zwischen Flow-Layout und Absolute Positioning
4. **SVG Connectors:** 8-directional Anchors mit Auto-Routing
5. **LocalStorage:** Aktuell alle Daten lokal gespeichert (wird zu Server-DB)

### Herausforderungen:
- ⚠️ Komplexes Drag & Drop mit 4 verschiedenen Typen
- ⚠️ Canvas-Modus: Umschalten zwischen relative/absolute Positioning
- ⚠️ State Persistence: LocalStorage → PostgreSQL Migration
- ⚠️ Export-Fidelity: Exakte visuelle Ausgabe beibehalten

---

## 🐛 Bekannte Probleme

*Noch keine - Projekt gerade gestartet*

---

## ✨ Git Commits

### Commit 1: "Initial project setup - Frontend & Backend structure"
**Datum:** 2025-10-14
**Inhalt:**
- Vite React TypeScript Projekt initialisiert
- Backend Express + Prisma Setup
- Type Definitions (layout.types.ts, user.types.ts)
- Prisma Schema (User, Subscription, Template, Project)
- Constants (colors.ts, canvas.ts)
- Package.json Scripts konfiguriert
- .env.example und .gitignore erstellt

---

**Nächster Update:** Nach Abschluss von Segment 2 (Authentication)

---

## ✅ Segment 2: Authentication & User Management

**Status:** ✅ Abgeschlossen
**Datum:** 2025-10-14

### 2.1 Backend Authentication System

**Implementierte Dateien:**

1. **`backend/src/utils/prisma.ts`**
   - Prisma Client Singleton
   - Connection Pool Management
   - Development Logging

2. **`backend/src/services/auth.service.ts`**
   - User Registration mit Free-Tier Subscription
   - Login mit bcrypt Password Verification
   - JWT Token Generation (Access + Refresh)
   - Token Refresh Logic
   - User Retrieval by ID
   - Token Expiry: Access 15min, Refresh 7d

3. **`backend/src/controllers/auth.controller.ts`**
   - `POST /api/auth/register` - Benutzer registrieren
   - `POST /api/auth/login` - Benutzer einloggen
   - `POST /api/auth/refresh` - Access Token erneuern
   - `GET /api/auth/me` - Aktuellen Benutzer abrufen (protected)
   - `POST /api/auth/logout` - Logout (client-side)
   - Express-Validator Integration

4. **`backend/src/middleware/auth.middleware.ts`**
   - `authMiddleware` - JWT Verification für protected Routes
   - `optionalAuthMiddleware` - Optionale Auth für public/mixed Routes
   - User Info wird an Request attached (userId, userEmail)

5. **`backend/src/routes/auth.routes.ts`**
   - Route-Definitionen mit Validation Rules
   - Email/Password Validation
   - Middleware-Stacking

6. **`backend/src/index.ts`**
   - Express Server Setup
   - CORS Configuration (Frontend URL)
   - Helmet Security Headers
   - JSON Body Parser (10MB Limit)
   - Health Check Endpoint (`/health`)
   - Global Error Handler
   - Graceful Shutdown (SIGINT/SIGTERM)

### 2.2 Frontend Authentication System

**Implementierte Dateien:**

1. **`src/store/authStore.ts`** (Zustand)
   - User State Management
   - `register()` - Registrierung mit auto-login
   - `login()` - Login mit JWT Tokens
   - `logout()` - Clear user state
   - `refreshAccessToken()` - Token Refresh
   - `fetchCurrentUser()` - User-Daten abrufen
   - Zustand Persist (localStorage)
   - Axios Interceptors:
     - Auto-attach Bearer Token
     - Auto-refresh on 401 errors

2. **`src/pages/Login.tsx`**
   - Login Form mit Email/Password
   - Error Display
   - Loading States
   - Link zu Register
   - Styled mit Inline-Styles (Gradient Theme)

3. **`src/pages/Register.tsx`**
   - Registration Form (Name, Email, Password, Confirm)
   - Password Match Validation
   - Free Tier Info Display
   - Error Handling
   - Auto-login nach Registration

4. **`src/pages/Editor.tsx`**
   - Placeholder für Main Application
   - Header mit User Info
   - Subscription Tier Display
   - Logout Button
   - User Account Status Display

5. **`src/components/ProtectedRoute.tsx`**
   - Route Guard Component
   - Redirect zu `/login` wenn nicht authenticated
   - Auto-fetch current user on mount

6. **`src/App.tsx`**
   - React Router Setup (BrowserRouter)
   - Public Routes: `/login`, `/register`
   - Protected Routes: `/editor`
   - Default Redirect: `/` → `/editor`
   - 404 → `/editor`

7. **`.env.local`**
   - `VITE_API_URL=http://localhost:3001/api`

### 2.3 Prisma Client Generation

```bash
cd backend
npx prisma generate
# ✅ Prisma Client generiert in node_modules/@prisma/client
```

### 2.4 Environment Setup

**Backend `.env`:**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/explainator_dev?schema=public"
JWT_ACCESS_SECRET="dev-secret-access-key-change-in-production-12345"
JWT_REFRESH_SECRET="dev-secret-refresh-key-change-in-production-67890"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

### 2.5 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | ❌ | Register new user |
| `/api/auth/login` | POST | ❌ | Login user |
| `/api/auth/refresh` | POST | ❌ | Refresh access token |
| `/api/auth/me` | GET | ✅ | Get current user |
| `/api/auth/logout` | POST | ✅ | Logout (placeholder) |
| `/health` | GET | ❌ | Health check |

### 2.6 Security Features

- ✅ Password Hashing mit bcrypt (10 rounds)
- ✅ JWT Tokens (Access 15min, Refresh 7d)
- ✅ Bearer Token Authentication
- ✅ CORS Protection (Frontend URL whitelist)
- ✅ Helmet Security Headers
- ✅ Input Validation (express-validator)
- ✅ SQL Injection Protection (Prisma ORM)
- ✅ Automatic Token Refresh on 401

### 2.7 User Flow

1. **Registration:**
   - User füllt Register-Form aus
   - Backend erstellt User + Free Subscription
   - JWT Tokens werden generiert
   - Frontend speichert Tokens in localStorage
   - Auto-Redirect zu `/editor`

2. **Login:**
   - User füllt Login-Form aus
   - Backend verifiziert Credentials
   - JWT Tokens werden generiert
   - Frontend speichert Tokens
   - Redirect zu `/editor`

3. **Protected Route Access:**
   - User navigiert zu `/editor`
   - ProtectedRoute prüft `isAuthenticated`
   - Falls nicht authenticated → Redirect zu `/login`
   - Falls authenticated → Render Editor

4. **Auto Token Refresh:**
   - API Request mit abgelaufenem Access Token
   - 401 Error von Backend
   - Axios Interceptor fängt 401 ab
   - Auto-Refresh mit Refresh Token
   - Original Request wird mit neuem Token wiederholt

5. **Logout:**
   - User klickt Logout Button
   - Frontend löscht User State + Tokens
   - Redirect zu `/login`

### 2.8 Testing Commands

**Backend starten:**
```bash
cd backend
npm run dev
# Server läuft auf http://localhost:3001
```

**Frontend starten:**
```bash
npm run dev
# App läuft auf http://localhost:5173
```

**Prisma Studio (DB GUI):**
```bash
cd backend
npm run prisma:studio
# Öffnet http://localhost:5555
```

---

## 🎬 Nächste Schritte

### Segment 3: Core Layout Engine (Woche 4-5)

**Als Nächstes zu implementieren:**

1. **Layout Store (Zustand):**
   - Columns State Management
   - Sections State Management
   - Boxes State Management
   - Add/Delete/Update Actions

2. **Core Components:**
   - `<Column />` - Spalten mit Resize Handle
   - `<Section />` - Sections mit Title & Color
   - `<Box />` - Content Boxes (Text/Image/Line)
   - `<AddButton />` - Hinzufügen-Buttons

3. **Category System:**
   - Category Store
   - Color Picker Component
   - Apply Category to Box

4. **Basic Layout:**
   - Sidebar Navigation
   - Main Canvas Container
   - Add Column/Section/Box Flow

5. **Persistence:**
   - Save Layout to Backend (Template API)
   - Load Layout from Backend

---

## ✨ Git Commits

### Commit 2: "Segment 2 complete - Authentication & User Management"
**Datum:** 2025-10-14
**Inhalt:**
- ✅ Backend Auth Service (Register, Login, Token Refresh)
- ✅ Auth Controller & Routes
- ✅ JWT Middleware (authMiddleware, optionalAuthMiddleware)
- ✅ Express Server Setup mit Health Check
- ✅ Prisma Client Integration
- ✅ Frontend Auth Store (Zustand + Persist)
- ✅ Login/Register Pages mit Validation
- ✅ Protected Route Component
- ✅ Editor Placeholder Page
- ✅ React Router Setup
- ✅ Axios Interceptors (Auto-Token, Auto-Refresh)
- ✅ Environment Configuration (.env, .env.local)

**Technische Details:**
- JWT Access Token: 15min Expiry
- JWT Refresh Token: 7d Expiry
- bcrypt Password Hashing (10 rounds)
- Auto-Registration mit Free Tier Subscription
- Token Auto-Refresh on 401 Errors
- Zustand Persist für Auth State

---

**Nächster Update:** Nach Abschluss von Segment 3 (Core Layout Engine)

---

## ✅ Segment 3: Core Layout Engine

**Status:** ✅ Abgeschlossen
**Datum:** 2025-10-14

### 3.1 State Management (Zustand Stores)

**Implementierte Stores:**

1. **layoutStore.ts** - Komplettes Layout State Management mit Columns/Sections/Boxes CRUD
2. **categoryStore.ts** - Category/Color Management mit 10 Default-Farben

### 3.2 Core Layout Components

**Box Component:** Text/Image/Line mit Inline-Edit, Delete, Resize
**Section Component:** Editable Title, Box Container, Add Box Button
**Column Component:** Resizable, Color Picker, Delete, Add Section
**LayoutContainer:** Main Canvas mit Add Column Button
**Sidebar:** Collapsible Navigation mit Stats

### 3.3 Features Implemented

- Add/Edit/Delete Columns, Sections, Boxes
- Resize Columns (200-800px)
- Color Picker (28 colors)
- Inline Editing (Doppelklick)
- LocalStorage Persistence
- Category Gradients

---

**Nächster Update:** Nach Segment 4 (Drag & Drop)

---

## 🚧 Segment 4: Drag & Drop System (IN ARBEIT)

**Status:** 🚧 Work in Progress
**Datum:** 2025-10-14

### 4.1 @dnd-kit Integration (Grundlage gelegt)

**Implementierte Dateien:**

1. **DndWrapper.tsx** - Drag & Drop Context
   - DndContext Setup mit sensors
   - PointerSensor (8px activation distance)
   - handleDragStart/handleDragEnd Logic
   - DragOverlay für visuelles Feedback
   - Unterstützt 3 Drag-Typen: box, section, column

2. **Box.tsx** - Updated mit useSortable
   - useSortable Hook integriert
   - attributes, listeners für drag
   - transform & transition CSS
   - isDragging opacity effect
   - Index parameter hinzugefügt

3. **Section.tsx** - Sortable Container
   - useDroppable Hook (drop zone)
   - SortableContext für boxes
   - isOver state → drag-over styling
   - Index parameter

4. **Column.tsx** - Index-Weitergabe
   - Sections erhalten index prop
   - Vorbereitet für column drag

5. **LayoutContainer.tsx** - DndWrapper Integration
   - Wrapped mit DndWrapper

### 4.2 Status

✅ **Funktioniert:**
- DnD Grundstruktur steht
- Drag detection
- Store hat moveBox/moveSection/moveColumn

⚠️ **TODO:**
- DnD Testing & Debugging
- Visual Feedback verbessern
- Section drag implementieren
- Column drag implementieren

---

## 📋 IMPLEMENTATION_PLAN.md

**Komplette Roadmap erstellt** mit verbleibenden Features:

**Offen (17-24 Tage geschätzt):**
- Canvas Mode (absolute positioning, grid, snap, alignment)
- SVG Connectors System (8-directional anchors, bezier paths)
- Slides System (PowerPoint-like, fullscreen presentation)
- Export System (PNG html2canvas, Excel xlsx, HTML, JSON)
- Project Manager (Kanban Board, file attachments)
- Split Columns (2-8 vertikale Teile)
- Modals (Notes, Batch Import, Image Upload, etc.)
- i18n (DE/EN), Zoom, Shortcuts, Help

**Details:** Siehe [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)

---

**Nächster Update:** Nach vollständiger DnD Implementation
