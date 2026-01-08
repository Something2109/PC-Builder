import { Roles, JwtPayload } from "@/utils/user";
import { createVerifier } from "fast-jwt";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const verify = createVerifier({ key: process.env.JWT_SECRET! });

export async function verifyToken(): Promise<JwtPayload | null> {
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
    const payload = verify(token);

    return payload?.sub as JwtPayload;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function ServerAuthRole({
  children,
  roles,
  redirect: pathname,
}: Readonly<{
  children: React.ReactNode;
  roles: Roles[];
  redirect?: string;
}>) {
  const user = await verifyToken();

  if (!user) redirect(`/auth/refresh?redirect=${pathname ?? "/"}`);

  if (!roles.includes(user.role))
    return <h1>You are not authorized to access this page</h1>;

  return children;
}
