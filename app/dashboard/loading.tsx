"use client";

import { Skeleton } from "@/components/ui/skeleton"; // Ensure you have a reusable Skeleton component or use Tailwind directly
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 mt-10">
      {/* Hero / Header */}
      <div className="rounded-2xl bg-muted/50 p-8 mb-10 animate-pulse">
        <div className="h-8 w-1/2 bg-muted rounded mb-4" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>

      {/* Tabs List Skeleton */}
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-36 rounded-md" />
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="bg-card/50 backdrop-blur-sm border-border/50 animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-5 w-3/4 bg-muted rounded" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="h-20 flex items-center justify-center">
                <div className="h-14 w-14 bg-muted rounded-full" />
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t border-border/50">
              <div className="h-4 w-24 bg-muted rounded" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
