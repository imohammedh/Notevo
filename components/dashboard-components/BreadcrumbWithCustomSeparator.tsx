import { Slash } from "lucide-react"
import { usePathname } from 'next/navigation'
 
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
 
export default function BreadcrumbWithCustomSeparator() {
 const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment);

  const generateBreadcrumbs = () => {
    const breadcrumbs = pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const isLast = index === pathSegments.length - 1;

      return (
        <div key={href} className="flex items-center">
          <BreadcrumbItem>
            {isLast ? (
              <BreadcrumbPage>{segment}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {!isLast && <Slash />}
        </div>
      );
    });

    return [
      <div key="/" className="flex items-center">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.length > 0 && <Slash />}
      </div>,
      ...breadcrumbs,
    ];
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
  )
}
 