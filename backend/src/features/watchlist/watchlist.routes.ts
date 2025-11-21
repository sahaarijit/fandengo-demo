import { Router } from 'express';
import { WatchlistController } from './watchlist.controller';
import { validate } from '../../shared/middleware/validation.middleware';
import { addToWatchlistSchema } from './watchlist.schema';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

// All watchlist routes require authentication
router.use(authMiddleware);

router.get('/', WatchlistController.getAll);
router.get('/count', WatchlistController.getCount);
router.post('/', validate(addToWatchlistSchema, 'body'), WatchlistController.add);
router.delete('/:movieId', WatchlistController.remove);

export default router;
