# Fandango Clone

A movie discovery and watchlist application built with the **MENN Stack** (MongoDB, Express.js, Next.js, Node.js). Features movie browsing with advanced filtering, user authentication, and personal watchlist management.

## Features

### Core Functionality
- **Movie Browsing** - Browse movies with poster images, ratings, and metadata
- **Advanced Search** - Case-insensitive partial text search across movie titles
- **Filtering** - Filter by genre, MPAA rating, and release year
- **Sorting** - Sort by title, rating, or release year (ascending/descending)
- **Pagination** - Server-side pagination for large movie catalogues
- **Movie Details** - Detailed movie pages with cast, director, showtimes, and theaters
- **User Authentication** - JWT-based signup, login, logout, and profile management
- **Watchlist** - Add/remove movies to personal watchlist (requires authentication)

### Technical Highlights
- Feature-based architecture with colocated components
- Type-safe API with Zod validation
- JWT authentication with protected routes
- Responsive UI with Shadcn components
- 87 automated tests (40 frontend + 47 backend)

## Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime |
| Express.js | 4.21 | Web framework |
| TypeScript | 5.7 | Type safety |
| MongoDB | - | Database |
| Mongoose | 8.9 | ODM |
| Zod | 3.24 | Request validation |
| bcryptjs | 3.0 | Password hashing |
| jsonwebtoken | 9.0 | JWT authentication |
| Jest | 29.7 | Testing |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0 | React framework (App Router) |
| React | 19.2 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| Shadcn UI | - | Component library |
| Radix UI | - | Accessible primitives |
| Lucide React | 0.468 | Icons |
| Jest + Testing Library | 29.7 | Testing |

## Project Structure

```
fandengo-demo/
├── backend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/                    # Authentication feature
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.middleware.ts   # JWT verification
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.schema.ts       # Zod validation
│   │   │   │   ├── user.model.ts
│   │   │   │   └── __tests__/
│   │   │   ├── movies/                  # Movies feature
│   │   │   │   ├── movie.model.ts
│   │   │   │   ├── movies.controller.ts
│   │   │   │   ├── movies.routes.ts
│   │   │   │   ├── movies.schema.ts
│   │   │   │   └── __tests__/
│   │   │   ├── movie-details/           # Movie details with showtimes
│   │   │   │   ├── movie-details.controller.ts
│   │   │   │   ├── movie-details.routes.ts
│   │   │   │   ├── showtime.model.ts
│   │   │   │   └── theater.model.ts
│   │   │   ├── watchlist/               # Watchlist feature
│   │   │   │   ├── watchlist.controller.ts
│   │   │   │   ├── watchlist.model.ts
│   │   │   │   ├── watchlist.routes.ts
│   │   │   │   ├── watchlist.schema.ts
│   │   │   │   └── __tests__/
│   │   │   └── example/                 # Boilerplate example (reference)
│   │   ├── shared/
│   │   │   ├── config/database.ts
│   │   │   ├── middleware/
│   │   │   └── utils/
│   │   ├── scripts/seed.ts              # Database seeding
│   │   ├── app.ts
│   │   └── index.ts
│   ├── jest.config.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (shared)/                # Layout, home page
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── globals.css
│   │   │   └── (features)/
│   │   │       ├── auth/
│   │   │       │   ├── login/page.tsx
│   │   │       │   ├── signup/page.tsx
│   │   │       │   ├── components/
│   │   │       │   ├── context/AuthContext.tsx
│   │   │       │   └── services/
│   │   │       ├── movies/
│   │   │       │   ├── page.tsx         # Movie listing
│   │   │       │   ├── [id]/page.tsx    # Movie details
│   │   │       │   ├── components/
│   │   │       │   │   ├── MovieCard.tsx
│   │   │       │   │   ├── MovieFilters.tsx
│   │   │       │   │   └── MovieGrid.tsx
│   │   │       │   └── services/
│   │   │       └── watchlist/
│   │   │           ├── page.tsx
│   │   │           └── services/
│   │   ├── shared/
│   │   │   ├── components/ui/           # Shadcn UI components
│   │   │   └── services/api.service.ts  # HTTP client
│   │   └── lib/utils.ts
│   ├── jest.config.js
│   └── package.json
│
├── package.json                          # Workspace root
└── README.md
```

## API Endpoints

### Health Check
```
GET  /health                              # API health status
```

### Authentication
```
POST /api/auth/signup                     # Register new user
POST /api/auth/login                      # Login, returns JWT token
GET  /api/auth/profile                    # Get current user (protected)
POST /api/auth/logout                     # Logout (protected)
```

### Movies
```
GET  /api/movies                          # List movies with filters
GET  /api/movies/:id                      # Get movie details with showtimes
```

**Query Parameters for GET /api/movies:**
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Partial text search on title (case-insensitive) |
| genre | string | Filter by genre |
| mpaaRating | string | Filter by MPAA rating (G, PG, PG-13, R, NR) |
| year | number | Filter by release year |
| sortBy | string | Sort field (title, rating, releaseYear) |
| sortOrder | string | Sort direction (asc, desc) |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20, max: 100) |

### Watchlist (Protected - requires JWT)
```
GET    /api/watchlist                     # Get user's watchlist
GET    /api/watchlist/count               # Get watchlist item count
POST   /api/watchlist                     # Add movie to watchlist
DELETE /api/watchlist/:movieId            # Remove movie from watchlist
```

## Quick Start

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0
- MongoDB (local or Atlas)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd fandengo-demo
   npm install
   ```

2. **Configure environment variables**

   Root (`.env`):
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   # Backend Configuration
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/fandango_clone
   JWT_SECRET=your-secret-key-here

   # Frontend Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod

   # Or use MongoDB Atlas and update MONGODB_URI
   ```

4. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start development servers**
   ```bash
   # From root - starts both frontend and backend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Movies: http://localhost:3000/movies
   - API: http://localhost:5000
   - Health: http://localhost:5000/health

## Testing

### Run All Tests
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test
```

### Test Coverage
```bash
# Frontend
cd frontend && npm run test:coverage

# Backend
cd backend && npm run test:coverage
```

### Test Summary
| Suite | Tests | Coverage Threshold |
|-------|-------|-------------------|
| Frontend | 40 | 70% |
| Backend | 47 | 70% |
| **Total** | **87** | - |

Tests use pure mock data (no database dependencies) for fast, reliable execution.

## Database Schema

### User
```typescript
{
  _id: ObjectId,
  email: string,          // Unique, lowercase
  password: string,       // bcrypt hashed
  name: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Movie
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  poster: string,         // TMDB image URL
  genres: string[],
  mpaaRating: string,     // G, PG, PG-13, R, NR
  rating: number,         // 0-5
  releaseYear: number,
  duration: number,       // minutes
  cast: string[],
  director: string,
  trailerUrl?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Watchlist
```typescript
{
  _id: ObjectId,
  userId: ObjectId,       // Reference to User
  movieId: ObjectId,      // Reference to Movie
  createdAt: Date,
  updatedAt: Date
}
// Unique index on (userId, movieId)
```

### Theater
```typescript
{
  _id: ObjectId,
  name: string,
  location: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Showtime
```typescript
{
  _id: ObjectId,
  movieId: ObjectId,      // Reference to Movie
  theaterId: ObjectId,    // Reference to Theater
  startTime: Date,
  format: string,         // Standard, IMAX, 3D, Dolby
  price: number,
  seatsAvailable: number,
  createdAt: Date,
  updatedAt: Date
}
```

## API Usage Examples

### Search Movies
```bash
# Search for "dark" in titles
curl "http://localhost:5000/api/movies?search=dark"

# Filter by genre and rating
curl "http://localhost:5000/api/movies?genre=Action&mpaaRating=PG-13"

# Sort by rating descending with pagination
curl "http://localhost:5000/api/movies?sortBy=rating&sortOrder=desc&page=1&limit=10"
```

### Authentication
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123", "name": "John Doe"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Get profile (with token)
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <token>"
```

### Watchlist
```bash
# Add to watchlist
curl -X POST http://localhost:5000/api/watchlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"movieId": "507f1f77bcf86cd799439011"}'

# Get watchlist
curl http://localhost:5000/api/watchlist \
  -H "Authorization: Bearer <token>"

# Remove from watchlist
curl -X DELETE http://localhost:5000/api/watchlist/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>"
```

## Scripts Reference

### Root Level
```bash
npm install              # Install all dependencies
npm run dev              # Start frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run build            # Build both workspaces
```

### Backend
```bash
cd backend
npm run dev              # Development server with nodemon
npm run build            # Compile TypeScript
npm start                # Run compiled code
npm run seed             # Seed database with sample data
npm test                 # Run tests
npm run test:coverage    # Run tests with coverage
```

### Frontend
```bash
cd frontend
npm run dev              # Next.js development server
npm run build            # Production build
npm start                # Production server
npm run lint             # ESLint
npm test                 # Run tests
npm run test:coverage    # Run tests with coverage
```

## Troubleshooting

### MongoDB Connection Failed
```bash
# Verify MongoDB is running
mongod --version

# Check connection string in backend/.env
# Ensure MONGODB_URI is correct
```

### Port Already in Use
```bash
# Check ports 3000 (frontend) and 5000 (backend)
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

### Tests Failing
```bash
# Clear caches and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm install

# Run tests individually to isolate issues
cd frontend && npm test
cd backend && npm test
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf frontend/.next

# Clear TypeScript build
rm -rf backend/dist

# Rebuild
npm run build
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Set strong `JWT_SECRET`
- [ ] Restrict CORS origins
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure error logging/monitoring
- [ ] Review security headers

## License

MIT License
