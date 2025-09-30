import { useRef, useMemo } from "react";
import type { College } from "@/types/college.types";
import type { Review } from "@/types/review.types";
import type { Favorite } from "@/types/favorite.types";

/**
 * Simple data comparison hook using JSON.stringify
 * Prevents unnecessary re-renders when data hasn't actually changed
 */
export function useDataComparison<T>(data: T): T {
  const previousDataRef = useRef<T>(data);
  const previousHashRef = useRef<string>(JSON.stringify(data));

  const memoizedData = useMemo(() => {
    const currentHash = JSON.stringify(data);

    // If data hash is the same, return previous reference to prevent re-renders
    if (currentHash === previousHashRef.current) {
      return previousDataRef.current;
    }

    // Data has changed, update references
    previousDataRef.current = data;
    previousHashRef.current = currentHash;

    return data;
  }, [data]);

  return memoizedData;
}

/**
 * Optimized array comparison for objects with ID fields
 * More efficient for arrays of objects like colleges, reviews, favorites
 */
export function useArrayComparison<T>(data: T[], idField: keyof T): T[] {
  const previousDataRef = useRef<T[]>(data);

  const memoizedData = useMemo(() => {
    const prev = previousDataRef.current;
    const current = data;

    // Quick checks first
    if (prev.length !== current.length) {
      previousDataRef.current = current;
      return current;
    }

    // If arrays are empty, they're equal
    if (current.length === 0) {
      return previousDataRef.current;
    }

    // Compare IDs and data
    const hasChanges = current.some((currentItem, index) => {
      const prevItem = prev[index];
      if (!prevItem) return true;

      // Quick ID comparison
      if (prevItem[idField] !== currentItem[idField]) {
        return true;
      }

      // Deep comparison using JSON
      return JSON.stringify(prevItem) !== JSON.stringify(currentItem);
    });

    if (!hasChanges) {
      return previousDataRef.current;
    }

    previousDataRef.current = current;
    return current;
  }, [data, idField]);

  return memoizedData;
}

/**
 * Hook specifically for college data comparison
 */
export function useCollegeComparison(colleges: College[]): College[] {
  return useArrayComparison(colleges, "collegeId");
}

/**
 * Hook specifically for review data comparison
 */
export function useReviewComparison(reviews: Review[]): Review[] {
  return useArrayComparison(reviews, "reviewId");
}

/**
 * Hook specifically for favorite data comparison
 */
export function useFavoriteComparison(favorites: Favorite[]): Favorite[] {
  return useArrayComparison(favorites, "collegeId");
}
