import React, { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";

export interface FilterOptions {
  searchTerm: string;
  location: string;
  course: string;
  minFee: number;
  maxFee: number;
  sortBy: "none" | "fee-low-high" | "fee-high-low" | "name-a-z" | "name-z-a";
}

export interface FilterComponentProps {
  onFilterChange: (filters: FilterOptions) => void;
  locations: string[];
  courses: string[];
  minFeeRange: number;
  maxFeeRange: number;
  showAdvanced?: boolean;
  className?: string;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  onFilterChange,
  locations,
  courses,
  minFeeRange,
  maxFeeRange,
  showAdvanced = true,
  className = "",
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    location: "",
    course: "",
    minFee: minFeeRange,
    maxFee: maxFeeRange,
    sortBy: "none",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Update fee range when props change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minFee: minFeeRange,
      maxFee: maxFeeRange,
    }));
  }, [minFeeRange, maxFeeRange]);

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      location: "",
      course: "",
      minFee: minFeeRange,
      maxFee: maxFeeRange,
      sortBy: "none",
    });
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.location ||
    filters.course ||
    filters.minFee !== minFeeRange ||
    filters.maxFee !== maxFeeRange ||
    filters.sortBy !== "none";

  return (
    <div
      className={`bg-card border border-border rounded-lg shadow-sm ${className}`}
    >
      {/* Search Bar - Always Visible */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by college name..."
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {showAdvanced && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  showFilters || hasActiveFilters
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters{" "}
                {hasActiveFilters && (
                  <span className="bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-full">
                    •
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters - Collapsible */}
      {showAdvanced && showFilters && (
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Course
              </label>
              <select
                value={filters.course}
                onChange={(e) => handleFilterChange("course", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  handleFilterChange(
                    "sortBy",
                    e.target.value as FilterOptions["sortBy"]
                  )
                }
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="none">Default</option>
                <option value="name-a-z">Name (A-Z)</option>
                <option value="name-z-a">Name (Z-A)</option>
                <option value="fee-low-high">Fee (Low to High)</option>
                <option value="fee-high-low">Fee (High to Low)</option>
              </select>
            </div>

            {/* Fee Range - Takes full width on mobile */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Fee Range (₹)
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minFee}
                    onChange={(e) =>
                      handleFilterChange(
                        "minFee",
                        parseInt(e.target.value) || minFeeRange
                      )
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxFee}
                    onChange={(e) =>
                      handleFilterChange(
                        "maxFee",
                        parseInt(e.target.value) || maxFeeRange
                      )
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹{minFeeRange.toLocaleString()}</span>
                  <span>₹{maxFeeRange.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="p-3 bg-muted/10">
          <div className="flex flex-wrap gap-2">
            {filters.searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
                Search: &ldquo;{filters.searchTerm}&rdquo;
                <button
                  onClick={() => handleFilterChange("searchTerm", "")}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary text-sm rounded-md">
                Location: {filters.location}
                <button
                  onClick={() => handleFilterChange("location", "")}
                  className="hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.course && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-sm rounded-md">
                Course: {filters.course}
                <button
                  onClick={() => handleFilterChange("course", "")}
                  className="hover:bg-accent/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.sortBy !== "none" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground text-sm rounded-md">
                Sort: {filters.sortBy.replace("-", " ")}
                <button
                  onClick={() => handleFilterChange("sortBy", "none")}
                  className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
