import { AuthUser } from "./auth.types";

export interface Review {
  reviewId: number;
  user: AuthUser;
  rating: number;
  comment: string;
  collegeName: string;
  location: string;
}

export interface CreateReview {
  reviewId: number;
  collegeId: number;
  rating: number;
  comment: string;
  userId: number;
  createdAt: string;
}

export interface CreateReviewRequest {
  collegeId: number;
  rating: number;
  comment: string;
}

export interface ReviewsResponse {
  data: Review[];
  success: boolean;
  message: string;
  timestamp: string;
}

export interface CreateReviewResponse {
  data: CreateReview;
  success: boolean;
  message: string;
  timestamp: string;
}
