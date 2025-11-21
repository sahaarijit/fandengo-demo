import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './user.model';
import { SignupDto, LoginDto } from './auth.schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export class AuthController {
  /**
   * Signup a new user
   * @route POST /api/auth/signup
   */
  static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name } = req.body as SignupDto;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'User with this email already exists',
        });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * @route POST /api/auth/login
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as LoginDto;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   * @route GET /api/auth/profile
   */
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;

      const user = await User.findById(userId).select('-password');
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user (client-side token removal)
   * @route POST /api/auth/logout
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: { message: 'Logged out successfully' },
      });
    } catch (error) {
      next(error);
    }
  }
}
