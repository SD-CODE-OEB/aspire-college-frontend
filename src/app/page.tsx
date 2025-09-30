"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowRight,
  GraduationCap,
  Star,
  Heart,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-primary/20"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent/15 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-secondary/10 rounded-full blur-xl animate-float-slow"></div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Your Educational Journey Starts Here
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 animate-fade-in-up delay-200">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-size-200 animate-gradient">
              College
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-300">
            Discover the perfect college for your future with our comprehensive
            platform.
            <span className="text-primary font-semibold">
              {" "}
              Browse colleges, read authentic reviews,
            </span>{" "}
            and create your personalized favorites list to make informed
            decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-500">
            <Link
              href="/colleges"
              className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary to-accent text-white text-lg font-semibold rounded-2xl hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            </Link>

            <Link
              href="/reviews"
              className="inline-flex items-center px-8 py-4 bg-card/80 backdrop-blur-sm text-card-foreground border border-border/50 rounded-2xl hover:bg-card transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <Star className="mr-2 w-5 h-5 text-accent" />
              View Reviews
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <div className="group relative bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up delay-700">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground group-hover:text-primary transition-colors">
                Browse Colleges
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Explore a comprehensive database of colleges with detailed
                information about courses, fees, and locations.
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-lg hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up delay-800">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground group-hover:text-accent transition-colors">
                Read Reviews
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Get insights from real students and alumni through authentic
                reviews and ratings.
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-lg hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up delay-900">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600/60 to-orange-500/40 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground group-hover:text-red-400 transition-colors">
                Save Favorites
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Create your personalized list of favorite colleges for easy
                comparison and reference.
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up delay-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground group-hover:text-primary transition-colors">
                Make Decisions
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Use our comprehensive data and community insights to make
                informed college choices.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
      </main>
    </div>
  );
}
