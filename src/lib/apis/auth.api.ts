import api from "../axios";
import { handleApiError } from "../utils/api.utils";
import type {
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
  MeResponse,
  RefreshResponse,
  LogoutResponse,
} from "../../types/auth.types";

export const authApi = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>("/auth/register", data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Registration failed");
    }
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>("/auth/login", data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Login failed");
    }
  },

  async logout(): Promise<LogoutResponse> {
    try {
      const response = await api.post<LogoutResponse>("/auth/logout");
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Logout failed");
    }
  },

  async me(): Promise<MeResponse> {
    try {
      const response = await api.get<MeResponse>("/auth/me");
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to get user info");
    }
  },

  async refresh(): Promise<RefreshResponse> {
    try {
      const response = await api.get<RefreshResponse>("/auth/refresh");
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Token refresh failed");
    }
  },
};
