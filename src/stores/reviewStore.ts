import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { reviewApi } from "../lib/apis/review.api";
import type { Review, CreateReviewRequest } from "../types/review.types";
import type { ApiError } from "../types/api.types";

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchReviews: () => Promise<void>;
  createReview: (data: CreateReviewRequest) => Promise<void>;
  refetch: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useReviewStore = create<ReviewState>()(
  devtools(
    (set, get) => ({
      reviews: [],
      loading: false,
      error: null,

      fetchReviews: async () => {
        set({ loading: true, error: null });
        try {
          const response = await reviewApi.getReviews();
          set({ reviews: response.data, loading: false });
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
        }
      },

      createReview: async (data: CreateReviewRequest) => {
        set({ loading: true, error: null });
        try {
          await reviewApi.createReview(data);
          await get().fetchReviews();
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
          throw error;
        }
      },

      refetch: async () => {
        await get().fetchReviews();
      },

      setError: (error: string | null) => set({ error }),
    }),
    { name: "ReviewStore" }
  )
);

// Selectors for optimized component subscriptions
export const useReviews = () => useReviewStore((state) => state.reviews);
export const useReviewsLoading = () => useReviewStore((state) => state.loading);
export const useReviewsError = () => useReviewStore((state) => state.error);
