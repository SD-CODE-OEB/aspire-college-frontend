import { Loader2, CheckCircle, MessageSquare } from "lucide-react";
import StarRating from "./StarRating";
import { useColleges } from "@/stores/collegeStore";
import { useReviewsLoading, useReviewStore } from "@/stores/reviewStore";
import { useState } from "react";

const AddReviewForm = ({ onReviewAdded }: { onReviewAdded: () => void }) => {
  const colleges = useColleges();
  const { createReview } = useReviewStore();
  const loading = useReviewsLoading();
  const CHARACTER_LIMIT = 500;
  const [formState, setFormState] = useState({
    selectedCollegeId: "" as number | "",
    rating: 0,
    comment: "",
    isSubmitting: false,
    showSuccess: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formState.selectedCollegeId ||
      formState.rating === 0 ||
      !formState.comment.trim()
    )
      return;

    setFormState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await createReview({
        collegeId: Number(formState.selectedCollegeId),
        rating: formState.rating,
        comment: formState.comment.trim(),
      });

      setFormState({
        selectedCollegeId: "",
        rating: 0,
        comment: "",
        isSubmitting: false,
        showSuccess: true,
      });

      // Show success state briefly before calling onReviewAdded
      setTimeout(() => {
        setFormState((prev) => ({ ...prev, showSuccess: false }));
        onReviewAdded();
      }, 1500);
    } catch (error) {
      console.error("Failed to create review:", error);
    } finally {
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl border border-border/30 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 opacity-10">
        <MessageSquare className="w-8 h-8 text-primary" />
      </div>

      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Add a Review
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group">
          <label
            htmlFor="college"
            className="block text-sm font-semibold text-foreground mb-3 group-focus-within:text-primary transition-colors duration-200"
          >
            Select College
          </label>
          <div className="relative">
            <select
              id="college"
              value={formState.selectedCollegeId}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  selectedCollegeId:
                    e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
              className="w-full px-4 py-4 bg-gradient-to-r from-background/90 to-background/70 backdrop-blur-sm border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
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
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-foreground mb-3 group-focus-within:text-primary transition-colors duration-200">
            Rating
          </label>
          <div className="p-4 bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 rounded-2xl transition-all duration-300 hover:border-primary/20 hover:bg-primary/5">
            <div className="flex items-center justify-between">
              <StarRating
                rating={formState.rating}
                onRatingChange={(newRating) =>
                  setFormState((prev) => ({ ...prev, rating: newRating }))
                }
              />
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    formState.rating > 0
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {formState.rating > 0
                    ? `${formState.rating} star${
                        formState.rating !== 1 ? "s" : ""
                      }`
                    : "Select a rating"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="group">
          <label
            htmlFor="comment"
            className="block text-sm font-semibold text-foreground mb-3 group-focus-within:text-primary transition-colors duration-200"
          >
            Your Review
          </label>
          <div className="relative">
            <textarea
              id="comment"
              value={formState.comment}
              onChange={(e) => {
                if (e.target.value.length <= CHARACTER_LIMIT) {
                  setFormState((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }));
                }
              }}
              placeholder="Share your experience with this college..."
              rows={5}
              className="w-full px-4 py-4 bg-gradient-to-r from-background/90 to-background/70 backdrop-blur-sm border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 resize-none"
              required
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-muted-foreground">
              {formState.comment.length > 0 &&
                "Great! Keep sharing your thoughts."}
            </div>
            <div
              className={`text-sm font-medium transition-colors duration-200 ${
                formState.comment.length > CHARACTER_LIMIT * 0.9
                  ? "text-destructive"
                  : formState.comment.length > CHARACTER_LIMIT * 0.7
                  ? "text-amber-500"
                  : "text-muted-foreground"
              }`}
            >
              {formState.comment.length}/{CHARACTER_LIMIT}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={
            !formState.selectedCollegeId ||
            formState.rating === 0 ||
            !formState.comment.trim() ||
            formState.isSubmitting ||
            formState.showSuccess ||
            loading
          }
          className="group relative w-full bg-gradient-to-r from-primary to-accent text-white py-4 px-6 rounded-2xl font-semibold hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25"
        >
          <span className="relative z-10 flex items-center justify-center">
            {formState.showSuccess ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2 animate-scale-in" />
                Review Submitted!
              </>
            ) : formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;
