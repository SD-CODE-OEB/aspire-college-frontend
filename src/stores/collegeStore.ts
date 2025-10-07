import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { collegeApi } from "../lib/apis/college.api";
import type { College } from "../types/college.types";
import type { ApiError } from "../types/api.types";

interface CollegeState {
  colleges: College[];
  loading: boolean;
  error: string | null;
  fetchColleges: () => Promise<void>;
  refetch: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useCollegeStore = create<CollegeState>()(
  devtools(
    (set, get) => ({
      colleges: [],
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

      refetch: async () => {
        await get().fetchColleges();
      },

      setError: (error: string | null) => set({ error }),
    }),
    { name: "CollegeStore" }
  )
);

// Selectors for optimized component subscriptions
export const useColleges = () => useCollegeStore((state) => state.colleges);
export const useCollegesLoading = () =>
  useCollegeStore((state) => state.loading);
export const useCollegesError = () => useCollegeStore((state) => state.error);
