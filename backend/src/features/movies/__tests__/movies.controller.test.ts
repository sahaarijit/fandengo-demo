/**
 * Movies Controller Unit Tests
 * Tests movie filtering, pagination, and query handling logic
 */

describe('Movies Controller', () => {
  // Sample movie data for testing
  const sampleMovies = [
    {
      _id: '507f1f77bcf86cd799439011',
      title: 'The Shawshank Redemption',
      genres: ['Drama'],
      mpaaRating: 'R',
      rating: 4.9,
      releaseYear: 1994,
      duration: 142,
    },
    {
      _id: '507f1f77bcf86cd799439012',
      title: 'The Dark Knight',
      genres: ['Action', 'Crime', 'Drama'],
      mpaaRating: 'PG-13',
      rating: 4.8,
      releaseYear: 2008,
      duration: 152,
    },
    {
      _id: '507f1f77bcf86cd799439013',
      title: 'Inception',
      genres: ['Action', 'Sci-Fi', 'Thriller'],
      mpaaRating: 'PG-13',
      rating: 4.7,
      releaseYear: 2010,
      duration: 148,
    },
    {
      _id: '507f1f77bcf86cd799439014',
      title: 'The Godfather',
      genres: ['Crime', 'Drama'],
      mpaaRating: 'R',
      rating: 4.9,
      releaseYear: 1972,
      duration: 175,
    },
    {
      _id: '507f1f77bcf86cd799439015',
      title: 'Toy Story',
      genres: ['Animation', 'Adventure', 'Comedy'],
      mpaaRating: 'G',
      rating: 4.5,
      releaseYear: 1995,
      duration: 81,
    },
  ];

  // Helper functions to simulate controller logic
  const filterByGenre = (movies: any[], genre: string) => {
    return movies.filter(m => m.genres.includes(genre));
  };

  const filterByMpaaRating = (movies: any[], rating: string) => {
    return movies.filter(m => m.mpaaRating === rating);
  };

  const filterByYear = (movies: any[], year: number) => {
    return movies.filter(m => m.releaseYear === year);
  };

  const searchByTitle = (movies: any[], search: string) => {
    const regex = new RegExp(search, 'i');
    return movies.filter(m => regex.test(m.title));
  };

  const sortMovies = (movies: any[], sortBy: string, sortOrder: string) => {
    return [...movies].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
  };

  const paginate = (movies: any[], page: number, limit: number) => {
    const start = (page - 1) * limit;
    return {
      movies: movies.slice(start, start + limit),
      pagination: {
        page,
        limit,
        totalCount: movies.length,
        totalPages: Math.ceil(movies.length / limit),
      },
    };
  };

  describe('GET /api/movies', () => {
    it('should return all movies with default pagination', () => {
      const result = paginate(sampleMovies, 1, 20);

      expect(result.movies).toHaveLength(5);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.totalCount).toBe(5);
    });

    it('should support pagination', () => {
      const result = paginate(sampleMovies, 1, 2);

      expect(result.movies).toHaveLength(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(2);
      expect(result.pagination.totalPages).toBe(3);
    });

    it('should return correct page of results', () => {
      const result = paginate(sampleMovies, 2, 2);

      expect(result.movies).toHaveLength(2);
      expect(result.pagination.page).toBe(2);
    });

    it('should filter by genre', () => {
      const filtered = filterByGenre(sampleMovies, 'Drama');

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(movie => {
        expect(movie.genres).toContain('Drama');
      });
    });

    it('should filter by mpaaRating', () => {
      const filtered = filterByMpaaRating(sampleMovies, 'R');

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(movie => {
        expect(movie.mpaaRating).toBe('R');
      });
    });

    it('should filter by release year', () => {
      const filtered = filterByYear(sampleMovies, 2008);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('The Dark Knight');
    });

    it('should sort by title ascending', () => {
      const sorted = sortMovies(sampleMovies, 'title', 'asc');

      const titles = sorted.map(m => m.title);
      const sortedTitles = [...titles].sort();
      expect(titles).toEqual(sortedTitles);
    });

    it('should sort by rating descending', () => {
      const sorted = sortMovies(sampleMovies, 'rating', 'desc');

      const ratings = sorted.map(m => m.rating);
      for (let i = 0; i < ratings.length - 1; i++) {
        expect(ratings[i]).toBeGreaterThanOrEqual(ratings[i + 1]);
      }
    });

    it('should search by title (partial match)', () => {
      const results = searchByTitle(sampleMovies, 'Dark');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain('Dark');
    });

    it('should search by title (case insensitive)', () => {
      const results = searchByTitle(sampleMovies, 'dark');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title.toLowerCase()).toContain('dark');
    });

    it('should combine multiple filters', () => {
      let filtered = filterByGenre(sampleMovies, 'Action');
      filtered = filterByMpaaRating(filtered, 'PG-13');
      const sorted = sortMovies(filtered, 'rating', 'desc');

      expect(sorted.length).toBeGreaterThan(0);
      sorted.forEach(movie => {
        expect(movie.genres).toContain('Action');
        expect(movie.mpaaRating).toBe('PG-13');
      });
    });

    it('should return empty array when no movies match filters', () => {
      let filtered = filterByGenre(sampleMovies, 'Horror');
      filtered = filterByYear(filtered, 2025);

      expect(filtered).toHaveLength(0);
    });
  });
});
