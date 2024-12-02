import { verifyGuessSession, verifySession } from "@/lib/dal";
import { connect } from "@/lib/db";
import {
  handleGuestUserScanLimit,
  handleAuthenticatedUserScanLimit,
} from "@/helpers/scanLimitHelpers";
import { NextResponse } from "next/server";
import URLScanRecord from "@/lib/models/urlScanRecordModel";

export const POST = async (request: Request) => {
  try {
    await connect();

    const body = await request.json();
    const { captureStatus, reportStatus } = body;

    // Verify the guest session details
    const guessSession = await verifyGuessSession();

    // Check if there is an existing URL scan record for the guest user
    const urlScanRecord = await URLScanRecord.findOne({
      userId: guessSession.userId,
    });

    // Verify the authenticated user session
    const session = await verifySession();

    // If the user is authenticated and both capture and report statuses are successful (200),
    // handle the scan limit logic for authenticated users
    if (
      session.isAuth &&
      session.userId &&
      captureStatus === 200 &&
      reportStatus === 200
    ) {
      // Handle scan limit for authenticated users
      return await handleAuthenticatedUserScanLimit(session);
    }

    // If the user is a guest and the statuses are successful (200),
    // handle the scan limit logic for guest users
    if (
      guessSession.userId.startsWith("guest-") &&
      guessSession.role === "guest" &&
      captureStatus === 200 &&
      reportStatus === 200
    ) {
      // Handle scan limit for guest users
      return await handleGuestUserScanLimit(urlScanRecord, guessSession);
    }

    // If neither authenticated nor guest conditions are met, return unauthorized response
    return new NextResponse(
      JSON.stringify({ message: "Unauthorized request." }),
      { status: 403 }
    );
  } catch (error: any) {
    console.error("Error during scan limit:", error);
    return new NextResponse(
      JSON.stringify({ message: error.message || "An error occurred." }),
      { status: 400 }
    );
  }
};
