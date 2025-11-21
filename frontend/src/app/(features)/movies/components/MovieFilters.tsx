'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

interface MovieFiltersProps {
  onSearchChange: (search: string) => void;
  onGenreChange: (genre: string) => void;
  onRatingChange: (rating: string) => void;
  onYearChange: (year: string) => void;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  searchValue: string;
  genreValue: string;
  ratingValue: string;
  yearValue: string;
  sortByValue: string;
  sortOrderValue: string;
}

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
  'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
];

const RATINGS = ['G', 'PG', 'PG-13', 'R', 'NR'];

const YEARS = Array.from({ length: 95 }, (_, i) => 2025 - i);

export default function MovieFilters({
  onSearchChange,
  onGenreChange,
  onRatingChange,
  onYearChange,
  onSortChange,
  searchValue,
  genreValue,
  ratingValue,
  yearValue,
  sortByValue,
  sortOrderValue,
}: MovieFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);

  // Debounce search with 500ms delay
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearchChange(value);
    }, 500),
    [onSearchChange]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSearch(value);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search movies by title..."
          value={localSearch}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Filters Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
      </button>

      {/* Filters Section */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
            <select
              value={genreValue}
              onChange={(e) => onGenreChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Genres</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* MPAA Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
            <select
              value={ratingValue}
              onChange={(e) => onRatingChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Ratings</option>
              {RATINGS.map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Release Year</label>
            <select
              value={yearValue}
              onChange={(e) => onYearChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Years</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
            <div className="flex gap-2">
              <select
                value={sortByValue}
                onChange={(e) => onSortChange(e.target.value, sortOrderValue)}
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="title">Title</option>
                <option value="rating">Rating</option>
                <option value="releaseYear">Year</option>
              </select>
              <button
                onClick={() => onSortChange(sortByValue, sortOrderValue === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
              >
                {sortOrderValue === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
