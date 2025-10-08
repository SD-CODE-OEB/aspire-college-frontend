import api from "../axios";
import { handleApiError } from "../utils/api.utils";
import type {
  CollegesOnlyResponse,
  CollegesWithCoursesResponse,
  CreateCollegeRequest,
  CreateCollegeResponse,
  AddCourseRequest,
  AddCourseResponse,
} from "../../types/college.types";

export const collegeApi = {
  /**
   * Get all colleges without courses
   * Returns basic college information only
   */
  async getColleges(): Promise<CollegesOnlyResponse> {
    try {
      const response = await api.get<CollegesOnlyResponse>("/colleges");
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch colleges");
    }
  },

  /**
   * Get all colleges with their courses
   * Uses INNER JOIN - only returns colleges that have courses
   * Each college-course pairing is returned as a separate item
   */
  async getCollegesWithCourses(): Promise<CollegesWithCoursesResponse> {
    try {
      const response = await api.get<CollegesWithCoursesResponse>(
        "/colleges/courses"
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch colleges with courses");
    }
  },

  /**
   * Create a new college with optional courses
   * Smart duplicate handling: adds courses to existing college if name matches
   * @param data - College creation data with optional courses array
   */
  async createCollege(
    data: CreateCollegeRequest
  ): Promise<CreateCollegeResponse> {
    try {
      const response = await api.post<CreateCollegeResponse>("/colleges", data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to create college");
    }
  },

  /**
   * Add a new course to an existing college
   * @param data - Course data including college ID, course name, and fee
   */
  async addCourse(data: AddCourseRequest): Promise<AddCourseResponse> {
    try {
      const response = await api.post<AddCourseResponse>(
        "/colleges/courses",
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to add course to college");
    }
  },
};
