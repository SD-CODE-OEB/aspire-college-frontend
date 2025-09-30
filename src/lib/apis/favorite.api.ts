import api from "../axios";
import { handleApiError } from "../utils/api.utils";
import type {
  FavoritesResponse,
  AddFavoriteRequest,
} from "../../types/favorite.types";

export const favoriteApi = {
  async getFavorites(): Promise<FavoritesResponse> {
    try {
      const response = await api.get<FavoritesResponse>("/favorites/");
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch favorites");
    }
  },

  async addFavorite(data: AddFavoriteRequest): Promise<FavoritesResponse> {
    try {
      const response = await api.post<FavoritesResponse>("/favorites/", data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to add favorite");
    }
  },

  async removeFavorite(collegeId: number): Promise<FavoritesResponse> {
    try {
      const response = await api.delete<FavoritesResponse>(
        `/favorites/${collegeId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to remove favorite");
    }
  },
};
