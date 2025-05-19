import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SkeletonCardProps {
  className?: string;
  layout?: "grid" | "list";
}

export function SkeletonCard({ className = "", layout = "list" }: SkeletonCardProps) {
  return (
    <Card className={`${className} border-primary/10 animate-pulse`}>
      <CardContent className={`p-4 ${layout === "grid" ? "flex flex-col items-center" : "flex items-start gap-4"}`}>
        {/* Avatar skeleton */}
        <div className={`${layout === "grid" ? "w-20 h-20 mb-3" : "w-16 h-16"} rounded-full bg-gray-200`} />

        <div className={`${layout === "grid" ? "w-full text-center" : "flex-1"}`}>
          {/* Name skeleton */}
          <div className="h-6 w-36 bg-gray-200 rounded-md mb-2" />
          
          {/* Specialty skeleton */}
          <div className="h-4 w-24 bg-gray-200 rounded-md mb-3" />

          {/* Address skeleton */}
          <div className={`flex ${layout === "grid" ? "justify-center" : ""} items-center space-x-1 mt-1`}>
            <div className="h-4 w-48 bg-gray-200 rounded-md" />
          </div>

          {/* Rating skeleton */}
          <div className={`flex ${layout === "grid" ? "justify-center" : ""} items-center space-x-1 mt-3`}>
            <div className="h-4 w-28 bg-gray-200 rounded-md" />
          </div>
        </div>

        <div className={`flex ${layout === "grid" ? "w-full mt-3 justify-center" : "flex-col"} gap-2`}>
          {/* Button skeleton */}
          <div className={`h-9 ${layout === "grid" ? "w-full" : "w-36"} bg-gray-200 rounded-md`} />
          
          {/* Second button skeleton for list view */}
          {layout === "list" && (
            <div className="h-9 w-36 bg-gray-200 rounded-md" />
          )}
        </div>
      </CardContent>
    </Card>
  );
} 