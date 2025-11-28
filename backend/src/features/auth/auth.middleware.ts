import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../shared/config/env";

export interface AuthRequest extends Request {
	userId?: string;
	userEmail?: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			res.status(401).json({
				success: false,
				error: "Authentication required",
			});
			return;
		}

		const token = authHeader.substring(7);

		try {
			const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; email: string };
			(req as AuthRequest).userId = decoded.userId;
			(req as AuthRequest).userEmail = decoded.email;
			next();
		} catch (jwtError) {
			res.status(401).json({
				success: false,
				error: "Invalid or expired token",
			});
			return;
		}
	} catch (error) {
		next(error);
	}
};
