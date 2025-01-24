import { cn } from "../../lib/utils"
interface MaxWContainerProps {
    children: React.ReactNode;
    className?: string;
}
export default function MaxWContainer({children,className}:MaxWContainerProps) {
  return (
    <div className={cn(
      "container mx-auto px-4 sm:px-6 md:px-8 lg:px-10",
      className
    )}>
      {children}
    </div>
  )
}
