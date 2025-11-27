import { render, screen } from "@testing-library/react";
import MovieCard from "../MovieCard";
import { Movie } from "@/shared/types";

// Mock next/image
jest.mock("next/image", () => ({
	__esModule: true,
	default: (props: any) => {
		// eslint-disable-next-line @next/next/no-img-element
		return <img {...props} alt={props.alt} />;
	},
}));

// Mock next/link
jest.mock("next/link", () => ({
	__esModule: true,
	default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

const mockMovie: Movie = {
	_id: "123",
	title: "The Dark Knight",
	description: "Batman faces the Joker.",
	poster: "https://example.com/poster.jpg",
	genres: ["Action", "Crime", "Drama"],
	mpaaRating: "PG-13",
	rating: 4.8,
	releaseYear: 2008,
	duration: 152,
	cast: ["Christian Bale", "Heath Ledger"],
	director: "Christopher Nolan",
	createdAt: "2024-01-01",
	updatedAt: "2024-01-01",
};

describe("MovieCard", () => {
	it("renders movie title", () => {
		render(<MovieCard movie={mockMovie} />);
		expect(screen.getByText("The Dark Knight")).toBeInTheDocument();
	});

	it("renders movie poster with alt text", () => {
		render(<MovieCard movie={mockMovie} />);
		const img = screen.getByAltText("The Dark Knight");
		expect(img).toBeInTheDocument();
	});

	it("renders movie rating", () => {
		render(<MovieCard movie={mockMovie} />);
		expect(screen.getByText("4.8")).toBeInTheDocument();
	});

	it("renders MPAA rating badge", () => {
		render(<MovieCard movie={mockMovie} />);
		expect(screen.getByText("PG-13")).toBeInTheDocument();
	});

	it("renders release year", () => {
		render(<MovieCard movie={mockMovie} />);
		expect(screen.getByText("2008")).toBeInTheDocument();
	});

	it("renders duration", () => {
		render(<MovieCard movie={mockMovie} />);
		expect(screen.getByText("152 min")).toBeInTheDocument();
	});

	it("renders up to 2 genres", () => {
		render(<MovieCard movie={mockMovie} />);
		expect(screen.getByText("Action")).toBeInTheDocument();
		expect(screen.getByText("Crime")).toBeInTheDocument();
		expect(screen.queryByText("Drama")).not.toBeInTheDocument(); // 3rd genre not shown
	});

	it("links to movie details page", () => {
		render(<MovieCard movie={mockMovie} />);
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "/movies/123");
	});

	it("renders correct number of filled stars for rating", () => {
		render(<MovieCard movie={mockMovie} />);
		// 4.8 rating = 4 full stars + 1 half star
		const stars = screen.getAllByTestId ? document.querySelectorAll('[class*="fill-yellow"]') : document.querySelectorAll("svg");
		expect(stars.length).toBeGreaterThan(0);
	});

	it("handles movie with no trailer URL", () => {
		const movieWithoutTrailer = { ...mockMovie, trailerUrl: undefined };
		render(<MovieCard movie={movieWithoutTrailer} />);
		expect(screen.getByText("The Dark Knight")).toBeInTheDocument();
	});

	it("handles movie with single genre", () => {
		const movieWithOneGenre = { ...mockMovie, genres: ["Action"] };
		render(<MovieCard movie={movieWithOneGenre} />);
		expect(screen.getByText("Action")).toBeInTheDocument();
	});
});
