export interface ApiError {
  success: false;
  message: string;
}

export interface BaseResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}
