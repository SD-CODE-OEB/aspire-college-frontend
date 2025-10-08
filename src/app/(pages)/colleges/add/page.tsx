"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCollegeStore } from "@/stores/collegeStore";
import { Plus, X, Building2, Loader2, CheckCircle } from "lucide-react";

export default function AddCollegePage() {
  const router = useRouter();
  const { createCollege, loading } = useCollegeStore();
  const [collegeName, setCollegeName] = useState("");
  const [location, setLocation] = useState("");
  const [courses, setCourses] = useState<
    Array<{ courseName: string; fee: string }>
  >([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const addCourse = () => {
    setCourses([...courses, { courseName: "", fee: "" }]);
  };

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const updateCourse = (
    index: number,
    field: "courseName" | "fee",
    value: string
  ) => {
    const updated = [...courses];
    updated[index][field] = value;
    setCourses(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeName.trim() || !location.trim()) return;

    try {
      const validCourses = courses.filter(
        (c) => c.courseName.trim() && c.fee.trim()
      );
      await createCollege({
        collegeName: collegeName.trim(),
        location: location.trim(),
        courses: validCourses.length > 0 ? validCourses : undefined,
      });

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/colleges");
      }, 1500);
    } catch (error) {
      console.error("Failed to create college:", error);
    }
  };

  const isValid = collegeName.trim() && location.trim();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl border border-border/30 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Add New College
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="collegeName"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              College Name *
            </label>
            <input
              id="collegeName"
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Enter college name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              Location *
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Enter location"
              required
            />
          </div>

          <div className="border-t border-border/30 pt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-foreground">
                Courses (Optional)
              </label>
              <button
                type="button"
                onClick={addCourse}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Course</span>
              </button>
            </div>

            <div className="space-y-3">
              {courses.map((course, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <input
                    type="text"
                    value={course.courseName}
                    onChange={(e) =>
                      updateCourse(index, "courseName", e.target.value)
                    }
                    className="flex-1 px-3 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="Course name"
                  />
                  <input
                    type="text"
                    value={course.fee}
                    onChange={(e) => updateCourse(index, "fee", e.target.value)}
                    className="w-32 px-3 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="Fee"
                  />
                  <button
                    type="button"
                    onClick={() => removeCourse(index)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
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
                  <span>Creating...</span>
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Created!</span>
                </>
              ) : (
                "Create College"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
