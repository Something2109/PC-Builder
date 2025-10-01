"use client";

import { useRefreshAction } from "@/components/auth";
import { useSearchParams } from "next/navigation";

export default function RefreshPage() {
  const param = useSearchParams();
  const pending = useRefreshAction(param.get("redirect"));

  if (!pending) return <h1>Failed to login</h1>;

  return <h1>Login In</h1>;
}
