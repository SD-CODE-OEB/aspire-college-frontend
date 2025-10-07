"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import {
  useColleges,
  useCollegesLoading,
  useCollegesError,
  useCollegeStore,
} from "@/stores/collegeStore";
import { useCollegeFiltering } from "@/hooks/useFiltering";
import { useCollegeComparison } from "@/hooks/useDataComparison";
import FilterComponent, {
  type FilterOptions,
} from "@/components/FilterComponent";
import { AlertCircle, Search, Grid3X3, List } from "lucide-react";
import type { College } from "@/types/college.types";
import CollegeCard from "@/components/college/CollegeCard";
import { useFavoriteStore } from "@/stores/favoriteStore";

const Page = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const colleges = useColleges();
  const loading = useCollegesLoading();
  const error = useCollegesError();
  const { fetchColleges } = useCollegeStore();
  const { fetchFavorites } = useFavoriteStore();
  const router = useRouter();
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "row">("grid");

  const optimizedColleges = useCollegeComparison(colleges);

  const { locations, courses, feeRange, filterAndSortColleges } =
    useCollegeFiltering(optimizedColleges);

  const handleFilterChange = useCallback(
    (filters: FilterOptions) => {
      const filtered = filterAndSortColleges(filters);
      setFilteredColleges(filtered);
    },
    [filterAndSortColleges]
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, authLoading, router, fetchFavorites]);

  // Initialize filtered colleges when colleges change
  useEffect(() => {
    if (optimizedColleges) {
      setFilteredColleges(optimizedColleges);
    }
  }, [optimizedColleges]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Explore Colleges
        </h1>
        <p className="text-muted-foreground">
          Discover and compare colleges from our comprehensive database
        </p>
      </div>

      <div className="mb-8">
        <FilterComponent
          onFilterChange={handleFilterChange}
          locations={locations}
          courses={courses}
          minFeeRange={feeRange.min}
          maxFeeRange={feeRange.max}
          showAdvanced={true}
        />
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-muted-foreground">
            View:
          </span>
          <div className="flex items-center bg-muted/50 backdrop-blur-sm rounded-xl p-1 border border-border/50">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode("row")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === "row"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading colleges...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
          <button
            onClick={fetchColleges}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredColleges.length} of {colleges.length} college
            {filteredColleges.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        filteredColleges.length === 0 &&
        colleges.length > 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No colleges found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or clear them to see all colleges.
            </p>
          </div>
        )}

      {/* Colleges Display */}
      {!loading && !error && filteredColleges.length > 0 && (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }`}
        >
          {filteredColleges.map((college) => (
            <div
              key={college.collegeId}
              className={viewMode === "row" ? "max-w-none" : ""}
            >
              <CollegeCard college={college} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
