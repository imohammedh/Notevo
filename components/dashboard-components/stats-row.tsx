import { Card, CardContent } from "@/components/ui/card";
import { Notebook, FileText, Pin, TrendingUp } from "lucide-react";

interface StatsRowProps {
  workspaceCount: number;
  notesCount: number;
  pinnedCount: number;
}

export function StatsRow({
  workspaceCount,
  notesCount,
  pinnedCount,
}: StatsRowProps) {
  // Calculate a mock growth percentage
  const growthPercent = Math.floor(notesCount * 15) + 5; // Random number between 5-20%

  const stats = [
    {
      title: "Workspaces",
      value: workspaceCount,
      icon: <Notebook className="h-4 w-4 text-brand_tertiary/70" />,
    },
    {
      title: "Total Notes",
      value: notesCount,
      icon: <FileText className="h-4 w-4 text-brand_tertiary/70" />,
    },
    {
      title: "Pinned Notes",
      value: pinnedCount,
      icon: <Pin className="h-4 w-4 text-brand_tertiary/70" />,
    },
    {
      title: "Growth",
      value: `${growthPercent}%`,
      icon: <TrendingUp className="h-4 w-4 text-brand_tertiary/70" />,
    },
  ];
  if (workspaceCount > 0 || pinnedCount > 0 || notesCount > 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-brand_fourthary/30 border-brand_tertiary/20"
          >
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                {stat.icon}
                <span className="text-sm text-brand_tertiary/70">
                  {stat.title}
                </span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  } else {
    return null;
  }
}
