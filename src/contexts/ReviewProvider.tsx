"use client";

import { createContext, use, useState, useCallback, ReactNode } from "react";
import { reviewApi } from "../lib/apis/review.api";
import type { Review, CreateReviewRequest } from "../types/review.types";
import type { ApiError } from "../types/api.types";

interface ReviewContextType {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchReviews: () => Promise<void>;
  createReview: (data: CreateReviewRequest) => Promise<void>;
  refetch: () => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReviews = () => {
  const context = use(ReviewContext);
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewProvider");
  }
  return context;
};

export const ReviewProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reviewApi.getReviews();
      setReviews(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createReview = useCallback(
    async (data: CreateReviewRequest) => {
      setLoading(true);
      setError(null);
      try {
        await reviewApi.createReview(data);
        await fetchReviews();
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchReviews]
  );

  const refetch = useCallback(async () => {
    await fetchReviews();
  }, [fetchReviews]);

  const value: ReviewContextType = {
    reviews,
    loading,
    error,
    fetchReviews,
    createReview,
    refetch,
  };

  return <ReviewContext value={value}>{children}</ReviewContext>;
};
