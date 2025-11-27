import { WatchlistService } from "../watchlist.service";
import { apiService } from "@/shared/services/api.service";

// Mock apiService
jest.mock("@/shared/services/api.service", () => ({
	apiService: {
		get: jest.fn(),
		post: jest.fn(),
		delete: jest.fn(),
	},
}));

describe("WatchlistService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("getWatchlist", () => {
		it("should return watchlist movies", async () => {
			const mockResponse = {
				data: {
					watchlist: [
						{ _id: "1", title: "Movie 1" },
						{ _id: "2", title: "Movie 2" },
					],
				},
			};
			(apiService.get as jest.Mock).mockResolvedValue(mockResponse);

			const result = await WatchlistService.getWatchlist();

			expect(apiService.get).toHaveBeenCalledWith("/api/watchlist");
			expect(result).toEqual(mockResponse.data);
			expect(result.watchlist).toHaveLength(2);
		});

		it("should return empty watchlist", async () => {
			const mockResponse = { data: { watchlist: [] } };
			(apiService.get as jest.Mock).mockResolvedValue(mockResponse);

			const result = await WatchlistService.getWatchlist();

			expect(result.watchlist).toHaveLength(0);
		});
	});

	describe("getCount", () => {
		it("should return watchlist count", async () => {
			const mockResponse = { data: { count: 5 } };
			(apiService.get as jest.Mock).mockResolvedValue(mockResponse);

			const result = await WatchlistService.getCount();

			expect(apiService.get).toHaveBeenCalledWith("/api/watchlist/count");
			expect(result.count).toBe(5);
		});

		it("should return zero count for empty watchlist", async () => {
			const mockResponse = { data: { count: 0 } };
			(apiService.get as jest.Mock).mockResolvedValue(mockResponse);

			const result = await WatchlistService.getCount();

			expect(result.count).toBe(0);
		});
	});

	describe("addToWatchlist", () => {
		it("should add movie to watchlist and return updated count", async () => {
			const mockResponse = {
				data: {
					watchlistItem: { id: "wl-1", movieId: "movie-123" },
					count: 3,
				},
			};
			(apiService.post as jest.Mock).mockResolvedValue(mockResponse);

			const result = await WatchlistService.addToWatchlist("movie-123");

			expect(apiService.post).toHaveBeenCalledWith("/api/watchlist", { movieId: "movie-123" });
			expect(result.watchlistItem.movieId).toBe("movie-123");
			expect(result.count).toBe(3);
		});
	});

	describe("removeFromWatchlist", () => {
		it("should remove movie from watchlist and return updated count", async () => {
			const mockResponse = {
				data: {
					message: "Movie removed from watchlist",
					count: 2,
				},
			};
			(apiService.delete as jest.Mock).mockResolvedValue(mockResponse);

			const result = await WatchlistService.removeFromWatchlist("movie-123");

			expect(apiService.delete).toHaveBeenCalledWith("/api/watchlist/movie-123");
			expect(result.count).toBe(2);
		});

		it("should handle removal of last movie", async () => {
			const mockResponse = {
				data: {
					message: "Movie removed from watchlist",
					count: 0,
				},
			};
			(apiService.delete as jest.Mock).mockResolvedValue(mockResponse);

			const result = await WatchlistService.removeFromWatchlist("movie-123");

			expect(result.count).toBe(0);
		});
	});

	describe("Counter sync scenarios", () => {
		it("should maintain accurate count after add operation", async () => {
			// Simulate adding to watchlist
			const addResponse = { data: { watchlistItem: { movieId: "1" }, count: 1 } };
			(apiService.post as jest.Mock).mockResolvedValue(addResponse);

			const addResult = await WatchlistService.addToWatchlist("1");
			expect(addResult.count).toBe(1);

			// Verify count endpoint returns same value
			const countResponse = { data: { count: 1 } };
			(apiService.get as jest.Mock).mockResolvedValue(countResponse);

			const countResult = await WatchlistService.getCount();
			expect(countResult.count).toBe(addResult.count);
		});

		it("should maintain accurate count after remove operation", async () => {
			// Setup: watchlist has 3 items
			const removeResponse = { data: { message: "Removed", count: 2 } };
			(apiService.delete as jest.Mock).mockResolvedValue(removeResponse);

			const removeResult = await WatchlistService.removeFromWatchlist("1");
			expect(removeResult.count).toBe(2);

			// Verify count endpoint returns same value
			const countResponse = { data: { count: 2 } };
			(apiService.get as jest.Mock).mockResolvedValue(countResponse);

			const countResult = await WatchlistService.getCount();
			expect(countResult.count).toBe(removeResult.count);
		});
	});
});
