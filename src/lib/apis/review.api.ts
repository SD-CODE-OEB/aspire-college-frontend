import api from "../axios";
import { handleApiError } from "../utils/api.utils";
import type {
  ReviewsResponse,
  CreateReviewRequest,
  CreateReviewResponse,
} from "../../types/review.types";

export const reviewApi = {
  async getReviews(): Promise<ReviewsResponse> {
    try {
      const response = await api.get<ReviewsResponse>("/reviews/");
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch reviews");
    }
  },

  async getUserReviews(): Promise<ReviewsResponse> {
    try {
      const response = await api.get<ReviewsResponse>("/reviews/user/");
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch user reviews");
    }
  },

  async createReview(data: CreateReviewRequest): Promise<CreateReviewResponse> {
    try {
      const response = await api.post<CreateReviewResponse>("/reviews/", data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to create review");
    }
  },
};
