import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
	try {
		const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/menn_boilerplate";

		await mongoose.connect(mongoUri);

		console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);

		mongoose.connection.on("error", (err) => {
			console.error(`❌ MongoDB connection error: ${err.message}`);
		});

		mongoose.connection.on("disconnected", () => {
			console.log("⚠️  MongoDB disconnected");
		});
	} catch (error) {
		console.error(`❌ MongoDB connection failed: ${(error as Error).message}`);
		process.exit(1);
	}
};

export const disconnectDatabase = async (): Promise<void> => {
	try {
		await mongoose.connection.close();
		console.log("MongoDB connection closed");
	} catch (error) {
		console.error(`Error closing MongoDB connection: ${(error as Error).message}`);
	}
};
