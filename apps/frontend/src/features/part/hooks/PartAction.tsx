"use client";

import Part from "@pc-builder/shared/part";
import { AxiosError, AxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import axiosInstance from "@/lib/axios";

function createPayload(formData: FormData | null) {
  const RequestPayload: Omit<AxiosRequestConfig, "url"> = {};

  if (formData) {
    const raw = Object.fromEntries(formData.entries()) as Record<string, string | undefined>;
    if (!raw.url) raw.url = undefined;
    if (!raw.image_url) raw.image_url = undefined;

    const data = Part.DTO.parse(raw);
    RequestPayload.method = "POST";
    RequestPayload.data = data;
  } else {
    RequestPayload.method = "DELETE";
  }

  return RequestPayload;
}

export default function usePartAction(path: string, defaultValue?: Part.DTO) {
  const router = useRouter();
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

        if (operation === "delete") {
          const partCategory = prev?.part || targetPath.split("/")[2];
          router.push(`/part/${partCategory}`);
        } else {
          router.refresh();

          const newSlug = response.data.slug;
          const partCategory = response.data.part;
          const currentPath = window.location.pathname;
          const expectedEditPath = `/part/${partCategory}/${newSlug}/edit`;

          if (operation === "add") {
            router.push(expectedEditPath);
          } else if (currentPath.endsWith("/edit") && currentPath !== expectedEditPath) {
            router.replace(expectedEditPath);
          }
        }

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
