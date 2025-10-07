import React, { useState } from "react";
import type { Favorite } from "@/types/favorite.types";
import { useFavoritesLoading, useFavoriteStore } from "@/stores/favoriteStore";
import { Heart, Loader2, MapPin, Star } from "lucide-react";

const FavoriteCard = ({ favorite }: { favorite: Favorite }) => {
  const { removeFavorite } = useFavoriteStore();
  const loading = useFavoritesLoading();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveFavorite = async () => {
    if (isRemoving) return;

    setIsRemoving(true);
    try {
      await removeFavorite(favorite.collegeId);
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-card/95 via-card/85 to-card/75 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-6 hover:scale-[1.02] hover:-translate-y-1">
      {/* Decorative Elements */}
      <div className="absolute top-4 right-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <Star className="w-6 h-6 text-primary" />
      </div>

      <div className="flex justify-between items-start mb-5">
        <div className="flex-1 pr-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 backdrop-blur-sm rounded-full border border-red-500/20 mb-3">
            <Heart className="w-3 h-3 text-red-500 fill-current" />
            <span className="text-xs font-medium text-red-500">Favorite</span>
          </div>
          <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {favorite.collegeName}
          </h3>
        </div>

        <button
          onClick={handleRemoveFavorite}
          disabled={isRemoving || loading}
          className={`group/heart relative p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-110 text-red-500 bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 ${
            isRemoving ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Remove from favorites"
        >
          {isRemoving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Heart className="w-5 h-5 fill-current transition-transform duration-300 group-hover/heart:scale-110" />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover/heart:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      <div className="space-y-4">
        {/* Location Section */}
        <div className="flex items-center p-3 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-all duration-300">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl mr-3">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-xs font-medium text-primary uppercase tracking-wide">
              Location
            </span>
            <p className="text-sm font-semibold text-foreground">
              {favorite.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
