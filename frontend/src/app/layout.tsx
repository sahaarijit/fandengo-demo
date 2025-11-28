import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./(shared)/globals.css";
import { AuthProvider } from "./(features)/auth/context/AuthContext";
import Navigation from "@/shared/components/Navigation";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Fandango - Movie Tickets & Showtimes",
	description: "Discover movies, check showtimes, and manage your watchlist with Fandango",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen`}>
				<AuthProvider>
					<Navigation />
					<main>{children}</main>
				</AuthProvider>
			</body>
		</html>
	);
}
