"use client";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useActionState, useContext, useState } from "react";

import axiosInstance from "@/lib/axios";

import { AuthContext } from "../components/provider/AuthContext";

type LoginError = {
  message?: string;
  username?: string;
  password?: string;
};

export function useLoginAction(pathname?: string) {
  const router = useRouter();
  const context = useContext(AuthContext);
  const [error, setError] = useState<LoginError>({});
  const [state, formAction, pending] = useActionState(
    async (_: Record<string, string>, form: FormData) => {
      const body = Object.fromEntries(form.entries());

      try {
        const response = await axiosInstance.post("/auth/login", body);
        context?.setUser(response.data);
        router.push(pathname ?? "/");
      } catch (err) {
        const error = err as AxiosError;
        console.error(err);

        const LoginError = error.response
          ? (error.response.data as LoginError)
          : { message: "Cannot connect to server." };
        setError(LoginError);
      }

      return body as Record<string, string>;
    },
    {}
  );

  return [state, formAction, pending, error, setError] as const;
}
