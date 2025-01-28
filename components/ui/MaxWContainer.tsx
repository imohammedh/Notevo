import { cn } from "../../lib/utils"
interface MaxWContainerProps {
    children: React.ReactNode;
    className?: string;
}
export default function MaxWContainer({children,className}:MaxWContainerProps) {
  return (
    <div className={cn(
      "container mx-auto px-4 sm:px-6 lg:px-8",
      className
    )}>
      {children}
    </div>
  )
}
