"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import {
  useReviews,
  useReviewsLoading,
  useReviewsError,
  useReviewStore,
} from "@/stores/reviewStore";
import { useReviewComparison } from "@/hooks/useDataComparison";
import { useReviewFiltering } from "@/hooks/useFiltering";
import FilterComponent, {
  type FilterOptions,
} from "@/components/FilterComponent";
import type { Review } from "@/types/review.types";
import { Star, AlertCircle, Search } from "lucide-react";
import ReviewCard from "@/components/reviews/ReviewCard";
import AddReviewForm from "@/components/reviews/AddReviewForm";

const Page = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const reviews = useReviews();
  const loading = useReviewsLoading();
  const error = useReviewsError();
  const { fetchReviews } = useReviewStore();
  const router = useRouter();
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);

  const optimizedReviews = useReviewComparison(reviews);

  const { locations, courses, feeRange, filterAndSortReviews } =
    useReviewFiltering(optimizedReviews);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filters: FilterOptions) => {
      const filtered = filterAndSortReviews(filters);
      setFilteredReviews(filtered);
    },
    [filterAndSortReviews]
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated) {
      fetchReviews();
    }
  }, [isAuthenticated, authLoading, router, fetchReviews]);

  // Initialize filtered reviews when reviews change
  useEffect(() => {
    if (optimizedReviews) {
      setFilteredReviews(optimizedReviews);
    }
  }, [optimizedReviews]);

  const handleReviewAdded = () => {
    fetchReviews();
  };

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
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            College Reviews
          </h1>
          <p className="text-muted-foreground">
            Read authentic reviews from students and share your own experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AddReviewForm onReviewAdded={handleReviewAdded} />
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6">
              <FilterComponent
                onFilterChange={handleFilterChange}
                locations={locations}
                courses={courses}
                minFeeRange={feeRange.min}
                maxFeeRange={feeRange.max}
                showAdvanced={true}
              />
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-muted-foreground">
                    Loading reviews...
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-amber-200/40 border border-amber-400/20 text-warning px-4 py-3 rounded-lg mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
                <button
                  onClick={fetchReviews}
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredReviews.length} of {reviews.length} review
                  {filteredReviews.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              filteredReviews.length === 0 &&
              reviews.length > 0 && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No reviews found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or clear them to see all reviews.
                  </p>
                </div>
              )}

            {!loading && !error && reviews.length === 0 && (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No reviews yet
                </h3>
                <p className="text-muted-foreground">
                  Be the first to share your college experience!
                </p>
              </div>
            )}

            {!loading && !error && filteredReviews.length > 0 && (
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <ReviewCard key={review.reviewId} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
