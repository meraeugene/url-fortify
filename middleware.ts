import { NextRequest, NextResponse } from "next/server";
import { createGuessSession, decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Specify protected and public routes
const protectedRoutes = [
  "/account/overview",
  "/account/profile",
  "/account/usage",
  "/purchase/offer/[offer]",
];
const protectedAPIRoutes = ["/api/user"];
const dynamicProtectedRoutes = [/^\/purchase\/offer\/[^\/]+$/]; // Regex for dynamic routes
// const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if the current route matches a protected or public route
  const isProtectedRoute =
    protectedRoutes.includes(path) ||
    dynamicProtectedRoutes.some((regex) => regex.test(path));
  const isProtectedAPIRoute = protectedAPIRoutes.includes(path);

  // const isPublicRoute = publicRoutes.includes(path);

  // Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // Decrypt the guess session from the cookie
  const guessCookie = (await cookies()).get("guessSession")?.value;
  const guessSession = await decrypt(guessCookie);

  // If the session and guess session does not exist, create one for guest users (only regenerate id if session is expired)
  if (!session && !guessSession) {
    await createGuessSession(`guest-${uuidv4()}`, "guest");
  }

  if (isProtectedRoute && !session?.userId) {
    // Redirect to / if the user is not authenticated for a protected route
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Protect API routes
  if (isProtectedAPIRoute && !session?.userId) {
    return NextResponse.json(
      { message: "Not authorized, token failed" },
      { status: 401 }
    );
  }

  // Redirect to / if the user is authenticated but trying to access a public route (optional if u have log in / signup page)
  // if (
  //   isPublicRoute &&
  //   session?.userId &&
  //   !req.nextUrl.pathname.startsWith("/")
  // ) {
  //   return NextResponse.redirect(new URL("/", req.nextUrl));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)", "/api/:path"],
};
