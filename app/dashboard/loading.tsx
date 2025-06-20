"use client";

import SkeletonTextAnimation from "@/components/ui/SkeletonTextAnimation";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardSkeleton() {
  return (
    <MaxWContainer className="relative mb-20">
      {/* Hero Section Skeleton */}
      <div className="w-full py-10 my-5 bg-gradient-to-r from-accent via-transparent to-accent rounded-xl">
        <header className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-3">
            <SkeletonTextAnimation className="h-8 w-64" />
          </div>
          <SkeletonTextAnimation className="h-4 w-3/4 mx-auto" />
          <SkeletonTextAnimation className="h-4 w-2/3 mx-auto mt-2" />
        </header>
      </div>

      {/* Main Content Tabs Skeleton */}
      <Tabs defaultValue="workspaces" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="workspaces">
            <SkeletonTextAnimation className="h-6 w-24" />
          </TabsTrigger>
          <TabsTrigger value="recent">
            <SkeletonTextAnimation className="h-6 w-24" />
          </TabsTrigger>
        </TabsList>

        {/* Workspaces Tab Skeleton */}
        <div className="mb-4 flex justify-between items-center">
          <SkeletonTextAnimation className="h-6 w-40" />
          <SkeletonTextAnimation className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card
              key={index}
              className="bg-card/30 border-border animate-pulse"
            >
              <CardHeader className="pb-2">
                <SkeletonTextAnimation className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-16 flex items-center justify-center">
                  <SkeletonTextAnimation className="h-10 w-10 rounded-full" />
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between items-center">
                <SkeletonTextAnimation className="h-4 w-24" />
                <SkeletonTextAnimation className="h-7 w-16" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </Tabs>
    </MaxWContainer>
  );
}