"use client";

import Part, { Information } from "@pc-builder/shared/part";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useRef, useActionState, useState } from "react";

import axiosInstance from "@/lib/axios";

export function useInfoAction(path: string, info: Information.Name, defaultValue: Part.DTO) {
  const router = useRouter();
  const label = useRef(Information.Label[info]);
  const [error, setError] = useState<string | null>(null);
  const [formValue, save, pending] = useActionState<
    Partial<Part.DTO[typeof info]> | null,
    Partial<Part.DTO[typeof info]> | null
  >(async (prev, raw) => {
    const operation = prev ? (raw ? "save" : "delete") : "add";

    setError(null);
    if (!confirm(`Are you sure you want to ${operation} ${label.current} info?`)) return prev;

    try {
      const targetPath = path.startsWith("/api") ? path.substring("/api".length) : path;
      const response = await axiosInstance.post<Part.DTO>(targetPath, { [info]: raw });

      alert(`Successfully ${operation} ${label.current} info.`);
      router.refresh();

      return response.data[info];
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data.message ?? "Cannot connect to server.";

      setError(message);
      return prev;
    }
  }, defaultValue[info]);

  return [formValue, save, pending, error, setError] as const;
}
