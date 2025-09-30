export interface User {
  userId: number;
  username: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  userId: number;
  username: string;
  email: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  data: User;
  message: string;
  success: boolean;
}

export interface LoginResponse {
  data: {
    user: User;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export interface MeResponse {
  data: AuthUser;
  message: string;
  success: boolean;
}

export interface RefreshResponse {
  user: AuthUser[];
  message: string;
  success: boolean;
}

export interface LogoutResponse {
  message: string;
}
