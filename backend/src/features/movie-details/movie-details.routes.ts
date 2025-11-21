import { Router } from 'express';
import { MovieDetailsController } from './movie-details.controller';
// Import models to ensure they're registered with Mongoose before populate
import './theater.model';
import './showtime.model';

const router = Router();

router.get('/:id', MovieDetailsController.getById);

export default router;
