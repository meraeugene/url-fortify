import SubscriptionPlan from "@/lib/models/subscriptionPlanModel";
import URLScanRecord, {
  URLScanRecordType,
} from "@/lib/models/urlScanRecordModel";
import User from "@/lib/models/userModel";
import { GuestSession, Session } from "@/types";
import { NextResponse } from "next/server";

// Helper function to handle the guest user scan limit
export const handleGuestUserScanLimit = async (
  urlScanRecord: URLScanRecordType,
  guessSession: GuestSession
) => {
  // If no URL scan record exists for the guest user, create one with an initial scan count of 1
  if (!urlScanRecord) {
    urlScanRecord = new URLScanRecord({
      userId: guessSession.userId,
      totalURLScans: 1, // Start with 1 scan
      lastURLScanDate: new Date(), // Set the last scan date to the current date
    });
  } else {
    // If a record already exists, increment the scan count by 1 and update the last scan date
    urlScanRecord.totalURLScans += 1;
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
    urlScanRecord.totalURLScans = 0;
    urlScanRecord.lastURLScanDate = new Date();
  }

  // Check if the guest has exceeded the scan limit (5 scans per month)
  // Greater than only because the total url scans starts from 1
  if (urlScanRecord.totalURLScans > urlScanRecord.URLScanLimitPerMonth) {
    // Return an error message if the limit is exceeded
    return new NextResponse(
      JSON.stringify({
        message:
          "You have reached your 5 url-scans limit for this month. Log in to unlock 10 url-scans per month.",
      }),
      { status: 403 }
    );
  }

  // Calculate the number of remaining scans for the current month
  const remainingScans =
    urlScanRecord.URLScanLimitPerMonth - urlScanRecord.totalURLScans;

  // Save the updated URL scan record
  await urlScanRecord.save();

  // Return a success message with the number of remaining scans
  return new NextResponse(
    JSON.stringify({
      message: `You have ${remainingScans} url-scans left this month. Log in to unlock 10 url-scans per month.`,
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

  // Check if the user has a subscription and a valid current plan
  if (user.subscription && user.subscription.currentPlan) {
    const { monthlyLookupsUsed, lastResetDate } = user.usageStats;
    const { monthlyLookups } = user.subscription.currentPlan;

    const currentMonth = new Date().getMonth(); // 0-based (0 = January)
    const currentYear = new Date().getFullYear();

    // Get the month and year of the last reset date
    const lastResetMonth = new Date(lastResetDate).getMonth();
    const lastResetYear = new Date(lastResetDate).getFullYear();

    // If it's a new month or year, reset the usage stats
    if (currentMonth !== lastResetMonth || currentYear !== lastResetYear) {
      user.usageStats.monthlyLookupsUsed = 0;
      user.usageStats.lastResetDate = new Date(); // Update the reset date
    }

    // If the user has exceeded their monthly limit, return an error response
    // Greater than or equal because it starts from 0 monthly look up used by user
    if (monthlyLookupsUsed >= monthlyLookups) {
      return new NextResponse(
        JSON.stringify({
          message:
            "You have used all your monthly URL scans for the free plan. Upgrade your plan to get more scans this month.",
        }),
        { status: 403 }
      );
    }

    // Increment the usage count for monthly lookups by 1
    user.usageStats.monthlyLookupsUsed += 1;

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
