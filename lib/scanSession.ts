import "server-only";

import { cookies } from "next/headers";
import { encrypt } from "./session";

// Default scan limit for anonymous users
const DEFAULT_SCAN_LIMIT = parseInt(process.env.DEFAULT_SCAN_LIMIT || "10", 10);
const DEFAULT_SCANS_TODAY = parseInt(
  process.env.DEFAULT_SCANS_TODAY || "0",
  10
);

// Type for the session payload
export interface ScanSessionPayload {
  userId: string;
  scansToday: number;
  lastScanDate: string;
  scanLimit: number;
  expiresAt: string;
}

// Function to create a scan limit session for the user
export async function createScanLimitSession(
  userId: string,
  isAuthenticated: boolean,
  subscriptionPlan: { monthlyLookups: number } | null = null
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Default values for anonymous users
  let scansToday = DEFAULT_SCANS_TODAY;
  let scanLimit = DEFAULT_SCAN_LIMIT;

  if (isAuthenticated && subscriptionPlan) {
    // If authenticated and subscription plan exists, use the subscription's scan limit
    scanLimit = subscriptionPlan.monthlyLookups;
  }

  // Create the payload for the session
  const payload: ScanSessionPayload = {
    userId,
    scansToday,
    lastScanDate: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
    scanLimit,
    expiresAt: expiresAt.toISOString(),
  };

  // Encrypt the session payload
  const session = await encrypt(payload);

  // Store the session in cookies
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}
