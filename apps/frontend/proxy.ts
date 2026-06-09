import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { getBackendUrl } from "./src/utils/path";
import { Tokens } from "@/utils/API";

// Define paths that REQUIRE authentication
const PROTECTED_PATHS = ["/admin", "/profile", "/build/save"];

async function validateAccessToken(request: NextRequest) {
  const accessToken = request.cookies.get(Tokens.ACCESS);
  if (!accessToken) return false;

  try {
    const apiResponse = await fetch(
      getBackendUrl("/api/auth/me"),
      {
        method: "GET",
        headers: {
          Cookie: `${Tokens.ACCESS}=${accessToken.value}`,
        },
      }
    );

    return apiResponse.ok;
  } catch (error) {
    console.error("Access token validation failed:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(Tokens.ACCESS);
  const refreshToken = request.cookies.get(Tokens.REFRESH);

  if (accessToken && (await validateAccessToken(request))) {
    return NextResponse.next();
  }

  if (refreshToken) {
    try {
      const apiResponse = await fetch(
        getBackendUrl("/api/auth/refresh"),
        {
          method: "POST",
          headers: { Cookie: request.headers.get("cookie") || "" },
        }
      );

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        const newAccessToken = data.access_token;

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set(
          "Cookie",
          `${Tokens.ACCESS}=Bearer ${newAccessToken}; ${request.headers.get(
            "cookie"
          )}`
        );

        const response = NextResponse.next({
          request: { headers: requestHeaders },
        });

        const backendCookies = apiResponse.headers.getSetCookie();
        backendCookies.forEach((cookie) =>
          response.headers.append("Set-Cookie", cookie)
        );

        return response;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  }

  // 4. Final Fallback: If refresh failed and route is protected, login
  if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
