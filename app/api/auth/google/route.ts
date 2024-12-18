import { login } from "@/app/actions/auth";
import { NextResponse } from "next/server";

// @desc Login user
// @route POST /api/auth/google
// @access Public
export const POST = async (request: Request) => {
  try {
    const { email, fullName, photoURL } = await request.json();

    await login({ email, fullName, image: photoURL });

    return new NextResponse(
      JSON.stringify({
        message: "Login successful",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error during login:", error);
    return new NextResponse(
      JSON.stringify({ message: error.message || "An error occurred." }),
      { status: 400 }
    );
  }
};
