"use client";

import Part from "@pc-builder/shared/part";
import { AxiosError, AxiosRequestConfig } from "axios";
import { useActionState, useState } from "react";

import axiosInstance from "@/lib/axios";

function createPayload(formData: FormData | null) {
  const RequestPayload: Omit<AxiosRequestConfig, "url"> = {};

  if (formData) {
    const raw = Object.fromEntries(formData.entries()) as Record<string, string | undefined>;
    if (!raw.url) raw.url = undefined;
    if (!raw.image_url) raw.image_url = undefined;

    const data = Part.BasicInfo.omit({ id: true, part: true }).parse(raw);
    RequestPayload.method = "POST";
    RequestPayload.data = data;
  } else {
    RequestPayload.method = "DELETE";
  }

  return RequestPayload;
}

export default function usePartAction(path: string, defaultValue?: Part.DTO) {
  const [error, setError] = useState<string | null>(null);
  const [formValue, save, pending] = useActionState<Part.DTO | undefined, FormData | null>(
    async (prev, formData) => {
      let operation = "add";
      if (!prev) operation = formData ? "save" : "delete";

      const targetPath = path.startsWith("/api") ? path.substring("/api".length) : path;
      const RequestPayload = { ...createPayload(formData), url: targetPath };

      setError(null);
      if (!confirm(`Are you sure you want to ${operation} basic info?`)) return prev;

      try {
        const response = await axiosInstance.request<Part.BasicInfo>(RequestPayload);

        alert(`Successfully ${operation} part info.`);

        return response.data;
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const message = error.response?.data.message ?? "Cannot connect to server.";

        setError(message);
        return prev;
      }
    },
    defaultValue
  );

  return [formValue, save, pending, error, setError] as const;
}
