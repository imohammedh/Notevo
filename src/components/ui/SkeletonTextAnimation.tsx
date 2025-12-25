import { cn } from "@/src/lib/utils";
interface SkeletonTextAnimationProps {
  className?: string;
}
export default function SkeletonTextAnimation({
  className,
}: SkeletonTextAnimationProps) {
  return (
    <div className="animate-pulse">
      <div
        className={cn("h-7 bg-primary/20 rounded mx-3 w-36", className)}
      ></div>
    </div>
  );
}
