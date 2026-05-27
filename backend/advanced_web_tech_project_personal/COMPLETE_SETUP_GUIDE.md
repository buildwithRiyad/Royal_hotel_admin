# Hotel Management System - Complete Setup & Running Guide

## Quick Start (Both Frontend & Backend)

### Prerequisites
- Node.js v18+ installed
- PostgreSQL 12+ running on localhost:5432
- Ports 3000 (frontend) and 3001 (backend) available

---

## Step 1: Database Setup

### Option A: Using psql (Windows Command Prompt)
```bash
# Connect to PostgreSQL as admin
psql -U postgres

# Create database
CREATE DATABASE hotel_db;

# Verify
\l
# You should see hotel_db in the list

# Exit
\q
```

### Option B: Using pgAdmin GUI
1. Open pgAdmin (http://localhost:5050)
2. Right-click "Databases" → Create → Database
3. Name: `hotel_db`
4. Click Save

---

## Step 2: Backend Setup & Run

```bash
# Navigate to backend
cd D:\advanced_web_tech_project_personal

# Install dependencies
npm install

# Start development server (watches for changes)
npm run start:dev

# Expected output:
# [Nest] 12345 - 05/15/2026, 10:53 AM     LOG [NestFactory] Starting Nest application...
# [Nest] 12345 - 05/15/2026, 10:53 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized...
# [Nest] 12345 - 05/15/2026, 10:53 AM     LOG [InstanceLoader] AdminModule dependencies initialized...
# [Nest] 12345 - 05/15/2026, 10:53 AM     LOG [NestApplication] Nest application successfully started
# Application is running on: http://localhost:3001
```

✅ **Backend is now running on http://localhost:3001**

---

## Step 3: Frontend Setup & Run (In New Terminal)

```bash
# Navigate to frontend
cd D:\advanced_web_tech_project_personal_frontend

# Install dependencies (if not already done)
npm install

# Start dev server
npm run dev

# Expected output:
# ▲ Next.js 16.2.6 (Turbopack)
# - Local:         http://localhost:3000
# - Network:       http://192.168.0.101:3000
# - Environments: .env.local
# ✓ Ready in 367ms
```

✅ **Frontend is now running on http://localhost:3000**

---

## Step 4: Access Application

Open browser and go to: **http://localhost:3000/login**

You should see the Hotel Management System login page with:
- Email input field
- Password input field
- Sign In button

---

## Testing the Application

### Test 1: Create Admin User (Using Backend)

```bash
# Open another terminal or use Postman/curl
curl -X POST http://localhost:3001/admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@gmail.com",
    "password": "Password123_@",
    "role": "manager",
    "nidNumber": "1234567890123"
  }'

# Expected response:
# {
#   "id": 1,
#   "name": "Admin User",
#   "email": "admin@gmail.com",
#   "password": "$2b$10$...",  (hashed)
#   "role": "manager",
#   "nidNumber": "1234567890123",
#   "nidImage": null
# }
```

### Test 2: Login (Frontend)

1. Go to http://localhost:3000/login
2. Enter email: `admin@gmail.com`
3. Enter password: `Password123_@`
4. Click "Sign In"
5. You should be redirected to `/dashboard`

### Test 3: Login via API

```bash
curl -X POST http://localhost:3001/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "Password123_@"
  }'

# Expected response:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# }
```

---

## Project Structure Overview

```
Development Environment:
├── D:\advanced_web_tech_project_personal/        (Backend - NestJS)
│   ├── src/admin/
│   │   ├── admin.controller.ts      (REST endpoints)
│   │   ├── admin.service.ts         (Business logic)
│   │   ├── auth/                    (JWT authentication)
│   │   ├── entities/                (TypeORM models)
│   │   └── dto/                     (Data validation)
│   └── package.json
│
└── D:\advanced_web_tech_project_personal_frontend/   (Frontend - Next.js)
    ├── src/
    │   ├── app/                     (Next.js App Router)
    │   ├── components/              (React components)
    │   ├── hooks/                   (Custom hooks)
    │   ├── services/                (API services)
    │   └── context/                 (Global state)
    └── package.json
```

---

## API Endpoints Reference

### Authentication
- `POST /admin/login` - Login with email/password

### Users
- `POST /admin` - Create user
- `GET /admin` - List all users
- `GET /admin/:id` - Get user by ID
- `PUT /admin/:id` - Update user
- `DELETE /admin/:id` - Delete user
- `PATCH /admin/:id/role` - Update user role

### Logs & Backup
- `GET /admin/logs/all` - Get activity logs
- `POST /admin/backup` - Create backup
- `POST /admin/restore` - Restore from backup

---

## Stopping the Services

### Backend
- Press `Ctrl+C` in the backend terminal

### Frontend
- Press `Ctrl+C` in the frontend terminal

---

## Common Issues & Solutions

### Issue 1: PostgreSQL Connection Failed
**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
- Ensure PostgreSQL is running
- On Windows: Check Services → PostgreSQL
- Or start via terminal: `pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start`

### Issue 2: Port Already in Use
**Error:** `Error: listen EADDRINUSE :::3001`

**Solution:**
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Issue 3: Database Not Found
**Error:** `database "hotel_db" does not exist`

**Solution:**
```bash
psql -U postgres
CREATE DATABASE hotel_db;
```

### Issue 4: CORS Errors in Frontend
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** ✅ Already configured in backend main.ts

---

## Development Workflow

### Making Changes

**Backend Changes:**
1. Edit files in `D:\advanced_web_tech_project_personal\src\`
2. Server auto-reloads with `npm run start:dev`
3. Test via API/Frontend

**Frontend Changes:**
1. Edit files in `D:\advanced_web_tech_project_personal_frontend\src\`
2. Browser auto-refreshes with `npm run dev`
3. Test in browser

### Adding New Features

**Example: Add User Deletion**
1. Backend: Add `remove()` method to `admin.service.ts` ✅ (Already done)
2. Backend: Add `@Delete(':id')` endpoint in `admin.controller.ts` ✅ (Already done)
3. Frontend: Create `useDeleteAdmin()` hook ✅ (Already done)
4. Frontend: Add delete button in Users table ✅ (Already done)
5. Test end-to-end

---

## Build for Production

### Backend Build
```bash
cd D:\advanced_web_tech_project_personal
npm run build
# Outputs to: dist/

# Run production
npm run start:prod
```

### Frontend Build
```bash
cd D:\advanced_web_tech_project_personal_frontend
npm run build
# Outputs to: .next/

# Run production
npm run start
```

---

## Debugging

### Backend Logs
- Check terminal for NestJS logs
- Add `console.log()` in services
- Use `npm run start:debug` for debugger

### Frontend Logs
- Open browser DevTools (F12)
- Check Console tab for React errors
- Check Network tab for API calls

---

## Summary

✅ **Setup Complete**  
✅ **Backend running on port 3001**  
✅ **Frontend running on port 3000**  
✅ **Database configured with hotel_db**  
✅ **All 10 features implemented**  

**Next: Test the login flow end-to-end!**
