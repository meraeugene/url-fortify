import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    return new NextResponse(
      JSON.stringify({
        message: "scan limit",
      })
    );
  } catch (error: any) {
    console.error("Error during scan limit:", error);
    return new NextResponse(
      JSON.stringify({ message: error.message || "An error occurred." }),
      { status: 400 }
    );
  }
};
