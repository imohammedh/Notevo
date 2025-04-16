"use client";

import { Clock, Notebook, Sparkles } from "lucide-react";
import MaxWContainer from "@/components/ui/MaxWContainer";
import SkeletonTextAnimation from "@/components/ui/SkeletonTextAnimation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardSkeleton() {
  return (
    <MaxWContainer className="relative mb-20">
      {/* Hero Section */}
      <div className="w-full py-10 my-5 bg-gradient-to-r from-brand_fourthary via-transparent to-brand_fourthary rounded-xl">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 flex justify-center items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand_tertiary/30" />
            Welcome to Notevo, <SkeletonTextAnimation className="w-24" />
          </h1>
          <div className="h-5 w-3/4 max-w-lg mx-auto bg-brand_tertiary/10 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3,4].map((i) => (
          <Card
            key={i}
            className="bg-brand_fourthary/30 border-brand_tertiary/20"
          >
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <div className="h-5 w-24 bg-brand_tertiary/10 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-12 bg-brand_tertiary/10 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="workspaces" className="mt-8">
        <TabsList className="bg-brand_fourthary/50 text-brand_tertiary/90 mb-6">
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="recent">Recent Notes</TabsTrigger>
        </TabsList>

        {/* Workspaces Tab */}
        <TabsContent value="workspaces">
          <div className="mb-4 flex justify-between items-center">
            <div className="h-6 w-40 bg-brand_tertiary/10 rounded animate-pulse"></div>
            <div className="h-9 w-36 bg-brand_tertiary/10 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <Card
                key={index}
                className="bg-brand_fourthary/30 border-brand_tertiary/20"
              >
                <CardHeader className="pb-2">
                  <div className="h-6 w-3/4 bg-brand_tertiary/10 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-16 flex items-center justify-center">
                    <Notebook className="h-10 w-10 text-brand_tertiary/10" />
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-brand_tertiary/20" />
                    <div className="h-3.5 w-20 bg-brand_tertiary/10 rounded animate-pulse"></div>
                  </div>
                  <div className="h-7 w-14 bg-brand_tertiary/10 rounded animate-pulse"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recent Notes Tab */}
        <TabsContent value="recent">
          <div className="mb-4">
            <div className="h-6 w-32 bg-brand_tertiary/10 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card
                key={index}
                className="bg-brand_fourthary/30 border-brand_tertiary/20"
              >
                <CardHeader className="pb-2">
                  <div className="h-6 w-3/4 bg-brand_tertiary/10 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-brand_tertiary/10 rounded animate-pulse mt-2"></div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-4 w-full bg-brand_tertiary/10 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-2/3 bg-brand_tertiary/10 rounded animate-pulse"></div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-brand_tertiary/20" />
                    <div className="h-3.5 w-20 bg-brand_tertiary/10 rounded animate-pulse"></div>
                  </div>
                  <div className="h-7 w-14 bg-brand_tertiary/10 rounded animate-pulse"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </MaxWContainer>
  );
}
