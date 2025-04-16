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
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: any) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(17, 17, 17, 0.8)",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#f8f8f8",
          }}
          cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
        />
        <Bar
          dataKey="total"
          fill="rgba(145, 126, 232, 0.7)"
          radius={[4, 4, 0, 0]}
          className="fill-brand_primary hover:fill-brand_primary/80"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
