# Frontend Shared Infrastructure

## Overview
Shared utilities, components, services, and types used across all features. Located at `src/shared/` to distinguish from Next.js `app/` directory.

## Structure
```
shared/
├── components/
│   ├── Navigation.tsx       # App-wide navigation
│   └── ui/                  # Shadcn UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── badge.tsx
│       └── dropdown-menu.tsx
├── services/
│   └── api.service.ts       # HTTP client wrapper
└── types/
    └── index.ts             # Shared TypeScript types
```

## Services (`services/`)

### `api.service.ts`
Centralized HTTP client wrapping native Fetch API.

**Class**: `ApiService`

**Constructor**:
```typescript
constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
```

**Methods**:
```typescript
get<T>(endpoint: string): Promise<ApiResponse<T>>
post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>>
put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>>
delete<T>(endpoint: string): Promise<ApiResponse<T>>
```

**Features**:
- Auto-injects JWT token from localStorage (if exists)
- `Authorization: Bearer <token>` header
- JSON content-type by default
- Error handling with custom `ApiError` class
- Type-safe responses with generics

**Response Format**:
```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;     // Validation error details
  count?: number;     // For counts/totals
}
```

**Error Handling**:
```typescript
class ApiError extends Error {
  status: number;     // HTTP status code
  details?: any;      // Error details
}
```

**Usage**:
```typescript
import { apiService } from '@/shared/services/api.service';

// GET
const response = await apiService.get<User[]>('/api/users');
const users = response.data!;

// POST with body
const response = await apiService.post<User>('/api/users', {
  name: 'John',
  email: 'john@example.com'
});

// With error handling
try {
  const response = await apiService.delete(`/api/users/${id}`);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Error ${error.status}:`, error.message);
    console.error('Details:', error.details);
  }
}
```

**Token Management**:
- Token read from `localStorage.getItem('token')`
- SSR-safe: Returns `null` if `window` is undefined
- Token set by AuthService, not ApiService

## Components (`components/`)

### `Navigation.tsx`
App-wide navigation bar with auth-aware routing.

**Features**:
- Logo + brand name
- Links: Movies, Watchlist (if authenticated)
- User dropdown with profile + logout
- Watchlist badge with count
- Responsive design with Shadcn UI

**Dependencies**:
- `useAuth()` - Auth context
- `WatchlistService` - Fetch watchlist count
- Shadcn: `Button`, `DropdownMenu`
- Lucide: `User`, `LogOut`, `Bookmark` icons

**Conditional Rendering**:
```typescript
{isAuthenticated ? (
  <>
    <Link href="/movies">Movies</Link>
    <Link href="/watchlist">
      Watchlist <Badge>{count}</Badge>
    </Link>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <User /> {user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={logout}>
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
) : (
  <>
    <Link href="/auth/login">Login</Link>
    <Link href="/auth/signup">Signup</Link>
  </>
)}
```

**Usage**:
Imported in `app/layout.tsx` (root layout).

### `ui/` - Shadcn Components
Pre-built accessible components from Shadcn UI library.

**Installation**:
```bash
cd frontend
npx shadcn@latest add button
npx shadcn@latest add card
```

**Components**:
- **button.tsx** - Button with variants (default, destructive, outline, ghost, link)
- **card.tsx** - Card, CardHeader, CardContent, CardFooter
- **input.tsx** - Text input
- **label.tsx** - Form label
- **select.tsx** - Dropdown select (Radix UI)
- **badge.tsx** - Badge/pill for tags
- **dropdown-menu.tsx** - Dropdown menu (Radix UI)

**Customization**:
- Tailwind CSS for styling
- Variants via `class-variance-authority` (cva)
- Utility classes merged with `tailwind-merge` + `clsx`

**Example**:
```typescript
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

<Card>
  <CardHeader>Login</CardHeader>
  <CardContent>
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" />
    <Button variant="default">Submit</Button>
  </CardContent>
</Card>
```

**Configuration**:
Shadcn config in `frontend/components.json`:
```json
{
  "aliases": {
    "components": "@/shared/components",
    "ui": "@/shared/components/ui",
    "utils": "@/lib/utils"
  }
}
```

## Types (`types/`)

### `index.ts`
Shared TypeScript interfaces used across features.

**Core Types**:
```typescript
// User
export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Movie
export interface Movie {
  _id: string;
  title: string;
  description: string;
  poster: string;
  genres: string[];
  mpaaRating: string;
  rating: number;
  releaseYear: number;
  duration: number;
  cast: string[];
  director: string;
  trailerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Movie Details (with showtimes)
export interface MovieDetails extends Movie {
  showtimes: Showtime[];
}

export interface Showtime {
  _id: string;
  startTime: string;
  format: string;
  price: number;
  seatsAvailable: number;
  theater: {
    _id: string;
    name: string;
    location: string;
  };
}

// Watchlist
export interface WatchlistItem {
  _id: string;
  userId: string;
  movieId: Movie;
  createdAt: string;
  updatedAt: string;
}

// API Responses
export interface MoviesResponse {
  movies: Movie[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MovieDetailsResponse {
  movie: MovieDetails;
}

export interface WatchlistResponse {
  watchlist: WatchlistItem[];
}
```

**Usage**:
```typescript
import { Movie, User, MoviesResponse } from '@/shared/types';

const [movies, setMovies] = useState<Movie[]>([]);
const [user, setUser] = useState<User | null>(null);
```

## Utilities (`lib/`)

### `utils.ts`
Utility functions for Shadcn components.

**Function**: `cn(...inputs: ClassValue[]): string`

**Purpose**: Merges Tailwind CSS classes intelligently.

**Dependencies**:
- `clsx` - Conditional class names
- `tailwind-merge` - Merges Tailwind classes (handles conflicts)

**Usage**:
```typescript
import { cn } from '@/lib/utils';

<Button className={cn(
  "px-4 py-2",
  isActive && "bg-blue-500",
  disabled && "opacity-50"
)} />
```

**Why**:
Tailwind classes can conflict (e.g., `px-4` + `px-6`). `tailwind-merge` resolves this.

## Environment Variables

### `NEXT_PUBLIC_API_URL`
API base URL (must be prefixed with `NEXT_PUBLIC_` for client-side access).

**Default**: `http://localhost:5000`

**Setup** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Usage**:
Automatically read by `api.service.ts`.

## Coding Standards

### Imports
```typescript
// External
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Shared components/services
import { Button } from '@/shared/components/ui/button';
import { apiService } from '@/shared/services/api.service';

// Types
import { User, Movie } from '@/shared/types';
```

### Type Safety
```typescript
// Always use typed responses
const response = await apiService.get<User[]>('/api/users');
const users: User[] = response.data!;  // Non-null assertion (API always returns data on success)

// Handle nullable types
const user: User | null = null;
if (user) {
  console.log(user.name);  // TypeScript knows user is not null
}
```

### Error Handling
```typescript
try {
  await apiService.post('/api/endpoint', data);
} catch (error) {
  if (error instanceof ApiError) {
    // API error
    console.error(error.status, error.message);
  } else {
    // Network error
    console.error('Network error:', error);
  }
}
```

## Testing Shared Code

### Mocking ApiService
```typescript
jest.mock('@/shared/services/api.service', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

// In tests
(apiService.get as jest.Mock).mockResolvedValue({ data: mockData });
```

### Mocking Shadcn Components
Generally not needed - render them directly. For complex tests:
```typescript
jest.mock('@/shared/components/ui/select', () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  // ... mock other sub-components
}));
```

## Common Pitfalls

1. **Forgetting `NEXT_PUBLIC_` prefix** - Client-side env vars must start with it
2. **Using `window` in SSR** - Check `typeof window !== 'undefined'`
3. **Not handling null API responses** - Always check `response.data`
4. **Importing from wrong paths** - Use `@/` alias, not `../../`
5. **Missing 'use client' in components using hooks** - Add `'use client';` directive

## Relationship with Features

```
Features → shared (one-way dependency)
shared → External packages only
```

**Usage Pattern**:
```typescript
// In feature components
import { apiService } from '@/shared/services/api.service';
import { Button } from '@/shared/components/ui/button';
import { Movie } from '@/shared/types';

// Create feature-specific service
export class MoviesService {
  static async getMovies() {
    return apiService.get<MoviesResponse>('/api/movies');
  }
}
```

## Adding New Shared Code

1. **New Component**: Add to `shared/components/` or install via Shadcn
2. **New Service**: Add class to `shared/services/`
3. **New Type**: Add to `shared/types/index.ts`
4. **New Utility**: Add to `lib/utils.ts`
5. Document in this CLAUDE.md
