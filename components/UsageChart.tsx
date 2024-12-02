"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/Chart";
import { AuthenticatedUserData } from "@/types";
import UsageProgress from "@/components/UsageProgress";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

interface UsageChartProps {
  user: AuthenticatedUserData;
}

const UsageChart = ({ user }: UsageChartProps) => {
  const monthlyLookupsUsed = user.usageStats.monthlyLookupsUsed;
  const monthlyUsageLimit = user.subscription.currentPlan.monthlyLookups;

  // Get the current month name
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  const chartData = [
    {
      month: currentMonth, // Dynamically set the current month
      monthlyLookupsUsed: monthlyLookupsUsed,
      monthlyUsageAvailable: monthlyUsageLimit - monthlyLookupsUsed,
      monthlyUsageLimit: monthlyUsageLimit,
    },
  ];

  const chartConfig = {
    monthlyLookupsUsed: {
      label: "Used",
      color: "#FFA726", // Amber Orange
    },
    monthlyUsageAvailable: {
      label: "Available",
      color: "#4DB6AC", // Refreshing Teal
    },
    monthlyUsageLimit: {
      label: "Total URL-Scans",
      color: "#42A5F5", // Sky Blue
    },
  } satisfies ChartConfig;

  // Dynamically calculate domain and ticks for YAxis
  const maxValue = Math.max(monthlyLookupsUsed, monthlyUsageLimit);
  const ticks = Array.from({ length: maxValue + 1 }, (_, i) => i); // Ticks by 1
  const domain = [0, ticks[ticks.length - 1]]; // Set domain to start from 0 and end at the last tick

  return (
    <div>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis mirror={true} domain={domain} ticks={ticks} />

          {/* <Tooltip content={<ChartTooltipContent />} /> */}
          <Legend content={<ChartLegendContent />} />
          <Bar
            dataKey="monthlyLookupsUsed"
            fill={chartConfig.monthlyLookupsUsed.color}
            radius={4}
          />
          <Bar
            dataKey="monthlyUsageAvailable"
            fill={chartConfig.monthlyUsageAvailable.color}
            radius={4}
          />
          <Bar
            dataKey="monthlyUsageLimit"
            fill={chartConfig.monthlyUsageLimit.color}
            radius={4}
          />
        </BarChart>
      </ChartContainer>

      <UsageProgress user={user} />
    </div>
  );
};

export default UsageChart;
