import { cn } from "@/src/lib/utils";

interface SkeletonSmImgAnimationProps {
  className?: string;
}
export default function SkeletonSmImgAnimation({
  className,
}: SkeletonSmImgAnimationProps) {
  return (
    <div className="animate-pulse">
      <div
        className={cn("h-10 w-10 bg-primary/20 rounded-xl mx-3", className)}
      ></div>
    </div>
  );
}
