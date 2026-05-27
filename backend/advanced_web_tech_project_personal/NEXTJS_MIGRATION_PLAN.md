# Hotel Management System - Next.js Migration Plan

## Current Project Overview (NestJS Backend)

### **Project Name**: Hotel Management System
**Current Stack**: NestJS + PostgreSQL + TypeORM

---

## 📋 Features & Components

### 1. **Admin Module** ✅
Admin is a technical/system operator for the hotel application with the following capabilities:

#### User Management
- ✅ Create users with role assignment (manager, receptionist, customer)
- ✅ Read/Fetch users (all or filtered by role)
- ✅ Update user information
- ✅ Delete users
- ✅ Assign/change roles to users

#### NID (National ID) Management
- ✅ Upload NID images during user creation
- ✅ Store NID number (13 or 17 digits)
- ✅ Store NID image filename

#### Activity Logging
- ✅ Record all admin actions (user creation, updates, deletions)
- ✅ Timestamp-based logs
- ✅ Action tracking with target and details

#### Database Operations
- ✅ Backup database snapshot
- ✅ Restore database from backup

### 2. **Authentication** ✅
- ✅ JWT-based authentication
- ✅ Login endpoint (email + password)
- ✅ Password hashing with bcrypt
- ✅ JWT Guard for protected routes
- ✅ Role-based access control

### 3. **Booking Management** (DTOs referenced)
- Profile create/update DTOs
- Booking create/update DTOs

### 4. **User Roles**
- Manager
- Receptionist
- Customer

---

## 🛠️ Technology Stack

### Current (NestJS)
| Layer | Technology |
|-------|-----------|
| **Frontend** | (Not built yet - needs Next.js) |
| **Backend Framework** | NestJS 11.0.1 |
| **Runtime** | Node.js |
| **Database** | PostgreSQL |
| **ORM** | TypeORM 0.3.28 |
| **Auth** | JWT + Passport + Bcrypt |
| **Validation** | class-validator, class-transformer |
| **File Upload** | Multer (Express middleware) |
| **Testing** | Jest, Supertest |
| **Language** | TypeScript |

### Proposed Next.js Stack
| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **UI Components** | Shadcn/ui, Tailwind CSS |
| **State Management** | TanStack Query (React Query) or Zustand |
| **Form Handling** | React Hook Form + Zod |
| **Authentication** | NextAuth.js or Custom JWT |
| **HTTP Client** | Axios or Fetch API |
| **Backend (API Routes)** | Next.js API Routes or continue with NestJS |
| **Database** | PostgreSQL (shared) |
| **Styling** | Tailwind CSS |
| **Testing** | Jest + React Testing Library |

---

## 📦 Data Models (From Current Implementation)

### User Entity
```typescript
{
  id: number
  name: string (alphabets only)
  email: string (unique)
  password: string (hashed with bcrypt)
  role: 'manager' | 'receptionist' | 'customer'
  nidNumber: string (13 or 17 digits)
  nidImage: string (filename)
}
```

### Activity Log
```typescript
{
  timestamp: string (ISO format)
  action: string
  target?: string
  details?: string
}
```

### DTOs (Validation Rules)
- **CreateUserDto**: name, email, password, role, nidNumber, (optional) nidImage
- **UpdateUserDto**: all fields optional
- **AssignRoleDto**: role field
- **CreateBookingDto**: (referenced in project)
- **CreateProfileDto**: (referenced in project)

---

## 🎯 API Endpoints to Implement in Next.js

### Admin Routes
```
POST   /admin                 → Create user + NID image
GET    /admin                 → Get all users (filterable by role)
GET    /admin/all             → Protected: Get all users
GET    /admin/:id             → Get user by ID
PUT    /admin/:id             → Update user
PATCH  /admin/:id/role        → Assign role
DELETE /admin/:id             → Delete user
GET    /admin/logs/all        → Get activity logs
POST   /admin/login           → Login (returns JWT)
POST   /admin/backup          → Backup database
POST   /admin/restore         → Restore database
```

---

## 🔐 Features to Implement

### Authentication & Security
- [ ] Login page with email/password
- [ ] JWT token storage (localStorage/cookies)
- [ ] Protected routes (JWT Guard equivalent)
- [ ] Password validation rules
- [ ] Session management

### Admin Dashboard
- [ ] User management interface (CRUD)
- [ ] User list with filtering by role
- [ ] User creation form with NID upload
- [ ] User edit form
- [ ] Activity logs view
- [ ] Backup/Restore UI

### File Handling
- [ ] NID image upload
- [ ] File preview
- [ ] File size/type validation (2MB, JPEG/PNG)

### UI Components
- [ ] Login form
- [ ] User table/list
- [ ] Modal dialogs for create/edit
- [ ] Role selector
- [ ] Activity log timeline
- [ ] File upload dropzone

---

## 📊 Migration Steps

### Phase 1: Setup Next.js Project
1. Create Next.js app with TypeScript
2. Setup Tailwind CSS
3. Setup authentication structure
4. Setup API client configuration

### Phase 2: Admin Features
1. Create admin dashboard layout
2. Implement user CRUD pages
3. Implement user list with filters
4. Implement form validations
5. Implement file upload

### Phase 3: Authentication
1. Setup login page
2. Implement JWT handling
3. Setup protected routes
4. Implement role-based access

### Phase 4: Additional Features
1. Activity logs viewer
2. Backup/Restore UI
3. User profile pages
4. Testing

---

## 🔄 Data Flow

```
Next.js Frontend → API Routes/External NestJS → PostgreSQL
                    ↓
                TypeORM
                    ↓
                Database
```

---

## ✨ Recommended Approach

1. **Keep NestJS backend as is** - Continue using existing API
2. **Create Next.js frontend** - Consume NestJS APIs
3. **Shared database** - PostgreSQL remains central
4. **API wrapper** - Create API client service in Next.js for clean separation

---

## 📝 Environment Variables Needed

```env
# Database (for NestJS backend)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=
DB_PASSWORD=
DB_NAME=hotel_management

# JWT (for both)
JWT_SECRET=
JWT_EXPIRATION=3600

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🚀 Quick Start Commands (Proposed)

```bash
# NestJS Backend
npm run start:dev          # Start with watch mode

# Next.js Frontend (new)
npm run dev               # Start dev server
npm run build             # Build for production
npm run start             # Start production server
```

---

## 📚 Files to Reference

Current NestJS Implementation:
- User Entity: `src/admin/entities/user.entity.ts`
- Admin Service: `src/admin/admin.service.ts`
- Admin Controller: `src/admin/admin.controller.ts`
- Auth Service: `src/admin/auth/auth.service.ts`
- DTOs: `src/admin/dto/admin.dto.ts`

---

**Ready to start Next.js frontend development?** 🎉
