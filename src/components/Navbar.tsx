"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import useThemeContext from "@/contexts/ThemeProvider";
import { Menu, X, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useThemeContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Colleges", href: "/colleges" },
    { name: "Reviews", href: "/reviews" },
    { name: "Favorites", href: "/favorites" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActivePath = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-lg shadow-primary/5 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
            >
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-primary/25 transition-all duration-300">
                <span className="text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                  CD
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-300">
                  College Dashboard
                </h1>
                <div className="h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  isActivePath(item.href)
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80 backdrop-blur-sm"
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {!isActivePath(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group relative p-3 rounded-xl bg-muted/50 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <div className="relative z-10">
                {theme === "light" ? (
                  <Moon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                ) : (
                  <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-border/50">
              <div className="hidden lg:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  Welcome,{" "}
                  <span className="text-foreground">{user?.username}</span>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="group relative bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:from-destructive/90 hover:to-destructive/70 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-destructive/25"
              >
                <span className="relative z-10">Logout</span>
                <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-destructive/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="group p-2.5 rounded-xl bg-muted/50 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-300 transform hover:scale-110"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              ) : (
                <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="group p-2.5 rounded-xl bg-muted/50 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-300 transform hover:scale-110"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg animate-fade-in-up">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${
                    isActivePath(item.href)
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80 backdrop-blur-sm"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="relative z-10">{item.name}</span>
                  {!isActivePath(item.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </Link>
              ))}
              <div
                className="border-t border-border/50 pt-4 mt-4 animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="flex items-center space-x-3 px-4 py-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {user?.username}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Welcome back!
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="group relative w-full text-left px-4 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground hover:from-destructive/90 hover:to-destructive/70 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-destructive/25"
                >
                  <span className="relative z-10">Logout</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-destructive/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
