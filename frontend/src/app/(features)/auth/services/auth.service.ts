import { apiService } from "@/shared/services/api.service";
import { AuthResponse, User } from "@/shared/types";

export interface SignupData {
	email: string;
	password: string;
	name: string;
}

export interface LoginData {
	email: string;
	password: string;
}

export class AuthService {
	static async signup(data: SignupData): Promise<AuthResponse> {
		const response = await apiService.post<AuthResponse>("/api/auth/signup", data);
		if (!response.data) {
			throw new Error("Invalid response from server");
		}
		return response.data;
	}

	static async login(data: LoginData): Promise<AuthResponse> {
		const response = await apiService.post<AuthResponse>("/api/auth/login", data);
		if (!response.data) {
			throw new Error("Invalid response from server");
		}
		return response.data;
	}

	static async getProfile(): Promise<{ user: User }> {
		const response = await apiService.get<{ user: User }>("/api/auth/profile");
		if (!response.data) {
			throw new Error("Invalid response from server");
		}
		return response.data;
	}

	static async logout(): Promise<{ message: string }> {
		const response = await apiService.post<{ message: string }>("/api/auth/logout");
		if (!response.data) {
			throw new Error("Invalid response from server");
		}
		return response.data;
	}

	static saveToken(token: string): void {
		if (typeof window !== "undefined") {
			localStorage.setItem("token", token);
		}
	}

	static removeToken(): void {
		if (typeof window !== "undefined") {
			localStorage.removeItem("token");
		}
	}

	static getToken(): string | null {
		if (typeof window !== "undefined") {
			return localStorage.getItem("token");
		}
		return null;
	}
}
