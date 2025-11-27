# Backend Features

## Overview
Feature-based architecture where each feature is self-contained with its own controller, model, routes, schema, and tests. All features follow consistent patterns.

## Tech Stack
- **Framework**: Express.js 4.21
- **Language**: TypeScript 5.7
- **Database**: MongoDB with Mongoose 8.9
- **Validation**: Zod 3.24
- **Auth**: bcryptjs 3.0 + jsonwebtoken 9.0
- **Testing**: Jest 29.7 with ts-jest

## Feature Structure Pattern
Each feature follows this structure:
```
feature-name/
├── feature-name.controller.ts  # Request handlers
├── feature-name.model.ts       # Mongoose schema
├── feature-name.routes.ts      # Express routes
├── feature-name.schema.ts      # Zod validation
└── __tests__/                  # Unit tests
    └── feature-name.controller.test.ts
```

## Implemented Features

### 1. Auth (`auth/`)
**Purpose**: JWT-based authentication system

**Files**:
- `user.model.ts` - User schema with email/password/name
- `auth.controller.ts` - Signup, login, logout, getProfile
- `auth.middleware.ts` - JWT verification middleware
- `auth.routes.ts` - `/api/auth/*` endpoints
- `auth.schema.ts` - Zod validation for signup/login

**Key Patterns**:
- Password hashing with bcryptjs (10 rounds)
- JWT tokens with configurable expiry
- Email validation and uniqueness
- Protected routes via authMiddleware

**Endpoints**:
```
POST /api/auth/signup   # Register
POST /api/auth/login    # Login
GET  /api/auth/profile  # Get profile (protected)
POST /api/auth/logout   # Logout (protected)
```

### 2. Movies (`movies/`)
**Purpose**: Movie browsing with advanced filtering

**Files**:
- `movie.model.ts` - Movie schema with title, genres, rating, etc.
- `movies.controller.ts` - getAll with filters/pagination/sorting
- `movies.routes.ts` - `/api/movies` endpoint
- `movies.schema.ts` - Zod validation for query parameters

**Key Features**:
- **Search**: Case-insensitive partial text search on title
- **Filters**: genre, mpaaRating, year
- **Sorting**: title, rating, releaseYear (asc/desc)
- **Pagination**: page, limit (max 100)

**Query Parameters**:
```typescript
{
  search?: string,       // Partial text search
  genre?: string,        // Filter by genre
  mpaaRating?: string,   // G, PG, PG-13, R, NR
  year?: number,         // Release year
  sortBy?: string,       // title | rating | releaseYear
  sortOrder?: string,    // asc | desc
  page?: number,         // Default: 1
  limit?: number         // Default: 20, max: 100
}
```

**Indexes**:
- Text index on `title`
- Single indexes on `genres`, `mpaaRating`, `releaseYear`, `rating`

### 3. Movie Details (`movie-details/`)
**Purpose**: Detailed movie info with showtimes

**Files**:
- `movie-details.controller.ts` - getById with populated showtimes/theaters
- `movie-details.routes.ts` - `/api/movies/:id` endpoint
- `showtime.model.ts` - Showtime schema
- `theater.model.ts` - Theater schema

**Key Pattern**:
- Populates showtimes with embedded theater data
- Uses Mongoose `.populate()` for relational data

### 4. Watchlist (`watchlist/`)
**Purpose**: Personal watchlist management (protected)

**Files**:
- `watchlist.model.ts` - User-movie junction schema
- `watchlist.controller.ts` - add, remove, getAll, getCount
- `watchlist.routes.ts` - `/api/watchlist/*` endpoints (all protected)
- `watchlist.schema.ts` - Zod validation

**Key Patterns**:
- Unique compound index: `(userId, movieId)`
- All routes require JWT authentication
- Prevents duplicate entries

**Endpoints**:
```
GET    /api/watchlist         # Get user's watchlist
GET    /api/watchlist/count   # Count
POST   /api/watchlist         # Add movie
DELETE /api/watchlist/:movieId # Remove movie
```

### 5. Example (`example/`)
**Purpose**: Boilerplate reference for CRUD operations

**Files**: Standard feature structure with full CRUD

## Coding Standards

### Imports
```typescript
// Node/Express
import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';

// Database
import mongoose, { Document, Schema } from 'mongoose';

// Validation
import { z } from 'zod';

// Internal
import { Model } from './model';
import { validate } from '../../shared/middleware/validation.middleware';
import { authMiddleware } from '../auth/auth.middleware';
```

### Controller Pattern
```typescript
export class FeatureController {
  static async methodName(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Extract params/query/body
      const { param } = req.params;

      // 2. Business logic
      const result = await Model.find({ param });

      // 3. Success response
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      // 4. Pass to error middleware
      next(error);
    }
  }
}
```

### Response Format
```typescript
// Success
{
  success: true,
  data: any,
  message?: string
}

// Error (handled by error.middleware.ts)
{
  success: false,
  error: string,
  message: string
}
```

### Model Pattern
```typescript
export interface IModel extends Document {
  _id: mongoose.Types.ObjectId;
  field: string;
  createdAt: Date;
  updatedAt: Date;
}

const Schema = new Schema({
  field: {
    type: String,
    required: [true, 'Error message'],
    trim: true
  }
}, { timestamps: true });

// Add indexes
Schema.index({ field: 1 });

export const Model = mongoose.model<IModel>('Model', Schema);
```

### Validation Pattern
```typescript
import { z } from 'zod';

export const schema = z.object({
  field: z.string().min(1).max(100),
  optional: z.string().optional()
});

export type Dto = z.infer<typeof schema>;
```

### Routes Pattern
```typescript
import { Router } from 'express';
import { Controller } from './controller';
import { validate } from '../../shared/middleware/validation.middleware';
import { schema } from './schema';

const router = Router();

// Public routes
router.get('/', validate(schema, 'query'), Controller.getAll);

// Protected routes
router.post('/', authMiddleware, validate(schema, 'body'), Controller.create);

export default router;
```

## Testing Standards

### Test Structure
- **Pure unit tests** with mock data (no database)
- **Helper functions** simulate business logic
- **87 tests total**: 47 backend, 40 frontend
- **Coverage threshold**: 70% for branches/functions/lines/statements

### Test Pattern
```typescript
describe('Feature Controller', () => {
  // Mock data
  const mockData: any[] = [];

  // Helper functions
  const helperFunction = (input: string): boolean => {
    return Boolean(input && input.length > 0);
  };

  beforeEach(() => {
    // Reset mocks
    mockData.length = 0;
  });

  describe('methodName', () => {
    it('should handle valid input', () => {
      expect(helperFunction('valid')).toBe(true);
    });

    it('should reject invalid input', () => {
      expect(helperFunction('')).toBe(false);
    });
  });
});
```

### Run Tests
```bash
# Single feature
npm test -- auth.controller.test.ts

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Common Commands

```bash
# Development
npm run dev              # Start with nodemon (auto-reload)

# Build
npm run build            # Compile TS to dist/
npm start                # Run compiled code

# Database
npm run seed             # Seed sample data

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Dependencies Between Features

```
auth (standalone)
  ↓
watchlist (requires auth)
  ↓
movies (used by watchlist)
  ↓
movie-details (extends movies)
```

## Error Handling
All features use consistent error handling:
1. Controller wraps logic in try-catch
2. Throws errors or calls `next(error)`
3. Error middleware formats response
4. HTTP status codes: 400 (validation), 401 (auth), 404 (not found), 500 (server)

## Adding New Features
1. Create feature folder: `src/features/feature-name/`
2. Copy structure from `example/`
3. Implement model, controller, routes, schema
4. Write tests
5. Register routes in `src/app.ts`
