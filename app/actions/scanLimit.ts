import SubscriptionPlan from "@/lib/models/subscriptionPlanModel";
import URLScanRecord, { IURLScanRecord } from "@/lib/models/urlScanRecordModel";
import User from "@/lib/models/userModel";
import { GuestSession, Session } from "@/types";
import { NextResponse } from "next/server";

// Helper function to handle the guest user scan limit
export const handleGuestUserScanLimit = async (
  urlScanRecord: IURLScanRecord,
  guessSession: GuestSession
) => {
  // If no URL scan record exists for the guest user, create one with an initial scan count of 1
  if (!urlScanRecord) {
    urlScanRecord = new URLScanRecord({
      userId: guessSession.userId,
      maxLookupsUsed: 1, // Start with 1 scan
      lastURLScanDate: new Date(), // Set the last scan date to the current date
    });
  } else {
    // If a record already exists, increment the scan count by 1 and update the last scan date
    urlScanRecord.maxLookupsUsed += 1;
    urlScanRecord.lastURLScanDate = new Date(); // Update the last scan date to now
  }

  // Get the current month and year
  const currentMonth = new Date().getMonth(); // 0-based (0 = January)
  const currentYear = new Date().getFullYear();

  // Get the month and year from the last scan date
  const lastURLScanMonth = urlScanRecord.lastURLScanDate.getMonth();
  const lastURLScanYear = urlScanRecord.lastURLScanDate.getFullYear();

  // If the last scan was in a different month or year, reset the total scan count for the new month
  if (currentMonth !== lastURLScanMonth || currentYear !== lastURLScanYear) {
    urlScanRecord.maxLookupsUsed = 0;
    urlScanRecord.lastURLScanDate = new Date();
  }

  // Check if the guest has exceeded the scan limit (5 scans per month)
  // Greater than only because the total url scans starts from 1
  if (urlScanRecord.maxLookupsUsed > urlScanRecord.maxLookups) {
    // Return an error message if the limit is exceeded
    return new NextResponse(
      JSON.stringify({
        message:
          "You have reached your 5 url-scans limit for this month. Log in to unlock 10 url-scans per month and access additional features.",
      }),
      { status: 403 }
    );
  }

  // Calculate the number of remaining scans for the current month
  const remainingScans =
    urlScanRecord.maxLookups - urlScanRecord.maxLookupsUsed;

  // Save the updated URL scan record
  await urlScanRecord.save();

  // Return a success message with the number of remaining scans
  return new NextResponse(
    JSON.stringify({
      message: `You have ${remainingScans} url-scans left this month. Log in to unlock 10 url-scans per month and access additional features.`,
    })
  );
};

// Helper function to handle the authenticated user scan limit
export const handleAuthenticatedUserScanLimit = async (session: Session) => {
  // Fetch the user from the database using the userId from the session
  let user = await User.findById(session.userId).populate({
    path: "subscription.currentPlan",
    model: SubscriptionPlan,
  });

  // If the user does not exist, return a 404 response with an appropriate error message
  if (!user) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  // Get the current month and year
  const currentMonth = new Date().getMonth(); // 0-based (0 = January)
  const currentYear = new Date().getFullYear();

  // Get the month and year from the last scan date
  const lastScanMonth = new Date(user.usageStats.lastURLScanDate).getMonth();
  const lastScanYear = new Date(user.usageStats.lastURLScanDate).getFullYear();

  // If the last scan was in a different month or year, reset the total scan count for the new month
  if (currentMonth !== lastScanMonth || currentYear !== lastScanYear) {
    user.usageStats.maxLookupsUsed = 0;
    user.usageStats.lastURLScanDate = new Date(); // Update the last scan date
  }

  // Check if the user has a subscription and a valid current plan
  if (user.subscription && user.subscription.currentPlan) {
    const { maxLookupsUsed } = user.usageStats;
    const { maxLookups } = user.subscription.currentPlan;

    // If the user has exceeded their maxLookups, return an error response
    // Greater than or equal because it starts from 0 maxLookups  used by user
    if (maxLookupsUsed >= maxLookups) {
      const planName = user.subscription.currentPlan.title;
      const maxLookups = user.subscription.currentPlan.maxLookups;

      return new NextResponse(
        JSON.stringify({
          message: `You have used all ${maxLookups} URL scans included in your ${planName} plan. Upgrade your plan or wait until next month for a reset.`,
        }),
        { status: 403 }
      );
    }

    // Increment the usage count for monthly lookups by 1
    user.usageStats.maxLookupsUsed += 1;
    user.usageStats.lastURLScanDate = new Date();

    // Save the updated user data to the database
    await user.save();
  }

  // Return a successful response indicating the scan has been recorded
  return new NextResponse(
    JSON.stringify({
      message: "The website has been successfully analyzed.",
    }),
    { status: 200 }
  );
};
