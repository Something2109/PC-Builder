"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useTransition } from "react";

import axiosInstance from "@/lib/axios";

import { AuthContext } from "../components/provider/AuthContext";

const LoginPath = "/auth/login";

export function useRefreshAction(pathname?: string | null) {
  const [pending, startTransition] = useTransition();
  const context = useContext(AuthContext);
  const router = useRouter();
  const redirectPath = pathname ?? "/";

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await axiosInstance.post("/auth/refresh");
        context?.setUser(response.data);
        router.replace(redirectPath);
      } catch (err) {
        console.error(err);
        router.replace(`${LoginPath}?redirect=${redirectPath}`);
      }
    });
  }, [context, redirectPath, router]);

  return pending;
}
