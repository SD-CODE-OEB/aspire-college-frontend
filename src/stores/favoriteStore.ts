import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { favoriteApi } from "../lib/apis/favorite.api";
import type { Favorite, AddFavoriteRequest } from "../types/favorite.types";
import type { ApiError } from "../types/api.types";

interface FavoriteState {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  fetchFavorites: () => Promise<void>;
  addFavorite: (data: AddFavoriteRequest) => Promise<void>;
  removeFavorite: (collegeId: number) => Promise<void>;
  isFavorite: (collegeId: number) => boolean;
  refetch: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  devtools(
    (set, get) => ({
      favorites: [],
      loading: false,
      error: null,

      fetchFavorites: async () => {
        set({ loading: true, error: null });
        try {
          const response = await favoriteApi.getFavorites();
          set({ favorites: response.data, loading: false });
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
        }
      },

      addFavorite: async (data: AddFavoriteRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await favoriteApi.addFavorite(data);
          set({ favorites: response.data, loading: false });
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
          throw error;
        }
      },

      removeFavorite: async (collegeId: number) => {
        set({ loading: true, error: null });
        try {
          const response = await favoriteApi.removeFavorite(collegeId);
          set({ favorites: response.data, loading: false });
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
          throw error;
        }
      },

      isFavorite: (collegeId: number) => {
        return get().favorites.some(
          (favorite) => favorite.collegeId === collegeId
        );
      },

      refetch: async () => {
        await get().fetchFavorites();
      },

      setError: (error: string | null) => set({ error }),
    }),
    { name: "FavoriteStore" }
  )
);

// Selectors for optimized component subscriptions
export const useFavorites = () => useFavoriteStore((state) => state.favorites);
export const useFavoritesLoading = () =>
  useFavoriteStore((state) => state.loading);
export const useFavoritesError = () => useFavoriteStore((state) => state.error);
export const useIsFavorite = (collegeId: number) =>
  useFavoriteStore((state) => state.isFavorite(collegeId));
