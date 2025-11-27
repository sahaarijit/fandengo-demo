"use client";

import { Movie } from "@/shared/types";
import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MovieGridProps {
	movies: Movie[];
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	loading?: boolean;
}

export default function MovieGrid({ movies, currentPage, totalPages, onPageChange, loading = false }: MovieGridProps) {
	if (loading) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
			</div>
		);
	}

	if (movies.length === 0) {
		return (
			<div className="text-center py-20">
				<p className="text-gray-400 text-lg">No movies found. Try adjusting your filters.</p>
			</div>
		);
	}

	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;
		let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		if (endPage - startPage < maxVisiblePages - 1) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		return pages;
	};

	return (
		<div className="space-y-8">
			{/* Movie Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{movies.map((movie) => (
					<MovieCard key={movie._id} movie={movie} />
				))}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<button
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<ChevronLeft className="w-5 h-5" />
					</button>

					{getPageNumbers().map((page) => (
						<button
							key={page}
							onClick={() => onPageChange(page)}
							className={`px-4 py-2 rounded-lg transition-colors ${
								page === currentPage ? "bg-orange-600 text-white" : "bg-gray-800 text-white hover:bg-gray-700"
							}`}
						>
							{page}
						</button>
					))}

					<button
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<ChevronRight className="w-5 h-5" />
					</button>
				</div>
			)}
		</div>
	);
}
