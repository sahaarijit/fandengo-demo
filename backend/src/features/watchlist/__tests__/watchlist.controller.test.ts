/**
 * Watchlist Controller Unit Tests
 * Tests watchlist CRUD operations with mocked dependencies
 */

import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { WatchlistController } from "../watchlist.controller";
import { Watchlist } from "../watchlist.model";
import { Movie } from "../../movies/movie.model";

// Mock dependencies
jest.mock("../watchlist.model");
jest.mock("../../movies/movie.model");

const MockedWatchlist = Watchlist as jest.Mocked<typeof Watchlist>;
const MockedMovie = Movie as jest.Mocked<typeof Movie>;

describe("WatchlistController", () => {
	let mockReq: Partial<Request>;
	let mockRes: Partial<Response>;
	let mockNext: NextFunction;

	const mockUserId = "user123";
	const mockMovieId = "507f1f77bcf86cd799439011";

	const mockMovie = {
		_id: mockMovieId,
		title: "The Dark Knight",
		genres: ["Action", "Crime", "Drama"],
		rating: 4.8,
	};

	beforeEach(() => {
		jest.clearAllMocks();

		mockReq = {
			body: {},
			params: {},
		};
		(mockReq as any).userId = mockUserId;

		mockRes = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		mockNext = jest.fn();
	});

	describe("getAll", () => {
		it("should return all watchlist items for user", async () => {
			const mockWatchlistItems = [
				{ _id: "watch1", userId: mockUserId, movieId: mockMovie },
				{ _id: "watch2", userId: mockUserId, movieId: { ...mockMovie, _id: "movie2", title: "Inception" } },
			];

			const mockSelect = jest.fn().mockReturnValue({
				sort: jest.fn().mockResolvedValue(mockWatchlistItems),
			});
			const mockPopulate = jest.fn().mockReturnValue({ select: mockSelect });
			(MockedWatchlist.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

			await WatchlistController.getAll(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedWatchlist.find).toHaveBeenCalledWith({ userId: mockUserId });
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: {
					watchlist: [mockMovie, { ...mockMovie, _id: "movie2", title: "Inception" }],
				},
			});
		});

		it("should filter out null movies", async () => {
			const mockWatchlistItems = [
				{ _id: "watch1", userId: mockUserId, movieId: mockMovie },
				{ _id: "watch2", userId: mockUserId, movieId: null },
			];

			const mockSelect = jest.fn().mockReturnValue({
				sort: jest.fn().mockResolvedValue(mockWatchlistItems),
			});
			const mockPopulate = jest.fn().mockReturnValue({ select: mockSelect });
			(MockedWatchlist.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

			await WatchlistController.getAll(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: {
					watchlist: [mockMovie],
				},
			});
		});

		it("should return empty watchlist", async () => {
			const mockSelect = jest.fn().mockReturnValue({
				sort: jest.fn().mockResolvedValue([]),
			});
			const mockPopulate = jest.fn().mockReturnValue({ select: mockSelect });
			(MockedWatchlist.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

			await WatchlistController.getAll(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: {
					watchlist: [],
				},
			});
		});

		it("should call next with error on exception", async () => {
			const error = new Error("Database error");
			(MockedWatchlist.find as jest.Mock).mockImplementation(() => {
				throw error;
			});

			await WatchlistController.getAll(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);
		});
	});

	describe("getCount", () => {
		it("should return watchlist count for user", async () => {
			(MockedWatchlist.countDocuments as jest.Mock).mockResolvedValue(5);

			await WatchlistController.getCount(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedWatchlist.countDocuments).toHaveBeenCalledWith({ userId: mockUserId });
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: { count: 5 },
			});
		});

		it("should return zero count for empty watchlist", async () => {
			(MockedWatchlist.countDocuments as jest.Mock).mockResolvedValue(0);

			await WatchlistController.getCount(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: { count: 0 },
			});
		});

		it("should call next with error on exception", async () => {
			const error = new Error("Database error");
			(MockedWatchlist.countDocuments as jest.Mock).mockRejectedValue(error);

			await WatchlistController.getCount(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);
		});
	});

	describe("add", () => {
		beforeEach(() => {
			mockReq.body = { movieId: mockMovieId };
		});

		it("should add movie to watchlist successfully", async () => {
			(MockedMovie.findById as jest.Mock).mockResolvedValue(mockMovie);
			(MockedWatchlist.findOne as jest.Mock).mockResolvedValue(null);
			(MockedWatchlist.create as jest.Mock).mockResolvedValue({
				_id: "watchlist123",
				userId: mockUserId,
				movieId: mockMovieId,
			});
			(MockedWatchlist.countDocuments as jest.Mock).mockResolvedValue(1);

			await WatchlistController.add(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedMovie.findById).toHaveBeenCalledWith(mockMovieId);
			expect(MockedWatchlist.findOne).toHaveBeenCalledWith({ userId: mockUserId, movieId: mockMovieId });
			expect(MockedWatchlist.create).toHaveBeenCalledWith({ userId: mockUserId, movieId: mockMovieId });
			expect(mockRes.status).toHaveBeenCalledWith(201);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: {
					watchlistItem: {
						id: "watchlist123",
						movieId: mockMovieId,
					},
					count: 1,
				},
			});
		});

		it("should return 404 if movie not found", async () => {
			(MockedMovie.findById as jest.Mock).mockResolvedValue(null);

			await WatchlistController.add(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				error: "Movie not found",
			});
		});

		it("should return 400 if movie already in watchlist", async () => {
			(MockedMovie.findById as jest.Mock).mockResolvedValue(mockMovie);
			(MockedWatchlist.findOne as jest.Mock).mockResolvedValue({ _id: "existing" });

			await WatchlistController.add(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				error: "Movie already in watchlist",
			});
		});

		it("should call next with error on exception", async () => {
			const error = new Error("Database error");
			(MockedMovie.findById as jest.Mock).mockRejectedValue(error);

			await WatchlistController.add(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);
		});
	});

	describe("remove", () => {
		beforeEach(() => {
			mockReq.params = { movieId: mockMovieId };
		});

		it("should remove movie from watchlist successfully", async () => {
			jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
			(MockedWatchlist.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });
			(MockedWatchlist.countDocuments as jest.Mock).mockResolvedValue(0);

			await WatchlistController.remove(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedWatchlist.deleteOne).toHaveBeenCalledWith({ userId: mockUserId, movieId: mockMovieId });
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: {
					message: "Movie removed from watchlist",
					count: 0,
				},
			});
		});

		it("should return 400 for invalid movie ID", async () => {
			mockReq.params = { movieId: "invalid-id" };
			jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

			await WatchlistController.remove(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				error: "Invalid movie ID",
			});
		});

		it("should return 404 if movie not in watchlist", async () => {
			jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
			(MockedWatchlist.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 0 });

			await WatchlistController.remove(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				error: "Movie not in watchlist",
			});
		});

		it("should call next with error on exception", async () => {
			jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
			const error = new Error("Database error");
			(MockedWatchlist.deleteOne as jest.Mock).mockRejectedValue(error);

			await WatchlistController.remove(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);
		});
	});
});
