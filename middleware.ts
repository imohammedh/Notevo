import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicRoute = createRouteMatcher(["/signin", "/"]); // Include root route
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const url = request.nextUrl.pathname; // Get the pathname from NextUrl
  console.log(`Middleware running for: ${url}`);

  if (isPublicRoute(request) && (await convexAuth.isAuthenticated())) {
    console.log(`User is authenticated, redirecting from public route ${url} to /dashboard`);
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    console.log(`User is not authenticated, redirecting from protected route ${url} to /signin`);
    return nextjsMiddlewareRedirect(request, "/signin");
  }

  console.log(`No redirect required for ${url}`); // If no redirect occurred
  return; // Explicitly return undefined for no-op middleware
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
    // "/api/:path*", // Remove or adjust based on Convex requirements
    // "/trpc/:path*", // Remove or adjust based on Convex requirements
  ],
};
