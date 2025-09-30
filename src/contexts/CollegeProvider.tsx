"use client";

import {
  createContext,
  use,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { collegeApi } from "../lib/apis/college.api";
import type { College } from "../types/college.types";
import type { ApiError } from "../types/api.types";

interface CollegeContextType {
  colleges: College[];
  loading: boolean;
  error: string | null;
  fetchColleges: () => Promise<void>;
  refetch: () => Promise<void>;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

export const useColleges = () => {
  const context = use(CollegeContext);
  if (context === undefined) {
    throw new Error("useColleges must be used within a CollegeProvider");
  }
  return context;
};

export const CollegeProvider = ({ children }: { children: ReactNode }) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await collegeApi.getColleges();
      setColleges(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchColleges();
  }, [fetchColleges]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const value: CollegeContextType = {
    colleges,
    loading,
    error,
    fetchColleges,
    refetch,
  };

  return <CollegeContext value={value}>{children}</CollegeContext>;
};
