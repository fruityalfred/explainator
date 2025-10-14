# Explainator React - Ultimate Edition

Modern React/TypeScript migration of Explainator with server hosting and subscription management.

## 🎯 Project Overview

Explainator is a visual layout builder for creating organizational charts, office maps, Kanban boards, and custom explanatory diagrams. This is a complete rewrite from a single-file HTML application to a modern full-stack application.

## 🚀 Features

- **Visual Layout Builder**: Drag & drop columns, sections, and content boxes
- **Canvas Mode**: PowerPoint-like absolute positioning with alignment guides
- **Slides System**: Create presentations with slide navigation
- **Export Options**: PNG, Excel, Standalone HTML, JSON templates
- **Project Management**: Built-in Kanban board for project organization
- **Multi-language**: German and English support
- **Subscription Model**: Free, Pro, and Enterprise tiers

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build Tool)
- Zustand (State Management)
- @dnd-kit (Drag & Drop)
- React Router (Navigation)
- i18next (Internationalization)
- html2canvas (Screenshot Export)
- xlsx (Excel Export)

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Stripe (Payment Processing)

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd explainator-react
```

2. **Install Frontend Dependencies**
```bash
npm install
```

3. **Install Backend Dependencies**
```bash
cd backend
npm install
```

4. **Configure Environment**
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials and API keys
```

5. **Setup Database**
```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

## 🎮 Development

### Start Frontend
```bash
npm run dev
# Runs on http://localhost:5173
```

### Start Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

### Database Management
```bash
cd backend
npm run prisma:studio  # Open Prisma Studio GUI
npm run prisma:migrate # Run migrations
```

## 🏗️ Project Structure

```
explainator-react/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Helper functions
│   ├── constants/         # Constants & configs
│   └── pages/             # Page components
├── backend/               # Backend source
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth & validation
│   │   ├── services/      # Business logic
│   │   └── utils/         # Helpers
│   └── prisma/
│       └── schema.prisma  # Database schema
├── public/                # Static assets
└── update.md              # Development progress log
```

## 🔐 Subscription Tiers

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Templates | 5 | 50 | Unlimited |
| Projects | 2 | 20 | Unlimited |
| Canvas Mode | ❌ | ✅ | ✅ |
| Excel Export | ❌ | ✅ | ✅ |
| Slides | ❌ | ✅ | ✅ |
| Connectors | ❌ | ✅ | ✅ |
| Collaboration | ❌ | ❌ | ✅ |

## 📋 Development Roadmap

- [x] **Segment 1**: Project Setup & Infrastructure (Week 1-2)
- [ ] **Segment 2**: Authentication & User Management (Week 3)
- [ ] **Segment 3**: Core Layout Engine (Week 4-5)
- [ ] **Segment 4**: Drag & Drop System (Week 6)
- [ ] **Segment 5**: Canvas Mode & Connectors (Week 7)
- [ ] **Segment 6**: Export/Import System (Week 8)
- [ ] **Segment 7**: Subscription System (Week 9-10)

See [update.md](./update.md) for detailed progress tracking.

## 🚢 Deployment

### VServer Setup (Ubuntu 22.04)

```bash
# Install dependencies
sudo apt update
sudo apt install nodejs npm nginx postgresql

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/explainator

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com

# Use PM2 for process management
npm install -g pm2
pm2 start backend/dist/index.js --name explainator-api
pm2 start "npm run preview" --name explainator-frontend
pm2 startup
pm2 save
```

## 🤝 Contributing

This is currently a private project. Contributions are not yet open.

## 📄 License

Proprietary - All rights reserved

## 📧 Contact

For questions or support, please contact: [Your Email]

---

**Status:** 🚧 In Development - Segment 1 Complete
**Last Updated:** 2025-10-14
