import api from "../axios";
import { handleApiError } from "../utils/api.utils";
import type { CollegesResponse } from "../../types/college.types";

export const collegeApi = {
  async getColleges(): Promise<CollegesResponse> {
    try {
      const response = await api.get<CollegesResponse>("/colleges");
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch colleges");
    }
  },
};
