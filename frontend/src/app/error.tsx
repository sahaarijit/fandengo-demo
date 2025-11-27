"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error("Application error:", error);
	}, [error]);

	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
			<div className="text-center max-w-md">
				<h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
				<p className="text-gray-400 mb-6">{error.message || "An unexpected error occurred"}</p>
				<button
					onClick={() => reset()}
					className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
				>
					Try again
				</button>
			</div>
		</div>
	);
}
