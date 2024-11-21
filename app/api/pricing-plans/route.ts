import { connect } from "@/lib/db";
import PricingPlan from "@/lib/models/pricingPlanModel";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connect();
    const pricingPlans = await PricingPlan.find();
    // const freePlan = await PricingPlan.findOne({ title: "Professional Plan" });

    return new NextResponse(JSON.stringify(pricingPlans), { status: 200 });
    // return new NextResponse(JSON.stringify(freePlan), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching users" + error.message, {
      status: 500,
    });
  }
};
