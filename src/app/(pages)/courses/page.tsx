"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import {
  useCollegesWithCourses,
  useCollegesLoading,
  useCollegesError,
  useCollegeStore,
} from "@/stores/collegeStore";
import { AlertCircle, Plus } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import { useFavoriteStore } from "@/stores/favoriteStore";

export default function CoursesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const courses = useCollegesWithCourses();
  const loading = useCollegesLoading();
  const error = useCollegesError();
  const { fetchCollegesWithCourses } = useCollegeStore();
  const { fetchFavorites } = useFavoriteStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = courses.filter(
    (course) =>
      course.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated) {
      fetchCollegesWithCourses();
      fetchFavorites();
    }
  }, [
    isAuthenticated,
    authLoading,
    router,
    fetchCollegesWithCourses,
    fetchFavorites,
  ]);

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
            Explore Courses
          </h1>
          <p className="text-muted-foreground">
            Browse courses offered by various colleges
          </p>
        </div>
        <Link
          href="/courses/add"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by course, college name or location..."
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
            <span className="text-muted-foreground">Loading courses...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-warning/10 border border-warning/20 text-warning px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
          <button
            onClick={fetchCollegesWithCourses}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredCourses.length} of {courses.length} course
            {courses.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        filteredCourses.length === 0 &&
        courses.length > 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No courses found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search term.
            </p>
          </div>
        )}

      {!loading && !error && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={`${course.collegeId}-${course.course}-${index}`}
              college={course}
            />
          ))}
        </div>
      )}
    </div>
  );
}
