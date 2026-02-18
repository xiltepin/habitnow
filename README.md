# 🌱 HabitNow — Habit Tracker App

A full-stack HabitNow copycat built with **NestJS** (backend) and **Angular** (frontend).

---

## 📦 Project Structure

```
habitnow/
├── backend/          NestJS API (port 3001)
├── frontend/         Angular SPA  (port 4201)
└── package.json      Root convenience scripts
```

> **Ports**: NestJS default is 3000 → we use **3001**. Angular default is 4200 → we use **4201**.

---

## 🚀 Quick Start

### Choose Your Deployment Method:

**🐳 Option 1: Docker (Recommended)**
- Easy setup, isolated environment
- See [DOCKER.md](./DOCKER.md) for full guide
```bash
cd ~/tools/habitnow
./start.sh
```

**💻 Option 2: Manual (Development)**
- For local development
- Requires Node.js 20+ installed

---

## 🐳 Docker Deployment (Production)

### Prerequisites

```bash
# Docker & Docker Compose
docker --version          # 20.10+
docker-compose --version  # 2.0+
```

### Quick Deploy

```bash
cd ~/tools/habitnow

# Start everything
./start.sh

# Stop everything
./stop.sh
```

**Access:**
- Frontend: http://localhost:4201
- Backend: http://localhost:3001/api

**See [DOCKER.md](./DOCKER.md) for complete Docker documentation.**

---

## 💻 Manual Setup (Development)

### Prerequisites

Make sure these are installed in your WSL environment:

```bash
# Node.js 20 (use nvm)
node --version   # should be v20.x

# npm
npm --version

# Git
git --version
```

### 1 — Clone / Copy the project

```bash
git clone <your-repo-url> habitnow
cd habitnow
```

### 2 — Install all dependencies

```bash
# Install backend deps
cd backend
npm install

# Install frontend deps
cd ../frontend
npm install
```

### 3 — Check / edit .env files

**backend/.env**
```env
PORT=3001
JWT_SECRET=habitnow_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
DB_PATH=./habitnow.db
FRONTEND_URL=http://localhost:4201
```

**frontend/.env** (Angular uses it via angular.json serve config)
```env
PORT=4201
API_URL=http://localhost:3001/api
```

### 4 — Run Backend

```bash
cd backend
npm run start:dev
```

You should see:
```
HabitNow API running on http://localhost:3001/api
```

### 5 — Run Frontend (new terminal)

```bash
cd frontend
npm start
```

Open Chrome at **http://localhost:4201**

---

## 🌐 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| GET | /api/habits | All habits |
| GET | /api/habits/today?date=YYYY-MM-DD | Today's habits with stats |
| POST | /api/habits | Create habit |
| PUT | /api/habits/:id | Update habit |
| DELETE | /api/habits/:id | Soft-delete habit |
| POST | /api/completions/toggle/:habitId | Toggle completion |
| GET | /api/completions/history/:habitId | Completion history |
| GET | /api/completions/stats/month | Monthly stats |

---

## 🗄️ Database

Uses **SQLite** via `better-sqlite3`. The database file (`habitnow.db`) is created automatically in the backend directory on first run. No separate DB setup needed!

---

## 📱 Features

- ✅ User registration & login (JWT auth)
- ✅ Create / edit / delete habits
- ✅ Good habits (build) & bad habits (break)
- ✅ Daily / weekly frequency
- ✅ Time-of-day grouping (Morning / Afternoon / Evening / Anytime)
- ✅ Custom icons & colors
- ✅ One-tap completion with streak tracking
- ✅ Date navigation (view past days)
- ✅ Progress ring (today view)
- ✅ Monthly statistics & calendar heatmap
- ✅ Mobile-responsive design (works great in Chrome on mobile)
- ✅ Dark mode support (follows OS preference)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS 10, TypeORM, SQLite (better-sqlite3), JWT |
| Frontend | Angular 17 (standalone components, signals), CSS |
| Auth | JWT Bearer tokens |

---

## 📂 Frontend Architecture

```
src/app/
├── app.config.ts          App providers (router, http, animations)
├── app.routes.ts          Lazy-loaded routes
├── core/
│   ├── guards/            Auth guard
│   ├── interceptors/      JWT interceptor
│   ├── layout/shell/      Shell layout (topbar + bottom nav)
│   └── services/          Auth, Habits services
└── features/
    ├── auth/              Login, Register
    ├── today/             Daily habit tracker
    ├── habits/            Habit list + form
    └── stats/             Statistics & heatmap
```

---

## 🔧 Troubleshooting

**Port already in use?**
```bash
# Change PORT in backend/.env (e.g. 3002) or frontend/.env (e.g. 4202)
# Update frontend/src/environments/environment.ts apiUrl accordingly
```

**CORS error?**
```bash
# Ensure FRONTEND_URL in backend/.env matches your Angular port
FRONTEND_URL=http://localhost:4201
```

**SQLite native build error?**
```bash
cd backend
npm rebuild better-sqlite3
```

**Angular CLI not found?**
```bash
npm install -g @angular/cli
```