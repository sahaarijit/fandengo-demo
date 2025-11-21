import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Watchlist } from './watchlist.model';
import { Movie } from '../movies/movie.model';
import { AddToWatchlistDto, RemoveFromWatchlistDto } from './watchlist.schema';

export class WatchlistController {
  /**
   * Get all watchlist items for current user
   * @route GET /api/watchlist
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;

      const watchlistItems = await Watchlist.find({ userId })
        .populate('movieId')
        .select('-__v')
        .sort({ createdAt: -1 });

      const movies = watchlistItems
        .map((item: any) => item.movieId)
        .filter((movie) => movie != null);

      res.status(200).json({
        success: true,
        data: {
          watchlist: movies,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get watchlist count for current user
   * @route GET /api/watchlist/count
   */
  static async getCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;

      const count = await Watchlist.countDocuments({ userId });

      res.status(200).json({
        success: true,
        data: {
          count,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add movie to watchlist
   * @route POST /api/watchlist
   */
  static async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { movieId } = req.body as AddToWatchlistDto;

      // Check if movie exists
      const movie = await Movie.findById(movieId);
      if (!movie) {
        res.status(404).json({
          success: false,
          error: 'Movie not found',
        });
        return;
      }

      // Check if already in watchlist
      const existingItem = await Watchlist.findOne({ userId, movieId });
      if (existingItem) {
        res.status(400).json({
          success: false,
          error: 'Movie already in watchlist',
        });
        return;
      }

      // Add to watchlist
      const watchlistItem = await Watchlist.create({ userId, movieId });

      // Get updated count
      const count = await Watchlist.countDocuments({ userId });

      res.status(201).json({
        success: true,
        data: {
          watchlistItem: {
            id: watchlistItem._id,
            movieId: watchlistItem.movieId,
          },
          count,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove movie from watchlist
   * @route DELETE /api/watchlist/:movieId
   */
  static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { movieId } = req.params;

      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(movieId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid movie ID',
        });
        return;
      }

      // Remove from watchlist
      const result = await Watchlist.deleteOne({ userId, movieId });

      if (result.deletedCount === 0) {
        res.status(404).json({
          success: false,
          error: 'Movie not in watchlist',
        });
        return;
      }

      // Get updated count
      const count = await Watchlist.countDocuments({ userId });

      res.status(200).json({
        success: true,
        data: {
          message: 'Movie removed from watchlist',
          count,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
