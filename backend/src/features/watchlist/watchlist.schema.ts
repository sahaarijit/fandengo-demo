import { z } from 'zod';

export const addToWatchlistSchema = z.object({
  movieId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: 'Invalid movie ID format',
  }),
});

export const removeFromWatchlistSchema = z.object({
  movieId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: 'Invalid movie ID format',
  }),
});

export type AddToWatchlistDto = z.infer<typeof addToWatchlistSchema>;
export type RemoveFromWatchlistDto = z.infer<typeof removeFromWatchlistSchema>;
