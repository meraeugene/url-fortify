"use client";

import { Progress } from "@/components/ui/Progress";
import { AuthenticatedUserData } from "@/types";

interface UsageProgressProps {
  user: AuthenticatedUserData;
}

const UsageProgress = ({ user }: UsageProgressProps) => {
  const { monthlyLookupsUsed } = user.usageStats;
  const { monthlyLookups: monthlyUsageLimit } = user.subscription.currentPlan;

  // Calculate usage percentage
  const usagePercentage = monthlyUsageLimit
    ? Math.min((monthlyLookupsUsed / monthlyUsageLimit) * 100, 100) // Cap at 100%
    : 0; // Handle cases where the limit might not be set

  // Determine the color based on usage percentage
  const getColor = () => {
    if (usagePercentage >= 80) return "bg-red-500"; // Near or at limit (80%+)
    if (usagePercentage >= 50) return "bg-[#FFA726]"; // Medium usage (50%-79%)
    return "bg-[#4DB6AC]"; // Low usage (<50%)
  };

  return (
    <div className="space-y-2 mt-4">
      <div className="flex justify-between text-sm">
        <span>
          Usage: {monthlyLookupsUsed}/{monthlyUsageLimit}
        </span>
        <span>{Math.round(usagePercentage)}%</span>
      </div>
      <Progress value={usagePercentage} colorClass={getColor()} />
    </div>
  );
};

export default UsageProgress;
