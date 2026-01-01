"use client";

import { Slash } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { parseSlug } from "@/lib/parseSlug";
import { useQuery } from "@/cache/useQuery";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function BreadcrumbWithCustomSeparator() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Find the workspace ID segment (assuming it's always the segment after "dashboard")
  const dashboardIndex = pathSegments.findIndex(
    (segment) => segment === "dashboard",
  );
  const workingSpaceId: Id<"workingSpaces"> | null =
    dashboardIndex >= 0 && pathSegments.length > dashboardIndex + 1
      ? (pathSegments[dashboardIndex + 1] as Id<"workingSpaces">)
      : null;

  // Fetch workspace data
  const workspaceData = useQuery(api.workingSpaces.getRecentWorkingSpaces);
  const workspaceDatafilter =
    workingSpaceId && workspaceData
      ? workspaceData.find(
          (workspaceDatafiltered: any) =>
            workspaceDatafiltered._id === workingSpaceId,
        )
      : null;

  return (
    <div className="bg-background py-2">
      <Breadcrumb>
        <BreadcrumbList className="flex flex-nowrap overflow-x-hidden whitespace-nowrap text-foreground">
          {pathSegments.map((segment, index) => {
            // Build the path up to this segment
            const pathToSegment =
              "/" + pathSegments.slice(0, index + 1).join("/");

            const isLast = index === pathSegments.length - 1;

            // Determine display name based on segment type
            let displayName;

            // If this is the workspace ID segment and we have workspace data
            if (
              index === dashboardIndex + 1 &&
              workspaceDatafilter &&
              workspaceDatafilter.name
            ) {
              displayName = workspaceDatafilter.name;
            } else {
              // For other segments, use the parseSlug utility
              displayName = parseSlug(segment);
            }

            // Handle mobile view truncation
            const isMobile =
              typeof window !== "undefined" && window.innerWidth <= 768;
            displayName =
              isMobile && displayName.length > 10
                ? `${displayName.slice(0, 10)}...`
                : displayName;

            return (
              <div
                key={pathToSegment}
                className="flex items-center justify-start"
              >
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="text-foreground">
                      {displayName}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={pathToSegment}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {displayName}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <Slash className="w-3 h-3 mx-1 text-muted-foreground" />
                )}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
