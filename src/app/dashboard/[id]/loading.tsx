"use client";

import {
  Calendar,
  FileText,
  LayoutGrid,
  List,
  Search,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import MaxWContainer from "@/src/components/ui/MaxWContainer";

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-primary/20 rounded-md animate-pulse ${className}`} />
  );
}

function SkeletonText({ width = "w-full" }: { width?: string }) {
  return <Skeleton className={`h-4 ${width}`} />;
}

function SkeletonTitle() {
  return <Skeleton className="h-7 w-3/4" />;
}

function SkeletonButton() {
  return <Skeleton className="h-9 w-28 rounded-lg" />;
}

function GridNoteSkeleton() {
  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <SkeletonTitle />
          <Skeleton className="h-6 w-6 rounded" />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <SkeletonText />
          <SkeletonText width="w-5/6" />
          <SkeletonText width="w-4/6" />
        </div>
      </CardContent>
      <CardFooter className="pt-3 flex items-center justify-between border-t border-border">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-16 rounded-md" />
      </CardFooter>
    </Card>
  );
}

// List View Note Skeleton
function ListNoteSkeleton() {
  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />

          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <SkeletonText width="w-full" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-7 w-16 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Notes Skeleton based on view mode
function NotesSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <GridNoteSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <ListNoteSkeleton key={i} />
      ))}
    </div>
  );
}

// Tabs Skeleton (for tables)
function TablesTabsSkeleton() {
  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
      <div className="inline-flex items-center gap-3 p-1 bg-card/90 backdrop-blur-sm rounded-xl border border-border">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="px-6 py-2.5 rounded-lg bg-muted/30 animate-pulse"
          >
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
        <div className="px-6 py-2.5">
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Main Skeleton Page
export default function WorkingSpacePageSkeleton() {
  const fakeViewMode: "grid" | "list" = "grid"; // You can make this dynamic if needed

  return (
    <MaxWContainer className="mb-20">
      {/* Header Skeleton */}
      <header className="pb-5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent from-20% via-transparent via-70% to-accent p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <Skeleton className="h-10 w-64 inline-block" />
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm bg-white/10">
                  <LayoutGrid className="h-4 w-4" />
                  <Skeleton className="h-4 w-16 inline-block" />
                </span>
              </div>
            </div>
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
        </div>
      </header>

      {/* Tabs + Notes Content Skeleton */}
      <div className="mt-6">
        <Tabs defaultValue="fake-tab-1">
          <TablesTabsSkeleton />

          {/* Active Tab Content Skeleton */}
          <div className="space-y-6">
            {/* Control Bar Skeleton */}
            <div className="flex flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Skeleton className="h-10 w-full pl-10" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
                <SkeletonButton />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </div>

            {/* Notes Grid/List Skeleton */}
            <NotesSkeleton viewMode={fakeViewMode} />
          </div>
        </Tabs>
      </div>
    </MaxWContainer>
  );
}
