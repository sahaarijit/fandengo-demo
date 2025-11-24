'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Film, Heart, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/app/(features)/auth/context/AuthContext';
import { WatchlistService } from '@/app/(features)/watchlist/services/watchlist.service';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWatchlistCount();
    } else {
      setWatchlistCount(0);
    }
  }, [isAuthenticated]);

  // Refetch count when navigating from movie details or watchlist pages
  useEffect(() => {
    if (isAuthenticated && (pathname.startsWith('/movies/') || pathname === '/watchlist')) {
      fetchWatchlistCount();
    }
  }, [pathname, isAuthenticated]);

  const fetchWatchlistCount = async () => {
    try {
      const response = await WatchlistService.getCount();
      setWatchlistCount(response.count);
    } catch (err) {
      console.error('Failed to fetch watchlist count:', err);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
    router.push('/auth/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/movies" className="flex items-center gap-2 group">
            <Film className="w-8 h-8 text-orange-500 group-hover:text-orange-400 transition-colors" />
            <span className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
              Fandango
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/movies"
              className={`text-lg font-medium transition-colors ${
                isActive('/movies') ? 'text-orange-500' : 'text-gray-300 hover:text-white'
              }`}
            >
              Movies
            </Link>

            {isAuthenticated && (
              <Link
                href="/watchlist"
                className={`flex items-center gap-2 text-lg font-medium transition-colors relative ${
                  isActive('/watchlist') ? 'text-orange-500' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>Watchlist</span>
                {watchlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {watchlistCount > 99 ? '99+' : watchlistCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{user?.name || 'User'}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20">
                      <div className="p-3 border-b border-gray-700">
                        <p className="text-white font-medium truncate">{user?.name}</p>
                        <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-white hover:text-orange-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <Link
                href="/movies"
                onClick={() => setShowMobileMenu(false)}
                className={`text-lg font-medium transition-colors ${
                  isActive('/movies') ? 'text-orange-500' : 'text-gray-300'
                }`}
              >
                Movies
              </Link>

              {isAuthenticated && (
                <Link
                  href="/watchlist"
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-2 text-lg font-medium transition-colors relative w-fit ${
                    isActive('/watchlist') ? 'text-orange-500' : 'text-gray-300'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Watchlist</span>
                  {watchlistCount > 0 && (
                    <span className="bg-orange-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                      {watchlistCount > 99 ? '99+' : watchlistCount}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-800">
                  <div className="mb-3">
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-800">
                  <Link
                    href="/auth/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="text-white hover:text-orange-400 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setShowMobileMenu(false)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
