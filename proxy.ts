import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that REQUIRE authentication
const PROTECTED_PATHS = ["/admin", "/profile", "/build/save"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("Access_Token");
  if (accessToken) return NextResponse.next();

  const refreshToken = request.cookies.get("Refresh_Token");
  if (refreshToken) {
    try {
      const apiResponse = await fetch(
        `${process.env.BACKEND_HOST}/api/auth/refresh`,
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
          `Access_Token=Bearer ${newAccessToken}; ${request.headers.get(
            "cookie"
          )}`
        );

        const response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
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
