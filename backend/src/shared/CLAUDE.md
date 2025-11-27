# Backend Shared Infrastructure

## Overview
Shared utilities, configuration, middleware, and types used across all features. This directory contains cross-cutting concerns that don't belong to any specific feature.

## Structure
```
shared/
├── config/
│   └── database.ts          # MongoDB connection
├── middleware/
│   ├── error.middleware.ts  # Global error handler
│   └── validation.middleware.ts  # Zod validation wrapper
├── types/
│   └── index.ts             # Shared TypeScript types
└── utils/
    ├── seed.ts              # Database seeding utilities
    └── schemas/             # Reusable Zod schemas
```

## Config (`config/`)

### `database.ts`
MongoDB connection management with Mongoose.

**Exports**:
```typescript
connectDatabase(): Promise<void>
disconnectDatabase(): Promise<void>
```

**Features**:
- Reads `MONGODB_URI` from env (fallback: `mongodb://localhost:27017/menn_boilerplate`)
- Connection event listeners: `error`, `disconnected`
- Exits process on connection failure (fail-fast pattern)
- Emoji-prefixed console logs for visibility

**Usage**:
```typescript
import { connectDatabase } from './shared/config/database';

await connectDatabase();
```

## Middleware (`middleware/`)

### `error.middleware.ts`
Global Express error handler (must be last middleware in chain).

**Signature**:
```typescript
errorHandler(err: Error, req: Request, res: Response, next: NextFunction)
```

**Behavior**:
- Logs error stack to console
- Returns 500 status
- **Production**: Generic message (`"Internal server error"`)
- **Development**: Full error message + stack trace

**Response Format**:
```typescript
{
  success: false,
  error: string,          // Generic in prod, detailed in dev
  stack?: string          // Only in dev
}
```

**Usage in app.ts**:
```typescript
import { errorHandler } from './shared/middleware/error.middleware';

app.use('/api/...', routes);
app.use(errorHandler); // Must be last
```

### `validation.middleware.ts`
Zod validation middleware factory.

**Signature**:
```typescript
validate(schema: AnyZodObject, source?: 'body' | 'params' | 'query'): Middleware
```

**Parameters**:
- `schema`: Zod schema object
- `source`: Which req property to validate (default: `'body'`)

**Behavior**:
- Parses `req[source]` with Zod schema
- On success: calls `next()`
- On ZodError: returns 400 with field-level errors
- On other errors: passes to error middleware

**Error Response**:
```typescript
{
  success: false,
  error: "Validation failed",
  details: [
    { field: "email", message: "Invalid email format" },
    { field: "password", message: "String must contain at least 6 character(s)" }
  ]
}
```

**Usage in routes**:
```typescript
import { validate } from '../../shared/middleware/validation.middleware';
import { createSchema } from './schema';

router.post('/', validate(createSchema, 'body'), Controller.create);
router.get('/', validate(querySchema, 'query'), Controller.getAll);
```

## Types (`types/`)

### `index.ts`
Shared TypeScript interfaces and types.

**Common Patterns**:
```typescript
// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// MongoDB Document with timestamps
export interface BaseDocument {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

## Utils (`utils/`)

### `seed.ts`
Database seeding utilities for development/testing.

**Purpose**: Populate MongoDB with sample data (movies, users, theaters, showtimes)

**Usage**:
```bash
npm run seed  # Runs ts-node src/scripts/seed.ts
```

**Typical Seed Data**:
- 10-20 sample movies with real metadata
- Test users with known passwords
- Theaters with locations
- Showtimes for movies

**Pattern**:
```typescript
export async function seedMovies() {
  await Movie.deleteMany({}); // Clear existing
  await Movie.insertMany([...]); // Insert samples
}
```

## Coding Standards

### Imports Order
```typescript
// 1. External packages
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// 2. Zod/validation
import { z, ZodError, AnyZodObject } from 'zod';

// 3. No relative imports within shared/ (shared is leaf-level)
```

### Error Handling Pattern
```typescript
// In middleware/utils
try {
  // Operation
  next(); // or return result
} catch (error) {
  // Log
  console.error('Context:', error);

  // Handle or propagate
  next(error); // Pass to error middleware
}
```

### Environment Variables
All env vars are accessed via `process.env`:
- `NODE_ENV`: `development` | `production` | `test`
- `MONGODB_URI`: Full MongoDB connection string
- `JWT_SECRET`: Secret for JWT signing (in auth feature)
- `PORT`: Server port (default: 5000)

**Loading**: `.env` file loaded by `dotenv` in `app.ts`

## Relationship with Features

```
shared/
  ├── config/database.ts    → Used by: src/index.ts (startup)
  ├── middleware/error.*    → Used by: src/app.ts (global handler)
  ├── middleware/validation.* → Used by: ALL feature routes
  └── types/                → Used by: ALL features (import types)
```

**Dependency Flow**:
```
Features → shared (one-way dependency)
shared → External packages only
```

## Testing Shared Code
- Middleware can be tested in isolation with mock req/res/next
- Database config tested via integration tests in features
- No dedicated tests for shared/ currently (considered infrastructure)

## Common Pitfalls
1. **Error middleware position**: Must be LAST in `app.ts`
2. **Validation source mismatch**: Ensure `source` param matches data location
3. **MongoDB URI**: Must include database name in URI
4. **Environment variables**: Load dotenv BEFORE importing any modules that need env vars

## Adding New Shared Utilities
1. Determine category: config, middleware, types, or utils
2. Create file in appropriate subdirectory
3. Export from that file (no barrel exports from shared/)
4. Import directly in features: `import { util } from '../../shared/utils/util'`
5. Document usage in this CLAUDE.md
