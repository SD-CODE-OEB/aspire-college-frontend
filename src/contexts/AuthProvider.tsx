"use client";

import {
  createContext,
  use,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { authApi } from "../lib/apis/auth.api";
import type { AuthUser } from "../types/auth.types";
import type { ApiError } from "../types/api.types";

type User = AuthUser;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      const authUser = response.data.user;
      const userToStore: User = {
        userId: authUser.userId,
        username: authUser.username,
        email: authUser.email,
      };
      setUser(userToStore);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        await authApi.register({ username, email, password });
        await login(email, password);
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await authApi.me();
      setUser(response.data);
    } catch (error) {
      void error;
      try {
        const refreshResponse = await authApi.refresh();
        if (refreshResponse.user && refreshResponse.user[0]) {
          setUser(refreshResponse.user[0]);
        }
      } catch (refreshError) {
        void refreshError;
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
    error,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
};
