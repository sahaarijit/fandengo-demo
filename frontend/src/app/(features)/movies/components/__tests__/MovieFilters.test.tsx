import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovieFilters from "../MovieFilters";

// Mock lodash debounce to execute immediately
jest.mock("lodash", () => ({
	...jest.requireActual("lodash"),
	debounce: (fn: Function) => fn,
}));

describe("MovieFilters", () => {
	const defaultProps = {
		onSearchChange: jest.fn(),
		onGenreChange: jest.fn(),
		onRatingChange: jest.fn(),
		onYearChange: jest.fn(),
		onSortChange: jest.fn(),
		searchValue: "",
		genreValue: "",
		ratingValue: "",
		yearValue: "",
		sortByValue: "title",
		sortOrderValue: "asc",
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders search input", () => {
		render(<MovieFilters {...defaultProps} />);
		expect(screen.getByPlaceholderText("Search movies by title...")).toBeInTheDocument();
	});

	it("renders Show Filters button", () => {
		render(<MovieFilters {...defaultProps} />);
		expect(screen.getByText("Show Filters")).toBeInTheDocument();
	});

	it("toggles filters visibility when button is clicked", async () => {
		const user = userEvent.setup();
		render(<MovieFilters {...defaultProps} />);

		// Initially filters are hidden
		expect(screen.queryByText("Genre")).not.toBeInTheDocument();

		// Click to show filters
		await user.click(screen.getByText("Show Filters"));
		expect(screen.getByText("Hide Filters")).toBeInTheDocument();
		expect(screen.getByText("Genre")).toBeInTheDocument();

		// Click to hide filters
		await user.click(screen.getByText("Hide Filters"));
		expect(screen.getByText("Show Filters")).toBeInTheDocument();
	});

	it("calls onSearchChange when search input changes", async () => {
		const user = userEvent.setup();
		render(<MovieFilters {...defaultProps} />);

		const searchInput = screen.getByPlaceholderText("Search movies by title...");
		await user.type(searchInput, "Dark");

		await waitFor(() => {
			expect(defaultProps.onSearchChange).toHaveBeenCalled();
		});
	});

	it("calls onGenreChange when genre is selected", async () => {
		const user = userEvent.setup();
		render(<MovieFilters {...defaultProps} />);

		// Show filters first
		await user.click(screen.getByText("Show Filters"));

		// Select a genre using getAllByRole and finding by option text
		const selects = screen.getAllByRole("combobox");
		const genreSelect = selects[0]; // First select is genre
		await user.selectOptions(genreSelect, "Action");

		expect(defaultProps.onGenreChange).toHaveBeenCalledWith("Action");
	});

	it("calls onRatingChange when rating is selected", async () => {
		const user = userEvent.setup();
		render(<MovieFilters {...defaultProps} />);

		await user.click(screen.getByText("Show Filters"));

		const selects = screen.getAllByRole("combobox");
		const ratingSelect = selects[1]; // Second select is rating
		await user.selectOptions(ratingSelect, "PG-13");

		expect(defaultProps.onRatingChange).toHaveBeenCalledWith("PG-13");
	});

	it("calls onYearChange when year is selected", async () => {
		const user = userEvent.setup();
		render(<MovieFilters {...defaultProps} />);

		await user.click(screen.getByText("Show Filters"));

		const selects = screen.getAllByRole("combobox");
		const yearSelect = selects[2]; // Third select is year
		await user.selectOptions(yearSelect, "2020");

		expect(defaultProps.onYearChange).toHaveBeenCalledWith("2020");
	});

	it("calls onSortChange when sort by is changed", async () => {
		const user = userEvent.setup();
		render(<MovieFilters {...defaultProps} />);

		await user.click(screen.getByText("Show Filters"));

		const selects = screen.getAllByRole("combobox");
		const sortSelect = selects[3]; // Fourth select is sort
		await user.selectOptions(sortSelect, "rating");

		expect(defaultProps.onSortChange).toHaveBeenCalledWith("rating", "asc");
	});

	it("toggles sort order when arrow button is clicked", async () => {
		const user = userEvent.setup();
		render(<MovieFilters {...defaultProps} />);

		await user.click(screen.getByText("Show Filters"));

		// Initial sort order is asc (↑)
		const sortOrderButton = screen.getByText("↑");
		await user.click(sortOrderButton);

		expect(defaultProps.onSortChange).toHaveBeenCalledWith("title", "desc");
	});

	it("renders all filter options", async () => {
		const user = userEvent.setup();
		render(<MovieFilters {...defaultProps} />);

		await user.click(screen.getByText("Show Filters"));

		// Use getAllByText for labels that might appear multiple times
		expect(screen.getAllByText("Genre").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Rating").length).toBeGreaterThan(0);
		expect(screen.getByText("Release Year")).toBeInTheDocument();
		expect(screen.getByText("Sort By")).toBeInTheDocument();
	});

	it("shows all genres in dropdown", async () => {
		const user = userEvent.setup();
		render(<MovieFilters {...defaultProps} />);

		await user.click(screen.getByText("Show Filters"));

		const selects = screen.getAllByRole("combobox");
		const genreSelect = selects[0];
		expect(genreSelect).toContainElement(screen.getByRole("option", { name: "Action" }));
		expect(genreSelect).toContainElement(screen.getByRole("option", { name: "Comedy" }));
		expect(genreSelect).toContainElement(screen.getByRole("option", { name: "Drama" }));
	});

	it("shows all MPAA ratings", async () => {
		const user = userEvent.setup();
		render(<MovieFilters {...defaultProps} />);

		await user.click(screen.getByText("Show Filters"));

		const selects = screen.getAllByRole("combobox");
		const ratingSelect = selects[1];
		expect(ratingSelect).toContainElement(screen.getByRole("option", { name: "G" }));
		expect(ratingSelect).toContainElement(screen.getByRole("option", { name: "PG" }));
		expect(ratingSelect).toContainElement(screen.getByRole("option", { name: "PG-13" }));
		expect(ratingSelect).toContainElement(screen.getByRole("option", { name: "R" }));
	});
});
