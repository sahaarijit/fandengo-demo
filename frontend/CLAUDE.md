# Frontend - Fandango Clone

## Overview
Next.js 16 App Router application with TypeScript, Tailwind CSS, and Shadcn UI. Feature-based architecture using Route Groups for clean organization. React 19.2 with modern patterns (Server Components, Suspense, Error Boundaries).

## Tech Stack
| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.0.3 | React framework with App Router |
| React | 19.2.0 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Utility-first styling |
| Shadcn UI | latest | Component library |
| Radix UI | 2.x | Accessible primitives |
| Lucide React | 0.468 | Icon library |
| Jest | 29.7.0 | Testing framework |
| React Testing Library | 16.1.0 | Component testing |

## Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── (shared)/              # Shared layout (no URL prefix)
│   │   │   ├── layout.tsx         # Root layout
│   │   │   ├── page.tsx           # Home page
│   │   │   └── globals.css        # Global styles
│   │   ├── (features)/            # Feature routes (see app/(features)/CLAUDE.md)
│   │   │   ├── auth/              # Authentication
│   │   │   ├── movies/            # Movie browsing
│   │   │   ├── watchlist/         # User watchlist
│   │   │   └── example/           # Boilerplate reference
│   │   ├── layout.tsx             # App-level layout (duplicate for root)
│   │   ├── page.tsx               # Redirect to (shared)
│   │   ├── error.tsx              # Global error boundary
│   │   └── favicon.ico
│   ├── shared/                    # Shared infrastructure (see shared/CLAUDE.md)
│   │   ├── components/
│   │   │   ├── Navigation.tsx     # App navigation
│   │   │   └── ui/                # Shadcn components
│   │   ├── services/
│   │   │   └── api.service.ts     # HTTP client
│   │   └── types/
│   │       └── index.ts           # Shared types
│   └── lib/
│       └── utils.ts               # Utility functions
├── public/                        # Static assets
├── components.json                # Shadcn config
├── jest.config.js                 # Jest config
├── jest.setup.js                  # Jest setup file
├── next.config.ts                 # Next.js config
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript config
├── package.json
└── .env.example                   # Environment template
```

## Configuration Files

### `next.config.ts`
Next.js configuration.

**Key Settings**:
```typescript
{
  output: 'standalone',  // For Docker/containerized deployments
  images: {
    remotePatterns: [    // Allow external images
      { protocol: 'https', hostname: 'm.media-amazon.com' },  // IMDB
      { protocol: 'https', hostname: 'image.tmdb.org' },      // TMDB
      { protocol: 'http', hostname: 'localhost' }
    ]
  }
}
```

**Purpose**:
- `standalone` output: Optimized for production deployment
- `remotePatterns`: Security whitelist for `next/image` component

### `tailwind.config.ts`
Tailwind CSS configuration with Shadcn theme.

**Key Settings**:
- `darkMode: 'class'` - Dark mode via class (not media query)
- `content`: Scans `src/app/**/*` and `src/shared/components/**/*`
- `theme.extend.colors`: HSL color system for Shadcn UI
- `plugins`: `tailwindcss-animate` for animations

**Custom Colors**:
All colors use CSS variables (defined in `globals.css`):
```
--background, --foreground, --primary, --secondary, --accent,
--destructive, --muted, --card, --popover, --border, --input, --ring
```

### `tsconfig.json`
TypeScript configuration for Next.js.

**Key Settings**:
- `target`: ES2017
- `lib`: `["dom", "dom.iterable", "esnext"]`
- `jsx`: `"react-jsx"` (React 19 automatic runtime)
- `moduleResolution`: `"bundler"`
- `paths`: `@/*` alias for `src/*`
- `strict`: `true`
- `noEmit`: `true` (Next.js handles compilation)
- `incremental`: `true` (faster rebuilds)

**Next.js Plugin**:
`plugins: [{ name: "next" }]` - Enables Next.js TypeScript integration.

### `jest.config.js`
Jest test configuration using Next.js preset.

**Key Settings**:
- `testEnvironment`: `'jest-environment-jsdom'` (for DOM testing)
- `setupFilesAfterEnv`: `['<rootDir>/jest.setup.js']` (imports `@testing-library/jest-dom`)
- `moduleNameMapper`: `@/* → src/*` (path alias)
- `collectCoverageFrom`: Excludes `.d.ts`, stories, tests

**Next.js Integration**:
Uses `next/jest` preset for automatic configuration.

### `components.json`
Shadcn UI configuration.

**Path Aliases**:
```json
{
  "aliases": {
    "components": "@/shared/components",
    "ui": "@/shared/components/ui",
    "utils": "@/lib/utils"
  }
}
```

Tells Shadcn CLI where to install components.

### `.env.example`
Environment variable template.

**Variables**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Setup**:
```bash
cp .env.example .env.local
# Edit .env.local
```

**Important**: All client-side env vars must start with `NEXT_PUBLIC_`.

## App Router Architecture

### Route Groups
Next.js 16 Route Groups organize routes without affecting URLs.

**Syntax**: `(group-name)/`

**Example**:
```
app/
├── (shared)/
│   └── page.tsx         → /
├── (features)/
│   ├── movies/
│   │   └── page.tsx     → /movies
│   └── auth/
│       └── login/
│           └── page.tsx → /auth/login
```

### Special Files
- **layout.tsx**: Shared UI for routes below it
- **page.tsx**: Unique route content
- **loading.tsx**: Loading UI (Suspense fallback)
- **error.tsx**: Error boundary UI
- **not-found.tsx**: 404 page

### Server vs Client Components
**Default**: Server Components (can use `async`, fetch data server-side)

**Client Components**: Add `'use client';` directive for:
- State (`useState`, `useReducer`)
- Effects (`useEffect`)
- Event handlers
- Context
- Browser APIs

**Pattern**:
```typescript
// Server Component (default)
export default async function Page() {
  const data = await fetch(...);
  return <ClientComponent data={data} />;
}

// Client Component
'use client';
export function ClientComponent({ data }) {
  const [state, setState] = useState();
  // ...
}
```

## Styling System

### Tailwind CSS
Utility-first CSS framework.

**Usage**:
```typescript
<div className="flex items-center gap-4 p-4 bg-primary text-primary-foreground rounded-lg">
  <Button className="px-6 py-2 hover:bg-primary/90">Click</Button>
</div>
```

### Global Styles
Defined in `app/(shared)/globals.css`:
- CSS variables for colors (`--primary`, `--background`, etc.)
- `@layer base` for resets
- Dark mode styles via `.dark` class

### Shadcn UI
Pre-built accessible components using Radix UI + Tailwind.

**Installation**:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

Components install to `src/shared/components/ui/`.

## Data Fetching

### Client-Side Fetching
```typescript
'use client';
import { useState, useEffect } from 'react';
import { MoviesService } from './services/movies.service';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await MoviesService.getMovies();
      setMovies(data.movies);
    };
    fetchMovies();
  }, []);

  return <div>{/* render movies */}</div>;
}
```

### Server-Side Fetching
```typescript
// Server Component (no 'use client')
export default async function MoviesPage() {
  const response = await fetch('http://localhost:5000/api/movies');
  const { data } = await response.json();

  return <div>{/* render data.movies */}</div>;
}
```

**Note**: Most features use **client-side fetching** for auth-aware routing and interactive UIs.

## Authentication Flow

### Auth Context
`src/app/(features)/auth/context/AuthContext.tsx`

**Provider**: Wraps app in `app/layout.tsx`

**Hook**: `useAuth()`

**State**:
```typescript
{
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data) => Promise<void>;
  signup: (data) => Promise<void>;
  logout: () => void;
}
```

**Token Storage**: `localStorage.getItem('token')`

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
  }, [isAuthenticated, loading]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Protected content</div>;
}
```

## Testing

### Setup
- **Framework**: Jest 29.7
- **Library**: React Testing Library 16.1
- **Environment**: jsdom (simulates browser)
- **Setup file**: `jest.setup.js` (imports `@testing-library/jest-dom`)

### Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders text', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles click', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Mocking Next.js
```typescript
// next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />
}));

// next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}));

// next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn()
  }),
  useSearchParams: () => new URLSearchParams()
}));
```

### Run Tests
```bash
npm test                 # All tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm test -- MovieCard    # Single file
```

## Scripts Reference

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Build
npm run build            # Production build (.next/)
npm start                # Start production server

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage

# Linting
npm run lint             # ESLint
```

## Development Workflow

### Starting Development
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local

# 3. Ensure backend is running
# Backend: http://localhost:5000

# 4. Start frontend
npm run dev

# 5. Open browser
# http://localhost:3000
```

### Hot Module Replacement
Next.js dev server auto-reloads on file changes:
- **Fast Refresh**: React components update without losing state
- **Error Overlay**: Shows compile/runtime errors in browser

### Adding a New Feature
1. Create folder: `src/app/(features)/feature-name/`
2. Add route: `page.tsx`
3. Add components: `components/Component.tsx`
4. Add service: `services/feature.service.ts`
5. Add tests: `__tests__/`
6. Update Navigation if needed
7. Document in `app/(features)/CLAUDE.md`

## Code Style Guidelines

### File Naming
- **Routes**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **Components**: `PascalCase.tsx`
- **Services**: `kebab-case.service.ts`
- **Tests**: `Component.test.tsx`

### Imports Order
```typescript
// 1. React/Next.js
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// 2. External packages
import { Star } from 'lucide-react';

// 3. Shadcn UI
import { Button } from '@/shared/components/ui/button';

// 4. Internal imports (@/ alias)
import { apiService } from '@/shared/services/api.service';
import { Movie } from '@/shared/types';
```

### Naming Conventions
- **Components**: `PascalCase` (e.g., `MovieCard`)
- **Functions**: `camelCase` (e.g., `fetchMovies`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- **Types/Interfaces**: `PascalCase` (e.g., `MovieProps`)

### TypeScript
- Always type props, state, responses
- Use interfaces for object shapes
- Use type for unions, primitives
- Prefer `interface` over `type` for extensibility

## Performance Considerations

### Image Optimization
Use `next/image` for automatic optimization:
```typescript
import Image from 'next/image';

<Image
  src="/poster.jpg"
  alt="Movie"
  width={300}
  height={450}
  priority  // For above-fold images
/>
```

### Code Splitting
- Automatic with App Router (per-route)
- Use `dynamic()` for heavy components:
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
});
```

### Caching
- Next.js caches `fetch()` requests automatically (Server Components)
- Use `revalidate` option for stale-while-revalidate:
```typescript
fetch(url, { next: { revalidate: 60 } })  // Revalidate every 60s
```

## Common Pitfalls

1. **Missing 'use client'** - Components with hooks need this directive
2. **SSR window access** - Check `typeof window !== 'undefined'`
3. **Env var prefix** - Must start with `NEXT_PUBLIC_` for client access
4. **Image domains** - Add to `next.config.ts` `remotePatterns`
5. **Path alias** - Use `@/` not `../../`

## Debugging

### Browser DevTools
- React DevTools extension
- Network tab for API calls
- Console for logs

### Next.js DevTools
- Build-in error overlay
- `/` shows page data in browser
- `console.log()` in Server Components appears in terminal

### Common Issues
```bash
# Port already in use
# → Kill process or change port: `npm run dev -- -p 3001`

# Module not found
# → Check import path uses @/ alias

# Hydration error
# → Check Server/Client component mismatch
```

## Security Considerations

### Current Implementation
- ✅ JWT auth with httpOnly consideration (localStorage for simplicity)
- ✅ Protected routes (client-side guard)
- ✅ XSS protection (React escapes by default)
- ❌ CSRF protection (not implemented - using JWT)
- ❌ Rate limiting (should be backend)

### Best Practices
- Never store sensitive data in localStorage
- Always validate/sanitize user input
- Use `dangerouslySetInnerHTML` sparingly
- Keep dependencies updated

## Related Documentation
- **Features**: See `src/app/(features)/CLAUDE.md`
- **Shared Infrastructure**: See `src/shared/CLAUDE.md`
- **API Reference**: See `../backend/CLAUDE.md`
