"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function SignupForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { signup } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		setLoading(true);

		try {
			await signup({ name, email, password });
		} catch (err: any) {
			setError(err.message || "Signup failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h1 className="text-center text-4xl font-bold text-orange-500">FANDANGO</h1>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-white">Create your account</h2>
					<p className="mt-2 text-center text-sm text-gray-400">
						Already have an account?{" "}
						<Link href="/auth/login" className="font-medium text-orange-500 hover:text-orange-400">
							Sign in
						</Link>
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{error && (
						<div className="rounded-md bg-red-900/50 border border-red-700 p-4">
							<p className="text-sm text-red-300">{error}</p>
						</div>
					)}
					<div className="rounded-md shadow-sm space-y-4">
						<div>
							<label htmlFor="name" className="sr-only">
								Full name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm"
								placeholder="Full name"
							/>
						</div>
						<div>
							<label htmlFor="email" className="sr-only">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm"
								placeholder="Email address"
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm"
								placeholder="Password (min 6 characters)"
							/>
						</div>
						<div>
							<label htmlFor="confirm-password" className="sr-only">
								Confirm password
							</label>
							<input
								id="confirm-password"
								name="confirm-password"
								type="password"
								autoComplete="new-password"
								required
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="appearance-none relative block w-full px-3 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm"
								placeholder="Confirm password"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? "Creating account..." : "Sign up"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
