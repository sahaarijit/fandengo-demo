"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/shared/types";
import { AuthService, LoginData, SignupData } from "../services/auth.service";
import { useRouter } from "next/navigation";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (data: LoginData) => Promise<void>;
	signup: (data: SignupData) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const initAuth = async () => {
			try {
				const token = AuthService.getToken();
				if (token) {
					const { user } = await AuthService.getProfile();
					setUser(user);
				}
			} catch (error) {
				AuthService.removeToken();
			} finally {
				setLoading(false);
			}
		};

		initAuth();
	}, []);

	const login = async (data: LoginData) => {
		const response = await AuthService.login(data);
		AuthService.saveToken(response.token);
		setUser(response.user);
		router.push("/movies");
	};

	const signup = async (data: SignupData) => {
		const response = await AuthService.signup(data);
		AuthService.saveToken(response.token);
		setUser(response.user);
		router.push("/movies");
	};

	const logout = () => {
		AuthService.removeToken();
		setUser(null);
		router.push("/auth/login");
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				signup,
				logout,
				isAuthenticated: !!user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		// During SSR or if used outside AuthProvider, return a default context
		// This prevents build errors while maintaining runtime type safety
		if (typeof window === "undefined") {
			return {
				user: null,
				loading: true,
				login: async () => {},
				signup: async () => {},
				logout: () => {},
				isAuthenticated: false,
			};
		}
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
