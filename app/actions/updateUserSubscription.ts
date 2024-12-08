import { connect } from "@/lib/db";
import User from "@/lib/models/userModel";
import { NextResponse } from "next/server";
import Payment from "@/lib/models/paymentModel";

export const updateUserSubscription = async (
  userId: string,
  newPlanId: string,
  paymentId: string,
  paymentMethod: string,
  invoiceNumber: string,
  paidAt: number,
  amount: number,
  status: "paid" | "refunded" | "failed"
) => {
  try {
    if (!userId || !newPlanId) {
      return new NextResponse(
        JSON.stringify({
          message: "User ID and Plan ID is missing.",
        }),
        { status: 400 }
      );
    }

    await connect();

    let user = await User.findOne({ _id: userId });

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    const payment = await Payment.create({
      userId,
      paymentId,
      invoiceNumber,
      paymentMethod,
      paidAt,
      amount,
      plan: newPlanId,
      status,
    });

    const updatedUserSubscriptionPlan = await User.findByIdAndUpdate(
      userId,
      {
        "subscription.currentPlan": newPlanId,
        $push: { payments: payment._id },
      },
      { new: true }
    );

    if (!updatedUserSubscriptionPlan) {
      console.error(`Failed to update subscription for user: ${userId}`);
      return NextResponse.json(
        { error: "Failed to update subscription" },
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
