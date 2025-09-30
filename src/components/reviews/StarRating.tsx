import React from "react";
import { Star } from "lucide-react";

const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          disabled={readonly}
          className={`${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } transition-transform ${
            star <= rating ? "text-yellow-400" : "text-muted-foreground"
          }`}
        >
          <Star className="w-5 h-5 fill-current" />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
