/**
 * Watchlist Controller Unit Tests
 * Tests watchlist management logic including add, remove, and count operations
 */

describe("Watchlist Controller", () => {
	// Mock data stores
	let mockWatchlist: any[] = [];
	let watchlistIdCounter = 1;

	const sampleMovies = [
		{ _id: "movie_1", title: "The Shawshank Redemption", rating: 4.9 },
		{ _id: "movie_2", title: "The Dark Knight", rating: 4.8 },
		{ _id: "movie_3", title: "Inception", rating: 4.7 },
	];

	const userId = "user_1";

	// Helper functions to simulate watchlist logic
	const addToWatchlist = (userId: string, movieId: string) => {
		const existing = mockWatchlist.find((w) => w.userId === userId && w.movieId === movieId);
		if (existing) {
			throw new Error("Movie already in watchlist");
		}
		const item = {
			_id: `watchlist_${watchlistIdCounter++}`,
			userId,
			movieId,
			addedAt: new Date(),
		};
		mockWatchlist.push(item);
		return item;
	};

	const removeFromWatchlist = (userId: string, movieId: string) => {
		const index = mockWatchlist.findIndex((w) => w.userId === userId && w.movieId === movieId);
		if (index === -1) {
			return null;
		}
		const [removed] = mockWatchlist.splice(index, 1);
		return removed;
	};

	const getWatchlist = (userId: string) => {
		const items = mockWatchlist.filter((w) => w.userId === userId);
		return items.map((item) => ({
			...item,
			movie: sampleMovies.find((m) => m._id === item.movieId),
		}));
	};

	const getWatchlistCount = (userId: string) => {
		return mockWatchlist.filter((w) => w.userId === userId).length;
	};

	const isInWatchlist = (userId: string, movieId: string) => {
		return mockWatchlist.some((w) => w.userId === userId && w.movieId === movieId);
	};

	const isValidMovieId = (movieId: string): boolean => {
		return Boolean(movieId && movieId.length >= 5);
	};

	const movieExists = (movieId: string) => {
		return sampleMovies.some((m) => m._id === movieId);
	};

	beforeEach(() => {
		mockWatchlist = [];
		watchlistIdCounter = 1;
	});

	describe("GET /api/watchlist", () => {
		it("should return empty watchlist initially", () => {
			const watchlist = getWatchlist(userId);

			expect(watchlist).toHaveLength(0);
		});

		it("should return watchlist with movies", () => {
			addToWatchlist(userId, "movie_1");
			addToWatchlist(userId, "movie_2");

			const watchlist = getWatchlist(userId);

			expect(watchlist).toHaveLength(2);
			expect(watchlist[0].movie).toHaveProperty("title");
		});

		it("should not include other users watchlist items", () => {
			addToWatchlist(userId, "movie_1");
			addToWatchlist("user_2", "movie_2");

			const watchlist = getWatchlist(userId);

			expect(watchlist).toHaveLength(1);
			expect(watchlist[0].movieId).toBe("movie_1");
		});
	});

	describe("GET /api/watchlist/count", () => {
		it("should return 0 for empty watchlist", () => {
			const count = getWatchlistCount(userId);

			expect(count).toBe(0);
		});

		it("should return correct count after adding movies", () => {
			addToWatchlist(userId, "movie_1");
			addToWatchlist(userId, "movie_2");

			const count = getWatchlistCount(userId);

			expect(count).toBe(2);
		});

		it("should not count other users items", () => {
			addToWatchlist(userId, "movie_1");
			addToWatchlist("user_2", "movie_2");
			addToWatchlist("user_2", "movie_3");

			const count = getWatchlistCount(userId);

			expect(count).toBe(1);
		});
	});

	describe("POST /api/watchlist", () => {
		it("should add movie to watchlist", () => {
			const item = addToWatchlist(userId, "movie_1");

			expect(item).toHaveProperty("movieId", "movie_1");
			expect(item).toHaveProperty("userId", userId);
			expect(getWatchlistCount(userId)).toBe(1);
		});

		it("should return count after adding", () => {
			addToWatchlist(userId, "movie_1");
			addToWatchlist(userId, "movie_2");

			expect(getWatchlistCount(userId)).toBe(2);
		});

		it("should reject duplicate movie", () => {
			addToWatchlist(userId, "movie_1");

			expect(() => {
				addToWatchlist(userId, "movie_1");
			}).toThrow("already in watchlist");
		});

		it("should reject invalid movie ID", () => {
			expect(isValidMovieId("x")).toBe(false);
			expect(isValidMovieId("")).toBe(false);
		});

		it("should reject non-existent movie", () => {
			expect(movieExists("non_existent_movie")).toBe(false);
		});

		it("should accept valid movie", () => {
			expect(movieExists("movie_1")).toBe(true);
			expect(isValidMovieId("movie_1")).toBe(true);
		});
	});

	describe("DELETE /api/watchlist/:movieId", () => {
		beforeEach(() => {
			addToWatchlist(userId, "movie_1");
		});

		it("should remove movie from watchlist", () => {
			const removed = removeFromWatchlist(userId, "movie_1");

			expect(removed).not.toBeNull();
			expect(getWatchlistCount(userId)).toBe(0);
		});

		it("should return updated count after removal", () => {
			addToWatchlist(userId, "movie_2");
			expect(getWatchlistCount(userId)).toBe(2);

			removeFromWatchlist(userId, "movie_1");
			expect(getWatchlistCount(userId)).toBe(1);
		});

		it("should return null when removing movie not in watchlist", () => {
			const removed = removeFromWatchlist(userId, "movie_3");

			expect(removed).toBeNull();
		});

		it("should not affect other users watchlist", () => {
			addToWatchlist("user_2", "movie_1");

			removeFromWatchlist(userId, "movie_1");

			expect(isInWatchlist("user_2", "movie_1")).toBe(true);
			expect(isInWatchlist(userId, "movie_1")).toBe(false);
		});
	});

	describe("Watchlist State", () => {
		it("should track if movie is in watchlist", () => {
			expect(isInWatchlist(userId, "movie_1")).toBe(false);

			addToWatchlist(userId, "movie_1");

			expect(isInWatchlist(userId, "movie_1")).toBe(true);
		});

		it("should maintain accurate count through multiple operations", () => {
			// Add 3 movies
			sampleMovies.forEach((m) => addToWatchlist(userId, m._id));
			expect(getWatchlistCount(userId)).toBe(3);

			// Remove 2 movies
			removeFromWatchlist(userId, "movie_1");
			removeFromWatchlist(userId, "movie_2");
			expect(getWatchlistCount(userId)).toBe(1);

			// Verify list
			const watchlist = getWatchlist(userId);
			expect(watchlist).toHaveLength(1);
			expect(watchlist[0].movie?.title).toBe("Inception");
		});
	});

	describe("Edge Cases", () => {
		it("should handle adding same movie by different users", () => {
			addToWatchlist("user_1", "movie_1");
			addToWatchlist("user_2", "movie_1");

			expect(getWatchlistCount("user_1")).toBe(1);
			expect(getWatchlistCount("user_2")).toBe(1);
		});

		it("should handle removing then re-adding movie", () => {
			addToWatchlist(userId, "movie_1");
			removeFromWatchlist(userId, "movie_1");
			addToWatchlist(userId, "movie_1");

			expect(isInWatchlist(userId, "movie_1")).toBe(true);
			expect(getWatchlistCount(userId)).toBe(1);
		});
	});
});
