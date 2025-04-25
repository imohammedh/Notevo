import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
 
const isPublicRoute = createRouteMatcher(["/signin", "/"]); // Include root route
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
 
export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isPublicRoute(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }
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
    "/api/:path*", // Match all API routes (adjust as needed)
    "/trpc/:path*", // Match all tRPC routes (adjust as needed)
  ],
};
