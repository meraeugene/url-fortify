import { createRefundSession } from "@/app/actions/refund";
import { NextResponse } from "next/server";

// @desc Create a refund
// @route POST /api/create-refund
// @access Private
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { reason, amount, paymentId, userId, paymentMongoId } = body;

    if (!paymentId) {
      return new NextResponse(
        JSON.stringify({ message: "Payment ID is required." }),
        { status: 400 }
      );
    }

    const refundSession = await createRefundSession({
      amount,
      reason,
      paymentId,
      userId,
      paymentMongoId,
    });

    return new NextResponse(
      JSON.stringify({
        message: {
          title: "Refund processed successfully. ",
          description:
            "Your refund request has been successfully processed. Please allow a moment for the update to reflect.",
        },
        redirect_url: `/refund/success`,
        refundSession,
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error creating refund:", error);
    return new NextResponse(
      JSON.stringify({
        message: error.message,
      }),
      { status: 500 }
    );
  }
};
