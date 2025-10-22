import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import MaxWContainer from "@/components/ui/MaxWContainer";

export default function WorkingSpaceSkeleton() {
  return (
    <MaxWContainer className="mb-20 space-y-6">
      {/* HEADER SKELETON */}
      <header className="pb-5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent from-20% via-transparent via-70% to-accent p-8 shadow-2xl shadow-primary/10">
          <div className="relative flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-2/3 rounded-md" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </header>

      {/* TABS SKELETON */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-flex gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </div>

      {/* CONTROLS SKELETON */}
      <div className="flex flex-row gap-4 items-center justify-between p-4 bg-card/90 backdrop-blur-sm rounded-xl border border-border/50">
        <Skeleton className="h-10 w-full sm:w-96 rounded-md" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      {/* NOTES GRID SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-3/4 rounded-md" />
            </CardHeader>
            <CardContent className="pb-3 space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </CardContent>
            <CardFooter className="pt-3 border-t border-border/50">
              <Skeleton className="h-4 w-24 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </MaxWContainer>
  );
}
