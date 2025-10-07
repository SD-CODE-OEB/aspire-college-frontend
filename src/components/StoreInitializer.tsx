"use client";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useCollegeStore } from "@/stores/collegeStore";

/**
 * Initializes Zustand stores on app mount
 * This replaces the auto-fetch behavior from the old CollegeProvider
 */
export const StoreInitializer = () => {
  const { isAuthenticated } = useAuth();
  const fetchColleges = useCollegeStore((state) => state.fetchColleges);

  useEffect(() => {
    if (isAuthenticated) {
      fetchColleges();
    }
  }, [isAuthenticated, fetchColleges]);

  return null; // This component doesn't render anything
};
