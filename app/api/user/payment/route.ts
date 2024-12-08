import { connect } from "@/lib/db";
import Payment from "@/lib/models/paymentModel"; // Import the Payment model
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import SubscriptionPlan from "@/lib/models/subscriptionPlanModel";

export const GET = async (req: Request) => {
  try {
    // Parse the URL and extract query parameters
    const url = new URL(req.url);
    const invoiceNumber = url.searchParams.get("invoiceNumber");

    if (!invoiceNumber) {
      return new NextResponse(
        JSON.stringify({
          message: "Invoice number is required.",
        }),
        { status: 400 }
      );
    }

    // Find the latest payment for the user, sorted by paidAt in descending order (latest first)
    const latestPayment = await Payment.findOne({
      invoiceNumber,
    }).populate({
      path: "plan",
      model: SubscriptionPlan,
      select: "title features",
    });

    if (!latestPayment) {
      return new NextResponse(
        JSON.stringify({
          message: "No payments found for this user.",
        }),
        { status: 404 }
      );
    }

    // Return the latest payment information
    return new NextResponse(JSON.stringify(latestPayment), { status: 200 });
  } catch (error: any) {
    console.error("Error querying latest payment:", error);
    return new NextResponse(
      JSON.stringify({ message: error.message || "An error occurred." }),
      { status: 500 }
    );
  }
};
