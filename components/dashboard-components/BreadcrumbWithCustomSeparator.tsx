"use client";
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

  const previousIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (pathSegments.length === 2 && currentId) {
      previousIdRef.current = currentId;
    }
  }, [pathSegments.length, currentId]);

  return (
    <div className="bg-transparent py-2">
      <Breadcrumb>
        <BreadcrumbList className="flex flex-nowrap overflow-x-hidden whitespace-nowrap">
          {pathSegments.map((segment, index) => {
            const href = "/" + pathSegments.slice(0, index + 1).join("/");
            let fullHref = href;

            if (index === 1 && previousIdRef.current) {
              fullHref += `?id=${previousIdRef.current}`;
            }

            const isLast = index === pathSegments.length - 1;
            const name = parseSlug(segment);
            const isMobile =
              typeof window !== "undefined" && window.innerWidth <= 768;
            const displayName =
              isMobile && name.length > 10 ? `${name.slice(0, 10)}...` : name;
            return (
              <div key={fullHref} className="flex items-center">
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
