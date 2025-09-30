import { useState } from "react";
import { College } from "@/types/college.types";
import { useFavorites } from "@/contexts/FavoriteProvider";
import {
  BookOpen,
  Heart,
  Loader2,
  MapPin,
  Sparkles,
  GraduationCap,
  IndianRupeeIcon,
} from "lucide-react";

const CollegeCard = ({ college }: { college: College }) => {
  const {
    addFavorite,
    removeFavorite,
    isFavorite,
    loading: favLoading,
  } = useFavorites();
  const [isToggling, setIsToggling] = useState(false);

  const handleFavoriteToggle = async () => {
    if (isToggling) return;

    setIsToggling(true);
    try {
      if (isFavorite(college.collegeId)) {
        await removeFavorite(college.collegeId);
      } else {
        await addFavorite({ collegeId: college.collegeId });
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="group relative overflow-hidden">
      {/* Background Gradient & Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl border border-border/30 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2">
        {/* Floating Elements */}
        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <GraduationCap className="w-6 h-6 text-accent" />
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent line-clamp-2 mb-2 transition-transform duration-300">
              {college.collegeName}
            </h3>
          </div>

          {/* Enhanced Favorite Button */}
          <button
            onClick={handleFavoriteToggle}
            disabled={isToggling || favLoading}
            className={`group/heart relative p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
              isFavorite(college.collegeId)
                ? "bg-gradient-to-br from-red-500/20 to-pink-500/20 text-red-500 border border-red-500/30 shadow-lg shadow-red-500/25"
                : "bg-muted/50 text-muted-foreground hover:text-red-500 hover:bg-gradient-to-br hover:from-red-500/10 hover:to-pink-500/10 border border-border/50 hover:border-red-500/30"
            } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
            title={
              isFavorite(college.collegeId)
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            {isToggling ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Heart
                className="w-6 h-6 transition-transform duration-300 group-hover/heart:scale-110"
                fill={isFavorite(college.collegeId) ? "currentColor" : "none"}
                stroke="currentColor"
              />
            )}
            {isFavorite(college.collegeId) && (
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover/heart:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
        </div>

        <div className="space-y-5">
          {/* Location Section */}
          <div className="group/item flex items-center p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-all duration-300">
            <div className="relative p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl mr-4 group-hover/item:scale-110 transition-transform duration-300">
              <MapPin className="w-5 h-5 text-primary" />
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                Location
              </span>
              <p className="text-sm font-semibold text-foreground">
                {college.location}
              </p>
            </div>
          </div>

          {/* Course Section */}
          <div className="group/item flex items-center p-4 rounded-2xl bg-gradient-to-r from-accent/5 to-transparency border border-accent/10 hover:border-accent/20 transition-all duration-300">
            <div className="relative p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl mr-4 group-hover/item:scale-110 transition-transform duration-300">
              <BookOpen className="w-5 h-5 text-accent" />
              <div className="absolute inset-0 bg-accent/20 rounded-xl blur-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <span className="text-xs font-medium text-accent uppercase tracking-wide">
                Course
              </span>
              <p className="text-sm font-semibold text-foreground line-clamp-2">
                {college.course}
              </p>
            </div>
          </div>

          {/* Fee Section */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-yellow-50/40 dark:from-orange-900/20 dark:via-amber-900/15 dark:to-yellow-900/10 border border-orange-200/30 dark:border-orange-800/30 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-amber-100/30 dark:from-orange-800/20 dark:to-amber-800/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative p-3 bg-gradient-to-br from-orange-400/30 to-amber-400/20 rounded-xl mr-4 group-hover:shadow-lg group-hover:shadow-orange-400/25 transition-all duration-300">
                  <IndianRupeeIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  <div className="absolute inset-0 bg-orange-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                    Annual Fee
                  </span>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 group-hover:text-orange-600 dark:group-hover:text-orange-200 transition-colors duration-300">
                    {college.fee}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center">
                <div className="flex -space-x-1">
                  <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-red-400 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Glow Effect */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};

export default CollegeCard;
