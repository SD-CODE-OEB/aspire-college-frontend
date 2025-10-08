"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import {
  useColleges,
  useCollegesLoading,
  useCollegesError,
  useCollegeStore,
} from "@/stores/collegeStore";
import { AlertCircle, Plus } from "lucide-react";
import CollegeCard from "@/components/college/CollegeCard";
import { useFavoriteStore } from "@/stores/favoriteStore";
import Link from "next/link";

export default function CollegesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const colleges = useColleges();
  const loading = useCollegesLoading();
  const error = useCollegesError();
  const { fetchColleges } = useCollegeStore();
  const { fetchFavorites } = useFavoriteStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredColleges = colleges.filter(
    (college) =>
      college.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated) {
      fetchColleges();
      fetchFavorites();
    }
  }, [isAuthenticated, authLoading, router, fetchColleges, fetchFavorites]);

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Explore Colleges
          </h1>
          <p className="text-muted-foreground">
            Discover colleges from our comprehensive database
          </p>
        </div>
        <Link
          href="/colleges/add"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add College</span>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by college name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
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
        <div className="bg-amber-400/10 border border-amber-400/20 text-amber-400 px-4 py-3 rounded-lg mb-6">
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
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No colleges found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search term.
            </p>
          </div>
        )}

      {!loading && !error && filteredColleges.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college) => (
            <CollegeCard key={college.collegeId} college={college} />
          ))}
        </div>
      )}
    </div>
  );
}
