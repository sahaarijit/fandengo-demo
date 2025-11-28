/**
 * Environment configuration with validation
 * Ensures required environment variables are defined at startup
 */

const getEnvVar = (key: string, required: boolean = true): string => {
	const value = process.env[key];
	if (required && !value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value || "";
};

/**
 * Validated environment configuration
 * Throws on startup if required variables are missing
 */
export const env = {
	get JWT_SECRET(): string {
		return getEnvVar("JWT_SECRET", true);
	},
	get FRONTEND_URL(): string {
		return getEnvVar("FRONTEND_URL", false) || "http://localhost:3000";
	},
	get NODE_ENV(): string {
		return getEnvVar("NODE_ENV", false) || "development";
	},
	get PORT(): number {
		return parseInt(getEnvVar("PORT", false) || "5000", 10);
	},
	get MONGODB_URI(): string {
		return getEnvVar("MONGODB_URI", false) || "mongodb://localhost:27017/menn_boilerplate";
	},
};

/**
 * Validate all required environment variables at startup
 * Call this function early in the application lifecycle
 */
export const validateEnv = (): void => {
	// Access JWT_SECRET to trigger validation
	env.JWT_SECRET;
	console.log("Environment variables validated successfully");
};
