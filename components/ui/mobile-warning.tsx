import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./button";
import { AlertTriangle } from "lucide-react";

export function MobileWarning() {
  const isMobile = useIsMobile();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (isMobile) {
      const hasSeenWarning = localStorage.getItem("mobileWarningSeen");
      if (!hasSeenWarning) {
        setShowWarning(true);
      }
    }
  }, [isMobile]);

  const handleDismiss = () => {
    localStorage.setItem("mobileWarningSeen", "true");
    setShowWarning(false);
  };

  if (!showWarning) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-brand_primary/50 backdrop-blur-md p-4 rounded-lg border border-brand_tertiary/20 shadow-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-brand_tertiary">Mobile View Warning</h3>
          <p className="text-sm text-brand_tertiary/70 mt-1">
            We do NOT support mobile yet. Use with caution.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-brand_tertiary border-brand_tertiary/20 hover:text-brand_tertiary/80 hover:bg-brand_tertiary/10"
        >
          OK
        </Button>
      </div>
    </div>
  );
} 