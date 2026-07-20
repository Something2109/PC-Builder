"use client";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useContext, useTransition } from "react";

import axiosInstance from "@/lib/axios";

import { AuthContext } from "../components/provider/AuthContext";

const LoginPath = "/auth/login";

export function useLogoutAction() {
  const [pending, startTransition] = useTransition();
  const context = useContext(AuthContext);
  const router = useRouter();

  const logout = () =>
    startTransition(async () => {
      try {
        await axiosInstance.post("/auth/logout");
        context?.setUser(null);
        router.push(LoginPath);
      } catch (err) {
        const error = err as AxiosError;
        console.error(err);
        alert(
          typeof error.response?.data === "string"
            ? error.response.data
            : "Cannot connect to server."
        );
      }
    });

  return [pending, logout] as const;
}
