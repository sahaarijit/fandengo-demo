"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	const router = useRouter();

	useEffect(() => {
		console.error("Watchlist error:", error);
	}, [error]);

	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
			<div className="text-center max-w-md">
				<h2 className="text-2xl font-bold text-white mb-4">Failed to load watchlist</h2>
				<p className="text-gray-400 mb-6">{error.message || "An error occurred while loading your watchlist"}</p>
				<div className="flex gap-4 justify-center">
					<button
						onClick={() => reset()}
						className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
					>
						Try again
					</button>
					<button
						onClick={() => router.push("/movies")}
						className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
					>
						Browse Movies
					</button>
				</div>
			</div>
		</div>
	);
}
