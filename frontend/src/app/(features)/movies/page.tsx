'use client';

import { useState, useEffect } from 'react';
import { MoviesService } from './services/movies.service';
import { Movie } from '@/shared/types';
import MovieFilters from './components/MovieFilters';
import MovieGrid from './components/MovieGrid';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'releaseYear'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, [search, genre, rating, year, sortBy, sortOrder, currentPage]);

  const fetchMovies = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await MoviesService.getMovies({
        search: search || undefined,
        genre: genre || undefined,
        mpaaRating: rating || undefined,
        releaseYear: year ? parseInt(year) : undefined,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 20,
      });

      setMovies(response.movies);
      setTotalPages(response.pagination.totalPages);
      setTotalCount(response.pagination.totalCount);
    } catch (err: any) {
      setError(err.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleGenreChange = (value: string) => {
    setGenre(value);
    setCurrentPage(1);
  };

  const handleRatingChange = (value: string) => {
    setRating(value);
    setCurrentPage(1);
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy as 'title' | 'rating' | 'releaseYear');
    setSortOrder(newSortOrder as 'asc' | 'desc');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Movies</h1>
          <p className="text-gray-400">
            {totalCount} {totalCount === 1 ? 'movie' : 'movies'} available
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-900/50 border border-red-700 p-4">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <div className="mb-8">
          <MovieFilters
            onSearchChange={handleSearchChange}
            onGenreChange={handleGenreChange}
            onRatingChange={handleRatingChange}
            onYearChange={handleYearChange}
            onSortChange={handleSortChange}
            searchValue={search}
            genreValue={genre}
            ratingValue={rating}
            yearValue={year}
            sortByValue={sortBy}
            sortOrderValue={sortOrder}
          />
        </div>

        <MovieGrid
          movies={movies}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          loading={loading}
        />
      </div>
    </div>
  );
}
