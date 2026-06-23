import { NextResponse } from "next/server";
import { subscriptionPlans } from "@/lib/subscriptionPlans";

// @desc Get all subscription plans
// @route GET /api/subscription-plans
// @access Public
export const GET = async () => {
  try {
    return new NextResponse(JSON.stringify(subscriptionPlans), { status: 200 });
  } catch (error: any) {
    console.error("Error getting subscription plans:", error);
    return new NextResponse(
      JSON.stringify({
        message: error.message,
        error: error.error,
      }),
      { status: 500 }
    );
  }
};
