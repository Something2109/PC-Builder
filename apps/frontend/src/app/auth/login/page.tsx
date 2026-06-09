import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth";
import { verifyToken } from "@/features/auth/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: pathname } = await searchParams;

  const user = await verifyToken();

  if (user) redirect(pathname ?? "/");

  return <LoginForm pathname={pathname} />;
}
