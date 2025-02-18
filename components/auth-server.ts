import { User } from "@/utils/interface/user/User";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyToken(): Promise<User.JwtPayload | null> {
  const cookie = await cookies();
  const raw = cookie.get("Authorization");

  if (!raw) return null;

  const regexMatch = raw.value.match(
    /(Bearer) ([A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*)/
  );

  if (!regexMatch) return null;

  const [_, bearer, token] = regexMatch;

  if (bearer !== "Bearer") return null;

  try {
    return verify(token, process.env.JWT_SECRET!) as User.JwtPayload;
  } catch (err) {
    console.error(err);
    return null;
  }
}
