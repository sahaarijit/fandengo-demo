import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navigation from "../Navigation";

// Mock next/link
jest.mock("next/link", () => ({
	__esModule: true,
	default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
		<a href={href} className={className}>{children}</a>
	),
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
	usePathname: jest.fn(() => "/movies"),
	useRouter: jest.fn(() => ({
		push: mockPush,
		back: jest.fn(),
	})),
}));

// Mock AuthContext
const mockLogout = jest.fn();
const mockUseAuth = jest.fn();
jest.mock("@/app/(features)/auth/context/AuthContext", () => ({
	useAuth: () => mockUseAuth(),
}));

// Mock WatchlistService
const mockGetCount = jest.fn();
jest.mock("@/app/(features)/watchlist/services/watchlist.service", () => ({
	WatchlistService: {
		getCount: () => mockGetCount(),
	},
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
	Film: () => <span data-testid="film-icon">Film</span>,
	Heart: () => <span data-testid="heart-icon">Heart</span>,
	User: () => <span data-testid="user-icon">User</span>,
	LogOut: () => <span data-testid="logout-icon">LogOut</span>,
	Menu: () => <span data-testid="menu-icon">Menu</span>,
	X: () => <span data-testid="x-icon">X</span>,
}));

describe("Navigation", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockGetCount.mockResolvedValue({ count: 0 });
	});

	describe("Unauthenticated state", () => {
		beforeEach(() => {
			mockUseAuth.mockReturnValue({
				user: null,
				isAuthenticated: false,
				logout: mockLogout,
			});
		});

		it("should render logo and brand name", () => {
			render(<Navigation />);

			expect(screen.getByText("Fandango")).toBeInTheDocument();
			expect(screen.getByTestId("film-icon")).toBeInTheDocument();
		});

		it("should render Movies link", () => {
			render(<Navigation />);

			const moviesLink = screen.getByRole("link", { name: /movies/i });
			expect(moviesLink).toBeInTheDocument();
			expect(moviesLink).toHaveAttribute("href", "/movies");
		});

		it("should show Login and Sign Up buttons when not authenticated", () => {
			render(<Navigation />);

			expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
			expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
		});

		it("should not show Watchlist link when not authenticated", () => {
			render(<Navigation />);

			expect(screen.queryByText("Watchlist")).not.toBeInTheDocument();
		});

		it("should not show user dropdown when not authenticated", () => {
			render(<Navigation />);

			expect(screen.queryByTestId("user-icon")).not.toBeInTheDocument();
		});

		it("should link Login to auth/login page", () => {
			render(<Navigation />);

			const loginLink = screen.getByRole("link", { name: /login/i });
			expect(loginLink).toHaveAttribute("href", "/auth/login");
		});

		it("should link Sign Up to auth/signup page", () => {
			render(<Navigation />);

			const signupLink = screen.getByRole("link", { name: /sign up/i });
			expect(signupLink).toHaveAttribute("href", "/auth/signup");
		});
	});

	describe("Authenticated state", () => {
		const mockUser = {
			id: "123",
			name: "Test User",
			email: "test@example.com",
		};

		beforeEach(() => {
			mockUseAuth.mockReturnValue({
				user: mockUser,
				isAuthenticated: true,
				logout: mockLogout,
			});
		});

		it("should show user name in dropdown button when authenticated", async () => {
			render(<Navigation />);

			await waitFor(() => {
				expect(screen.getByText("Test User")).toBeInTheDocument();
			});
		});

		it("should show Watchlist link when authenticated", async () => {
			render(<Navigation />);

			await waitFor(() => {
				const watchlistLinks = screen.getAllByText("Watchlist");
				expect(watchlistLinks.length).toBeGreaterThan(0);
			});
		});

		it("should not show Login and Sign Up when authenticated", () => {
			render(<Navigation />);

			expect(screen.queryByRole("link", { name: /^login$/i })).not.toBeInTheDocument();
			expect(screen.queryByRole("link", { name: /^sign up$/i })).not.toBeInTheDocument();
		});

		it("should toggle user dropdown when button is clicked", async () => {
			const user = userEvent.setup();
			render(<Navigation />);

			// Initially dropdown content is not visible
			expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();

			// Click user button to open dropdown
			const userButton = screen.getByRole("button", { name: /test user/i });
			await user.click(userButton);

			// Now dropdown content should be visible
			expect(screen.getByText("test@example.com")).toBeInTheDocument();
		});

		it("should call logout and redirect when logout is clicked", async () => {
			const user = userEvent.setup();
			render(<Navigation />);

			// Open dropdown
			const userButton = screen.getByRole("button", { name: /test user/i });
			await user.click(userButton);

			// Click logout
			const logoutButton = screen.getByRole("button", { name: /logout/i });
			await user.click(logoutButton);

			expect(mockLogout).toHaveBeenCalledTimes(1);
			expect(mockPush).toHaveBeenCalledWith("/auth/login");
		});

		it("should close dropdown when clicking user button again", async () => {
			const user = userEvent.setup();
			render(<Navigation />);

			// Open dropdown
			const userButton = screen.getByRole("button", { name: /test user/i });
			await user.click(userButton);

			expect(screen.getByText("test@example.com")).toBeInTheDocument();

			// Click user button again to close
			await user.click(userButton);

			await waitFor(() => {
				expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
			});
		});
	});

	describe("Watchlist count badge", () => {
		const mockUser = {
			id: "123",
			name: "Test User",
			email: "test@example.com",
		};

		beforeEach(() => {
			mockUseAuth.mockReturnValue({
				user: mockUser,
				isAuthenticated: true,
				logout: mockLogout,
			});
		});

		it("should fetch watchlist count when authenticated", async () => {
			mockGetCount.mockResolvedValue({ count: 5 });
			render(<Navigation />);

			await waitFor(() => {
				expect(mockGetCount).toHaveBeenCalled();
			});
		});

		it("should display watchlist count badge when count > 0", async () => {
			mockGetCount.mockResolvedValue({ count: 5 });
			render(<Navigation />);

			await waitFor(() => {
				expect(screen.getByText("5")).toBeInTheDocument();
			});
		});

		it("should not display badge when count is 0", async () => {
			mockGetCount.mockResolvedValue({ count: 0 });
			render(<Navigation />);

			await waitFor(() => {
				expect(mockGetCount).toHaveBeenCalled();
			});

			// Badge should not appear
			expect(screen.queryByText("0")).not.toBeInTheDocument();
		});

		it("should display 99+ when count exceeds 99", async () => {
			mockGetCount.mockResolvedValue({ count: 150 });
			render(<Navigation />);

			await waitFor(() => {
				expect(screen.getAllByText("99+").length).toBeGreaterThan(0);
			});
		});

		it("should handle watchlist count fetch error gracefully", async () => {
			const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
			mockGetCount.mockRejectedValue(new Error("Network error"));

			render(<Navigation />);

			await waitFor(() => {
				expect(mockGetCount).toHaveBeenCalled();
			});

			// Should not crash and should log error
			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
		});

		it("should reset watchlist count to 0 when user logs out", async () => {
			// Start authenticated with count
			mockGetCount.mockResolvedValue({ count: 5 });

			const { rerender } = render(<Navigation />);

			await waitFor(() => {
				expect(screen.getByText("5")).toBeInTheDocument();
			});

			// Simulate logout
			mockUseAuth.mockReturnValue({
				user: null,
				isAuthenticated: false,
				logout: mockLogout,
			});

			rerender(<Navigation />);

			// Badge should disappear
			await waitFor(() => {
				expect(screen.queryByText("5")).not.toBeInTheDocument();
			});
		});
	});

	describe("Mobile menu", () => {
		const mockUser = {
			id: "123",
			name: "Test User",
			email: "test@example.com",
		};

		it("should toggle mobile menu when hamburger button is clicked (unauthenticated)", async () => {
			mockUseAuth.mockReturnValue({
				user: null,
				isAuthenticated: false,
				logout: mockLogout,
			});

			const user = userEvent.setup();
			render(<Navigation />);

			// Find mobile menu button (it has Menu or X icon)
			const mobileMenuButton = screen.getByTestId("menu-icon").closest("button");
			expect(mobileMenuButton).toBeInTheDocument();

			// Click to open mobile menu
			await user.click(mobileMenuButton!);

			// X icon should now be visible
			expect(screen.getByTestId("x-icon")).toBeInTheDocument();
		});

		it("should show login/signup in mobile menu when unauthenticated", async () => {
			mockUseAuth.mockReturnValue({
				user: null,
				isAuthenticated: false,
				logout: mockLogout,
			});

			const user = userEvent.setup();
			render(<Navigation />);

			// Open mobile menu
			const mobileMenuButton = screen.getByTestId("menu-icon").closest("button");
			await user.click(mobileMenuButton!);

			// Should show Login and Sign Up in mobile menu
			const loginLinks = screen.getAllByText("Login");
			expect(loginLinks.length).toBeGreaterThan(0);
		});

		it("should show user info and logout in mobile menu when authenticated", async () => {
			mockUseAuth.mockReturnValue({
				user: mockUser,
				isAuthenticated: true,
				logout: mockLogout,
			});

			const user = userEvent.setup();
			render(<Navigation />);

			// Open mobile menu
			const mobileMenuButton = screen.getByTestId("menu-icon").closest("button");
			await user.click(mobileMenuButton!);

			// Should show user info in mobile menu
			const userNames = screen.getAllByText("Test User");
			expect(userNames.length).toBeGreaterThan(0);

			const userEmails = screen.getAllByText("test@example.com");
			expect(userEmails.length).toBeGreaterThan(0);
		});

		it("should call logout from mobile menu", async () => {
			mockUseAuth.mockReturnValue({
				user: mockUser,
				isAuthenticated: true,
				logout: mockLogout,
			});

			const user = userEvent.setup();
			render(<Navigation />);

			// Open mobile menu
			const mobileMenuButton = screen.getByTestId("menu-icon").closest("button");
			await user.click(mobileMenuButton!);

			// Click logout button in mobile menu
			const logoutButtons = screen.getAllByRole("button", { name: /logout/i });
			await user.click(logoutButtons[logoutButtons.length - 1]); // Click the mobile one

			expect(mockLogout).toHaveBeenCalled();
			expect(mockPush).toHaveBeenCalledWith("/auth/login");
		});

		it("should close mobile menu after logout", async () => {
			mockUseAuth.mockReturnValue({
				user: mockUser,
				isAuthenticated: true,
				logout: mockLogout,
			});

			const user = userEvent.setup();
			render(<Navigation />);

			// Open mobile menu
			const mobileMenuButton = screen.getByTestId("menu-icon").closest("button");
			await user.click(mobileMenuButton!);

			// X icon should be visible (menu is open)
			expect(screen.getByTestId("x-icon")).toBeInTheDocument();

			// Click logout
			const logoutButtons = screen.getAllByRole("button", { name: /logout/i });
			await user.click(logoutButtons[logoutButtons.length - 1]);

			// Menu icon should be visible again (menu is closed)
			expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
		});
	});

	describe("Active route highlighting", () => {
		beforeEach(() => {
			mockUseAuth.mockReturnValue({
				user: { id: "123", name: "Test", email: "test@test.com" },
				isAuthenticated: true,
				logout: mockLogout,
			});
		});

		it("should apply active styling to Movies link when on /movies route", () => {
			// pathname is already mocked to /movies
			render(<Navigation />);

			const moviesLink = screen.getByRole("link", { name: /movies/i });
			// The link should have the orange-500 class for active state
			expect(moviesLink.className).toContain("orange-500");
		});
	});

	describe("Default user name fallback", () => {
		it("should show 'User' when user.name is not available", async () => {
			mockUseAuth.mockReturnValue({
				user: { id: "123", name: undefined, email: "test@test.com" },
				isAuthenticated: true,
				logout: mockLogout,
			});

			render(<Navigation />);

			// The button should show "User" as fallback
			expect(screen.getByRole("button", { name: /user/i })).toBeInTheDocument();
		});
	});
});
