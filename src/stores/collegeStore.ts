import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { collegeApi } from "../lib/apis/college.api";
import type {
  CollegeCourseItem,
  College,
  CreateCollegeRequest,
  AddCourseRequest,
} from "../types/college.types";
import type { ApiError } from "../types/api.types";

interface CollegeState {
  // Simple state - direct from API
  colleges: College[];
  collegesWithCourses: CollegeCourseItem[];

  // State management
  loading: boolean;
  error: string | null;

  // Actions
  fetchColleges: () => Promise<void>;
  fetchCollegesWithCourses: () => Promise<void>;
  createCollege: (data: CreateCollegeRequest) => Promise<College>;
  addCourse: (data: AddCourseRequest) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useCollegeStore = create<CollegeState>()(
  devtools(
    (set) => ({
      colleges: [],
      collegesWithCourses: [],
      loading: false,
      error: null,

      fetchColleges: async () => {
        set({ loading: true, error: null });
        try {
          const response = await collegeApi.getColleges();
          set({ colleges: response.data, loading: false });
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
        }
      },

      fetchCollegesWithCourses: async () => {
        set({ loading: true, error: null });
        try {
          const response = await collegeApi.getCollegesWithCourses();
          set({ collegesWithCourses: response.data, loading: false });
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
        }
      },

      createCollege: async (data: CreateCollegeRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await collegeApi.createCollege(data);
          set({ loading: false });
          return response.data;
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
          throw error;
        }
      },

      addCourse: async (data: AddCourseRequest) => {
        set({ loading: true, error: null });
        try {
          await collegeApi.addCourse(data);
          set({ loading: false });
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
          throw error;
        }
      },

      setError: (error: string | null) => set({ error }),
    }),
    { name: "CollegeStore" }
  )
);

// Selectors for optimized component subscriptions
export const useColleges = () => useCollegeStore((state) => state.colleges);

export const useCollegesWithCourses = () =>
  useCollegeStore((state) => state.collegesWithCourses);

export const useCollegesLoading = () =>
  useCollegeStore((state) => state.loading);

export const useCollegesError = () => useCollegeStore((state) => state.error);
