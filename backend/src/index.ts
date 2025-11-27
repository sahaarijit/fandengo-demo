import app from "./app";
import { connectDatabase } from "./shared/config/database";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		// Connect to MongoDB
		await connectDatabase();

		// Start Express server
		app.listen(PORT, () => {
			console.log(`🚀 Server running on port ${PORT}`);
			console.log(`📡 Health check: http://localhost:${PORT}/health`);
			console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
			console.log(`\n✨ MENN Stack Boilerplate is ready!`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

// Handle graceful shutdown
process.on("SIGTERM", async () => {
	console.log("SIGTERM signal received: closing HTTP server");
	process.exit(0);
});

process.on("SIGINT", async () => {
	console.log("SIGINT signal received: closing HTTP server");
	process.exit(0);
});

startServer();
