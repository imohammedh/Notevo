import { Slash } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef, useEffect } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { parseSlug } from "@/lib/parseSlug";

export default function BreadcrumbWithCustomSeparator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  const currentQuery = new URLSearchParams(searchParams);
  const currentId = currentQuery.get("id");

  // Persist previousId across re-renders
  const previousIdRef = useRef<string | null>(null);

  // Store workspace ID only if pathSegments.length === 2
  useEffect(() => {
    if (pathSegments.length === 2 && currentId) {
      previousIdRef.current = currentId;
    }
  }, [pathSegments.length, currentId]); // Runs only when these change

  console.log("Previous ID (Workspace):", previousIdRef.current);

  return (
    <div className="bg-transparent py-2">
      <Breadcrumb className="container mx-auto">
        <BreadcrumbList className="flex flex-nowrap overflow-x-hidden whitespace-nowrap">
          {pathSegments.map((segment, index) => {
            const href = "/" + pathSegments.slice(0, index + 1).join("/");
            let fullHref = href;

            // If navigating back to the workspace, use the stored previousId
            if (index === 1 && previousIdRef.current) {
              fullHref += `?id=${previousIdRef.current}`;
            }

            const isLast = index === pathSegments.length - 1;
            const name = parseSlug(segment);

            return (
              <div key={fullHref} className="flex items-center">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={fullHref}>{name}</Link>
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
