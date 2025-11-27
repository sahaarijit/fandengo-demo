import { apiService } from "@/shared/services/api.service";
import { MoviesResponse, MovieDetailsResponse } from "@/shared/types";

export interface GetMoviesParams {
	search?: string;
	genre?: string;
	mpaaRating?: string;
	releaseYear?: number;
	sortBy?: "title" | "rating" | "releaseYear";
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
}

export class MoviesService {
	static async getMovies(params?: GetMoviesParams): Promise<MoviesResponse> {
		const queryParams = new URLSearchParams();

		if (params?.search) queryParams.append("search", params.search);
		if (params?.genre) queryParams.append("genre", params.genre);
		if (params?.mpaaRating) queryParams.append("mpaaRating", params.mpaaRating);
		if (params?.releaseYear) queryParams.append("releaseYear", params.releaseYear.toString());
		if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
		if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
		if (params?.page) queryParams.append("page", params.page.toString());
		if (params?.limit) queryParams.append("limit", params.limit.toString());

		const query = queryParams.toString();
		const endpoint = `/api/movies${query ? `?${query}` : ""}`;

		const response = await apiService.get<MoviesResponse>(endpoint);
		return response.data!;
	}

	static async getMovieById(id: string): Promise<MovieDetailsResponse> {
		const response = await apiService.get<MovieDetailsResponse>(`/api/movies/${id}`);
		return response.data!;
	}
}
