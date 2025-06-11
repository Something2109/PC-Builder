"use client";

import Part from "@/utils/interface/part";
import { Products } from "@/utils/Enum";
import { useActionState, useState } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

function createPayload(formData: FormData | null) {
  const RequestPayload: Omit<AxiosRequestConfig, "url"> = {
    withCredentials: true,
  };

  if (formData) {
    const raw = Object.fromEntries(formData.entries()) as any;
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
  const [formValue, save, pending] = useActionState<
    Part.DTO | undefined,
    FormData | null
  >(async (prev, formData) => {
    const operation = prev ? (formData ? "save" : "delete") : "add";
    const RequestPayload = { ...createPayload(formData), url: path };

    setError(null);
    if (!confirm(`Are you sure you want to ${operation} basic info?`))
      return prev;

    try {
      const response = await axios.request<Part.BasicInfo>(RequestPayload);

      alert(`Successfully ${operation} part info.`);

      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message =
        error.response?.data.message ?? "Cannot connect to server.";

      setError(message);
      return prev;
    }
  }, defaultValue);

  return [formValue, save, pending, error, setError] as const;
}
