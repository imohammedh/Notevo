import { cn } from "@/lib/utils";
interface SkeletonTextAnimationProps {
  className?: string;
}
export default function SkeletonTextAnimation({
  className,
}: SkeletonTextAnimationProps) {
  return (
    <div className="animate-pulse">
      <div
        className={cn("h-7 bg-brand_tertiary/5 rounded mx-3 w-36", className)}
      ></div>
    </div>
  );
}
