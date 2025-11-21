import { apiService } from '@/shared/services/api.service';
import {
  WatchlistResponse,
  WatchlistCountResponse,
  WatchlistAddResponse,
  WatchlistRemoveResponse,
} from '@/shared/types';

export class WatchlistService {
  static async getWatchlist(): Promise<WatchlistResponse> {
    const response = await apiService.get<WatchlistResponse>('/api/watchlist');
    return response.data!;
  }

  static async getCount(): Promise<WatchlistCountResponse> {
    const response = await apiService.get<WatchlistCountResponse>('/api/watchlist/count');
    return response.data!;
  }

  static async addToWatchlist(movieId: string): Promise<WatchlistAddResponse> {
    const response = await apiService.post<WatchlistAddResponse>('/api/watchlist', { movieId });
    return response.data!;
  }

  static async removeFromWatchlist(movieId: string): Promise<WatchlistRemoveResponse> {
    const response = await apiService.delete<WatchlistRemoveResponse>(`/api/watchlist/${movieId}`);
    return response.data!;
  }
}
