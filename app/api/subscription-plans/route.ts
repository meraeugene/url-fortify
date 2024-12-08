import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import SubscriptionPlan from "@/lib/models/subscriptionPlanModel";

// @desc Get all subscription plans
// @route GET /api/subscription-plans
// @access Public
export const GET = async () => {
  try {
    await connect();

    const subscriptionPlans = await SubscriptionPlan.find();

    // Handle no subscription plans found
    if (!subscriptionPlans || subscriptionPlans.length === 0) {
      return NextResponse.json(
        { message: "No subscription plans found." },
        { status: 404 }
      );
    }

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
