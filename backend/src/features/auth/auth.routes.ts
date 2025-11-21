import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../shared/middleware/validation.middleware';
import { signupSchema, loginSchema } from './auth.schema';
import { authMiddleware } from './auth.middleware';

const router = Router();

router.post('/signup', validate(signupSchema, 'body'), AuthController.signup);
router.post('/login', validate(loginSchema, 'body'), AuthController.login);
router.get('/profile', authMiddleware, AuthController.getProfile);
router.post('/logout', authMiddleware, AuthController.logout);

export default router;
