"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import useThemeContext from "@/contexts/ThemeProvider";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

const RegisterPage = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    validationErrors: [] as string[],
  });
  const { register, loading, error, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useThemeContext();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const errors: string[] = [];

    if (formState.username.length < 3) {
      errors.push("Username must be at least 3 characters long");
    }

    if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.push("Please enter a valid email address");
    }

    if (formState.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    if (formState.password !== formState.confirmPassword) {
      errors.push("Passwords do not match");
    }

    setFormState((prev) => ({ ...prev, validationErrors: errors }));
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register(formState.username, formState.email, formState.password);
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 my-4">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
                CD
              </span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Create account</h2>
          <p className="mt-2 text-muted-foreground">
            Join College Dashboard to explore colleges
          </p>
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}{" "}
            {theme === "light" ? "Dark" : "Light"} mode
          </button>
        </div>

        {/* Register Form */}
        <form className="space-y-6 p-3" onSubmit={handleSubmit}>
          {(error || formState.validationErrors.length > 0) && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  {error && <div className="mb-2">{error}</div>}
                  {formState.validationErrors.length > 0 && (
                    <ul className="list-disc list-inside space-y-1">
                      {formState.validationErrors.map((error, index) => (
                        <li key={index} className="text-sm">
                          {error}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={formState.username}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, username: e.target.value }))
              }
              className="w-full px-4 py-3 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formState.email}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-4 py-3 bg-background border text-foreground border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={formState.showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formState.password}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 pr-12 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                {formState.showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={formState.showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formState.confirmPassword}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 pr-12 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showConfirmPassword: !prev.showConfirmPassword,
                  }))
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                {formState.showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>

          <div className="text-center">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
