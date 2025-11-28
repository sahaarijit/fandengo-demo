const nextJest = require("next/jest");

const createJestConfig = nextJest({
	dir: "./",
});

const customJestConfig = {
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	testEnvironment: "jest-environment-jsdom",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
	// Coverage configuration
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageReporters: ["text", "lcov", "clover"],
	collectCoverageFrom: [
		// Auth feature
		"src/app/\\(features\\)/auth/services/auth.service.ts",
		"src/app/\\(features\\)/auth/context/AuthContext.tsx",
		// Watchlist feature
		"src/app/\\(features\\)/watchlist/services/watchlist.service.ts",
		// Movies feature
		"src/app/\\(features\\)/movies/components/MovieCard.tsx",
		"src/app/\\(features\\)/movies/components/MovieFilters.tsx",
		// Shared components
		"src/shared/components/Navigation.tsx",
		// Exclusions
		"!**/__tests__/**",
		"!**/*.d.ts",
		"!**/node_modules/**",
	],
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
	// JUnit XML reporter for HackerRank scoring
	reporters: [
		"default",
		[
			"jest-junit",
			{
				outputDirectory: "./",
				outputName: "junit.xml",
				ancestorSeparator: " > ",
				classNameTemplate: "{classname}",
				titleTemplate: "{title}",
			},
		],
	],
};

module.exports = createJestConfig(customJestConfig);
