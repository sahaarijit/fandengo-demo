# Backend - Fandango Clone API

## Overview
Express.js + TypeScript + MongoDB RESTful API for a movie discovery and watchlist application. Feature-based architecture with JWT authentication, Zod validation, and comprehensive testing.

## Tech Stack
| Package | Version | Purpose |
|---------|---------|---------|
| Node.js | 20+ | Runtime |
| Express.js | 4.21 | Web framework |
| TypeScript | 5.7 | Type safety |
| MongoDB | - | Database |
| Mongoose | 8.9 | ODM |
| Zod | 3.24 | Request validation |
| bcryptjs | 3.0 | Password hashing |
| jsonwebtoken | 9.0 | JWT auth |
| Jest | 29.7 | Testing |
| ts-jest | 29.2 | Jest TypeScript preprocessor |

## Project Structure
```
backend/
├── src/
│   ├── features/              # Feature modules (see features/CLAUDE.md)
│   │   ├── auth/              # Authentication
│   │   ├── movies/            # Movie browsing
│   │   ├── movie-details/     # Movie details + showtimes
│   │   ├── watchlist/         # User watchlist
│   │   └── example/           # Boilerplate reference
│   ├── shared/                # Shared infrastructure (see shared/CLAUDE.md)
│   │   ├── config/            # Database config
│   │   ├── middleware/        # Error + validation
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Seed scripts
│   ├── scripts/
│   │   └── seed.ts            # Database seeding
│   ├── app.ts                 # Express app setup
│   └── index.ts               # Entry point
├── jest.config.js             # Jest configuration
├── tsconfig.json              # TypeScript config
├── nodemon.json               # Nodemon config
├── package.json
└── .env.example               # Environment template
```

## Entry Points

### `src/index.ts`
Server startup script.

**Responsibilities**:
1. Load environment variables (dotenv)
2. Connect to MongoDB
3. Start Express server
4. Handle graceful shutdown

**Flow**:
```typescript
import app from './app';
import { connectDatabase } from './shared/config/database';

connectDatabase()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
```

### `src/app.ts`
Express application configuration.

**Middleware Stack** (order matters):
1. `express.json()` - Parse JSON bodies
2. `express.urlencoded({ extended: true })` - Parse URL-encoded
3. `cors({ origin: '*', credentials: true })` - CORS (wide-open for dev)
4. Logging middleware - Logs `METHOD URL - timestamp`
5. Health check route - `GET /health`
6. Feature routes - `/api/*`
7. 404 handler
8. **Error middleware** (must be last)

**Registered Routes**:
```typescript
app.use('/api/examples', exampleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/movies', movieDetailsRoutes);  // :id param
app.use('/api/watchlist', watchlistRoutes);
```

## Configuration Files

### `tsconfig.json`
TypeScript compiler options.

**Key Settings**:
- `target`: ES2020
- `module`: commonjs
- `outDir`: ./dist
- `strict`: true
- `baseUrl` + `paths`: `@/*` alias for `src/*`
- Excludes: `node_modules`, `dist`, `__tests__`

**Usage**:
```bash
npm run build  # Compiles to dist/
```

### `jest.config.js`
Jest test configuration.

**Key Settings**:
- `preset`: `'ts-jest'`
- `testEnvironment`: `'node'`
- `testTimeout`: 10000 (10s - no database downloads)
- `testMatch`: `**/__tests__/**/*.test.ts`
- `moduleNameMapper`: `@/* → src/*`
- `coverageThreshold`: 70% (branches, functions, lines, statements)

**Why No MongoMemoryServer**:
Tests use pure mock data and helper functions to avoid ~600MB binary download and slow startup times.

### `nodemon.json`
Nodemon configuration for dev server.

**Watches**:
- `src/**/*.ts`

**Ignores**:
- `**/__tests__/**`
- `node_modules`

### `.env.example`
Environment variable template.

**Required Variables**:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/fandango_clone
JWT_SECRET=your-secret-key-here
```

**Setup**:
```bash
cp .env.example .env
# Edit .env with actual values
```

## API Design Patterns

### Request/Response Flow
```
Request
  ↓
Validation Middleware (Zod schema)
  ↓
Authentication Middleware (if protected)
  ↓
Controller (try-catch)
  ↓
Model (Mongoose query)
  ↓
Response (JSON)
  ↓
Error Middleware (if error thrown)
```

### Standard Response Format
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
  details?: Array<{field: string, message: string}>  // Validation errors
}
```

### HTTP Status Codes
- **200**: Success (GET, PUT, DELETE)
- **201**: Created (POST)
- **400**: Validation error
- **401**: Unauthorized (missing/invalid JWT)
- **404**: Not found
- **500**: Server error

### Pagination Pattern
```typescript
// Request
GET /api/movies?page=2&limit=20

// Response
{
  success: true,
  data: [...],
  pagination: {
    page: 2,
    limit: 20,
    total: 150,
    totalPages: 8
  }
}
```

## Database Patterns

### Connection Management
- Single connection on startup (`index.ts`)
- Mongoose connection pooling (automatic)
- Graceful shutdown not currently implemented (TODO)

### Schema Conventions
```typescript
// Always include timestamps
const Schema = new Schema({
  // fields...
}, { timestamps: true });

// Always export interface + model
export interface IModel extends Document {
  _id: mongoose.Types.ObjectId;
  // fields...
  createdAt: Date;
  updatedAt: Date;
}

export const Model = mongoose.model<IModel>('Model', Schema);
```

### Index Strategy
- Text indexes for search fields (`title`)
- Single indexes for filters (`genre`, `mpaaRating`, `year`)
- Compound indexes for uniqueness (`userId + movieId`)
- Sort indexes for performance (`rating DESC`)

## Authentication Flow

### Signup
1. Validate email/password/name (Zod)
2. Check if email exists
3. Hash password (bcrypt, 10 rounds)
4. Save user to DB
5. Generate JWT token
6. Return token + user data

### Login
1. Validate email/password
2. Find user by email
3. Compare password with bcrypt
4. Generate JWT token
5. Return token + user data

### Protected Routes
1. Extract token from `Authorization: Bearer <token>`
2. Verify token with JWT_SECRET
3. Attach `req.user = decoded`
4. Continue to controller

## Testing Strategy

### Test Philosophy
- **Pure unit tests** - No database, no HTTP server
- **Mock data** - In-memory arrays simulate DB
- **Helper functions** - Replicate business logic
- **Fast execution** - No external dependencies

### Test Coverage
- 47 backend tests
- 70% coverage threshold
- Test files colocated: `__tests__/feature.controller.test.ts`

### Running Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Single file
npm test -- auth.controller.test.ts
```

## Scripts Reference

```bash
# Development
npm run dev              # Start with nodemon (auto-reload on file changes)

# Build
npm run build            # Compile TypeScript → dist/
npm start                # Run compiled code from dist/

# Database
npm run seed             # Populate DB with sample data

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode (re-run on changes)
npm run test:coverage    # Generate coverage report
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | development | Environment mode |
| `PORT` | No | 5000 | Server port |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Secret for JWT signing |
| `FRONTEND_URL` | No | http://localhost:3000 | CORS origin |

## Development Workflow

### Starting Development
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env

# 3. Start MongoDB
mongod

# 4. Seed database
npm run seed

# 5. Start dev server
npm run dev
```

### Adding a New Feature
1. Create feature folder: `src/features/feature-name/`
2. Implement: `model.ts`, `controller.ts`, `routes.ts`, `schema.ts`
3. Write tests: `__tests__/controller.test.ts`
4. Register routes in `src/app.ts`
5. Run tests: `npm test`
6. Document in `features/CLAUDE.md`

### Making Changes
1. Modify code
2. Nodemon auto-reloads on save
3. Test manually or with `npm test`
4. Check logs in terminal

## Code Style Guidelines

### Imports
```typescript
// 1. External packages
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// 2. Validation/types
import { z } from 'zod';

// 3. Internal imports (@ alias)
import { Model } from '@/features/model';
import { middleware } from '@/shared/middleware';
```

### Naming Conventions
- **Files**: `kebab-case` (e.g., `auth.controller.ts`)
- **Classes**: `PascalCase` (e.g., `AuthController`)
- **Functions**: `camelCase` (e.g., `getUserById`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `JWT_SECRET`)
- **Interfaces**: `IPascalCase` (e.g., `IUser`)

### Error Handling
```typescript
// In controllers
try {
  // Logic
  res.json({ success: true, data });
} catch (error) {
  next(error);  // Pass to error middleware
}

// Custom errors
throw new Error('User not found');  // Will be caught by error middleware
```

### Async/Await
- Always use `async/await` (no callbacks or raw promises)
- Always wrap in try-catch
- Always pass errors to `next(error)`

## Security Considerations

### Current Implementation
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ JWT authentication
- ✅ Input validation (Zod)
- ✅ CORS enabled
- ❌ Rate limiting (not implemented)
- ❌ Helmet headers (not implemented)
- ❌ SQL/NoSQL injection protection (partial - Mongoose helps)

### Production Hardening (TODO)
- [ ] Restrict CORS to actual frontend origin
- [ ] Add rate limiting (express-rate-limit)
- [ ] Add Helmet for security headers
- [ ] Implement refresh tokens
- [ ] Add request logging (morgan)
- [ ] Set up error monitoring (Sentry)

## Common Pitfalls

1. **Forgetting to register routes** in `app.ts`
2. **Error middleware position** - Must be LAST
3. **Validation source mismatch** - `validate(schema, 'query')` for query params
4. **Missing authentication** - Add `authMiddleware` for protected routes
5. **TypeScript path alias** - Use `@/` not `../../`
6. **Environment variables** - Load `.env` before any imports

## Debugging

### Logs
- All requests logged: `METHOD URL - timestamp`
- Database connection logs (emoji-prefixed)
- Error stacks in development mode

### Common Issues
```bash
# MongoDB connection failed
# → Check MONGODB_URI and ensure MongoDB is running

# Port already in use
# → Kill process: `netstat -ano | findstr :5000` then `taskkill /PID <pid>`

# Tests failing
# → Check test file is in __tests__/ and named *.test.ts
```

## Performance Considerations
- **Database indexes** for filtered/sorted fields
- **Pagination** for large result sets (max 100 items)
- **Lean queries** - Use `.lean()` when possible (returns plain JS objects)
- **Projection** - Select only needed fields

## Related Documentation
- **Features**: See `src/features/CLAUDE.md`
- **Shared Infrastructure**: See `src/shared/CLAUDE.md`
- **API Reference**: See main `README.md`
