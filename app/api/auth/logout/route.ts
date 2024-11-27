import { logout } from "@/app/actions/auth";
import { NextResponse } from "next/server";

// @desc Logout user
// @route POST /api/auth/logout
// @access Private
export const POST = async () => {
  try {
    await logout();

    return new NextResponse(
      JSON.stringify({
        message: "Logout successfully",
        redirectURL: "/",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error during logout:", error);
    return new NextResponse(
      JSON.stringify({ message: error.message || "An error occurred." }),
      { status: 400 }
    );
  }
};
