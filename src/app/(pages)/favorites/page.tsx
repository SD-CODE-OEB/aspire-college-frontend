"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import {
  useFavorites,
  useFavoritesLoading,
  useFavoritesError,
  useFavoriteStore,
} from "@/stores/favoriteStore";
import { useFavoriteFiltering } from "@/hooks/useFiltering";
import { useFavoriteComparison } from "@/hooks/useDataComparison";
import FilterComponent, {
  type FilterOptions,
} from "@/components/FilterComponent";
import type { Favorite } from "@/types/favorite.types";
import FavoriteCard from "@/components/favorites/FavoriteCard";
import {
  Heart,
  AlertCircle,
  Search,
  GraduationCap,
  Star,
  ArrowRight,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const Page = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const favorites = useFavorites();
  const loading = useFavoritesLoading();
  const error = useFavoritesError();
  const { fetchFavorites } = useFavoriteStore();
  const router = useRouter();
  const [filteredFavorites, setFilteredFavorites] = useState<Favorite[]>([]);

  const optimizedFavorites = useFavoriteComparison(favorites);

  const { locations, courses, feeRange, filterAndSortFavorites } =
    useFavoriteFiltering(optimizedFavorites);

  const handleFilterChange = useCallback(
    (filters: FilterOptions) => {
      const filtered = filterAndSortFavorites(filters);
      setFilteredFavorites(filtered);
    },
    [filterAndSortFavorites]
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

  // Initialize filtered favorites when favorites change
  useEffect(() => {
    if (optimizedFavorites) {
      setFilteredFavorites(optimizedFavorites);
    }
  }, [optimizedFavorites]);

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                My Favorites
              </h1>
              <p className="text-muted-foreground">
                Your saved colleges for easy comparison and reference
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
              <Link
                href="/colleges"
                className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/20 hover:border-primary/30 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <GraduationCap className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Browse Colleges
                </span>
                <ArrowRight className="w-3 h-3 ml-1 text-primary group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/reviews"
                className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent/10 to-secondary/10 hover:from-accent/20 hover:to-secondary/20 border border-accent/20 hover:border-accent/30 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
              >
                <Star className="w-4 h-4 mr-2 text-accent" />
                <span className="text-sm font-medium text-accent">
                  Read Reviews
                </span>
                <ArrowRight className="w-3 h-3 ml-1 text-accent group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {favorites.length > 0 && (
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
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">
                Loading favorites...
              </span>
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
              onClick={fetchFavorites}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && favorites.length > 0 && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredFavorites.length} of {favorites.length} favorite
              college
              {favorites.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading &&
          !error &&
          filteredFavorites.length === 0 &&
          favorites.length > 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No favorites found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or clear them to see all favorites.
              </p>
            </div>
          )}

        {/* Empty State */}
        {!loading && !error && favorites.length === 0 && (
          <div className="text-center py-20">
            <div className="relative w-32 h-32 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-16 h-16 text-muted-foreground" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
              No favorites yet
            </h3>
            <p className="text-muted-foreground mb-12 max-w-lg mx-auto text-lg leading-relaxed">
              Start building your favorite colleges list by exploring our
              comprehensive database. Click the heart icon on colleges that
              interest you!
            </p>

            {/* Enhanced Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
              {/* Browse Colleges Card */}
              <Link
                href="/colleges"
                className="group relative p-6 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border border-primary/20 rounded-2xl hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl w-fit mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">
                    Browse Colleges
                  </h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Explore our comprehensive database of colleges with detailed
                    information
                  </p>
                  <div className="flex items-center justify-center text-primary font-medium text-sm">
                    <span>Start Exploring</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>

              {/* Read Reviews Card */}
              <Link
                href="/reviews"
                className="group relative p-6 bg-gradient-to-br from-accent/5 via-accent/10 to-secondary/5 border border-accent/20 rounded-2xl hover:shadow-xl hover:shadow-accent/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl w-fit mx-auto mb-4">
                    <Star className="w-8 h-8 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">
                    Read Reviews
                  </h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Get insights from real students and alumni through authentic
                    reviews
                  </p>
                  <div className="flex items-center justify-center text-accent font-medium text-sm">
                    <span>Read Reviews</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Favorites Grid */}
        {!loading && !error && filteredFavorites.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredFavorites.map((favorite) => (
                <FavoriteCard key={favorite.collegeId} favorite={favorite} />
              ))}
            </div>

            {/* Explore More Section */}
            <div className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 backdrop-blur-sm border border-border/30 rounded-3xl p-8 md:p-12">
              <div className="absolute top-6 right-6 opacity-10">
                <TrendingUp className="w-12 h-12 text-primary" />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-4">
                  Discover More
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Expand your college search and get insights from the community
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Browse More Colleges */}
                <Link
                  href="/colleges"
                  className="group relative p-6 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl w-fit mb-4">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      Explore All Colleges
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Browse our complete database of colleges with advanced
                      filters
                    </p>
                    <div className="flex items-center text-primary font-medium text-sm">
                      <span>View More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>

                {/* Read Reviews */}
                <Link
                  href="/reviews"
                  className="group relative p-6 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl w-fit mb-4">
                      <BookOpen className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                      Student Reviews
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Read authentic reviews and ratings from real students
                    </p>
                    <div className="flex items-center text-accent font-medium text-sm">
                      <span>Read Reviews</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Page;
