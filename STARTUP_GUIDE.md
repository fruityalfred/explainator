# Explainator - Startup Guide

## 📦 Project Structure

```
explainator/
├── Explainator.html           # Original single-file HTML version (legacy)
├── explainator-react/         # React frontend (Vite + TypeScript)
│   ├── src/                   # React source code
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   └── backend/               # Node.js backend (Express + Prisma)
│       ├── src/               # Backend source code
│       ├── prisma/            # Database schema
│       └── package.json       # Backend dependencies
└── STARTUP_GUIDE.md           # This file
```

---

## 🚀 What We Have

### 1. **Frontend - React Web App**
- **Location**: `explainator-react/`
- **Tech Stack**: React 18 + TypeScript + Vite + Zustand
- **Features**:
  - Complete Explainator UI (100% feature parity)
  - Split columns, Canvas mode, Export/Import
  - Slides system, Project Manager, Modals
  - **All data stored in localStorage (client-side)**

### 2. **Backend - REST API**
- **Location**: `explainator-react/backend/`
- **Tech Stack**: Node.js + Express + TypeScript + Prisma
- **Purpose**: User authentication & subscription management **ONLY**
- **Note**: Currently scaffolded but not fully implemented
- **Database**: PostgreSQL (via Prisma schema defined)

### 3. **Original HTML Version**
- **Location**: `Explainator.html`
- **Purpose**: Original single-file implementation (reference only)
- **Status**: Legacy - no longer actively developed

---

## 🏃 How to Start / Restart

### **Frontend Only (Recommended for Development)**

The frontend runs independently and stores all data in browser localStorage. Perfect for development and testing!

#### Start Frontend:
```bash
cd explainator-react
npm install           # First time only
npm run dev
```

**Frontend will be available at:** `http://localhost:5173` (or `5174` if 5173 is busy)

#### Restart Frontend:
```bash
# Press Ctrl+C to stop the dev server, then:
npm run dev
```

---

### **Backend (Optional - For Future Auth/Subscriptions)**

The backend is currently scaffolded but not integrated. You'll need it when implementing user authentication and subscription features.

#### Prerequisites:
1. **PostgreSQL Database** running locally or remotely
2. **Environment variables** configured in `backend/.env`

#### Setup Backend:
```bash
cd explainator-react/backend
npm install                    # First time only
npx prisma generate            # Generate Prisma client
npx prisma migrate dev         # Run database migrations
```

#### Start Backend:
```bash
npm run dev
```

**Backend API will be available at:** `http://localhost:3000` (default port)

#### Restart Backend:
```bash
# Press Ctrl+C to stop, then:
npm run dev
```

---

## 📝 Current Status

### ✅ **COMPLETE - Frontend (React)**
- Layout system (columns, sections, boxes)
- Split columns (2-8 vertical splits)
- Canvas mode with absolute positioning
- Export/Import (JSON, PDF, PNG, Excel)
- Slides system (presentation mode)
- Project Manager (save/load/download/upload)
- Additional modals (Notes, Batch Import, Image Upload, Line Selector)
- Category management (custom colors)
- Drag & drop (full @dnd-kit integration)

### 🚧 **SCAFFOLDED - Backend**
- Express server setup
- Prisma database schema:
  - User model (id, email, password, name)
  - Subscription model (tier, status, stripeId)
  - Template model (saved templates)
  - Project model (saved projects)
- Routes and controllers structure
- JWT authentication helpers
- Stripe integration helpers

### 📋 **TODO - Backend Integration**
- Implement authentication endpoints (register, login, logout)
- Implement subscription endpoints (create, upgrade, cancel)
- Connect frontend to backend API
- Add protected routes for authenticated features
- Implement Stripe payment flow
- Optional: Template/Project cloud sync

---

## 🔧 Development Workflow

### **Daily Development (Frontend Only)**
```bash
# Terminal 1 - Frontend
cd explainator-react
npm run dev
```

### **Full Stack Development**
```bash
# Terminal 1 - Frontend
cd explainator-react
npm run dev

# Terminal 2 - Backend
cd explainator-react/backend
npm run dev
```

---

## 🏗️ Build for Production

### Frontend Build:
```bash
cd explainator-react
npm run build
```
Output will be in `explainator-react/dist/`

### Backend Build:
```bash
cd explainator-react/backend
npm run build
```
Output will be in `backend/dist/`

---

## 🗂️ Data Storage Strategy

### **Client-Side (localStorage)**
✅ Currently Active
- Layout state (columns, sections, boxes)
- Categories (custom colors)
- Canvas settings (mode, size, connectors)
- Slides (presentation snapshots)
- Projects (complete workspace backups)
- Notes (scratch pad content)

**Storage Keys:**
- `explainator-layout-storage` - Layout state
- `explainator-categories-storage` - Categories
- `explainator-canvas-storage` - Canvas settings
- `explainator-slides-storage` - Slides
- `explainator-projects` - Projects
- `explainator-notes` - Notes

### **Backend Database (Future)**
🚧 For Later Implementation
- User accounts
- Subscription management
- Optional: Cloud sync for templates/projects

---

## 📊 Port Reference

| Service          | Default Port | Current Status |
|------------------|--------------|----------------|
| Frontend (Vite)  | 5173 / 5174  | ✅ Running      |
| Backend (Express)| 3000         | 🚧 Not started  |
| PostgreSQL       | 5432         | 🚧 Not started  |

---

## 🐛 Troubleshooting

### Frontend won't start:
```bash
cd explainator-react
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start:
```bash
cd explainator-react/backend
rm -rf node_modules package-lock.json
npm install
npx prisma generate
npm run dev
```

### Port already in use:
- Frontend: Vite will auto-increment (5173 → 5174 → 5175)
- Backend: Change `PORT` in `backend/.env`

### Database connection error:
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `backend/.env`
- Run `npx prisma migrate dev`

---

## 📚 Useful Commands

### Frontend:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend:
```bash
npm run dev              # Start development server (with nodemon)
npm run build            # Build TypeScript to JavaScript
npm run start            # Run production build
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (DB GUI)
```

---

## 🎯 Quick Start Checklist

**To run the app right now:**
- [x] Navigate to `explainator-react/`
- [x] Run `npm install` (first time only)
- [x] Run `npm run dev`
- [x] Open `http://localhost:5173` (or 5174)
- [x] Start using Explainator!

**To add backend later:**
- [ ] Install PostgreSQL
- [ ] Configure `backend/.env` with database URL
- [ ] Run `npx prisma migrate dev` in backend folder
- [ ] Run `npm run dev` in backend folder
- [ ] Connect frontend to backend API

---

## 🎉 You're Ready!

The frontend is **100% functional** and ready to use right now without any backend. All features work with localStorage!

**Current Running Status:**
- ✅ Frontend: Running at `http://localhost:5174`
- 🔴 Backend: Not started (not needed yet)

Happy coding! 🚀
