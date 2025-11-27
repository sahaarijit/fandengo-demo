"use client";

import { useState } from "react";
import { Movie } from "@/shared/types";
import Image from "next/image";
import Link from "next/link";
import { Star, Film } from "lucide-react";

interface MovieCardProps {
	movie: Movie;
}

const PLACEHOLDER_IMAGE =
	"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM0YjU1NjMiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";

export default function MovieCard({ movie }: MovieCardProps) {
	const [imgError, setImgError] = useState(false);
	const fullStars = Math.floor(movie.rating);
	const hasHalfStar = movie.rating % 1 >= 0.5;

	return (
		<Link href={`/movies/${movie._id}`}>
			<div className="group relative bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-orange-500 transition-all duration-300 cursor-pointer h-full">
				<div className="aspect-[2/3] relative overflow-hidden">
					{imgError ? (
						<div className="absolute inset-0 bg-gray-700 flex flex-col items-center justify-center">
							<Film className="w-16 h-16 text-gray-500 mb-2" />
							<span className="text-gray-500 text-sm">No Image</span>
						</div>
					) : (
						<Image
							src={movie.poster}
							alt={movie.title}
							fill
							className="object-cover group-hover:scale-105 transition-transform duration-300"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							onError={() => setImgError(true)}
						/>
					)}
				</div>
				<div className="p-4">
					<h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">{movie.title}</h3>
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
					<div className="flex items-center gap-2 text-sm text-gray-400">
						<span className="px-2 py-1 bg-gray-700 rounded text-xs">{movie.mpaaRating}</span>
						<span>{movie.releaseYear}</span>
						<span>•</span>
						<span>{movie.duration} min</span>
					</div>
					<div className="mt-2 flex flex-wrap gap-1">
						{movie.genres.slice(0, 2).map((genre, idx) => (
							<span key={idx} className="text-xs text-orange-400 bg-orange-900/30 px-2 py-1 rounded">
								{genre}
							</span>
						))}
					</div>
				</div>
			</div>
		</Link>
	);
}
