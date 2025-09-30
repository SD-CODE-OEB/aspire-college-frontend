"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { favoriteApi } from "../lib/apis/favorite.api";
import type { Favorite, AddFavoriteRequest } from "../types/favorite.types";
import type { ApiError } from "../types/api.types";

interface FavoriteContextType {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  fetchFavorites: () => Promise<void>;
  addFavorite: (data: AddFavoriteRequest) => Promise<void>;
  removeFavorite: (collegeId: number) => Promise<void>;
  isFavorite: (collegeId: number) => boolean;
  refetch: () => Promise<void>;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoriteProvider");
  }
  return context;
};

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await favoriteApi.getFavorites();
      setFavorites(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async (data: AddFavoriteRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await favoriteApi.addFavorite(data);
      setFavorites(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFavorite = useCallback(async (collegeId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await favoriteApi.removeFavorite(collegeId);
      setFavorites(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const isFavorite = useCallback(
    (collegeId: number) => {
      return favorites.some((favorite) => favorite.collegeId === collegeId);
    },
    [favorites]
  );

  const refetch = useCallback(async () => {
    await fetchFavorites();
  }, [fetchFavorites]);

  const value: FavoriteContextType = {
    favorites,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    refetch,
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};
