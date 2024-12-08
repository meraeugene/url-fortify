import { refundUserSubscription } from "@/app/actions/refundUserSubscription";
import { updateUserSubscription } from "@/app/actions/updateUserSubscription";
import { NextResponse } from "next/server";

export const GET = async () => {
  return new NextResponse("webhoooks paymongo");
};

export const POST = async (req: Request) => {
  try {
    const payload = await req.json();

    const { type, data } = payload?.data?.attributes || {};
    const { id: paymentId } = data;

    const {
      status,
      metadata,
      source,
      amount,
      paid_at: paidAt,
    } = data?.attributes || {};

    const { type: paymentMethod } = source || {};

    const {
      plan_id: planId,
      user_id: userId,
      invoice_number: invoiceNumber,
      payment_mongo_id: paymentMongoId,
    } = metadata || {};

    if (type === "payment.paid" && status === "paid") {
      const result = await updateUserSubscription(
        userId,
        planId,
        paymentId,
        paymentMethod,
        invoiceNumber,
        paidAt,
        amount,
        status
      );
      return result;
    }

    if (type === "payment.refund.updated" && status === "succeeded") {
      const result = await refundUserSubscription(userId, paymentMongoId);
      return result;
    }

    return NextResponse.json({ success: true, message: "No action required" });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
