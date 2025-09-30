"use client";
import React from "react";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import { CollegeProvider } from "@/contexts/CollegeProvider";
import { ReviewProvider } from "@/contexts/ReviewProvider";
import { FavoriteProvider } from "@/contexts/FavoriteProvider";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CollegeProvider>
          <ReviewProvider>
            <FavoriteProvider>
              <AuthGuard>
                <Navbar />
                <main className="min-h-screen bg-background">{children}</main>
              </AuthGuard>
            </FavoriteProvider>
          </ReviewProvider>
        </CollegeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Wrapper;
