// filename: loading.tsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import MaxWContainer from "@/components/ui/MaxWContainer";
import { LayoutGrid, List, Search } from "lucide-react";

export default function WorkingSpaceSkeleton() {
  return (
    <MaxWContainer className="mb-20 space-y-6">
      {/* Gradient Header */}
      <header className="pb-5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent from-20% via-transparent via-70% to-accent p-8">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-80 rounded-lg" />{" "}
              {/* Workspace name */}
              <div className="flex gap-4">
                <Skeleton className="h-8 w-32 rounded-full" />{" "}
                {/* tables count */}
                <Skeleton className="h-8 w-32 rounded-full" />{" "}
                {/* notes count */}
              </div>
            </div>
            <Skeleton className="h-11 w-44 rounded-lg" />{" "}
            {/* Create Table button */}
          </div>
        </div>
      </header>

      {/* Tabs Skeleton (horizontal scrollable) */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-flex gap-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Control Bar: Search + View Mode + Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Skeleton className="h-10 w-full rounded-md pl-10" />
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* View mode toggle */}
          <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
          <Skeleton className="h-10 w-10 rounded-md" /> {/* Create Note */}
          <Skeleton className="h-10 w-10 rounded-md" /> {/* Table Settings */}
        </div>
      </div>

      {/* Notes Grid Skeleton (5 columns on xl) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Card
            key={i}
            className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </CardHeader>

            <CardContent className="space-y-2 pb-4">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-11/12 rounded-md" />
              <Skeleton className="h-4 w-10/12 rounded-md" />
            </CardContent>

            <CardFooter className="pt-3 border-t border-border/50 flex justify-between items-center">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </MaxWContainer>
  );
}
