import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { cache } from "react";
import User from "@/lib/models/userModel";
import { connect } from "@/lib/db";
import SubscriptionPlan from "./models/subscriptionPlanModel";

export const verifySession = cache(async () => {
  // Retrieve the 'session' cookie from the request headers
  const cookie = (await cookies()).get("session")?.value;

  // If the cookie is not present, return a default session object
  if (!cookie) {
    return { isAuth: false, userId: "" }; // Not authenticated
  }

  // Decrypt the cookie to extract session details
  const session = await decrypt(cookie);

  // Return a session object with validated fields
  return {
    // Check if session.userId is a string
    isAuth: Boolean(session && session.userId), // Ensure isAuth is a boolean
    // Ensure userId is a string or default to an empty string
    userId: typeof session?.userId === "string" ? session.userId : "",
  };
});

export const verifyGuessSession = cache(async () => {
  // Retrieve the 'session' cookie from the request headers
  const cookie = (await cookies()).get("guessSession")?.value;

  // If the cookie is not present, return a default session object
  if (!cookie) {
    return { isAuth: false, userId: "", role: "" }; // Not authenticated
  }

  // Decrypt the cookie to extract session details
  const session = await decrypt(cookie);

  // Return a session object with validated fields
  return {
    isAuth: false,
    role: session && session.role,
    // Ensure userId is a string or default to an empty string
    userId: typeof session?.userId === "string" ? session.userId : "",
  };
});

export const getUser = cache(async () => {
  try {
    // Verify user session for authentication
    const session = await verifySession();

    if (!session.isAuth || !session.userId) {
      // Return null if the user is not authenticated
      return null;
    }

    // Establish database connection
    await connect();

    // Fetch user from the database and populate their subscription plan
    const user = await User.findById(session.userId);

    if (!user) {
      // Return null if no user found
      return null;
    }

    return user;
  } catch (error: any) {
    // Log the error to identify issues
    console.error("Failed to fetch user:", error.message);

    // Return null in case of any unexpected error
    return null;
  }
});
