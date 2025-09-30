import type { ApiError } from "../../types/api.types";

export const handleApiError = (
  error: unknown,
  fallbackMessage: string
): ApiError => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: ApiError } };
    if (axiosError.response?.data) {
      return axiosError.response.data;
    }
  }
  return { success: false, message: fallbackMessage };
};
