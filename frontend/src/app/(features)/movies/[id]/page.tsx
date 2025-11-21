'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MoviesService } from '../services/movies.service';
import { WatchlistService } from '../../watchlist/services/watchlist.service';
import { Movie, TheaterShowtime } from '@/shared/types';
import Image from 'next/image';
import { Star, Clock, Calendar, MapPin, ArrowLeft, Heart, Play } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [theaters, setTheaters] = useState<TheaterShowtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    if (isAuthenticated) {
      checkWatchlistStatus();
    }
  }, [movieId, isAuthenticated]);

  const checkWatchlistStatus = async () => {
    try {
      const response = await WatchlistService.getWatchlist();
      const inWatchlist = response.watchlist.some((m) => m._id === movieId);
      setIsInWatchlist(inWatchlist);
    } catch (err) {
      console.error('Failed to check watchlist status:', err);
    }
  };

  const fetchMovieDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await MoviesService.getMovieById(movieId);
      setMovie(response.movie);
      setTheaters(response.theaters);
    } catch (err: any) {
      setError(err.message || 'Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setAddingToWatchlist(true);

    try {
      if (isInWatchlist) {
        await WatchlistService.removeFromWatchlist(movieId);
        setIsInWatchlist(false);
      } else {
        await WatchlistService.addToWatchlist(movieId);
        setIsInWatchlist(true);
      }
    } catch (err: any) {
      console.error('Watchlist error:', err);
    } finally {
      setAddingToWatchlist(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || 'Movie not found'}</p>
          <button
            onClick={() => router.push('/movies')}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  const fullStars = Math.floor(movie.rating);
  const hasHalfStar = movie.rating % 1 >= 0.5;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Movie Hero Section */}
      <div className="relative h-96 md:h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10"></div>
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Poster */}
          <div className="lg:col-span-1">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(fullStars)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    {hasHalfStar && <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 opacity-50" />}
                    {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gray-600" />
                    ))}
                  </div>
                  <span className="text-white text-lg font-semibold">{movie.rating.toFixed(1)}</span>
                </div>
                <span className="px-3 py-1 bg-gray-700 text-white rounded text-sm">{movie.mpaaRating}</span>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{movie.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.releaseYear}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre, idx) => (
                  <span key={idx} className="px-3 py-1 bg-orange-900/30 text-orange-400 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {movie.trailerUrl && (
                  <a
                    href={movie.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Watch Trailer</span>
                  </a>
                )}
                <button
                  onClick={handleWatchlistToggle}
                  disabled={addingToWatchlist}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    isInWatchlist
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
                  <span>{isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Director</h3>
                <p className="text-gray-300">{movie.director}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cast</h3>
                <p className="text-gray-300">{movie.cast.slice(0, 3).join(', ')}</p>
              </div>
            </div>

            {/* Theaters & Showtimes */}
            {theaters.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Theaters & Showtimes</h2>
                <div className="space-y-4">
                  {theaters.map((theaterShowtime, idx) => (
                    <div key={idx} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{theaterShowtime.theater.name}</h3>
                          <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {theaterShowtime.theater.address}, {theaterShowtime.theater.city},{' '}
                              {theaterShowtime.theater.state} {theaterShowtime.theater.zipCode}
                            </span>
                          </div>
                          {theaterShowtime.theater.distance && (
                            <p className="text-gray-500 text-sm mt-1">
                              {theaterShowtime.theater.distance} miles away
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Available Showtimes:</p>
                        <div className="flex flex-wrap gap-2">
                          {theaterShowtime.showtimes.slice(0, 5).map((showtime, sidx) => (
                            <span
                              key={sidx}
                              className="px-3 py-2 bg-gray-700 text-white rounded text-sm hover:bg-orange-600 transition-colors cursor-pointer"
                            >
                              {showtime.time}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
