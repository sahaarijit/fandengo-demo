module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testTimeout: 10000,
	roots: ["<rootDir>/src"],
	testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	// Coverage configuration
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageReporters: ["text", "lcov", "clover"],
	collectCoverageFrom: [
		"src/**/*.ts",
		"!src/**/*.d.ts",
		"!src/**/__tests__/**",
		"!src/**/*.routes.ts",
		"!src/**/*.schema.ts",
		"!src/**/index.ts",
		"!src/app.ts",
		"!src/scripts/**",
		"!src/shared/**",
		"!src/features/example/**",
	],
	coverageThreshold: {
		global: {
			branches: 80,
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
