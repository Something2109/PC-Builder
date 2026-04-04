import { verifyToken } from "@/features/auth/server";
import { LoginForm } from "@/features/auth";
import { redirect } from "next/navigation";

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
