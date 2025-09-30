import React from "react";
import StarRating from "./StarRating";
import { Review } from "@/types/review.types";
import { useAuth } from "@/contexts/AuthProvider";
import { User, MessageSquare } from "lucide-react";

const ReviewCard = ({ review }: { review: Review }) => {
  const { user } = useAuth();
  return (
    <div className="group relative bg-gradient-to-br from-card/95 via-card/85 to-card/75 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-6 hover:scale-[1.01] hover:-translate-y-1">
      {/* Subtle decorative element */}
      <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <MessageSquare className="w-6 h-6 text-primary" />
      </div>

      <div className="relative flex justify-between items-start mb-5">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
            {review.collegeName}
          </h3>
          <p className="text-sm font-medium text-muted-foreground flex items-center">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-60"></span>
            {review.location}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <StarRating rating={review.rating} readonly />
          <span className="text-xs text-muted-foreground font-medium">
            {review.rating}/5
          </span>
        </div>
      </div>

      <div className="relative">
        <p className="text-foreground leading-relaxed text-sm bg-gradient-to-r from-muted/30 to-transparent p-4 rounded-xl border-l-2 border-primary/20">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full">
              <User className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Review by{" "}
              <span
                className={`font-semibold ${
                  user?.userId === review?.user?.userId
                    ? "text-primary"
                    : "text-foreground"
                }`}
              >
                {user?.userId === review?.user?.userId
                  ? "You"
                  : review.user.username}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
