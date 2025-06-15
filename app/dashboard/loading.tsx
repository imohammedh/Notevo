"use client";

import { Clock, Notebook, Plus, Sparkles } from "lucide-react";
import MaxWContainer from "@/components/ui/MaxWContainer";
import SkeletonTextAnimation from "@/components/ui/SkeletonTextAnimation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function DashboardSkeleton() {
  return (
    <MaxWContainer className="relative mb-20">
      {/* Hero Section */}
      <div className="w-full py-10 my-5 bg-gradient-to-r from-brand_fourthary via-transparent to-brand_fourthary rounded-xl">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 flex justify-center items-center gap-2">
            Welcome to Notevo, <SkeletonTextAnimation className="w-24" />
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            <SkeletonTextAnimation />
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
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
            <h2 className="text-foreground/80 text-lg font-medium">
              Your Workspaces
            </h2>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-border text-foreground px-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workspace
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <Card
                key={index}
                className="bg-brand_fourthary/30 border-brand_tertiary/20"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-foreground">
                    <div className="h-6 w-3/4 bg-brand_tertiary/10 rounded animate-pulse"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-16 flex items-center justify-center">
                    <Notebook className="h-10 w-10 text-brand_tertiary/20" />
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
            {/* Create Workspace Card */}
            <Card className="bg-brand_fourthary/20 border-dashed border-brand_tertiary/20">
              <CardContent className="flex flex-col items-center justify-center h-[176px]">
                <div className="h-12 w-12 rounded-full bg-brand_tertiary/10 flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-brand_tertiary/20" />
                </div>
                <div className="h-4 w-32 bg-brand_tertiary/10 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recent Notes Tab */}
        <TabsContent value="recent">
          <div className="mb-4">
            <h2 className="text-foreground/80 text-lg font-medium">
              Recent Notes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card
                key={index}
                className="bg-brand_fourthary/30 border-brand_tertiary/20"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-foreground">
                    <div className="h-6 w-3/4 bg-brand_tertiary/10 rounded animate-pulse"></div>
                  </CardTitle>
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