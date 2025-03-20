import { cn } from "@/lib/utils";

interface SkeletonSmImgAnimationProps {
  className?: string;
}
export default function SkeletonSmImgAnimation({
  className,
}: SkeletonSmImgAnimationProps) {
  return (
    <div className="animate-pulse">
      <div
        className={cn(
          "h-10 w-10 bg-brand_tertiary/5 rounded-xl mx-3",
          className,
        )}
      ></div>
    </div>
  );
}
