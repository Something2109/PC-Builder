import { Tokens } from "@/utils/API";
import { JwtPayload } from "@/utils/user";
import { createVerifier } from "fast-jwt";
import { cookies } from "next/headers";

const verify = createVerifier({ key: process.env.JWT_SECRET! });

export async function verifyToken(): Promise<JwtPayload | null> {
  const cookie = await cookies();
  const raw = cookie.get(Tokens.ACCESS);

  if (!raw) return null;

  const regexMatch = raw.value.match(
    /(Bearer) ([A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*)/
  );

  if (!regexMatch) return null;

  const [_, bearer, token] = regexMatch;

  if (bearer !== "Bearer") return null;

  try {
    const payload = verify(token);

    return payload?.sub as JwtPayload;
  } catch (err) {
    console.error(err);
    return null;
  }
}
