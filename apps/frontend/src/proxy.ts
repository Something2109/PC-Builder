import type { NextRequest } from "next/server";

import { getBackendUrl } from "@pc-builder/shared";
import { Tokens } from "@pc-builder/shared/API";
import { NextResponse } from "next/server";

// Define paths that REQUIRE authentication
const PROTECTED_PATHS = ["/admin", "/profile", "/build/save"];

async function validateAccessToken(request: NextRequest) {
  const accessToken = request.cookies.get(Tokens.ACCESS);
  if (!accessToken) return false;

  try {
    const apiResponse = await fetch(getBackendUrl("/api/auth/me"), {
      method: "GET",
      headers: {
        Cookie: `${Tokens.ACCESS}=${accessToken.value}`,
      },
    });

    return apiResponse.ok;
  } catch (error) {
    console.error("Access token validation failed:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(Tokens.ACCESS);
  const refreshToken = request.cookies.get(Tokens.REFRESH);

  if (accessToken && (await validateAccessToken(request))) {
    return NextResponse.next();
  }

  if (refreshToken) {
    try {
      const apiResponse = await fetch(getBackendUrl("/api/auth/refresh"), {
        method: "POST",
        headers: { Cookie: request.headers.get("cookie") || "" },
      });

      if (apiResponse.ok) {
        let newAccessToken = "";
        const backendCookies = apiResponse.headers.getSetCookie();

        // Extract the new access token from the backend's Set-Cookie headers
        for (const cookieStr of backendCookies) {
          if (cookieStr.startsWith(`${Tokens.ACCESS}=`)) {
            const parts = cookieStr.split(";")[0].split("=");
            if (parts.length === 2) {
              const cookieValue = decodeURIComponent(parts[1]);
              if (cookieValue.startsWith("Bearer ")) {
                newAccessToken = cookieValue.substring("Bearer ".length);
              } else {
                newAccessToken = cookieValue;
              }
            }
            break;
          }
        }

        const requestHeaders = new Headers(request.headers);
        const originalCookies = request.headers.get("cookie") || "";
        const cookieList = originalCookies.split(";").map((c) => c.trim());
        // Remove old access token cookie from headers to prevent duplicates
        const otherCookies = cookieList.filter((c) => !c.startsWith(`${Tokens.ACCESS}=`));

        if (newAccessToken) {
          const updatedCookieHeader = [
            `${Tokens.ACCESS}=Bearer%20${newAccessToken}`,
            ...otherCookies,
          ]
            .filter(Boolean)
            .join("; ");
          requestHeaders.set("Cookie", updatedCookieHeader);
        }

        const response = NextResponse.next({
          request: { headers: requestHeaders },
        });

        // Set the new cookies back to the browser
        backendCookies.forEach((cookie) => response.headers.append("Set-Cookie", cookie));

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
