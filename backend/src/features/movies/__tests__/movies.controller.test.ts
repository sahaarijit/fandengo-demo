/**
 * Movies Controller Unit Tests
 * Tests movie filtering, pagination, and query handling with mocked dependencies
 */

import { Request, Response, NextFunction } from "express";
import { MoviesController } from "../movies.controller";
import { Movie } from "../movie.model";

// Mock Movie model
jest.mock("../movie.model");

const MockedMovie = Movie as jest.Mocked<typeof Movie>;

describe("MoviesController", () => {
	let mockReq: Partial<Request>;
	let mockRes: Partial<Response>;
	let mockNext: NextFunction;

	const sampleMovies = [
		{
			_id: "507f1f77bcf86cd799439011",
			title: "The Shawshank Redemption",
			genres: ["Drama"],
			mpaaRating: "R",
			rating: 4.9,
			releaseYear: 1994,
		},
		{
			_id: "507f1f77bcf86cd799439012",
			title: "The Dark Knight",
			genres: ["Action", "Crime", "Drama"],
			mpaaRating: "PG-13",
			rating: 4.8,
			releaseYear: 2008,
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();

		mockReq = {
			query: {},
			params: {},
		};

		mockRes = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		mockNext = jest.fn();
	});

	describe("getAll", () => {
		const setupMockChain = (movies: any[], count: number) => {
			const mockSelect = jest.fn().mockResolvedValue(movies);
			const mockLimit = jest.fn().mockReturnValue({ select: mockSelect });
			const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
			const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
			(MockedMovie.find as jest.Mock).mockReturnValue({ sort: mockSort });
			(MockedMovie.countDocuments as jest.Mock).mockResolvedValue(count);
		};

		it("should return all movies with default pagination", async () => {
			mockReq.query = {};
			setupMockChain(sampleMovies, 2);

			await MoviesController.getAll(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedMovie.find).toHaveBeenCalledWith({});
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: {
					movies: sampleMovies,
					pagination: {
						page: 1,
						limit: 20,
						totalCount: 2,
						totalPages: 1,
					},
				},
			});
		});

		it("should apply search filter", async () => {
			mockReq.query = { search: "Dark" };
			setupMockChain([sampleMovies[1]], 1);

			await MoviesController.getAll(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedMovie.find).toHaveBeenCalledWith({
				title: { $regex: "Dark", $options: "i" },
			});
		});

		it("should apply genre filter", async () => {
			mockReq.query = { genre: "Drama" };
			setupMockChain(sampleMovies, 2);

			await MoviesController.getAll(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedMovie.find).toHaveBeenCalledWith({ genres: "Drama" });
		});

		it("should apply mpaaRating filter", async () => {
			mockReq.query = { mpaaRating: "PG-13" };
			setupMockChain([sampleMovies[1]], 1);

			await MoviesController.getAll(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedMovie.find).toHaveBeenCalledWith({ mpaaRating: "PG-13" });
		});

		it("should apply releaseYear filter", async () => {
			mockReq.query = { releaseYear: "2008" } as any;
			setupMockChain([sampleMovies[1]], 1);

			await MoviesController.getAll(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedMovie.find).toHaveBeenCalledWith({ releaseYear: "2008" });
		});

		it("should apply custom sorting", async () => {
			mockReq.query = { sortBy: "rating", sortOrder: "desc" };
			setupMockChain(sampleMovies, 2);

			await MoviesController.getAll(mockReq as Request, mockRes as Response, mockNext);

			const sortCall = (MockedMovie.find as jest.Mock).mock.results[0].value.sort;
			expect(sortCall).toHaveBeenCalledWith({ rating: -1 });
		});

		it("should apply pagination", async () => {
			mockReq.query = { page: "2", limit: "10" } as any;
			setupMockChain([], 25);

			await MoviesController.getAll(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: {
					movies: [],
					pagination: {
						page: "2",
						limit: "10",
						totalCount: 25,
						totalPages: 3,
					},
				},
			});
		});

		it("should combine multiple filters", async () => {
			mockReq.query = {
				search: "Knight",
				genre: "Action",
				mpaaRating: "PG-13",
			};
			setupMockChain([sampleMovies[1]], 1);

			await MoviesController.getAll(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedMovie.find).toHaveBeenCalledWith({
				title: { $regex: "Knight", $options: "i" },
				genres: "Action",
				mpaaRating: "PG-13",
			});
		});

		it("should return empty array when no movies match", async () => {
			mockReq.query = { genre: "Horror" };
			setupMockChain([], 0);

			await MoviesController.getAll(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: {
					movies: [],
					pagination: {
						page: 1,
						limit: 20,
						totalCount: 0,
						totalPages: 0,
					},
				},
			});
		});

		it("should call next with error on exception", async () => {
			const error = new Error("Database error");
			(MockedMovie.find as jest.Mock).mockImplementation(() => {
				throw error;
			});

			await MoviesController.getAll(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);
		});
	});
});
