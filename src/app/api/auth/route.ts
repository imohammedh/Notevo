import { NextRequest, NextResponse } from "next/server";
import { fetchAction } from "convex/nextjs";
import { cookies, headers } from "next/headers";

function isLocalHost(host: string | null): boolean {
  if (!host) return false;
  return host === "localhost" || host.startsWith("localhost:") || host === "127.0.0.1" || host.startsWith("127.0.0.1:");
}

function getCookieName(prefix: string, isLocalhost: boolean): string {
  return isLocalhost ? prefix : `__Host-${prefix}`;
}

async function proxyAuth(request: NextRequest) {
  const cookieStore = await cookies();
  const headersList = await headers();
  const host = headersList.get("Host");
  const isLocalhost = isLocalHost(host);
  
  const tokenName = getCookieName("__convexAuthJWT", isLocalhost);
  const refreshTokenName = getCookieName("__convexAuthRefreshToken", isLocalhost);
  const verifierName = getCookieName("__convexAuthOAuthVerifier", isLocalhost);
  
  // Only handle POST requests for auth actions
  if (request.method !== "POST") {
    return new NextResponse("Method not allowed", { status: 405 });
  }

  try {
    const { action, args } = await request.json();
    
    if (action !== "auth:signIn" && action !== "auth:signOut") {
      return new NextResponse("Invalid action", { status: 400 });
    }

    let token: string | undefined;
    
    // Handle refresh token for sign in
    if (action === "auth:signIn" && args?.refreshToken !== undefined) {
      const refreshToken = cookieStore.get(refreshTokenName)?.value;
      if (!refreshToken) {
        return NextResponse.json({ tokens: null });
      }
      args.refreshToken = refreshToken;
    } else {
      // Get existing token for sign out or other operations
      token = cookieStore.get(tokenName)?.value;
    }

    // Call the Convex auth action
    const fetchActionAuthOptions = 
      action === "auth:signIn" && 
      (args?.refreshToken !== undefined || args?.params?.code !== undefined)
        ? {} // Don't require auth for refresh or code validation
        : { token };

    if (action === "auth:signIn") {
      let result;
      try {
        result = await fetchAction(
          "auth:signIn" as any,
          args,
          {
            url: process.env.NEXT_PUBLIC_CONVEX_URL,
            ...fetchActionAuthOptions,
          }
        );
      } catch (error) {
        console.error("Error while running `auth:signIn`:");
        console.error(error);
        const errorResponse = NextResponse.json(null);
        // Clear cookies on error
        const cookieOptions = {
          httpOnly: true,
          secure: !isLocalhost,
          sameSite: "lax" as const,
          path: "/",
        };
        errorResponse.cookies.set(tokenName, "", { ...cookieOptions, maxAge: 0, expires: new Date(0) });
        errorResponse.cookies.set(refreshTokenName, "", { ...cookieOptions, maxAge: 0, expires: new Date(0) });
        errorResponse.cookies.set(verifierName, "", { ...cookieOptions, maxAge: 0, expires: new Date(0) });
        return errorResponse;
      }

      const cookieOptions = {
        httpOnly: true,
        secure: !isLocalhost,
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      };

      // Handle redirect (OAuth flow)
      if (result.redirect !== undefined) {
        const response = NextResponse.json({ redirect: result.redirect });
        if (result.verifier) {
          response.cookies.set(verifierName, result.verifier, {
            ...cookieOptions,
            maxAge: undefined, // Verifier is temporary
          });
        }
        return response;
      }
      // Handle tokens (successful authentication)
      else if (result.tokens !== undefined) {
        const response = NextResponse.json({
          tokens: result.tokens !== null
            ? { token: result.tokens.token, refreshToken: "dummy" }
            : null,
        });
        
        if (result.tokens !== null) {
          if (result.tokens.token) {
            response.cookies.set(tokenName, result.tokens.token, cookieOptions);
          }
          if (result.tokens.refreshToken) {
            response.cookies.set(refreshTokenName, result.tokens.refreshToken, cookieOptions);
          }
        } else {
          // Clear cookies if tokens are null
          response.cookies.set(tokenName, "", { ...cookieOptions, maxAge: 0, expires: new Date(0) });
          response.cookies.set(refreshTokenName, "", { ...cookieOptions, maxAge: 0, expires: new Date(0) });
        }
        response.cookies.set(verifierName, "", { ...cookieOptions, maxAge: 0, expires: new Date(0) });
        return response;
      }
      // Fallback: return result as-is
      return NextResponse.json(result);
    } else {
      // Handle signOut
      try {
        await fetchAction(
          "auth:signOut" as any,
          args,
          {
            url: process.env.NEXT_PUBLIC_CONVEX_URL,
            token,
          }
        );
      } catch (error) {
        console.error("Error while running `auth:signOut`:");
        console.error(error);
      }
      
      // Always clear cookies on sign out
      const response = NextResponse.json(null);
      const cookieOptions = {
        httpOnly: true,
        secure: !isLocalhost,
        sameSite: "lax" as const,
        path: "/",
      };
      response.cookies.set(tokenName, "", { ...cookieOptions, maxAge: 0, expires: new Date(0) });
      response.cookies.set(refreshTokenName, "", { ...cookieOptions, maxAge: 0, expires: new Date(0) });
      response.cookies.set(verifierName, "", { ...cookieOptions, maxAge: 0, expires: new Date(0) });
      return response;
    }
  } catch (error) {
    console.error("Error in auth proxy:", error);
    const response = NextResponse.json(null);
    // Clear cookies on error
    const cookieOptions = {
      httpOnly: true,
      secure: !isLocalhost,
      sameSite: "lax" as const,
      path: "/",
    };
    response.cookies.set(tokenName, "", { ...cookieOptions, maxAge: 0, expires: new Date(0) });
    response.cookies.set(refreshTokenName, "", { ...cookieOptions, maxAge: 0, expires: new Date(0) });
    response.cookies.set(verifierName, "", { ...cookieOptions, maxAge: 0, expires: new Date(0) });
    return response;
  }
}

export async function GET(request: NextRequest) {
  // For OAuth callbacks, we might need to handle GET requests
  // But typically auth actions are POST, so redirect or return error
  return new NextResponse("Method not allowed", { status: 405 });
}

export async function POST(request: NextRequest) {
  return proxyAuth(request);
}

