import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
 
const isSignInPage = createRouteMatcher(["/signup","/"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
 
export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const authenticated = await convexAuth.isAuthenticated();

    if (isSignInPage(request) && authenticated) {
      return nextjsMiddlewareRedirect(request, "/dashboard");
    }
    if (isProtectedRoute(request) && !authenticated) {
      return nextjsMiddlewareRedirect(request, "/");
    }
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 30 } },
);
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
