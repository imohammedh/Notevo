import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  change,
  trend,
}: StatsCardProps) {
  return (
    <Card className="bg-brand_fourthary/50 border-brand_tertiary/20 text-brand_tertiary/90">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand_tertiary/70">{description}</p>
          {change && (
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <ArrowUp className="h-3 w-3 text-emerald-500" />
              ) : trend === "down" ? (
                <ArrowDown className="h-3 w-3 text-red-500" />
              ) : null}
              <span
                className={cn("text-xs", {
                  "text-emerald-500": trend === "up",
                  "text-red-500": trend === "down",
                  "text-brand_tertiary/70": trend === "neutral" || !trend,
                })}
              >
                {change}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
