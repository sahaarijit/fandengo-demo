# Frontend Features

## Overview
Feature-based Next.js 16 App Router architecture using Route Groups. Each feature is colocated with its components, services, and types in the same directory tree.

## Tech Stack
- **Framework**: Next.js 16.0 (App Router)
- **UI Library**: React 19.2
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Components**: Shadcn UI + Radix UI
- **Icons**: Lucide React 0.468
- **HTTP**: Native Fetch API
- **State**: React Context + useState (no Redux)
- **Testing**: Jest 29.7 + React Testing Library 16.1

## Route Groups
Next.js 16 Route Groups organize routes without affecting URL structure.

### `(shared)/`
**Purpose**: Shared layout and home page

**Files**:
- `layout.tsx` - Root layout (metadata, AuthProvider, Navigation)
- `page.tsx` - Home page
- `globals.css` - Global Tailwind styles

**URL**: `/` (no route group prefix)

### `(features)/`
**Purpose**: Feature routes with colocated code

**Structure Pattern**:
```
feature-name/
├── page.tsx                # Route component
├── [id]/page.tsx           # Dynamic route (optional)
├── loading.tsx             # Loading UI (optional)
├── error.tsx               # Error boundary (optional)
├── components/             # Feature-specific components
│   ├── Component.tsx
│   └── __tests__/
│       └── Component.test.tsx
├── services/               # API calls
│   ├── feature.service.ts
│   └── __tests__/
│       └── feature.service.test.ts
├── context/                # React Context (optional)
│   └── FeatureContext.tsx
└── types/                  # TypeScript types (if not in shared)
    └── feature.types.ts
```

## Implemented Features

### 1. Auth (`auth/`)
**Routes**:
- `/auth/login` - Login page
- `/auth/signup` - Signup page

**Files**:
- `login/page.tsx` - Login route
- `signup/page.tsx` - Signup route
- `components/LoginForm.tsx` - Login form
- `components/SignupForm.tsx` - Signup form
- `context/AuthContext.tsx` - Auth state management
- `services/auth.service.ts` - Auth API calls

**Auth Context**:
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

**Features**:
- JWT token storage in localStorage
- Auto-fetch profile on mount (if token exists)
- Auto-redirect to `/movies` after login/signup
- Logout redirects to `/auth/login`

**Usage**:
```typescript
'use client';
import { useAuth } from '@/app/(features)/auth/context/AuthContext';

export function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <div>Please login</div>;
  return <div>Welcome, {user.name}</div>;
}
```

### 2. Movies (`movies/`)
**Routes**:
- `/movies` - Movie listing with filters
- `/movies/[id]` - Movie details page

**Files**:
- `page.tsx` - Movie listing route
- `[id]/page.tsx` - Movie details dynamic route
- `loading.tsx` - Loading skeleton
- `error.tsx` - Error boundary
- `components/MovieCard.tsx` - Movie card component
- `components/MovieFilters.tsx` - Filter UI (genre, rating, year)
- `components/MovieGrid.tsx` - Grid layout wrapper
- `services/movies.service.ts` - API calls

**Query Parameters** (`/movies`):
```typescript
{
  search?: string,       // Text search
  genre?: string,        // Filter by genre
  mpaaRating?: string,   // G, PG, PG-13, R, NR
  releaseYear?: number,  // Filter by year
  sortBy?: string,       // title | rating | releaseYear
  sortOrder?: string,    // asc | desc
  page?: number,         // Pagination
  limit?: number         // Items per page
}
```

**State Management**:
- URL query params as source of truth
- `useRouter` + `useSearchParams` for filter state
- `useEffect` fetches data when params change

### 3. Watchlist (`watchlist/`)
**Routes**:
- `/watchlist` - User's watchlist (protected)

**Files**:
- `page.tsx` - Watchlist route
- `loading.tsx` - Loading UI
- `error.tsx` - Error boundary
- `services/watchlist.service.ts` - API calls

**Protected Route**: Checks `isAuthenticated` via AuthContext

**Features**:
- Display movies in watchlist
- Add/remove movies
- Empty state when no movies
- Watchlist count badge in navigation

### 4. Example (`example/`)
**Purpose**: Boilerplate reference for CRUD operations

**Files**:
- `page.tsx` - Example listing
- `components/ExampleList.tsx` - List component
- `services/example.service.ts` - API service
- `types/example.types.ts` - Type definitions

## Coding Standards

### File Naming
- **Routes**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **Components**: `PascalCase.tsx` (e.g., `MovieCard.tsx`)
- **Services**: `kebab-case.service.ts` (e.g., `movies.service.ts`)
- **Tests**: `Component.test.tsx` or `service.test.ts`

### Imports Order
```typescript
// 1. React/Next.js
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// 2. External packages
import { Star } from 'lucide-react';

// 3. Shadcn UI
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

// 4. Internal imports (@/ alias)
import { MoviesService } from './services/movies.service';
import { Movie } from '@/shared/types';
import { useAuth } from '@/app/(features)/auth/context/AuthContext';
```

### Client vs Server Components
```typescript
// Client Component (default for features)
'use client';  // Required for useState, useEffect, event handlers

export default function MyComponent() {
  const [state, setState] = useState();
  // ...
}

// Server Component (for static pages)
// NO 'use client' directive
export default async function MyPage() {
  const data = await fetch(); // Server-side fetch
  return <div>{data}</div>;
}
```

**Rule**: Use Client Components for all interactive features.

### Component Pattern
```typescript
'use client';

import { ComponentProps } from '@/shared/types';

export default function MyComponent({ prop }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState();
  const { user } = useAuth();

  // 2. Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // 3. Handlers
  const handleClick = async () => {
    try {
      await apiCall();
    } catch (error) {
      console.error(error);
    }
  };

  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Service Pattern
```typescript
import { apiService } from '@/shared/services/api.service';
import { ResponseType } from '@/shared/types';

export class FeatureService {
  static async getAll(params?: QueryParams): Promise<ResponseType> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    const endpoint = `/api/feature${query ? `?${query}` : ''}`;

    const response = await apiService.get<ResponseType>(endpoint);
    return response.data!;
  }

  static async getById(id: string): Promise<ItemType> {
    const response = await apiService.get<ItemType>(`/api/feature/${id}`);
    return response.data!;
  }

  static async create(data: CreateDto): Promise<ItemType> {
    const response = await apiService.post<ItemType>('/api/feature', data);
    return response.data!;
  }
}
```

### Error Handling
```typescript
// In components
const [error, setError] = useState<string | null>(null);

try {
  await service.create(data);
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred');
}

// Display errors
{error && <div className="text-red-500">{error}</div>}
```

### Loading States
```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await service.getAll();
    setData(data);
  } finally {
    setLoading(false);
  }
};

// Display loading
if (loading) return <div>Loading...</div>;
```

### URL State Management
```typescript
'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MoviePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read from URL
  const search = searchParams.get('search') || '';

  // Write to URL
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <input
      value={search}
      onChange={e => updateFilters('search', e.target.value)}
    />
  );
}
```

## Testing Standards

### Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

// Mock Next.js modules
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}));

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent prop="value" />);
    expect(screen.getByText('value')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Service Tests
```typescript
import { FeatureService } from '../feature.service';
import { apiService } from '@/shared/services/api.service';

jest.mock('@/shared/services/api.service', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

describe('FeatureService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls API with correct params', async () => {
    const mockData = { data: [/* ... */] };
    (apiService.get as jest.Mock).mockResolvedValue(mockData);

    const result = await FeatureService.getAll({ search: 'test' });

    expect(apiService.get).toHaveBeenCalledWith('/api/feature?search=test');
    expect(result).toEqual(mockData.data);
  });
});
```

### Run Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Single file
npm test -- MovieCard.test.tsx
```

## Shadcn UI Components

### Usage Pattern
```typescript
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem } from '@/shared/components/ui/select';

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>Title</CardHeader>
      <CardContent>
        <Input placeholder="Enter text" />
        <Button variant="default">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### Adding New Components
```bash
cd frontend
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

Components are added to `src/shared/components/ui/`.

## Common Patterns

### Protected Routes
```typescript
'use client';
import { useAuth } from '@/app/(features)/auth/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Protected content</div>;
}
```

### Optimistic UI Updates
```typescript
const [data, setData] = useState<Item[]>([]);

const addItem = async (newItem: Item) => {
  // Optimistic update
  setData(prev => [...prev, newItem]);

  try {
    await service.create(newItem);
  } catch (error) {
    // Rollback on error
    setData(prev => prev.filter(item => item.id !== newItem.id));
    setError('Failed to add item');
  }
};
```

### Debounced Search
```typescript
import { debounce } from 'lodash';
import { useMemo } from 'react';

const debouncedSearch = useMemo(
  () => debounce((value: string) => {
    updateFilters('search', value);
  }, 300),
  []
);

<input onChange={e => debouncedSearch(e.target.value)} />
```

## Common Commands

```bash
# Development
npm run dev              # Start Next.js dev server (port 3000)

# Build
npm run build            # Production build
npm start                # Start production server

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage

# Linting
npm run lint             # ESLint
```

## Adding New Features

1. Create feature folder: `src/app/(features)/feature-name/`
2. Add route: `page.tsx`
3. Add components: `components/Component.tsx`
4. Add service: `services/feature.service.ts`
5. Add types (if needed): `types/feature.types.ts` or use `@/shared/types`
6. Write tests: `__tests__/`
7. Update Navigation component if needed
8. Document in this CLAUDE.md
