import { connect } from "@/lib/db";
import generateJWTToken from "@/lib/generateJWTToken";
import PricingPlan from "@/lib/models/pricingPlanModel";
import User from "@/lib/models/userModel";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    return new NextResponse("Google auth route", { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching users" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  const body = await request.json();
  const { email, fullName, image } = body;

  console.log(email);
  console.log(fullName);
  console.log(image);

  if (!email || !fullName || !image) {
    return new NextResponse("Missing required fields.", {
      status: 400,
    });
  }

  try {
    await connect();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        fullName,
        email,
        image,
        isAdmin: false,
        remindStatus: false,
      });

      await user.save();
    }

    // generateJWTToken(response, user._id);

    const { _id, role } = user;

    return new NextResponse(
      JSON.stringify({
        message: "User is updated",
        data: {
          _id,
          role,
        },
        redirectUrl: "/",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return new NextResponse(
      "Error occured while processing the request" + error.message,
      {
        status: 500,
      }
    );
  }
};
