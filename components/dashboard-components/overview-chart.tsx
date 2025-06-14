"use client";

import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const data = [
  {
    name: "Jan",
    total: 12,
  },
  {
    name: "Feb",
    total: 18,
  },
  {
    name: "Mar",
    total: 24,
  },
  {
    name: "Apr",
    total: 32,
  },
  {
    name: "May",
    total: 28,
  },
  {
    name: "Jun",
    total: 36,
  },
  {
    name: "Jul",
    total: 42,
  },
  {
    name: "Aug",
    total: 48,
  },
  {
    name: "Sep",
    total: 52,
  },
  {
    name: "Oct",
    total: 58,
  },
  {
    name: "Nov",
    total: 64,
  },
  {
    name: "Dec",
    total: 72,
  },
];

export function OverviewChart() {
  const { theme } = useTheme();

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <defs>
                <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar
                dataKey="total"
                fill="url(#color)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
