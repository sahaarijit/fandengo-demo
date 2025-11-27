"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WatchlistService } from "./services/watchlist.service";
import { Movie } from "@/shared/types";
import Image from "next/image";
import { Star, Trash2, Film } from "lucide-react";
import { useAuth } from "../auth/context/AuthContext";

export default function WatchlistPage() {
	const router = useRouter();
	const { isAuthenticated, loading: authLoading } = useAuth();
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [removingId, setRemovingId] = useState<string | null>(null);

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/auth/login");
			return;
		}

		if (isAuthenticated) {
			fetchWatchlist();
		}
	}, [isAuthenticated, authLoading, router]);

	const fetchWatchlist = async () => {
		setLoading(true);
		setError("");

		try {
			const response = await WatchlistService.getWatchlist();
			setMovies(response.watchlist);
		} catch (err: any) {
			setError(err.message || "Failed to load watchlist");
		} finally {
			setLoading(false);
		}
	};

	const handleRemove = async (movieId: string) => {
		setRemovingId(movieId);

		try {
			await WatchlistService.removeFromWatchlist(movieId);
			setMovies((prev) => prev.filter((movie) => movie._id !== movieId));
		} catch (err: any) {
			console.error("Remove error:", err);
			setError(err.message || "Failed to remove from watchlist");
		} finally {
			setRemovingId(null);
		}
	};

	if (authLoading || loading) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
				<div className="text-center">
					<p className="text-red-400 text-lg mb-4">{error}</p>
					<button
						onClick={fetchWatchlist}
						className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-white mb-2">My Watchlist</h1>
					<p className="text-gray-400">
						{movies.length} {movies.length === 1 ? "movie" : "movies"} in your watchlist
					</p>
				</div>

				{movies.length === 0 ? (
					<div className="text-center py-20">
						<Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
						<p className="text-gray-400 text-lg mb-2">Your watchlist is empty</p>
						<p className="text-gray-500 mb-6">Start adding movies you want to watch!</p>
						<button
							onClick={() => router.push("/movies")}
							className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
						>
							Browse Movies
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
						{movies.map((movie) => {
							const fullStars = Math.floor(movie.rating);
							const hasHalfStar = movie.rating % 1 >= 0.5;

							return (
								<div key={movie._id} className="group relative bg-gray-800 rounded-lg overflow-hidden">
									<div
										className="aspect-[2/3] relative overflow-hidden cursor-pointer"
										onClick={() => router.push(`/movies/${movie._id}`)}
									>
										<Image
											src={movie.poster}
											alt={movie.title}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-300"
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										/>
									</div>
									<div className="p-4">
										<h3
											className="text-white font-semibold text-lg mb-2 line-clamp-1 cursor-pointer hover:text-orange-400 transition-colors"
											onClick={() => router.push(`/movies/${movie._id}`)}
										>
											{movie.title}
										</h3>
										<div className="flex items-center gap-2 mb-2">
											<div className="flex items-center gap-1">
												{[...Array(fullStars)].map((_, i) => (
													<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
												))}
												{hasHalfStar && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />}
												{[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
													<Star key={i} className="w-4 h-4 text-gray-600" />
												))}
											</div>
											<span className="text-gray-400 text-sm">{movie.rating.toFixed(1)}</span>
										</div>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2 text-sm text-gray-400">
												<span className="px-2 py-1 bg-gray-700 rounded text-xs">{movie.mpaaRating}</span>
												<span>{movie.releaseYear}</span>
											</div>
											<button
												onClick={() => handleRemove(movie._id)}
												disabled={removingId === movie._id}
												className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
												title="Remove from watchlist"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
