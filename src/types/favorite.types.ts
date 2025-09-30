export interface Favorite {
  collegeId: number;
  collegeName: string;
  location: string;
  userId: number;
  username: string;
}

export interface AddFavoriteRequest {
  collegeId: number;
}

export interface FavoritesResponse {
  data: Favorite[];
  success: boolean;
  message: string;
  timestamp: string;
}
