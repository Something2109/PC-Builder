"use client";

import { useRefreshToken } from "@/components/auth";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RefreshPage() {
  const param = useSearchParams();
  const refresh = useRefreshToken(param.get("redirect"));

  useEffect(() => {
    refresh();
  }, []);

  return <h1>Login In</h1>;
}
