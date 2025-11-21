// ==================== Legacy Types ====================
export interface Item {
  _id: string
  name: string
  description?: string
  quantity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateItemDto {
  name: string
  description?: string
  quantity: number
  isActive?: boolean
}

export interface UpdateItemDto {
  name?: string
  description?: string
  quantity?: number
  isActive?: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  details?: any
  count?: number
}

// ==================== Fandango Clone Types ====================

// User types
export interface User {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Movie types
export interface Movie {
  _id: string
  title: string
  description: string
  poster: string
  genres: string[]
  mpaaRating: 'G' | 'PG' | 'PG-13' | 'R' | 'NR'
  rating: number
  releaseYear: number
  duration: number
  cast: string[]
  director: string
  trailerUrl?: string
  createdAt: string
  updatedAt: string
}

export interface MoviesResponse {
  movies: Movie[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
  }
}

// Theater types
export interface Theater {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  distance?: number
}

export interface Showtime {
  id: string
  date: string
  time: string
}

export interface TheaterShowtime {
  theater: Theater
  showtimes: Showtime[]
}

export interface MovieDetailsResponse {
  movie: Movie
  theaters: TheaterShowtime[]
}

// Watchlist types
export interface WatchlistResponse {
  watchlist: Movie[]
}

export interface WatchlistCountResponse {
  count: number
}

export interface WatchlistAddResponse {
  watchlistItem: {
    id: string
    movieId: string
  }
  count: number
}

export interface WatchlistRemoveResponse {
  message: string
  count: number
}
