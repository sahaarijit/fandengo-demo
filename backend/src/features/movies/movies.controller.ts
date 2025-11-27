import { Request, Response, NextFunction } from "express";
import { Movie } from "./movie.model";
import { GetMoviesQueryDto } from "./movies.schema";

export class MoviesController {
	/**
	 * Get all movies with search, filters, and sorting
	 * @route GET /api/movies
	 */
	static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const {
				search,
				genre,
				mpaaRating,
				releaseYear,
				sortBy = "title",
				sortOrder = "asc",
				page = 1,
				limit = 20,
			} = req.query as unknown as GetMoviesQueryDto;

			// Build filter query
			const filter: any = {};

			// Title search with case-insensitive regex for partial matching
			if (search) {
				filter.title = { $regex: search, $options: "i" };
			}

			// Genre filter
			if (genre) {
				filter.genres = genre;
			}

			// MPAA Rating filter
			if (mpaaRating) {
				filter.mpaaRating = mpaaRating;
			}

			// Release year filter
			if (releaseYear) {
				filter.releaseYear = releaseYear;
			}

			// Build sort query
			const sort: any = {};
			sort[sortBy] = sortOrder === "asc" ? 1 : -1;

			// Calculate pagination
			const skip = (page - 1) * limit;

			// Execute query
			const [movies, totalCount] = await Promise.all([
				Movie.find(filter).sort(sort).skip(skip).limit(limit).select("-__v"),
				Movie.countDocuments(filter),
			]);

			const totalPages = Math.ceil(totalCount / limit);

			res.status(200).json({
				success: true,
				data: {
					movies,
					pagination: {
						page,
						limit,
						totalCount,
						totalPages,
					},
				},
			});
		} catch (error) {
			next(error);
		}
	}
}
