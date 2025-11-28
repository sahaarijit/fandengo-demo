/**
 * Auth Controller Unit Tests
 * Tests authentication logic with mocked dependencies for coverage
 */

import { Request, Response, NextFunction } from "express";
import { AuthController } from "../auth.controller";
import { User } from "../user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("../user.model");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../shared/config/env", () => ({
	env: {
		JWT_SECRET: "test-secret-key",
	},
}));

const MockedUser = User as jest.Mocked<typeof User>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe("AuthController", () => {
	let mockReq: Partial<Request>;
	let mockRes: Partial<Response>;
	let mockNext: NextFunction;

	beforeEach(() => {
		jest.clearAllMocks();

		mockReq = {
			body: {},
			params: {},
		};

		mockRes = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};

		mockNext = jest.fn();
	});

	describe("signup", () => {
		const validSignupData = {
			email: "test@example.com",
			password: "password123",
			name: "Test User",
		};

		it("should create a new user successfully", async () => {
			mockReq.body = validSignupData;

			const mockUser = {
				_id: "user123",
				email: validSignupData.email,
				name: validSignupData.name,
				password: "hashedPassword",
			};

			(MockedUser.findOne as jest.Mock).mockResolvedValue(null);
			(mockedBcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
			(MockedUser.create as jest.Mock).mockResolvedValue(mockUser);
			(mockedJwt.sign as jest.Mock).mockReturnValue("mockJwtToken");

			await AuthController.signup(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedUser.findOne).toHaveBeenCalledWith({ email: validSignupData.email });
			expect(mockedBcrypt.hash).toHaveBeenCalledWith(validSignupData.password, 10);
			expect(MockedUser.create).toHaveBeenCalledWith({
				email: validSignupData.email,
				password: "hashedPassword",
				name: validSignupData.name,
			});
			expect(mockRes.status).toHaveBeenCalledWith(201);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: {
					token: "mockJwtToken",
					user: {
						id: "user123",
						email: validSignupData.email,
						name: validSignupData.name,
					},
				},
			});
		});

		it("should return 400 if user already exists", async () => {
			mockReq.body = validSignupData;

			const existingUser = { email: validSignupData.email };
			(MockedUser.findOne as jest.Mock).mockResolvedValue(existingUser);

			await AuthController.signup(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(400);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				error: "User with this email already exists",
			});
		});

		it("should call next with error on exception", async () => {
			mockReq.body = validSignupData;
			const error = new Error("Database error");
			(MockedUser.findOne as jest.Mock).mockRejectedValue(error);

			await AuthController.signup(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);
		});
	});

	describe("login", () => {
		const validLoginData = {
			email: "test@example.com",
			password: "password123",
		};

		it("should login user with valid credentials", async () => {
			mockReq.body = validLoginData;

			const mockUser = {
				_id: "user123",
				email: validLoginData.email,
				name: "Test User",
				password: "hashedPassword",
			};

			(MockedUser.findOne as jest.Mock).mockResolvedValue(mockUser);
			(mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
			(mockedJwt.sign as jest.Mock).mockReturnValue("mockJwtToken");

			await AuthController.login(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedUser.findOne).toHaveBeenCalledWith({ email: validLoginData.email });
			expect(mockedBcrypt.compare).toHaveBeenCalledWith(validLoginData.password, "hashedPassword");
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: {
					token: "mockJwtToken",
					user: {
						id: "user123",
						email: validLoginData.email,
						name: "Test User",
					},
				},
			});
		});

		it("should return 401 if user not found", async () => {
			mockReq.body = validLoginData;
			(MockedUser.findOne as jest.Mock).mockResolvedValue(null);

			await AuthController.login(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				error: "Invalid email or password",
			});
		});

		it("should return 401 if password is invalid", async () => {
			mockReq.body = validLoginData;

			const mockUser = {
				_id: "user123",
				email: validLoginData.email,
				password: "hashedPassword",
			};

			(MockedUser.findOne as jest.Mock).mockResolvedValue(mockUser);
			(mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

			await AuthController.login(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(401);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				error: "Invalid email or password",
			});
		});

		it("should call next with error on exception", async () => {
			mockReq.body = validLoginData;
			const error = new Error("Database error");
			(MockedUser.findOne as jest.Mock).mockRejectedValue(error);

			await AuthController.login(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);
		});
	});

	describe("getProfile", () => {
		it("should return user profile without password", async () => {
			(mockReq as any).userId = "user123";

			const mockUser = {
				_id: "user123",
				email: "test@example.com",
				name: "Test User",
			};

			const mockSelect = jest.fn().mockResolvedValue(mockUser);
			(MockedUser.findById as jest.Mock).mockReturnValue({ select: mockSelect });

			await AuthController.getProfile(mockReq as Request, mockRes as Response, mockNext);

			expect(MockedUser.findById).toHaveBeenCalledWith("user123");
			expect(mockSelect).toHaveBeenCalledWith("-password");
			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: {
					user: {
						id: "user123",
						email: "test@example.com",
						name: "Test User",
					},
				},
			});
		});

		it("should return 404 if user not found", async () => {
			(mockReq as any).userId = "user123";

			const mockSelect = jest.fn().mockResolvedValue(null);
			(MockedUser.findById as jest.Mock).mockReturnValue({ select: mockSelect });

			await AuthController.getProfile(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(404);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: false,
				error: "User not found",
			});
		});

		it("should call next with error on exception", async () => {
			(mockReq as any).userId = "user123";
			const error = new Error("Database error");
			const mockSelect = jest.fn().mockRejectedValue(error);
			(MockedUser.findById as jest.Mock).mockReturnValue({ select: mockSelect });

			await AuthController.getProfile(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);
		});
	});

	describe("logout", () => {
		it("should return success message", async () => {
			await AuthController.logout(mockReq as Request, mockRes as Response, mockNext);

			expect(mockRes.status).toHaveBeenCalledWith(200);
			expect(mockRes.json).toHaveBeenCalledWith({
				success: true,
				data: { message: "Logged out successfully" },
			});
		});
	});
});
