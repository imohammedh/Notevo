import { Slash } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const slugToNameMap = {
  'workspace-slug': 'Workspace Name',
  'note-slug': 'Note Title',
};

export default function BreadcrumbWithCustomSeparator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathSegments = pathname.split('/').filter((segment) => segment);
  
  // Capture query parameters
  const queryString = searchParams.toString(); // Get query string like ?id=...
  
  const generateBreadcrumbs = () => {
    const breadcrumbs = pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const fullHref = queryString ? `${href}?${queryString}` : href; // Append query string if exists
      const isLast = index === pathSegments.length - 1;
      const name = slugToNameMap[segment as keyof typeof slugToNameMap] || segment;

      return (
        <div key={fullHref} className="flex items-center">
          <BreadcrumbItem>
            {isLast ? (
              <BreadcrumbPage>{name}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={fullHref}>{name}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {!isLast && <Slash className="w-3 h-3 mx-1" />}
        </div>
      );
    });

    return [...breadcrumbs];
  };

  return (
    <div className="bg-transparent py-2">
      <Breadcrumb className="container mx-auto">
        <div>
          <BreadcrumbList className="flex flex-nowrap overflow-x-hidden whitespace-nowrap">
            {generateBreadcrumbs()}
          </BreadcrumbList>
        </div>
      </Breadcrumb>
    </div>
  );
}
