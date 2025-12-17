import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Notebook,
  Star,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import MaxWContainer from "@/components/ui/MaxWContainer";

function Slider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative group">
      {/* Left fade + arrow */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <button className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Scrollable content */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 -mx-1 px-1">
        {children}
      </div>

      {/* Right fade + arrow */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

// Workspace Card Skeleton
function WorkspaceCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[300px] rounded-xl border border-border bg-card/90 backdrop-blur-sm overflow-hidden">
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <div className="flex justify-center py-6">
          <div className="h-16 w-16 rounded-full bg-muted/70 flex items-center justify-center">
            <Notebook className="h-9 w-9 text-muted-foreground/50" />
          </div>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-border flex justify-between items-center">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
    </div>
  );
}

// Note Card Skeleton
function NoteCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[300px] rounded-xl border border-border bg-card/90 backdrop-blur-sm overflow-hidden">
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
          <Star className="h-5 w-5 text-yellow-500/30" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-11/12 rounded-md" />
          <Skeleton className="h-4 w-9/12 rounded-md" />
        </div>
      </div>
      <div className="px-5 py-3 border-t border-border flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <MaxWContainer className="relative mb-20">
      {/* Hero Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent from-20% via-transparent via-70% to-accent p-8 mb-8">
        <header className="relative max-w-3xl mx-auto text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-96 max-w-full mx-auto rounded-md" />
            <Skeleton className="h-5 w-80 max-w-full mx-auto rounded-md" />
          </div>
        </header>
      </div>

      {/* Your Workspaces */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Your Workspaces
          </h2>
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>
        </div>
        <Slider>
          {[...Array(3)].map((_, i) => (
            <WorkspaceCardSkeleton key={i} />
          ))}
        </Slider>
      </section>

      {/* Pinned Notes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Pinned Notes
        </h2>
        <Slider>
          {[...Array(2)].map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </Slider>
      </section>

      {/* Recent Notes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Recent Notes
        </h2>
        <Slider>
          {[...Array(4)].map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </Slider>
      </section>
    </MaxWContainer>
  );
}
