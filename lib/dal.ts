import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { cache } from "react";
import User from "@/lib/models/userModel";
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";

export const verifySession = cache(async () => {
  // Retrieve the 'session' cookie from the request headers
  const cookie = (await cookies()).get("session")?.value;

  // If the cookie is not present, return a default session object
  if (!cookie) {
    return { isAuth: false, userId: "", role: "" }; // Not authenticated
  }

  // Decrypt the cookie to extract session details
  const session = await decrypt(cookie);

  // Return a session object with validated fields
  return {
    isAuth: !!session, // Check if the session exists and is valid
    userId: typeof session?.userId === "string" ? session.userId : "", // Ensure userId is a string or default to an empty string
  };
});

export const getUser = cache(async () => {
  const session = await verifySession();

  // Throw an error if the user is not authenticated
  if (!session.isAuth || !session.userId) {
    return null;
  }

  try {
    await connect();

    const user = await User.findById(session.userId);

    return { user: user };
  } catch (error: any) {
    console.error("Failed to fetch user", error);
  }
});
