"use client";

import Part, { Information } from "@/utils/part";
import { useRef, useActionState, useState } from "react";
import axios, { AxiosError } from "axios";

export function useInfoAction(
  path: string,
  info: Information.Name,
  defaultValue: Part.DTO
) {
  const label = useRef(Information.Label[info]);
  const [error, setError] = useState<string | null>(null);
  const [formValue, save, pending] = useActionState<
    Partial<Part.DTO[typeof info]> | null,
    Partial<Part.DTO[typeof info]> | null
  >(async (prev, raw) => {
    const operation = prev ? (raw ? "save" : "delete") : "add";

    setError(null);
    if (
      !confirm(`Are you sure you want to ${operation} ${label.current} info?`)
    )
      return prev;

    try {
      const response = await axios.post<Part.DTO>(
        path,
        { [info]: raw },
        { withCredentials: true }
      );

      alert(`Successfully ${operation} ${label.current} info.`);

      return response.data[info];
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message =
        error.response?.data.message ?? "Cannot connect to server.";

      setError(message);
      return prev;
    }
  }, defaultValue[info]);

  return [formValue, save, pending, error, setError] as const;
}
