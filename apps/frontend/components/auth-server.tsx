import { Tokens } from "@/utils/API";
import { JwtPayload } from "@/utils/user";
import { cookies } from "next/headers";

export async function verifyToken(): Promise<JwtPayload | null> {
  const cookie = await cookies();
  const authCookie = cookie.get(Tokens.ACCESS);

  if (!authCookie) return null;

  try {
    const apiResponse = await fetch(
      `${process.env.BACKEND_HOST}/api/auth/me`,
      {
        method: "GET",
        headers: {
          Cookie: `${Tokens.ACCESS}=${authCookie.value}`,
        },
      }
    );

    if (apiResponse.ok) {
      return await apiResponse.json();
    }
  } catch (err) {
    console.error("Token verification failed:", err);
  }

  return null;
}
