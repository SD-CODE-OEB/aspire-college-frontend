"use client";
import React from "react";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { StoreInitializer } from "@/components/StoreInitializer";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreInitializer />
        <AuthGuard>
          <Navbar />
          <main className="min-h-screen bg-background">{children}</main>
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Wrapper;
