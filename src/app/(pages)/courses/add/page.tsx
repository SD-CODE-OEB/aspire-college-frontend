"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCollegeStore, useColleges } from "@/stores/collegeStore";
import { BookOpen, Loader2, CheckCircle } from "lucide-react";

export default function AddCoursePage() {
  const router = useRouter();
  const { addCourse, fetchColleges, loading } = useCollegeStore();
  const colleges = useColleges();
  const [collegeId, setCollegeId] = useState<number | "">("");
  const [courseName, setCourseName] = useState("");
  const [fee, setFee] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeId || !courseName.trim() || !fee.trim()) return;

    try {
      await addCourse({
        collegeId: Number(collegeId),
        courseName: courseName.trim(),
        fee: fee.trim(),
      });

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/courses");
      }, 1500);
    } catch (error) {
      console.error("Failed to add course:", error);
    }
  };

  const isValid = collegeId && courseName.trim() && fee.trim();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl border border-border/30 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Add New Course
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="collegeId"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              Select College *
            </label>
            <select
              id="collegeId"
              value={collegeId}
              onChange={(e) =>
                setCollegeId(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            >
              <option value="">Choose a college...</option>
              {colleges.map((college) => (
                <option key={college.collegeId} value={college.collegeId}>
                  {college.collegeName} - {college.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="courseName"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              Course Name *
            </label>
            <input
              id="courseName"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Enter course name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="fee"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              Annual Fee *
            </label>
            <input
              id="fee"
              type="text"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Enter fee amount"
              required
            />
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-background/50 hover:bg-background/80 border border-border rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || loading || showSuccess}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : (
                "Add Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
