import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import exampleRoutes from "./features/example/example.routes";
import authRoutes from "./features/auth/auth.routes";
import moviesRoutes from "./features/movies/movies.routes";
import movieDetailsRoutes from "./features/movie-details/movie-details.routes";
import watchlistRoutes from "./features/watchlist/watchlist.routes";
import { errorHandler } from "./shared/middleware/error.middleware";

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:3000",
		credentials: true,
	}),
);

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
	console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
	next();
});

// Health check
app.get("/health", (req: Request, res: Response) => {
	res.json({
		success: true,
		status: "ok",
		timestamp: new Date().toISOString(),
		service: "Fandango Clone API",
	});
});

// API Routes
app.use("/api/examples", exampleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/movies", movieDetailsRoutes);
app.use("/api/watchlist", watchlistRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		error: "Not Found",
		message: `Route ${req.method} ${req.url} not found`,
	});
});

// Error handling (must be last)
app.use(errorHandler);

export default app;
