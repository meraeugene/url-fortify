import Payment from "@/lib/models/paymentModel";
import { connect } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { NextResponse } from "next/server";
import SubscriptionPlan from "@/lib/models/subscriptionPlanModel";

export const GET = async () => {
  try {
    // Verify user session
    const session = await verifySession();
    if (!session.isAuth || !session.userId) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    await connect(); // Ensure database connection

    // Fetch all payments for the authenticated user
    const payments = await Payment.find({ userId: session.userId })
      .sort({ paidAt: -1 }) // Sort by most recent payment
      .select("invoiceNumber paymentMethod paidAt amount plan  status  ") // Choose which fields to return
      .populate({
        path: "plan",
        model: SubscriptionPlan,
        select: "title",
      })
      .exec();

    // If no payments found, return an empty array
    if (payments.length === 0) {
      return new NextResponse(
        JSON.stringify({
          message: "No payment history found.",
          payments: [],
        }),
        { status: 200 }
      );
    }

    // Return the payment data
    return new NextResponse(
      JSON.stringify({
        message: "Payment history retrieved successfully.",
        payments,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error fetching payments:", error.message);

    // Return error response
    return new NextResponse(
      JSON.stringify({
        message: "Failed to retrieve payment history.",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
