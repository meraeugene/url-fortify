import { createCheckoutSession } from "@/app/actions/checkout";
import { NextResponse } from "next/server";

// @desc Create a checkout
// @route POST /api/checkout
// @access Private
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const {
      amount,
      description,
      name,
      planId,
      userId,
      email,
      fullName,
      invoiceNumber,
    } = body;

    const checkoutSession = await createCheckoutSession({
      amount,
      description,
      name,
      planId,
      userId,
      email,
      fullName,
      invoiceNumber,
    });

    const checkoutUrl = checkoutSession?.data?.attributes?.checkout_url;

    return new NextResponse(
      JSON.stringify({ checkout_url: checkoutUrl, checkoutSession }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error processing checkout:", error);
    return new NextResponse(
      JSON.stringify({
        message: error.message,
      }),
      { status: 500 }
    );
  }
};
