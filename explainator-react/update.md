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
