import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/"]);

export default clerkMiddleware((auth, req, evt) => {
  const { userId, redirectToSignIn } = auth();

  // Redirect unauthenticated users trying to access the home page
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({returnBackUrl: "/"});
  }

  // Allow access for authenticated users
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
