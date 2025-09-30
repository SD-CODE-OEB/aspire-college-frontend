import { useMemo } from "react";
import type { FilterOptions } from "@/components/FilterComponent";
import type { College } from "@/types/college.types";
import type { Review } from "@/types/review.types";
import type { Favorite } from "@/types/favorite.types";

// Utility function to extract numeric value from fee string
const parseFee = (feeString: string): number => {
  // Remove all non-numeric characters except decimal points
  const numericString = feeString.replace(/[^\d.]/g, "");
  const fee = parseFloat(numericString);
  return isNaN(fee) ? 0 : fee;
};

// Utility function to get unique values from array
const getUniqueValues = <T>(array: T[], key: keyof T): string[] => {
  return Array.from(new Set(array.map((item) => String(item[key]))))
    .filter(Boolean)
    .sort();
};

// Utility function to get fee range from array
const getFeeRange = <T extends { fee: string }>(
  array: T[]
): { min: number; max: number } => {
  if (array.length === 0) return { min: 0, max: 100000 };

  const fees = array.map((item) => parseFee(item.fee));
  return {
    min: Math.min(...fees),
    max: Math.max(...fees),
  };
};

// Hook for filtering and sorting colleges
export const useCollegeFiltering = (colleges: College[]) => {
  const locations = useMemo(
    () => getUniqueValues(colleges, "location"),
    [colleges]
  );
  const courses = useMemo(
    () => getUniqueValues(colleges, "course"),
    [colleges]
  );
  const feeRange = useMemo(() => getFeeRange(colleges), [colleges]);

  const filterAndSortColleges = useMemo(() => {
    return (filters: FilterOptions): College[] => {
      let filtered = [...colleges];

      // Apply search filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (college) =>
            college.collegeName.toLowerCase().includes(searchTerm) ||
            college.location.toLowerCase().includes(searchTerm) ||
            college.course.toLowerCase().includes(searchTerm)
        );
      }

      // Apply location filter
      if (filters.location) {
        filtered = filtered.filter(
          (college) => college.location === filters.location
        );
      }

      // Apply course filter
      if (filters.course) {
        filtered = filtered.filter(
          (college) => college.course === filters.course
        );
      }

      // Apply fee range filter
      filtered = filtered.filter((college) => {
        const fee = parseFee(college.fee);
        return fee >= filters.minFee && fee <= filters.maxFee;
      });

      // Apply sorting
      switch (filters.sortBy) {
        case "name-a-z":
          filtered.sort((a, b) => a.collegeName.localeCompare(b.collegeName));
          break;
        case "name-z-a":
          filtered.sort((a, b) => b.collegeName.localeCompare(a.collegeName));
          break;
        case "fee-low-high":
          filtered.sort((a, b) => parseFee(a.fee) - parseFee(b.fee));
          break;
        case "fee-high-low":
          filtered.sort((a, b) => parseFee(b.fee) - parseFee(a.fee));
          break;
        default:
          // Keep original order
          break;
      }

      return filtered;
    };
  }, [colleges]);

  return {
    locations,
    courses,
    feeRange,
    filterAndSortColleges,
  };
};

// Hook for filtering reviews (search by college name, location, comment)
export const useReviewFiltering = (reviews: Review[]) => {
  const locations = useMemo(
    () => getUniqueValues(reviews, "location"),
    [reviews]
  );
  const collegeNames = useMemo(
    () => getUniqueValues(reviews, "collegeName"),
    [reviews]
  );

  const filterAndSortReviews = useMemo(() => {
    return (filters: FilterOptions): Review[] => {
      let filtered = [...reviews];

      // Apply search filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (review) =>
            review.collegeName.toLowerCase().includes(searchTerm) ||
            review.location.toLowerCase().includes(searchTerm) ||
            review.comment.toLowerCase().includes(searchTerm)
        );
      }

      // Apply location filter
      if (filters.location) {
        filtered = filtered.filter(
          (review) => review.location === filters.location
        );
      }

      // Apply course filter (using collegeName as a proxy for course filter in reviews)
      if (filters.course) {
        filtered = filtered.filter((review) =>
          review.collegeName
            .toLowerCase()
            .includes(filters.course.toLowerCase())
        );
      }

      // Apply sorting
      switch (filters.sortBy) {
        case "name-a-z":
          filtered.sort((a, b) => a.collegeName.localeCompare(b.collegeName));
          break;
        case "name-z-a":
          filtered.sort((a, b) => b.collegeName.localeCompare(a.collegeName));
          break;
        case "fee-low-high":
        case "fee-high-low":
          // Sort by rating instead of fee for reviews
          if (filters.sortBy === "fee-low-high") {
            filtered.sort((a, b) => a.rating - b.rating);
          } else {
            filtered.sort((a, b) => b.rating - a.rating);
          }
          break;
        default:
          // Keep original order
          break;
      }

      return filtered;
    };
  }, [reviews]);

  return {
    locations,
    courses: collegeNames, // Use college names as courses for reviews
    feeRange: { min: 0, max: 5 }, // Rating range for reviews
    filterAndSortReviews,
  };
};

// Hook for filtering favorites
export const useFavoriteFiltering = (favorites: Favorite[]) => {
  const locations = useMemo(
    () => getUniqueValues(favorites, "location"),
    [favorites]
  );
  const collegeNames = useMemo(
    () => getUniqueValues(favorites, "collegeName"),
    [favorites]
  );

  const filterAndSortFavorites = useMemo(() => {
    return (filters: FilterOptions): Favorite[] => {
      let filtered = [...favorites];

      // Apply search filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (favorite) =>
            favorite.collegeName.toLowerCase().includes(searchTerm) ||
            favorite.location.toLowerCase().includes(searchTerm)
        );
      }

      // Apply location filter
      if (filters.location) {
        filtered = filtered.filter(
          (favorite) => favorite.location === filters.location
        );
      }

      // Apply sorting
      switch (filters.sortBy) {
        case "name-a-z":
          filtered.sort((a, b) => a.collegeName.localeCompare(b.collegeName));
          break;
        case "name-z-a":
          filtered.sort((a, b) => b.collegeName.localeCompare(a.collegeName));
          break;
        default:
          // Keep original order
          break;
      }

      return filtered;
    };
  }, [favorites]);

  return {
    locations,
    courses: collegeNames, // Use college names as courses for favorites
    feeRange: { min: 0, max: 100000 }, // Default range for favorites
    filterAndSortFavorites,
  };
};
