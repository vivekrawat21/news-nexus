import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes (accessible without login)
const isPublicRoute = createRouteMatcher([
  "/sign-in",// Public route for signing in
  "/sign-up", // Public route for signing up
]);

// Routes that should only be accessible to logged-in users
const protectedRoutes = [
  "/news-analytics",
  "/payout",
];

// Middleware function
export default clerkMiddleware(async (auth, req) => {
  const user = await auth();
  
  const currentUrl = new URL(req.url);
  console.log("Request URL:", currentUrl.pathname); // Log the URL for debugging

  // Check if the current route is a public route
  const isPublic = isPublicRoute(req);

  // If the user is not logged in and trying to access a protected route, redirect to /sign-in
  if (!user.userId && protectedRoutes.includes(currentUrl.pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // If the user is logged in and trying to access a public route, redirect to /dashboard
  if (user.userId && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user is logged in but trying to access a non-specified route, redirect to /dashboard
 

  // Allow access to the route
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except static assets and API routes
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
