import { cn } from "../../lib/utils"
interface MaxWContainerProps {
    children: React.ReactNode;
    className?: string;
}

const MaxWContainer = forwardRef<HTMLDivElement, MaxWContainerProps>(
  ({ children, className, ...props }, ref) => {
    return (
    <div className={cn(
      "container mx-auto px-4 sm:px-6 lg:px-8",
      className
    )}>
      {children}
    </div>
  )
}
