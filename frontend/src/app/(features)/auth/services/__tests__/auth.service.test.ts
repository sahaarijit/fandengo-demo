import { AuthService } from "../auth.service";
import { apiService } from "@/shared/services/api.service";

// Mock apiService
jest.mock("@/shared/services/api.service", () => ({
	apiService: {
		post: jest.fn(),
		get: jest.fn(),
	},
}));

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
	};
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("AuthService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		localStorageMock.clear();
	});

	describe("signup", () => {
		it("should call apiService.post with correct data", async () => {
			const mockResponse = {
				data: {
					user: { _id: "123", email: "test@example.com", name: "Test" },
					token: "jwt-token",
				},
			};
			(apiService.post as jest.Mock).mockResolvedValue(mockResponse);

			const result = await AuthService.signup({
				email: "test@example.com",
				password: "password123",
				name: "Test",
			});

			expect(apiService.post).toHaveBeenCalledWith("/api/auth/signup", {
				email: "test@example.com",
				password: "password123",
				name: "Test",
			});
			expect(result).toEqual(mockResponse.data);
		});

		it("should throw error when response.data is undefined", async () => {
			(apiService.post as jest.Mock).mockResolvedValue({ data: undefined });

			await expect(
				AuthService.signup({
					email: "test@example.com",
					password: "password123",
					name: "Test",
				})
			).rejects.toThrow("Invalid response from server");
		});
	});

	describe("login", () => {
		it("should call apiService.post with credentials", async () => {
			const mockResponse = {
				data: {
					user: { _id: "123", email: "test@example.com", name: "Test" },
					token: "jwt-token",
				},
			};
			(apiService.post as jest.Mock).mockResolvedValue(mockResponse);

			const result = await AuthService.login({
				email: "test@example.com",
				password: "password123",
			});

			expect(apiService.post).toHaveBeenCalledWith("/api/auth/login", {
				email: "test@example.com",
				password: "password123",
			});
			expect(result).toEqual(mockResponse.data);
		});

		it("should throw error when response.data is undefined", async () => {
			(apiService.post as jest.Mock).mockResolvedValue({ data: undefined });

			await expect(
				AuthService.login({
					email: "test@example.com",
					password: "password123",
				})
			).rejects.toThrow("Invalid response from server");
		});
	});

	describe("getProfile", () => {
		it("should call apiService.get", async () => {
			const mockResponse = {
				data: {
					user: { _id: "123", email: "test@example.com", name: "Test" },
				},
			};
			(apiService.get as jest.Mock).mockResolvedValue(mockResponse);

			const result = await AuthService.getProfile();

			expect(apiService.get).toHaveBeenCalledWith("/api/auth/profile");
			expect(result).toEqual(mockResponse.data);
		});

		it("should throw error when response.data is undefined", async () => {
			(apiService.get as jest.Mock).mockResolvedValue({ data: undefined });

			await expect(AuthService.getProfile()).rejects.toThrow("Invalid response from server");
		});
	});

	describe("logout", () => {
		it("should call apiService.post to logout", async () => {
			const mockResponse = { data: { message: "Logged out successfully" } };
			(apiService.post as jest.Mock).mockResolvedValue(mockResponse);

			const result = await AuthService.logout();

			expect(apiService.post).toHaveBeenCalledWith("/api/auth/logout");
			expect(result).toEqual(mockResponse.data);
		});

		it("should throw error when response.data is undefined", async () => {
			(apiService.post as jest.Mock).mockResolvedValue({ data: undefined });

			await expect(AuthService.logout()).rejects.toThrow("Invalid response from server");
		});
	});

	describe("Token management", () => {
		it("saveToken should store token in localStorage", () => {
			AuthService.saveToken("test-token");
			expect(localStorageMock.getItem("token")).toBe("test-token");
		});

		it("getToken should retrieve token from localStorage", () => {
			localStorageMock.setItem("token", "stored-token");
			expect(AuthService.getToken()).toBe("stored-token");
		});

		it("getToken should return null when no token exists", () => {
			expect(AuthService.getToken()).toBeNull();
		});

		it("removeToken should delete token from localStorage", () => {
			localStorageMock.setItem("token", "token-to-remove");
			AuthService.removeToken();
			expect(localStorageMock.getItem("token")).toBeNull();
		});
	});
});
