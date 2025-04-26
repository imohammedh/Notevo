"use client";

import { Slash } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { parseSlug } from "@/lib/parseSlug";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function BreadcrumbWithCustomSeparator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Find the workspace ID segment (assuming it's always the segment after "dashboard")
  const dashboardIndex = pathSegments.findIndex(
    (segment) => segment === "dashboard",
  );
  const workingSpaceId: Id<"workingSpaces"> | null =
    dashboardIndex >= 0 && pathSegments.length > dashboardIndex + 1
      ? (pathSegments[dashboardIndex + 1] as Id<"workingSpaces">)
      : null;

  const NullWorkingSpacaeId: Id<"workingSpaces"> = "123" as Id<"workingSpaces">;
  // Fetch workspace data
  const workspaceData = useQuery(
    api.mutations.workingSpaces.getWorkingSpaceById,
    { _id: workingSpaceId || NullWorkingSpacaeId },
  );

  return (
    <div className="bg-transparent py-2">
      <Breadcrumb>
        <BreadcrumbList className="flex flex-nowrap overflow-x-hidden whitespace-nowrap">
          {pathSegments.map((segment, index) => {
            // Build the path up to this segment
            const pathToSegment =
              "/" + pathSegments.slice(0, index + 1).join("/");

            // Add the current query parameters to all links
            const queryString = searchParams.toString();
            const fullHref = queryString
              ? `${pathToSegment}?${queryString}`
              : pathToSegment;

            const isLast = index === pathSegments.length - 1;

            // Determine display name based on segment type
            let displayName;

            // If this is the workspace ID segment and we have workspace data
            if (
              index === dashboardIndex + 1 &&
              workspaceData &&
              workspaceData.name
            ) {
              displayName = workspaceData.name;
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
                    <BreadcrumbPage>{displayName}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={fullHref}>{displayName}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <Slash className="w-3 h-3 mx-1" />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
