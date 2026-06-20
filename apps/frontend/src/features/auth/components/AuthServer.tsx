import { cookies } from "next/headers";

import { Tokens } from "@pc-builder/shared/API";
import { getBackendUrl } from "@/utils/path";
import { JwtPayload } from "@pc-builder/shared/user";

export async function verifyToken(): Promise<JwtPayload | null> {
  const cookie = await cookies();
  const authCookie = cookie.get(Tokens.ACCESS);

  if (!authCookie) return null;

  try {
    const apiResponse = await fetch(getBackendUrl("/api/auth/me"), {
      method: "GET",
      headers: {
        Cookie: `${Tokens.ACCESS}=${authCookie.value}`,
      },
    });

    if (apiResponse.ok) {
      const data = (await apiResponse.json()) as { user: JwtPayload | null };
      return data.user;
    }
  } catch (err) {
    console.error("Token verification failed:", err);
  }

  return null;
}
