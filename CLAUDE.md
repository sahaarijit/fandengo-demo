# Fandango Clone - MENN Stack Application

## Overview
Full-stack movie discovery and watchlist application built with **MENN Stack** (MongoDB, Express.js, Next.js, Node.js). Feature-based architecture, JWT authentication, advanced filtering, and comprehensive testing.

## What is MENN Stack?
**M**ongoDB + **E**xpress.js + **N**ext.js + **N**ode.js with TypeScript

This stack combines:
- **Backend**: Express.js + MongoDB for REST API
- **Frontend**: Next.js 16 (App Router) + React 19 for modern UI
- **Language**: TypeScript throughout for type safety
- **Architecture**: Feature-based with colocated components

## Quick Start

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0
- MongoDB (local or Atlas)

### Installation
```bash
# 1. Clone and install
git clone <repository-url>
cd fandengo-demo
npm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env with MongoDB URI, JWT_SECRET, and API URL

# 3. Start MongoDB
mongod  # or use Atlas

# 4. Seed database
cd backend
npm run seed

# 5. Start both servers
cd ..
npm run dev
```

### Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Tech Stack Summary

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime |
| Express.js | 4.21 | Web framework |
| TypeScript | 5.7 | Type safety |
| MongoDB | - | Database |
| Mongoose | 8.9 | ODM |
| Zod | 3.24 | Validation |
| bcryptjs | 3.0 | Password hashing |
| jsonwebtoken | 9.0 | JWT auth |
| Jest | 29.7 | Testing |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0 | React framework |
| React | 19.2 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| Shadcn UI | latest | Components |
| Radix UI | 2.x | Primitives |
| Lucide React | 0.468 | Icons |
| Jest | 29.7 | Testing |

## Project Structure
```
fandengo-demo/
├── backend/                    # Express API (see backend/CLAUDE.md)
│   ├── src/
│   │   ├── features/          # Feature modules (see backend/src/features/CLAUDE.md)
│   │   │   ├── auth/          # JWT authentication
│   │   │   ├── movies/        # Movie browsing
│   │   │   ├── movie-details/ # Details + showtimes
│   │   │   └── watchlist/     # User watchlist
│   │   ├── shared/            # Infrastructure (see backend/src/shared/CLAUDE.md)
│   │   │   ├── config/        # Database
│   │   │   ├── middleware/    # Error + validation
│   │   │   └── utils/         # Utilities
│   │   ├── scripts/
│   │   │   └── seed.ts        # Database seeding
│   │   ├── app.ts             # Express setup
│   │   └── index.ts           # Entry point
│   ├── jest.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                   # Next.js app (see frontend/CLAUDE.md)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (shared)/      # Layout, home
│   │   │   └── (features)/    # Routes (see frontend/src/app/(features)/CLAUDE.md)
│   │   │       ├── auth/      # Login, signup
│   │   │       ├── movies/    # Browse, details
│   │   │       └── watchlist/ # User watchlist
│   │   ├── shared/            # Infrastructure (see frontend/src/shared/CLAUDE.md)
│   │   │   ├── components/    # Navigation + Shadcn
│   │   │   ├── services/      # API client
│   │   │   └── types/         # TypeScript types
│   │   └── lib/               # Utilities
│   ├── jest.config.js
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── docs/                       # Architecture documentation
├── package.json                # Workspace root
├── README.md                   # User documentation
└── CLAUDE.md                   # This file (developer guide)
```

## Core Features

### 1. Movie Browsing
- Browse catalog with poster images
- **Search**: Case-insensitive partial text search
- **Filters**: Genre, MPAA rating, release year
- **Sorting**: Title, rating, year (asc/desc)
- **Pagination**: Server-side with configurable limits

**API**: `GET /api/movies?search=dark&genre=Action&sortBy=rating&sortOrder=desc`

### 2. Movie Details
- Full movie information (cast, director, duration)
- Showtimes with theater info
- Format options (Standard, IMAX, 3D, Dolby)
- Available seats and pricing

**API**: `GET /api/movies/:id`

### 3. User Authentication
- JWT-based signup/login
- Password hashing (bcrypt, 10 rounds)
- Protected routes (middleware)
- Client-side auth context (React)
- Token stored in localStorage

**APIs**:
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/profile` (protected)
- `POST /api/auth/logout` (protected)

### 4. Watchlist
- Add/remove movies (protected)
- Display user's watchlist
- Watchlist count badge
- Prevent duplicate entries

**APIs**:
- `GET /api/watchlist` (protected)
- `POST /api/watchlist` (protected)
- `DELETE /api/watchlist/:movieId` (protected)
- `GET /api/watchlist/count` (protected)

## Architecture Philosophy

### Feature-Based Organization
Code is organized by **feature**, not by **layer**.

**Traditional (layer-based)**:
```
❌ controllers/
     ├── auth.controller.ts
     └── movies.controller.ts
   models/
     ├── user.model.ts
     └── movie.model.ts
```

**Feature-based (this project)**:
```
✅ features/
     ├── auth/
     │   ├── auth.controller.ts
     │   ├── user.model.ts
     │   ├── auth.routes.ts
     │   └── auth.schema.ts
     └── movies/
         ├── movies.controller.ts
         ├── movie.model.ts
         ├── movies.routes.ts
         └── movies.schema.ts
```

**Benefits**:
- Related code is colocated
- Easy to add/remove features
- Clear boundaries between features
- Scales well for large teams

### Backend Patterns
- **Controller → Model**: No separate service layer (boilerplate simplicity)
- **Zod validation**: Request validation at route level
- **Error middleware**: Centralized error handling
- **JWT middleware**: Auth on protected routes

### Frontend Patterns
- **Route Groups**: Organize routes without URL prefixes
- **Colocation**: Components/services/types next to routes
- **Client Components**: Interactive features (auth, filters)
- **Shadcn UI**: Pre-built accessible components

## API Design

### REST Conventions
- **GET**: Retrieve data
- **POST**: Create resource
- **PUT**: Update resource
- **DELETE**: Remove resource

### Response Format
```typescript
// Success
{
  success: true,
  data: any,
  message?: string
}

// Error
{
  success: false,
  error: string,
  message?: string,
  details?: any  // Validation errors
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Validation error
- **401**: Unauthorized
- **404**: Not found
- **500**: Server error

## Testing Strategy

### Pure Unit Tests
- **No database**: Mock data in memory
- **No HTTP**: Test business logic directly
- **Fast execution**: No external dependencies
- **87 total tests**: 40 frontend + 47 backend

### Backend Tests
```bash
cd backend
npm test                     # Run all tests
npm run test:coverage        # Coverage report
npm test -- auth.controller  # Single file
```

**Pattern**: Helper functions simulate business logic.

### Frontend Tests
```bash
cd frontend
npm test                     # Run all tests
npm run test:coverage        # Coverage
npm test -- MovieCard        # Single file
```

**Tools**: Jest + React Testing Library + user-event.

### Coverage Threshold
- **70%** for branches, functions, lines, statements

## Development Workflow

### Monorepo Scripts
```bash
# Install all dependencies (backend + frontend)
npm install

# Start both servers concurrently
npm run dev

# Start individually
npm run dev:frontend
npm run dev:backend

# Build both
npm run build
```

### Adding a New Feature

#### Backend
1. Create folder: `backend/src/features/feature-name/`
2. Add files:
   - `feature.model.ts` - Mongoose schema
   - `feature.controller.ts` - Request handlers
   - `feature.routes.ts` - Express routes
   - `feature.schema.ts` - Zod validation
   - `__tests__/feature.controller.test.ts` - Tests
3. Register in `backend/src/app.ts`:
   ```typescript
   import featureRoutes from './features/feature-name/feature.routes';
   app.use('/api/feature', featureRoutes);
   ```
4. Document in `backend/src/features/CLAUDE.md`

#### Frontend
1. Create folder: `frontend/src/app/(features)/feature-name/`
2. Add files:
   - `page.tsx` - Route component
   - `components/Component.tsx` - UI components
   - `services/feature.service.ts` - API calls
   - `__tests__/Component.test.tsx` - Tests
3. Add link in `frontend/src/shared/components/Navigation.tsx`
4. Document in `frontend/src/app/(features)/CLAUDE.md`

## Environment Variables

Single `.env` file at **project root** (not in backend/ or frontend/ subdirectories).

### Root `.env`
```env
# =============================================================================
# BACKEND CONFIGURATION
# =============================================================================
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/fandango_clone
JWT_SECRET=your-secret-key-change-in-production

# =============================================================================
# FRONTEND CONFIGURATION
# =============================================================================
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Setup**:
```bash
cp .env.example .env
# Edit .env with your values
```

**Important**:
- Client-side vars must start with `NEXT_PUBLIC_`
- Both backend and frontend load from root `.env`
- Restart dev servers after env changes (no hot-reload)

## Scripts Reference

### Root Level
```bash
npm install              # Install all dependencies
npm run dev              # Start both servers
npm run dev:frontend     # Start frontend only (port 3000)
npm run dev:backend      # Start backend only (port 5000)
npm run build            # Build both workspaces
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend
```

### Backend
```bash
cd backend
npm run dev              # Dev server with nodemon
npm run build            # Compile TypeScript
npm start                # Run compiled code
npm run seed             # Seed database
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage
```

### Frontend
```bash
cd frontend
npm run dev              # Next.js dev server
npm run build            # Production build
npm start                # Production server
npm run lint             # ESLint
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage
```

## Database Schema

### Collections
- **users**: Authentication (email, password, name)
- **movies**: Movie catalog (title, poster, genres, rating, etc.)
- **watchlists**: User watchlists (userId + movieId)
- **theaters**: Theater locations
- **showtimes**: Movie showtimes (movieId, theaterId, time, format)

### Indexes
- `users`: Unique on `email`
- `movies`: Text on `title`, indexes on `genres`, `mpaaRating`, `releaseYear`, `rating`
- `watchlists`: Compound unique on `(userId, movieId)`

## Security Considerations

### Implemented
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ JWT authentication
- ✅ Input validation (Zod)
- ✅ Protected routes
- ✅ CORS enabled

### Production TODO
- [ ] Restrict CORS to actual frontend origin
- [ ] Add rate limiting
- [ ] Add Helmet for security headers
- [ ] Implement refresh tokens
- [ ] Set up error monitoring
- [ ] Use httpOnly cookies instead of localStorage

## Performance Considerations

### Backend
- **Database indexes** for filtered/sorted fields
- **Pagination** for large result sets
- **Lean queries** for read-only operations
- **Connection pooling** (Mongoose default)

### Frontend
- **Next.js Image** for optimized images
- **Code splitting** per route (automatic)
- **React Suspense** for loading states
- **Debounced search** to reduce API calls

## Troubleshooting

### MongoDB Connection Failed
```bash
# Check MongoDB is running
mongod --version

# Start MongoDB
mongod  # or use Atlas

# Verify connection string in backend/.env
```

### Port Already in Use
```bash
# Check ports
netstat -ano | findstr :3000  # Frontend
netstat -ano | findstr :5000  # Backend

# Kill process or change port
npm run dev:frontend -- -p 3001
```

### Tests Failing
```bash
# Clear caches
rm -rf node_modules frontend/node_modules backend/node_modules
npm install

# Run individually
cd backend && npm test
cd frontend && npm test
```

### Build Errors
```bash
# Clear Next.js cache
cd frontend && rm -rf .next

# Clear TypeScript build
cd backend && rm -rf dist

# Rebuild
npm run build
```

## Documentation Structure

This project has **layered documentation** for different needs:

1. **README.md** (User/Client facing)
   - High-level overview
   - Setup instructions
   - API reference
   - Use cases

2. **CLAUDE.md** (This file - Developer overview)
   - Architecture philosophy
   - Project structure
   - Development workflow
   - Quick reference

3. **Backend Documentation**
   - `backend/CLAUDE.md` - Backend overview
   - `backend/src/features/CLAUDE.md` - Feature patterns
   - `backend/src/shared/CLAUDE.md` - Shared infrastructure

4. **Frontend Documentation**
   - `frontend/CLAUDE.md` - Frontend overview
   - `frontend/src/app/(features)/CLAUDE.md` - Feature patterns
   - `frontend/src/shared/CLAUDE.md` - Shared infrastructure

5. **docs/** (Architecture details)
   - `App-PRD.md` - Product requirements
   - `Architecture.md` - System design
   - `Architecture-detailed.md` - Implementation details

## Common Commands Cheatsheet

```bash
# Setup
npm install && cd backend && cp .env.example .env && cd ../frontend && cp .env.example .env.local && cd ..

# Development
npm run dev                      # Both servers
npm run dev:frontend             # Frontend only
npm run dev:backend              # Backend only

# Database
cd backend && npm run seed       # Populate DB

# Testing
cd backend && npm test           # Backend tests
cd frontend && npm test          # Frontend tests

# Build
npm run build                    # Both
npm run build:frontend           # Frontend
npm run build:backend            # Backend

# Production
cd backend && npm start          # Backend
cd frontend && npm start         # Frontend
```

## Getting Help

### Documentation Path
1. Start here (`CLAUDE.md`) for overview
2. Check specific module:
   - Backend: `backend/CLAUDE.md`
   - Frontend: `frontend/CLAUDE.md`
   - Features: `*/src/features/CLAUDE.md`
   - Shared: `*/src/shared/CLAUDE.md`
3. Check `README.md` for user-facing info
4. Check `docs/` for architecture details

### Common Issues
- **Auth not working**: Check JWT_SECRET is set
- **CORS errors**: Check FRONTEND_URL in backend .env
- **Images not loading**: Check next.config.ts remotePatterns
- **Tests failing**: Check jest.config.js path aliases

## License
MIT License
