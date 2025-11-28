/**
 * Movie Details Controller Unit Tests
 * Tests movie details retrieval with showtimes and theater data
 */

import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { MovieDetailsController } from "../movie-details.controller";
import { Movie } from "../../movies/movie.model";
import { Showtime } from "../showtime.model";

// Mock dependencies
jest.mock("../../movies/movie.model");
jest.mock("../showtime.model");

const MockedMovie = Movie as jest.Mocked<typeof Movie>;
const MockedShowtime = Showtime as jest.Mocked<typeof Showtime>;

describe("MovieDetailsController", () => {
	let mockReq: Partial<Request>;
	let mockRes: Partial<Response>;
	let mockNext: NextFunction;

	// Valid MongoDB ObjectId for testing
	const validMovieId = "507f1f77bcf86cd799439011";
	const validTheaterId = "507f1f77bcf86cd799439012";

	const mockMovie = {
		_id: validMovieId,
		title: "The Dark Knight",
		genres: ["Action", "Crime", "Drama"],
		mpaaRating: "PG-13",
		rating: 4.8,
		releaseYear: 2008,
		director: "Christopher Nolan",
		cast: ["Christian Bale", "Heath Ledger"],
		duration: 152,
		description: "A great movie",
	};

	const mockTheater = {
		_id: validTheaterId,
		name: "AMC Empire 25",
		address: "234 W 42nd St",
		city: "New York",
		state: "NY",
		zipCode: "10036",
		distance: 1.2,
	};

	const mockShowtimes = [
		{
			_id: "showtime1",
			movieId: validMovieId,
			theaterId: mockTheater,
			date: new Date("2024-01-15"),
			time: "14:30",
		},
		{
			_id: "showtime2",
			movieId: validMovieId,
			theaterId: mockTheater,
			date: new Date("2024-01-15"),
			time: "18:00",
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();

		mockReq = {
			params: {},
		};

		mockRes = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		mockNext = jest.fn();
	});

	describe("getById", () => {
		/**
		 * Setup mock chain for Movie.findById().select()
		 */
		const setupMovieMock = (movie: any) => {
			const mockSelect = jest.fn().mockResolvedValue(movie);
			(MockedMovie.findById as jest.Mock).mockReturnValue({ select: mockSelect });
		};

		/**
		 * Setup mock chain for Showtime.find().populate().select().sort()
		 */
		const setupShowtimeMock = (showtimes: any[]) => {
			const mockSort = jest.fn().mockResolvedValue(showtimes);
			const mockSelect = jest.fn().mockReturnValue({ sort: mockSort });
			const mockPopulate = jest.fn().mockReturnValue({ select: mockSelect });
			(MockedShowtime.find as jest.Mock).mockReturnValue({ populate: mockPopulate });
		};

		it("should return movie details with showtimes grouped by theater", async () => {
			mockReq.params = { id: validMovieId };

			setupMovieMock(mockMovie);
			setupShowtimeMock(mockShowtimes);

			await MovieDetailsController.getById(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedMovie.findById).toHaveBeenCalledWith(validMovieId);
			expect(MockedShowtime.find).toHaveBeenCalledWith({ movieId: validMovieId });
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: {
					movie: mockMovie,
					theaters: [
						{
							theater: {
								id: validTheaterId,
								name: "AMC Empire 25",
								address: "234 W 42nd St",
								city: "New York",
								state: "NY",
								zipCode: "10036",
								distance: 1.2,
							},
							showtimes: [
								{ id: "showtime1", date: mockShowtimes[0].date, time: "14:30" },
								{ id: "showtime2", date: mockShowtimes[1].date, time: "18:00" },
							],
						},
					],
				},
			});
		});

		it("should return movie with empty theaters when no showtimes exist", async () => {
			mockReq.params = { id: validMovieId };

			setupMovieMock(mockMovie);
			setupShowtimeMock([]);

			await MovieDetailsController.getById(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: {
					movie: mockMovie,
					theaters: [],
				},
			});
		});

		it("should return 400 for invalid movie ID format", async () => {
			mockReq.params = { id: "invalid-id" };

			await MovieDetailsController.getById(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				error: "Invalid movie ID",
			});
			expect(MockedMovie.findById).not.toHaveBeenCalled();
		});

		it("should return 404 when movie is not found", async () => {
			mockReq.params = { id: validMovieId };

			setupMovieMock(null);

			await MovieDetailsController.getById(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedMovie.findById).toHaveBeenCalledWith(validMovieId);
			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				error: "Movie not found",
			});
		});

		it("should filter out showtimes with null theater", async () => {
			mockReq.params = { id: validMovieId };

			const showtimesWithNullTheater = [
				{
					_id: "showtime1",
					movieId: validMovieId,
					theaterId: mockTheater,
					date: new Date("2024-01-15"),
					time: "14:30",
				},
				{
					_id: "showtime2",
					movieId: validMovieId,
					theaterId: null, // Null theater should be filtered
					date: new Date("2024-01-15"),
					time: "18:00",
				},
			];

			setupMovieMock(mockMovie);
			setupShowtimeMock(showtimesWithNullTheater);

			await MovieDetailsController.getById(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(200);
			const responseCall = (mockRes.json as jest.Mock).mock.calls[0][0];
			expect(responseCall.data.theaters).toHaveLength(1);
			expect(responseCall.data.theaters[0].showtimes).toHaveLength(1);
		});

		it("should group multiple theaters correctly", async () => {
			mockReq.params = { id: validMovieId };

			const secondTheaterId = "507f1f77bcf86cd799439013";
			const secondTheater = {
				_id: secondTheaterId,
				name: "Regal Union Square",
				address: "850 Broadway",
				city: "New York",
				state: "NY",
				zipCode: "10003",
				distance: 2.5,
			};

			const multiTheaterShowtimes = [
				{
					_id: "showtime1",
					movieId: validMovieId,
					theaterId: mockTheater,
					date: new Date("2024-01-15"),
					time: "14:30",
				},
				{
					_id: "showtime2",
					movieId: validMovieId,
					theaterId: secondTheater,
					date: new Date("2024-01-15"),
					time: "15:00",
				},
				{
					_id: "showtime3",
					movieId: validMovieId,
					theaterId: mockTheater,
					date: new Date("2024-01-15"),
					time: "18:00",
				},
			];

			setupMovieMock(mockMovie);
			setupShowtimeMock(multiTheaterShowtimes);

			await MovieDetailsController.getById(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(200);
			const responseCall = (mockRes.json as jest.Mock).mock.calls[0][0];
			expect(responseCall.data.theaters).toHaveLength(2);

			// Find the AMC theater
			const amcTheater = responseCall.data.theaters.find((t: any) => t.theater.name === "AMC Empire 25");
			expect(amcTheater.showtimes).toHaveLength(2);

			// Find the Regal theater
			const regalTheater = responseCall.data.theaters.find((t: any) => t.theater.name === "Regal Union Square");
			expect(regalTheater.showtimes).toHaveLength(1);
		});

		it("should call next with error on database exception", async () => {
			mockReq.params = { id: validMovieId };

			const error = new Error("Database connection error");
			(MockedMovie.findById as jest.Mock).mockImplementation(() => {
				throw error;
			});

			await MovieDetailsController.getById(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);
		});

		it("should call next with error on showtime query failure", async () => {
			mockReq.params = { id: validMovieId };

			setupMovieMock(mockMovie);

			const error = new Error("Showtime query failed");
			const mockSort = jest.fn().mockRejectedValue(error);
			const mockSelect = jest.fn().mockReturnValue({ sort: mockSort });
			const mockPopulate = jest.fn().mockReturnValue({ select: mockSelect });
			(MockedShowtime.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

			await MovieDetailsController.getById(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);
		});
	});
});
