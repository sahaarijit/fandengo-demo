import { z } from 'zod';

export const getMoviesQuerySchema = z.object({
  search: z.string().optional(),
  genre: z.string().optional(),
  mpaaRating: z.enum(['G', 'PG', 'PG-13', 'R', 'NR']).optional(),
  releaseYear: z.string().transform((val) => parseInt(val, 10)).optional(),
  sortBy: z.enum(['title', 'rating', 'releaseYear']).optional().default('title'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  page: z.string().transform((val) => parseInt(val, 10)).optional().default('1'),
  limit: z.string().transform((val) => parseInt(val, 10)).optional().default('20'),
});

export type GetMoviesQueryDto = z.infer<typeof getMoviesQuerySchema>;
