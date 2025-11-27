import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Movie } from "../movies/movie.model";
import { Theater } from "./theater.model";
import { Showtime } from "./showtime.model";

export class MovieDetailsController {
	/**
	 * Get movie by ID with theaters and showtimes
	 * @route GET /api/movies/:id
	 */
	static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;

			// Validate MongoDB ObjectId
			if (!mongoose.Types.ObjectId.isValid(id)) {
				res.status(400).json({
					success: false,
					error: "Invalid movie ID",
				});
				return;
			}

			// Get movie
			const movie = await Movie.findById(id).select("-__v");
			if (!movie) {
				res.status(404).json({
					success: false,
					error: "Movie not found",
				});
				return;
			}

			// Get showtimes for this movie
			const showtimes = await Showtime.find({ movieId: id }).populate("theaterId").select("-__v").sort({ date: 1, time: 1 });

			// Group showtimes by theater
			const theaterShowtimes = showtimes.reduce((acc: any, showtime: any) => {
				const theater = showtime.theaterId;
				if (!theater) return acc;

				const theaterId = theater._id.toString();
				if (!acc[theaterId]) {
					acc[theaterId] = {
						theater: {
							id: theater._id,
							name: theater.name,
							address: theater.address,
							city: theater.city,
							state: theater.state,
							zipCode: theater.zipCode,
							distance: theater.distance,
						},
						showtimes: [],
					};
				}

				acc[theaterId].showtimes.push({
					id: showtime._id,
					date: showtime.date,
					time: showtime.time,
				});

				return acc;
			}, {});

			res.status(200).json({
				success: true,
				data: {
					movie,
					theaters: Object.values(theaterShowtimes),
				},
			});
		} catch (error) {
			next(error);
		}
	}
}
