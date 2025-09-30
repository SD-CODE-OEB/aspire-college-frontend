"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ["/auth/login", "/auth/register"];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && !isPublicPath) {
        router.push("/auth/login");
      } else if (isAuthenticated && isPublicPath) {
        router.push("/");
      }
    }
  }, [isAuthenticated, loading, isPublicPath, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicPath) {
    return null;
  }

  if (isAuthenticated && isPublicPath) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
