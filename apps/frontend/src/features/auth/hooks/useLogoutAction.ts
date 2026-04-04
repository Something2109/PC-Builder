"use client";
import { useContext, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axios";
import { AuthContext } from "../components/AuthContext";

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
        alert(typeof error.response?.data === 'string' ? error.response.data : "Cannot connect to server.");
      }
    });

  return [pending, logout] as const;
}
