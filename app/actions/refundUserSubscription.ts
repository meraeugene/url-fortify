import { connect } from "@/lib/db";
import SubscriptionPlan from "@/lib/models/subscriptionPlanModel";
import User from "@/lib/models/userModel";
import Payment from "@/lib/models/paymentModel";
import { NextResponse } from "next/server";

export const refundUserSubscription = async (
  userId: string,
  paymentMongoId: string
) => {
  try {
    if (!userId || !paymentMongoId) {
      return new NextResponse(
        JSON.stringify({ message: "User ID or Payment ID is missing." }),
        { status: 400 }
      );
    }

    await connect();

    // Find the user
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found." }), {
        status: 404,
      });
    }

    // Find the free plan
    const freePlan = await SubscriptionPlan.findOne({ title: "Fortify Free" });
    if (!freePlan) {
      return new NextResponse(
        JSON.stringify({ message: "Free plan not found." }),
        { status: 404 }
      );
    }

    // Find the payment using the paymentId from PayMongo
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentMongoId, // Querying by the custom paymentId from PayMongo
      { status: "refunded" },
      { new: true }
    );

    // If the payment is not found, log the error and return a response
    if (!updatedPayment) {
      return new NextResponse(
        JSON.stringify({ message: "Failed to update payment status." }),
        { status: 500 }
      );
    }

    // Update user's subscription to the free plan
    const updatedUserSubscriptionPlan = await User.findByIdAndUpdate(
      userId,
      {
        "subscription.currentPlan": freePlan,
      },
      { new: true }
    );

    if (!updatedUserSubscriptionPlan) {
      console.error(`Failed to refund subscription for user: ${userId}`);
      return new NextResponse(
        JSON.stringify({ error: "Failed to refund subscription" }),
        { status: 500 }
      );
    }

    return new NextResponse(JSON.stringify(updatedUserSubscriptionPlan), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error updating subscription:", error);
    return new NextResponse(
      JSON.stringify({ message: error.message || "An error occurred." }),
      { status: 400 }
    );
  }
};
