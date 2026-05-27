# Hotel Management System - Backend Setup & Organization

## Project Structure

```
D:\advanced_web_tech_project_personal/
├── src/
│   ├── admin/
│   │   ├── admin.controller.ts      # REST API endpoints
│   │   ├── admin.service.ts         # Business logic
│   │   ├── admin.module.ts          # Module definition
│   │   ├── auth/
│   │   │   ├── auth.service.ts      # JWT token generation/validation
│   │   │   ├── auth.module.ts       # Auth module
│   │   │   ├── jwt.strategy.ts      # Passport JWT strategy
│   │   │   └── jwt.guard.ts         # Route protection guard
│   │   ├── dto/
│   │   │   ├── admin.dto.ts         # CreateUserDto, UpdateUserDto
│   │   │   ├── create-profile.dto.ts
│   │   │   └── create-booking.dto.ts
│   │   ├── entities/
│   │   │   ├── user.entity.ts       # User TypeORM entity (id, email, name, role, password, nidImage, nidNumber, createdAt)
│   │   │   ├── profile.entity.ts
│   │   │   └── booking.entity.ts
│   │   ├── pipes/
│   │   │   └── admin_pipe.pipe.ts   # DTO validation pipe
│   ├── app.module.ts                # Root module with TypeORM PostgreSQL config
│   ├── app.controller.ts            # Health check routes
│   ├── app.service.ts
│   └── main.ts                      # Application bootstrap (port auto-detection)
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
└── nest-cli.json                    # NestJS CLI config
```

## Database Configuration

**Type:** PostgreSQL  
**Host:** localhost  
**Port:** 5432  
**Database:** hotel_db  
**Username:** postgres  
**Password:** 1234  
**Auto Sync:** Enabled (TypeORM `synchronize: true`)

## API Endpoints

### Authentication
- `POST /admin/login` - Login with email/password, returns JWT token

### User Management
- `POST /admin` - Create user with NID image upload
- `GET /admin` - List all users (optional role query param)
- `GET /admin/:id` - Get user by ID
- `PUT /admin/:id` - Update user details
- `DELETE /admin/:id` - Delete user
- `PATCH /admin/:id/role` - Update user role

### Activity Logs
- `GET /admin/logs/all` - Get all activity logs (in-memory)

### Backup/Restore
- `POST /admin/backup` - Create database backup
- `POST /admin/restore` - Restore from backup file

## Key Features

✅ **JWT Authentication** - Token-based auth with guards on protected routes  
✅ **Password Hashing** - bcrypt with salt 10 rounds  
✅ **File Upload** - Multer diskStorage for NID images (2MB JPEG/PNG)  
✅ **Activity Logging** - In-memory log tracking for all CRUD operations  
✅ **Error Handling** - Proper HTTP exceptions (BadRequest, Conflict, NotFound)  
✅ **TypeORM Integration** - Automatic schema synchronization  
✅ **CORS Support** - Cross-origin requests from frontend (port 3000)  

## Environment Variables

Add to `.env` file:
```
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=1234
DATABASE_NAME=hotel_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=1h
```

## Running the Backend

### Development Mode
```bash
cd D:\advanced_web_tech_project_personal
npm install
npm run start:dev
```

Server will start on port 3001 (default 3000, auto-increments if busy)

### Build & Production
```bash
npm run build
npm run start:prod
```

## Frontend Integration

**Frontend URL:** http://localhost:3000  
**Backend URL:** http://localhost:3001  
**API Base URL:** Set in `.env.local` (frontend) → `NEXT_PUBLIC_API_URL=http://localhost:3001`

## Recent Changes

✅ Backend fully configured with 10 REST endpoints
✅ PostgreSQL database connection setup
✅ JWT authentication implemented
✅ Multer file upload for NID images
✅ Activity logging system
✅ Error handling and validation

## Next Steps

1. Ensure PostgreSQL is running on localhost:5432
2. Create `hotel_db` database
3. Run `npm install` in backend folder
4. Start backend with `npm run start:dev` on port 3001
5. Frontend will connect automatically

## Notes

- User roles: admin, manager, receptionist, customer
- NID format: 13 or 17 digits
- Email validation: Must end with @gmail.com (configurable)
- Password validation: Min 8 chars, alphanumeric + _ and @
- All dates stored as ISO 8601 timestamps
