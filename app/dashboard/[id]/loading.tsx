"use client";

import { Calendar, FileText, LayoutGrid, List, Search } from "lucide-react";
import MaxWContainer from "@/components/ui/MaxWContainer";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import SkeletonTextAnimation from "@/components/ui/SkeletonTextAnimation";

export default function WorkingSpaceSkeleton() {
  return (
    <MaxWContainer className="relative mb-20">
      {/* Hero Section */}
      <div className="w-full py-10 my-5 bg-gradient-to-r from-accent via-transparent to-accent rounded-xl">
        <header className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 flex justify-center items-center gap-2 text-foreground">
            <SkeletonTextAnimation />
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            <SkeletonTextAnimation />
          </p>
        </header>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="notes" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-foreground/80 text-lg font-medium">
              Your Notes
            </h2>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-border text-foreground px-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card
                key={index}
                className="group bg-card/30 border-border hover:border-border/40 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
              >
                <CardHeader className="pb-2">
                  <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-16 flex items-center justify-center">
                    <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="mb-4">
            <h2 className="text-foreground/80 text-lg font-medium">
              Workspace Settings
            </h2>
          </div>

          <Card className="bg-card/30 border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* List View Skeleton (Hidden by default) */}
      <div className="hidden">
        <div className="flex flex-col gap-3 mt-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-card/30 border border-border rounded-lg"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent flex-shrink-0">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="h-5 w-3/4 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 w-4/5 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <div className="h-3.5 w-20 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-16 bg-muted rounded animate-pulse"></div>
                  <div className="h-7 w-7 bg-muted rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MaxWContainer>
  );
}